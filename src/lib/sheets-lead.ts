// Appends POC / partnership applications to a Google Sheet.
//
// Transport is a Google Apps Script Web App bound to the target sheet:
// the script validates a shared secret and appends one row. We deliberately
// avoid the Sheets REST API + service account here so there is no GCP project
// or private key to operate — the trade-off is that the Apps Script endpoint
// is publicly reachable, so `GOOGLE_SHEETS_WEBHOOK_SECRET` is the only thing
// standing between a scraper and a junk row. Keep it long and rotate it by
// re-deploying the script.
//
// The webhook URL is server-only. It must never be exposed as NEXT_PUBLIC_*,
// or the write endpoint plus its secret ends up in the client bundle.
//
// This sink is best-effort and never load-bearing: a Google outage, a bad
// deploy, or an unset env var must not stop a customer's form from
// submitting. Every failure path logs and returns. See lib/email.ts for the
// same posture on outbound mail.
//
// The Apps Script source and its deployment steps live in
// docs/google-apps-script/lead-sink.gs.

import { logger } from "./logger"

/** How long we let Google keep the request open before giving up. */
const TIMEOUT_MS = 8_000

export type LeadTrack = "CODE" | "SURFACE" | "BOTH" | "PARTNER"

/**
 * One row of the lead sheet. Field order here is documentation only — the
 * Apps Script owns the column order so the sheet stays stable when this
 * type gains fields. Adding a field here without adding it to the script
 * means it silently won't land in the sheet.
 */
export interface LeadRow {
  track: LeadTrack
  companyName: string
  contactEmail: string
  contactPhone?: string
  /** Code tier being evaluated; absent for SURFACE and PARTNER. */
  tier?: string
  teamSize?: string | number
  domainCount?: string | number
  hasExternalRating?: boolean
  monthlyReportEta?: string
  decisionMaker?: string
  partnerType?: string
  partnerWebsite?: string
  partnerNote?: string
  /** "manual" when sales must qualify, "auto" when a JWT was issued. */
  fulfillment: "manual" | "auto"
  licenseId?: string
}

export function sheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() &&
      process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim(),
  )
}

/**
 * Append a lead to the Google Sheet. Resolves regardless of outcome — the
 * caller is not expected to branch on the result.
 */
export async function appendLead(lead: LeadRow): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim()
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim()

  if (!url || !secret) {
    // Unconfigured is a normal state in dev and in a fresh deploy. Log at
    // debug so it doesn't look like an incident, but leave a breadcrumb for
    // "why is the sheet empty".
    logger.debug("[sheets-lead] skipped — webhook not configured", {
      track: lead.track,
      hasUrl: Boolean(url),
      hasSecret: Boolean(secret),
    })
    return
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        submittedAt: new Date().toISOString(),
        ...lead,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Apps Script answers /exec with a 302 to script.googleusercontent.com;
      // the default "follow" is what actually delivers the write.
      redirect: "follow",
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      logger.warn("[sheets-lead] append rejected by Apps Script", {
        status: res.status,
        // Apps Script returns an HTML error page on failure — truncate so a
        // stack trace page doesn't flood the log line.
        body: body.slice(0, 300),
        track: lead.track,
        companyName: lead.companyName,
      })
      return
    }

    logger.info("[sheets-lead] appended", {
      track: lead.track,
      companyName: lead.companyName,
      fulfillment: lead.fulfillment,
    })
  } catch (err) {
    // Timeout, DNS failure, TLS error, Google 5xx — all non-fatal. The ops
    // notification email in lib/notify-sales.ts is the redundant path, so a
    // lead is never lost just because the sheet was unreachable.
    logger.warn("[sheets-lead] append failed", {
      error: err,
      track: lead.track,
      companyName: lead.companyName,
    })
  }
}
