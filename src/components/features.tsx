"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  ShieldCheck,
  Bot,
  Building2,
  ClipboardCheck,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "靜態程式碼分析 (SAST)",
    desc: "支援 30+ 程式語言，涵蓋 OWASP Top 10 安全漏洞、程式碼異味、重複程式碼等完整檢測。",
  },
  {
    icon: ShieldCheck,
    title: "品質閘門 (Quality Gate)",
    desc: "自動攔截不合格程式碼，設定嚴重度門檻，確保只有通過標準的程式碼才能上線。",
  },
  {
    icon: Bot,
    title: "AI 程式碼健檢",
    desc: "業界首創！針對 AI 生成程式碼的 7 大問題分類分析，提供 S~D 五級評分與改善建議。",
  },
  {
    icon: Building2,
    title: "多 BU 管理",
    desc: "支援多部門分級管理、獨立統計儀表板，資安長一目瞭然掌握全公司程式碼安全狀態。",
  },
  {
    icon: ClipboardCheck,
    title: "審核工作流",
    desc: "主管核准/退回機制，完整審核紀錄，符合企業內控與稽核合規需求。",
  },
  {
    icon: Globe,
    title: "中英雙語介面",
    desc: "一鍵切換中英文，跨國團隊無縫協作，台灣在地化使用體驗。",
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
            Everything you need to secure your codebase
          </p>
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
                <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center mb-4 group-hover:bg-[#0D9488]/20 transition-colors">
                  <Icon size={20} className="text-[#14B8A6]" />
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
