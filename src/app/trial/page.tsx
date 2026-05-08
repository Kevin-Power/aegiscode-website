"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function TrialForm() {
  const params = useSearchParams();
  const initialTier =
    params.get("tier") === "STARTER" ? "STARTER" : "PROFESSIONAL";

  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [tier, setTier] = useState<"STARTER" | "PROFESSIONAL">(initialTier);
  const [teamSize, setTeamSize] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — must stay empty
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | null
    | {
        ok: true;
        licenseId: string;
        expiresAt: string;
        instructions: string;
        jwt?: string;
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
          licenseId: data.licenseId as string,
          expiresAt: data.expiresAt as string,
          instructions: data.instructions as string,
          jwt: data.jwt as string | undefined,
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
          Trial issued
        </h2>
        <p className="text-gray-300 mb-4">{result.instructions}</p>
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
        {result.jwt ? (
          <div>
            <p className="text-xs text-yellow-400 mb-2">
              Email service was not configured — copy this JWT and store it as{" "}
              <code>AegisCode/config/license.jwt</code> on the machine running
              AegisCode.
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

      <Field
        label="Company name / 公司名稱"
        value={companyName}
        onChange={setCompanyName}
        required
        maxLength={200}
      />
      <Field
        label="Work email / 公司 email"
        type="email"
        value={contactEmail}
        onChange={setContactEmail}
        required
      />
      <Field
        label="Phone (optional) / 電話"
        type="tel"
        value={contactPhone}
        onChange={setContactPhone}
      />

      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Tier / 方案
        </label>
        <select
          value={tier}
          onChange={(e) =>
            setTier(e.target.value as "STARTER" | "PROFESSIONAL")
          }
          className="w-full bg-[#0D1521] border border-[#243447] rounded-lg px-3 py-2 text-gray-100 focus:border-[#0D9488] outline-none"
        >
          <option value="STARTER">Starter (NT$15K/mo)</option>
          <option value="PROFESSIONAL">
            Professional (NT$45K/mo) — recommended
          </option>
        </select>
      </div>

      <Field
        label="Team size estimate / 團隊規模"
        value={teamSize}
        onChange={setTeamSize}
        placeholder="e.g. 25 developers"
      />

      {/* Honeypot — kept off-screen so bots happily fill it. */}
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
        {submitting ? "Submitting..." : "Start 14-day trial · 開始試用"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to receive activation emails from AegisCode.
        We never share your email.
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
              Start your free trial
            </h1>
            <p className="text-gray-400 text-lg">
              14-day Professional trial · No credit card · Auto-issued license
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
