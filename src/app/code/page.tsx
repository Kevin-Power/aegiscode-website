import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  CloudOff,
  Code2,
  Cpu,
  FileCheck2,
  KeySquare,
  Layers,
  ShieldCheck,
  Workflow as WorkflowIcon,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CodeProofStrip from "@/components/code-proof-strip"
import OutcomeVignette from "@/components/outcome-vignette"
import CodeTour from "@/components/code-tour"
import RoiMini from "@/components/roi-mini"
import ProductFaq from "@/components/product-faq"

const capabilities = [
  {
    icon: KeySquare,
    title: "CBOM / PQC 加密資產",
    desc: "盤點程式碼中的加密用法,評估後量子遷移與長期資料保護風險。矛尖能力。",
  },
  {
    icon: ShieldCheck,
    title: "SAST 弱點掃描",
    desc: "覆蓋 12 種常見企業開發語言,弱點可直接進入主管審核工作流。",
  },
  {
    icon: WorkflowIcon,
    title: "SAST-in-the-Loop / VULNFORGE",
    desc: "把 SAST findings 轉成可審查、可修復、可追蹤的 AI review 工作流。",
  },
  {
    icon: Layers,
    title: "SBOM / SCA",
    desc: "建立依賴清單與第三方元件風險視圖,支援採購與稽核情境。",
  },
  {
    icon: FileCheck2,
    title: "Quality Gate + 主管審核",
    desc: "依 findings 嚴重度設計閘門規則,主管審核留痕完整,可作為金融合規證據。",
  },
  {
    icon: Code2,
    title: "繁中合規證據包",
    desc: "報告、修補建議、稽核紀錄全繁中化,可直接用於 POC 與客戶內部簡報。",
  },
]

const outcomeCards = [
  {
    icon: Building2,
    scenario: "某金控 BU 評估 CBOM 法遵",
    pain: "加密資產散落在 Excel 與口耳相傳,稽核時無法即時提證",
    outcome: "統一 CBOM portfolio + Evidence Pack,30 天 POC 即可呈交主管",
  },
  {
    icon: Briefcase,
    scenario: "某政府機關 air-gapped SAST 需求",
    pain: "外送黑盒掃描,結果延遲且不能離站",
    outcome: "地端封閉部署,SAST + CBOM 報告直接在內網產出",
  },
  {
    icon: Cpu,
    scenario: "某製造/IoT 廠多語言治理",
    pain: "依賴工具拼接,每個語言各管各的,主管審核斷裂",
    outcome: "單一 Quality Gate 整合 12 種開發語言,主管審核留痕一致",
  },
]

const productFaqItems = [
  {
    q: "AegisCode Code 跟既有的 SAST 工具(如 Snyk / Veracode / Checkmarx)有什麼差別?",
    a: "我們的差異化在 CBOM/PQC 加密資產盤點、繁中治理工作流與主管審核留痕。這三項是金融、政府客戶的核心稽核訴求,通用國際 SAST 工具不會原生支援。",
  },
  {
    q: "CBOM / PQC 的盤點真的能當合規證據用嗎?",
    a: "可以。CBOM portfolio 與 Evidence Pack 是依金融資安主管的稽核情境設計,涵蓋演算法、金鑰長度、IV、TLS、PQC 遷移風險。30 天 POC 階段我們會根據您的環境校準輸出。",
  },
  {
    q: "Air-gapped / 地端部署的複雜度如何?",
    a: "Air-gapped 是我們支援的部署模式之一。POC 階段會評估網路隔離、SSO 整合與資料留存要求,正式環境條件會在 POC 結束前釐清。",
  },
  {
    q: "30 天 POC 可以評估到什麼程度?",
    a: "POC 涵蓋 SAST findings 展示、CBOM/PQC 盤點 demo、SBOM/SCA 報告樣本、Quality Gate 試跑,以及部署與稽核需求盤點。POC 結束時您能拿到一份完整的 Evidence Pack 樣本與導入建議。",
  },
]

