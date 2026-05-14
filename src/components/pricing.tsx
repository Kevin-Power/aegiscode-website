"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "NT$9,900/月",
    desc: "獲客導入方案，適合先 land 的小型團隊",
    highlighted: false,
    features: [
      "最多 10 位使用者",
      "1 個 BU",
      "基礎 SAST 掃描與品質報告",
      "AI code health 摘要",
      "10+ 程式語言支援",
      "隱含 NT$990/user/月",
      "Email 支援",
    ],
  },
  {
    name: "Professional",
    price: "NT$45,000/月",
    desc: "主力甜蜜點，對齊企業 SAST 預算",
    highlighted: true,
    badge: "主力推薦",
    features: [
      "最多 50 位使用者",
      "5 個 BU",
      "SAST-in-the-Loop / VULNFORGE AI review",
      "CBOM/PQC portfolio 檢視",
      "AI 程式碼健檢與修復建議",
      "審核工作流",
      "中英雙語介面",
      "品質閘門",
      "隱含 NT$900/user/月",
    ],
  },
  {
    name: "Enterprise",
    price: "NT$150,000/月",
    desc: "金融業與高法遵組織推薦",
    highlighted: false,
    features: [
      "不限使用者 / 不限 BU",
      "★ CBOM 加密資產盤點",
      "★ 原生 SBOM / SCA",
      "★ 金管會合規與稽核證據包",
      "★ ASPM 整合儀表板",
      "★ Executive action queue",
      "客製化開發 + SSO",
      "SLA 保證 + 專屬客戶經理",
    ],
  },
];

const addOns = [
  {
    name: "Compliance Pack",
    price: "+ NT$80K/月",
    desc: "SBOM / SCA / ASPM 與合規證據工作流，不含完整 FSC 報告，承接 60-80 人非金融中型客戶",
  },
  {
    name: "Threat Intelligence",
    price: "+ NT$15K/月",
    desc: "每日 KEV / EPSS 同步、Email digest 推送、24h 漏洞優先通知",
  },
  {
    name: "White-Label",
    price: "+ NT$30K/月",
    desc: "換上您的品牌名稱、Logo、顏色，可轉售給終端客戶",
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 bg-[#0D1521]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            對齊市場採購邏輯的授權方案
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Starter 用來導入，Professional 用來成交，Enterprise 用 FSC / CBOM 拉開差異。
          </p>
          <a
            href="/roi"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#14B8A6]/50 text-[#14B8A6] hover:bg-[#14B8A6]/10 text-sm font-medium transition-colors"
          >
            算看看能省多少 → ROI 計算器
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "bg-[#1A2332] border-2 border-[#0D9488] scale-[1.02] shadow-[0_0_40px_rgba(13,148,136,0.15)]"
                  : "bg-[#1A2332] border border-[#243447] hover:border-[#243447]/80"
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-[#0D9488] text-white text-xs font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-3xl font-bold text-[#14B8A6]">
                  {plan.price}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check
                      size={16}
                      className="text-[#14B8A6] mt-0.5 shrink-0"
                    />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-[#0D9488] hover:bg-[#0F766E] text-white"
                    : "border border-[#243447] hover:border-[#0D9488] text-gray-300 hover:text-white"
                }`}
              >
                聯絡我們
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 rounded-xl border border-[#14B8A6]/25 bg-[#14B8A6]/10 p-5"
        >
          <p className="text-sm leading-relaxed text-gray-300">
            定位策略：Starter 壓低門檻避免被 SonarQube 入門價秒砍；Professional 主打 SAST-in-the-Loop 與繁中治理工作流；Enterprise 以 Taiwan FSC、CBOM/PQC、SBOM/SCA 與主管證據包切入金融業採購。
          </p>
        </motion.div>

        {/* Add-Ons strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] text-xs font-medium">
              加值服務 Add-Ons
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="bg-[#1A2332]/50 border border-[#243447] rounded-lg p-5 hover:border-[#8B5CF6]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white">{a.name}</h4>
                  <span className="text-xs font-bold text-[#A78BFA]">{a.price}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            30 天免費 POC · 建議以 CBOM/PQC 金融情境 demo 開場，前 10 家種子客戶享 40% 折扣（換 Logo 使用權 + Case Study 同意）
          </p>
        </motion.div>
      </div>
    </section>
  );
}
