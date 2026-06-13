import Link from "next/link"
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const codeTracks = [
  {
    name: "Starter",
    desc: "適合小型研發團隊先用 30 天 POC 驗證 SAST 弱點掃描、AI 健檢與基本證據包流程。",
  },
  {
    name: "Professional",
    desc: "適合多 BU 研發組織導入 SAST-in-the-Loop、繁中治理工作流、主管審核紀錄與跨團隊控管。",
  },
  {
    name: "Enterprise",
    desc: "適合金融業與高法遵組織評估 CBOM/PQC、SBOM/SCA、SSO、DPA、稽核證據包與專屬導入支援。",
  },
]

const surfaceTracks = [
  {
    name: "外部曝險盤點",
    desc: "適合先盤點公開網域、憑證、雲端入口、外部攻擊面與供應商曝險，建立可追蹤的風險清單。",
  },
  {
    name: "治理工作台",
    desc: "適合 CISO 與資安治理團隊彙整外部評分、內部修補進度、SLA 狀態與稽核交付物。",
  },
  {
    name: "集團視圖",
    desc: "適合金控、跨國集團或 SI 母公司管理多 Organization、多子公司與多 BU 的風險治理成效。",
  },
]

const pocItems = [
  "SAST findings 與 AI 修復建議審核流程",
  "CBOM/PQC 加密資產盤點與 portfolio demo",
  "外部曝險資料、供應商 domain 與內部證據整合",
  "集團 CISO 視圖、稽核摘要與主管報告樣本",
  "SSO、資料留存、DPA、地端或私有雲部署需求盤點",
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-sm font-medium text-[#14B8A6]">
              <ShieldCheck className="h-4 w-4" />
              依導入範圍報價
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              先確認治理範圍，再提供正式方案
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-400">
              AegisCode 目前不公開固定價格。每個導入案會依團隊規模、部署方式、
              資料留存、SSO、DPA、稽核證據包與外部風險整合需求，於 30 天 POC
              後提供正式建議。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#14B8A6]/30 bg-[#0F1923] p-8">
              <h2 className="mb-2 text-2xl font-bold">
                AegisCode Code
              </h2>
              <p className="text-sm leading-6 text-gray-400">
                面向研發與資安團隊的程式碼治理：SAST、CBOM/PQC、SBOM/SCA
                與繁中合規證據包。
              </p>
              <div className="mt-5 space-y-3">
                {codeTracks.map((track) => (
                  <div
                    key={track.name}
                    className="rounded-xl border border-[#243447] bg-[#1A2332] p-4"
                  >
                    <h3 className="font-semibold">{track.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {track.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-500">
                POC 評估期：30 天
              </div>
              <Link
                href="/trial?track=CODE"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
              >
                申請 Code POC
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="rounded-2xl border border-sky-400/30 bg-[#0F1923] p-8">
              <h2 className="mb-2 text-2xl font-bold">
                AegisCode Surface
              </h2>
              <p className="text-sm leading-6 text-gray-400">
                面向 CISO 與治理團隊的外部風險工作台：攻擊面盤點、外部評分整合、
                修補追蹤與主管報告。
              </p>
              <div className="mt-5 space-y-3">
                {surfaceTracks.map((track) => (
                  <div
                    key={track.name}
                    className="rounded-xl border border-[#243447] bg-[#1A2332] p-4"
                  >
                    <h3 className="font-semibold">{track.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {track.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-500">
                治理範圍：依 POC 與合約確認
              </div>
              <Link
                href="/trial?track=SURFACE"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-sky-400/40 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
              >
                申請 Surface 評估
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

          <section className="mt-12 rounded-2xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-[#14B8A6]" />
              30 天 POC 會確認的交付範圍
            </h2>
            <div className="grid gap-3 text-sm leading-6 text-gray-300 md:grid-cols-2">
              {pocItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <Link
              href="/resources"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5EEAD4] hover:underline"
            >
              查看 CISO 簡報與合規交付範本
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  )
}
