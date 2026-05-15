This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Production readiness

Before treating the site as sellable production, run:

```bash
npm run readiness
```

The check fails on missing durable storage (`KV_REST_API_URL` plus
`KV_REST_API_TOKEN`), license signing/validation keys, admin token,
production site URL, and email delivery. Use
`npm run readiness:report` when you want a non-blocking report for local review.

Self-service checkout is intentionally ignored unless
`SELF_SERVICE_CHECKOUT_ENABLED` or `NEXT_PUBLIC_SELF_SERVICE_CHECKOUT_ENABLED`
is enabled.

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

## Observability

The site ships with a structured logger plus optional Sentry integration so
production incidents are debuggable.

**Logger** (`src/lib/logger.ts`):
- One JSON line per log in production: `{ ts, level, msg, ...ctx, stack? }`
  (Vercel function logs capture this automatically).
- Pretty single-line output in dev.
- API: `logger.info(msg, ctx?)`, `logger.warn(msg, ctxOrError?)`,
  `logger.error(msg, ctxOrError?)`, `logger.debug(msg, ctx?)`.
- `logger.withContext({ requestId })` produces a child logger that stamps the
  context onto every subsequent line.

**Sentry**: set `NEXT_PUBLIC_SENTRY_DSN` to enable. Errors emitted via
`logger.error(...)` are forwarded automatically. Add `SENTRY_AUTH_TOKEN` for
source-map upload during build. Without a DSN the SDK init is a no-op.

**Health endpoint** (`/api/health`): unauthenticated GET returning
`{ status, uptime, version }`. Use it for Vercel monitors or k8s probes.

**Request ID correlation**: middleware mints (or passes through) an
`x-request-id` header for every request. Read it in route handlers via
`req.headers.get("x-request-id")` and bind it to the logger:

```ts
const requestId = req.headers.get("x-request-id") ?? undefined
const log = logger.withContext({ requestId })
log.warn("license heartbeat write failed", { licenseId })
```

The id is also echoed back on the response for client-side correlation.

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
| `KV_REST_API_URL`       | prod     | Required Vercel KV / Upstash REST endpoint. Backs the license registry, rate-limit counters and audit log. |
| `KV_REST_API_TOKEN`     | prod     | Required Vercel KV / Upstash REST token. Must be configured with `KV_REST_API_URL`.              |
| `KV_REST_API_READ_ONLY_TOKEN` | optional | Auto-populated by the Vercel KV integration; not used by the server write paths.            |
| `LICENSE_PUBLIC_KEY`    | recommended | RSA PEM public key (RS256) used to verify the `licenseKey` JWT. See "JWT verification" below. |
| `LICENSE_REGISTRY_JSON` | optional | One-time seed for migrating the legacy env-var registry into KV. See "Migration" below.          |

Set them in Vercel via `vercel env add` (or use the dashboard's KV
integration which fills in the four `KV_*` vars automatically). For local
dev, drop them in `.env.local`. A template lives in `.env.example`.

#### Formatting `LICENSE_PUBLIC_KEY` as a single-line env var

PEM keys span multiple lines. Vercel env vars are single-line, so escape every
newline as the literal two-character sequence `\n`:

```
LICENSE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgk...\n...\n-----END PUBLIC KEY-----\n"
```

The validate route un-escapes `\n` back to real newlines at startup. If
`LICENSE_PUBLIC_KEY` is unset the server logs a warning ONCE per cold start
and skips the JWT signature check ??the registry lookup still runs, so
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

#### Production: Vercel KV (Redis)

The license registry, rate-limit counters and audit log are all backed by
Vercel KV in production. Set up:

1. In the Vercel dashboard for the project: **Storage ??Create Database ??
   KV** (or **Marketplace ??Upstash Redis** if KV is not available ??the
   integration exposes the same `KV_*` env vars and is API-compatible with
   `@vercel/kv`).
2. Click **Connect to project** and select all three environments
   (Production / Preview / Development if you want preview deploys to
   share state). Vercel writes the four `KV_*` env vars into the project.
3. Redeploy. The app picks KV up automatically ??no code changes.

Storage key scheme:

| Key                                           | Purpose                                  |
|-----------------------------------------------|------------------------------------------|
| `license:{licenseId}`                         | One JSON record per license.             |
| `licenses:all`                                | Sorted set of every licenseId (issuedAt). |
| `ratelimit:{routeKey}:{ip}:{windowEpoch}`     | INCR-backed rate-limit counter, TTL = window length. |
| `audit:log`                                   | LPUSH list of audit entries (LTRIM 10000). |

