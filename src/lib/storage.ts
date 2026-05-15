// Unified storage abstraction.
//
// In production we use Vercel KV (Redis) so license records, rate-limit
// counters and audit-log entries survive serverless cold starts and are
// shared across concurrent function invocations.
//
// In local dev ??when no complete `KV_REST_API_URL` / `KV_REST_API_TOKEN`
// pair is set ??we fall back
// to a process-local in-memory implementation that mirrors the Redis-style
// API (hashes, sorted sets, lists, TTLs). That keeps `npm run dev` and the
// build green on a fresh checkout, with a one-time warning so it is obvious
// the data will not persist.
//
// Calling code only ever depends on the `Storage` interface ??swapping the
// backend stays a one-file change.

import { kv } from "@vercel/kv"
import { logger } from "./logger"

// ---- Public types -----------------------------------------------------

export interface StoragePipeline {
  set(key: string, value: unknown, ttlSeconds?: number): StoragePipeline
  del(key: string): StoragePipeline
  hset(key: string, field: string, value: unknown): StoragePipeline
  hdel(key: string, field: string): StoragePipeline
  zadd(key: string, score: number, member: string): StoragePipeline
  incr(key: string): StoragePipeline
  expire(key: string, ttlSeconds: number): StoragePipeline
  lpush(key: string, value: unknown): StoragePipeline
  ltrim(key: string, start: number, stop: number): StoragePipeline
  exec(): Promise<unknown[]>
}

export interface Storage {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
  hget<T>(key: string, field: string): Promise<T | null>
  hset(key: string, field: string, value: unknown): Promise<void>
  hgetall<T>(key: string): Promise<Record<string, T>>
  hdel(key: string, field: string): Promise<void>
  hkeys(key: string): Promise<string[]>
  zadd(key: string, score: number, member: string): Promise<void>
  zrange(key: string, start: number, stop: number): Promise<string[]>
  incr(key: string): Promise<number>
  expire(key: string, ttlSeconds: number): Promise<void>
  // List ops (used by audit log).
  lpush(key: string, value: unknown): Promise<number>
  ltrim(key: string, start: number, stop: number): Promise<void>
  lrange<T>(key: string, start: number, stop: number): Promise<T[]>
  llen(key: string): Promise<number>
  // Discriminator for tests / instrumentation.
  readonly backend: "kv" | "memory"
  pipeline(): StoragePipeline
}

// ---- KV (production) backend -----------------------------------------

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

function createKvStorage(): Storage {
  // @vercel/kv accepts most Redis-style ops directly. Some methods (zadd,
  // hset) take object-shaped args ??we adapt at the boundary so the rest
  // of the codebase only ever sees the simple positional form.
  return {
    backend: "kv",
    async get<T>(key: string): Promise<T | null> {
      const v = await kv.get<T>(key)
      return v ?? null
    },
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      if (typeof ttlSeconds === "number" && ttlSeconds > 0) {
        await kv.set(key, value, { ex: ttlSeconds })
      } else {
        await kv.set(key, value)
      }
    },
    async del(key: string): Promise<void> {
      await kv.del(key)
    },
    async hget<T>(key: string, field: string): Promise<T | null> {
      const v = await kv.hget<T>(key, field)
      return (v as T | null) ?? null
    },
    async hset(key: string, field: string, value: unknown): Promise<void> {
      await kv.hset(key, { [field]: value })
    },
    async hgetall<T>(key: string): Promise<Record<string, T>> {
      const all = await kv.hgetall<Record<string, T>>(key)
      return all ?? {}
    },
    async hdel(key: string, field: string): Promise<void> {
      await kv.hdel(key, field)
    },
    async hkeys(key: string): Promise<string[]> {
      const keys = (await kv.hkeys(key)) as string[] | null
      return keys ?? []
    },
    async zadd(key: string, score: number, member: string): Promise<void> {
      await kv.zadd(key, { score, member })
    },
    async zrange(key: string, start: number, stop: number): Promise<string[]> {
      const out = (await kv.zrange(key, start, stop)) as string[] | null
      return out ?? []
    },
    async incr(key: string): Promise<number> {
      return (await kv.incr(key)) as number
    },
    async expire(key: string, ttlSeconds: number): Promise<void> {
      await kv.expire(key, ttlSeconds)
    },
    async lpush(key: string, value: unknown): Promise<number> {
      return (await kv.lpush(key, value as string)) as number
    },
    async ltrim(key: string, start: number, stop: number): Promise<void> {
      await kv.ltrim(key, start, stop)
    },
    async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
      const out = (await kv.lrange(key, start, stop)) as T[] | null
      return out ?? []
    },
    async llen(key: string): Promise<number> {
      return (await kv.llen(key)) as number
    },
    pipeline(): StoragePipeline {
      const p = kv.pipeline()
      const wrapper: StoragePipeline = {
        set(key, value, ttlSeconds) {
          if (typeof ttlSeconds === "number" && ttlSeconds > 0) {
            p.set(key, value, { ex: ttlSeconds })
          } else {
            p.set(key, value)
          }
          return wrapper
        },
        del(key) {
          p.del(key)
          return wrapper
        },
        hset(key, field, value) {
          p.hset(key, { [field]: value })
          return wrapper
        },
        hdel(key, field) {
          p.hdel(key, field)
          return wrapper
        },
        zadd(key, score, member) {
          p.zadd(key, { score, member })
          return wrapper
        },
        incr(key) {
          p.incr(key)
          return wrapper
        },
        expire(key, ttlSeconds) {
          p.expire(key, ttlSeconds)
          return wrapper
        },
        lpush(key, value) {
          p.lpush(key, value as string)
          return wrapper
        },
        ltrim(key, start, stop) {
          p.ltrim(key, start, stop)
          return wrapper
        },
        async exec() {
          return (await p.exec()) as unknown[]
        },
      }
      return wrapper
    },
  }
}

