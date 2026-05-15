import { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { recordAudit, adminCallerIp } from "@/lib/audit-log"
import { notifyOps } from "@/lib/notify-sales"
import { signDownload, getDownloadSecret } from "@/lib/download-sign"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface DownloadBody {
  assetId?: string
  contactEmail?: string
  companyName?: string
  contactPhone?: string
  website?: string // honeypot
}

const ALLOWED_ASSETS = new Set([
  "surface-proposal.pdf",
  "ciso-monthly-sample.pdf",
])

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const TOKEN_LIFETIME_SECONDS = 5 * 60

function rateLimitResponse(retryAfter: number): Response {
  return Response.json(
    { error: "Rate limit exceeded", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(
    req,
    "resource-download",
    3,
    60 * 60 * 1000,
  )
  if (!rl.ok) return rateLimitResponse(rl.retryAfter)

  let body: DownloadBody
  try {
    body = (await req.json()) as DownloadBody
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Honeypot
  if (body.website && body.website.trim() !== "") {
    return Response.json({ ok: true })
  }

  const assetId = body.assetId?.trim()
  const contactEmail = body.contactEmail?.trim().toLowerCase()
  const companyName = body.companyName?.trim()

  if (!assetId || !ALLOWED_ASSETS.has(assetId)) {
    return Response.json(
      { error: "Unknown assetId" },
      { status: 400 },
    )
  }
  if (!contactEmail || !EMAIL_RE.test(contactEmail) || contactEmail.length > 200) {
    return Response.json(
      { error: "Valid contactEmail required" },
      { status: 400 },
    )
  }
  if (!companyName || companyName.length > 200) {
    return Response.json(
      { error: "companyName is required (max 200 chars)" },
      { status: 400 },
    )
  }

  let secret: string
  try {
    secret = getDownloadSecret()
  } catch {
    return Response.json(
      {
        error:
          "Resource downloads are not yet configured — please contact sales@aegiscode.com.",
      },
      { status: 503 },
    )
  }

  const exp = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS
  const token = signDownload({ assetId, exp, secret })

  await recordAudit({
    action: "RESOURCE_DOWNLOAD",
    assetId,
    customerName: companyName,
    customerEmail: contactEmail,
    adminIp: adminCallerIp(req),
  })
  await notifyOps("RESOURCE_DOWNLOAD", {
    assetId,
    companyName,
    customerEmail: contactEmail,
    contactPhone: body.contactPhone,
  })

  const url = `/api/resources/file/${assetId}?exp=${exp}&token=${token}`
  return Response.json(
    {
      ok: true,
      assetId,
      url,
      expiresInSeconds: TOKEN_LIFETIME_SECONDS,
    },
    { status: 201 },
  )
}
