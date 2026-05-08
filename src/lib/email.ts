// Generic email helper. Picks the first configured backend in order:
//   1. Resend (RESEND_API_KEY)
//   2. SMTP (SMTP_HOST + SMTP_USER + SMTP_PASS)
//   3. console.log (dev fallback — never throws)
//
// Templates live alongside the sender so the call site stays declarative.
//
// We deliberately do NOT add a hard dependency on `nodemailer` or `resend`.
// Both backends are reached over plain HTTPS / TLS using the platform fetch
// or `node:net` so the package install stays lean. If either backend is
// configured but unreachable we log the failure and move on — email is
// best-effort, never load-bearing.

import { promises as dns } from "node:dns"

export interface SendEmailArgs {
  to: string
  subject: string
  html: string
  text: string
  from?: string
}

export interface SendEmailResult {
  ok: boolean
  backend: "resend" | "smtp" | "console"
  error?: string
}

function resolvedFrom(explicit: string | undefined): string {
  return (
    explicit ||
    process.env.SMTP_FROM ||
    process.env.RESEND_FROM ||
    "AegisCode <noreply@aegiscode.com>"
  )
}

async function sendViaResend(args: SendEmailArgs): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, backend: "resend", error: "missing api key" }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resolvedFrom(args.from),
        to: [args.to],
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    })
    if (!r.ok) {
      const body = await r.text().catch(() => "")
      return { ok: false, backend: "resend", error: `${r.status} ${body}` }
    }
    return { ok: true, backend: "resend" }
  } catch (err) {
    return { ok: false, backend: "resend", error: String(err) }
  }
}

