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
  Box,
  Bug,
  GitBranch,
  Lock,
  Target,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "SAST 掃描與品質閘門",
    desc: "支援 ZIP / Git 掃描、SonarQube 分析、Quality Gate 與 BU 權限控管，讓上線前風險有一致標準。",
  },
  {
    icon: KeyRound,
    title: "CBOM / PQC 加密資產盤點",
    desc: "盤點演算法、金鑰長度、IV、TLS 與 PQC 遷移風險，提供 portfolio、明細、生命週期決策與證據包。",
  },
  {
    icon: Package,
    title: "原生 SBOM / SCA",
    desc: "解析 npm / pip / Maven / Go 依賴並輸出 CycloneDX 標準，補齊委外與供應鏈安全盤點。",
  },
  {
    icon: Box,
    title: "Container / IaC / Secrets 掃描",
    desc: "容器映像、Terraform / K8s / CloudFormation 設定漂移、硬編碼金鑰三面向並行盤點，補齊 SAST / SBOM 之外的供應鏈與設定面風險。",
  },
  {
    icon: Bug,
    title: "DAST 動態掃描",
    desc: "黑盒動態掃描補強 SAST 看不到的 runtime 風險（authn / session / injection / headers），與 SAST / CBOM / SBOM findings 同框追蹤。",
  },
  {
    icon: Bot,
    title: "SAST-in-the-Loop / VULNFORGE",
    desc: "把 SAST findings 轉成可審查、可修復、可追蹤的 AI review 工作流，繁中修復建議與主管可審核紀錄一次到位。",
  },
  {
    icon: Activity,
    title: "Executive Action Queue",
    desc: "管理儀表板彙整失敗掃描、待審核專案與高風險 CBOM finding，主管一進站就知道先處理什麼。",
  },
  {
    icon: Sliders,
    title: "Multi-dim Quality Gate",
    desc: "依 BU、嚴重度與風險門檻建立政策，讓開發、資安、主管審核使用同一套決策邏輯。",
  },
  {
    icon: Target,
    title: "F-ISAC 7 主題成熟度自評",
    desc: "對應治理 / 風險 / 合規 / 開發安全 / 資料保護 / 監控應變 / 第三方七主題，0-5 評分換算 L1-L5 並輸出雷達圖。",
  },
  {
    icon: Lock,
    title: "SOC 2 / Audit Log",
    desc: "Append-only audit log、登入失敗鎖定、季度 access review 自動產出，直接對應 ISO 27001 / SOC 2 evidence pack 與內稽要求。",
  },
  {
    icon: Users,
    title: "SAML 2.0 SSO + JIT",
    desc: "對接主流 SAML 2.0 IdP，JIT provisioning 自動建立帳號與 BU 權限，無須 IT 預先建檔；登入軌跡併入 audit log。",
  },
  {
    icon: ShieldCheck,
    title: "部署安全與授權控管",
    desc: "正式與客戶環境強制自訂管理員密碼，授權服務支援 phone-home 與硬體指紋綁定。",
  },
  {
    icon: GitBranch,
    title: "GitHub App / JIRA / Slack 整合",
    desc: "GitHub App 自動 PR 留言 + status check；JIRA / Azure DevOps 雙向同步；Slack / Teams 出站通知。",
  },
  {
    icon: Building2,
    title: "多 BU + 集團 CISO 視圖",
    desc: "三級權限（管理員 / BU 主管 / 使用者）+ 審核工作流；母公司 CISO 跨子公司彙整 Critical 漏洞與 SLA 風險。",
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
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#5EEAD4] text-xs font-semibold">
            AegisCode Code
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">核心功能</h2>
          <p className="text-gray-400 text-lg">
            完整治理矩陣：SAST · DAST · CBOM/PQC · SBOM/SCA · Container/IaC/Secrets · SAST-in-the-Loop · SOC 2 / SAML · F-ISAC · Group CISO
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
