"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Activity,
  Database,
  FileDown,
  KeyRound,
  ShieldCheck,
  Server,
} from "lucide-react";

const proofItems = [
  {
    icon: KeyRound,
    title: "CBOM/PQC Demo Workspace",
    desc: "可一鍵產生金融情境 demo portfolio，包含 RSA、MD5、硬編 IV、短金鑰與 lifecycle decision。",
  },
  {
    icon: FileDown,
    title: "Evidence Export",
    desc: "CBOM 報告、portfolio CSV、finding history 與審核紀錄可直接拿去做主管簡報與稽核附件。",
  },
  {
    icon: Activity,
    title: "Operational Queue",
    desc: "Redis/Worker 異常時不留下假 QUEUED 狀態，掃描會標記 FAILED 並回傳可行動錯誤。",
  },
  {
    icon: Server,
    title: "Production Health & Seed Guard",
    desc: "正式環境有獨立 liveness probe；展示或客戶環境 seed 必須指定管理員密碼，避免預設帳密流入交付環境。",
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
              Product readiness update
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              不是簡報概念，已經有可展示、可驗證、可交付的產品證據。
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-400">
              AegisCode 的對外訊息現在直接連到 WT-Sonaqu 的實作進度：CBOM/PQC demo、稽核輸出、掃描可靠性與部署安全都已納入產品工作流。
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["217", "tests passing"],
                ["CBOM", "demo ready"],
                ["200", "liveness probe"],
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
              href="/trial"
              className="shrink-0 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#FBBF24]"
            >
              申請 30 天 POC
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
