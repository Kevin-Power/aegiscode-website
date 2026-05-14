import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-[#14B8A6]">
            隱私權政策 / Privacy Policy
          </p>
          <h1 className="mb-6 text-4xl font-bold">
            AegisCode 資料保護承諾
          </h1>
          <div className="space-y-5 text-gray-300 leading-8">
            <p>
              AegisCode 由宜路科技股份有限公司開發與營運。我們僅收集提供
              POC、產品啟用、技術支援與合約履行所需的必要資訊。
            </p>
            <p>
              聯絡資訊、公司資料與 POC 評估資料會用於安排展示、提供授權、
              回覆支援需求與改善產品服務。我們不出售個人資料，也不將資料提供給無關第三方。
            </p>
            <p>
              企業客戶可於合約中約定資料留存週期、刪除流程、稽核要求與 Zero
              Data Retention 選項。高法遵環境會於 POC 前另行確認資料邊界。
            </p>
            <p>
              如需資料查詢、更新或刪除，請聯絡{" "}
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
