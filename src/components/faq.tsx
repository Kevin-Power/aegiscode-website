"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";

const faqs = [
  {
    q: "AegisCode 支援哪些程式語言？",
    a: "目前規劃支援 12 種常見企業開發語言，包含 Java、Python、JavaScript/TypeScript、Go、C#、PHP、Ruby、Rust 等。POC 階段會依您的 repo 語言組成確認掃描範圍。",
  },
  {
    q: "掃描速度大概需要多久？",
    a: "依專案大小與掃描類型而定。目標規格為增量掃描小於 30 秒、全量掃描 100K LOC 小於 5 分鐘，POC 會以您的實際 repo 校準。",
  },
  {
    q: "是否支援地端或 Air-gapped 部署？",
    a: "Enterprise 評估可納入地端、私有雲或 Air-gapped 部署。POC 前會先確認網路邊界、授權更新、套件 registry、稽核留存與維運責任。",
  },
  {
    q: "資料留存政策與 ZDR 選項是什麼？",
    a: "資料留存週期、刪除流程與 Zero Data Retention 選項可依合約與 DPA 定義。高法遵客戶可在 POC 前先指定資料邊界與遮罩規則。",
  },
  {
    q: "AegisCode 和 SonarQube Enterprise 差異在哪？",
    a: "SonarQube Enterprise 偏向成熟的程式碼品質與 SAST 掃描。AegisCode 聚焦台灣金融與繁中治理工作流，包含 SAST-in-the-Loop AI 審查、CBOM/PQC、SBOM/SCA、主管審核紀錄與合規證據包。",
  },
  {
    q: "SBOM / SCA 和 GitHub Advanced Security 有什麼差別？",
    a: "GitHub Advanced Security 很適合 GitHub 原生開發流程。AegisCode 則把 SBOM/SCA、CBOM/PQC、Quality Gate、主管證據包與多 BU 治理收斂成一套採購與稽核能理解的工作流。",
  },
  {
    q: "可以搭配 SecurityScorecard 或其他外部風險評分嗎？",
    a: "可以作為 Enterprise POC 的 connector-ready 評估項目。AegisCode 可匯入 SecurityScorecard、BitSight 或客戶既有 EASM/TPRM 資料，將外部曝險、供應商 domain、內部 SAST、SBOM 與 CBOM 證據整合成主管治理視圖；正式串接範圍會依 API 授權與合約確認。",
  },
  {
    q: "公開價格在哪裡？",
    a: "目前價格暫不公開。AegisCode 會依團隊規模、部署方式、資料留存、SSO、DPA 與稽核需求，在 30 天 POC 後提供正式方案建議。",
  },
  {
    q: "可以整合既有 CI/CD 嗎？",
    a: "可以。AegisCode 可評估接入 Jenkins、GitLab CI、GitHub Actions、Azure DevOps 等流程，並依 findings 嚴重度設計 Quality Gate 與審核規則。",
  },
  {
    q: "是否支援 SSO / SAML / OIDC？",
    a: "Enterprise 導入可規劃 SSO，並依客戶 IdP 環境評估 SAML 或 OIDC。POC 階段會先確認使用者角色、權限模型與稽核紀錄需求。",
  },
  {
    q: "合約、退場與資料匯出怎麼處理？",
    a: "正式導入會在合約與 DPA 中定義資料匯出、留存、刪除與退場流程。報告、審核紀錄與客戶資料可依約定格式匯出。",
  },
  {
    q: "可以先試用嗎？",
    a: "可以先申請 30 天 POC。團隊會協助確認掃描範圍、Demo 情境與合規交付需求，再提供導入建議。",
  },
  {
    q: "AI 程式碼健檢是什麼？",
    a: "AegisCode 會把 SAST findings 與 LLM 上下文審查結合，針對 Copilot、Claude、ChatGPT 等工具產生的程式碼提供繁中修復建議與主管可審核的紀錄。",
  },
  {
    q: "Container / IaC / Secrets 掃描的範圍是什麼？",
    a: "整合 Trivy（容器映像 + 設定）、Checkov（Terraform / K8s / Dockerfile / CloudFormation IaC）、Gitleaks（硬編碼 token / API key / 私鑰）三套真實 CLI。POC 階段會盤點您的 image registry、IaC repo 與 secret 範圍。",
  },
  {
    q: "DAST 動態掃描怎麼跟 SAST 配合？",
    a: "DAST 以 OWASP ZAP 為基礎，補強 SAST 看不到的 runtime 風險（authn、session、injection、CORS、headers 等）。POC 階段可串接您的 staging 環境，跟 SAST/CBOM/SBOM findings 一起進入主管審核。",
  },
  {
    q: "F-ISAC 7 主題成熟度自評怎麼做？",
    a: "對應 F-ISAC 治理 / 風險 / 合規 / 開發安全 / 資料保護 / 監控應變 / 第三方七大主題，逐題填寫 0-5 評分與備註，平台換算 L1-L5 成熟度並輸出雷達圖（含前次 vs 本次對照），整合進 Compliance Dashboard。",
  },
  {
    q: "集團母公司能看子公司的全部漏洞嗎？",
    a: "Enterprise 可規劃多租戶 Group CISO 視圖，母公司 CISO 跨 Organization 彙整子公司 Critical 漏洞、SLA 過期與 SDLC 覆蓋度；子公司之間互相不可見，符合資料隔離。適合金控、跨國集團與 SI 母公司管控子事業群場景。",
  },
  {
    q: "AegisCode Surface 跟 SecurityScorecard 原生 dashboard 差在哪？",
    a: "Surface 提供中文化治理工作流、修補優先順序、台灣法規對應、風險量化與顧問交付報告；原生 dashboard 是原始評分視圖。",
  },
  {
    q: "Surface 需要客戶自備 SecurityScorecard 授權嗎？",
    a: "是，客戶提供 API token。Surface 也支援 BitSight 或客戶既有 EASM 工具的訊號整合。",
  },
  {
    q: "CISO 月報長什麼樣？可以看 sample 嗎？",
    a: "可以，到資源中心 /resources 下載匿名化的 sample PDF。",
  },
  {
    q: "AegisCode Surface 是訂閱還是專案？",
    a: "Surface 是年度顧問訂閱，含平台、每週差異追蹤、每月治理報告、季度治理檢討與顧問解讀會議。",
  },
  {
    q: "Code 跟 Surface 可以單買嗎？",
    a: "可單買，合購有 bundle 折讓。實際數字會在 POC 後依範圍報價。",
  },
];

function FaqItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#243447] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1A2332]/50 transition-colors"
      >
        <span className="text-sm sm:text-base font-medium text-gray-200 pr-4">
          {faq.q}
        </span>
        <span className="text-gray-400 shrink-0">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="py-24 bg-[#0F1923]">
      <div className="max-w-3xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">常見問題</h2>
          <p className="text-gray-400 text-lg">Frequently Asked Questions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
