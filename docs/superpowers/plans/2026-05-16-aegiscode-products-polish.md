# AegisCode Code / Surface Round-2 Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `/code` and `/surface` product internal pages from v1 brochure quality to v2 sales-ready depth, mirroring the homepage's section richness (Hero + Proof + Vignettes + Tour + Versus + FAQ + CTA), while honoring the new CBOM-forward positioning landed in `15f692b`.

**Architecture:** Pure frontend on existing Next.js 16 + Tailwind v4 + framer-motion stack. 8 new client components (3 shared, 3 Code-only, 2 Surface-only — wait 3+2+3=8 total) + 1 pure helper lib + 1 node test. Two existing page files rewritten. No new npm deps. No API/redirect/JSON-LD structural changes. No new test framework.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, framer-motion (already in `package.json`), lucide-react (already in), native `<details>` for FAQ, SVG/CSS for visuals, `node --test` for pure-helper unit tests.

**Spec:** [docs/superpowers/specs/2026-05-16-aegiscode-products-polish-design.md](../specs/2026-05-16-aegiscode-products-polish-design.md)

---

## Testing Note

This project has **no unit-test framework** (no Jest/Vitest). Verification per task uses what already exists, identical to the prior plan:

- **Type check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Public-pricing guard**: `npm run guard:public-pricing`
- **Public-branding guard**: `npm run guard:public-branding`
- **Lib unit tests**: `npm run test:lib` (node `--test`, zero new deps)
- **Smoke (post-deploy)**: `npm run smoke:production`
- **Local dev server**: `npm run dev` + manual browser inspection

The only new test in this plan is `tests/roi-mini-calc.test.mjs` — pure-helper TDD for the ROI calculation, where numbers must be predictable for sales credibility.

**Skill references:**
- @superpowers:verification-before-completion — run all relevant checks before claiming a task complete
- @superpowers:subagent-driven-development — recommended execution mode

**AGENTS.md gotcha:** `aegiscode-website/AGENTS.md` says "This is NOT the Next.js you know" — when in doubt about routing, metadata, or client/server boundaries, consult `node_modules/next/dist/docs/` before guessing.

**Forbidden patterns watch-list** (from `scripts/smoke-production.mjs` and `scripts/check-public-pricing-hidden.mjs` — implementers MUST avoid these in new copy):
- `40W` / `40萬` / `四十萬` / `400,000` — Surface absolute annual price (banned in public pages)
- `NT$` — public price currency leak
- `objection` (case-insensitive) — internal sales jargon; section names must use `常見問題` / `Q&A`, never `objection`
- `業界首創` / `市面上唯一` — unverifiable market-first claims
- `壓低門檻` / `秒砍` / `框價` — internal sales jargon
- `WT` / `Sonaqu` — legacy product wording
- `Crafted by` / `Kevin Hsieh` — individual project positioning
- `#pricing` — old pricing anchor

---

## File Structure

### New files (10)

| File | Purpose | Server/Client | Used by |
|---|---|---|---|
| `src/components/outcome-vignette.tsx` | 3-card industry scenarios, props-driven | Server | `/code`, `/surface` |
| `src/components/product-faq.tsx` | Props-driven FAQ using native `<details>` | Server | `/code`, `/surface` |
| `src/components/code-proof-strip.tsx` | Code Proof Strip (3 KPIs) | Server | `/code` |
| `src/components/code-tour.tsx` | Interactive 4-step Capability Tour | Client | `/code` |
| `src/components/roi-mini.tsx` | Inline ROI calculator UI | Client | `/code` |
| `src/components/surface-proof-strip.tsx` | Surface Proof Strip (3 KPIs) | Server | `/surface` |
| `src/components/report-flip.tsx` | 3-page report preview with flip | Client | `/surface` |
| `src/components/service-cadence.tsx` | 12-month service timeline | Server | `/surface` |
| `src/lib/roi-mini-calc.ts` | Pure ROI calc helper (testable) | Lib | `roi-mini.tsx` |
| `tests/roi-mini-calc.test.mjs` | Node tests for ROI calc | Test | CI |

### Modified files (3)

| File | Change |
|---|---|
| `src/app/code/page.tsx` | Reorder sections; integrate 5 new components; upgrade Visual Versus; expand Capability Cards 5→6; Hero stacked text 4→3 lines |
| `src/app/surface/page.tsx` | Reorder sections; integrate 5 new components; subtitle micro-tweak; new trust tag |
| `docs/SALES_RUNTHROUGH.md` | Add Round-2 sections guide |

### Unchanged (explicit)

- `scripts/smoke-production.mjs` — already covers `/code`, `/surface` (lines 15-16). Spec §9's "新增 2 個 URL" was already done in prior round; this plan only verifies still-passes.
- `src/app/page.tsx` — `itemListJsonLd` (ItemList with both `Code` and `Surface` `Product` sub-items) structure preserved. The homepage file as a whole is untouched.
- `next.config.ts` — no new redirects
- `src/components/faq.tsx` — homepage FAQ untouched (new `product-faq.tsx` is a separate component for product internal pages, per spec §5.1)
- All `/api/*` routes — no changes

---

## Task Sequence Overview

| # | Task | Touches | Risk |
|---|---|---|---|
| 1 | New shared component `<OutcomeVignette>` | components | low |
| 2 | New shared component `<ProductFaq>` | components | low |
| 3 | New component `<CodeProofStrip>` | components | low |
| 4 | New lib `lib/roi-mini-calc.ts` + node test (TDD) | lib + test | low |
| 5 | New component `<RoiMini>` | components | medium (client state) |
| 6 | New component `<CodeTour>` | components | medium (client tabs) |
| 7 | New component `<SurfaceProofStrip>` | components | low |
| 8 | New component `<ServiceCadence>` | components | low |
| 9 | New component `<ReportFlip>` | components | medium (client flip) |
| 10 | `/code` page rewrite — Hero + section reorder + 5-card→6-card Capability + integrate new components | pages | medium |
| 11 | `/code` Visual Versus upgrade (text rows → 3-column visual cards) | pages | low |
| 12 | `/surface` page rewrite — subtitle + section reorder + integrate new components | pages | medium |
| 13 | Mobile/a11y pass + smoke-production URL verify | components + pages | low |
| 14 | Full-site verification: typecheck + lint + build + guards + lib test | verification | low |
| 15 | Update `docs/SALES_RUNTHROUGH.md` with Round-2 section guide | docs | low |

**Total: 15 tasks. Suggested batching:** 1-2 (shared), 3-6 (Code components), 7-9 (Surface components), 10-12 (page rewrites), 13-15 (polish + verify + docs).

---

## Task 1: New shared component `<OutcomeVignette>`

**Files:**
- Create: `src/components/outcome-vignette.tsx`

Renders a section title + 3 cards horizontally. Each card has icon, scenario one-liner, pain one-liner, outcome one-liner. Props-driven so `/code` and `/surface` reuse it with different content. No client state.

- [ ] **Step 1: Create `src/components/outcome-vignette.tsx`**

