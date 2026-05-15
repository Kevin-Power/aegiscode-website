import Link from "next/link"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const codeTracks = [
  {
    name: "Starter",
    desc: "適合小型研發團隊用 30 天 POC 驗證 SAST 工作流與 AI 程式碼健檢。",
  },
  {
    name: "Professional",
    desc: "適合多 BU 研發組織導入 SAST-in-the-Loop、繁中治理流程與主管審核紀錄。",
  },
  {
    name: "Enterprise",
    desc: "適合金融業與高法遵組織評估 CBOM/PQC、SBOM/SCA、SSO 與稽核證據包。",
  },
]

const surfaceTracks = [
  {
    name: "基礎",
    desc: "適合首次導入外部攻擊面治理的資安主管,涵蓋核心 Domain 集合與基礎月報。",
  },
  {
    name: "進階",
    desc: "適合 CISO 年度治理使用,完整週差異、月報、季度治理檢討與顧問會議。",
  },
  {
    name: "企業",
    desc: "適合大型集團或金控,多 BU、多 Portfolio、客製化合規對應與管理層儀表板。",
  },
]

const pocItems = [
  "SAST findings 與 AI 修復建議展示",
  "CBOM/PQC 加密資產盤點 Demo",
  "外部評分整合視圖 + Domain 治理樣本",
  "首份 CISO 月報草稿 + 法規對應交付",
  "部署、SSO、資料留存與 DPA 需求盤點",
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
              方案資訊依範圍報價
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              兩種購買路徑,對應不同治理需求
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              AegisCode Code 採平台授權 + 30 天 POC 後報價;AegisCode Surface 採年度顧問訂閱模式,報價依範圍而定。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Code card */}
            <div className="rounded-2xl border border-[#14B8A6]/30 bg-[#0F1923] p-8">
              <h2 className="mb-2 text-2xl font-bold">
                AegisCode Code · 平台授權
              </h2>
              <p className="text-sm text-gray-400">
                內部程式碼資安治理:SAST + CBOM/PQC + SBOM/SCA + 主管審核
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
                POC 後報價 · 30 天免費評估
              </div>
              <Link
                href="/trial?track=CODE"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
              >
                預約 Code POC
              </Link>
            </div>

            {/* Surface card */}
            <div className="rounded-2xl border border-sky-400/30 bg-[#0F1923] p-8">
              <h2 className="mb-2 text-2xl font-bold">
                AegisCode Surface · 顧問訂閱
              </h2>
              <p className="text-sm text-gray-400">
                外部攻擊面治理:評分整合 + AI 修補 + 法規對應 + CISO 月報
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
                年度訂閱 · 報價依範圍而定
              </div>
              <Link
                href="/trial?track=SURFACE"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-sky-400/40 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
              >
                預約 Surface 諮詢
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-[#14B8A6]" />
              30 天 POC 共同評估內容
            </h2>
            <div className="grid gap-3 text-sm text-gray-300 md:grid-cols-2">
              {pocItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <Link
              href="/resources"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#5EEAD4] hover:underline"
            >
              先看 Surface 服務說明書與 CISO 月報 sample →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
