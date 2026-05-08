import { NextRequest } from "next/server"
import { isAuthorized, unauthorized } from "@/lib/admin-auth"
import { findById, upsert } from "@/lib/license-store"
import { recordAudit, adminCallerIp } from "@/lib/audit-log"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RevokeBody {
  reason?: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const rl = await rateLimit(req, "admin-revoke", 60, 60_000)
  if (!rl.ok) {
    return Response.json(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    )
  }

  if (!isAuthorized(req)) return unauthorized()

  const { id } = await params
  if (!id) {
    return Response.json({ error: "license id is required" }, { status: 400 })
  }

  let body: RevokeBody = {}
  try {
    body = (await req.json()) as RevokeBody
  } catch {
    // body is optional — empty body means no reason supplied.
  }

  const record = await findById(id)
  if (!record) {
    return Response.json({ error: "license not found" }, { status: 404 })
  }

  const reason = body.reason?.trim() || "no reason given"

  await upsert({
    ...record,
    revoked: true,
    revokedAt: new Date().toISOString(),
    revokeReason: reason,
  })

  await recordAudit({
    action: "REVOKE",
    licenseId: id,
    reason,
    adminIp: adminCallerIp(req),
  })

  return Response.json({ ok: true, licenseId: id })
}
