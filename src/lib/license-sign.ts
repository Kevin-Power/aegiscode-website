// Signs license JWTs using a PEM RSA private key from
// `LICENSE_SIGNING_PRIVATE_KEY`. The website intentionally only ever holds
// a "trial-grade" key — the master signing key stays on Kevin's air-gapped
// laptop. The operator can paste in (and rotate) this trial key without
// touching the master.
//
// JWT payload mirrors what the desktop client expects from the
// archive-bundled keypair:
//   {
//     licenseId, customerName, tier, issuedAt (NumericDate), expiresAt (NumericDate)
//   }
// Signed with RS256 so the existing `LICENSE_PUBLIC_KEY` on the website
// AND on the desktop client both verify it.

import jwt from "jsonwebtoken"
import crypto from "node:crypto"
import type { LicenseTier } from "./license-store"

export interface SignedLicense {
  licenseId: string
  jwt: string
}

export interface IssueLicenseArgs {
  customerName: string
  tier: LicenseTier
  expiresAt: Date
  /** Override the auto-generated id (e.g. for `trial_xyz` vs `paid_xyz`). */
  licenseId?: string
  /** Used for the id prefix when no explicit id is given. */
  source?: "trial" | "paid"
}

function loadPrivateKey(): string | null {
  const raw = process.env.LICENSE_SIGNING_PRIVATE_KEY
  if (!raw) return null
  // Vercel env vars are single-line; allow `\n` literal escaping.
  return raw.includes("BEGIN") ? raw.replace(/\\n/g, "\n") : raw
}

export function signingConfigured(): boolean {
  return Boolean(process.env.LICENSE_SIGNING_PRIVATE_KEY)
}

export function generateLicenseId(prefix: "trial" | "paid"): string {
  // 12 random hex chars — collision odds vanishingly low for the volumes we
  // care about, and still copy-pasteable.
  const rand = crypto.randomBytes(6).toString("hex")
  return `${prefix}_${rand}`
}

export function issueLicenseJwt(args: IssueLicenseArgs): SignedLicense {
  const key = loadPrivateKey()
  if (!key) {
    throw new Error(
      "LICENSE_SIGNING_PRIVATE_KEY is not configured — self-service issuance disabled.",
    )
  }
  const licenseId =
    args.licenseId ?? generateLicenseId(args.source === "paid" ? "paid" : "trial")
  const now = new Date()
  const payload = {
    licenseId,
    customerName: args.customerName,
    tier: args.tier,
    issuedAt: Math.floor(now.getTime() / 1000),
    expiresAt: Math.floor(args.expiresAt.getTime() / 1000),
  }
  const token = jwt.sign(payload, key, {
    algorithm: "RS256",
    expiresIn: Math.max(
      1,
      Math.floor((args.expiresAt.getTime() - now.getTime()) / 1000),
    ),
  })
  return { licenseId, jwt: token }
}