const versusMatrix: Array<{ dim: string; sonar: string; aegis: string }> = [
  { dim: "程式碼品質 + SAST", sonar: "成熟", aegis: "整合" },
  { dim: "CBOM / PQC", sonar: "未支援", aegis: "矛尖能力" },
  { dim: "繁中治理工作流", sonar: "未支援", aegis: "原生" },
  { dim: "主管審核留痕", sonar: "部分", aegis: "完整" },
  { dim: "台灣金融合規證據包", sonar: "未支援", aegis: "原生" },
]

const deploymentOptions = [
  ["SaaS 託管", "最快的導入路徑,適合一般企業評估"],
  ["私有雲 / 地端", "適合高法遵組織自管環境"],
  ["Air-gapped", "適合需求離線運作的金融、政府或國防客戶"],
]

const pocDeliverables = [
  "SAST findings 與 AI 修復建議展示",
  "CBOM / PQC 加密資產盤點 Demo",
  "SBOM / SCA 報告與稽核證據包樣本",
  "Quality Gate 與主管審核紀錄試跑",
  "部署、SSO、資料留存與 DPA 需求盤點",
]

export const metadata = {
  title: "AegisCode Code — 內部程式碼資安治理 | AegisCode",
  description:
    "AegisCode Code 是企業內部程式碼資安平台,整合 SAST、CBOM/PQC、SBOM/SCA、主管審核與繁中合規證據包,適合金融、政府與高法遵組織。",
}

export default function CodePage() {
  return (
    <main className="min-h-screen overflow-x-hidden break-all bg-[#0D1521] text-white">
      <Navbar />

      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-medium text-[#5EEAD4]">
            <Code2 className="h-4 w-4" />
            AegisCode Code · 平台授權
          </div>
          <h1 className="max-w-full text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:break-words">
            <span className="block">以 CBOM/PQC 為矛尖</span>
            <span className="block">的內部程式碼治理</span>
            <span className="block">SAST + 主管審核閉環</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            AegisCode Code 以 CBOM/PQC 加密資產盤點為矛尖,搭配 SAST 弱點掃描、VULNFORGE 修補工作流與主管審核留痕。專為金融、政府與高法遵組織的繁中合規場景設計。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trial?track=CODE"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              預約 Code POC
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              查看方案
            </Link>
          </div>
        </div>
      </section>

      <CodeProofStrip />

      <OutcomeVignette
        title="3 個典型客戶情境"
        subtitle="不具名情境示意,僅代表常見企業類型。實際 POC 會依您的環境校準。"
        cards={outcomeCards}
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold">六個核心能力</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#5EEAD4]">
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

      <CodeTour />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-bold">vs SonarQube Enterprise</h2>
          <div className="overflow-hidden rounded-2xl border border-[#243447]">
            <div className="hidden bg-[#0F1923] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:grid sm:grid-cols-[1.2fr_1fr_1fr]">
              <div>維度</div>
              <div>SonarQube Enterprise</div>
              <div>AegisCode Code</div>
            </div>
            {versusMatrix.map((row) => (
              <div
                key={row.dim}
                className="grid gap-1 border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-4 sm:first:border-t"
              >
                <div className="font-medium text-gray-100">{row.dim}</div>
                <div className="text-gray-400">{row.sonar}</div>
                <div className="text-[#5EEAD4]">{row.aegis}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <CloudOff className="h-5 w-5 text-sky-300" />
            <h2 className="text-3xl font-bold">部署選項</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {deploymentOptions.map(([title, desc]) => (
              <div
                key={title}
                className="rounded-xl border border-[#243447] bg-[#0F1923] p-5"
              >
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-gray-500">
            正式部署條件、SSO、資料留存與 DPA 細節會在 30 天 POC 階段確認。
          </p>
        </div>
      </section>

      <RoiMini />

      <ProductFaq items={productFaqItems} />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#243447] bg-[#0F1923] p-8">
          <h2 className="mb-6 text-2xl font-bold">30 天 POC 評估內容</h2>
          <div className="space-y-3">
            {pocDeliverables.map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14B8A6]" />
                <p className="text-sm leading-7 text-gray-300">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trial?track=CODE"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              申請 30 天 POC
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              下載合規證據包樣本
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500 sm:text-left">
            或直接寄信:{" "}
            <a href="mailto:sales@aegiscode.com" className="underline hover:text-gray-300">
              sales@aegiscode.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
