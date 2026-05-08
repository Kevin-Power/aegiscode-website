// Append-only audit log for sensitive admin actions.
//
// In production with `KV_URL` configured we LPUSH each entry into a Redis
// list (`audit:log`) and LTRIM to the most recent 10000 entries — durable
// across cold starts, query-able from the admin UI.
//
// Without KV configured we fall back to:
//   1. file append at `data/audit-log.json` (works on a writable host)
//   2. console.log structured one-liner (Vercel function logs — last resort)
//
// Public API stays identical — `recordAudit()` is fire-and-forget. The new
// `getAuditLog()` helper returns the latest N entries for the admin UI.

import { promises as fs } from "node:fs"
import path from "node:path"
import { storage } from "./storage"
import { logger } from "./logger"

const DATA_DIR = path.join(process.cwd(), "data")
const AUDIT_FILE = path.join(DATA_DIR, "audit-log.json")

const KEY_AUDIT_LOG = "audit:log"
/** Hard cap on entries retained in KV. Older ones are LTRIMmed off. */
const MAX_ENTRIES = 10_000

export type AuditAction =
  | "REVOKE"
  | "REGISTER"
  | "TRIAL_SIGNUP"
  | "STRIPE_CHECKOUT"
  | string

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
        logger.warn("audit-log file read failed (will overwrite)", { error: err instanceof Error ? err.message : String(err) })
      }
    }
    existing.push(entry)
    await fs.writeFile(AUDIT_FILE, JSON.stringify(existing, null, 2), "utf8")
    return true
  } catch (err) {
    if (!warnedReadOnly) {
      warnedReadOnly = true
      logger.warn("audit-log file write failed — falling back to console", { error: err instanceof Error ? err.message : String(err) })
    }
    return false
  }
}

async function appendToKv(entry: AuditEntry): Promise<boolean> {
  try {
    // LPUSH puts newest at the head — `getAuditLog` then reads 0..N-1 from
    // the head for "latest first" semantics.
    await storage.lpush(KEY_AUDIT_LOG, entry)
    // Keep only the most recent MAX_ENTRIES. LTRIM 0..MAX_ENTRIES-1.
    await storage.ltrim(KEY_AUDIT_LOG, 0, MAX_ENTRIES - 1)
    return true
  } catch (err) {
    logger.warn("audit-log kv write failed", { error: err instanceof Error ? err.message : String(err) })
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

  // KV is the durable target when available. We still emit a console line
  // for grep-ability in deployment logs, regardless of backend.
  let wrote = false
  if (storage.backend === "kv") {
    wrote = await appendToKv(full)
  }
  if (!wrote) {
    // Either KV isn't configured, or the KV write failed. Try the file
    // backend (works on writable dev hosts) and otherwise fall through to
    // the console one-liner.
    wrote = await appendToFile(full)
    // Even on memory-backed dev runs we want the entry in *some* persistent
    // place — so when storage is in-memory, also push to memory list so
    // `getAuditLog` works for local UI testing.
    if (storage.backend === "memory") {
      try {
        await storage.lpush(KEY_AUDIT_LOG, full)
        await storage.ltrim(KEY_AUDIT_LOG, 0, MAX_ENTRIES - 1)
      } catch {
        // ignore — best-effort
      }
    }
  }
  if (!wrote) {
    // Structured one-liner so it's grep-able in Vercel function logs.
    logger.info("audit", { audit: full })
  }
}

/**
 * Read recent audit entries, newest first.
 *
 * Sources, in order of preference:
 *   1. KV list (when configured)
 *   2. in-memory list (when running on memory-backed storage)
 *   3. on-disk JSON file (writable dev host)
 */
export async function getAuditLog(
  limit: number = 100,
  offset: number = 0,
): Promise<AuditEntry[]> {
  const start = Math.max(0, offset)
  const stop = start + Math.max(0, limit) - 1
  if (stop < start) return []

  // KV / in-memory list path.
  try {
    const fromList = await storage.lrange<AuditEntry>(KEY_AUDIT_LOG, start, stop)
    if (fromList.length > 0) return fromList
    // If empty AND we're on a memory backend, fall through to file (dev
    // host where `data/audit-log.json` may already exist from before).
    if (storage.backend === "kv") return fromList
  } catch (err) {
    logger.warn("audit-log storage read failed — trying file", { error: err instanceof Error ? err.message : String(err) })
  }

  try {
    const raw = await fs.readFile(AUDIT_FILE, "utf8")
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // File is oldest-first; return newest-first slice.
    const reversed = (parsed as AuditEntry[]).slice().reverse()
    return reversed.slice(start, start + limit)
  } catch {
    return []
  }
}
