import { NextRequest } from "next/server"
import { isAuthorized, unauthorized } from "@/lib/admin-auth"
import { recordAudit, adminCallerIp } from "@/lib/audit-log"
import { rateLimit } from "@/lib/rate-limit"
import {
  loadAll,
  upsert,
  deriveStatus,
  type LicenseRecord,
  type LicenseTier,
} from "@/lib/license-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const VALID_TIERS: LicenseTier[] = ["STARTER", "PROFESSIONAL", "ENTERPRISE"]

function rateLimitResponse(retryAfter: number): Response {
  return Response.json(
    { error: "Rate limit exceeded", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

interface RegisterBody {
  licenseId?: string
  customerName?: string
  tier?: LicenseTier
  expiresAt?: string // ISO-8601
  issuedAt?: string  // optional, defaults to now
  hardwareFingerprint?: string
}

export async function GET(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(req, "admin-licenses", 60, 60_000)
  if (!rl.ok) return rateLimitResponse(rl.retryAfter)

  if (!isAuthorized(req)) return unauthorized()

  const records = await loadAll()
  const enriched = records.map((r) => ({
    ...r,
    status: deriveStatus(r),
  }))
  return Response.json({ licenses: enriched })
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(req, "admin-licenses", 60, 60_000)
  if (!rl.ok) return rateLimitResponse(rl.retryAfter)

  if (!isAuthorized(req)) return unauthorized()

  let body: RegisterBody
  try {
    body = (await req.json()) as RegisterBody
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const licenseId = body.licenseId?.trim()
  const customerName = body.customerName?.trim()
  const tier = body.tier
  const expiresAt = body.expiresAt

  if (!licenseId || !customerName || !tier || !expiresAt) {
    return Response.json(
      {
        error: "Missing required fields: licenseId, customerName, tier, expiresAt",
      },
      { status: 400 },
    )
  }

  if (!VALID_TIERS.includes(tier)) {
    return Response.json(
      { error: `tier must be one of ${VALID_TIERS.join(", ")}` },
      { status: 400 },
    )
  }

  if (Number.isNaN(Date.parse(expiresAt))) {
    return Response.json(
      { error: "expiresAt must be a valid ISO-8601 date" },
      { status: 400 },
    )
  }

  const record: LicenseRecord = {
    licenseId,
    customerName,
    tier,
    issuedAt: body.issuedAt ?? new Date().toISOString(),
    expiresAt,
    revoked: false,
    hardwareFingerprint: body.hardwareFingerprint,
    heartbeatCount: 0,
  }

  await upsert(record)

  await recordAudit({
    action: "REGISTER",
    licenseId: record.licenseId,
    customerName: record.customerName,
    tier: record.tier,
    expiresAt: record.expiresAt,
    adminIp: adminCallerIp(req),
  })

  return Response.json({ ok: true, license: record }, { status: 201 })
}
