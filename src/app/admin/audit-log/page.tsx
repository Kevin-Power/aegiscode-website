"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

interface AuditEntry {
  ts: string
  action: string
  licenseId?: string
  reason?: string
  adminIp?: string
  customerName?: string
  tier?: string
  expiresAt?: string
  [extra: string]: unknown
}

interface ApiResponse {
  entries: AuditEntry[]
  limit: number
  offset: number
  action: string | null
  truncated: boolean
}

const TOKEN_KEY = "aegiscode_admin_token"
const PAGE_SIZE = 100

const KNOWN_ACTIONS = ["REGISTER", "REVOKE", "TRIAL_SIGNUP", "STRIPE_CHECKOUT"] as const

function loadToken(): string | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

function saveToken(token: string) {
  window.sessionStorage.setItem(TOKEN_KEY, token)
  document.cookie = `admin_token=${encodeURIComponent(token)}; Path=/; Max-Age=43200; SameSite=Strict`
}

function clearToken() {
  window.sessionStorage.removeItem(TOKEN_KEY)
  document.cookie = "admin_token=; Path=/; Max-Age=0"
}

function fmtDate(iso?: string): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toISOString().replace("T", " ").slice(0, 19) + " UTC"
  } catch {
    return iso
  }
}

function actionBadgeClasses(action: string): string {
  switch (action) {
    case "REGISTER":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    case "REVOKE":
      return "bg-rose-500/15 text-rose-300 border-rose-500/40"
    case "TRIAL_SIGNUP":
      return "bg-sky-500/15 text-sky-300 border-sky-500/40"
    case "STRIPE_CHECKOUT":
      return "bg-violet-500/15 text-violet-300 border-violet-500/40"
    default:
      return "bg-white/10 text-white/70 border-white/20"
  }
}

export default function AdminAuditLogPage() {
  const [token, setToken] = useState<string | null>(null)
  const [tokenInput, setTokenInput] = useState("")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionFilter, setActionFilter] = useState<string>("")
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const t = loadToken()
    if (t) setToken(t)
  }, [])

  const refresh = useCallback(
    async (authToken: string, opts: { offset: number; action: string }) => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set("limit", String(PAGE_SIZE))
        params.set("offset", String(opts.offset))
        if (opts.action) params.set("action", opts.action)
        const res = await fetch(`/api/admin/audit-log?${params.toString()}`, {
          headers: { "x-admin-token": authToken },
          cache: "no-store",
        })
        if (res.status === 401) {
          clearToken()
          setToken(null)
          setData(null)
          setError("Token rejected")
          return
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as ApiResponse
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (token) void refresh(token, { offset, action: actionFilter })
  }, [token, refresh, offset, actionFilter])

  const onSubmitToken = (e: React.FormEvent) => {
    e.preventDefault()
    const t = tokenInput.trim()
    if (!t) return
    saveToken(t)
    setToken(t)
    setTokenInput("")
  }

  const entries = useMemo(() => data?.entries ?? [], [data])

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-6 py-24">
        <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>
        <p className="text-sm text-white/60 mb-4">
          Enter the <code className="text-white/80">ADMIN_TOKEN</code> configured on
          this deployment.
        </p>
        <form onSubmit={onSubmitToken} className="flex gap-2">
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="admin token"
            className="flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-md bg-white text-[#0D1521] px-4 py-2 text-sm font-medium hover:bg-white/90"
          >
            Sign in
          </button>
        </form>
        {error && <p className="text-rose-400 text-sm mt-4">{error}</p>}
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Audit Log</h1>
          <p className="text-sm text-white/60">
            {entries.length} entr{entries.length === 1 ? "y" : "ies"} on this page
            {data?.truncated && " (more available — narrow your filter)"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/licenses"
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Licenses
          </Link>
          <button
            onClick={() => token && refresh(token, { offset, action: actionFilter })}
            disabled={loading}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={() => {
              clearToken()
              setToken(null)
              setData(null)
            }}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-white/50">Filter:</span>
        <button
          onClick={() => {
            setActionFilter("")
            setOffset(0)
          }}
          className={`rounded border px-2 py-1 text-xs ${actionFilter === "" ? "border-white/60 bg-white/10" : "border-white/20 hover:bg-white/5"}`}
        >
          ALL
        </button>
        {KNOWN_ACTIONS.map((a) => (
          <button
            key={a}
            onClick={() => {
              setActionFilter(a)
              setOffset(0)
            }}
            className={`rounded border px-2 py-1 text-xs ${actionFilter === a ? "border-white/60 bg-white/10" : "border-white/20 hover:bg-white/5"}`}
          >
            {a}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-white/60">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">License ID</th>
              <th className="px-4 py-3">Admin IP</th>
              <th className="px-4 py-3">Reason / Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  No audit entries.
                </td>
              </tr>
            )}
            {entries.map((e, i) => (
              <tr key={`${e.ts}-${i}`} className="hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs text-white/80">
                  {fmtDate(e.ts)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${actionBadgeClasses(e.action)}`}
                  >
                    {e.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{e.licenseId ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/70">
                  {e.adminIp ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-white/70">
                  {e.reason ?? e.customerName ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-white/60">
        <div>
          Showing entries {offset + 1}–{offset + entries.length}
          {actionFilter && ` filtered by ${actionFilter}`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0 || loading}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5 disabled:opacity-30"
          >
            ← Newer
          </button>
          <button
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={entries.length < PAGE_SIZE || loading}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5 disabled:opacity-30"
          >
            Older →
          </button>
        </div>
      </div>
    </main>
  )
}
