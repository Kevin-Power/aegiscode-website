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

Set them in Vercel via `vercel env add ADMIN_TOKEN` (and `LICENSE_REGISTRY_JSON`).
For local dev, drop them in `.env.local`.

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
