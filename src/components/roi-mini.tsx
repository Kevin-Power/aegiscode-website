"use client"

import { useMemo, useState } from "react"
import { estimateRoi, type RoiInput } from "@/lib/roi-mini-calc"

const REPOS: Array<RoiInput["repos"]> = [10, 25, 50, 100]
const SENSITIVITIES: Array<{ value: RoiInput["sensitivity"]; label: string }> = [
  { value: "low", label: "低" },
  { value: "mid", label: "中" },
  { value: "high-fin", label: "高(金融)" },
]
const CURRENTS: Array<{ value: RoiInput["current"]; label: string }> = [
  { value: "excel", label: "Excel 散落" },
  { value: "partial-tool", label: "部分工具" },
  { value: "platform", label: "已有平台" },
]

export default function RoiMini() {
  const [repos, setRepos] = useState<RoiInput["repos"]>(25)
  const [sensitivity, setSensitivity] = useState<RoiInput["sensitivity"]>("mid")
  const [current, setCurrent] = useState<RoiInput["current"]>("partial-tool")

  const result = useMemo(
    () => estimateRoi({ repos, sensitivity, current }),
    [repos, sensitivity, current],
  )

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#243447] bg-[#0F1923] p-8">
        <h2 className="mb-2 text-2xl font-bold">
          快速估算 — 30 天 POC 能產出多少 CBOM finding
        </h2>
        <p className="mb-8 text-sm leading-7 text-gray-400">
          這個估算只用 3 個維度做線性映射,提供業務對話起點。實際結果依專案範圍而定,POC 階段會校準。
        </p>

        <RoiField label="程式碼倉庫數">
          {REPOS.map((value) => (
            <RoiChoice
              key={value}
              active={repos === value}
              onClick={() => setRepos(value)}
            >
              {value}
              {value === 100 ? "+" : ""}
            </RoiChoice>
          ))}
        </RoiField>

        <RoiField label="加密敏感度">
          {SENSITIVITIES.map(({ value, label }) => (
            <RoiChoice
              key={value}
              active={sensitivity === value}
              onClick={() => setSensitivity(value)}
            >
              {label}
            </RoiChoice>
          ))}
        </RoiField>

        <RoiField label="目前盤點方式">
          {CURRENTS.map(({ value, label }) => (
            <RoiChoice
              key={value}
              active={current === value}
              onClick={() => setCurrent(value)}
            >
              {label}
            </RoiChoice>
          ))}
        </RoiField>

        <div className="mt-8 rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-5">
          <p className="text-sm leading-7 text-gray-200">
            依您輸入,AegisCode Code 預估可在 30 天 POC 內產出{" "}
            <strong className="text-[#5EEAD4]">~{result.findings}</strong> 個高風險 CBOM finding,並節省{" "}
            <strong className="text-[#5EEAD4]">~{result.hoursSavedPerMonth}</strong> 工時/月。
          </p>
        </div>
      </div>
    </section>
  )
}

function RoiField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function RoiChoice({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-[#14B8A6] bg-[#14B8A6]/15 text-[#5EEAD4]"
          : "border-[#243447] bg-[#101B28] text-gray-300 hover:border-[#14B8A6]/40"
      }`}
    >
      {children}
    </button>
  )
}
