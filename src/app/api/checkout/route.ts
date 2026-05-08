import { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { getStripe, stripeEnabled, tierPriceIds } from "@/lib/stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

interface CheckoutBody {
  tier?: "STARTER" | "PROFESSIONAL"
  customerEmail?: string
  companyName?: string
}

function rateLimitResponse(retryAfter: number): Response {
  return Response.json(
    { error: "Rate limit exceeded", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

function siteOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (env) return env.replace(/\/$/, "")
  // fallback to request origin
  const proto = req.headers.get("x-forwarded-proto") ?? "https"
  const host = req.headers.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(req, "checkout", 10, 60 * 60 * 1000)
  if (!rl.ok) return rateLimitResponse(rl.retryAfter)

  if (!stripeEnabled()) {
    return Response.json(
      { error: "Stripe checkout is not enabled — contact sales@aegiscode.com." },
      { status: 503 },
    )
  }

  let body: CheckoutBody
  try {
    body = (await req.json()) as CheckoutBody
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const tier = body.tier === "STARTER" ? "STARTER" : "PROFESSIONAL"
  const customerEmail = body.customerEmail?.trim().toLowerCase()
  const companyName = body.companyName?.trim()

  if (!customerEmail || !EMAIL_RE.test(customerEmail)) {
    return Response.json({ error: "Valid customerEmail required" }, { status: 400 })
  }
  if (!companyName || companyName.length > 200) {
    return Response.json(
      { error: "companyName required (max 200 chars)" },
      { status: 400 },
    )
  }

  const prices = tierPriceIds()
  const priceId = prices[tier]
  if (!priceId) {
    return Response.json(
      {
        error: `STRIPE_PRICE_ID_${tier} is not configured — contact sales.`,
      },
      { status: 503 },
    )
  }

  const stripe = await getStripe()
  if (!stripe) {
    return Response.json({ error: "Stripe not initialised" }, { status: 503 })
  }

  const origin = siteOrigin(req)
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      allow_promotion_codes: true,
      metadata: {
        companyName,
        tier,
        source: "self-service",
      },
      subscription_data: {
        metadata: {
          companyName,
          tier,
          source: "self-service",
        },
      },
    })
    return Response.json({ url: session.url }, { status: 200 })
  } catch (err) {
    console.warn("[checkout] stripe error:", err)
    return Response.json(
      { error: "Stripe checkout creation failed — try again or contact sales." },
      { status: 502 },
    )
  }
}
