import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Signed download tokens for /resources lead-gated PDFs.
 *
 * Token format: hex-encoded HMAC-SHA256 of `${assetId}|${exp}` using the
 * server's signing secret. Short-lived (5 min default). Caller passes the
 * raw (assetId, exp, token) tuple in the query string; we recompute and
 * timing-safe compare.
 */

interface SignInput {
  assetId: string
  exp: number // unix seconds
  secret: string
}

interface VerifyInput extends SignInput {
  token: string
}

export function signDownload({ assetId, exp, secret }: SignInput): string {
  const hmac = createHmac("sha256", secret)
  hmac.update(`${assetId}|${exp}`)
  return hmac.digest("hex")
}

export function verifyDownload({
  assetId,
  exp,
  token,
  secret,
}: VerifyInput): boolean {
  const now = Math.floor(Date.now() / 1000)
  if (exp < now) return false
  const expected = signDownload({ assetId, exp, secret })
  if (expected.length !== token.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token))
  } catch {
    return false
  }
}

export function getDownloadSecret(): string {
  // Prefer a dedicated secret, fall back to ADMIN_TOKEN (already a secret
  // the deploy has). In production both should be set; the fallback exists
  // so local dev doesn't need an additional env var.
  const secret =
    process.env.DOWNLOAD_SIGNING_SECRET || process.env.ADMIN_TOKEN
  if (!secret) {
    throw new Error(
      "DOWNLOAD_SIGNING_SECRET (or ADMIN_TOKEN) must be set to sign resource downloads",
    )
  }
  return secret
}
