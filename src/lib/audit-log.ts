// Append-only audit log for sensitive admin actions. On a writable host we
// store entries in `data/audit-log.json` (gitignored). On read-only runtimes
// like Vercel we transparently fall back to console.log so the trail at least
// shows up in the function logs.

import { promises as fs } from "node:fs"
import path from "node:path"

const DATA_DIR = path.join(process.cwd(), "data")
const AUDIT_FILE = path.join(DATA_DIR, "audit-log.json")

export type AuditAction = "REVOKE" | "REGISTER" | string

export interface AuditEntry {
  ts: string // ISO-8601
  action: AuditAction
  licenseId?: string
  reason?: string
  adminIp?: string
  // Free-form extras (e.g. customerName for REGISTER) — keep keys flat.
  [extra: string]: unknown
}

let warnedReadOnly = false

async function appendToFile(entry: AuditEntry): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    let existing: AuditEntry[] = []
    try {
      const raw = await fs.readFile(AUDIT_FILE, "utf8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) existing = parsed as AuditEntry[]
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException)?.code
      if (code !== "ENOENT") {
        console.warn("[audit-log] read failed, will overwrite:", err)
      }
    }
    existing.push(entry)
    await fs.writeFile(AUDIT_FILE, JSON.stringify(existing, null, 2), "utf8")
    return true
  } catch (err) {
    if (!warnedReadOnly) {
      warnedReadOnly = true
      console.warn(
        "[audit-log] file write failed (likely read-only fs); falling back to console:",
        err,
      )
    }
    return false
  }
}

/** Best-effort caller IP for audit attribution. */
export function adminCallerIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const xreal = req.headers.get("x-real-ip")
  if (xreal && xreal.trim()) return xreal.trim()
  return "unknown"
}

export async function recordAudit(
  entry: { action: AuditAction; ts?: string } & Omit<AuditEntry, "ts" | "action">,
): Promise<void> {
  const full: AuditEntry = {
    ...entry,
    ts: entry.ts ?? new Date().toISOString(),
    action: entry.action,
  }
  const wrote = await appendToFile(full)
  if (!wrote) {
    // Structured one-liner so it's grep-able in Vercel function logs.
    console.log(`[audit] ${JSON.stringify(full)}`)
  }
}
