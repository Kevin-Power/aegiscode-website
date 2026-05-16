"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const codeMilestones = [
  { quarter: "2024 Q4", title: "研發啟動", desc: "完成治理工作流與金融合規需求盤點" },
  { quarter: "2025 Q3", title: "CBOM/PQC 核心引擎完成", desc: "加密資產盤點、生命週期決策與證據輸出" },
  { quarter: "2026 Q1", title: "SAST-in-the-Loop 整合釋出", desc: "串接 SAST findings、AI review 與主管審核紀錄" },
  { quarter: "2026 Q2", title: "首批 POC 開放申請", desc: "30 天金融情境 POC，聚焦 CBOM 與合規證據包" },
  { quarter: "2026 Q3", title: "正式版上線", desc: "Enterprise 合約、SSO、DPA 與採購建檔資料完備" },
];

const surfaceMilestones = [
  {
    quarter: "2026 Q2",
    title: "Surface 商業版 v0.1 釋出",
    desc: "SecurityScorecard 整合、AI 修補建議、台灣法規對應、CISO 月報、年度顧問訂閱開放申請。",
  },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-[#0F1923] py-24">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">雙產品研發與交付里程碑</h2>
          <p className="text-lg text-gray-400">
            不用 placeholder 數字撐場，直接呈現 AegisCode Code 與 Surface 的產品成熟路線。
          </p>
        </motion.div>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-semibold text-[#5EEAD4]">
            AegisCode Code
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {codeMilestones.map((item, i) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-[#243447] bg-[#1A2332] p-5"
              >
                <div className="text-sm font-semibold text-[#14B8A6]">{item.quarter}</div>
                <h3 className="mt-3 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold text-sky-200">
            AegisCode Surface
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {surfaceMilestones.map((item, i) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-sky-400/30 bg-[#1A2332] p-5 lg:col-span-2"
              >
                <div className="text-sm font-semibold text-sky-200">{item.quarter}</div>
                <h3 className="mt-3 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
