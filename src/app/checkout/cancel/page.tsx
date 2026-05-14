import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CheckoutCancelPage() {
  return (
    <main className="bg-[#0D1521] min-h-screen text-white">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-xl mx-auto bg-[#1A2332] border border-[#243447] rounded-xl p-10 text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-200">
            付款流程已取消
          </h1>
          <p className="text-gray-400 mb-6">
            尚未產生扣款。您可以回到方案頁重新啟用，或先申請 30 天 POC
            評估 AegisCode。
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/pricing"
              className="px-6 py-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium transition"
            >
              返回方案
            </a>
            <a
              href="/trial"
              className="px-6 py-3 rounded-lg border border-[#243447] hover:border-[#0D9488] text-gray-300 hover:text-white font-medium transition"
            >
              申請 30 天 POC
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
