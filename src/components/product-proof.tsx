"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Database,
  FileDown,
  KeyRound,
  BookOpenCheck,
  ShieldCheck,
  Server,
} from "lucide-react";

const proofItems = [
  {
    icon: KeyRound,
    title: "CBOM/PQC Portfolio",
    desc: "以匿名化金融情境快速產出加密資產、PQC 遷移風險與主管摘要。",
  },
  {
    icon: FileDown,
    title: "Evidence Pack",
    desc: "CBOM 報告、風險摘要與審核紀錄可作為主管簡報與稽核附件。",
  },
  {
    icon: BookOpenCheck,
    title: "Peer-reviewed Research",
    desc: "Zero-Touch Vulnerability Remediation framework 已於 MDPI Mathematics 發表，DOI: 10.3390/math14061072。",
  },
  {
    icon: Server,
    title: "Enterprise Delivery Guard",
    desc: "POC 與客戶環境採用明確的啟用條件、權限控管與交付檢查，確保評估範圍與正式導入邊界清楚分離。",
  },
];

export default function ProductProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="product-proof" className="py-24 bg-[#0F1923]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-medium text-[#5EEAD4]">
              <ShieldCheck size={14} />
              產品準備度更新 / Product Readiness
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              不是簡報概念，已經有可展示、可驗證、可交付的產品證據。
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-400">
              AegisCode 的對外訊息現在直接連到客戶可檢查的產品證據：CBOM/PQC portfolio、Evidence Pack、研究基礎與 Enterprise POC 交付控管。
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["CBOM", "portfolio 快速產出"],
                ["POC", "金融情境導覽"],
                ["DOI", "10.3390/math14061072"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-[#243447] bg-[#1A2332] p-4">
                  <div className="text-2xl font-bold text-[#14B8A6]">{value}</div>
                  <div className="mt-1 text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {proofItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-xl border border-[#243447] bg-[#1A2332] p-5 card-glow"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D9488]/10 text-[#14B8A6]">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 p-5"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Database className="mt-0.5 h-5 w-5 shrink-0 text-[#FBBF24]" />
              <p className="text-sm leading-relaxed text-amber-100">
                對外 POC 建議主軸：先用 CBOM/PQC 盤點切入金融合規，再用 SAST 與 Quality Gate 擴大到 SDLC 治理。
              </p>
            </div>
            <a
              href="https://www.mdpi.com/2227-7390/14/6/1072"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#FBBF24]"
            >
              查看研究來源
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
