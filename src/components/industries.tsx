"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Factory, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";

const verticals = [
  {
    icon: Building2,
    title: "金融與銀行",
    subtitle: "金管會 PQC 準備期首選",
    points: [
      "CBOM 自動盤點對接 2026–2027 準備期",
      "集團多 BU + CISO 視圖與稽核證據包",
      "SAML SSO、Air-gapped 與 ZDR 支援",
      "F-ISAC 成熟度自評與繁中合規報告",
    ],
    cta: "申請金融 POC",
    href: "/trial?track=CODE",
  },
  {
    icon: Factory,
    title: "製造業與智慧工廠",
    subtitle: "Industry 4.0 + CRA 出口合規",
    points: [
      "OT / MES 長期設備的 CBOM 與 PQC 路線圖",
      "產線 AI Agent 與邊緣模型的 AI-BOM 治理",
      "CRA 機器可讀 SBOM / VEX 與證據鏈",
      "供應鏈風險與外部攻擊面月報",
    ],
    cta: "了解製造方案",
    href: "/trial?track=BOTH",
  },
  {
    icon: BrainCircuit,
    title: "AI 開發與導入團隊",
    subtitle: "AI coding 工具鏈安全",
    points: [
      "AI 生成程式碼的 SAST-in-the-Loop 二次驗證",
      "MCP server、向量 DB、Agent 設定盤點",
      "Prompt injection 與資料出境風險標記",
      "Build-time 攔截不安全 AI 產出",
    ],
    cta: "評估 AI 攻擊面",
    href: "/trial?track=CODE",
  },
];

export default function Industries() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="industries" className="bg-[#0F1923] py-20">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            專為三大高法遵領域設計
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-400">
            同一套治理閉環，對應銀行合規、智慧製造與 AI 開發的不同痛點
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {verticals.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="flex flex-col rounded-2xl border border-[#243447] bg-[#0D1521] p-7"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#5EEAD4]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-1 text-sm text-[#14B8A6]">{v.subtitle}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {v.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#14B8A6]" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={v.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#5EEAD4] transition hover:text-white"
                >
                  {v.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
