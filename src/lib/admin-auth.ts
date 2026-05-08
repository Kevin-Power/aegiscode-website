import { NextRequest } from "next/server"

/**
 * Verify the request carries a valid admin token.
 *
 * Token may arrive via:
 *   - x-admin-token header (preferred, used by curl / scripts)
 *   - admin_token cookie  (used by the in-browser admin UI)
 *
 * If ADMIN_TOKEN env var is missing the API refuses ALL admin calls — we
 * never silently fall open in production.
 */
export function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false

  const headerToken = req.headers.get("x-admin-token")
  if (headerToken && safeEqual(headerToken, expected)) return true

  const cookieToken = req.cookies.get("admin_token")?.value
  if (cookieToken && safeEqual(cookieToken, expected)) return true

  return false
}

/** Constant-time string compare to avoid token-length timing leaks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export function unauthorized(): Response {
  return Response.json(
    { error: "unauthorized", message: "Missing or invalid x-admin-token" },
    { status: 401 },
  )
}
