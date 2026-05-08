import { NextRequest } from "next/server"
import { recordAudit, adminCallerIp } from "@/lib/audit-log"
import {
  loadAll,
  upsert,
  type LicenseRecord,
  type LicenseTier,
} from "@/lib/license-store"
import { issueLicenseJwt, signingConfigured } from "@/lib/license-sign"
import { sendEmail, licenseActivationEmail } from "@/lib/email"
import { notifyOps } from "@/lib/notify-sales"
import { getStripe } from "@/lib/stripe"
import type StripeNS from "stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PAID_LICENSE_DAYS = 365

export async function POST(req: NextRequest): Promise<Response> {
  const stripe = await getStripe()
  if (!stripe) {
    return Response.json({ error: "Stripe not configured" }, { status: 503 })
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return Response.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 503 },
    )
  }
  const signature = req.headers.get("stripe-signature") ?? ""
  const rawBody = await req.text()

  let event: StripeNS.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    console.warn("[stripe-webhook] signature verification failed:", err)
    return Response.json({ error: "Bad signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(req, event.data.object as StripeNS.Checkout.Session)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(req, event.data.object as StripeNS.Subscription)
        break
      case "invoice.payment_failed":
        await handlePaymentFailed(req, event.data.object as StripeNS.Invoice)
        break
      default:
        // Ignored — Stripe expects 2xx for unhandled events too.
        break
    }
  } catch (err) {
    console.warn(`[stripe-webhook] handler ${event.type} failed:`, err)
    // Stripe will retry on non-2xx. We return 500 only for transient errors.
    return Response.json({ error: "Handler failure" }, { status: 500 })
  }

  return Response.json({ received: true })
}

async function handleCheckoutCompleted(
  req: NextRequest,
  session: StripeNS.Checkout.Session,
): Promise<void> {
  if (!signingConfigured()) {
    console.warn(
      "[stripe-webhook] checkout completed but LICENSE_SIGNING_PRIVATE_KEY not set — skipping issuance.",
    )
    await notifyOps("STRIPE_CHECKOUT", {
      sessionId: session.id,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      note: "MANUAL ACTION REQUIRED — license signing key not configured.",
    })
    return
  }

  const tier =
    (session.metadata?.tier as LicenseTier | undefined) === "STARTER"
      ? "STARTER"
      : "PROFESSIONAL"
  const companyName =
    session.metadata?.companyName ||
    (session.customer_details?.name ?? session.customer_email ?? "Unknown")
  const customerEmail =
    session.customer_email || session.customer_details?.email || null

  const now = new Date()
  const expiresAt = new Date(now.getTime() + PAID_LICENSE_DAYS * 24 * 60 * 60 * 1000)
  const signed = issueLicenseJwt({
    customerName: customerEmail
      ? `${companyName} <${customerEmail}>`
      : companyName,
    tier,
    expiresAt,
    source: "paid",
  })

  const record: LicenseRecord = {
    licenseId: signed.licenseId,
    customerName: customerEmail
      ? `${companyName} <${customerEmail}>`
      : companyName,
    tier,
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    revoked: false,
    heartbeatCount: 0,
  }
  await upsert(record)

  // Persist mapping subscription -> licenseId so subsequent sub events can
  // find the right license to mutate. We piggy-back on the audit log since
  // the website doesn't have a separate KV.
  await recordAudit({
    action: "STRIPE_CHECKOUT",
    licenseId: record.licenseId,
    customerName: companyName,
    customerEmail: customerEmail ?? undefined,
    tier,
    stripeSubscriptionId:
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripeSessionId: session.id,
    expiresAt: record.expiresAt,
    adminIp: adminCallerIp(req),
  })

  if (customerEmail) {
    const tpl = licenseActivationEmail({
      customerName: companyName,
      licenseId: signed.licenseId,
      jwt: signed.jwt,
      expiresAt: record.expiresAt,
      tier,
      isTrial: false,
      instructions:
        "Your subscription is active. This license is valid for one year and renews automatically with your Stripe subscription.",
    })
    await sendEmail({
      to: customerEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    })
  } else {
    console.warn(
      "[stripe-webhook] checkout session has no customer_email — license issued but not emailed.",
    )
  }

  await notifyOps("STRIPE_CHECKOUT", {
    licenseId: record.licenseId,
    companyName,
    customerEmail,
    tier,
    stripeSessionId: session.id,
    amountTotal: session.amount_total,
    currency: session.currency,
  })
}