#### Local dev

Without both `KV_REST_API_URL` and `KV_REST_API_TOKEN` set,
`src/lib/storage.ts` falls back to a process-local
in-memory backend that mirrors the same Redis-style API. The app logs:

```
[storage] Using in-memory storage ??data will not persist across cold starts. Set KV_REST_API_URL and KV_REST_API_TOKEN for production.
```

once per process. This is fine for `next dev` and the build ??but be
aware that revocations, rate-limit state and audit entries vanish when the
dev server restarts (and on every Vercel cold start if you forget to set the
full KV REST URL/token pair in production).

A persistent dev option is to provision a development Vercel KV / Upstash
database and place its `KV_REST_API_URL` plus `KV_REST_API_TOKEN` in
`.env.local`.

#### Migration from `LICENSE_REGISTRY_JSON`

Existing customers who set `LICENSE_REGISTRY_JSON` for the old read-only
registry can migrate without touching their JSON: keep the env var in
place AND connect a KV store. On the first request after deploy, the
license-store seeds KV from `LICENSE_REGISTRY_JSON` (only when KV is
empty). After confirming the data shows up in `/admin/licenses`, you can
remove `LICENSE_REGISTRY_JSON` from the deployment ??KV is now the source
of truth.

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
    "hardwareFingerprint": "abc123??
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
`{ valid: false, revoked: true, message: "License revoked: ?? }` and the
client transitions into degraded mode within one phone-home cycle.

### Security hardening

The license server applies several hardening layers (see
`src/middleware.ts`, `src/lib/rate-limit.ts`, `src/lib/audit-log.ts`).

#### Rate limiting

KV-backed (Redis-style INCR + EXPIRE) IP-keyed fixed-window limiter,
applied at the top of every public and admin route:

| Route                              | Limit            |
|------------------------------------|------------------|
| `POST /api/license/validate`       | 10 req/min/IP    |
| `POST /api/license/heartbeat`      | 20 req/min/IP    |
| `GET/POST /api/admin/licenses`     | 60 req/min/IP    |
| `POST /api/admin/licenses/:id/revoke` | 60 req/min/IP |
| `GET /api/admin/audit-log`         | 60 req/min/IP    |

Excess requests get HTTP `429 Rate limit exceeded` with a `Retry-After`
header. Caller IP is read from `x-forwarded-for` (first hop), fallback
`x-real-ip`, fallback `"unknown"`.

When Vercel KV REST credentials are set the counter is shared across cold starts and
concurrent function instances ??i.e. a real global limit. Without KV the
limiter falls back to the in-memory backend, which is process-local and
adequate only as an abuse deterrent.

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

- `licenseId` ??required string, max 100 chars, regex `^[A-Za-z0-9_-]+$`
- `licenseKey` ??optional string, max 10000 chars
- `hardwareFingerprint` ??optional string, max 200 chars

#### Audit log

Sensitive admin actions (`REGISTER`, `REVOKE`, plus future
`TRIAL_SIGNUP` / `STRIPE_CHECKOUT`) append to a Redis list at
`audit:log` (LTRIMmed to the most recent 10000 entries). View them in
the admin UI at `/admin/audit-log` ??token-gated, filterable by action,
paginated 100 at a time.

Entry schema:

```json
{ "ts": "2026-05-09T12:34:56.000Z", "action": "REVOKE", "licenseId": "AC-2026-001", "reason": "non-payment", "adminIp": "203.0.113.1" }
```

Without KV configured, the audit log falls back to (a) `data/audit-log.json`
on writable hosts, (b) `[audit] {...}` console one-liners on read-only
hosts. The `/admin/audit-log` UI still works against an in-memory backend
in dev ??it just won't survive a server restart.

---

## POC request + controlled checkout

The site currently prioritizes **30-day POC requests**. Public pricing is
hidden, self-service checkout is paused by default, and every commercial
quote is confirmed through sales before payment or license fulfillment.

### New pages

| Path                  | Purpose                                                  |
|-----------------------|----------------------------------------------------------|
| `/pricing`            | Hidden-pricing explanation with POC CTAs; no public amounts. |
| `/trial`              | 30-day POC request form; auto-issues only after readiness is configured. |
| `/checkout/success`   | Post-Stripe-checkout confirmation.                       |
| `/checkout/cancel`    | Post-Stripe-cancel confirmation.                         |