```tsx
import type { LucideIcon } from "lucide-react"

export type OutcomeVignetteCard = {
  icon: LucideIcon
  scenario: string
  pain: string
  outcome: string
}

export type OutcomeVignetteProps = {
  title: string
  subtitle?: string
  cards: OutcomeVignetteCard[]
  accentClass?: string
}

export default function OutcomeVignette({
  title,
  subtitle,
  cards,
  accentClass = "text-[#14B8A6]",
}: OutcomeVignetteProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="mb-10 max-w-3xl text-sm leading-7 text-gray-400">
            {subtitle}
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.scenario}
                className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
              >
                <Icon className={`mb-4 h-6 w-6 ${accentClass}`} />
                <div className="text-base font-semibold text-white">
                  {card.scenario}
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                  痛點
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-300">{card.pain}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-500">
                  使用後
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-200">
                  {card.outcome}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check passes**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Lint passes**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/outcome-vignette.tsx
git commit -m "feat: shared OutcomeVignette component for product pages"
```

---

## Task 2: New shared component `<ProductFaq>`

**Files:**
- Create: `src/components/product-faq.tsx`

Renders product-page-scoped FAQ list using native `<details>` (a11y built-in). Props-driven. The existing `src/components/faq.tsx` (homepage 18-item FAQ) is **not touched**.

**WATCH:** Section title and item text MUST NOT use the word `objection` — `scripts/smoke-production.mjs` line 41 forbids it. Use `常見問題` or `Q&A`.

- [ ] **Step 1: Create `src/components/product-faq.tsx`**

```tsx
export type ProductFaqItem = {
  q: string
  a: string
}

export type ProductFaqProps = {
  title?: string
  items: ProductFaqItem[]
}

export default function ProductFaq({
  title = "常見問題",
  items,
}: ProductFaqProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold">{title}</h2>
        <div className="divide-y divide-[#243447] overflow-hidden rounded-2xl border border-[#243447] bg-[#0F1923]">
          {items.map((item) => (
            <details
              key={item.q}
              className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="ml-2 text-[#14B8A6] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-gray-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/product-faq.tsx
git commit -m "feat: shared ProductFaq component using native details"
```

---

## Task 3: New component `<CodeProofStrip>`

**Files:**
- Create: `src/components/code-proof-strip.tsx`

3 quantified anchors for `/code` page. Server component, no state.

KPIs (per spec §4.1.2):
1. Peer-reviewed: `DOI 10.3390/math14061072` — Mathematics, MDPI
2. POC 期程: `30 天` — Code POC 已開放
3. 支援語言: `12 種` — 涵蓋金融常見開發棧

- [ ] **Step 1: Create `src/components/code-proof-strip.tsx`**

```tsx
const kpis = [
  {
    value: "DOI 10.3390/math14061072",
    label: "Peer-reviewed",
    sub: "Mathematics, MDPI",
    href: "https://www.mdpi.com/2227-7390/14/6/1072",
  },
  {
    value: "30 天",
    label: "POC 期程",
    sub: "Code POC 已開放",
  },
  {
    value: "12 種",
    label: "支援語言",
    sub: "涵蓋金融常見開發棧",
  },
] as const

export default function CodeProofStrip() {
  return (
    <section className="border-y border-[#243447] bg-[#0A0F18]/90 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {kpis.map((kpi) => {
          const inner = (
            <>
              <div className="text-xl font-bold text-[#14B8A6] sm:text-2xl break-all">
                {kpi.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">
                {kpi.label}
              </div>
              <div className="mt-1 text-sm leading-6 text-gray-300">
                {kpi.sub}
              </div>
            </>
          )
          return kpi.href ? (
            <a
              key={kpi.label}
              href={kpi.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-[#243447] bg-[#101B28] p-5 transition hover:border-[#14B8A6]/50"
            >
              {inner}
            </a>
          ) : (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#243447] bg-[#101B28] p-5"
            >
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/code-proof-strip.tsx
git commit -m "feat: CodeProofStrip with DOI, POC period, language coverage"
```

---

## Task 4: New lib `lib/roi-mini-calc.ts` + node test (TDD)

**Files:**
- Create: `tests/roi-mini-calc.test.mjs`
- Create: `src/lib/roi-mini-calc.ts`

Pure helper for the ROI mini calculator. Predictable bounded inputs → outputs. TDD path because sales credibility depends on these numbers being explainable.

**Calculation formula (spec §11.2 deferred to plan):**
- `repos`: 10 | 25 | 50 | 100
- `sensitivity`: "low" | "mid" | "high-fin"
- `current`: "excel" | "partial-tool" | "platform"

Output:
- `findings`: estimated number of high-risk CBOM findings in 30-day POC
- `hoursSavedPerMonth`: estimated monthly hours saved

Linear formula (transparent, can be defended in sales conversation):
- `findings = repos × {low:0.4, mid:0.8, high-fin:1.4}[sensitivity] × {excel:1.0, partial-tool:0.6, platform:0.3}[current]` rounded
- `hoursSavedPerMonth = findings × 0.7` rounded

Numbers picked so e.g. (50 repos, high-fin, excel) → 50 × 1.4 × 1.0 = 70 findings, 49 hours saved/month — defensible without being absurd. (25, mid, partial-tool) → 25 × 0.8 × 0.6 = 12 findings, 8 hours/month. Sales-credible.

- [ ] **Step 1: Write failing test `tests/roi-mini-calc.test.mjs`**

```mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { estimateRoi } from "../src/lib/roi-mini-calc.ts"

test("high-fin financial baseline: 50 repos × high-fin × excel → 70 findings, 49 hours", () => {
  const r = estimateRoi({ repos: 50, sensitivity: "high-fin", current: "excel" })
  assert.equal(r.findings, 70)
  assert.equal(r.hoursSavedPerMonth, 49)
})

test("modest baseline: 25 repos × mid × partial-tool → 12 findings, 8 hours", () => {
  const r = estimateRoi({ repos: 25, sensitivity: "mid", current: "partial-tool" })
  assert.equal(r.findings, 12)
  assert.equal(r.hoursSavedPerMonth, 8)
})

test("platform-already case dampens: 100 repos × low × platform → 12 findings, 8 hours", () => {
  const r = estimateRoi({ repos: 100, sensitivity: "low", current: "platform" })
  assert.equal(r.findings, 12)
  assert.equal(r.hoursSavedPerMonth, 8)
})

test("minimum: 10 repos × low × excel → 4 findings, 3 hours", () => {
  const r = estimateRoi({ repos: 10, sensitivity: "low", current: "excel" })
  assert.equal(r.findings, 4)
  assert.equal(r.hoursSavedPerMonth, 3)
})

test("results are always non-negative integers", () => {
  for (const repos of [10, 25, 50, 100]) {
    for (const sensitivity of ["low", "mid", "high-fin"]) {
      for (const current of ["excel", "partial-tool", "platform"]) {
        const r = estimateRoi({ repos, sensitivity, current })
        assert.equal(Number.isInteger(r.findings), true)
        assert.equal(Number.isInteger(r.hoursSavedPerMonth), true)
        assert.ok(r.findings >= 0)
        assert.ok(r.hoursSavedPerMonth >= 0)
      }
    }
  }
})
```

- [ ] **Step 2: Run test, verify it fails with "cannot find module"**

