import { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { recordAudit, adminCallerIp } from "@/lib/audit-log"
import { loadAll, upsert, type LicenseRecord } from "@/lib/license-store"
import { issueLicenseJwt, signingConfigured } from "@/lib/license-sign"
import {
  sendEmail,
  licenseActivationEmail,
  pocRequestReceivedEmail,
  partnershipRequestReceivedEmail,
} from "@/lib/email"
import { notifyOps } from "@/lib/notify-sales"
import { appendLead, type LeadTrack } from "@/lib/sheets-lead"
import { storage } from "@/lib/storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface TrialSignupBody {
  companyName?: string
  contactEmail?: string
  contactPhone?: string
  tier?: "STARTER" | "PROFESSIONAL"
  teamSize?: string | number
  // New: which AegisCode product line the lead is evaluating.
  // CODE = SAST/CBOM platform (the legacy default). SURFACE/BOTH go to
  // sales for manual handling — Surface is annual consulting, not a JWT.
  // PARTNER is not an evaluation at all — it's a channel/SI/tech/investment
  // enquiry, so it never touches licensing.
  track?: "CODE" | "SURFACE" | "BOTH" | "PARTNER"
  // Surface-specific fields (optional, but expected when track !== CODE)
  domainCount?: string | number
  hasExternalRating?: boolean
  monthlyReportEta?: string
  decisionMaker?: string
  // Partner-specific fields (optional, but expected when track === PARTNER)
  partnerType?: string
  partnerWebsite?: string
  partnerNote?: string
  // Honeypot — must be empty.
  website?: string
}

const PARTNER_TYPES = [
  "reseller",
  "si",
  "technology",
  "investment",
] as const

/** Free-text partner fields are operator-facing; cap them so a bot can't
 *  push a novel into the ops mailbox or the sheet. */
const PARTNER_NOTE_MAX = 2000
const PARTNER_WEBSITE_MAX = 300

/** Why this lead skipped auto-issuance — goes to the ops notification. */
const MANUAL_REASON: Record<LeadTrack, string> = {
  CODE: "Durable storage is not configured; auto license issuance paused.",
  SURFACE:
    "Surface is an advisory subscription; sales must qualify before issuing access.",
  BOTH: "Both Code and Surface evaluation; sales must qualify and scope before issuance.",
  PARTNER:
    "Partnership enquiry; no licence involved — route to business development.",
}

