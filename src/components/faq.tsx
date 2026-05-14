"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "AegisCode 支援哪些程式語言？",
    a: "AegisCode 目前以 12 種常見企業語言為主，包括 Java、Python、JavaScript/TypeScript、Go、C#、PHP、Ruby、Rust 等，後續依 POC 範圍擴充。",
  },
  {
    q: "掃描一個專案需要多久？",
    a: "依專案大小與掃描模式而定。建議規格是增量掃描 < 30 秒、全量掃描 100K LOC < 5 分鐘；正式 POC 會以您的實際 repo 做基準量測。",
  },
  {
    q: "程式碼會不會外洩？",
    a: "絕對不會。AegisCode 支援私有部署（On-Premise），所有程式碼與掃描結果都在您的內部網路環境中處理，不會離開您的伺服器。資料安全是我們的最高優先。",
  },
  {
    q: "是否支援地端或 Air-gapped 部署？",
    a: "支援。Enterprise 可規劃地端、私有網路或 Air-gapped 部署，搭配離線授權、內部映像檔 registry 與客戶指定的稽核留存政策。",
  },
  {
    q: "資料留存政策與 ZDR 選項如何處理？",
    a: "POC 預設採最小化留存，只保留授權、審核與掃描必要資料。金融業可要求 Zero Data Retention 選項，將原始碼與掃描暫存限制在客戶環境內。",
  },
  {
    q: "跟 SonarQube 社區版有什麼不同？",
    a: "SonarQube 是很好的靜態分析引擎；AegisCode 的差異在企業治理層：SAST-in-the-Loop AI 審查、多 BU 權限、繁中/英文介面、主管審核、CBOM/PQC、SBOM/SCA 與可交付稽核證據。技術團隊看得到問題，管理層也拿得到決策材料。",
  },
  {
    q: "SBOM / SCA 跟 GitHub Advanced Security 有什麼差別？",
    a: "GitHub Advanced Security 強在開發平台內的程式碼與相依套件風險；AegisCode 更偏向跨 BU 治理、客戶或稽核交付。它把 SBOM/SCA、CBOM/PQC、Quality Gate、審核紀錄與報告輸出整合成同一套證據流程，適合需要金融合規、採購審查或跨部門彙整的組織。",
  },
  {
    q: "跟 SonarQube Enterprise 的 feature 對照是什麼？",
    a: "SonarQube Enterprise 偏向程式碼品質與安全掃描引擎；AegisCode 會保留 SAST 治理能力，並加上繁中工作流、多 BU 審核、CBOM/PQC、SBOM/SCA、金管會證據包與可交付報告。",
  },
  {
    q: "為什麼不是照 per-LOC 或 per-developer 計價？",
    a: "AegisCode 對外採固定 tier，目標是讓採購可以快速預算化。不過每個方案也揭露隱含 user/month 成本：Starter 約 NT$990/user/月，Professional 約 NT$900/user/月；Enterprise 則以不限使用者、不限 BU 與合規證據包來計價。",
  },
  {
    q: "可以整合 CI/CD 嗎？",
    a: "可以。AegisCode 支援與 Jenkins、GitLab CI、GitHub Actions、Azure DevOps 等主流 CI/CD 工具整合，可在建構流程中自動觸發程式碼掃描，實現真正的 DevSecOps。",
  },
  {
    q: "部署需要多久？",
    a: "標準部署只需 1-2 個工作天。我們提供 Docker 容器化部署方式，包含完整的安裝指南與技術支援，確保快速上線。",
  },
  {
    q: "是否支援 SSO / SAML / OIDC？",
    a: "Enterprise 支援 SSO 規劃，可依客戶既有 IdP 導入 SAML 或 OIDC。POC 階段可先使用隔離帳號，正式導入時再接企業身份系統。",
  },
  {
    q: "合約最短綁約期與退場條款？",
    a: "Starter 可自助試用；Professional 與 Enterprise 以年度合約為主。退場時可匯出報告、審核紀錄與客戶資料，並依 DPA 完成刪除或留存程序。",
  },
  {
    q: "有免費試用嗎？",
    a: "有的！我們提供 30 天免費 POC（概念驗證）試用，讓您可以用實際專案進行測試，充分體驗所有功能後再決定是否採用。",
  },
  {
    q: "AI 程式碼健檢是什麼？",
    a: "AegisCode 會把 SAST findings 與 LLM 上下文審查整合，對 Copilot、Claude、ChatGPT 生成的程式碼提供繁中修復建議與審核紀錄，重點是治理流程，不是宣稱取代所有 AI review 工具。",
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
        {open && (
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
        )}
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