Run: `npm run test:lib`
Expected: FAIL with module-not-found for `roi-mini-calc.ts`.

- [ ] **Step 3: Implement `src/lib/roi-mini-calc.ts`**

```ts
export type RoiSensitivity = "low" | "mid" | "high-fin"
export type RoiCurrent = "excel" | "partial-tool" | "platform"

export type RoiInput = {
  repos: 10 | 25 | 50 | 100
  sensitivity: RoiSensitivity
  current: RoiCurrent
}

export type RoiResult = {
  findings: number
  hoursSavedPerMonth: number
}

const SENSITIVITY_FACTOR: Record<RoiSensitivity, number> = {
  low: 0.4,
  mid: 0.8,
  "high-fin": 1.4,
}

const CURRENT_FACTOR: Record<RoiCurrent, number> = {
  excel: 1.0,
  "partial-tool": 0.6,
  platform: 0.3,
}

export function estimateRoi(input: RoiInput): RoiResult {
  const raw = input.repos * SENSITIVITY_FACTOR[input.sensitivity] * CURRENT_FACTOR[input.current]
  const findings = Math.round(raw)
  const hoursSavedPerMonth = Math.round(findings * 0.7)
  return { findings, hoursSavedPerMonth }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm run test:lib`
Expected: PASS, all 5 tests green.

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/roi-mini-calc.ts tests/roi-mini-calc.test.mjs
git commit -m "feat(lib): roi-mini-calc pure helper with node test coverage"
```

---

## Task 5: New component `<RoiMini>`

**Files:**
- Create: `src/components/roi-mini.tsx`

Client component. 3 inputs (radio groups for repos/sensitivity/current), output 1 sentence via `estimateRoi()`. Pure UI on top of the Task 4 helper.

Includes the disclaimer per spec §4.1.7: "實際結果依專案範圍而定,POC 階段會校準。"

- [ ] **Step 1: Create `src/components/roi-mini.tsx`**

```tsx
"use client"

import { useMemo, useState } from "react"
import { estimateRoi, type RoiInput } from "@/lib/roi-mini-calc"

const REPOS: Array<RoiInput["repos"]> = [10, 25, 50, 100]
const SENSITIVITIES: Array<{ value: RoiInput["sensitivity"]; label: string }> = [
  { value: "low", label: "低" },
  { value: "mid", label: "中" },
  { value: "high-fin", label: "高(金融)" },
]
const CURRENTS: Array<{ value: RoiInput["current"]; label: string }> = [
  { value: "excel", label: "Excel 散落" },
  { value: "partial-tool", label: "部分工具" },
  { value: "platform", label: "已有平台" },
]

export default function RoiMini() {
  const [repos, setRepos] = useState<RoiInput["repos"]>(25)
  const [sensitivity, setSensitivity] = useState<RoiInput["sensitivity"]>("mid")
  const [current, setCurrent] = useState<RoiInput["current"]>("partial-tool")

  const result = useMemo(
    () => estimateRoi({ repos, sensitivity, current }),
    [repos, sensitivity, current],
  )

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#243447] bg-[#0F1923] p-8">
        <h2 className="mb-2 text-2xl font-bold">
          快速估算 — 30 天 POC 能產出多少 CBOM finding
        </h2>
        <p className="mb-8 text-sm leading-7 text-gray-400">
          這個估算只用 3 個維度做線性映射,提供業務對話起點。實際結果依專案範圍而定,POC 階段會校準。
        </p>

        <RoiField label="程式碼倉庫數">
          {REPOS.map((value) => (
            <RoiChoice
              key={value}
              active={repos === value}
              onClick={() => setRepos(value)}
            >
              {value}
              {value === 100 ? "+" : ""}
            </RoiChoice>
          ))}
        </RoiField>

        <RoiField label="加密敏感度">
          {SENSITIVITIES.map(({ value, label }) => (
            <RoiChoice
              key={value}
              active={sensitivity === value}
              onClick={() => setSensitivity(value)}
            >
              {label}
            </RoiChoice>
          ))}
        </RoiField>

        <RoiField label="目前盤點方式">
          {CURRENTS.map(({ value, label }) => (
            <RoiChoice
              key={value}
              active={current === value}
              onClick={() => setCurrent(value)}
            >
              {label}
            </RoiChoice>
          ))}
        </RoiField>

        <div className="mt-8 rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-5">
          <p className="text-sm leading-7 text-gray-200">
            依您輸入,AegisCode Code 預估可在 30 天 POC 內產出{" "}
            <strong className="text-[#5EEAD4]">~{result.findings}</strong> 個高風險 CBOM finding,並節省{" "}
            <strong className="text-[#5EEAD4]">~{result.hoursSavedPerMonth}</strong> 工時/月。
          </p>
        </div>
      </div>
    </section>
  )
}