/** Customer-facing confirmation text, keyed by track. */
const MANUAL_INSTRUCTIONS: Record<LeadTrack, string> = {
  CODE: "POC request received. AegisCode sales will contact you to schedule the product walkthrough and issue an evaluation license after environment readiness is confirmed.",
  SURFACE:
    "Surface 諮詢申請已建立。顧問會在 1-2 個工作天內聯繫,先確認 Domain 規模、現有評分授權與時程。",
  BOTH: "已收到 Code + Surface 雙產品評估申請。顧問會聯繫您安排合併評估流程。",
  PARTNER:
    "合作洽談申請已建立。我們會在 2-3 個工作天內聯繫,先了解您的合作模式、既有客戶群與期望的分工方式。",
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const TRIAL_DAYS = 30

function canAutoIssueTrialLicense(): boolean {
  if (storage.backend === "kv") return true
  if (process.env.NODE_ENV !== "production") return true
  return process.env.ALLOW_EPHEMERAL_TRIAL_ISSUANCE === "1"
}

function rateLimitResponse(retryAfter: number): Response {
  return Response.json(
    { error: "Rate limit exceeded", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  // 3 trial signups per IP per hour — generous enough for legitimate retries
  // but blunt enough to deter scripted abuse.
  const rl = await rateLimit(req, "trial-signup", 3, 60 * 60 * 1000)
  if (!rl.ok) return rateLimitResponse(rl.retryAfter)

  let body: TrialSignupBody
  try {
    body = (await req.json()) as TrialSignupBody
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Honeypot — bots happily fill hidden fields. Pretend success so they
  // don't bother retrying.
  if (body.website && body.website.trim() !== "") {
    return Response.json({ ok: true, instructions: "Check your email." })
  }

  const companyName = body.companyName?.trim()
  const contactEmail = body.contactEmail?.trim().toLowerCase()
  const tier = body.tier === "STARTER" ? "STARTER" : "PROFESSIONAL"

  if (!companyName || companyName.length > 200) {
    return Response.json(
      { error: "companyName is required (max 200 chars)" },
      { status: 400 },
    )
  }
  if (!contactEmail || !EMAIL_RE.test(contactEmail) || contactEmail.length > 200) {
    return Response.json(
      { error: "Valid contactEmail required" },
      { status: 400 },
    )
  }

  const track: LeadTrack =
    body.track === "SURFACE" ||
    body.track === "BOTH" ||
    body.track === "PARTNER"
      ? body.track
      : "CODE"

  const partnerType =
    track === "PARTNER" &&
    PARTNER_TYPES.includes(body.partnerType as (typeof PARTNER_TYPES)[number])
      ? body.partnerType
      : undefined
  const partnerWebsite =
    track === "PARTNER"
      ? body.partnerWebsite?.trim().slice(0, PARTNER_WEBSITE_MAX) || undefined
      : undefined
  const partnerNote =
    track === "PARTNER"
      ? body.partnerNote?.trim().slice(0, PARTNER_NOTE_MAX) || undefined
      : undefined

  // Surface, Both and Partner never get an auto-issued JWT, regardless of
  // storage backend. CODE keeps the existing auto-issue behavior when durable
  // storage is configured.
  const forceManual = track !== "CODE"
  if (forceManual || !canAutoIssueTrialLicense()) {
    const ack =
      track === "PARTNER"
        ? partnershipRequestReceivedEmail({
            customerName: companyName,
            partnerType,
            partnerWebsite,
          })
        : pocRequestReceivedEmail({
            customerName: companyName,
            tier,
            teamSize: body.teamSize,
          })
    await sendEmail({
      to: contactEmail,
      subject: ack.subject,
      html: ack.html,
      text: ack.text,
    })
    await notifyOps("TRIAL_SIGNUP", {
      companyName,
      customerEmail: contactEmail,
      contactPhone: body.contactPhone,
      teamSize: body.teamSize,
      // A partnership enquiry has no tier — sending the defaulted
      // PROFESSIONAL would read as a product decision nobody made.
      tier: track === "PARTNER" ? undefined : tier,
      track,
      domainCount: body.domainCount,
      hasExternalRating: body.hasExternalRating,
      monthlyReportEta: body.monthlyReportEta,
      decisionMaker: body.decisionMaker,
      partnerType,
      partnerWebsite,
      partnerNote,
      fulfillment: "manual",
      storageBackend: storage.backend,
      reason: MANUAL_REASON[track],
    })
    await appendLead({
      track,
      companyName,
      contactEmail,
      contactPhone: body.contactPhone,
      tier: track === "PARTNER" ? undefined : tier,
      teamSize: body.teamSize,
      domainCount: body.domainCount,
      hasExternalRating: body.hasExternalRating,
      monthlyReportEta: body.monthlyReportEta,
      decisionMaker: body.decisionMaker,
      partnerType,
      partnerWebsite,
      partnerNote,
      fulfillment: "manual",
    })
    await recordAudit({
      action: "TRIAL_SIGNUP",
      customerName: companyName,
      customerEmail: contactEmail,
      tier,
      track,
      fulfillment: "manual",
      storageBackend: storage.backend,
      adminIp: adminCallerIp(req),
    })
    return Response.json(
      {
        ok: true,
        manualReview: true,
        track,
        instructions: MANUAL_INSTRUCTIONS[track],
      },
      { status: 202 },
    )
  }

  if (!signingConfigured()) {
    return Response.json(
      {
        error:
          "Trial signup not configured — please contact IT@yilutek.com.",
      },
      { status: 503 },
    )
  }

  // De-dupe: refuse to issue a second active trial for the same email.
  // We store the email inside customerName as `Company <email>` so a simple
  // case-insensitive substring check is enough to catch repeats.
  const all = await loadAll()
  const now = new Date()
  const emailMarker = `<${contactEmail}>`
  const existing = all.find(
    (r) =>
      r.licenseId.startsWith("trial_") &&
      r.customerName.toLowerCase().includes(emailMarker),
  )
  if (existing && !existing.revoked && new Date(existing.expiresAt) > now) {
    return Response.json(
      {
        error:
          "An active trial already exists for this email. Contact IT@yilutek.com to extend.",
      },
      { status: 409 },
    )
  }

  const expiresAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
  let signed
  try {
    signed = issueLicenseJwt({
      customerName: `${companyName} <${contactEmail}>`,
      tier,
      expiresAt,
      source: "trial",
    })
  } catch (err) {
    console.warn("[trial-signup] sign failed:", err)
    return Response.json(
      { error: "Trial issuance failed — please contact sales." },
      { status: 500 },
    )
  }

  const record: LicenseRecord = {
    licenseId: signed.licenseId,
    customerName: `${companyName} <${contactEmail}>`,
    tier,
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    revoked: false,
    heartbeatCount: 0,
  }
  await upsert(record)

  await recordAudit({
    action: "TRIAL_SIGNUP",
    licenseId: record.licenseId,
    customerName: companyName,
    customerEmail: contactEmail,
    tier,
    track,
    expiresAt: record.expiresAt,
    adminIp: adminCallerIp(req),
  })

  // Customer email — best effort.
  const tpl = licenseActivationEmail({
    customerName: companyName,
    licenseId: signed.licenseId,
    jwt: signed.jwt,
    expiresAt: record.expiresAt,
    tier,
    isTrial: true,
    instructions:
      "This is a 30-day POC license. Email IT@yilutek.com before it expires to convert to a paid plan.",
  })
  const mail = await sendEmail({
    to: contactEmail,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  })

  await notifyOps("TRIAL_SIGNUP", {
    licenseId: record.licenseId,
    companyName,
    customerEmail: contactEmail,
    contactPhone: body.contactPhone,
    teamSize: body.teamSize,
    tier,
    track,
    expiresAt: record.expiresAt,
  })

  await appendLead({
    track,
    companyName,
    contactEmail,
    contactPhone: body.contactPhone,
    tier,
    teamSize: body.teamSize,
    fulfillment: "auto",
    licenseId: record.licenseId,
  })

  // Only return the JWT in the API response when email delivery wasn't
  // configured — otherwise the customer should receive it via email and we
  // shouldn't put a long-lived secret into a network log.
  const emailDelivered = mail.ok && mail.backend !== "console"
  return Response.json(
    {
      ok: true,
      licenseId: record.licenseId,
      expiresAt: record.expiresAt,
      instructions: emailDelivered
        ? "Check your email for activation steps."
        : "Email service is not configured — copy the JWT below and email IT@yilutek.com if you need help.",
      ...(emailDelivered ? {} : { jwt: signed.jwt }),
    },
    { status: 201 },
  )
}
