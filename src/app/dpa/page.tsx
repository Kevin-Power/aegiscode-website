import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function DpaPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-[#14B8A6]">
            資料處理協議 / Data Processing Addendum
          </p>
          <h1 className="mb-6 text-4xl font-bold">DPA 採購審查版本</h1>
          <div className="space-y-5 text-gray-300 leading-8">
            <p>
              AegisCode 可配合企業客戶提供資料處理協議，用於定義處理目的、
              資料類型、保護措施、次處理者、事件通知與退場刪除流程。
            </p>
            <p>
              金融業與高法遵客戶可於 POC 前指定資料邊界、遮罩規則、留存週期、
              匯出紀錄與 Zero Data Retention 評估條件。
            </p>
            <p>
              若需正式 DPA、資安問卷、供應商建檔資料或稽核證據樣本，請聯絡{" "}
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
