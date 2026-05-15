"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Code2,
  FileCheck2,
  Globe2,
  KeySquare,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useRef } from "react"

const codeCaps = [
  { icon: ShieldCheck, label: "SAST 弱點掃描" },
  { icon: KeySquare, label: "CBOM / PQC 加密資產" },
  { icon: Layers, label: "SBOM / SCA + 主管審核" },
  { icon: FileCheck2, label: "繁中合規證據包" },
]

const surfaceCaps = [
  { icon: Globe2, label: "外部評分整合" },
  { icon: Sparkles, label: "AI 修補建議 P0–P3" },
  { icon: Scale, label: "台灣法規對應" },
  { icon: FileCheck2, label: "顧問級 CISO 月報" },
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
              SAST + CBOM/PQC + SBOM/SCA + 主管審核 + 繁中證據包。對象是研發團隊與資安 BU 管理者。
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
              評分整合 + AI 修補 + 法規對應 + CISO 月報 + 年度顧問訂閱。對象是 CISO 與管理層。
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
