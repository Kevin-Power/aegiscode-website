"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { KeyRound, Search, Bot, Sliders } from "lucide-react"

type TourStep = {
  key: string
  icon: typeof KeyRound
  tabLabel: string
  title: string
  body: React.ReactNode
}

const steps: TourStep[] = [
  {
    key: "cbom",
    icon: KeyRound,
    tabLabel: "CBOM 盤點",
    title: "CBOM / PQC 加密資產盤點",
    body: (
      <ul className="space-y-2 text-sm leading-7 text-gray-200">
        <li>• RSA-2048 → PQC migration risk: <span className="text-amber-300">High</span></li>
        <li>• MD5 in legacy auth flow: <span className="text-red-300">Critical</span></li>
        <li>• Hard-coded IV in payment: <span className="text-red-300">Critical</span></li>
        <li>• AES-128 short key: <span className="text-amber-300">Medium</span></li>
      </ul>
    ),
  },
  {
    key: "sast",
    icon: Search,
    tabLabel: "SAST 掃描",
    title: "SAST findings + severity",
    body: (
      <ul className="space-y-2 text-sm leading-7 text-gray-200">
        <li>• SQL injection in user search — <span className="text-red-300">Critical</span></li>
        <li>• XSS in profile page — <span className="text-amber-300">High</span></li>
        <li>• Hard-coded secret in config — <span className="text-amber-300">High</span></li>
        <li>• Insecure deserialization — <span className="text-amber-300">Medium</span></li>
      </ul>
    ),
  },
  {
    key: "vulnforge",
    icon: Bot,
    tabLabel: "VULNFORGE",
    title: "SAST-in-the-Loop:findings → fix workflow",
    body: (
      <div className="space-y-3 text-sm leading-7 text-gray-200">
        <p className="text-gray-400">Finding → AI 建議 → 主管審核 → Merge</p>
        <div className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
          <div className="mb-1 text-xs text-gray-500">建議的修補 patch</div>
          <code className="text-xs text-[#5EEAD4]">
            - query = &quot;SELECT * FROM users WHERE id=&quot; + userId<br />
            + query = &quot;SELECT * FROM users WHERE id=?&quot;; params.push(userId)
          </code>
        </div>
        <p className="text-xs text-gray-500">主管 review → approved → CI 自動合併</p>
      </div>
    ),
  },
  {
    key: "gate",
    icon: Sliders,
    tabLabel: "Quality Gate",
    title: "Multi-dim Quality Gate + 主管審核",
    body: (
      <div className="space-y-2 text-sm leading-7 text-gray-200">
        <div className="flex justify-between border-b border-[#243447] pb-2">
          <span>BU: Core Banking · Critical findings</span>
          <span className="text-red-300">2 / 0 ❌</span>
        </div>
        <div className="flex justify-between border-b border-[#243447] pb-2">
          <span>BU: Core Banking · High findings</span>
          <span className="text-amber-300">5 / 3 ⚠</span>
        </div>
        <div className="flex justify-between">
          <span>BU: Core Banking · 主管審核</span>
          <span className="text-cyan-300">pending</span>
        </div>
      </div>
    ),
  },
]

export default function CodeTour() {
  const [active, setActive] = useState(0)

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold">產品畫面導覽</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-gray-400">
          4 個核心模組依產品導覽流程排列。點選分頁切換，查看匿名化金融情境中的治理證據與審核節點。
        </p>

        {/* Mobile: select */}
        <div className="md:hidden mb-6">
          <label className="sr-only" htmlFor="code-tour-select">
            選擇步驟
          </label>
          <select
            id="code-tour-select"
            value={active}
            onChange={(e) => setActive(Number(e.target.value))}
            className="w-full rounded-lg border border-[#243447] bg-[#0F1923] px-4 py-3 text-sm text-white"
          >
            {steps.map((s, i) => (
              <option key={s.key} value={i}>
                {i + 1}. {s.tabLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: tab bar */}
        <div className="mb-6 hidden gap-2 md:flex">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  active === i
                    ? "border-[#14B8A6] bg-[#14B8A6]/10 text-[#5EEAD4]"
                    : "border-[#243447] bg-[#101B28] text-gray-300 hover:border-[#14B8A6]/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                {s.tabLabel}
              </button>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#243447] bg-[#0F1923] p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[active].key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                {steps[active].title}
              </h3>
              {steps[active].body}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
