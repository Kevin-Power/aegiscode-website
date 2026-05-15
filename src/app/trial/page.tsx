"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function TrialForm() {
  const params = useSearchParams();
  const initialTrack: "CODE" | "SURFACE" | "BOTH" = (() => {
    const p = params.get("track");
    if (p === "SURFACE") return "SURFACE";
    if (p === "BOTH") return "BOTH";
    return "CODE";
  })();

  const initialTier =
    params.get("tier") === "STARTER" ? "STARTER" : "PROFESSIONAL";

  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [tier, setTier] = useState<"STARTER" | "PROFESSIONAL">(initialTier);
  const [teamSize, setTeamSize] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [track, setTrack] = useState<"CODE" | "SURFACE" | "BOTH">(initialTrack);
  const [domainCount, setDomainCount] = useState("");
  const [hasExternalRating, setHasExternalRating] = useState<"yes" | "no" | "">("");
  const [monthlyReportEta, setMonthlyReportEta] = useState<"2-weeks" | "4-weeks" | "8-weeks" | "">("");
  const [decisionMaker, setDecisionMaker] = useState<"management" | "engineering" | "procurement" | "">("");
  const [result, setResult] = useState<
    | null
    | {
        ok: true;
        licenseId?: string;
        expiresAt?: string;
        instructions: string;
        manualReview?: boolean;
        jwt?: string;
        track?: "CODE" | "SURFACE" | "BOTH";
      }
    | { ok: false; error: string }
  >(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const r = await fetch("/api/trial/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactEmail,
          contactPhone,
          tier,
          teamSize,
          website,
          track,
          domainCount: track !== "CODE" ? domainCount : undefined,
          hasExternalRating:
            track !== "CODE" ? hasExternalRating === "yes" : undefined,
          monthlyReportEta:
            track !== "CODE" ? monthlyReportEta || undefined : undefined,
          decisionMaker: track === "BOTH" ? decisionMaker || undefined : undefined,
        }),
      });
      const data = (await r.json()) as Record<string, unknown>;
      if (!r.ok) {
        setResult({
          ok: false,
          error: (data.error as string) || `Request failed (${r.status})`,
        });
      } else {
        setResult({
          ok: true,
          licenseId: data.licenseId as string | undefined,
          expiresAt: data.expiresAt as string | undefined,
          instructions: data.instructions as string,
          manualReview: data.manualReview as boolean | undefined,
          jwt: data.jwt as string | undefined,
          track: data.track as "CODE" | "SURFACE" | "BOTH" | undefined,
        });
      }
    } catch (err) {
      setResult({ ok: false, error: String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="max-w-xl mx-auto bg-[#1A2332] border border-[#0D9488] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-3 text-[#14B8A6]">
          POC 申請已建立
        </h2>
        <p className="text-gray-300 mb-4">{result.instructions}</p>
        {result.licenseId && result.expiresAt ? (
          <dl className="text-sm grid grid-cols-[120px_1fr] gap-y-2 mb-4">
            <dt className="text-gray-500">License ID</dt>
            <dd className="font-mono text-gray-200 break-all">
              {result.licenseId}
            </dd>
            <dt className="text-gray-500">Expires</dt>
            <dd className="text-gray-200">
              {new Date(result.expiresAt).toUTCString()}
            </dd>
          </dl>
        ) : (
          <div className="mb-4 rounded-lg border border-[#243447] bg-[#0D1521]/70 p-4 text-sm text-gray-300">
            我們已收到申請，顧問會先確認 Demo 情境、部署條件與資料留存需求，再提供評估授權。
          </div>
        )}
        {result.jwt ? (
          <div>
            <p className="text-xs text-yellow-400 mb-2">
              Email service 尚未設定，請將下方 JWT 放入{" "}
              <code>AegisCode/config/license.jwt</code>，或聯絡
              sales@aegiscode.com 協助啟用。
            </p>
            <pre className="bg-[#0D1521] border border-[#243447] rounded p-3 text-xs text-emerald-300 break-all whitespace-pre-wrap">
              {result.jwt}
            </pre>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl mx-auto bg-[#1A2332] border border-[#243447] rounded-xl p-8 space-y-5"
    >
      {result?.ok === false ? (
        <div className="p-3 rounded-lg border border-red-700/50 bg-red-900/20 text-red-300 text-sm">
          {result.error}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-200">
          評估方向 / Evaluation track
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["CODE", "AegisCode Code", "程式碼 / SAST / CBOM"],
              ["SURFACE", "AegisCode Surface", "外部攻擊面 / CISO 月報"],
              ["BOTH", "兩者都評估", "完整治理閉環"],
            ] as const
          ).map(([value, title, hint]) => (
            <button
              type="button"
              key={value}
              onClick={() => setTrack(value)}
              className={`rounded-lg border p-3 text-left transition ${
                track === value
                  ? "border-[#14B8A6] bg-[#14B8A6]/10 text-white"
                  : "border-[#243447] bg-[#0D1521] text-gray-300 hover:border-[#14B8A6]/50"
              }`}
            >
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-1 text-xs text-gray-500">{hint}</div>
            </button>
          ))}
        </div>
      </div>

      <Field
        label="公司名稱 / Company name"
        value={companyName}
        onChange={setCompanyName}
        required
        maxLength={200}
      />
      <Field
        label="公司信箱 / Work email"
        type="email"
        value={contactEmail}
        onChange={setContactEmail}
        required
      />
      <Field
        label="聯絡電話 / Phone (optional)"
        type="tel"
        value={contactPhone}
        onChange={setContactPhone}
      />

      {track === "CODE" || track === "BOTH" ? (
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Code Tier
          </label>
          <select
            value={tier}
            onChange={(e) =>
              setTier(e.target.value as "STARTER" | "PROFESSIONAL")
            }
            className="w-full bg-[#0D1521] border border-[#243447] rounded-lg px-3 py-2 text-gray-100 focus:border-[#0D9488] outline-none"
          >
            <option value="STARTER">Starter track - 小型團隊工作流驗證</option>
            <option value="PROFESSIONAL">
              Professional track - 多 BU 治理與合規評估
            </option>
          </select>
        </div>
      ) : null}

      {track === "CODE" || track === "BOTH" ? (
        <Field
          label="團隊規模 / Team size estimate"
          value={teamSize}
          onChange={setTeamSize}
          placeholder="例如：25 developers"
        />
      ) : null}

      {track === "SURFACE" || track === "BOTH" ? (
        <>
          <Field
            label="管理的 Domain / Portfolio 規模"
            value={domainCount}
            onChange={setDomainCount}
            placeholder="例如：50 個 domain"
          />
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              是否已有 SecurityScorecard / BitSight 授權?
            </label>
            <select
              value={hasExternalRating}
              onChange={(e) =>
                setHasExternalRating(e.target.value as "yes" | "no" | "")
              }
              className="w-full bg-[#0D1521] border border-[#243447] rounded-lg px-3 py-2 text-gray-100 focus:border-[#0D9488] outline-none"
            >
              <option value="">未選擇</option>
              <option value="yes">是</option>
              <option value="no">否</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              希望首份 CISO 月報的時程
            </label>
            <select
              value={monthlyReportEta}
              onChange={(e) =>
                setMonthlyReportEta(
                  e.target.value as "2-weeks" | "4-weeks" | "8-weeks" | "",
                )
              }
              className="w-full bg-[#0D1521] border border-[#243447] rounded-lg px-3 py-2 text-gray-100 focus:border-[#0D9488] outline-none"
            >
              <option value="">未選擇</option>
              <option value="2-weeks">2 週內</option>
              <option value="4-weeks">4 週內</option>
              <option value="8-weeks">8 週內</option>
            </select>
          </div>
        </>
      ) : null}

      {track === "BOTH" ? (
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            主要驅動方
          </label>
          <select
            value={decisionMaker}
            onChange={(e) =>
              setDecisionMaker(
                e.target.value as "management" | "engineering" | "procurement" | "",
              )
            }
            required
            className="w-full bg-[#0D1521] border border-[#243447] rounded-lg px-3 py-2 text-gray-100 focus:border-[#0D9488] outline-none"
          >
            <option value="">請選擇</option>
            <option value="management">管理層 / CISO</option>
            <option value="engineering">開發團隊</option>
            <option value="procurement">採購 / 稽核</option>
          </select>
        </div>
      ) : null}

      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
      >
        <label>
          Website (leave blank)
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold transition disabled:opacity-50"
      >
        {submitting
          ? "送出中..."
          : track === "SURFACE"
            ? "送出 Surface 諮詢申請"
            : track === "BOTH"
              ? "送出雙產品評估申請"
              : "送出 30 天 POC 申請"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        送出後，AegisCode 團隊會寄送啟用資訊與 POC 評估建議。我們不會出售或轉交您的聯絡資料。
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-[#0D1521] border border-[#243447] rounded-lg px-3 py-2 text-gray-100 focus:border-[#0D9488] outline-none"
      />
    </div>
  );
}

export default function TrialPage() {
  return (
    <main className="bg-[#0D1521] min-h-screen text-white">
      <Navbar />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 gradient-text glow-teal">
              預約 CBOM Demo
            </h1>
            <p className="text-gray-400 text-lg">
              30 天 POC，免信用卡，先確認治理工作流、部署條件與合規交付範圍。
            </p>
          </div>
          <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
            <TrialForm />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  );
}
