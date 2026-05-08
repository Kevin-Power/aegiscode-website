// TODO(prod): migrate to Vercel KV or Postgres for durable, multi-instance writes.
//
// PRODUCTION USAGE:
// -----------------
// Vercel serverless functions run on an ephemeral filesystem. Writes to
// `data/licenses.json` will NOT persist between cold starts and are NOT
// shared between concurrent function instances. Two production strategies:
//
// 1. READ-ONLY REGISTRY (recommended interim):
//    Set env var LICENSE_REGISTRY_JSON to a JSON-stringified
//    LicenseRecord[]. The validate endpoint will read from it. Revocations
//    only persist as long as the function instance lives — for hard
//    revocations, redeploy with the record removed/flagged.
//
//    Example:
//      vercel env add LICENSE_REGISTRY_JSON
//      <paste: [{"licenseId":"AC-2026-001","customerName":"Acme",...}]>
//
// 2. KV / DB BACKED (real prod):
//    Replace loadAll/saveAll with Vercel KV (`@vercel/kv`) or a hosted
//    Postgres. The function signatures here are intentionally simple so
//    swapping the backend is a one-file change.
//
// Local dev falls back to `data/licenses.json` (gitignored). If both the
// file and env var are missing, an in-memory Map is used so the build /
// admin UI still functions on a fresh checkout.

import { promises as fs } from "node:fs"
import path from "node:path"

export type LicenseTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE"

export interface LicenseRecord {
  licenseId: string
  customerName: string
  tier: LicenseTier
  issuedAt: string // ISO-8601
  expiresAt: string // ISO-8601
  revoked: boolean
  revokedAt?: string
  revokeReason?: string
  // Bound on first heartbeat if not pre-set (machine binding).
  hardwareFingerprint?: string
  lastHeartbeatAt?: string
  lastHeartbeatIp?: string
  heartbeatCount: number
}

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "licenses.json")

// In-memory fallback. Survives within a single function instance only.
let memoryStore: LicenseRecord[] | null = null

function parseRegistryEnv(): LicenseRecord[] | null {
  const raw = process.env.LICENSE_REGISTRY_JSON
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map(normalizeRecord)
  } catch (err) {
    console.warn("[license-store] LICENSE_REGISTRY_JSON parse failed:", err)
    return null
  }
}

function normalizeRecord(r: Partial<LicenseRecord>): LicenseRecord {
  return {
    licenseId: String(r.licenseId ?? ""),
    customerName: String(r.customerName ?? ""),
    tier: (r.tier ?? "STARTER") as LicenseTier,
    issuedAt: String(r.issuedAt ?? new Date().toISOString()),
    expiresAt: String(r.expiresAt ?? new Date().toISOString()),
    revoked: Boolean(r.revoked ?? false),
    revokedAt: r.revokedAt,
    revokeReason: r.revokeReason,
    hardwareFingerprint: r.hardwareFingerprint,
    lastHeartbeatAt: r.lastHeartbeatAt,
    lastHeartbeatIp: r.lastHeartbeatIp,
    heartbeatCount: Number(r.heartbeatCount ?? 0),
  }
}

async function loadFromFile(): Promise<LicenseRecord[] | null> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeRecord)
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code === "ENOENT") return null
    console.warn("[license-store] file read failed:", err)
    return null
  }
}

async function writeToFile(records: LicenseRecord[]): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8")
    return true
  } catch (err) {
    // Vercel runtime is read-only — silently fall back to memory.
    console.warn("[license-store] file write failed (likely read-only fs):", err)
    return false
  }
}

/** Load every license record from the active backend. */
export async function loadAll(): Promise<LicenseRecord[]> {
  // 1) env-var registry takes precedence in prod (immutable view).
  const fromEnv = parseRegistryEnv()
  if (fromEnv) {
    // Merge env baseline with any in-memory mutations (e.g. revocations
    // performed since last cold start).
    if (memoryStore) {
      const byId = new Map<string, LicenseRecord>()
      for (const rec of fromEnv) byId.set(rec.licenseId, rec)
      for (const rec of memoryStore) byId.set(rec.licenseId, rec)
      return [...byId.values()]
    }
    return fromEnv
  }

  // 2) local JSON file (dev / persistent host).
  const fromFile = await loadFromFile()
  if (fromFile) {
    memoryStore = fromFile
    return fromFile
  }

  // 3) in-memory fallback.
  if (!memoryStore) memoryStore = []
  return memoryStore
}

/** Persist the full set. Falls back to memory if disk write fails. */
export async function saveAll(records: LicenseRecord[]): Promise<void> {
  memoryStore = records.map(normalizeRecord)
  await writeToFile(memoryStore)
}

export async function findById(id: string): Promise<LicenseRecord | null> {
  const all = await loadAll()
  return all.find((r) => r.licenseId === id) ?? null
}

/** Insert or replace a record by licenseId. */
export async function upsert(record: LicenseRecord): Promise<void> {
  const all = await loadAll()
  const next = [...all]
  const idx = next.findIndex((r) => r.licenseId === record.licenseId)
  if (idx >= 0) next[idx] = normalizeRecord(record)
  else next.push(normalizeRecord(record))
  await saveAll(next)
}

/** Returns derived status string for UI / API responses. */
export function deriveStatus(
  rec: LicenseRecord,
  now: Date = new Date(),
): "active" | "revoked" | "expired" {
  if (rec.revoked) return "revoked"
  if (new Date(rec.expiresAt).getTime() < now.getTime()) return "expired"
  return "active"
}
