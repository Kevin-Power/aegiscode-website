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
    desc: "Land tier for small teams / 小型團隊獲客方案",
    positioning: "Lower-friction entry point against SonarQube Developer-style budget anchors.",
    highlighted: false,
    features: [
      "Up to 10 users / 最多 10 位使用者",
      "1 Business Unit / 1 個 BU",
      "Core SAST scanning / 基礎 SAST 掃描",
      "AI code health summary / AI 健檢摘要",
      "10+ language support",
      "Implied NT$990/user/month",
      "Email support",
      "30-day POC available",
    ],
    cta: "trial",
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    priceMonthly: "NT$45,000",
    priceAnnual: "NT$540,000 / year",
    desc: "Mainline buying tier / 主力成交方案",
    positioning: "Best fit when buyers compare against SonarQube Enterprise but need zh/en workflow and AI review.",
    highlighted: true,
    badge: "Recommended",
    features: [
      "Up to 50 users / 最多 50 位使用者",
      "5 Business Units / 5 個 BU",
      "SAST-in-the-Loop / VULNFORGE AI code review",
      "CBOM/PQC portfolio view",
      "Bilingual zh/en interface",
      "Quality gates + workflow approval",
      "Implied NT$900/user/month",
      "Priority technical support",
      "30-day POC available",
    ],
    cta: "trial",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    priceMonthly: "NT$150,000",
    priceAnnual: "NT$1,800,000 / year",
    desc: "Financial / regulated workloads / 金融業推薦",
    positioning: "Positioned below large Data Center and Checkmarx-style deployments while adding Taiwan FSC evidence.",
    highlighted: false,
    features: [
      "Unlimited users / 不限使用者",
      "★ CBOM cryptographic asset inventory",
      "★ Native SBOM / SCA",
      "★ Taiwan FSC compliance evidence pack",
      "★ ASPM dashboard integration",
      "★ Executive action queue",
      "Custom development + SSO",
      "SLA guarantee + dedicated CSM",
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
        ? window.prompt("Enter your work email to start checkout:")
        : null;
    if (!customerEmail) return;
    const companyName =
      typeof window !== "undefined"
        ? window.prompt("Company name:")
        : null;
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
              Pricing / 授權方案
            </h1>
            <p className="text-gray-400 text-lg">
              Transparent monthly anchors for procurement. Starter lands, Professional converts, Enterprise expands.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Prices exclude tax. Annual contracts, PO, security review, and pilot scope are handled through sales.
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
                      Start Free Trial · 開始試用
                    </a>
                  ) : null}

                  {stripeEnabled && (tier.id === "STARTER" || tier.id === "PROFESSIONAL") ? (
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
                      {busy === tier.id
                        ? "Redirecting..."
                        : "Buy now · Stripe checkout"}
                    </button>
                  ) : null}

                  {tier.cta === "contact" ? (
                    <Link
                      href="/#contact"
                      className="block text-center py-3 rounded-lg font-medium text-sm bg-[#0D9488] hover:bg-[#0F766E] text-white transition"
                    >
                      Contact Sales · 聯絡業務
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
                  Compliance Pack Add-on
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-300">
                  NT$80,000 / month for SBOM, SCA, ASPM workflow, and audit evidence
                  without the full Taiwan FSC report package. This bridges 60-80 person
                  non-financial teams that need compliance posture but are not ready for
                  Enterprise.
                </p>
              </div>
              <Link
                href="/#contact"
                className="shrink-0 rounded-lg border border-[#A78BFA]/50 px-5 py-3 text-center text-sm font-semibold text-[#C4B5FD] hover:bg-[#8B5CF6]/15"
              >
                Discuss add-on
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-12">
            Need invoicing, PO, or annual prepayment? Email{" "}
            <a className="underline" href="mailto:sales@aegiscode.com">
              sales@aegiscode.com
            </a>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
