import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  CloudOff,
  Code2,
  FileCheck2,
  KeySquare,
  Layers,
  ShieldCheck,
  Workflow as WorkflowIcon,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const capabilities = [
  {
    icon: ShieldCheck,
    title: "SAST 弱點掃描",
    desc: "覆蓋 12 種常見企業開發語言,整合 OWASP / CWE 規則,findings 直接落入主管審核工作流。",
  },
  {
    icon: KeySquare,
    title: "CBOM / PQC 加密資產",
    desc: "盤點 Java / Python / Go / Node / TS / JS / C# 程式碼中的加密用法,評估後量子遷移風險。",
  },
  {
    icon: Layers,
    title: "SBOM / SCA",
    desc: "建立依賴清單與第三方元件風險視圖,supports 採購與稽核情境。",
  },
  {
    icon: WorkflowIcon,
    title: "Quality Gate + 主管審核",
    desc: "依 findings 嚴重度設計可配置的閘門規則,審核紀錄完整留痕,可作為金融合規證據。",
  },
  {
    icon: FileCheck2,
    title: "繁中合規證據包",
    desc: "報告、修補建議、稽核紀錄全繁中化,可直接用於 POC 與客戶內部簡報。",
  },
]

const versusRows: Array<[string, string]> = [
  ["SonarQube Enterprise 強項", "成熟的程式碼品質與 SAST 規則庫"],
  ["AegisCode Code 補強", "繁中治理工作流 + AI 程式碼健檢"],
  ["AegisCode Code 補強", "CBOM / PQC 加密資產盤點"],
  ["AegisCode Code 補強", "SBOM / SCA + 主管審核留痕"],
  ["AegisCode Code 補強", "台灣金融合規證據包"],
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
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />

      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-medium text-[#5EEAD4]">
            <Code2 className="h-4 w-4" />
            AegisCode Code · 平台授權
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            一站式內部程式碼資安治理 — SAST + CBOM + SBOM + 主管審核閉環。
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
            AegisCode Code 把 SAST 弱點、加密資產盤點、依賴風險與主管審核留痕整合在同一個繁中治理工作台,直接服務開發團隊與資安 BU 管理者的合規工作流。
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

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold">五個核心能力</h2>
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

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-3xl font-bold">vs SonarQube Enterprise</h2>
          <div className="overflow-hidden rounded-2xl border border-[#243447]">
            {versusRows.map(([label, content], idx) => (
              <div
                key={idx}
                className="grid grid-cols-[180px_1fr] gap-4 border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm first:border-t-0"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  {label}
                </div>
                <div className="text-gray-200">{content}</div>
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
            <a
              href="mailto:sales@aegiscode.com"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              聯絡顧問
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
