This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## License Server Operations

This site doubles as the AegisCode **license phone-home server**. Installed
copies of AegisCode hit `<this-site>/api/license/validate` once a day to
confirm they are still authorised; the vendor uses the admin endpoints below
to issue and revoke licenses.

### Required environment variables

| Var                     | Required | Purpose                                                                                          |
|-------------------------|----------|--------------------------------------------------------------------------------------------------|
| `ADMIN_TOKEN`           | yes      | Shared secret for the admin API and `/admin/licenses` UI. Sent as `x-admin-token` header.        |
| `LICENSE_REGISTRY_JSON` | prod     | JSON-stringified `LicenseRecord[]` used as the read-only registry on Vercel (see "Storage").     |
| `LICENSE_PUBLIC_KEY`    | recommended | RSA PEM public key (RS256) used to verify the `licenseKey` JWT. See "JWT verification" below. |

Set them in Vercel via `vercel env add ADMIN_TOKEN` (and `LICENSE_REGISTRY_JSON`,
`LICENSE_PUBLIC_KEY`). For local dev, drop them in `.env.local`.

#### Formatting `LICENSE_PUBLIC_KEY` as a single-line env var

PEM keys span multiple lines. Vercel env vars are single-line, so escape every
newline as the literal two-character sequence `\n`:

```
LICENSE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgk...\n...\n-----END PUBLIC KEY-----\n"
```

The validate route un-escapes `\n` back to real newlines at startup. If
`LICENSE_PUBLIC_KEY` is unset the server logs a warning ONCE per cold start
and skips the JWT signature check — the registry lookup still runs, so
revocations remain enforced (graceful degradation).

### Endpoints

| Method | Path                                          | Auth          | Purpose                                                |
|--------|-----------------------------------------------|---------------|--------------------------------------------------------|
| POST   | `/api/license/validate`                       | none (public) | Daily phone-home from AegisCode worker.                |
| POST   | `/api/license/heartbeat`                      | none (public) | Audit-only ping. Optional, recommended for forensics.  |
| GET    | `/api/admin/licenses`                         | admin token   | List all licenses with status + last heartbeat.        |
| POST   | `/api/admin/licenses`                         | admin token   | Register a new license.                                |
| POST   | `/api/admin/licenses/{id}/revoke`             | admin token   | Mark a license as revoked.                             |

The browser admin UI lives at [`/admin/licenses`](http://localhost:3000/admin/licenses).
On first visit it prompts for the admin token and stores it in
`sessionStorage` for the duration of the tab.

### Storage

Licenses live in `data/licenses.json` (gitignored) for local dev. On Vercel
the runtime filesystem is read-only, so production reads `LICENSE_REGISTRY_JSON`
instead — set it to a JSON-stringified array of `LicenseRecord` objects.
Revocations performed via the admin UI on a deployed instance only persist
inside the active function instance; for permanent revocation, redeploy with
the record removed from `LICENSE_REGISTRY_JSON` (or migrate to Vercel KV —
see the `TODO(prod)` block in `src/lib/license-store.ts`).

### Register a license

```bash
curl -X POST https://<host>/api/admin/licenses \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseId": "AC-2026-001",
    "customerName": "Acme Bank",
    "tier": "PROFESSIONAL",
    "expiresAt": "2027-05-08T00:00:00Z"
  }'
```

### Validate a license (what the AegisCode client does daily)

```bash
curl -X POST https://<host>/api/license/validate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseId": "AC-2026-001",
    "hardwareFingerprint": "abc123…"
  }'
```

Response:

```json
{
  "valid": true,
  "revoked": false,
  "expiresAt": "2027-05-08T00:00:00Z"
}
```

### Revoke a license

```bash
curl -X POST https://<host>/api/admin/licenses/AC-2026-001/revoke \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "reason": "non-payment" }'
```

After revocation the validate endpoint returns
`{ valid: false, revoked: true, message: "License revoked: …" }` and the
client transitions into degraded mode within one phone-home cycle.

### Security hardening

The license server applies several hardening layers (see
`src/middleware.ts`, `src/lib/rate-limit.ts`, `src/lib/audit-log.ts`).

#### Rate limiting

In-memory IP-keyed fixed-window limiter, applied at the top of every public
and admin route:

| Route                              | Limit            |
|------------------------------------|------------------|
| `POST /api/license/validate`       | 10 req/min/IP    |
| `POST /api/license/heartbeat`      | 20 req/min/IP    |
| `GET/POST /api/admin/licenses`     | 60 req/min/IP    |
| `POST /api/admin/licenses/:id/revoke` | 60 req/min/IP |

Excess requests get HTTP `429 Rate limit exceeded` with a `Retry-After`
header. Caller IP is read from `x-forwarded-for` (first hop), fallback
`x-real-ip`, fallback `"unknown"`.

> The limiter is process-local. On Vercel each cold start spins up a fresh
> map and concurrent function instances do not share state — adequate as an
> abuse deterrent, not a global quota. Migrate to Vercel KV or Upstash for
> hard global limits (see `TODO(prod)` in `src/lib/rate-limit.ts`).

#### JWT signature verification

`POST /api/license/validate` accepts an optional `licenseKey` (a JWT signed
with RS256 using the vendor's private key). When `LICENSE_PUBLIC_KEY` is
configured the server verifies the signature and rejects:

- invalid signatures (returns `valid: false, message: "Invalid signature"`)
- mismatched `licenseId` claims (`message: "JWT licenseId mismatch"`)

This is defense-in-depth on top of the registry lookup. If
`LICENSE_PUBLIC_KEY` is unset, signature verification is skipped (logged
once) and only the registry lookup gates validity.

#### Security headers (middleware)

`src/middleware.ts` attaches the following to every response:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

HTML pages additionally get:

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
```

CSP is intentionally skipped on `/api/*` routes (JSON responses don't need
it and adding it just bloats every payload).

#### Input validation

`/api/license/validate` and `/api/license/heartbeat` reject malformed
input with HTTP 400:

- `licenseId` — required string, max 100 chars, regex `^[A-Za-z0-9_-]+$`
- `licenseKey` — optional string, max 10000 chars
- `hardwareFingerprint` — optional string, max 200 chars

#### Audit log

Sensitive admin actions (`REGISTER`, `REVOKE`) append to
`data/audit-log.json` (gitignored, schema below). On read-only filesystems
like Vercel the entry is logged to the function console as
`[audit] {…}` instead — grep the deployment logs to retrieve.

```json
{ "ts": "2026-05-08T12:34:56.000Z", "action": "REVOKE", "licenseId": "AC-2026-001", "reason": "non-payment", "adminIp": "203.0.113.1" }
```
