"use client"

import { motion, useInView } from "framer-motion"
import { Scale, ShieldCheck } from "lucide-react"
import { useRef } from "react"

const regulations: Array<{
  title: string
  subtitle: string
  items: string[]
}> = [
  {
    title: "資通安全管理法",
    subtitle: "資安事件、弱點掃描、改善追蹤",
    items: [
      "資安事件分級與通報窗口",
      "弱點掃描與修補時效要求",
      "資安治理組織與責任歸屬",
      "稽核紀錄保存與審查週期",
    ],
  },
  {
    title: "個人資料保護法",
    subtitle: "個資處理、技術保護、外洩通報",
    items: [
      "個資處理目的與最小化原則",
      "技術與組織保護措施",
      "外洩通報與當事人告知",
      "委外處理與第三方治理",
    ],
  },
  {
    title: "ISO 27001:2022",
    subtitle: "資訊安全管理系統 (ISMS)",
    items: [
      "A.5 組織控制 — 治理結構與責任",
      "A.6 人員控制 — 安全意識訓練",
      "A.8 技術控制 — 弱點管理與密碼學",
      "A.5.23 雲端服務與第三方風險",
    ],
  },
  {
    title: "金融業後量子密碼遷移參考指引",
    subtitle: "金管會 2026/6/18 發布 · 準備期 2026–2027",
    items: [
      "密碼技術清冊 CBOM 盤點(AI 自動化輔助)",
      "加密敏捷性與密碼反模式清除",
      "風險導向遷移優先序評估",
      "供應鏈 SBOM 與可離線驗證證據鏈",
    ],
  },
  {
    title: "歐盟網路韌性法案 CRA",
    subtitle: "出口歐盟適用 · 通報義務 2026/9/11 生效",
    items: [
      "機器可讀 SBOM(CycloneDX / SPDX)",
      "已知被利用漏洞情資 — 對應 24 / 72 小時通報觸發",
      "漏洞處理與修補紀錄佐證(簽章證據包)",
      "VEX 可利用性聲明(OpenVEX)— 本季推出",
    ],
  },
]

export default function ComplianceMatrix() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="compliance"
      className="bg-[#0F1923] py-24"
    >
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-200">
            <Scale className="h-4 w-4" />
            法規對應 · 台灣 + 出口歐盟
          </div>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            把技術修補 ↔ 管理層看得懂的法規條目對齊。
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-gray-400">
            AegisCode 內建中文化法規對應,讓資安修補與加密盤點的每一步都能直接連到法規責任,適合金融、政府與高法遵組織的稽核情境。以上為協助客戶把修補與盤點證據對應到各自法規／ISMS 控制項,非 AegisCode 自身之認證主張。
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {regulations.map((reg) => (
            <div
              key={reg.title}
              className="rounded-2xl border border-[#243447] bg-[#101B28] p-6"
            >
              <div className="mb-3 flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <h3 className="text-base font-semibold">{reg.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{reg.subtitle}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {reg.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-6 text-gray-300 before:mr-2 before:text-[#5EEAD4] before:content-['•']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          完整法規對應一覽表可在
          <a
            href="/resources"
            className="ml-1 text-[#5EEAD4] hover:underline"
          >
            資源中心
          </a>
          下載。
        </p>
      </div>
    </section>
  )
}
