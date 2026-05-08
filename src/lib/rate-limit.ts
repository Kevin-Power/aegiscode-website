// In-memory IP-based rate limiter (token-bucket-ish, fixed window).
//
// TODO(prod): use Vercel KV or Upstash Redis. The Map below lives inside a
// single Node.js process — on Vercel each cold start spins up a fresh map,
// and concurrent function instances do not share state. For low-traffic
// license validation this is acceptable as a basic abuse deterrent (it
// throttles a noisy attacker hitting the same warm instance), but it does
// NOT enforce a global limit across the fleet.

interface BucketEntry {
  count: number
  resetAt: number // epoch ms when the window expires
}

// keyed by `${routeKey}|${ip}`
const buckets = new Map<string, BucketEntry>()

let lastSweepAt = 0

function sweep(now: number, windowMs: number): void {
  // Cheap GC: only sweep at most once per windowMs to keep this O(N) call rare.
  if (now - lastSweepAt < windowMs) return
  lastSweepAt = now
  const cutoff = now - windowMs * 2
  for (const [k, v] of buckets) {
    if (v.resetAt < cutoff) buckets.delete(k)
  }
}

/** Extract the best-effort caller IP from request headers. */
function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const xreal = req.headers.get("x-real-ip")
  if (xreal && xreal.trim()) return xreal.trim()
  return "unknown"
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  /** Seconds until the caller can retry. 0 when ok=true. */
  retryAfter: number
}

/**
 * Fixed-window rate limit. Returns `ok: false` when the caller exceeds
 * `limit` requests inside `windowMs`.
 */
export async function rateLimit(
  req: Request,
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now()
  sweep(now, windowMs)

  const ip = clientIp(req)
  const bucketKey = `${key}|${ip}`
  const existing = buckets.get(bucketKey)

  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (existing.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    return { ok: false, remaining: 0, retryAfter }
  }

  existing.count += 1
  return { ok: true, remaining: limit - existing.count, retryAfter: 0 }
}
