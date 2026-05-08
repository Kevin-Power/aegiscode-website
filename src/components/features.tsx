"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  ShieldCheck,
  Bot,
  Building2,
  KeyRound,
  Package,
  Activity,
  Sliders,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "SAST + ASPM Hub",
    desc: "整合 Checkmarx / Veracode / Snyk / Trivy 結果，跨工具去重 + 優先排序。30+ 語言、OWASP Top 10 完整覆蓋。",
    badge: "v4",
  },
  {
    icon: KeyRound,
    title: "CBOM 加密資產盤點 ⭐",
    desc: "業界首套針對金管會 PQC 2026/6 指引設計。12+ 偵測規則，14 欄位金管會範本一鍵 Excel 匯出。",
    badge: "業界首創",
  },
  {
    icon: Package,
    title: "原生 SBOM / SCA",
    desc: "解析 npm / pip / Maven / Go 依賴，輸出 CycloneDX 1.5 標準。F-ISAC 委外契約共通條款必備。",
    badge: "v4",
  },
  {
    icon: Bot,
    title: "AI 程式碼健檢",
    desc: "業界首創！針對 AI 生成程式碼的 7 大問題分類分析，提供 S~D 五級評分與改善建議。",
  },
  {
    icon: Activity,
    title: "Threat Intel — KEV / EPSS",
    desc: "每日自動同步 CISA KEV、FIRST EPSS、NVD CVE。高風險漏洞自動 Email digest 推送給 CISO。",
    badge: "v4",
  },
  {
    icon: Sliders,
    title: "Multi-dim Quality Gate",
    desc: "依 BU、嚴重度、CVSS、EPSS、KEV、CWE 多維條件政策。內建金融嚴格 / 平衡 / 寬鬆三套範本。",
    badge: "v4",
  },
  {
    icon: ShieldCheck,
    title: "License + 硬體指紋",
    desc: "JWT RS256 簽章 + 硬體指紋綁定 + 每日 Phone-home。授權無法盜版、無法跨機器複製。",
    badge: "v4",
  },
  {
    icon: Building2,
    title: "多 BU + 審核工作流",
    desc: "三級權限（管理員 / BU 主管 / 使用者），完整審核流程，符合企業內控與稽核合規需求。",
  },
  {
    icon: Globe,
    title: "三語介面（中 / 英 / 日）",
    desc: "一鍵切換，White-Label 品牌支援，適合跨國企業與 SI 合作夥伴轉售。",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 bg-[#0D1521]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">核心功能</h2>
          <p className="text-gray-400 text-lg">
            33+ 項功能 · 對應 金管會 ZTA / PQC / F-ISAC
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FBBF24] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse"></span>
            v4 NEW: CBOM · SBOM · Threat Intel · Multi-dim QG · Hardware License
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-[#1A2332] border border-[#243447] rounded-xl p-6 border-l-4 border-l-[#0D9488] card-glow transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center group-hover:bg-[#0D9488]/20 transition-colors">
                    <Icon size={20} className="text-[#14B8A6]" />
                  </div>
                  {f.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      f.badge === "業界首創"
                        ? "bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30"
                        : "bg-[#14B8A6]/15 text-[#14B8A6] border border-[#14B8A6]/30"
                    }`}>
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