// Tiny SMTP submission client (RFC 5321 + STARTTLS + AUTH LOGIN). Avoids the
// nodemailer dependency. Suitable for transactional volumes; throws if the
// server speaks anything fancier than basic SMTP.
async function sendViaSmtp(args: SendEmailArgs): Promise<SendEmailResult> {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || 587)
  if (!host || !user || !pass) {
    return { ok: false, backend: "smtp", error: "missing SMTP_* env vars" }
  }
  try {
    // dynamic imports keep node:net out of edge bundles even if the file
    // is accidentally pulled in elsewhere.
    const net = await import("node:net")
    const tls = await import("node:tls")
    await dns.lookup(host) // fail fast on bad hostnames

    const fromAddr = resolvedFrom(args.from)
    const fromEmail = fromAddr.match(/<([^>]+)>/)?.[1] ?? fromAddr

    const socket: import("node:net").Socket = net.createConnection(port, host)
    const reader = createLineReader(socket)

    async function expect(code: string): Promise<string> {
      const line = await reader.next()
      if (!line.startsWith(code)) {
        throw new Error(`SMTP expected ${code}, got: ${line}`)
      }
      return line
    }
    function send(line: string): void {
      socket.write(line + "\r\n")
    }

    await expect("220")
    send(`EHLO aegiscode-website`)
    // EHLO has multi-line response; drain till final 250
    await drainMulti(reader, "250")
    send("STARTTLS")
    await expect("220")

    const tlsSocket = tls.connect({ socket, servername: host })
    await new Promise<void>((res, rej) => {
      tlsSocket.once("secureConnect", () => res())
      tlsSocket.once("error", rej)
    })
    const tlsReader = createLineReader(tlsSocket)
    function tlsSend(line: string): void {
      tlsSocket.write(line + "\r\n")
    }
    async function tlsExpect(code: string): Promise<string> {
      const line = await tlsReader.next()
      if (!line.startsWith(code)) {
        throw new Error(`SMTP(TLS) expected ${code}, got: ${line}`)
      }
      return line
    }

    tlsSend(`EHLO aegiscode-website`)
    await drainMulti(tlsReader, "250")
    tlsSend("AUTH LOGIN")
    await tlsExpect("334")
    tlsSend(Buffer.from(user).toString("base64"))
    await tlsExpect("334")
    tlsSend(Buffer.from(pass).toString("base64"))
    await tlsExpect("235")
    tlsSend(`MAIL FROM:<${fromEmail}>`)
    await tlsExpect("250")
    tlsSend(`RCPT TO:<${args.to}>`)
    await tlsExpect("250")
    tlsSend("DATA")
    await tlsExpect("354")

    const boundary = "ac_" + Math.random().toString(36).slice(2)
    const headers = [
      `From: ${fromAddr}`,
      `To: ${args.to}`,
      `Subject: ${args.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ].join("\r\n")
    const body = [
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      args.text,
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      args.html,
      `--${boundary}--`,
    ].join("\r\n")
    tlsSend(headers + "\r\n\r\n" + body + "\r\n.")
    await tlsExpect("250")
    tlsSend("QUIT")
    tlsSocket.end()

    return { ok: true, backend: "smtp" }
  } catch (err) {
    return { ok: false, backend: "smtp", error: String(err) }
  }
}

interface LineReader {
  next: () => Promise<string>
}
function createLineReader(
  sock: import("node:net").Socket | import("node:tls").TLSSocket,
): LineReader {
  let buffer = ""
  const queue: ((line: string) => void)[] = []
  const lines: string[] = []
  sock.on("data", (chunk: Buffer) => {
    buffer += chunk.toString("utf8")
    let idx
    while ((idx = buffer.indexOf("\r\n")) >= 0) {
      const line = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)
      const cb = queue.shift()
      if (cb) cb(line)
      else lines.push(line)
    }
  })
  return {
    next(): Promise<string> {
      const ready = lines.shift()
      if (ready !== undefined) return Promise.resolve(ready)
      return new Promise((res) => queue.push(res))
    },
  }
}
async function drainMulti(reader: LineReader, code: string): Promise<void> {
  // SMTP multiline responses look like: "250-X" then finally "250 Y"
  // We read until the dash is replaced with a space (final).
  while (true) {
    const line = await reader.next()
    if (!line.startsWith(code)) {
      throw new Error(`SMTP multi expected ${code}, got: ${line}`)
    }
    if (line.charAt(code.length) === " ") return
  }
}

export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  if (process.env.RESEND_API_KEY) {
    const r = await sendViaResend(args)
    if (r.ok) return r
    console.warn("[email] resend failed, falling back:", r.error)
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const r = await sendViaSmtp(args)
    if (r.ok) return r
    console.warn("[email] smtp failed, falling back:", r.error)
  }
  console.log(
    `[email:console] to=${args.to} subject=${JSON.stringify(args.subject)}\n` +
      args.text,
  )
  return { ok: true, backend: "console" }
}

// ---- Templates -------------------------------------------------------------

export interface LicenseActivationEmailArgs {
  customerName: string
  licenseId: string
  jwt: string
  expiresAt: string
  instructions?: string
  tier?: string
  isTrial?: boolean
}

export function licenseActivationEmail(
  a: LicenseActivationEmailArgs,
): { subject: string; html: string; text: string } {
  const trialBadge = a.isTrial ? " (14-day trial)" : ""
  const subject = `Your AegisCode license${trialBadge} — ${a.licenseId}`
  const tierLine = a.tier ? `Tier: ${a.tier}\n` : ""
  const exp = new Date(a.expiresAt).toUTCString()

  const text = [
    `Hi ${a.customerName},`,
    "",
    `Your AegisCode license is ready.`,
    "",
    `License ID: ${a.licenseId}`,
    `${tierLine}Expires: ${exp}`,
    "",
    `Activation steps:`,
    `1) Save the license JWT below to: AegisCode/config/license.jwt`,
    `2) Restart AegisCode. The first heartbeat phones home and binds the license to this machine.`,
    `3) Confirm activation in Settings -> License.`,
    "",
    a.instructions || "Need help? Reply to this email.",
    "",
    `=== LICENSE JWT (single line) ===`,
    a.jwt,
    `=== END LICENSE JWT ===`,
    "",
    `-- AegisCode`,
  ].join("\n")

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:auto;padding:24px;color:#0F172A;">
      <h2 style="margin:0 0 12px;color:#0D9488;">Your AegisCode license${trialBadge}</h2>
      <p>Hi ${escapeHtml(a.customerName)},</p>
      <p>Your AegisCode license is ready.</p>
      <table style="border-collapse:collapse;margin:12px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#64748B;">License ID</td><td><code>${escapeHtml(a.licenseId)}</code></td></tr>
        ${a.tier ? `<tr><td style="padding:4px 12px 4px 0;color:#64748B;">Tier</td><td>${escapeHtml(a.tier)}</td></tr>` : ""}
        <tr><td style="padding:4px 12px 4px 0;color:#64748B;">Expires</td><td>${escapeHtml(exp)}</td></tr>
      </table>
      <ol style="line-height:1.6;">
        <li>Save the JWT below to <code>AegisCode/config/license.jwt</code></li>
        <li>Restart AegisCode — the first heartbeat binds the license to this machine.</li>
        <li>Confirm activation in <strong>Settings &rarr; License</strong>.</li>
      </ol>
      <p style="color:#64748B;font-size:13px;">${escapeHtml(a.instructions || "Need help? Reply to this email.")}</p>
      <pre style="background:#0F172A;color:#A7F3D0;padding:12px;border-radius:6px;font-size:11px;overflow:auto;word-break:break-all;white-space:pre-wrap;">${escapeHtml(a.jwt)}</pre>
      <p style="color:#94A3B8;font-size:12px;margin-top:24px;">-- AegisCode</p>
    </div>
  `
  return { subject, html, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
