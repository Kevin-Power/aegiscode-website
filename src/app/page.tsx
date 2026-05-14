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

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "AegisCode",
  brand: {
    "@type": "Brand",
    name: "AegisCode",
  },
  description:
    "SAST 弱點掃描、CBOM 加密資產盤點、SBOM/SCA 與台灣合規證據包平台。",
  category: "Application Security Testing",
  url: "https://aegiscode.yilutek.com",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "TWD",
    lowPrice: "9900",
    highPrice: "150000",
    offerCount: "3",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AegisCode 是否支援地端或 Air-gapped 部署？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enterprise 可規劃地端、私有雲或 Air-gapped 部署，POC 階段會先確認網路、更新與授權限制。",
      },
    },
    {
      "@type": "Question",
      name: "資料留存政策與 ZDR 選項是什麼？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AegisCode 可依合約調整資料留存週期，並針對高法遵組織規劃 Zero Data Retention 評估流程。",
      },
    },
    {
      "@type": "Question",
      name: "AegisCode 與 SonarQube Enterprise 差異在哪？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AegisCode 聚焦繁中治理工作流、CBOM/PQC 加密資產盤點、主管審核紀錄與台灣金融合規證據包。",
      },
    },
    {
      "@type": "Question",
      name: "是否支援 SSO、SAML 或 OIDC？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enterprise 支援 SSO 整合規劃，可依客戶 IdP 環境評估 SAML 或 OIDC。",
      },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