### New API endpoints

| Method | Path                          | Auth          | Purpose                                                    |
|--------|-------------------------------|---------------|------------------------------------------------------------|
| POST   | `/api/trial/signup`           | RL only       | Records a 30-day POC request; can issue only with durable storage and signing keys. |
| POST   | `/api/checkout`               | RL only       | Creates a Stripe Checkout session.                         |
| POST   | `/api/stripe/webhook`         | Stripe sig    | Handles `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`. |

Rate limits: trial signup `3/hour/IP`; checkout `10/hour/IP`.

### Enabling controlled POC issuance

The website does **not** hold the master license signing key ??that key
stays on the air-gapped issuance laptop. To enable controlled POC issuance,
generate a separate **trial-grade** RSA keypair and paste the private key
into the deployment:

```bash
# Generate a trial-only RSA keypair (one-off, on a trusted laptop):
openssl genrsa -out trial-private-key.pem 2048
openssl rsa -in trial-private-key.pem -pubout -out trial-public-key.pem

# Vercel: add the private key (newlines preserved by the dashboard).
vercel env add LICENSE_SIGNING_PRIVATE_KEY  # paste trial-private-key.pem

# Update LICENSE_PUBLIC_KEY to the matching trial public key so the
# validate route accepts the JWTs we sign with the trial private key.
vercel env add LICENSE_PUBLIC_KEY  # paste trial-public-key.pem
```

If `LICENSE_SIGNING_PRIVATE_KEY` is unset, the trial signup endpoint
returns HTTP 503 with `"Trial signup not configured ??please contact
sales@aegiscode.com."` so the flow fails closed.

### Configuring Stripe

1. **Create products** in the Stripe dashboard (`Products > Add product`),
   one per tier. For each, create a **monthly recurring price** using the
   internal quote sheet. Do not publish tier prices in this repository.
   Copy the `price_` IDs.

2. **Set env vars** on Vercel:

   ```
   STRIPE_SECRET_KEY=sk_live_??
   STRIPE_PRICE_ID_STARTER=price_??
   STRIPE_PRICE_ID_PROFESSIONAL=price_??
   SELF_SERVICE_CHECKOUT_ENABLED=1
   NEXT_PUBLIC_SELF_SERVICE_CHECKOUT_ENABLED=1
   ```

3. **Register the webhook** in Stripe Dashboard ??Developers ??Webhooks:
   - Endpoint URL: `https://aegiscode.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`,
     `invoice.payment_failed`
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

The webhook handler:

| Stripe event                       | Action                                                                                |
|------------------------------------|---------------------------------------------------------------------------------------|
| `checkout.session.completed`       | Issues a 365-day license JWT, adds it to the registry, emails the JWT to the buyer.   |
| `customer.subscription.deleted`    | Marks the matching license as revoked.                                                |
| `invoice.payment_failed`           | Annotates the license; ops gets a `STRIPE_PAYMENT_FAILED` notify-ops ping. No auto-revoke (Stripe retries). |

If `LICENSE_SIGNING_PRIVATE_KEY` is unset when a checkout completes, the
license is **not** auto-issued ??ops gets a `STRIPE_CHECKOUT` notification
flagged `MANUAL ACTION REQUIRED` so the master-key laptop can mint it.

### Email backend

Resolution order: `RESEND_API_KEY` ??SMTP (`SMTP_HOST` / `SMTP_USER` /
`SMTP_PASS`) ??console fallback. The console fallback always reports
"ok" so the API flow doesn't fail closed in dev ??make sure ops watches
the function logs until a real backend is configured.

### Pricing policy

Do not publish tier amounts in the repository or public site. Use the
internal quote sheet for sales-approved offers, then map approved Stripe
prices through `STRIPE_PRICE_ID_*` only when self-service checkout is
explicitly re-enabled.

### Sample curl: trial signup

```bash
curl -X POST https://aegiscode.com/api/trial/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Bank",
    "contactEmail": "cto@acme.example",
    "contactPhone": "+886-2-1234-5678",
    "tier": "PROFESSIONAL",
    "teamSize": "25 developers"
  }'
```

Response (when email is configured):

```json
{
  "ok": true,
  "licenseId": "trial_abc123def456",
  "expiresAt": "2026-05-23T00:00:00.000Z",
  "instructions": "Check your email for activation steps."
}
```

When `RESEND_API_KEY`/`SMTP_*` are unset, the response additionally
includes the raw `jwt` so dev/QA flows complete without an email service.
