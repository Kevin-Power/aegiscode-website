"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  CheckCircle2,
  FileBarChart,
  ScanSearch,
  Upload,
  Wrench,
} from "lucide-react";

const steps = [
  { icon: Upload, label: "匯入", desc: "連接 Git 專案或上傳程式碼" },
  { icon: ScanSearch, label: "掃描", desc: "SAST、SCA 與 AI 上下文審查" },
  { icon: FileBarChart, label: "彙整", desc: "產出 findings、CBOM 與證據包" },
  { icon: Wrench, label: "修復", desc: "提供繁中修復建議與簽核流程" },
  { icon: CheckCircle2, label: "交付", desc: "交付主管可審核的稽核紀錄" },
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            從掃描到稽核交付的治理工作流
          </h2>
          <p className="text-gray-400 text-lg">
            將開發端 findings、修復建議與主管證據包收斂在同一個流程
          </p>
        </motion.div>

        <div className="relative">
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
                  <div className="relative z-10 w-20 h-20 rounded-full bg-[#1A2332] border-2 border-[#243447] flex items-center justify-center mb-4 group hover:border-[#0D9488] transition-colors duration-300">
                    <Icon size={28} className="text-[#14B8A6]" />
                  </div>
                  <span className="text-xs text-[#0D9488] font-mono mb-1">
                    0{i + 1}
                  </span>
                  <h4 className="text-base font-semibold mb-1">{step.label}</h4>
                  <p className="text-xs text-gray-400 max-w-[140px]">
                    {step.desc}
                  </p>

                  {i < steps.length - 1 ? (
                    <div className="hidden md:block absolute top-10 -right-2 text-[#243447] text-lg">
                      &rarr;
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/30">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="text-sm text-[#14B8A6] font-medium">
              {"增量掃描 < 30 秒，全量掃描 100K LOC < 5 分鐘"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
