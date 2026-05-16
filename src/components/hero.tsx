"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";

const trustItems = [
  { label: "Code 產品線", value: "SAST + CBOM/PQC + SBOM/SCA" },
  { label: "Surface 產品線", value: "外部評分整合 + CISO 月報" },
  { label: "POC 期程", value: "30 天 Code POC 開放中" },
  { label: "對象", value: "金融、政府與高法遵 CISO" },
];

const dashboardRows = [
  ["Core Banking API", "CBOM/PQC", "High"],
  ["Mobile Banking", "SAST", "Medium"],
  ["Payment Gateway", "SBOM/SCA", "Critical"],
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0D1521] pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.14)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.94fr_1.06fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#243447] bg-[#1A2332]/80 px-4 py-1.5 text-xs font-medium text-gray-300">
            <ShieldCheck size={14} className="text-[#14B8A6]" />
            為台灣金融與高法遵組織打造
          </div>

          <h1 className="gradient-text glow-teal mb-5 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
            AegisCode
          </h1>

          <p className="mb-5 max-w-2xl text-[19px] font-medium leading-relaxed text-gray-100 sm:text-2xl">
            從內部程式碼到外部攻擊面 — 一份報告,兩面風險。
          </p>

          <p className="mb-10 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            AegisCode 把內部 SAST、CBOM 與外部攻擊面評分、CISO 月報、台灣法規對應收斂成一個治理閉環。Code 服務開發團隊與 BU 管理者,Surface 服務 CISO 與管理層。
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/code"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-[#0D1521] transition hover:bg-gray-200"
            >
              了解 AegisCode Code
              <ArrowRight size={18} />
            </a>
            <a
              href="/surface"
              className="inline-flex items-center justify-center rounded-lg border border-sky-400/40 px-8 py-3.5 text-base font-medium text-sky-100 transition hover:bg-sky-400/10"
            >
              了解 AegisCode Surface
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
          className="relative"
        >
          <div className="rounded-2xl border border-[#243447] bg-[#0F1923]/95 p-4 shadow-2xl shadow-black/30">
            <div className="mb-4 flex items-center justify-between border-b border-[#243447] pb-3">
              <div>
                <div className="text-sm font-semibold text-white">CBOM Portfolio</div>
                <div className="text-xs text-gray-500">Financial governance workspace</div>
              </div>
              <div className="rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-3 py-1 text-xs text-[#5EEAD4]">
                Demo Ready
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["42", "Open Findings"],
                ["8", "PQC Risks"],
                ["3", "Evidence Packs"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
                  <div className="text-2xl font-bold text-[#14B8A6]">{value}</div>
                  <div className="mt-1 text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[#243447]">
              {dashboardRows.map(([system, type, risk]) => (
                <div
                  key={system}
                  className="grid grid-cols-[1.3fr_0.8fr_0.6fr] items-center gap-3 border-b border-[#243447] bg-[#1A2332]/70 px-4 py-3 last:border-b-0"
                >
                  <div className="truncate text-sm text-gray-200">{system}</div>
                  <div className="text-xs text-gray-500">{type}</div>
                  <div
                    className={`rounded-full px-2 py-1 text-center text-[11px] font-semibold ${
                      risk === "Critical"
                        ? "bg-red-500/15 text-red-300"
                        : risk === "High"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-cyan-500/15 text-cyan-300"
                    }`}
                  >
                    {risk}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#14B8A6]/25 bg-[#14B8A6]/10 p-4">
              <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-[#14B8A6]" />
              <p className="text-sm leading-relaxed text-gray-300">
                RSA、MD5、硬編 IV、短金鑰與 PQC 遷移風險，全部進入同一份可審核證據鏈。
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 border-y border-[#243447]/80 bg-[#0A0F18]/90">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#14B8A6]" />
              <div>
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="mt-1 text-sm font-medium text-gray-200">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
