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
    desc: "SecurityScorecard、BitSight 或客戶既有評分資料，用來補足 outside-in 風險視角。",
  },
  {
    title: "Attack surface",
    desc: "網域、子網域、憑證、暴露服務與 EASM findings，對應外部可觀測曝險。",
  },
  {
    title: "Third-party context",
    desc: "供應商、BU、系統、repo 與資料處理角色，建立採購與稽核可追蹤關聯。",
  },
];

const fields = [
  ["vendor_name", "供應商或外部服務名稱"],
  ["domain", "主要網域或受評估資產"],
  ["business_unit", "對應 BU 或系統 owner"],
  ["score_source", "SecurityScorecard / BitSight / EASM / CSV"],
  ["rating", "外部評分或風險等級"],
  ["factor", "弱點、DNS、patching、application security 等 factor"],
  ["repo_or_system", "對應內部 repo、服務或系統代號"],
  ["evidence_owner", "負責補件或回覆稽核的人員角色"],
];

const deliverables = [
  "外部評分與 AegisCode SAST findings 的同頁摘要",
  "供應商 domain 到 BU / system / repo 的 mapping table",
  "CBOM、SBOM/SCA、外部 rating 的主管證據包草稿",
  "POC 後可交付的 CSV / API connector 欄位規格",
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
                Enterprise connector-ready
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                把外部風險評分，接進 AegisCode 治理證據包。
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                SecurityScorecard、BitSight 或 EASM 工具擅長從外部看企業與供應商風險；AegisCode 則補上內部程式碼、SBOM、CBOM 與合規審核證據。兩者整合後，主管看到的不再是分散報表，而是一份能追蹤責任、系統與修復狀態的治理視圖。
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
                    Connector Model
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Outside-in + inside-out</h2>
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
                <h2 className="text-2xl font-bold">匯入欄位建議</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(([field, meaning]) => (
                  <div
                    key={field}
                    className="rounded-xl border border-[#243447] bg-[#0D1521] p-4"
                  >
                    <code className="text-sm font-semibold text-[#5EEAD4]">{field}</code>
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
                  AegisCode 不取代外部評分平台，而是把評分、供應商、系統與內部程式碼證據收斂到同一個可稽核工作流。正式 API 串接、資料留存與報表格式會在 Enterprise POC 階段確認。
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