function RoiField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function RoiChoice({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-[#14B8A6] bg-[#14B8A6]/15 text-[#5EEAD4]"
          : "border-[#243447] bg-[#101B28] text-gray-300 hover:border-[#14B8A6]/40"
      }`}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/roi-mini.tsx
git commit -m "feat: RoiMini inline calculator with sensitivity-aware estimates"
```

---

## Task 6: New component `<CodeTour>`

**Files:**
- Create: `src/components/code-tour.tsx`

Client component. 4-step interactive tour matching spec §4.1.5:
1. CBOM 盤點 — 演算法 + 金鑰長度表
2. SAST 掃描 — findings list + severity
3. VULNFORGE — findings → fix workflow
4. Quality Gate — 閘門政策結果

Tab nav + framer-motion fade panel switch. All static mock data. No API.

Mobile: tabs collapse to native `<select>` dropdown.

- [ ] **Step 1: Create `src/components/code-tour.tsx`**

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { KeyRound, Search, Bot, Sliders } from "lucide-react"

type TourStep = {
  key: string
  icon: typeof KeyRound
  tabLabel: string
  title: string
  body: React.ReactNode
}

const steps: TourStep[] = [
  {
    key: "cbom",
    icon: KeyRound,
    tabLabel: "CBOM 盤點",
    title: "CBOM / PQC 加密資產盤點",
    body: (
      <ul className="space-y-2 text-sm leading-7 text-gray-200">
        <li>• RSA-2048 → PQC migration risk: <span className="text-amber-300">High</span></li>
        <li>• MD5 in legacy auth flow: <span className="text-red-300">Critical</span></li>
        <li>• Hard-coded IV in payment: <span className="text-red-300">Critical</span></li>
        <li>• AES-128 short key: <span className="text-amber-300">Medium</span></li>
      </ul>
    ),
  },
  {
    key: "sast",
    icon: Search,
    tabLabel: "SAST 掃描",
    title: "SAST findings + severity",
    body: (
      <ul className="space-y-2 text-sm leading-7 text-gray-200">
        <li>• SQL injection in user search — <span className="text-red-300">Critical</span></li>
        <li>• XSS in profile page — <span className="text-amber-300">High</span></li>
        <li>• Hard-coded secret in config — <span className="text-amber-300">High</span></li>
        <li>• Insecure deserialization — <span className="text-amber-300">Medium</span></li>
      </ul>
    ),
  },
  {
    key: "vulnforge",
    icon: Bot,
    tabLabel: "VULNFORGE",
    title: "SAST-in-the-Loop:findings → fix workflow",
    body: (
      <div className="space-y-3 text-sm leading-7 text-gray-200">
        <p className="text-gray-400">Finding → AI 建議 → 主管審核 → Merge</p>
        <div className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
          <div className="mb-1 text-xs text-gray-500">建議的修補 patch</div>
          <code className="text-xs text-[#5EEAD4]">
            - query = &quot;SELECT * FROM users WHERE id=&quot; + userId<br />
            + query = &quot;SELECT * FROM users WHERE id=?&quot;; params.push(userId)
          </code>
        </div>
        <p className="text-xs text-gray-500">主管 review → approved → CI 自動合併</p>
      </div>
    ),
  },
  {
    key: "gate",
    icon: Sliders,
    tabLabel: "Quality Gate",
    title: "Multi-dim Quality Gate + 主管審核",
    body: (
      <div className="space-y-2 text-sm leading-7 text-gray-200">
        <div className="flex justify-between border-b border-[#243447] pb-2">
          <span>BU: Core Banking · Critical findings</span>
          <span className="text-red-300">2 / 0 ❌</span>
        </div>
        <div className="flex justify-between border-b border-[#243447] pb-2">
          <span>BU: Core Banking · High findings</span>
          <span className="text-amber-300">5 / 3 ⚠</span>
        </div>
        <div className="flex justify-between">
          <span>BU: Core Banking · 主管審核</span>
          <span className="text-cyan-300">pending</span>
        </div>
      </div>
    ),
  },
]

export default function CodeTour() {
  const [active, setActive] = useState(0)

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold">產品畫面導覽</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-gray-400">
          4 個核心模組依 demo 流程排列。點選分頁切換,內容為 demo 情境 mock,僅作示意。
        </p>

        {/* Mobile: select */}
        <div className="md:hidden mb-6">
          <label className="sr-only" htmlFor="code-tour-select">
            選擇步驟
          </label>
          <select
            id="code-tour-select"
            value={active}
            onChange={(e) => setActive(Number(e.target.value))}
            className="w-full rounded-lg border border-[#243447] bg-[#0F1923] px-4 py-3 text-sm text-white"
          >
            {steps.map((s, i) => (
              <option key={s.key} value={i}>
                {i + 1}. {s.tabLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: tab bar */}
        <div className="mb-6 hidden gap-2 md:flex">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  active === i
                    ? "border-[#14B8A6] bg-[#14B8A6]/10 text-[#5EEAD4]"
                    : "border-[#243447] bg-[#101B28] text-gray-300 hover:border-[#14B8A6]/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                {s.tabLabel}
              </button>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#243447] bg-[#0F1923] p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[active].key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                {steps[active].title}
              </h3>
              {steps[active].body}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/code-tour.tsx
git commit -m "feat: CodeTour 4-step interactive capability walkthrough"
```

---

## Task 7: New component `<SurfaceProofStrip>`

**Files:**
- Create: `src/components/surface-proof-strip.tsx`

3 KPIs per spec §4.2.2:
1. 月報交付: 每月 1 份正式 PDF — 可呈交董事會
2. 顧問會議: 60–90 分鐘/月 — 管理層解讀(來源:DELIVERY_CHECKLIST.md 行 32)
3. Surface 起步 Domain 數: 25–50 個 — 30 天首份報告(來源:40W_SALES_SCRIPT.md 行 51)

Same visual structure as CodeProofStrip but with Surface sky-200/sky-300 accent.

- [ ] **Step 1: Create `src/components/surface-proof-strip.tsx`**

```tsx
const kpis = [
  {
    value: "每月 1 份",
    label: "正式月報交付",
    sub: "可呈交董事會",
  },
  {
    value: "60–90 分鐘",
    label: "顧問解讀會議",
    sub: "管理層每月參與",
  },
  {
    value: "25–50 個",
    label: "Surface 起步 Domain",
    sub: "30 天內首份正式報告",
  },
] as const

export default function SurfaceProofStrip() {
  return (
    <section className="border-y border-[#243447] bg-[#0A0F18]/90 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-[#243447] bg-[#101B28] p-5"
          >
            <div className="text-xl font-bold text-sky-300 sm:text-2xl">
              {kpi.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">
              {kpi.label}
            </div>
            <div className="mt-1 text-sm leading-6 text-gray-300">{kpi.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check + Lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/surface-proof-strip.tsx
git commit -m "feat: SurfaceProofStrip with delivery cadence and Domain start size"
```

---

## Task 8: New component `<ServiceCadence>`

**Files:**
- Create: `src/components/service-cadence.tsx`

12-month service cadence timeline per spec §4.2.7. Reference `src/components/workflow.tsx` for layout/motion pattern (don't copy content, only structure). Server component if no motion needed; client only if motion is used.

For minimum overhead, make it a server component with a CSS-only horizontal scroll on mobile, grid on desktop.

Milestones:
- M0:啟動評估(25–50 Domain)
- M1:第 1 份正式月報
- M2-M3:差異追蹤 + 修補建議
- Q1 末:季度治理檢討
- M4-M6:節奏穩定 + 趨勢驗證
- M7-M9:擴展 Domain / Portfolio
- M10-M12:年度成效總結 + 續約議題

- [ ] **Step 1: Create `src/components/service-cadence.tsx`**

```tsx
import { Calendar, CheckCircle2, FileText, RefreshCcw, BarChart3, Expand, Trophy } from "lucide-react"

const milestones = [
  {
    icon: Calendar,
    timing: "M0",
    title: "啟動評估",
    desc: "確認 25–50 個 Domain、Portfolio 範圍與聯絡窗口",
  },
  {
    icon: FileText,
    timing: "M1",
    title: "首份正式月報",
    desc: "Domain PDF + Portfolio PDF + 顧問解讀會議",
  },
  {
    icon: RefreshCcw,
    timing: "M2–M3",
    title: "差異追蹤 + 修補建議",
    desc: "每週 enrich + 每月修補任務更新",
  },
  {
    icon: BarChart3,
    timing: "Q1 末",
    title: "季度治理檢討",
    desc: "平均分數趨勢、P0/P1 任務、修補 ROI",
  },
  {
    icon: CheckCircle2,
    timing: "M4–M6",
    title: "節奏穩定",
    desc: "趨勢驗證、管理層持續參與顧問會議",
  },
  {
    icon: Expand,
    timing: "M7–M9",
    title: "擴展範圍",
    desc: "依需求新增 Domain / Portfolio,持續監控",
  },
  {
    icon: Trophy,
    timing: "M10–M12",
    title: "年度成效總結",
    desc: "KPI 改善幅度、續約方案與下年度治理目標",
  },
]

export default function ServiceCadence() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold">12 個月服務節奏</h2>
        <p className="mb-10 max-w-3xl text-sm leading-7 text-gray-400">
          年度顧問訂閱不是一次性專案。節奏化的差異追蹤、月報與顧問會議,讓管理層每月都能掌握外部風險是否下降。
        </p>

        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-7">
            {milestones.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.timing}
                  className="flex w-60 shrink-0 flex-col rounded-xl border border-[#243447] bg-[#0F1923] p-4 md:w-auto"
                >
                  <Icon className="mb-3 h-5 w-5 text-sky-300" />
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                    {m.timing}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {m.title}
                  </div>
                  <div className="mt-2 text-xs leading-6 text-gray-400">
                    {m.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type check + Lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/service-cadence.tsx
git commit -m "feat: ServiceCadence 12-month milestone timeline for Surface"
```

---

## Task 9: New component `<ReportFlip>`

**Files:**
- Create: `src/components/report-flip.tsx`

Client component. 3-page mock CISO 月報 preview per spec §4.2.5. Left/right arrow nav, keyboard ← → arrows, page indicator. Page 3 ends with text link to `/resources` for full sample download. No API.

Pages:
- Page 1: 封面 + Executive Summary(分數、趨勢、Top 3 風險)
- Page 2: Domain Top Backlog(P0/P1 任務、責任 BU、工時估算)
- Page 3: 法規對應 + ROI 試算(資安法、個資法、ISO 27001)

- [ ] **Step 1: Create `src/components/report-flip.tsx`**

```tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PAGES = 3

export default function ReportFlip() {
  const [page, setPage] = useState(0)

  const prev = useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
  const next = useCallback(() => setPage((p) => Math.min(PAGES - 1, p + 1)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-3xl font-bold">月報預覽 — 3 頁節錄</h2>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-gray-400">
          匿名化情境示意,展示董事會層級可閱讀的版面。完整 sample PDF 可在資源中心下載。
        </p>

        <div className="relative rounded-2xl border border-[#243447] bg-[#0F1923] p-6 sm:p-10">
          <div className="aspect-[4/5] sm:aspect-[16/10]">
            {page === 0 && <ReportPage1 />}
            {page === 1 && <ReportPage2 />}
            {page === 2 && <ReportPage3 />}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={page === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-[#243447] px-4 py-2 text-sm text-gray-300 transition hover:border-sky-300/50 disabled:opacity-40"
              aria-label="上一頁"
            >
              <ChevronLeft className="h-4 w-4" /> 上一頁
            </button>
            <div className="text-xs text-gray-500">{page + 1} / {PAGES}</div>
            <button
              type="button"
              onClick={next}
              disabled={page === PAGES - 1}
              className="inline-flex items-center gap-2 rounded-lg border border-[#243447] px-4 py-2 text-sm text-gray-300 transition hover:border-sky-300/50 disabled:opacity-40"
              aria-label="下一頁"
            >
              下一頁 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/resources"
            className="text-sm text-sky-300 underline-offset-4 hover:underline"
          >
            下載完整 CISO 月報 sample PDF →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ReportPage1() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#243447] pb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">CISO Monthly Report</div>
        <div className="mt-1 text-lg font-semibold text-white">2026 Q2 · 某金控 BU</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { v: "78", l: "平均分數" },
          { v: "+3", l: "30 天變化" },
          { v: "2", l: "P0 待修" },
        ].map((it) => (
          <div key={it.l} className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
            <div className="text-2xl font-bold text-sky-300">{it.v}</div>
            <div className="mt-1 text-xs text-gray-500">{it.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Top 3 風險</div>
        <ul className="mt-2 space-y-1 text-sm leading-6 text-gray-200">
          <li>• 公開可見舊版 TLS · <span className="text-red-300">Critical</span></li>
          <li>• 第三方 API 暴露 admin 端點 · <span className="text-amber-300">High</span></li>
          <li>• DMARC 政策未設定 · <span className="text-amber-300">High</span></li>
        </ul>
      </div>
    </div>
  )
}

function ReportPage2() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#243447] pb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Domain Top Backlog</div>
        <div className="mt-1 text-lg font-semibold text-white">P0 / P1 修補任務</div>
      </div>
      <div className="mt-5 space-y-2 text-sm">
        {[
          ["P0", "升級 TLS 至 1.3", "基礎建設 BU", "16 hr"],
          ["P0", "修補暴露管理端點", "Web 平台 BU", "8 hr"],
          ["P1", "設定 DMARC 嚴格模式", "資安 BU", "4 hr"],
          ["P1", "下架已停用子網域", "DevOps BU", "6 hr"],
          ["P1", "升級內部 CA 憑證", "基礎建設 BU", "12 hr"],
        ].map(([p, name, owner, eta]) => (
          <div key={name} className="grid grid-cols-[40px_1.4fr_1fr_60px] items-center gap-3 rounded border border-[#243447] bg-[#1A2332] px-3 py-2">
            <span className={p === "P0" ? "text-red-300 font-semibold" : "text-amber-300 font-semibold"}>{p}</span>
            <span className="text-gray-200">{name}</span>
            <span className="text-xs text-gray-500">{owner}</span>
            <span className="text-right text-xs text-gray-400">{eta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportPage3() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#243447] pb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">法規對應 + ROI 試算</div>
        <div className="mt-1 text-lg font-semibold text-white">合規地圖</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { law: "資安法 §17", item: "持續監測作業", status: "已對應" },
          { law: "個資法 §27", item: "技術安全措施", status: "已對應" },
          { law: "ISO 27001 A.5.7", item: "Threat intelligence", status: "已對應" },
        ].map((c) => (
          <div key={c.law} className="rounded-lg border border-[#243447] bg-[#1A2332] p-4">
            <div className="text-xs font-semibold text-sky-300">{c.law}</div>
            <div className="mt-1 text-xs text-gray-300">{c.item}</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#5EEAD4]">{c.status}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-[#243447] bg-[#1A2332] p-4 text-sm leading-7 text-gray-200">
        本月修補預估投入 46 工時,以平均加班成本估算,持續治理投入 vs 一次性外包顧問報告,年度可節省約 35% 治理成本。
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type check + Lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success (catches client-component boundary issues if any).

- [ ] **Step 4: Commit**

```bash
git add src/components/report-flip.tsx
git commit -m "feat: ReportFlip 3-page Surface monthly report preview"
```

---

## Task 10: `/code` page rewrite

**Files:**
- Modify: `src/app/code/page.tsx`

Per spec §4.1. Integrates Tasks 1, 2, 3, 5, 6 components (OutcomeVignette, ProductFaq, CodeProofStrip, RoiMini, CodeTour). Reorders sections, expands Capability Cards 5→6 (adds VULNFORGE as new card 3), Hero shrinks from 4 stacked spans to 3.

**Section order (final):**
1. Hero (3-line stacked + new subtitle)
2. CodeProofStrip
3. OutcomeVignette
4. Capability Cards (6 cards: CBOM → SAST → VULNFORGE → SBOM → Quality Gate + 主管審核 → 繁中合規)
5. CodeTour
6. Visual Versus (kept as inline JSX for now; upgraded in Task 11)
7. Deployment Options (existing)
8. RoiMini
9. ProductFaq (4 items)
10. POC CTA (existing) — strengthened with `/resources` cool-path link

**Specifically forbidden in any new copy** (per smoke forbidden list): `objection`, `業界首創`, `40W` / `40萬` / `400,000` / `NT$`, `WT` / `Sonaqu`.

- [ ] **Step 1: Replace `src/app/code/page.tsx` content**

(The implementer should rewrite the file in one go. Key edits below; component imports go in the import block.)

New imports to add:
```tsx
import { Briefcase, Building2, Cpu } from "lucide-react"
import CodeProofStrip from "@/components/code-proof-strip"
import OutcomeVignette from "@/components/outcome-vignette"
import CodeTour from "@/components/code-tour"
import RoiMini from "@/components/roi-mini"
import ProductFaq from "@/components/product-faq"
```

Hero `<h1>` (replace existing 4 spans with 3):
```tsx
<h1 className="max-w-full text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:break-words">
  <span className="block">以 CBOM/PQC 為矛尖</span>
  <span className="block">的內部程式碼治理</span>
  <span className="block">SAST + 主管審核閉環</span>
</h1>
```

Hero `<p>` subtitle:
```tsx
<p className="mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
  AegisCode Code 以 CBOM/PQC 加密資產盤點為矛尖,搭配 SAST 弱點掃描、VULNFORGE 修補工作流與主管審核留痕。專為金融、政府與高法遵組織的繁中合規場景設計。
</p>
```

`capabilities` array (replace existing 5 with 6, CBOM-first order):
```tsx
const capabilities = [
  {
    icon: KeySquare,
    title: "CBOM / PQC 加密資產",
    desc: "盤點程式碼中的加密用法,評估後量子遷移與長期資料保護風險。矛尖能力。",
  },
  {
    icon: ShieldCheck,
    title: "SAST 弱點掃描",
    desc: "覆蓋 12 種常見企業開發語言,弱點可直接進入主管審核工作流。",
  },
  {
    icon: WorkflowIcon,
    title: "SAST-in-the-Loop / VULNFORGE",
    desc: "把 SAST findings 轉成可審查、可修復、可追蹤的 AI review 工作流。",
  },
  {
    icon: Layers,
    title: "SBOM / SCA",
    desc: "建立依賴清單與第三方元件風險視圖,支援採購與稽核情境。",
  },
  {
    icon: FileCheck2,
    title: "Quality Gate + 主管審核",
    desc: "依 findings 嚴重度設計閘門規則,主管審核留痕完整,可作為金融合規證據。",
  },
  {
    icon: Code2,
    title: "繁中合規證據包",
    desc: "報告、修補建議、稽核紀錄全繁中化,可直接用於 POC 與客戶內部簡報。",
  },
]
```

OutcomeVignette cards (3, per spec §4.1.3):
```tsx
const outcomeCards = [
  {
    icon: Building2,
    scenario: "某金控 BU 評估 CBOM 法遵",
    pain: "加密資產散落在 Excel 與口耳相傳,稽核時無法即時提證",
    outcome: "統一 CBOM portfolio + Evidence Pack,30 天 POC 即可呈交主管",
  },
  {
    icon: Briefcase,
    scenario: "某政府機關 air-gapped SAST 需求",
    pain: "外送黑盒掃描,結果延遲且不能離站",
    outcome: "地端封閉部署,SAST + CBOM 報告直接在內網產出",
  },
  {
    icon: Cpu,
    scenario: "某製造/IoT 廠多語言治理",
    pain: "依賴工具拼接,每個語言各管各的,主管審核斷裂",
    outcome: "單一 Quality Gate 整合 12 種開發語言,主管審核留痕一致",
  },
]
```

ProductFaq items (4 per spec §4.1.8 — pick 4 of 6 candidates that don't duplicate the homepage `faq.tsx`):
```tsx
const productFaqItems = [
  {
    q: "AegisCode Code 跟既有的 SAST 工具(如 Snyk / Veracode / Checkmarx)有什麼差別?",
    a: "我們的差異化在 CBOM/PQC 加密資產盤點、繁中治理工作流與主管審核留痕。這三項是金融、政府客戶的核心稽核訴求,通用國際 SAST 工具不會原生支援。",
  },
  {
    q: "CBOM / PQC 的盤點真的能當合規證據用嗎?",
    a: "可以。CBOM portfolio 與 Evidence Pack 是依金融資安主管的稽核情境設計,涵蓋演算法、金鑰長度、IV、TLS、PQC 遷移風險。30 天 POC 階段我們會根據您的環境校準輸出。",
  },
  {
    q: "Air-gapped / 地端部署的複雜度如何?",
    a: "Air-gapped 是我們支援的部署模式之一。POC 階段會評估網路隔離、SSO 整合與資料留存要求,正式環境條件會在 POC 結束前釐清。",
  },
  {
    q: "30 天 POC 可以評估到什麼程度?",
    a: "POC 涵蓋 SAST findings 展示、CBOM/PQC 盤點 demo、SBOM/SCA 報告樣本、Quality Gate 試跑,以及部署與稽核需求盤點。POC 結束時您能拿到一份完整的 Evidence Pack 樣本與導入建議。",
  },
]
```

POC CTA section: keep existing structure, but the bottom row's 2nd button switches from `mailto:sales` to a `<Link href="/resources">下載合規證據包樣本</Link>` cool-path; `mailto:sales` becomes a third tertiary link below.

Render order (within `return`):
```tsx
return (
  <main className="min-h-screen overflow-x-hidden break-all bg-[#0D1521] text-white">
    <Navbar />
    {/* Hero (existing structure) */}
    <CodeProofStrip />
    <OutcomeVignette
      title="3 個典型客戶情境"
      subtitle="不具名情境示意,僅代表常見企業類型。實際 POC 會依您的環境校準。"
      cards={outcomeCards}
    />
    {/* Capability Cards (6 cards) */}
    <CodeTour />
    {/* Visual Versus (Task 11 upgrades this) */}
    {/* Deployment Options (existing) */}
    <RoiMini />
    <ProductFaq items={productFaqItems} />
    {/* POC CTA (existing, with /resources link adjustment) */}
    <Footer />
  </main>
)
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success. Build catches missing imports and client/server boundary issues.

- [ ] **Step 5: Public-pricing guard**

Run: `npm run guard:public-pricing`
Expected: PASS — no 40W/400000/NT$ leaks.

- [ ] **Step 6: Public-branding guard**

Run: `npm run guard:public-branding`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/code/page.tsx
git commit -m "feat(code): integrate proof strip, vignettes, tour, ROI, FAQ"
```

---

## Task 11: `/code` Visual Versus upgrade

**Files:**
- Modify: `src/app/code/page.tsx` (Versus section only)

Replace the current text-row Versus implementation (lines ~135-152 in pre-Task-10 file; now relocated after CodeTour) with 3-column visual cards matching spec §4.1.6.

- [ ] **Step 1: Replace `versusRows` and its render block**

New data:
```tsx
const versusMatrix: Array<{ dim: string; sonar: string; aegis: string }> = [
  { dim: "程式碼品質 + SAST", sonar: "成熟", aegis: "整合" },
  { dim: "CBOM / PQC", sonar: "未支援", aegis: "矛尖能力" },
  { dim: "繁中治理工作流", sonar: "未支援", aegis: "原生" },
  { dim: "主管審核留痕", sonar: "部分", aegis: "完整" },
  { dim: "台灣金融合規證據包", sonar: "未支援", aegis: "原生" },
]
```

New render JSX (replaces existing Versus section):
```tsx
<section className="px-6 py-16">
  <div className="mx-auto max-w-6xl">
    <h2 className="mb-8 text-3xl font-bold">vs SonarQube Enterprise</h2>
    <div className="overflow-hidden rounded-2xl border border-[#243447]">
      <div className="hidden bg-[#0F1923] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:grid sm:grid-cols-[1.2fr_1fr_1fr]">
        <div>維度</div>
        <div>SonarQube Enterprise</div>
        <div>AegisCode Code</div>
      </div>
      {versusMatrix.map((row) => (
        <div
          key={row.dim}
          className="grid gap-1 border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-4 sm:first:border-t"
        >
          <div className="font-medium text-gray-100">{row.dim}</div>
          <div className="text-gray-400">{row.sonar}</div>
          <div className="text-[#5EEAD4]">{row.aegis}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Type check + Lint + Build + guards**

Run: `npx tsc --noEmit && npm run lint && npm run build && npm run guard:public-pricing && npm run guard:public-branding`
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/code/page.tsx
git commit -m "feat(code): upgrade Versus to 3-column visual matrix"
```

---

## Task 12: `/surface` page rewrite

**Files:**
- Modify: `src/app/surface/page.tsx`

Per spec §4.2. Integrates Tasks 1, 2, 7, 8, 9 components (OutcomeVignette, ProductFaq, SurfaceProofStrip, ServiceCadence, ReportFlip). Hero keeps 4 stacked spans (spec §4.2.1 explicit: "大標保留 4 行(已驗證)") — only subtitle micro-tweak and new trust tag.

**Section order (final):**
1. Hero (4-line title preserved; subtitle micro-tweak; new trust tag)
2. SurfaceProofStrip
3. OutcomeVignette
4. Capability Cards (4 cards, unchanged)
5. ReportFlip
6. Versus Table (existing, kept)
7. ServiceCadence
8. ProductFaq (4 items)
9. CTA section (existing; new trust strip below)

- [ ] **Step 1: Update `src/app/surface/page.tsx`**

Add imports:
```tsx
import { Building2, Briefcase, Globe } from "lucide-react"
import SurfaceProofStrip from "@/components/surface-proof-strip"
import OutcomeVignette from "@/components/outcome-vignette"
import ReportFlip from "@/components/report-flip"
import ServiceCadence from "@/components/service-cadence"
import ProductFaq from "@/components/product-faq"
```

Hero subtitle micro-tweak (existing line ~77-79):
```tsx
<p className="mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
  AegisCode Surface 是外部攻擊面年度治理服務。它把外部評分、供應商風險、修補優先順序、台灣法規對應與顧問月報整合,成為 CISO 每月可向管理層交代的治理視圖。
</p>
```

Trust tag insertion (after the existing pill, before the title):
```tsx
<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-medium text-sky-200">
  <Globe2 className="h-4 w-4" />
  AegisCode Surface · 年度顧問訂閱
</div>
```

(That pill exists already; verify it carries "年度顧問訂閱" — if it currently shows "年度顧問訂閱" it's fine. The spec asks to add a tag; this slot is already used for the existing pill. Skip adding a new tag — the existing pill text already says "年度顧問訂閱". Mark the spec note as satisfied by existing.)

`outcomeCards` for Surface:
```tsx
const outcomeCards = [
  {
    icon: Building2,
    scenario: "某金控供應商風險治理",
    pain: "供應商資安狀況散落在 Excel,無法即時通報董事會",
    outcome: "統一供應商 portfolio + 月報視圖,管理層每月掌握",
  },
  {
    icon: Briefcase,
    scenario: "某政府機關外部曝險合規申報",
    pain: "原生評分 dashboard 是英文,無法直接對應台灣法規申報",
    outcome: "中文化治理視圖 + 法規對應 evidence,稽核可直接引用",
  },
  {
    icon: Globe,
    scenario: "某跨國 SaaS 子公司 Portfolio 治理",
    pain: "多 Domain 分散在地區,風險視圖無法整併",
    outcome: "統一 Portfolio 月報,跨子公司風險可量化比較",
  },
]
```

ProductFaq items (4, from `40W_SALES_SCRIPT.md` objections — rewritten to avoid the forbidden `objection` word):
```tsx
const productFaqItems = [
  {
    q: "SecurityScorecard / BitSight 本來就有 dashboard,為什麼還需要 Surface?",
    a: "原生 dashboard 提供的是原始視圖。Surface 提供的是中文化治理平台、修補優先順序、法規對應、風險量化與顧問交付月報——這些才是管理層真正會閱讀的內容。Surface 不取代外部評分平台,它把評分轉成董事會看得懂的治理結論。",
  },
  {
    q: "為什麼是年度訂閱不是一次買斷?",
    a: "外部攻擊面是持續變動的。重要的不是今天掃到什麼,而是未來 12 個月風險能不能持續下降。所以這更適合年度治理服務,而非一次性專案。",
  },
  {
    q: "報價怎麼算?",
    a: "依 Domain / Portfolio 數量、會議頻率與顧問參與深度而定。我們會在諮詢階段釐清您的範圍後提供正式報價,不在公開頁面揭露絕對金額。",
  },
  {
    q: "首次月報多久能交付?",
    a: "簽約後 30 天內交付首份正式 CISO 月報,涵蓋 Top 風險、Domain backlog、法規對應與 ROI 試算。",
  },
]
```

Render order:
```tsx
return (
  <main className="min-h-screen overflow-x-hidden break-all bg-[#0D1521] text-white">
    <Navbar />
    {/* Hero (existing structure, subtitle tweak only) */}
    <SurfaceProofStrip />
    <OutcomeVignette
      title="3 個典型客戶情境"
      subtitle="不具名情境示意。實際範圍與輸出在諮詢階段釐清。"
      cards={outcomeCards}
      accentClass="text-sky-300"
    />
    {/* Capability Cards (existing 4) */}
    <ReportFlip />
    {/* Versus Table (existing) */}
    <ServiceCadence />
    <ProductFaq items={productFaqItems} />
    {/* CTA (existing) */}
    <Footer />
  </main>
)
```

- [ ] **Step 2: Type check + Lint + Build + guards**

Run: `npx tsc --noEmit && npm run lint && npm run build && npm run guard:public-pricing && npm run guard:public-branding`
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/surface/page.tsx
git commit -m "feat(surface): integrate proof strip, vignettes, report flip, cadence, FAQ"
```

---

## Task 13: Mobile/a11y pass + smoke-production URL verify

**Files:**
- Possibly modify: any of the 8 new components if mobile or a11y issues are found
- No code change to `scripts/smoke-production.mjs` (already covers `/code`, `/surface`)

- [ ] **Step 1: Start local dev server**

Run: `npm run dev`
Expected: server up at `http://localhost:3000`.

- [ ] **Step 2: Open `/code` in browser, resize to 360px width**

Verify:
- Hero stacked 3 lines fit (no horizontal overflow)
- CodeProofStrip 3 cards stack into 1 column
- OutcomeVignette 3 cards stack into 1 column
- Capability Cards: 6 cards in 1 column
- CodeTour: shows native `<select>` (not tab bar) on mobile
- Visual Versus: rows stack or wrap (no horizontal overflow)
- Deployment Options: cards stack
- RoiMini: chip buttons wrap, never overflow
- ProductFaq: details fit, `+` indicator rotates on open
- POC CTA: buttons stack vertically

- [ ] **Step 3: Open `/surface` in browser, resize to 360px width**

Verify:
- Hero stacked 4 lines (preserved) fit (already verified per prior round)
- SurfaceProofStrip 3 cards stack
- OutcomeVignette stacks
- Capability Cards (4) stack into 1 column
- ReportFlip: aspect ratio shifts to 4/5 portrait, prev/next still fit
- Versus Table: rows wrap (existing behavior)
- ServiceCadence: horizontal scroll fires (no body overflow)
- ProductFaq fits
- CTA stacks

- [ ] **Step 4: Keyboard a11y check**

On `/code`:
- Tab through page; all `<button>` and `<a>` should be focusable.
- CodeTour buttons should respond to Enter/Space.
- RoiMini chip buttons should respond to Enter/Space; `aria-pressed` should toggle.
- ProductFaq `<details>` opens with Enter.

On `/surface`:
- ReportFlip prev/next buttons focusable; `disabled` blocks at boundaries.
- ← → arrow keys flip pages.

- [ ] **Step 5: Run smoke against local dev server**

Run: `SMOKE_SITE_URL=http://localhost:3000 SMOKE_EXPECT_CHECKOUT_PAUSED=1 npm run smoke:production`
Expected: PASS for `/code`, `/surface` and all forbidden pattern checks.

- [ ] **Step 6: Stop dev server, commit any fixes from Steps 2-5**

```bash
git add -A
git commit -m "fix(products): mobile + a11y refinements on Round-2 polish"
```

(If no changes were needed, skip the commit and note this in the task tracker.)

---

## Task 14: Full-site verification

**Files:** None modified.

- [ ] **Step 1: Run all verification steps**

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run guard:public-pricing
npm run guard:public-branding
npm run test:lib
```

Expected: ALL pass.

- [ ] **Step 2: Confirm ItemList JSON-LD is intact**

Read `src/app/page.tsx`; locate the `itemListJsonLd` (the ItemList script tag), verify both `Code` and `Surface` `Product` sub-items are present. No reduction.

Use the Grep tool: search for `itemListJsonLd` and verify both `Code` and `Surface` entries remain in the structure. Visual verification is sufficient — no execution needed.

- [ ] **Step 3: Confirm no `objection` substring in any source file under `src/`**

Use the Grep tool with `pattern: "objection"` `path: "src/"` `-i: true` `output_mode: "files_with_matches"`. Expected: no matches.

(Bash equivalent if running outside Claude Code: `grep -ri "objection" src/`. On Windows PowerShell, prefer the Grep tool — `grep` may not be available.)

- [ ] **Step 4: Commit a marker if any meta-files updated (typically none)**

If anything was tweaked during verification, commit:
```bash
git add -A
git commit -m "chore: round-2 polish full-site verification"
```

(Otherwise this task is a no-op verification gate.)

---

## Task 15: Update `docs/SALES_RUNTHROUGH.md` with Round-2 section guide

**Files:**
- Modify: `docs/SALES_RUNTHROUGH.md`

Add a Round-2 section that maps each new component to the talking points sales should use during demo.

- [ ] **Step 1: Append Round-2 section to `docs/SALES_RUNTHROUGH.md`**

```markdown
## Round-2 內頁加深(2026-05-16)

`/code` 與 `/surface` 兩個內頁新增的 section,對應銷售話術:

### `/code` 新區塊

| 區塊 | Demo 話術 | 對應 sales asset |
|---|---|---|
| Proof Strip | 「DOI 10.3390/math14061072 是 peer-reviewed,POC 30 天,12 種語言。」 | `product-proof.tsx` 引用同一 DOI |
| Outcome Vignette | 「3 個典型場景。您屬於哪一個?」(讓客戶自我定位) | `EXECUTIVE_DEMO_DATASET.md` 的 demo 順序 |
| Capability Cards (6,CBOM 首位) | 「矛尖是 CBOM/PQC。其他都是支援體系。」 | `15f692b` 定位 shift |
| Code Tour | 4-step click through:CBOM → SAST → VULNFORGE → Quality Gate | `DEMO_RUNBOOK.md` 的 demo 順序 |
| Visual Versus | 「vs SonarQube,5 個維度的差異化。」 | 既有 vs SonarQube 行 |
| Roi Mini | 「您點 3 個維度,我們估給您看。實際 POC 會校準。」 | 沒有外部 source,純估算 |
| Product FAQ | 4 題 Code 專屬,covers SAST 工具差異/CBOM 合規可用性/air-gapped/POC 範圍 | 不重複 homepage `faq.tsx` |

### `/surface` 新區塊

| 區塊 | Demo 話術 | 對應 sales asset |
|---|---|---|
| Proof Strip | 「每月 1 份月報,60-90 分鐘顧問會議,25-50 個 Domain 起步。」 | `DELIVERY_CHECKLIST.md` + `40W_SALES_SCRIPT.md` |
| Outcome Vignette | 「3 個 CISO 典型場景。」 | `40W_SALES_SCRIPT.md` 的客戶痛點 |
| Report Flip | 翻 3 頁:封面 → backlog → 法規對應 | `monthly_watchlist_pdf.py` 產出的真實月報結構 |
| Service Cadence | 12 個月節奏,M0 到 M12 | `DELIVERY_CHECKLIST.md` |
| Product FAQ | 4 題 Surface 專屬,covers SecurityScorecard 差異/訂閱 vs 買斷/報價/首次月報期程 | `40W_SALES_SCRIPT.md` 的常見問題 |

### 切記
- 不在公開頁面講絕對金額(40 萬不能在 demo 期間 leak 到 `/code` 或 `/surface`)
- ROI Mini 的數字是「估算」,客戶問細節時引導到 POC 校準
- Report Flip 的內容是匿名化情境,不對應任何真實客戶
```

- [ ] **Step 2: Commit**

```bash
git add docs/SALES_RUNTHROUGH.md
git commit -m "docs: Round-2 sales runthrough additions for /code and /surface"
```

---

## Done criteria (mirrors spec §12)

- [ ] `/code` 與 `/surface` 桌機 + mobile 體感一致,無 horizontal overflow
- [ ] CBOM-forward 定位在 `/code` 全頁體現(Capability Cards 第 1 位、Hero、Tour 第 1 步)
- [ ] Surface 全頁不出現 40 萬絕對金額
- [ ] 所有新元件無 API call
- [ ] `npm run build` + `npm run lint` + `npx tsc --noEmit` 全綠
- [ ] `npm run test:lib` 全綠(含新的 `roi-mini-calc.test.mjs`)
- [ ] `guard:public-pricing` 通過
- [ ] `guard:public-branding` 通過
- [ ] `productJsonLd` 結構不退步
- [ ] `docs/SALES_RUNTHROUGH.md` 補入 Round-2 區塊指南
- [ ] 既有 `src/components/faq.tsx` 未被修改
- [ ] `scripts/smoke-production.mjs` 未被修改(因為已 cover `/code`、`/surface`)
- [ ] 無 `objection` 字串出現於任何 `src/` 檔
