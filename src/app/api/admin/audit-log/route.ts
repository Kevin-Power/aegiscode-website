import { NextRequest } from "next/server"
import { isAuthorized, unauthorized } from "@/lib/admin-auth"
import { getAuditLog, type AuditEntry } from "@/lib/audit-log"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_LIMIT = 500

export async function GET(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(req, "admin-audit-log", 60, 60_000)
  if (!rl.ok) {
    return Response.json(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    )
  }

  if (!isAuthorized(req)) return unauthorized()

  const url = new URL(req.url)
  const limitParam = Number(url.searchParams.get("limit") ?? "100")
  const offsetParam = Number(url.searchParams.get("offset") ?? "0")
  const action = url.searchParams.get("action")?.trim() || null

  const limit = Math.max(1, Math.min(MAX_LIMIT, Number.isFinite(limitParam) ? limitParam : 100))
  const offset = Math.max(0, Number.isFinite(offsetParam) ? offsetParam : 0)

  // Read a chunk wider than `limit` if a filter is active so the post-filter
  // result still hits the requested page size most of the time. This is a
  // best-effort heuristic — the UI can request more if needed.
  const readLimit = action ? Math.min(MAX_LIMIT, limit * 4) : limit
  const entries: AuditEntry[] = await getAuditLog(readLimit, offset)
  const filtered = action ? entries.filter((e) => e.action === action) : entries

  return Response.json({
    entries: filtered.slice(0, limit),
    limit,
    offset,
    action,
    truncated: filtered.length > limit,
  })
}
