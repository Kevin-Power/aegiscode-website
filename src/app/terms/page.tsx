import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-[#14B8A6]">
            服務條款 / Terms of Service
          </p>
          <h1 className="mb-6 text-4xl font-bold">AegisCode 使用條款</h1>
          <div className="space-y-5 text-gray-300 leading-8">
            <p>
              AegisCode 提供 SAST 弱點掃描、AI 程式碼健檢、CBOM/PQC
              加密資產盤點、SBOM/SCA 與合規證據產出服務。
            </p>
            <p>
              POC 與正式訂閱的功能範圍、部署方式、支援 SLA、資料留存與付款條件，
              以雙方簽署之報價單、訂單或主服務合約為準。
            </p>
            <p>
              客戶應確保上傳或掃描的程式碼、依賴套件與專案資料具備合法授權。
              AegisCode 掃描結果為風險治理與修復建議，不取代客戶的最終安全審查責任。
            </p>
            <p>
              合約、退場條款或資安審查需求請聯絡{" "}
              <a className="text-[#5EEAD4] underline" href="mailto:sales@aegiscode.com">
                sales@aegiscode.com
              </a>
              。
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
