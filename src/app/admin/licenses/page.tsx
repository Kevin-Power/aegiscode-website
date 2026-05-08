"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

interface LicenseRow {
  licenseId: string
  customerName: string
  tier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE"
  issuedAt: string
  expiresAt: string
  revoked: boolean
  revokedAt?: string
  revokeReason?: string
  hardwareFingerprint?: string
  lastHeartbeatAt?: string
  lastHeartbeatIp?: string
  heartbeatCount: number
  status: "active" | "revoked" | "expired"
}

const TOKEN_KEY = "aegiscode_admin_token"

function loadToken(): string | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

function saveToken(token: string) {
  window.sessionStorage.setItem(TOKEN_KEY, token)
  // 12-hour cookie for any server-rendered admin tools (currently unused).
  document.cookie = `admin_token=${encodeURIComponent(token)}; Path=/; Max-Age=43200; SameSite=Strict`
}

function clearToken() {
  window.sessionStorage.removeItem(TOKEN_KEY)
  document.cookie = "admin_token=; Path=/; Max-Age=0"
}

function badgeClasses(status: LicenseRow["status"]): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    case "revoked":
      return "bg-rose-500/15 text-rose-300 border-rose-500/40"
    case "expired":
      return "bg-amber-500/15 text-amber-300 border-amber-500/40"
  }
}

function fmtDate(iso?: string): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC"
  } catch {
    return iso
  }
}

export default function AdminLicensesPage() {
  const [token, setToken] = useState<string | null>(null)
  const [tokenInput, setTokenInput] = useState("")
  const [licenses, setLicenses] = useState<LicenseRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const t = loadToken()
    if (t) setToken(t)
  }, [])

  const refresh = useCallback(async (authToken: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/licenses", {
        headers: { "x-admin-token": authToken },
        cache: "no-store",
      })
      if (res.status === 401) {
        clearToken()
        setToken(null)
        setLicenses(null)
        setError("Token rejected")
        return
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = (await res.json()) as { licenses: LicenseRow[] }
      setLicenses(data.licenses)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) void refresh(token)
  }, [token, refresh])

  const onSubmitToken = (e: React.FormEvent) => {
    e.preventDefault()
    const t = tokenInput.trim()
    if (!t) return
    saveToken(t)
    setToken(t)
    setTokenInput("")
  }

  const onRevoke = async (row: LicenseRow) => {
    if (!token) return
    const reason = window.prompt(
      `Revoke license ${row.licenseId} (${row.customerName})?\nEnter a reason:`,
      "",
    )
    if (reason === null) return
    try {
      const res = await fetch(
        `/api/admin/licenses/${encodeURIComponent(row.licenseId)}/revoke`,
        {
          method: "POST",
          headers: {
            "x-admin-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        },
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await refresh(token)
    } catch (err) {
      window.alert(`Revoke failed: ${err instanceof Error ? err.message : err}`)
    }
  }

  const sorted = useMemo(() => {
    if (!licenses) return []
    return [...licenses].sort((a, b) => a.licenseId.localeCompare(b.licenseId))
  }, [licenses])

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-6 py-24">
        <h1 className="text-2xl font-semibold mb-6">License Admin</h1>
        <p className="text-sm text-white/60 mb-4">
          Enter the <code className="text-white/80">ADMIN_TOKEN</code> configured on
          this deployment. The token is held in <code>sessionStorage</code> for the
          duration of this tab.
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
          <h1 className="text-2xl font-semibold">License Admin</h1>
          <p className="text-sm text-white/60">
            {licenses?.length ?? 0} license{licenses?.length === 1 ? "" : "s"} on
            record
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/audit-log"
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Audit log
          </Link>
          <button
            onClick={() => setShowRegister((v) => !v)}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            {showRegister ? "Cancel" : "Register license"}
          </button>
          <button
            onClick={() => token && refresh(token)}
            disabled={loading}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={() => {
              clearToken()
              setToken(null)
              setLicenses(null)
            }}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>

      {showRegister && (
        <RegisterForm
          token={token}
          onDone={() => {
            setShowRegister(false)
            if (token) void refresh(token)
          }}
        />
      )}

      {error && (
        <div className="mb-6 rounded-md border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-white/60">
            <tr>
              <th className="px-4 py-3">License ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Last heartbeat</th>
              <th className="px-4 py-3">Heartbeats</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-white/40">
                  No licenses registered yet.
                </td>
              </tr>
            )}
            {sorted.map((row) => (
              <tr key={row.licenseId} className="hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{row.licenseId}</td>
                <td className="px-4 py-3">{row.customerName}</td>
                <td className="px-4 py-3 text-xs text-white/70">{row.tier}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${badgeClasses(row.status)}`}
                  >
                    {row.status}
                  </span>
                  {row.status === "revoked" && row.revokeReason && (
                    <div className="mt-1 text-xs text-white/50">
                      {row.revokeReason}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-white/70">
                  {fmtDate(row.expiresAt)}
                </td>
                <td className="px-4 py-3 text-xs text-white/70">
                  {fmtDate(row.lastHeartbeatAt)}
                </td>
                <td className="px-4 py-3 text-xs text-white/70">
                  {row.heartbeatCount}
                </td>
                <td className="px-4 py-3 text-right">
                  {!row.revoked && (
                    <button
                      onClick={() => onRevoke(row)}
                      className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function RegisterForm({
  token,
  onDone,
}: {
  token: string
  onDone: () => void
}) {
  const [licenseId, setLicenseId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [tier, setTier] = useState<"STARTER" | "PROFESSIONAL" | "ENTERPRISE">(
    "PROFESSIONAL",
  )
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErr(null)
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "x-admin-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseId: licenseId.trim(),
          customerName: customerName.trim(),
          tier,
          expiresAt: new Date(expiresAt).toISOString(),
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      onDone()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input
          required
          placeholder="licenseId (e.g. AC-2026-001)"
          value={licenseId}
          onChange={(e) => setLicenseId(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
        />
        <input
          required
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
        />
        <select
          value={tier}
          onChange={(e) =>
            setTier(e.target.value as "STARTER" | "PROFESSIONAL" | "ENTERPRISE")
          }
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
        >
          <option value="STARTER">STARTER</option>
          <option value="PROFESSIONAL">PROFESSIONAL</option>
          <option value="ENTERPRISE">ENTERPRISE</option>
        </select>
        <input
          required
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-[#0D1521] hover:bg-white/90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Register"}
        </button>
        {err && <span className="text-sm text-rose-400">{err}</span>}
      </div>
    </form>
  )
}
