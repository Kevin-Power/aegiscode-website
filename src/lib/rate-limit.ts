// Fixed-window IP rate limiter, backed by the unified `storage` layer.
//
// In production with Vercel KV credentials configured this uses Redis-style INCR + EXPIRE
// against Vercel KV, so the window counter is shared across cold starts and
// concurrent function invocations — i.e. a real global limit.
//
// Without KV configured we fall back to the in-memory `storage` backend
// which is process-local. That keeps `next dev` working but is NOT a
// global limit on Vercel.
//
// Key scheme:
//   ratelimit:{routeKey}:{ip}:{windowEpoch}
// Each window gets its own key so we never need to do a GET-then-CAS dance —
// INCR is atomic and starts at 1 on first hit, EXPIRE seals the window.

import { storage } from "./storage"
import { logger } from "./logger"

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
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000))
  const windowEpoch = Math.floor(now / windowMs)

  const ip = clientIp(req)
  const bucketKey = `ratelimit:${key}:${ip}:${windowEpoch}`

  let count: number
  try {
    count = await storage.incr(bucketKey)
    // First hit in this window — set the TTL so the key is auto-evicted.
    if (count === 1) {
      await storage.expire(bucketKey, windowSeconds)
    }
  } catch (err) {
    // If the storage layer is wedged (transient KV outage), fail open
    // rather than rejecting legitimate traffic. This is consistent with
    // the historical behaviour when the limiter was process-local.
    logger.warn("rate-limit storage error — failing open", {
      error: err instanceof Error ? err.message : String(err),
    })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (count > limit) {
    // We don't know the exact window-end without storing it separately,
    // so estimate from the window boundary. Off by at most windowSeconds.
    const windowEndMs = (windowEpoch + 1) * windowMs
    const retryAfter = Math.max(1, Math.ceil((windowEndMs - now) / 1000))
    return { ok: false, remaining: 0, retryAfter }
  }

  return { ok: true, remaining: Math.max(0, limit - count), retryAfter: 0 }
}
