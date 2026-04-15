"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Upload,
  ScanSearch,
  FileBarChart,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const steps = [
  { icon: Upload, label: "上傳", desc: "上傳程式碼或 Git 連結" },
  { icon: ScanSearch, label: "掃描", desc: "自動靜態分析 + AI 健檢" },
  { icon: FileBarChart, label: "報告", desc: "詳細風險報告與評分" },
  { icon: Wrench, label: "修復", desc: "依建議修復問題" },
  { icon: CheckCircle2, label: "審核", desc: "主管審核通過上線" },
];

export default function Workflow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#0D1521]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">簡單五步驟</h2>
          <p className="text-gray-400 text-lg">
            From upload to production in minutes
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#243447] to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Circle */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-[#1A2332] border-2 border-[#243447] flex items-center justify-center mb-4 group hover:border-[#0D9488] transition-colors duration-300">
                    <Icon
                      size={28}
                      className="text-[#14B8A6]"
                    />
                  </div>
                  {/* Step number */}
                  <span className="text-xs text-[#0D9488] font-mono mb-1">
                    0{i + 1}
                  </span>
                  <h4 className="text-base font-semibold mb-1">{step.label}</h4>
                  <p className="text-xs text-gray-400 max-w-[140px]">
                    {step.desc}
                  </p>

                  {/* Arrow (desktop, except last) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 -right-2 text-[#243447] text-lg">
                      &rarr;
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Highlight bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/30">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6] font-medium">
              平均 3-5 分鐘完成全部掃描
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
