import { NextRequest } from "next/server"
import { findById, upsert } from "@/lib/license-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface HeartbeatBody {
  licenseId?: string
  hardwareFingerprint?: string
  callerIp?: string
}

/**
 * Audit-only endpoint: records that a license phoned home. Always returns
 * 200 ok unless the body is malformed, so a hostile client cannot probe
 * which licenseIds exist by status code alone.
 */
export async function POST(req: NextRequest): Promise<Response> {
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
    console.warn("[heartbeat] write failed:", err)
  }

  return Response.json({ ok: true })
}
