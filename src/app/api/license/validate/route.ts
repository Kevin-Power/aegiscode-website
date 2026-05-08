import { NextRequest } from "next/server"
import { findById, deriveStatus, upsert, type LicenseRecord } from "@/lib/license-store"

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

export async function POST(req: NextRequest): Promise<Response> {
  let body: ValidateBody
  try {
    body = (await req.json()) as ValidateBody
  } catch {
    return Response.json(
      { valid: false, revoked: false, message: "Invalid JSON body" },
      { status: 400 },
    )
  }

  const licenseId = body.licenseId?.trim()
  if (!licenseId) {
    return Response.json(
      { valid: false, revoked: false, message: "licenseId is required" } satisfies ValidateResponse,
      { status: 400 },
    )
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
