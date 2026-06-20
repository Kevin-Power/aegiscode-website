"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reviewOutputs = [
  "SAST findings 與 LLM 上下文合併判讀",
  "繁體中文修復建議與審核摘要",
  "主管可追蹤的接受風險、誤判、修復紀錄",
  "支援 AI 助手與 Copilot 類工具生成程式碼的二次檢查",
];

const dimensions = [
  "正確性",
  "安全性",
  "效能",
  "可維護性",
  "錯誤處理",
  "程式碼風格",
  "架構設計",
];

export default function AiHealthCheck() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden bg-[#0F1923] py-24">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#0D9488]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-6 inline-block rounded-full border border-purple-500/30 bg-purple-500/15 px-4 py-1.5 text-xs font-medium text-purple-300">
            AegisCode Code · 為繁體中文研發團隊設計
          </span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            AI 程式碼健檢與 SAST-in-the-Loop 審查
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-400">
            AegisCode 整合 SAST findings 與 LLM 上下文審查，為 AI 助手與 Copilot 類工具
            生成的程式碼提供繁中工作流的健檢與修復建議。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border border-[#243447] bg-[#1A2332] p-8"
          >
            <h3 className="mb-6 text-lg font-semibold text-[#14B8A6]">
              七個審查面向
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {dimensions.map((item) => (
                <div key={item} className="rounded-lg border border-[#243447] bg-[#0D1521] p-3 text-sm text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl border border-[#0D9488]/30 bg-[#1A2332] p-8"
          >
            <h3 className="mb-5 text-lg font-semibold text-white">
              不只標記問題，也留下可審核證據
            </h3>
            <div className="space-y-3">
              {reviewOutputs.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#14B8A6]" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-lg border border-[#243447] bg-[#0D1521]/70 p-4 text-sm leading-relaxed text-gray-400">
              核心定位是「繁中治理工作流」與「主管可審核的稽核紀錄」，
              避免與通用 AI code review 工具做不可防守的唯一性宣稱。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
