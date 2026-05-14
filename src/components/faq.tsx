"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "AegisCode 支援哪些程式語言？",
    a: "AegisCode 支援 30+ 種程式語言，包括 Java、Python、JavaScript/TypeScript、C/C++、C#、Go、Ruby、PHP、Swift、Kotlin 等主流語言，涵蓋前端、後端、行動端開發需求。",
  },
  {
    q: "掃描一個專案需要多久？",
    a: "依專案大小而定，一般中型專案（數萬行程式碼）約 3-5 分鐘即可完成完整掃描，包含 SAST 分析與 AI 健檢。大型專案也通常在 10 分鐘內完成。",
  },
  {
    q: "程式碼會不會外洩？",
    a: "絕對不會。AegisCode 支援私有部署（On-Premise），所有程式碼與掃描結果都在您的內部網路環境中處理，不會離開您的伺服器。資料安全是我們的最高優先。",
  },
  {
    q: "跟 SonarQube 社區版有什麼不同？",
    a: "AegisCode 是基於 SonarQube 引擎打造的企業級平台，在此基礎上增加了 AI 程式碼健檢、多 BU 管理、審核工作流、中英雙語介面等企業級功能，專為台灣企業打造的一站式解決方案。",
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
    q: "有免費試用嗎？",
    a: "有的！我們提供 30 天免費 POC（概念驗證）試用，讓您可以用實際專案進行測試，充分體驗所有功能後再決定是否採用。",
  },
  {
    q: "AI 程式碼健檢是什麼？",
    a: "這是 AegisCode 的獨家功能，專門針對 AI 生成程式碼（如 GitHub Copilot、ChatGPT 等）進行 7 大面向分析：正確性、安全性、效能、可維護性、錯誤處理、程式碼風格、架構設計，並給予 S~D 五級評分與改善建議。",
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
