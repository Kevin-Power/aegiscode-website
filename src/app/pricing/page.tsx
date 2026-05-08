"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface Tier {
  id: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  name: string;
  priceMonthly: string;
  desc: string;
  highlighted: boolean;
  badge?: string;
  features: string[];
  cta: "trial" | "checkout" | "contact";
}

const tiers: Tier[] = [
  {
    id: "STARTER",
    name: "Starter",
    priceMonthly: "NT$15,000",
    desc: "Small dev teams getting started / 適合小型團隊起步",
    highlighted: false,
    features: [
      "Up to 10 users / 最多 10 位使用者",
      "1 Business Unit / 1 個 BU",
      "Core SAST scanning / 基礎 SAST 掃描",
      "10+ language support",
      "Email support",
      "14-day free trial",
    ],
    cta: "trial",
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    priceMonthly: "NT$45,000",
    desc: "Most popular for growing engineering orgs / 最受歡迎",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Up to 50 users / 最多 50 位使用者",
      "5 Business Units / 5 個 BU",
      "Full SAST + AI code review",
      "Bilingual zh/en interface",
      "Quality gates + workflow approval",
      "Priority technical support",
      "14-day free trial",
    ],
    cta: "trial",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    priceMonthly: "NT$150,000",
    desc: "Financial / regulated workloads / 金融業推薦",
    highlighted: false,
    features: [
      "Unlimited users / 不限使用者",
      "★ CBOM cryptographic asset inventory",
      "★ Native SBOM / SCA",
      "★ Taiwan FSC compliance reports",
      "★ ASPM dashboard integration",
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
              Self-service trial · Self-checkout for Starter &amp; Professional ·
              Enterprise contracted via sales
            </p>
            <p className="text-gray-500 text-sm mt-2">
              月繳價格未稅，年繳享 17% 折扣（聯絡業務開立年約）
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
                </div>

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
                    <a
                      href="/#contact"
                      className="block text-center py-3 rounded-lg font-medium text-sm bg-[#0D9488] hover:bg-[#0F766E] text-white transition"
                    >
                      Contact Sales · 聯絡業務
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
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
