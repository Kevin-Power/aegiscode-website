import { NextRequest, NextResponse } from "next/server"

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
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
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

export function middleware(req: NextRequest): NextResponse {
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
