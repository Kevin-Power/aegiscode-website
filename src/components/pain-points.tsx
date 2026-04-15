"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle } from "lucide-react";

const stats = [
  {
    number: "85%",
    label: "資安事件來自程式碼漏洞",
    source: "OWASP Foundation",
  },
  {
    number: "30x",
    label: "上線後修復成本 vs. 開發階段",
    source: "IBM Systems Sciences",
  },
  {
    number: "46%",
    label: "AI 生成程式碼含安全漏洞",
    source: "Stanford University, 2023",
  },
];

const painPoints = [
  "開發者不知道程式碼有哪些安全風險",
  "AI 生成的程式碼品質無法保證",
  "上線後才發現漏洞，修復成本暴增",
  "缺乏統一的程式碼品質標準與管理",
  "多個部門的程式碼安全無法統一管控",
];

export default function PainPoints() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why" className="py-24 bg-[#0F1923]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            為什麼需要{" "}
            <span className="text-[#14B8A6]">AegisCode</span>？
          </h2>
          <p className="text-gray-400 text-lg">
            The hidden cost of insecure code
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#1A2332] border border-[#243447] rounded-xl p-8 text-center card-glow transition-all duration-300"
            >
              <div className="text-5xl sm:text-6xl font-bold text-[#14B8A6] mb-3">
                {stat.number}
              </div>
              <p className="text-gray-200 text-base mb-2">{stat.label}</p>
              <p className="text-gray-500 text-xs">Source: {stat.source}</p>
            </motion.div>
          ))}
        </div>

        {/* Pain points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-[#1A2332] border border-[#243447] rounded-xl p-8"
        >
          <h3 className="text-lg font-semibold mb-6 text-gray-200">
            企業常見的程式碼安全痛點
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {painPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="text-amber-500 mt-0.5 shrink-0"
                />
                <span className="text-gray-300 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
