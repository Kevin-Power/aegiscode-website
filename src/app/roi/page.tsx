"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const fmt = (n: number) => `NT$${Math.round(n).toLocaleString()}`;
const fmtK = (n: number) => {
  if (n >= 1_000_000) return `NT$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `NT$${Math.round(n / 1_000)}K`;
  return `NT$${Math.round(n)}`;
};

const PLANS = {
  starter: { name: "Starter", annual: 118_800, maxUsers: 10 },
  professional: { name: "Professional", annual: 540_000, maxUsers: 50 },
  enterprise: { name: "Enterprise", annual: 1_800_000, maxUsers: 9999 },
};

export default function RoiCalculatorPage() {
  const [developers, setDevelopers] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(800);
  const [reviewHoursPerWeek, setReviewHoursPerWeek] = useState(3);
  const [incidentsPerYear, setIncidentsPerYear] = useState(2);
  const [incidentCost, setIncidentCost] = useState(2_000_000);

  const selectedPlan = useMemo(() => {
    if (developers <= 10) return PLANS.starter;
    if (developers <= 50) return PLANS.professional;
    return PLANS.enterprise;
  }, [developers]);

  const results = useMemo(() => {
    const reviewHoursPerYear = reviewHoursPerWeek * 52 * developers;
    const reviewCostPerYear = reviewHoursPerYear * hourlyRate;
    const reviewSaved = reviewCostPerYear * 0.8;
    const annualIncidentCost = incidentsPerYear * incidentCost;
    const incidentSaved = annualIncidentCost * 0.7;
    const complianceSaved = 40 * hourlyRate * 2;
    const totalValue = reviewSaved + incidentSaved + complianceSaved;
    const aegisCodeCost = selectedPlan.annual;
    const netBenefit = totalValue - aegisCodeCost;
    const roiMultiple = totalValue / aegisCodeCost;
    const paybackMonths = (aegisCodeCost / Math.max(totalValue, 1)) * 12;

    return {
      reviewHoursPerYear,
      reviewSaved,
      incidentSaved,
      complianceSaved,
      totalValue,
      aegisCodeCost,
      netBenefit,
      roiMultiple,
      paybackMonths,
    };
  }, [
    developers,
    hourlyRate,
    reviewHoursPerWeek,
    incidentsPerYear,
    incidentCost,
    selectedPlan,
  ]);

  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-sm font-medium mb-6">
            <Calculator className="h-4 w-4" />
            ROI 計算器
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            估算 AegisCode 對研發與合規團隊的年度價值
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            輸入團隊規模、Code Review 時間與資安事件成本，快速建立可帶進採購討論的投資回收假設。
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#1A2332] rounded-2xl p-8 border border-[#243447]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#14B8A6]" />
                研發團隊參數
              </h2>

              <RangeField
                label="開發者人數"
                value={developers}
                min={5}
                max={200}
                step={1}
                suffix=""
                onChange={setDevelopers}
              />
              <RangeField
                label="平均時薪"
                value={hourlyRate}
                min={400}
                max={2000}
                step={50}
                format={fmt}
                onChange={setHourlyRate}
              />
              <RangeField
                label="每人每週 Code Review 時數"
                value={reviewHoursPerWeek}
                min={1}
                max={10}
                step={0.5}
                suffix="h"
                onChange={setReviewHoursPerWeek}
              />
            </div>

            <div className="bg-[#1A2332] rounded-2xl p-8 border border-[#243447]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                資安事件假設
              </h2>

              <RangeField
                label="每年資安事件數"
                value={incidentsPerYear}
                min={0}
                max={10}
                step={1}
                suffix=""
                accent="accent-amber-500"
                valueClassName="text-amber-500"
                onChange={setIncidentsPerYear}
              />
              <RangeField
                label="單一事件成本"
                value={incidentCost}
                min={500_000}
                max={20_000_000}
                step={500_000}
                format={fmtK}
                accent="accent-amber-500"
                valueClassName="text-amber-500"
                onChange={setIncidentCost}
              />
              <p className="text-xs text-gray-500 mt-3">
                可依您的內部損失假設調整；IBM 2024 Cost of a Data Breach
                報告指出全球平均資料外洩成本為 4.88M USD。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0D9488] to-[#065F5B] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 text-teal-100">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">年度可量化價值</span>
                </div>
                <div className="text-5xl md:text-6xl font-black mb-2">
                  {fmtK(results.totalValue)}
                </div>
                <p className="text-teal-100 text-sm">
                  約為 AegisCode 年費的{" "}
                  <span className="font-bold text-white">
                    {results.roiMultiple.toFixed(1)}x
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#1A2332] rounded-2xl p-6 border border-[#243447]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
                價值拆解
              </h3>
              <BreakdownRow
                icon={<Clock className="h-5 w-5" />}
                color="blue"
                label="Code Review 時間節省"
                value={fmtK(results.reviewSaved)}
                detail={`依 80% 節省情境估算，年度約 ${Math.round(
                  results.reviewHoursPerYear,
                )} 小時`}
              />
              <BreakdownRow
                icon={<Shield className="h-5 w-5" />}
                color="red"
                label="資安事件風險降低"
                value={fmtK(results.incidentSaved)}
                detail={`依 70% 風險降低情境估算，基準為每年 ${incidentsPerYear} 起`}
              />
              <BreakdownRow
                icon={<CheckCircle2 className="h-5 w-5" />}
                color="purple"
                label="合規證據整理節省"
                value={fmtK(results.complianceSaved)}
                detail="依每年兩輪稽核、每輪 40 小時估算"
              />
            </div>

            <div className="bg-[#1A2332] rounded-2xl p-6 border border-[#243447]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
                成本與效益
              </h3>
              <div className="space-y-3">
                <ValueRow
                  label="AegisCode 年費"
                  detail={`${selectedPlan.name} 方案，依團隊規模自動選擇`}
                  value={`-${fmtK(results.aegisCodeCost)}`}
                  muted
                />
                <ValueRow
                  label="年度可量化價值"
                  value={`+${fmtK(results.totalValue)}`}
                />
                <div className="flex items-center justify-between py-3">
                  <span className="font-bold">淨效益</span>
                  <span className="text-2xl font-black text-[#14B8A6]">
                    {results.netBenefit >= 0 ? "+" : ""}
                    {fmtK(results.netBenefit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1A2332] to-[#243447] rounded-2xl p-6 border border-[#14B8A6]/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    估算回收期
                  </div>
                  <div className="text-3xl font-black text-[#14B8A6]">
                    {results.paybackMonths < 1
                      ? "小於 1 個月"
                      : `${results.paybackMonths.toFixed(1)} 個月`}
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-[#14B8A6]/30" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                實際結果會依掃描範圍、開發流程、合規要求與導入深度調整。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0A0F18]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            想用自己的數字做採購簡報？
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            申請 30 天 POC，我們會協助您把實際 findings、修復流程與合規證據整理成可內部討論的版本。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trial"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold transition-colors"
            >
              預約 CBOM Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#243447] hover:border-[#14B8A6] text-gray-300 hover:text-white font-semibold transition-colors"
            >
              查看方案
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-8 max-w-xl mx-auto">
            本工具為情境估算，不構成財務承諾。節省比例、事件降低比例與合規工時需以實際導入資料校準。
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
  format,
  accent = "accent-[#0D9488]",
  valueClassName = "text-[#14B8A6]",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
  format?: (value: number) => string;
  accent?: string;
  valueClassName?: string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between gap-4 mb-2">
        <label className="text-sm text-gray-400">{label}</label>
        <span className={`text-2xl font-bold ${valueClassName}`}>
          {format ? format(value) : `${value}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${accent}`}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{format ? format(min) : `${min}${suffix}`}</span>
        <span>{format ? format(max) : `${max}${suffix}`}</span>
      </div>
    </div>
  );
}

function BreakdownRow({
  icon,
  color,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  color: "blue" | "red" | "purple";
  label: string;
  value: string;
  detail: string;
}) {
  const colorClass = {
    blue: "bg-blue-500/20 text-blue-400",
    red: "bg-red-500/20 text-red-400",
    purple: "bg-purple-500/20 text-purple-400",
  }[color];
  const valueClass = {
    blue: "text-blue-400",
    red: "text-red-400",
    purple: "text-purple-400",
  }[color];

  return (
    <div className="flex items-start gap-3 mb-4 last:mb-0">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${colorClass}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{label}</span>
          <span className={`font-bold ${valueClass}`}>{value}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

function ValueRow({
  label,
  detail,
  value,
  muted,
}: {
  label: string;
  detail?: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-[#243447]">
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        {detail ? (
          <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
        ) : null}
      </div>
      <span
        className={`text-xl font-bold ${
          muted ? "text-gray-300" : "text-[#14B8A6]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
