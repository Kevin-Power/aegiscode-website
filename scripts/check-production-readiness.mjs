#!/usr/bin/env node

const reportOnly = process.argv.includes("--report")

function has(name) {
  return Boolean(process.env[name] && String(process.env[name]).trim())
}

function any(names) {
  return names.some(has)
}

function all(names) {
  return names.every(has)
}

const selfServiceCheckoutEnabled =
  process.env.NEXT_PUBLIC_SELF_SERVICE_CHECKOUT_ENABLED === "1" ||
  process.env.NEXT_PUBLIC_SELF_SERVICE_CHECKOUT_ENABLED === "true" ||
  process.env.SELF_SERVICE_CHECKOUT_ENABLED === "1" ||
  process.env.SELF_SERVICE_CHECKOUT_ENABLED === "true"

const checks = [
  {
    level: "critical",
    name: "Durable storage",
    ok: all(["KV_REST_API_URL", "KV_REST_API_TOKEN"]),
    fix: "Provision Vercel KV and expose both KV_REST_API_URL and KV_REST_API_TOKEN.",
  },
  {
    level: "critical",
    name: "License signing key",
    ok: has("LICENSE_SIGNING_PRIVATE_KEY"),
    fix: "Set LICENSE_SIGNING_PRIVATE_KEY for POC/license issuance.",
  },
  {
    level: "critical",
    name: "License validation public key",
    ok: has("LICENSE_PUBLIC_KEY"),
    fix: "Set LICENSE_PUBLIC_KEY so validation can verify RS256 JWTs.",
  },
  {
    level: "critical",
    name: "Admin API token",
    ok: has("ADMIN_TOKEN"),
    fix: "Set ADMIN_TOKEN before using admin license/audit pages.",
  },
  {
    level: "critical",
    name: "Production site URL",
    ok: any(["NEXT_PUBLIC_SITE_URL", "SITE_URL"]),
    fix: "Set NEXT_PUBLIC_SITE_URL or SITE_URL to https://aegiscode.yilutek.com.",
  },
  {
    level: "critical",
    name: "Email delivery backend",
    ok: has("RESEND_API_KEY") || all(["SMTP_HOST", "SMTP_USER", "SMTP_PASS"]),
    fix: "Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS so POC leads get confirmations.",
  },
  {
    level: "warning",
    name: "Sales notification recipient",
    ok: has("SALES_NOTIFY_EMAIL"),
    fix: "Set SALES_NOTIFY_EMAIL; otherwise notifications default to sales@aegiscode.com.",
  },
  {
    level: "warning",
    name: "Observability DSN",
    ok: any(["SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN"]),
    fix: "Set SENTRY_DSN/NEXT_PUBLIC_SENTRY_DSN for production error reporting.",
  },
  {
    level: has("DOWNLOAD_SIGNING_SECRET") ? "info" : "warning",
    name: "Resource download signing secret",
    ok: any(["DOWNLOAD_SIGNING_SECRET", "ADMIN_TOKEN"]),
    fix: has("ADMIN_TOKEN")
      ? "DOWNLOAD_SIGNING_SECRET not set — falling back to ADMIN_TOKEN. Set DOWNLOAD_SIGNING_SECRET explicitly if you want to rotate download links independently of admin access."
      : "Set DOWNLOAD_SIGNING_SECRET (or rely on ADMIN_TOKEN) so /api/resources/download can issue HMAC-signed URLs.",
  },
  {
    level: selfServiceCheckoutEnabled ? "critical" : "info",
    name: "Self-service checkout",
    ok: selfServiceCheckoutEnabled
      ? all([
          "STRIPE_SECRET_KEY",
          "STRIPE_WEBHOOK_SECRET",
          "STRIPE_PRICE_ID_STARTER",
          "STRIPE_PRICE_ID_PROFESSIONAL",
        ])
      : true,
    fix: selfServiceCheckoutEnabled
      ? "Set Stripe secret, webhook secret, and Starter/Professional price IDs."
      : "Self-service checkout is paused; no Stripe price IDs required.",
  },
]

const criticalFailures = checks.filter((c) => c.level === "critical" && !c.ok)
const warningFailures = checks.filter((c) => c.level === "warning" && !c.ok)

console.log("AegisCode production readiness")
console.log("--------------------------------")
for (const check of checks) {
  const status = check.ok ? "OK" : check.level.toUpperCase()
  console.log(`${status.padEnd(8)} ${check.name}`)
  if (!check.ok) console.log(`         ${check.fix}`)
}
console.log("--------------------------------")
console.log(
  `${criticalFailures.length} critical issue(s), ${warningFailures.length} warning(s).`,
)

if (criticalFailures.length > 0 && !reportOnly) {
  process.exitCode = 1
}
