import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Radar,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const sources = [
  {
    title: "Security rating",
    desc: "可搭配 SecurityScorecard、BitSight 或客戶既有評分，補足外部可觀測風險視角。",
  },
  {
    title: "Attack surface",
    desc: "將網域、憑證、暴露服務與 EASM 訊號收斂成主管可讀的曝險摘要。",
  },
  {
    title: "Third-party context",
    desc: "把供應商、BU、系統與責任窗口放進同一個治理脈絡，方便採購與稽核追蹤。",
  },
];

const salesPlays = [
  ["內外風險同頁", "把內部程式碼弱點、SBOM/SCA、CBOM 與外部曝險摘要放在同一個主管視圖。"],
  ["供應商治理包", "協助業務說清楚第三方風險如何被追蹤、分派、修復與留痕。"],
  ["金融稽核證據包", "把技術 findings 轉成可交付的治理摘要、責任歸屬與改善狀態。"],
  ["30 天 POC 劇本", "用既有評分資料與 AegisCode 掃描結果，快速做出可展示的管理報表。"],
];

const deliverables = [
  "主管版風險總覽：外部曝險、程式碼弱點、供應鏈與加密資產風險",
  "供應商治理摘要：責任歸屬、風險等級、修復狀態與稽核留痕",
  "AegisCode Evidence Pack：可用於 POC、內部簡報與採購評估",
  "整合評估報告：說明可串接資料來源、授權需求與正式導入範圍",
];

export const metadata = {
  title: "外部風險整合 - AegisCode",
  description:
    "AegisCode Enterprise POC 可匯入 SecurityScorecard、BitSight 或 EASM 資料，整合外部曝險、供應商風險、SAST、SBOM 與 CBOM 證據。",
};

export default function ExternalRiskPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-medium text-sky-200">
                <Globe2 className="h-4 w-4" />
                Enterprise sales-ready
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                把外部風險評分，變成 AegisCode 可銷售的治理證據包。
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                SecurityScorecard、BitSight 或 EASM 工具擅長從外部看企業與供應商風險；AegisCode 則補上內部程式碼、SBOM、CBOM 與合規審核證據。對客戶呈現時，我們不揭露內部技術細節，而是交付一份能追蹤責任、改善狀態與稽核證據的治理視圖。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/trial"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
                >
                  預約 Enterprise POC
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#external-risk"
                  className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
                >
                  回到首頁摘要
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#243447] bg-[#0F1923] p-5 shadow-2xl shadow-black/30">
              <div className="mb-5 flex items-center justify-between border-b border-[#243447] pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Sales Positioning
                  </p>
                  <h2 className="mt-1 text-xl font-bold">外部評分 + 內部證據</h2>
                </div>
                <ShieldCheck className="h-6 w-6 text-[#14B8A6]" />
              </div>
              <div className="grid gap-3">
                {sources.map((source) => (
                  <div
                    key={source.title}
                    className="rounded-xl border border-[#243447] bg-[#101B28] p-4"
                  >
                    <div className="text-base font-semibold text-white">{source.title}</div>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{source.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6">
              <div className="mb-5 flex items-center gap-3">
                <Radar className="h-5 w-5 text-sky-300" />
                <h2 className="text-2xl font-bold">業務可賣的四個場景</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {salesPlays.map(([title, meaning]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-[#243447] bg-[#0D1521] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[#5EEAD4]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{meaning}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6">
              <div className="mb-5 flex items-center gap-3">
                <FileCheck2 className="h-5 w-5 text-[#14B8A6]" />
                <h2 className="text-2xl font-bold">POC 交付物</h2>
              </div>
              <div className="space-y-4">
                {deliverables.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14B8A6]" />
                    <p className="text-sm leading-7 text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-sky-400/20 bg-sky-400/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-100">
                  <Building2 className="h-4 w-4" />
                  採購與稽核定位
                </div>
                <p className="text-sm leading-7 text-sky-100">
                  AegisCode 不取代外部評分平台，也不在對外頁面揭露內部規則、流程或實作細節。銷售重點是把外部評分、供應商、系統與內部程式碼證據收斂成可稽核工作流；正式整合範圍、資料留存與報表格式會在 Enterprise POC 階段確認。
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
