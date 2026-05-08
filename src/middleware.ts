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

export function middleware(req: NextRequest): NextResponse {
  const res = NextResponse.next()
  for (const [k, v] of Object.entries(BASE_HEADERS)) {
    res.headers.set(k, v)
  }
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    res.headers.set("Content-Security-Policy", CSP)
  }
  return res
}

// Run on every path, but skip Next internals and static assets.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
