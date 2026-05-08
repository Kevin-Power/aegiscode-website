// Lazy Stripe client. Importing the SDK is gated on STRIPE_SECRET_KEY so
// the build still succeeds when Stripe is not configured (the API routes
// return 503 in that case).

import type StripeNS from "stripe"

let cached: StripeNS | null = null

export async function getStripe(): Promise<StripeNS | null> {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  // Dynamic import keeps the dependency optional at runtime.
  const mod = (await import("stripe")) as unknown as {
    default: new (key: string, opts?: Record<string, unknown>) => StripeNS
  }
  const Stripe = mod.default
  cached = new Stripe(key)
  return cached
}

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export interface TierPriceMap {
  STARTER: string | undefined
  PROFESSIONAL: string | undefined
}

export function tierPriceIds(): TierPriceMap {
  return {
    STARTER: process.env.STRIPE_PRICE_ID_STARTER,
    PROFESSIONAL: process.env.STRIPE_PRICE_ID_PROFESSIONAL,
  }
}
