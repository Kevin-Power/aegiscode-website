#!/usr/bin/env node

const origin = (process.env.SMOKE_SITE_URL || "https://aegiscode.yilutek.com").replace(
  /\/$/,
  "",
)
const expectCheckoutPaused =
  process.env.SMOKE_EXPECT_CHECKOUT_PAUSED !== "0" &&
  process.env.SMOKE_EXPECT_CHECKOUT_PAUSED !== "false"

const pagePaths = ["/", "/pricing", "/trial", "/external-risk"]
const forbidden = [
  { pattern: /NT\$/i, reason: "public price currency" },
  { pattern: /\b9,?900\b/, reason: "legacy Starter amount" },
  { pattern: /\b45,?000\b/, reason: "legacy Professional amount" },
  { pattern: /\b150,?000\b/, reason: "legacy Enterprise amount" },
  { pattern: /#pricing/i, reason: "old pricing anchor" },
  { pattern: /\bWT\b/i, reason: "legacy WT wording" },
  { pattern: /\bSonaqu\b/i, reason: "legacy Sonaqu wording" },
  { pattern: /Kevin Hsieh/i, reason: "individual project positioning" },
  { pattern: /Crafted by/i, reason: "individual project positioning" },
  { pattern: /業界首創/, reason: "unverifiable market-first claim" },
  { pattern: /市面上唯一/, reason: "unverifiable uniqueness claim" },
  { pattern: /壓低門檻/, reason: "internal pricing strategy leak" },
  { pattern: /秒砍/, reason: "internal competitor strategy leak" },
]

const failures = []
const warnings = []

async function request(path, init) {
  const url = `${origin}${path}`
  const res = await fetch(url, init)
  const text = await res.text()
  return { url, res, text }
}

for (const path of pagePaths) {
  const { url, res, text } = await request(path)
  if (!res.ok) {
    failures.push(`${url} returned HTTP ${res.status}`)
    continue
  }
  for (const { pattern, reason } of forbidden) {
    if (pattern.test(text)) failures.push(`${url} contains ${reason} (${pattern})`)
  }
  console.log(`OK page ${url} (${text.length} bytes)`)
}

{
  const { url, res, text } = await request("/api/health")
  if (!res.ok) {
    failures.push(`${url} returned HTTP ${res.status}`)
  } else {
    try {
      const health = JSON.parse(text)
      if (health.status !== "ok" && health.status !== "degraded") {
        failures.push(`${url} returned unexpected status ${JSON.stringify(health.status)}`)
      }
      if (health.status === "degraded") {
        warnings.push(`${url} is degraded: ${JSON.stringify(health.warnings ?? [])}`)
      }
      console.log(`OK health ${url} status=${health.status}`)
    } catch (err) {
      failures.push(`${url} did not return JSON: ${err}`)
    }
  }
}

{
  const { url, res, text } = await request("/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      tier: "STARTER",
      customerEmail: "smoke@example.com",
      companyName: "Smoke Test",
    }),
  })
  if (expectCheckoutPaused) {
    if (res.status !== 503 || !/paused|contact sales/i.test(text)) {
      failures.push(`${url} should be paused with HTTP 503, got ${res.status}: ${text}`)
    } else {
      console.log(`OK checkout paused ${url}`)
    }
  } else if (!res.ok) {
    failures.push(`${url} returned HTTP ${res.status}: ${text}`)
  }
}

for (const message of warnings) console.warn(`WARN ${message}`)

if (failures.length > 0) {
  console.error("Production smoke failed:")
  for (const message of failures) console.error(`- ${message}`)
  process.exit(1)
}

console.log(`Production smoke passed for ${origin}`)
