// License record store, backed by the unified `storage` abstraction.
//
// In production with Vercel KV credentials configured this writes through to Vercel KV
// (Redis), so revocations and heartbeat updates persist across cold starts
// and concurrent function invocations. Without KV configured we fall back
// to an in-memory implementation that survives only inside a single Node
// process — useful for `next dev` and CI builds, NOT for production.
//
// Storage key scheme:
//   license:{licenseId}     hash of the LicenseRecord (one key per license)
//   licenses:all            sorted set of every licenseId we know about
//                           (score = epoch ms of issuedAt — newest last)
//
// Migration / seed:
//   On first read, if `licenses:all` is empty AND env var
//   `LICENSE_REGISTRY_JSON` is set, the env array is loaded into KV. After
//   that the env var is ignored — KV is the source of truth and the env
//   var only exists for one-time bootstrap.

import { storage } from "./storage"
import { logger } from "./logger"

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

const KEY_LICENSE = (id: string) => `license:${id}`
const KEY_INDEX = "licenses:all"

let seedAttempted = false

function parseRegistryEnv(): LicenseRecord[] | null {
  const raw = process.env.LICENSE_REGISTRY_JSON
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map(normalizeRecord)
  } catch (err) {
    logger.warn("license-store registry env parse failed", { error: err instanceof Error ? err.message : String(err) })
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

/**
 * One-shot seed from `LICENSE_REGISTRY_JSON` if KV is empty. Runs at most
 * once per process; the result is intentionally not awaited from every
 * call site — only from the public load/find paths below.
 */
async function maybeSeedFromEnv(): Promise<void> {
  if (seedAttempted) return
  seedAttempted = true
  const ids = await storage.zrange(KEY_INDEX, 0, 0)
  if (ids.length > 0) return // already populated
  const fromEnv = parseRegistryEnv()
  if (!fromEnv || fromEnv.length === 0) return
  for (const rec of fromEnv) {
    await writeRecord(rec)
  }
  logger.info("license-store seeded from env", { count: fromEnv.length, backend: storage.backend })
}

async function writeRecord(record: LicenseRecord): Promise<void> {
  const normalized = normalizeRecord(record)
  await storage.set(KEY_LICENSE(normalized.licenseId), normalized)
  // sorted-set score = issuedAt epoch ms so listings have a stable order.
  const score = Date.parse(normalized.issuedAt) || Date.now()
  await storage.zadd(KEY_INDEX, score, normalized.licenseId)
}

/** Load every license record from the active backend. */
export async function loadAll(): Promise<LicenseRecord[]> {
  await maybeSeedFromEnv()
  const ids = await storage.zrange(KEY_INDEX, 0, -1)
  if (ids.length === 0) return []
  const out: LicenseRecord[] = []
  for (const id of ids) {
    const rec = await storage.get<LicenseRecord>(KEY_LICENSE(id))
    if (rec) out.push(normalizeRecord(rec))
  }
  return out
}

/** Persist the full set. Used by admin "import all" flows; routes prefer `upsert`. */
export async function saveAll(records: LicenseRecord[]): Promise<void> {
  // We don't truncate the index — caller-provided list is treated as an
  // additive upsert. For destructive replacement, callers should explicitly
  // delete records first (none currently do).
  for (const rec of records) {
    await writeRecord(rec)
  }
}

export async function findById(id: string): Promise<LicenseRecord | null> {
  await maybeSeedFromEnv()
  const rec = await storage.get<LicenseRecord>(KEY_LICENSE(id))
  return rec ? normalizeRecord(rec) : null
}

/** Insert or replace a record by licenseId. */
export async function upsert(record: LicenseRecord): Promise<void> {
  await maybeSeedFromEnv()
  await writeRecord(record)
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