// ---- In-memory (dev / fallback) backend -------------------------------

interface MemValue {
  value: unknown
  expiresAt?: number // epoch ms
}

function createMemoryStorage(): Storage {
  const kvMap = new Map<string, MemValue>()
  const hashes = new Map<string, Map<string, unknown>>()
  const sortedSets = new Map<string, Map<string, number>>()
  const lists = new Map<string, unknown[]>()

  // Lazy expiry: only check on read.
  function expired(v: MemValue | undefined): boolean {
    return Boolean(v?.expiresAt && v.expiresAt <= Date.now())
  }
  function getRaw<T>(key: string): T | null {
    const v = kvMap.get(key)
    if (!v) return null
    if (expired(v)) {
      kvMap.delete(key)
      return null
    }
    return v.value as T
  }

  function clone<T>(v: T): T {
    // Cheap deep clone ??license records are small and JSON-safe.
    if (v === null || v === undefined) return v
    return JSON.parse(JSON.stringify(v)) as T
  }

  return {
    backend: "memory",
    async get<T>(key: string): Promise<T | null> {
      const v = getRaw<T>(key)
      return v === null ? null : clone(v)
    },
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      const expiresAt =
        typeof ttlSeconds === "number" && ttlSeconds > 0
          ? Date.now() + ttlSeconds * 1000
          : undefined
      kvMap.set(key, { value: clone(value), expiresAt })
    },
    async del(key: string): Promise<void> {
      kvMap.delete(key)
      hashes.delete(key)
      sortedSets.delete(key)
      lists.delete(key)
    },
    async hget<T>(key: string, field: string): Promise<T | null> {
      const h = hashes.get(key)
      if (!h) return null
      const v = h.get(field)
      return v === undefined ? null : clone(v as T)
    },
    async hset(key: string, field: string, value: unknown): Promise<void> {
      let h = hashes.get(key)
      if (!h) {
        h = new Map()
        hashes.set(key, h)
      }
      h.set(field, clone(value))
    },
    async hgetall<T>(key: string): Promise<Record<string, T>> {
      const h = hashes.get(key)
      if (!h) return {}
      const out: Record<string, T> = {}
      for (const [f, v] of h) out[f] = clone(v as T)
      return out
    },
    async hdel(key: string, field: string): Promise<void> {
      hashes.get(key)?.delete(field)
    },
    async hkeys(key: string): Promise<string[]> {
      const h = hashes.get(key)
      return h ? [...h.keys()] : []
    },
    async zadd(key: string, score: number, member: string): Promise<void> {
      let z = sortedSets.get(key)
      if (!z) {
        z = new Map()
        sortedSets.set(key, z)
      }
      z.set(member, score)
    },
    async zrange(key: string, start: number, stop: number): Promise<string[]> {
      const z = sortedSets.get(key)
      if (!z) return []
      const sorted = [...z.entries()].sort((a, b) => a[1] - b[1]).map(([m]) => m)
      // Redis-style inclusive stop. -1 means "to end".
      const end = stop < 0 ? sorted.length + stop + 1 : stop + 1
      return sorted.slice(start, end)
    },
    async incr(key: string): Promise<number> {
      const cur = (getRaw<number>(key) as number | null) ?? 0
      const next = cur + 1
      const existing = kvMap.get(key)
      kvMap.set(key, { value: next, expiresAt: existing?.expiresAt })
      return next
    },
    async expire(key: string, ttlSeconds: number): Promise<void> {
      const existing = kvMap.get(key)
      if (!existing) return
      existing.expiresAt = Date.now() + ttlSeconds * 1000
    },
    async lpush(key: string, value: unknown): Promise<number> {
      let l = lists.get(key)
      if (!l) {
        l = []
        lists.set(key, l)
      }
      l.unshift(clone(value))
      return l.length
    },
    async ltrim(key: string, start: number, stop: number): Promise<void> {
      const l = lists.get(key)
      if (!l) return
      const end = stop < 0 ? l.length + stop + 1 : stop + 1
      const trimmed = l.slice(start, end)
      lists.set(key, trimmed)
    },
    async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
      const l = lists.get(key)
      if (!l) return []
      const end = stop < 0 ? l.length + stop + 1 : stop + 1
      return l.slice(start, end).map((v) => clone(v as T))
    },
    async llen(key: string): Promise<number> {
      return lists.get(key)?.length ?? 0
    },
    pipeline(): StoragePipeline {
      // Naive sequential implementation. Fine for dev ??we never rely on
      // pipeline() for atomicity, only for round-trip reduction in prod.
      const ops: Array<() => Promise<unknown>> = []
      const self = createMemoryStorageRefThunk()
      const wrapper: StoragePipeline = {
        set(key, value, ttlSeconds) {
          ops.push(() => self().set(key, value, ttlSeconds))
          return wrapper
        },
        del(key) {
          ops.push(() => self().del(key))
          return wrapper
        },
        hset(key, field, value) {
          ops.push(() => self().hset(key, field, value))
          return wrapper
        },
        hdel(key, field) {
          ops.push(() => self().hdel(key, field))
          return wrapper
        },
        zadd(key, score, member) {
          ops.push(() => self().zadd(key, score, member))
          return wrapper
        },
        incr(key) {
          ops.push(() => self().incr(key))
          return wrapper
        },
        expire(key, ttlSeconds) {
          ops.push(() => self().expire(key, ttlSeconds))
          return wrapper
        },
        lpush(key, value) {
          ops.push(() => self().lpush(key, value))
          return wrapper
        },
        ltrim(key, start, stop) {
          ops.push(() => self().ltrim(key, start, stop))
          return wrapper
        },
        async exec() {
          const results: unknown[] = []
          for (const op of ops) results.push(await op())
          return results
        },
      }
      return wrapper
    },
  }

  // Tiny helper so the pipeline closes over the live `storage` instance
  // even though it's created by the same call. Keeps it self-contained.
  function createMemoryStorageRefThunk(): () => Storage {
    return () => memorySingleton
  }
}

// ---- Singleton selection ---------------------------------------------

let warnedNoKv = false
function warnNoKvOnce(): void {
  if (warnedNoKv) return
  warnedNoKv = true
  logger.warn(
    "Using in-memory storage - data will not persist across cold starts. Set KV_REST_API_URL and KV_REST_API_TOKEN for production.",
    { component: "storage" },
  )
}

function createStorage(): Storage {
  if (isKvConfigured()) {
    return createKvStorage()
  }
  warnNoKvOnce()
  return createMemoryStorage()
}

// We need a singleton handle for the in-memory pipeline thunk above. The
// module-level `storage` export below is that singleton ??we resolve the
// circular reference by holding a `let` binding and assigning it before
// any call site can reach it (top-level `createStorage()`).
let memorySingleton: Storage
export const storage: Storage = (() => {
  const s = createStorage()
  memorySingleton = s
  return s
})()
