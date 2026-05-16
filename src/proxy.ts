import { NextRequest, NextResponse } from "next/server"

// Renamed from src/middleware.ts as of Next.js 16: the `middleware` file
// convention is deprecated in favour of `proxy`. See
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
// (or https://nextjs.org/docs/messages/middleware-to-proxy).
//
// Security headers applied to every response. CSP is HTML-only — JSON API
// routes don't need it and adding it just bloats the response.

const BASE_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

const CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline'; " +
  // The print-only /internal/asset-print/* pages pull Noto Sans TC from
  // Google Fonts so puppeteer can render CJK correctly. Allow the
  // stylesheet + font hosts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data: https://fonts.gstatic.com; " +
  "connect-src 'self';"

const REQUEST_ID_HEADER = "x-request-id"

/**
 * Generate or pass through a per-request correlation id. Honors an upstream
 * x-request-id header so logs across hops stay correlated.
 */
function ensureRequestId(req: NextRequest): string {
  const incoming = req.headers.get(REQUEST_ID_HEADER)
  if (incoming && /^[A-Za-z0-9._-]{4,128}$/.test(incoming)) return incoming
  return crypto.randomUUID()
}

/**
 * Returns true if the request looks like it came from a local puppeteer
 * regenerate-pdfs run (any port on localhost / 127.0.0.1 / [::1]).
 */
function isLocalHost(host: string | null): boolean {
  if (!host) return false
  // Strip port and IPv6 brackets for comparison.
  const bare = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "")
  return bare === "localhost" || bare === "127.0.0.1" || bare === "::1"
}

/**
 * Constant-time string compare to avoid leaking secret length via timing.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Gate /internal/* paths. These are used by the puppeteer HTML→PDF
 * regenerate flow (see scripts/regenerate-pdfs.mjs and
 * docs/PDF_REGENERATION.md). They must NEVER be reachable on the public
 * site. Allowed callers:
 *
 *   1. Localhost (any port) — local `next dev` + puppeteer
 *   2. Requests carrying x-admin-token === ADMIN_TOKEN — admin curl
 *
 * Anything else gets a 404 — we don't even acknowledge the route exists.
 */
function gateInternal(req: NextRequest): NextResponse | null {
  if (!req.nextUrl.pathname.startsWith("/internal/")) return null

  const host = req.headers.get("host")
  if (isLocalHost(host)) return null

  const adminToken = process.env.ADMIN_TOKEN
  const supplied = req.headers.get("x-admin-token")
  if (adminToken && supplied && safeEqual(supplied, adminToken)) return null

  // Mimic a normal 404 — no auth challenge, no hint the route exists.
  return new NextResponse("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export function proxy(req: NextRequest): NextResponse {
  const blocked = gateInternal(req)
  if (blocked) return blocked

  const requestId = ensureRequestId(req)

  // Forward request id to downstream route handlers via request headers so
  // route logic can call headers().get('x-request-id').
  const forwardedHeaders = new Headers(req.headers)
  forwardedHeaders.set(REQUEST_ID_HEADER, requestId)

  const res = NextResponse.next({ request: { headers: forwardedHeaders } })

  for (const [k, v] of Object.entries(BASE_HEADERS)) {
    res.headers.set(k, v)
  }
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    res.headers.set("Content-Security-Policy", CSP)
  }
  res.headers.set(REQUEST_ID_HEADER, requestId)
  return res
}

// Run on every path, but skip Next internals and static assets.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
