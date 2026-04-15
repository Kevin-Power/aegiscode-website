"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const grades = [
  { grade: "S", label: "卓越", color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { grade: "A", label: "優良", color: "from-green-400 to-green-600", bg: "bg-green-500/10", border: "border-green-500/30" },
  { grade: "B", label: "合格", color: "from-yellow-400 to-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  { grade: "C", label: "待改善", color: "from-orange-400 to-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { grade: "D", label: "高風險", color: "from-red-400 to-red-600", bg: "bg-red-500/10", border: "border-red-500/30" },
];

const categories = [
  "程式碼正確性 (Correctness)",
  "安全漏洞 (Security)",
  "效能問題 (Performance)",
  "可維護性 (Maintainability)",
  "錯誤處理 (Error Handling)",
  "程式碼風格 (Code Style)",
  "架構設計 (Architecture)",
];

export default function AiHealthCheck() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#0F1923] relative overflow-hidden">
      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0D9488]/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium mb-6">
            業界首創
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI 程式碼健檢
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            專為 AI 生成程式碼設計的智慧分析引擎，涵蓋 7 大問題分類，提供 S~D
            五級評分與具體改善建議
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Categories */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1A2332] border border-[#243447] rounded-xl p-8"
          >
            <h3 className="text-lg font-semibold mb-6 text-[#14B8A6]">
              7 大 AI 程式碼問題分類
            </h3>
            <div className="space-y-3">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                  {cat}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Grade cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
              五級評分系統
            </h3>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {grades.map((g, i) => (
                <motion.div
                  key={g.grade}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className={`${g.bg} ${g.border} border rounded-xl p-5 text-center w-24`}
                >
                  <div
                    className={`text-3xl font-bold bg-gradient-to-b ${g.color} bg-clip-text text-transparent`}
                  >
                    {g.grade}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{g.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 bg-[#1A2332] border border-[#0D9488]/30 rounded-xl p-5">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="text-[#14B8A6] font-semibold">
                  AegisCode 獨家功能
                </span>{" "}
                — 市面上唯一針對 AI 生成程式碼提供專業健檢的平台。從正確性到架構設計，全方位檢測 AI 產出的程式碼品質，讓您安心使用 Copilot、ChatGPT 等 AI 工具。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
