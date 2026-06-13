import Link from "next/link";
import type { Metadata } from "next";
import { Calculator, FileText, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RoiPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-sm font-medium text-[#14B8A6]">
            <Calculator className="h-4 w-4" />
            ROI 模型暫不公開
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            ROI 計算將於 POC 中客製提供
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-400">
            為避免公開未定案價格與不適用的節省假設，AegisCode 目前不公開自助 ROI
            計算器。我們會在 POC 期間依您的團隊人數、流程成本、部署方式與稽核需求建立專屬模型。
          </p>

          <div className="mt-10 grid gap-5 text-left md:grid-cols-2">
            <div className="rounded-xl border border-[#243447] bg-[#1A2332] p-6">
              <FileText className="mb-4 h-6 w-6 text-[#14B8A6]" />
              <h2 className="mb-2 text-xl font-bold">採購簡報素材</h2>
              <p className="text-sm leading-7 text-gray-400">
                POC 後可產出 findings、修復時間、稽核證據與導入範圍摘要，供內部採購與資安委員會討論。
              </p>
            </div>
            <div className="rounded-xl border border-[#243447] bg-[#1A2332] p-6">
              <ShieldCheck className="mb-4 h-6 w-6 text-[#14B8A6]" />
              <h2 className="mb-2 text-xl font-bold">合規導入評估</h2>
              <p className="text-sm leading-7 text-gray-400">
                依資料留存、SSO、地端或 Air-gapped 部署、DPA 與稽核證據包需求建立方案範圍。
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/trial"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              預約 CBOM 導覽
            </Link>
            <a
              href="mailto:sales@aegiscode.com"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              索取 ROI 評估
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
