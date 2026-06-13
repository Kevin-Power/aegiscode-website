"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, FileText, Scale, Sparkles, X } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Asset {
  id: string
  publicHref?: string // when set, asset is public — no gating
  title: string
  desc: string
  bullets: string[]
  readTime: string
  icon: typeof FileText
}

const assets: Asset[] = [
  {
    id: "surface-proposal.pdf",
    title: "AegisCode Surface 服務說明書",
    desc: "完整年度顧問訂閱方案、交付物、客戶責任與簽約流程,可作為 RFP / 內部簡報附件。",
    bullets: [
      "年度服務範圍與交付節奏",
      "三層方案差異與適用情境",
      "簽約啟動到首份月報的時程",
    ],
    readTime: "10 分鐘讀完",
    icon: FileText,
  },
  {
    id: "ciso-monthly-sample.pdf",
    title: "CISO 月報範本(匿名化)",
    desc: "真實顧客月報的匿名化版本,讓 CISO 在簽約前先看到「我們交付什麼」。",
    bullets: [
      "風險量化、趨勢與 Top Backlog",
      "台灣法規對應條目",
      "修補 ROI 與工時估算",
    ],
    readTime: "12 分鐘讀完",
    icon: Sparkles,
  },
  {
    id: "tw-compliance-matrix.pdf",
    publicHref: "/downloads/tw-compliance-matrix.pdf",
    title: "台灣法規對應一覽表",
    desc: "資通安全管理法 × 個資法 × ISO 27001:2022,AegisCode 對應條目的一頁速查表。",
    bullets: [
      "三條法規並列對照",
      "可貼進稽核準備文件",
      "持續更新,公開索引",
    ],
    readTime: "3 分鐘讀完",
    icon: Scale,
  },
]

function DownloadModal({
  asset,
  onClose,
}: {
  asset: Asset
  onClose: () => void
}) {
  const [companyName, setCompanyName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          contactEmail,
          companyName,
        }),
      })
      const data = (await r.json()) as Record<string, unknown>
      if (!r.ok) {
        setError((data.error as string) || `Request failed (${r.status})`)
      } else {
        setDownloadUrl(data.url as string)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold">{asset.title}</h2>
        <p className="mt-2 text-sm text-gray-400">
          填寫聯絡資訊,系統會即時產生 5 分鐘內可下載的連結。
        </p>
        {downloadUrl ? (
          <div className="mt-6 space-y-3">
            <a
              href={downloadUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F766E]"
            >
              <Download className="h-4 w-4" />
              開始下載
            </a>
            <p className="text-xs text-gray-500">
              連結 5 分鐘後失效。如需再次下載,請重新填寫。
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {error ? (
              <div className="rounded-lg border border-red-700/50 bg-red-900/20 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                公司名稱
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                maxLength={200}
                className="w-full rounded-lg border border-[#243447] bg-[#0D1521] px-3 py-2 text-gray-100 outline-none focus:border-[#0D9488]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                公司信箱
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#243447] bg-[#0D1521] px-3 py-2 text-gray-100 outline-none focus:border-[#0D9488]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#0D9488] py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E] disabled:opacity-50"
            >
              {submitting ? "送出中..." : "產生下載連結"}
            </button>
            <p className="text-center text-xs text-gray-500">
              我們不會出售或轉交您的聯絡資訊。
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [active, setActive] = useState<Asset | null>(null)

  return (
    <main className="min-h-screen overflow-x-hidden break-all bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
              資安治理資產下載中心
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-gray-400">
              業務與客戶在 RFP、簽約前評估與內部簡報常用的素材。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const Icon = asset.icon
              return (
                <div
                  key={asset.id}
                  className="flex flex-col rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#5EEAD4]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{asset.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {asset.desc}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
                    {asset.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                  <div className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-500">
                    {asset.readTime}
                  </div>
                  {asset.publicHref ? (
                    <a
                      href={asset.publicHref}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#243447] px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-[#14B8A6] hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      直接下載
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(asset)}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
                    >
                      <Download className="h-4 w-4" />
                      填寫後下載
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-12 rounded-xl border border-[#243447] bg-[#0F1923]/50 p-5 text-sm text-gray-400">
            想看完整功能,可直接{" "}
            <Link
              href="/trial?track=SURFACE"
              className="text-[#5EEAD4] hover:underline"
            >
              預約 Surface 諮詢
            </Link>
            ,顧問會在 1-2 個工作天內聯繫。
          </div>
        </div>
      </section>
      {active ? (
        <DownloadModal asset={active} onClose={() => setActive(null)} />
      ) : null}
      <Footer />
    </main>
  )
}
