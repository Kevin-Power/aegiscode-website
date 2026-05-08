// Lightweight liveness probe for the marketing/license-server site. No DB
// dependency, so the body shape is simpler than the main app's health route.
// No auth required — orchestrators (Vercel monitors, k8s, etc.) need to reach
// this without credentials.

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const VERSION = process.env.APP_VERSION || process.env.npm_package_version || "0.0.0"
const startedAt = Date.now()

export function GET(): NextResponse {
  const uptime = Math.round((Date.now() - startedAt) / 1000)
  return NextResponse.json({
    status: "ok",
    uptime,
    version: VERSION,
    timestamp: new Date().toISOString(),
  })
}
