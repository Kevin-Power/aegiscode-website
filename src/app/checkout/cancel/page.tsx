import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CheckoutCancelPage() {
  return (
    <main className="bg-[#0D1521] min-h-screen text-white">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-xl mx-auto bg-[#1A2332] border border-[#243447] rounded-xl p-10 text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-200">
            Checkout cancelled
          </h1>
          <p className="text-gray-400 mb-6">
            No charge was made. You can restart checkout anytime, or start a
            free 14-day trial first to evaluate AegisCode.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/pricing"
              className="px-6 py-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium transition"
            >
              Back to pricing
            </a>
            <a
              href="/trial"
              className="px-6 py-3 rounded-lg border border-[#243447] hover:border-[#0D9488] text-gray-300 hover:text-white font-medium transition"
            >
              Start free trial
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
