"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  DollarSign,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Users,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// NT$ formatter
const fmt = (n: number) => `NT$${Math.round(n).toLocaleString()}`;
const fmtK = (n: number) => {
  if (n >= 1_000_000) return `NT$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `NT$${Math.round(n / 1_000)}K`;
  return `NT$${Math.round(n)}`;
};

// Pricing tiers (annual, NT$)
const PLANS = {
  starter: { name: "Starter", annual: 120_000, maxUsers: 10 },
  professional: { name: "Professional", annual: 390_000, maxUsers: 50 },
  enterprise: { name: "Enterprise", annual: 990_000, maxUsers: 9999 },
};

export default function RoiCalculatorPage() {
  // Inputs
  const [developers, setDevelopers] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(800); // NT$ per hour
  const [reviewHoursPerWeek, setReviewHoursPerWeek] = useState(3);
  const [incidentsPerYear, setIncidentsPerYear] = useState(2);
  const [incidentCost, setIncidentCost] = useState(2_000_000); // NT$ per incident

  // Auto-pick plan based on team size
  const selectedPlan = useMemo(() => {
    if (developers <= 10) return PLANS.starter;
    if (developers <= 50) return PLANS.professional;
    return PLANS.enterprise;
  }, [developers]);

  // Calculations
  const results = useMemo(() => {
    // 1. Code review time saved (80% reduction)
    const reviewHoursPerYear = reviewHoursPerWeek * 52 * developers;
    const reviewCostPerYear = reviewHoursPerYear * hourlyRate;
    const reviewSaved = reviewCostPerYear * 0.8; // 80% reduction

    // 2. Security incident prevention (70% reduction)
    const annualIncidentCost = incidentsPerYear * incidentCost;
    const incidentSaved = annualIncidentCost * 0.7; // 70% reduction

    // 3. Compliance audit time saved (~40 hours/year for ISO 27001)
    const complianceSaved = 40 * hourlyRate * 2; // 2 rounds per year

    // 4. Total annual value
    const totalValue = reviewSaved + incidentSaved + complianceSaved;

    // 5. AegisCode cost
    const aegisCodeCost = selectedPlan.annual;

    // 6. Net benefit & ROI
    const netBenefit = totalValue - aegisCodeCost;
    const roiMultiple = totalValue / aegisCodeCost;
    const paybackMonths = (aegisCodeCost / totalValue) * 12;

    return {
      reviewHoursPerYear,
      reviewCostPerYear,
      reviewSaved,
      annualIncidentCost,
      incidentSaved,
      complianceSaved,
      totalValue,
      aegisCodeCost,
      netBenefit,
      roiMultiple,
      paybackMonths,
    };
  }, [developers, hourlyRate, reviewHoursPerWeek, incidentsPerYear, incidentCost, selectedPlan]);

  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-sm font-medium mb-6">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            看看 AegisCode 能為您省下多少
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            輸入您的團隊規模，我們幫您算出導入 AegisCode 的實際投資報酬率。
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-6">
            <div className="bg-[#1A2332] rounded-2xl p-8 border border-[#243447]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#14B8A6]" />
                您的團隊資料
              </h2>

              {/* Developers */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">開發人員數</label>
                  <span className="text-2xl font-bold text-[#14B8A6]">{developers}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={1}
                  value={developers}
                  onChange={(e) => setDevelopers(Number(e.target.value))}
                  className="w-full accent-[#0D9488]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>200</span>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">平均時薪 (NT$)</label>
                  <span className="text-2xl font-bold text-[#14B8A6]">{fmt(hourlyRate)}</span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={2000}
                  step={50}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-[#0D9488]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>NT$400</span>
                  <span>NT$2,000</span>
                </div>
              </div>

              {/* Review Hours per Week */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">每人每週 Code Review 時間（小時）</label>
                  <span className="text-2xl font-bold text-[#14B8A6]">{reviewHoursPerWeek}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={reviewHoursPerWeek}
                  onChange={(e) => setReviewHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-[#0D9488]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1h</span>
                  <span>10h</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2332] rounded-2xl p-8 border border-[#243447]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                資安風險評估
              </h2>

              {/* Incidents per year */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">每年資安事件次數</label>
                  <span className="text-2xl font-bold text-amber-500">{incidentsPerYear}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={incidentsPerYear}
                  onChange={(e) => setIncidentsPerYear(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              {/* Incident cost */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">每次事件平均損失</label>
                  <span className="text-2xl font-bold text-amber-500">{fmtK(incidentCost)}</span>
                </div>
                <input
                  type="range"
                  min={500_000}
                  max={20_000_000}
                  step={500_000}
                  value={incidentCost}
                  onChange={(e) => setIncidentCost(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>NT$500K</span>
                  <span>NT$20M</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 根據 IBM 2025 資安報告，台灣企業平均資安事件成本為 NT$2,000,000
              </p>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Hero result */}
            <div className="bg-gradient-to-br from-[#0D9488] to-[#065F5B] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 text-teal-100">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">年度總效益</span>
                </div>
                <div className="text-5xl md:text-6xl font-black mb-2">
                  {fmtK(results.totalValue)}
                </div>
                <p className="text-teal-100 text-sm">
                  比 AegisCode 年費高出 <span className="font-bold text-white">{results.roiMultiple.toFixed(1)} 倍</span>
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-[#1A2332] rounded-2xl p-6 border border-[#243447]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">效益明細</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Code Review 時間節省</span>
                      <span className="font-bold text-blue-400">{fmtK(results.reviewSaved)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      自動化取代 80% 人工審查 ({Math.round(results.reviewHoursPerYear)} 小時/年)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 text-red-400 shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">資安事件預防</span>
                      <span className="font-bold text-red-400">{fmtK(results.incidentSaved)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      降低 70% 漏洞上線風險 (從 {incidentsPerYear} 次 / 年)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">合規稽核時間節省</span>
                      <span className="font-bold text-purple-400">{fmtK(results.complianceSaved)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      一鍵產出 ISO 27001 / ISMS 合規報告
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost vs Value */}
            <div className="bg-[#1A2332] rounded-2xl p-6 border border-[#243447]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">投資對照</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#243447]">
                  <div>
                    <div className="text-sm text-gray-400">AegisCode 年費</div>
                    <div className="text-xs text-gray-500 mt-0.5">{selectedPlan.name} 方案（建議）</div>
                  </div>
                  <span className="text-xl font-bold text-gray-300">-{fmtK(results.aegisCodeCost)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#243447]">
                  <span className="text-sm text-gray-400">年度總效益</span>
                  <span className="text-xl font-bold text-[#14B8A6]">+{fmtK(results.totalValue)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-bold">淨收益</span>
                  <span className="text-2xl font-black text-[#14B8A6]">+{fmtK(results.netBenefit)}</span>
                </div>
              </div>
            </div>

            {/* Payback period */}
            <div className="bg-gradient-to-r from-[#1A2332] to-[#243447] rounded-2xl p-6 border border-[#14B8A6]/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">投資回收期</div>
                  <div className="text-3xl font-black text-[#14B8A6]">
                    {results.paybackMonths < 1
                      ? "不到 1 個月"
                      : `${results.paybackMonths.toFixed(1)} 個月`}
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-[#14B8A6]/30" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                投資 AegisCode 多久後，省下的費用就能回本
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0A0F18]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            準備好開始節省了嗎？
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            30 天免費 POC 試用，用您自己的程式碼親眼看到效果。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold transition-colors"
            >
              申請免費試用
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#243447] hover:border-[#14B8A6] text-gray-300 hover:text-white font-semibold transition-colors"
            >
              查看完整方案
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-600 mt-8 max-w-xl mx-auto">
            * 估算根據業界平均數據：Code Review 時間節省 80%、資安事件預防 70%。
            實際效益可能因您的團隊狀況、開發流程與資安成熟度而異。
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
