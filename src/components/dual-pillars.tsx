"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Code2,
  FileCheck2,
  FileText,
  Globe2,
  KeySquare,
  Layers,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react"
import { useRef } from "react"

const codeCaps = [
  { icon: ShieldCheck, label: "SAST + DAST 完整掃描閉環" },
  { icon: KeySquare, label: "CBOM / PQC 加密資產盤點" },
  { icon: Layers, label: "SBOM / SCA + Container / IaC / Secrets" },
  { icon: Target, label: "F-ISAC 7 主題成熟度自評" },
  { icon: Lock, label: "SOC 2 / SAML SSO + 集團 CISO 視圖" },
  { icon: FileCheck2, label: "繁中合規證據包 + 主管審核留痕" },
]

const surfaceCaps = [
  { icon: Globe2, label: "外部評分整合 + 供應商風險彙整" },
  { icon: Sparkles, label: "AI 修補建議 P0–P3 + 工時 / ROI 試算" },
  { icon: Scale, label: "台灣法規對應（資安法 / 個資法 / ISO 27001）" },
  { icon: Activity, label: "每週差異追蹤 + 修補任務追蹤" },
  { icon: FileText, label: "顧問級 CISO 月報（董事會可呈交）" },
  { icon: Users, label: "季度治理檢討 + 每月顧問解讀會議" },
]

export default function DualPillars() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-[#0D1521] py-20">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            兩條產品線,一個治理閉環
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-400">
            從內部程式碼到外部攻擊面,AegisCode 讓 CISO 一份報告交代兩面風險。
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Code card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="rounded-2xl border border-[#14B8A6]/30 bg-[#0F1923] p-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-3 py-1 text-xs font-semibold text-[#5EEAD4]">
              <Code2 className="h-3.5 w-3.5" />
              AegisCode Code
            </div>
            <h3 className="text-xl font-bold">內部程式碼資安治理</h3>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              從 SAST、DAST、CBOM/PQC 到 F-ISAC 自評與 SOC 2 Audit Log，內部程式碼資安治理的完整閉環。對象是研發團隊、資安 BU 與集團 CISO。
            </p>
            <ul className="mt-6 space-y-3">
              {codeCaps.map((cap) => {
                const Icon = cap.icon
                return (
                  <li
                    key={cap.label}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#14B8A6]/10 text-[#5EEAD4]">
                      <Icon className="h-4 w-4" />
                    </span>
                    {cap.label}
                  </li>
                )
              })}
            </ul>
            <Link
              href="/code"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              看 Code 詳情
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Surface card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="rounded-2xl border border-sky-400/30 bg-[#0F1923] p-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
              <Globe2 className="h-3.5 w-3.5" />
              AegisCode Surface
            </div>
            <h3 className="text-xl font-bold">外部攻擊面治理</h3>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              把外部評分、供應商風險、修補優先順序、台灣法規對應與顧問月報整合成 CISO 每月可向董事會交代的治理視圖。對象是 CISO、稽核與管理層。
            </p>
            <ul className="mt-6 space-y-3">
              {surfaceCaps.map((cap) => {
                const Icon = cap.icon
                return (
                  <li
                    key={cap.label}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-400/10 text-sky-200">
                      <Icon className="h-4 w-4" />
                    </span>
                    {cap.label}
                  </li>
                )
              })}
            </ul>
            <Link
              href="/surface"
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-sky-400/40 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
            >
              看 Surface 詳情
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