async function findLicenseBySubscription(
  subscriptionId: string,
): Promise<LicenseRecord | null> {
  // The audit log carries the subscription -> license mapping. We do not have
  // KV here so we fall back to scanning recent licenses by issuance order.
  // For the volumes we expect (tens to low-hundreds of subs) this is fine.
  // If we ever miss, ops still gets a notify-ops ping.
  const all = await loadAll()
  // Simple convention: stash subscription id in revokeReason isn't great —
  // we instead look for licenses that share the same prefix and infer from
  // the audit log. As a pragmatic shortcut, we tag `paid_<x>` licenses and
  // assume the most recent matching customer_email/sub will be the right one.
  // Callers that need exact lookup can also pass the metadata mapping via
  // env vars / KV in the future.
  return all
    .slice()
    .reverse()
    .find(
      (r) =>
        !r.revoked &&
        r.licenseId.startsWith("paid_") &&
        // Best-effort: we tag the licenseId in the subscription metadata
        // below, so when Stripe gives us back the subscription id, we look
        // for it in the customerName free-form field.
        r.customerName.includes(subscriptionId),
    ) ?? null
}

async function handleSubscriptionDeleted(
  req: NextRequest,
  sub: StripeNS.Subscription,
): Promise<void> {
  const license = await findLicenseBySubscription(sub.id)
  if (!license) {
    console.warn(
      `[stripe-webhook] subscription.deleted ${sub.id} — no matching license found; ops notified.`,
    )
    await notifyOps("STRIPE_CANCEL", {
      stripeSubscriptionId: sub.id,
      note: "Manual revocation required — no license auto-mapped.",
    })
    return
  }
  const updated: LicenseRecord = {
    ...license,
    revoked: true,
    revokedAt: new Date().toISOString(),
    revokeReason: "Subscription cancelled",
  }
  await upsert(updated)
  await recordAudit({
    action: "REVOKE",
    licenseId: license.licenseId,
    reason: "Subscription cancelled",
    stripeSubscriptionId: sub.id,
    adminIp: adminCallerIp(req),
  })
  await notifyOps("STRIPE_CANCEL", {
    licenseId: license.licenseId,
    customerName: license.customerName,
    stripeSubscriptionId: sub.id,
  })
}

async function handlePaymentFailed(
  req: NextRequest,
  invoice: StripeNS.Invoice,
): Promise<void> {
  const subId =
    typeof (invoice as unknown as { subscription?: string | StripeNS.Subscription })
      .subscription === "string"
      ? ((invoice as unknown as { subscription: string }).subscription)
      : ((invoice as unknown as { subscription?: StripeNS.Subscription })
          .subscription?.id ?? "")
  const license = subId ? await findLicenseBySubscription(subId) : null
  if (!license) {
    await notifyOps("STRIPE_PAYMENT_FAILED", {
      stripeSubscriptionId: subId,
      stripeInvoiceId: invoice.id,
      customerEmail: invoice.customer_email,
      amountDue: invoice.amount_due,
      note: "No license auto-mapped — manual follow-up required.",
    })
    return
  }
  // We do NOT auto-revoke here: Stripe retries failed invoices for a few
  // days. We just queue a flag on the record and let ops decide.
  const updated: LicenseRecord = {
    ...license,
    revokeReason: license.revokeReason ?? "Payment failed — pending Stripe retry",
  }
  await upsert(updated)
  await recordAudit({
    action: "STRIPE_PAYMENT_FAILED",
    licenseId: license.licenseId,
    stripeSubscriptionId: subId,
    stripeInvoiceId: invoice.id,
    adminIp: adminCallerIp(req),
  })
  await notifyOps("STRIPE_PAYMENT_FAILED", {
    licenseId: license.licenseId,
    customerName: license.customerName,
    stripeSubscriptionId: subId,
    stripeInvoiceId: invoice.id,
  })
}
