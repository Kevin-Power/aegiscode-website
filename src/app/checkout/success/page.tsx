import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="bg-[#0D1521] min-h-screen text-white">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-xl mx-auto bg-[#1A2332] border border-[#0D9488] rounded-xl p-10 text-center">
          <h1 className="text-3xl font-bold mb-3 text-[#14B8A6]">
            Payment received
          </h1>
          <p className="text-gray-300 mb-2">
            Thanks for subscribing to AegisCode.
          </p>
          <p className="text-gray-400 text-sm">
            Your license JWT will arrive by email within a few minutes. If
            you don&apos;t receive it, write to{" "}
            <a className="underline" href="mailto:sales@aegiscode.com">
              sales@aegiscode.com
            </a>
            .
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium transition"
          >
            Return home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
