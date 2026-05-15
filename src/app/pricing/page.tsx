import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const tracks = [
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
];

export default function PricingPage() {
  return (
    <main className="bg-[#0D1521] min-h-screen text-white">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              方案資訊暫不公開
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              AegisCode 方案採 POC 後報價
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              我們正在依金融業與高法遵客戶的導入情境調整方案包裝。公開價格暫時收起，
              由顧問依團隊規模、部署方式、資料留存與稽核需求提供建議。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {tracks.map((track) => (
              <div
                key={track.name}
                className="rounded-xl border border-[#243447] bg-[#1A2332] p-6"
              >
                <h2 className="mb-3 text-xl font-bold">{track.name}</h2>
                <p className="text-sm leading-7 text-gray-400">{track.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-[#14B8A6]" />
              30 天 POC 評估內容
            </h2>
            <div className="grid gap-3 text-sm text-gray-300 md:grid-cols-2">
              <p>SAST findings 與 AI 修復建議展示</p>
              <p>CBOM/PQC 加密資產盤點 Demo</p>
              <p>SBOM/SCA 與稽核證據包樣本</p>
              <p>部署、SSO、資料留存與 DPA 需求盤點</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/trial"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              預約 CBOM Demo
            </Link>
            <a
              href="mailto:sales@aegiscode.com"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              聯絡方案顧問
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
