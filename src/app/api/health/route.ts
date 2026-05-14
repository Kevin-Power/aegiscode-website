// Lightweight liveness/readiness probe for the marketing/license-server site.
// No auth required: orchestrators and uptime monitors need to reach this
// without credentials.

import { NextResponse } from "next/server"
import { storage } from "@/lib/storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const VERSION = process.env.APP_VERSION || process.env.npm_package_version || "0.0.0"
const startedAt = Date.now()

export function GET(): NextResponse {
  const uptime = Math.round((Date.now() - startedAt) / 1000)
  const durableStorage = storage.backend === "kv"
  const isProduction = process.env.NODE_ENV === "production"
  const status = isProduction && !durableStorage ? "degraded" : "ok"

  return NextResponse.json(
    {
      status,
      uptime,
      version: VERSION,
      timestamp: new Date().toISOString(),
      checks: {
        http: "ok",
        storage: durableStorage ? "durable" : "ephemeral",
      },
      storage: {
        backend: storage.backend,
        durable: durableStorage,
      },
      warnings: durableStorage
        ? []
        : [
            "License records, rate limits, and audit logs are using in-memory storage. Configure Vercel KV before production sales usage.",
          ],
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}
