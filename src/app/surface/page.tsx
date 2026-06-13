import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileText,
  Gauge,
  Globe,
  Globe2,
  Scale,
  Sparkles,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SurfaceProofStrip from "@/components/surface-proof-strip"
import OutcomeVignette from "@/components/outcome-vignette"
import ReportFlip from "@/components/report-flip"
import ServiceCadence from "@/components/service-cadence"
import ProductFaq from "@/components/product-faq"

const capabilities = [
  {
    icon: Globe2,
    title: "外部評分整合",
    desc: "可搭配外部評分或既有 EASM,把曝險訊號彙整成單一治理視圖。",
  },
  {
    icon: Sparkles,
    title: "AI 修補建議",
    desc: "依弱點類型整理優先級、修補步驟、驗證方式與工時估算。",
  },
  {
    icon: Scale,
    title: "台灣法規對應",
    desc: "對應資安法、個資法與 ISO 27001,讓技術修補可被稽核理解。",
  },
  {
    icon: FileText,
    title: "顧問級 CISO 月報",
    desc: "風險量化、趨勢、Top Backlog、法規對應與 ROI 試算,一份可以呈交董事會的 PDF。",
  },
]

const versusRows: Array<[string, string, string]> = [
  ["原始評分視圖", "中文化治理工作流", "Surface 補上"],
  ["弱點清單", "修補優先順序 + 工時 + ROI", "Surface 補上"],
  ["國際標準對照", "台灣法規條目對應", "Surface 補上"],
  ["技術 dashboard", "管理層可讀月報 + 顧問解讀", "Surface 補上"],
  ["外部視角", "外部 + 內部 + 供應商整合視圖", "Surface 補上"],
]

const outcomeCards = [
  {
    icon: Building2,
    scenario: "某金控供應商風險治理",
    pain: "供應商資安狀況散落在 Excel,無法即時通報董事會",
    outcome: "統一供應商 portfolio + 月報視圖,管理層每月掌握",
  },
  {
    icon: Briefcase,
    scenario: "某政府機關外部曝險合規申報",
    pain: "原生評分 dashboard 是英文,無法直接對應台灣法規申報",
    outcome: "中文化治理視圖 + 法規對應 evidence,稽核可直接引用",
  },
  {
    icon: Globe,
    scenario: "某跨國 SaaS 子公司 Portfolio 治理",
    pain: "多 Domain 分散在地區,風險視圖無法整併",
    outcome: "統一 Portfolio 月報,跨子公司風險可量化比較",
  },
]

const productFaqItems = [
  {
    q: "SecurityScorecard / BitSight 本來就有 dashboard,為什麼還需要 Surface?",
    a: "原生 dashboard 提供的是原始視圖。Surface 提供的是中文化治理平台、修補優先順序、法規對應、風險量化與顧問交付月報——這些才是管理層真正會閱讀的內容。Surface 不取代外部評分平台,它把評分轉成董事會看得懂的治理結論。",
  },
  {
    q: "為什麼是年度訂閱不是一次買斷?",
    a: "外部攻擊面是持續變動的。重要的不是今天掃到什麼,而是未來 12 個月風險能不能持續下降。所以這更適合年度治理服務,而非一次性專案。",
  },
  {
    q: "報價怎麼算?",
    a: "依 Domain / Portfolio 數量、會議頻率與顧問參與深度而定。我們會在諮詢階段釐清您的範圍後提供正式報價,不在公開頁面揭露絕對金額。",
  },
  {
    q: "首次月報多久能交付?",
    a: "簽約後 30 天內交付首份正式 CISO 月報,涵蓋 Top 風險、Domain backlog、法規對應與 ROI 試算。",
  },
]

export const metadata = {
  title: "AegisCode Surface — 外部攻擊面治理 | AegisCode",
  description:
    "AegisCode Surface 是外部攻擊面年度治理服務,結合 SecurityScorecard / BitSight 評分、AI 修補建議、台灣法規對應與顧問級 CISO 月報。",
}

export default function SurfacePage() {
  return (
    <main className="min-h-screen overflow-x-hidden break-all bg-[#0D1521] text-white">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-medium text-sky-200">
            <Globe2 className="h-4 w-4" />
            AegisCode Surface · 年度顧問訂閱
          </div>
          <h1 className="max-w-full text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:break-words">
            <span className="block">外部攻擊面</span>
            <span className="block">年度治理服務</span>
            <span className="block">把評分變成</span>
            <span className="block">董事會看得懂的報告。</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            AegisCode Surface 是外部攻擊面年度治理服務。它把外部評分、供應商風險、修補優先順序、台灣法規對應與顧問月報整合,成為 CISO 每月可向管理層交代的治理視圖。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trial?track=SURFACE"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              預約 Surface 諮詢
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              下載 CISO 月報範本
            </Link>
          </div>
        </div>
      </section>

      <SurfaceProofStrip />

      <OutcomeVignette
        title="3 個典型客戶情境"
        subtitle="不具名情境示意。實際範圍與輸出在諮詢階段釐清。"
        cards={outcomeCards}
        accentClass="text-sky-300"
      />

      {/* Capabilities */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold">四個核心能力</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {cap.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ReportFlip />

      {/* Versus table */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <Gauge className="h-5 w-5 text-[#14B8A6]" />
            <h2 className="text-3xl font-bold">
              跟外部評分平台原生 dashboard 比,差在哪?
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#243447]">
            <div className="hidden bg-[#0F1923] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:grid sm:grid-cols-[1fr_1.4fr_auto]">
              <div>原生 dashboard</div>
              <div>AegisCode Surface</div>
              <div className="text-right">差異</div>
            </div>
            {versusRows.map(([native, surface, note]) => (
              <div
                key={native}
                className="grid gap-2 border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm first:border-t-0 sm:grid-cols-[1fr_1.4fr_auto] sm:gap-4 sm:first:border-t"
              >
                <div className="text-gray-400">{native}</div>
                <div className="text-gray-100">{surface}</div>
                <div className="text-xs font-semibold text-[#5EEAD4]">
                  {note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCadence />

      <ProductFaq items={productFaqItems} />

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            想看真實 CISO 月報長什麼樣?
          </h2>
          <p className="mt-3 text-gray-300">
            匿名化的月報範本 PDF 可以在資源中心下載。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              下載月報範本
            </Link>
            <Link
              href="/trial?track=SURFACE"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              預約 Surface 諮詢
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
