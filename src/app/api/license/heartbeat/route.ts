import { NextRequest } from "next/server"
import { findById, upsert } from "@/lib/license-store"
import { rateLimit } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface HeartbeatBody {
  licenseId?: string
  hardwareFingerprint?: string
  callerIp?: string
}

const LICENSE_ID_RE = /^[A-Za-z0-9_-]+$/

/**
 * Audit-only endpoint: records that a license phoned home. Always returns
 * 200 ok unless the body is malformed, so a hostile client cannot probe
 * which licenseIds exist by status code alone.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(req, "license-heartbeat", 20, 60_000)
  if (!rl.ok) {
    return Response.json(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    )
  }

  let body: HeartbeatBody
  try {
    body = (await req.json()) as HeartbeatBody
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON body" }, { status: 400 })
  }

  const licenseId = body.licenseId?.trim()
  if (!licenseId) {
    return Response.json(
      { ok: false, message: "licenseId is required" },
      { status: 400 },
    )
  }
  if (typeof licenseId !== "string" || licenseId.length > 100 || !LICENSE_ID_RE.test(licenseId)) {
    return Response.json(
      {
        ok: false,
        message: "licenseId must be a non-empty string up to 100 chars matching ^[A-Za-z0-9_-]+$",
      },
      { status: 400 },
    )
  }
  if (body.hardwareFingerprint !== undefined) {
    if (typeof body.hardwareFingerprint !== "string" || body.hardwareFingerprint.length > 200) {
      return Response.json(
        { ok: false, message: "hardwareFingerprint must be a string under 200 chars" },
        { status: 400 },
      )
    }
  }

  const record = await findById(licenseId)
  if (!record) {
    // Don't leak existence — return ok:true even for unknown ids.
    return Response.json({ ok: true })
  }

  try {
    await upsert({
      ...record,
      hardwareFingerprint:
        record.hardwareFingerprint ?? body.hardwareFingerprint ?? undefined,
      lastHeartbeatAt: new Date().toISOString(),
      lastHeartbeatIp:
        body.callerIp ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        undefined,
      heartbeatCount: (record.heartbeatCount ?? 0) + 1,
    })
  } catch (err) {
    const requestId = req.headers.get("x-request-id") || undefined
    logger.warn("heartbeat write failed", { licenseId, requestId, error: err instanceof Error ? err.message : String(err) })
  }

  return Response.json({ ok: true })
}
