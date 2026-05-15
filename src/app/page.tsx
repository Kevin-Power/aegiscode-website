import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import DualPillars from "@/components/dual-pillars"
import PainPoints from "@/components/pain-points"
import Features from "@/components/features"
import ProductProof from "@/components/product-proof"
import SurfaceSpotlight from "@/components/surface-spotlight"
import ComplianceMatrix from "@/components/compliance-matrix"
import AiHealthCheck from "@/components/ai-health-check"
import Workflow from "@/components/workflow"
import Stats from "@/components/stats"
import Faq from "@/components/faq"
import CtaContact from "@/components/cta-contact"
import Footer from "@/components/footer"

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AegisCode 產品系列",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "AegisCode Code",
        brand: { "@type": "Brand", name: "AegisCode" },
        description:
          "內部程式碼資安治理:SAST 弱點掃描、CBOM/PQC 加密資產盤點、SBOM/SCA、主管審核紀錄與台灣金融合規證據包。",
        category: "Application Security Testing",
        url: "https://aegiscode.yilutek.com/code",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "AegisCode Surface",
        brand: { "@type": "Brand", name: "AegisCode" },
        description:
          "外部攻擊面年度治理服務:評分整合、AI 修補建議、台灣法規對應與顧問級 CISO 月報。",
        category: "External Attack Surface Management",
        url: "https://aegiscode.yilutek.com/surface",
      },
    },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AegisCode 是否支援地端或 Air-gapped 部署?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enterprise 可規劃地端、私有雲或 Air-gapped 部署,POC 階段會先確認網路、更新與授權限制。",
      },
    },
    {
      "@type": "Question",
      name: "資料留存政策與 ZDR 選項是什麼?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AegisCode 可依合約調整資料留存週期,並針對高法遵組織規劃 Zero Data Retention 評估流程。",
      },
    },
    {
      "@type": "Question",
      name: "AegisCode 與 SonarQube Enterprise 差異在哪?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AegisCode 聚焦繁中治理工作流、CBOM/PQC 加密資產盤點、主管審核紀錄與台灣金融合規證據包。",
      },
    },
    {
      "@type": "Question",
      name: "是否支援 SSO、SAML 或 OIDC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enterprise 支援 SSO 整合規劃,可依客戶 IdP 環境評估 SAML 或 OIDC。",
      },
    },
    {
      "@type": "Question",
      name: "AegisCode Surface 跟 SecurityScorecard 原生 dashboard 差在哪?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Surface 提供中文化治理工作流、修補優先順序、台灣法規對應、風險量化與顧問交付報告;原生 dashboard 是原始評分視圖。",
      },
    },
    {
      "@type": "Question",
      name: "Surface 需要客戶自備 SecurityScorecard 授權嗎?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "是,客戶提供 API token。Surface 也支援 BitSight 或客戶既有 EASM 工具的訊號整合。",
      },
    },
    {
      "@type": "Question",
      name: "CISO 月報長什麼樣?可以看 sample 嗎?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可,到 /resources 下載匿名化的 sample PDF。",
      },
    },
    {
      "@type": "Question",
      name: "Surface 是訂閱還是專案?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Surface 是年度顧問訂閱,含平台、每週差異追蹤、每月治理報告、季度治理檢討與顧問解讀會議。",
      },
    },
    {
      "@type": "Question",
      name: "Code 跟 Surface 可以單買嗎?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可單買,合購有 bundle 折讓。實際數字會在 POC 後依範圍報價。",
      },
    },
  ],
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <Hero />
      <DualPillars />
      <PainPoints />
      <Features />
      <ProductProof />
      <SurfaceSpotlight />
      <ComplianceMatrix />
      <AiHealthCheck />
      <Workflow />
      <Stats />
      <Faq />
      <CtaContact />
      <Footer />
    </main>
  )
}
