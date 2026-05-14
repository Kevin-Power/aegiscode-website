import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import PainPoints from "@/components/pain-points";
import Features from "@/components/features";
import ProductProof from "@/components/product-proof";
import AiHealthCheck from "@/components/ai-health-check";
import Workflow from "@/components/workflow";
import Stats from "@/components/stats";
import Pricing from "@/components/pricing";
import Faq from "@/components/faq";
import CtaContact from "@/components/cta-contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainPoints />
      <Features />
      <ProductProof />
      <AiHealthCheck />
      <Workflow />
      <Stats />
      <Pricing />
      <Faq />
      <CtaContact />
      <Footer />
    </main>
  );
}
