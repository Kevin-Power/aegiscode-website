"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PAGES = 3

export default function ReportFlip() {
  const [page, setPage] = useState(0)

  const prev = useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
  const next = useCallback(() => setPage((p) => Math.min(PAGES - 1, p + 1)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return
      }
      if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-3xl font-bold">月報預覽 — 3 頁節錄</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-gray-400">
          匿名化情境範本，展示董事會層級可閱讀的版面。完整月報範本可在資源中心下載。
        </p>

        <div className="relative rounded-2xl border border-[#243447] bg-[#0F1923] p-6 sm:p-10">
          <div
            className="aspect-[4/5] overflow-hidden sm:aspect-[16/10]"
            role="region"
            aria-label={`月報預覽 第 ${page + 1} 頁,共 ${PAGES} 頁`}
            aria-live="polite"
          >
            {page === 0 && <ReportPage1 />}
            {page === 1 && <ReportPage2 />}
            {page === 2 && <ReportPage3 />}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={page === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-[#243447] px-4 py-2 text-sm text-gray-300 transition hover:border-sky-300/50 disabled:opacity-40"
              aria-label="上一頁"
            >
              <ChevronLeft className="h-4 w-4" /> 上一頁
            </button>
            <div className="text-xs text-gray-500">{page + 1} / {PAGES}</div>
            <button
              type="button"
              onClick={next}
              disabled={page === PAGES - 1}
              className="inline-flex items-center gap-2 rounded-lg border border-[#243447] px-4 py-2 text-sm text-gray-300 transition hover:border-sky-300/50 disabled:opacity-40"
              aria-label="下一頁"
            >
              下一頁 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/resources"
            className="text-sm text-sky-300 underline-offset-4 hover:underline"
          >
            下載完整 CISO 月報範本 →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ReportPage1() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#243447] pb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">CISO Monthly Report</div>
        <div className="mt-1 text-lg font-semibold text-white">2026 Q2 · 某金控 BU</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { v: "78", l: "平均分數" },
          { v: "+3", l: "30 天變化" },
          { v: "2", l: "P0 待修" },
        ].map((it) => (
          <div key={it.l} className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
            <div className="text-2xl font-bold text-sky-300">{it.v}</div>
            <div className="mt-1 text-xs text-gray-500">{it.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Top 3 風險</div>
        <ul className="mt-2 space-y-1 text-sm leading-6 text-gray-200">
          <li>• 公開可見舊版 TLS · <span className="text-red-300">Critical</span></li>
          <li>• 第三方 API 暴露 admin 端點 · <span className="text-amber-300">High</span></li>
          <li>• DMARC 政策未設定 · <span className="text-amber-300">High</span></li>
        </ul>
      </div>
    </div>
  )
}

function ReportPage2() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#243447] pb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Domain Top Backlog</div>
        <div className="mt-1 text-lg font-semibold text-white">P0 / P1 修補任務</div>
      </div>
      <div className="mt-5 space-y-2 text-sm">
        {[
          ["P0", "升級 TLS 至 1.3", "基礎建設 BU", "16 hr"],
          ["P0", "修補暴露管理端點", "Web 平台 BU", "8 hr"],
          ["P1", "設定 DMARC 嚴格模式", "資安 BU", "4 hr"],
          ["P1", "下架已停用子網域", "DevOps BU", "6 hr"],
          ["P1", "升級內部 CA 憑證", "基礎建設 BU", "12 hr"],
        ].map(([p, name, owner, eta]) => (
          <div key={name} className="grid grid-cols-[40px_1.4fr_1fr_60px] items-center gap-3 rounded border border-[#243447] bg-[#1A2332] px-3 py-2">
            <span className={p === "P0" ? "text-red-300 font-semibold" : "text-amber-300 font-semibold"}>{p}</span>
            <span className="text-gray-200">{name}</span>
            <span className="text-xs text-gray-500">{owner}</span>
            <span className="text-right text-xs text-gray-400">{eta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportPage3() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#243447] pb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">法規對應 + ROI 試算</div>
        <div className="mt-1 text-lg font-semibold text-white">合規地圖</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { law: "資安法 §17", item: "持續監測作業", status: "已對應" },
          { law: "個資法 §27", item: "技術安全措施", status: "已對應" },
          { law: "ISO 27001 A.5.7", item: "Threat intelligence", status: "已對應" },
        ].map((c) => (
          <div key={c.law} className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
            <div className="text-xs font-semibold text-sky-300">{c.law}</div>
            <div className="mt-1 text-xs text-gray-300">{c.item}</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#5EEAD4]">{c.status}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-[#243447] bg-[#1A2332] p-4 text-sm leading-7 text-gray-200">
        本月修補預估投入 46 工時,以平均加班成本估算,持續治理投入 vs 一次性外包顧問報告,年度可節省約 35% 治理成本。
      </div>
    </div>
  )
}
