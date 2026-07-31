"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";

const evidence = [
  {
    number: "86%",
    label: "商用程式碼存在開源套件漏洞",
    detail: "81% 含高風險或重大風險弱點",
    source: "Black Duck 2025 OSSRA Report",
    href: "https://www.blackduck.com/blog/ossra-addresses-common-open-source-questions.html",
  },
  {
    number: "4.88M USD",
    label: "平均資料外洩事件成本",
    detail: "全球平均資料外洩成本創新高",
    source: "IBM Cost of a Data Breach Report 2024",
    href: "https://www.ibm.com/think/insights/whats-new-2024-cost-of-a-data-breach-report",
  },
  {
    number: "AI ≠ 安全",
    label: "AI 助手使用者產出較不安全程式碼",
    detail: "且更傾向相信自己的程式碼是安全的",
    source: "Perry et al., ACM CCS 2023",
    href: "https://arxiv.org/abs/2211.03622",
  },
];

const painPoints = [
  "開發者知道有 SAST finding，卻缺少能落地追蹤的修復與審核流程",
  "AI 生成程式碼快速進入產品，安全性與可維護性無法被一致驗證",
  "SBOM、CBOM、PQC、Quality Gate 與稽核附件散落在不同工具",
  "多 BU 權限、主管審核與證據留存難以符合金融業採購要求",
  "委外與內部專案都需要同一套可交付、可追溯的治理語言",
  "AI coding 工具與 MCP server 進入研發流程，prompt injection、冒充 MCP server、濫用本機 AI CLI 成為沒人盤點的新攻擊面",
  "RSA／短金鑰散落各系統，HNDL（先竊取、待量子破解）讓今天的密文未來被解密，卻沒有一份可稽核的加密資產清冊",
  "智慧工廠與 OT/ICS 設備生命週期長，加密資產與 AI Agent 設定難以滾動盤點，產線中斷成本遠高於一般 IT",
  "製造業出口歐盟產品需因應 CRA，缺乏機器可讀 SBOM/VEX 與可稽核證據包",
];

export default function PainPoints() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why" className="bg-[#0F1923] py-24">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            為什麼需要 <span className="text-[#14B8A6]">AegisCode</span>？
          </h2>
          <p className="text-lg text-gray-400">用可查證來源說明程式碼治理風險（金融 · 製造業 · AI 開發）</p>
        </motion.div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {evidence.map((stat, i) => (
            <motion.a
              key={stat.source}
              href={stat.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card-glow rounded-xl border border-[#243447] bg-[#1A2332] p-8 transition hover:border-[#14B8A6]/50"
            >
              <div className="mb-3 text-4xl font-bold text-[#14B8A6] sm:text-5xl">
                {stat.number}
              </div>
              <p className="mb-2 text-base text-gray-200">{stat.label}</p>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">{stat.detail}</p>
              <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                Source: {stat.source}
                <ExternalLink size={12} />
              </p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-xl border border-[#243447] bg-[#1A2332] p-8"
        >
          <h3 className="mb-6 text-lg font-semibold text-gray-200">
            高法遵組織（金融、製造業、政府）常見的程式碼與 AI 治理痛點
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {painPoints.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                <span className="text-sm text-gray-300">{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
