"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRightLeft,
  ArrowUpRight,
  Building2,
  FileCheck2,
  Globe2,
  Radar,
  ShieldAlert,
} from "lucide-react";
import { useRef } from "react";

const signals = [
  {
    icon: Radar,
    label: "外部曝險評分",
    text: "可搭配 SecurityScorecard、BitSight 或客戶既有 EASM 評分，補齊外部可觀測風險。",
  },
  {
    icon: Building2,
    label: "供應商 / BU 對應",
    text: "把 domain、供應商、BU、系統與 repo 綁定，讓第三方風險不再只停在採購表單。",
  },
  {
    icon: FileCheck2,
    label: "主管證據包",
    text: "把 SAST、SBOM、CBOM 與外部評分放進同一份治理摘要，方便稽核與董事會溝通。",
  },
];

const riskRows = [
  ["內部程式碼風險", "SAST findings", "High"],
  ["開源供應鏈風險", "SBOM / SCA", "Medium"],
  ["加密資產風險", "CBOM / PQC", "High"],
  ["外部曝險評分", "Security rating import", "Review"],
  ["第三方治理狀態", "Vendor domain mapping", "Ready"],
];

function riskTone(status: string): string {
  if (status === "High") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (status === "Medium") return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  if (status === "Review") return "border-sky-500/30 bg-sky-500/10 text-sky-200";
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
}

export default function SurfaceSpotlight() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section id="surface-spotlight" className="bg-[#0D1521] py-24">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-medium text-sky-200">
              <Globe2 className="h-4 w-4" />
              外部風險治理包 / Sales-ready
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AegisCode Surface — 從程式碼治理，延伸到外部曝險與供應商風險。
            </h2>
            <p className="mt-4 text-base leading-8 text-gray-400">
              AegisCode 不需要取代 SecurityScorecard。更好的打法，是把外部安全評分、供應商 domain 與 AegisCode 的 SAST、SBOM、CBOM 證據整合，形成高法遵組織可以審核、可以追蹤、可以交付的治理視圖。
            </p>

            <div className="mt-7 grid gap-4">
              {signals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.label}
                    className="flex gap-4 rounded-xl border border-[#243447] bg-[#101B28] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{signal.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-400">{signal.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-7">
              <Link
                href="/surface"
                className="inline-flex items-center gap-2 rounded-lg border border-sky-400/30 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300 hover:bg-sky-400/10"
              >
                查看外部風險銷售方案
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="rounded-2xl border border-[#243447] bg-[#0F1923] p-5 shadow-2xl shadow-black/30"
          >
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#243447] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Executive Risk View
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">AegisCode Governance Pack</h3>
              </div>
              <div className="rounded-lg border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-3 py-2 text-xs font-semibold text-[#5EEAD4]">
                POC-ready
              </div>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Code", "inside-out"],
                ["Vendor", "third-party"],
                ["Rating", "outside-in"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-xl border border-[#243447] bg-[#0D1521] p-4">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {riskRows.map(([name, source, status]) => (
                <div
                  key={name}
                  className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-[#243447] bg-[#101B28] p-4 sm:grid-cols-[1fr_170px_auto]"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-100">{name}</div>
                    <div className="mt-1 text-xs text-gray-500 sm:hidden">{source}</div>
                  </div>
                  <div className="hidden text-sm text-gray-400 sm:block">{source}</div>
                  <div
                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${riskTone(status)}`}
                  >
                    {status}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-sky-400/20 bg-sky-400/10 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" />
              <p className="text-sm leading-6 text-sky-100">
                對外只呈現治理成果、交付範圍與導入條件；正式整合方式、資料留存與服務邊界會在 Enterprise POC 與合約階段確認。
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 text-xs font-medium text-gray-500">
              <span>AegisCode</span>
              <ArrowRightLeft className="h-4 w-4 text-[#14B8A6]" />
              <span>Security rating source</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
