"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, Radar, ScanSearch, ShieldAlert } from "lucide-react";
import { useRef } from "react";

type Stage = "shipped" | "poc" | "roadmap";

const capabilities: Array<{
  icon: typeof Bot;
  title: string;
  desc: string;
  stage: Stage;
}> = [
  {
    icon: Bot,
    title: "AI 生成程式碼二次安全檢查",
    desc: "對 AI 助手 / Copilot 生成的程式碼做注入與不安全模式的二次審查，接上 SAST-in-the-Loop 工作流，把被污染或不安全的產物擋在合併前。",
    stage: "shipped",
  },
  {
    icon: ScanSearch,
    title: "AI / MCP 設定衛生盤點",
    desc: "掃描 repo 與 CI 內的 AI 工具與 MCP 設定檔，盤點來源信任邊界與最小權限，把散落、沒人管的 AI 設定納入同一份治理視圖。",
    stage: "poc",
  },
  {
    icon: Radar,
    title: "MCP 來源驗證 · 冒名 server 偵測",
    desc: "針對 postmark-mcp 這類冒名／投毒的 MCP server 做來源驗證與 known-bad 比對，於導入時把第三方 MCP 納入 TPRM 流程。",
    stage: "roadmap",
  },
];

const stageStyles: Record<Stage, { label: string; className: string }> = {
  shipped: {
    label: "已出貨",
    className: "border-[#14B8A6]/40 bg-[#14B8A6]/10 text-[#5EEAD4]",
  },
  poc: {
    label: "POC 導入盤點",
    className: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  },
  roadmap: {
    label: "規劃中",
    className: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  },
};

export default function AiAttackSurface() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ai-attack-surface" className="scroll-mt-24 bg-[#0D1521] py-24">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.08] px-4 py-1.5 text-xs font-semibold text-amber-200">
            <ShieldAlert className="h-4 w-4" />
            第二順風 · AI 開發鏈攻擊面
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI 正在變成新的攻擊面 —— 在 build 就攔下
          </h2>
          <p className="mt-4 text-base leading-8 text-gray-400">
            2026 上半年，攻擊者把 AI 拉進供應鏈：prompt injection 操縱 AI 助手、冒充的 MCP
            server、被濫用的本機 AI CLI。2025 年 9 月的 postmark-mcp
            事件就是縮影——一個冒名套件養信任 15 個版本，再用一行程式碼把郵件偷偷外洩。AegisCode
            的定位很單純：在 build-time、合併之前，把這條新興供應鏈風險納入同一份證據鏈。
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            const stage = stageStyles[cap.stage];
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.24) }}
                className="flex flex-col rounded-2xl border border-[#243447] bg-[#101B28] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-amber-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stage.className}`}
                  >
                    {stage.label}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">{cap.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{cap.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#243447] bg-[#0F1923] p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm leading-6 text-gray-400">
            AegisCode 只做 build-time 的「找出並擋下」。runtime 的機器身分發證、驗證與撤銷，屬姊妹方案
            <span className="text-gray-200"> AegisAgent</span> 的範圍——邊界清楚，不混淆。
          </p>
          <Link
            href="/trial?track=CODE"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
          >
            把 AI 攻擊面納入 POC 評估
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
