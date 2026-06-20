"use client"

import { motion, useInView } from "framer-motion"
import { ScrollText } from "lucide-react"
import { useRef } from "react"

type Hit = "direct" | "assist"

const strategies: Array<{
  strategy: string
  capability: string
  hit: Hit
}> = [
  {
    strategy: "① PQC 政策與治理",
    capability: "多 BU 治理視圖 + 加密風險儀表板",
    hit: "assist",
  },
  {
    strategy: "② 密碼技術清冊 CBOM 盤點",
    capability: "CBOM 引擎:123 規則 / 9 語言,對齊官方六項最小欄位,部署位置自動帶 file:line",
    hit: "direct",
  },
  {
    strategy: "③ 提升加密敏捷性(清除密碼反模式)",
    capability: "偵測硬編碼金鑰、弱演算法、ECB、短金鑰、寫死 IV、不安全亂數、舊 TLS、前量子用法",
    hit: "direct",
  },
  {
    strategy: "④ 生態系協作與遷移路線圖",
    capability: "跨專案 / BU 彙整與優先序呈現",
    hit: "assist",
  },
  {
    strategy: "⑤ 風險導向遷移優先序",
    capability: "量子風險 × 遷移時間評分,自動分級排序",
    hit: "direct",
  },
  {
    strategy: "⑥ 供應鏈管理(SBOM)",
    capability: "SBOM / SCA 與第三方元件風險視圖",
    hit: "direct",
  },
  {
    strategy: "⑦ 測試切換與營運韌性",
    capability: "簽章證據包 + 稽核雜湊鏈,可離線驗證真偽",
    hit: "direct",
  },
]

export default function PqcAlignment() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="pqc" className="scroll-mt-24 bg-[#0F1923] px-6 py-20">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-200">
            <ScrollText className="h-4 w-4" />
            對齊金管會 PQC 遷移指引(2026/6/18)
          </div>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            從「未來趨勢」變成「現行法規」——準備期的第一項任務,就是 AegisCode 的核心引擎。
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-gray-400">
            指引明訂準備期 2026–2027 應建立可維護的密碼技術清冊(CBOM),並鼓勵以 AI 等自動化工具輔助盤點——人工 Excel 難以建立與滾動維護。HNDL（先竊取、待量子破解）讓今天加密的金融資料未來被解密,遷移不能等 2035。下表是指引七大策略對應 AegisCode 的已出貨能力。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-[#243447]"
        >
          <div className="hidden bg-[#0A0F18] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:grid sm:grid-cols-[1.1fr_1.6fr_0.5fr]">
            <div>指引策略方向</div>
            <div>AegisCode 已出貨能力</div>
            <div>命中</div>
          </div>
          {strategies.map((row) => (
            <div
              key={row.strategy}
              className="grid gap-1.5 border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm sm:grid-cols-[1.1fr_1.6fr_0.5fr] sm:items-center sm:gap-4"
            >
              <div className="font-medium text-gray-100">{row.strategy}</div>
              <div className="leading-6 text-gray-400">{row.capability}</div>
              <div>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    row.hit === "direct"
                      ? "bg-[#14B8A6]/15 text-[#5EEAD4]"
                      : "bg-sky-500/15 text-sky-300"
                  }`}
                >
                  {row.hit === "direct" ? "直接命中" : "工具輔助"}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="mt-5 text-sm text-gray-500">
          七大策略中 <span className="font-semibold text-[#5EEAD4]">5 項直接命中</span> 為 AegisCode 已出貨能力,
          <span className="font-semibold text-sky-300"> 2 項工具輔助</span>。CBOM 清冊可匯出 JSON／Excel,並併入簽章證據包供稽核離線驗證。
        </p>
      </div>
    </section>
  )
}
