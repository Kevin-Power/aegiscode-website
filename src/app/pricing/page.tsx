"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface Tier {
  id: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  desc: string;
  positioning: string;
  highlighted: boolean;
  badge?: string;
  features: string[];
  cta: "trial" | "checkout" | "contact";
}

const tiers: Tier[] = [
  {
    id: "STARTER",
    name: "Starter",
    priceMonthly: "NT$9,900",
    priceAnnual: "NT$118,800 / year",
    desc: "10 人以下開發團隊 / SAST 工作流與 AI 健檢",
    positioning: "適合用 30 天 POC 驗證基本掃描、AI 健檢與授權流程。",
    highlighted: false,
    features: [
      "Up to 10 users / 最多 10 位使用者",
      "1 Business Unit / 1 個 BU",
      "Core SAST scanning / 核心 SAST 掃描",
      "AI code health summary / AI 程式碼健檢摘要",
      "12 language support / 12 種程式語言支援",
      "約 NT$990 / user / month",
      "Email support / Email 支援",
      "30-day POC available / 可申請 30 天 POC",
    ],
    cta: "trial",
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    priceMonthly: "NT$45,000",
    priceAnnual: "NT$540,000 / year",
    desc: "50 人研發組織 / SAST-in-the-Loop 與繁中治理工作流",
    positioning: "提供 SAST-in-the-Loop AI 審查、多 BU 控管與主管審核紀錄。",
    highlighted: true,
    badge: "Recommended",
    features: [
      "Up to 50 users / 最多 50 位使用者",
      "5 Business Units / 5 個 BU",
      "SAST-in-the-Loop / VULNFORGE AI 審查",
      "CBOM/PQC portfolio view / 加密資產盤點",
      "Bilingual zh/en interface / 中英文介面",
      "Quality gates + workflow approval / 品質閘門與簽核",
      "約 NT$900 / user / month",
      "Priority technical support / 優先技術支援",
      "30-day POC available / 可申請 30 天 POC",
    ],
    cta: "trial",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    priceMonthly: "NT$150,000",
    priceAnnual: "NT$1,800,000 / year",
    desc: "金融業與高法遵組織 / CBOM、SBOM/SCA、稽核證據包",
    positioning:
      "提供 CBOM/PQC 加密資產盤點、原生 SBOM/SCA、金管會稽核證據包與專屬客戶經理。",
    highlighted: false,
    features: [
      "Unlimited users / 不限使用者",
      "CBOM cryptographic asset inventory / 加密資產盤點",
      "Native SBOM / SCA / 原生軟體組成分析",
      "Taiwan FSC compliance evidence pack / 金管會稽核證據包",
      "ASPM dashboard integration / ASPM 儀表板整合",
      "Executive action queue / 主管行動佇列",
      "Custom development + SSO / 客製整合與 SSO",
      "SLA guarantee + dedicated CSM / SLA 與專屬客戶經理",
    ],
    cta: "contact",
  },
];

export default function PricingPage() {
  const stripeEnabled =
    process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1" ||
    process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startStripeCheckout(tier: "STARTER" | "PROFESSIONAL") {
    setError(null);
    const customerEmail =
      typeof window !== "undefined"
        ? window.prompt("請輸入公司 Email：")
        : null;
    if (!customerEmail) return;
    const companyName =
      typeof window !== "undefined" ? window.prompt("請輸入公司名稱：") : null;
    if (!companyName) return;
    setBusy(tier);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, customerEmail, companyName }),
      });
      const data = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !data.url) {
        setError(data.error || "Checkout failed.");
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="bg-[#0D1521] min-h-screen text-white">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 gradient-text glow-teal">
              授權方案 / Pricing
            </h1>
            <p className="text-gray-400 text-lg">
              選擇適合您組織規模的方案。Starter 驗證流程，Professional
              擴大治理，Enterprise 支援金融業採購與合規交付。
            </p>
            <p className="text-gray-500 text-sm mt-2">
              價格未稅。年度合約、PO、資安審查與 POC 範圍由業務協助。
            </p>
          </div>

          {error ? (
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-lg border border-red-700/50 bg-red-900/20 text-red-300 text-sm">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-xl p-8 flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-[#1A2332] border-2 border-[#0D9488] scale-[1.02] shadow-[0_0_40px_rgba(13,148,136,0.15)]"
                    : "bg-[#1A2332] border border-[#243447] hover:border-[#243447]/80"
                }`}
              >
                {tier.highlighted && tier.badge ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-[#0D9488] text-white text-xs font-semibold">
                      {tier.badge}
                    </span>
                  </div>
                ) : null}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-gray-400 text-sm">{tier.desc}</p>
                </div>

                <div className="mb-8">
                  <span className="text-3xl font-bold text-[#14B8A6]">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-gray-500 text-sm"> / month</span>
                  <div className="mt-1 text-xs text-gray-500">
                    {tier.priceAnnual}
                  </div>
                </div>

                <p className="mb-6 rounded-lg border border-[#243447] bg-[#0D1521]/70 p-3 text-xs leading-relaxed text-gray-400">
                  {tier.positioning}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        size={16}
                        className="text-[#14B8A6] mt-0.5 shrink-0"
                      />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2">
                  {tier.cta === "trial" || tier.cta === "checkout" ? (
                    <a
                      href={`/trial?tier=${tier.id}`}
                      className={`block text-center py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                        tier.highlighted
                          ? "bg-[#0D9488] hover:bg-[#0F766E] text-white"
                          : "border border-[#243447] hover:border-[#0D9488] text-gray-300 hover:text-white"
                      }`}
                    >
                      開始 30 天 POC
                    </a>
                  ) : null}

                  {stripeEnabled &&
                  (tier.id === "STARTER" || tier.id === "PROFESSIONAL") ? (
                    <button
                      type="button"
                      onClick={() =>
                        startStripeCheckout(
                          tier.id as "STARTER" | "PROFESSIONAL",
                        )
                      }
                      disabled={busy === tier.id}
                      className="block text-center py-3 rounded-lg font-medium text-sm border border-[#0D9488]/60 text-[#14B8A6] hover:bg-[#0D9488]/10 transition disabled:opacity-50"
                    >
                      {busy === tier.id ? "導向付款中..." : "自助刷卡啟用"}
                    </button>
                  ) : null}

                  {tier.cta === "contact" ? (
                    <Link
                      href="/#contact"
                      className="block text-center py-3 rounded-lg font-medium text-sm bg-[#0D9488] hover:bg-[#0F766E] text-white transition"
                    >
                      預約 CBOM Demo
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Compliance Pack 加值方案
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-300">
                  NT$80,000 / month，提供 SBOM、SCA、ASPM 工作流與稽核證據，
                  但不含完整金管會報告包。適合 60-80 人、需要合規治理但尚未進入
                  Enterprise 採購流程的中型團隊。
                </p>
              </div>
              <Link
                href="/#contact"
                className="shrink-0 rounded-lg border border-[#A78BFA]/50 px-5 py-3 text-center text-sm font-semibold text-[#C4B5FD] hover:bg-[#8B5CF6]/15"
              >
                洽詢加值方案
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-12">
            需要報價單、PO 或年度預付？請聯絡{" "}
            <a className="underline" href="mailto:sales@aegiscode.com">
              sales@aegiscode.com
            </a>
            。
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
