// Sales notification helper. Pings ops on key revenue events. Backed by
// the same email infrastructure as customer-facing mail; if no email backend
// is configured, sendEmail falls back to a structured console log.

import { sendEmail } from "./email"

export type SalesEvent =
  | "TRIAL_SIGNUP"
  | "STRIPE_CHECKOUT"
  | "STRIPE_CANCEL"
  | "STRIPE_PAYMENT_FAILED"

export async function notifyOps(
  event: SalesEvent,
  data: Record<string, unknown>,
): Promise<void> {
  const ts = new Date().toISOString()
  const payload = { ts, event, ...data }
  const to = process.env.SALES_NOTIFY_EMAIL?.trim() || "sales@aegiscode.com"

  const subject = `[AegisCode] ${event} - ${
    (data.customerName as string) || (data.customerEmail as string) || "(no name)"
  }`
  const text = Object.entries(payload)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n")
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:auto;padding:24px;color:#0F172A;">
      <h3 style="margin:0 0 8px;color:#0D9488;">AegisCode sales event: ${escapeHtml(event)}</h3>
      <table style="border-collapse:collapse;font-size:13px;">
        ${Object.entries(payload)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:2px 12px 2px 0;color:#64748B;">${escapeHtml(
                k,
              )}</td><td><code>${escapeHtml(
                typeof v === "string" ? v : JSON.stringify(v),
              )}</code></td></tr>`,
          )
          .join("")}
      </table>
    </div>
  `
  try {
    await sendEmail({ to, subject, text, html })
  } catch (err) {
    console.warn("[notify-sales] send failed, payload follows:", err, payload)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
