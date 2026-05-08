import { NextRequest } from "next/server"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { findById, deriveStatus, upsert, type LicenseRecord } from "@/lib/license-store"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
// Always run dynamic — never cache validation results.
export const dynamic = "force-dynamic"

interface ValidateBody {
  licenseId?: string
  // Optional fields the client may send. We accept and ignore extras so the
  // server stays compatible if the client adds more telemetry later.
  licenseKey?: string
  hardwareFingerprint?: string
  currentVersion?: string
  callerIp?: string
}

interface ValidateResponse {
  valid: boolean
  revoked: boolean
  expiresAt?: string
  updatedFeatures?: string[]
  message?: string
}

// Defense-in-depth JWT signature check. Public key is provided as the literal
// PEM, with `\n` newlines escaped (Vercel env vars are single-line). The
// registry lookup that follows is the authoritative revocation check.
const PUBLIC_KEY = process.env.LICENSE_PUBLIC_KEY?.replace(/\\n/g, "\n")

let warnedNoKey = false
function warnPublicKeyMissingOnce(): void {
  if (warnedNoKey) return
  warnedNoKey = true
  console.warn(
    "[validate] LICENSE_PUBLIC_KEY not set — JWT signature verification disabled. " +
      "Registry lookup still applies. Set LICENSE_PUBLIC_KEY for defense-in-depth.",
  )
}

const LICENSE_ID_RE = /^[A-Za-z0-9_-]+$/

function jsonResponse(body: unknown, status: number, extraHeaders?: Record<string, string>) {
  return Response.json(body, { status, headers: extraHeaders })
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(req, "license-validate", 10, 60_000)
  if (!rl.ok) {
    return jsonResponse(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      429,
      { "Retry-After": String(rl.retryAfter) },
    )
  }

  let body: ValidateBody
  try {
    body = (await req.json()) as ValidateBody
  } catch {
    return Response.json(
      { valid: false, revoked: false, message: "Invalid JSON body" },
      { status: 400 },
    )
  }

  // ---- Input validation -------------------------------------------------
  const licenseId = body.licenseId?.trim()
  if (!licenseId) {
    return Response.json(
      { valid: false, revoked: false, message: "licenseId is required" } satisfies ValidateResponse,
      { status: 400 },
    )
  }
  if (typeof licenseId !== "string" || licenseId.length > 100 || !LICENSE_ID_RE.test(licenseId)) {
    return Response.json(
      {
        valid: false,
        revoked: false,
        message: "licenseId must be a non-empty string up to 100 chars matching ^[A-Za-z0-9_-]+$",
      } satisfies ValidateResponse,
      { status: 400 },
    )
  }
  if (body.licenseKey !== undefined) {
    if (typeof body.licenseKey !== "string" || body.licenseKey.length > 10_000) {
      return Response.json(
        { valid: false, revoked: false, message: "licenseKey must be a string under 10000 chars" } satisfies ValidateResponse,
        { status: 400 },
      )
    }
  }
  if (body.hardwareFingerprint !== undefined) {
    if (typeof body.hardwareFingerprint !== "string" || body.hardwareFingerprint.length > 200) {
      return Response.json(
        {
          valid: false,
          revoked: false,
          message: "hardwareFingerprint must be a string under 200 chars",
        } satisfies ValidateResponse,
        { status: 400 },
      )
    }
  }

  // ---- JWT signature check (defense-in-depth) --------------------------
  if (body.licenseKey) {
    if (PUBLIC_KEY) {
      try {
        const payload = jwt.verify(body.licenseKey, PUBLIC_KEY, { algorithms: ["RS256"] })
        if (typeof payload === "object" && payload !== null) {
          const claimedId = (payload as JwtPayload & { licenseId?: unknown }).licenseId
          if (typeof claimedId === "string" && claimedId !== licenseId) {
            return Response.json(
              { valid: false, revoked: false, message: "JWT licenseId mismatch" } satisfies ValidateResponse,
              { status: 200 },
            )
          }
        }
      } catch {
        return Response.json(
          { valid: false, revoked: false, message: "Invalid signature" } satisfies ValidateResponse,
          { status: 200 },
        )
      }
    } else {
      warnPublicKeyMissingOnce()
    }
  }

  const record = await findById(licenseId)
  if (!record) {
    const res: ValidateResponse = {
      valid: false,
      revoked: false,
      message: "Unknown license",
    }
    return Response.json(res, { status: 200 })
  }

  // Hardware-binding check (soft — first heartbeat sets binding).
  if (
    record.hardwareFingerprint &&
    body.hardwareFingerprint &&
    record.hardwareFingerprint !== body.hardwareFingerprint
  ) {
    const res: ValidateResponse = {
      valid: false,
      revoked: false,
      expiresAt: record.expiresAt,
      message: "Hardware fingerprint mismatch — license bound to a different machine",
    }
    return Response.json(res, { status: 200 })
  }

  const status = deriveStatus(record)

  if (status === "revoked") {
    const res: ValidateResponse = {
      valid: false,
      revoked: true,
      expiresAt: record.expiresAt,
      message: record.revokeReason
        ? `License revoked: ${record.revokeReason}`
        : "License revoked",
    }
    return Response.json(res, { status: 200 })
  }

  if (status === "expired") {
    const res: ValidateResponse = {
      valid: false,
      revoked: false,
      expiresAt: record.expiresAt,
      message: "License expired",
    }
    return Response.json(res, { status: 200 })
  }

  // Update phone-home audit fields opportunistically. Failures here are not
  // fatal — validation result still returns to the client.
  try {
    const updated: LicenseRecord = {
      ...record,
      hardwareFingerprint:
        record.hardwareFingerprint ?? body.hardwareFingerprint ?? undefined,
      lastHeartbeatAt: new Date().toISOString(),
      lastHeartbeatIp:
        body.callerIp ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        undefined,
      heartbeatCount: (record.heartbeatCount ?? 0) + 1,
    }
    await upsert(updated)
  } catch (err) {
    console.warn("[validate] heartbeat audit write failed:", err)
  }

  const res: ValidateResponse = {
    valid: true,
    revoked: false,
    expiresAt: record.expiresAt,
  }
  return Response.json(res, { status: 200 })
}
