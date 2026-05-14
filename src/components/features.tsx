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
    title: "SAST 掃描與品質閘門",
    desc: "支援 ZIP / Git 掃描、SonarQube 分析、Quality Gate 與 BU 權限控管，讓上線前風險有一致標準。",
    badge: "Ready",
  },
  {
    icon: KeyRound,
    title: "CBOM / PQC 加密資產盤點",
    desc: "盤點演算法、金鑰長度、IV、TLS 與 PQC 遷移風險，提供 portfolio、明細、生命週期決策與證據包。",
    badge: "Demo Ready",
  },
  {
    icon: Package,
    title: "原生 SBOM / SCA",
    desc: "規劃解析 npm / pip / Maven / Go 依賴並輸出 CycloneDX 標準，補齊委外與供應鏈安全盤點。",
    badge: "v4",
  },
  {
    icon: Bot,
    title: "AI 程式碼健檢",
    desc: "業界首創！針對 AI 生成程式碼的 7 大問題分類分析，提供 S~D 五級評分與改善建議。",
  },
  {
    icon: Activity,
    title: "Executive Action Queue",
    desc: "管理儀表板彙整失敗掃描、待審核專案與高風險 CBOM finding，主管一進站就知道先處理什麼。",
    badge: "Ready",
  },
  {
    icon: Sliders,
    title: "Multi-dim Quality Gate",
    desc: "依 BU、嚴重度與風險門檻建立政策，讓開發、資安、主管審核使用同一套決策邏輯。",
    badge: "Ready",
  },
  {
    icon: ShieldCheck,
    title: "部署安全與授權控管",
    desc: "正式與客戶環境 seed 強制自訂管理員密碼，授權服務支援 phone-home 與硬體指紋綁定。",
    badge: "Hardened",
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
            可展示功能 · 對應 金管會 ZTA / PQC / F-ISAC 採購情境
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FBBF24] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse"></span>
            2026 demo stack: SAST · CBOM/PQC · Evidence Export · Action Queue · License Control
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
                      f.badge === "Demo Ready"
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
