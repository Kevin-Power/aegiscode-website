# AegisCode 雙產品 Sales-Ready 官網 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `aegiscode-website` so the sales team can demo AegisCode Code (internal SAST/CBOM) and AegisCode Surface (external attack-surface governance, sourced from SGW) as one coherent dual-product offering, without modifying either product's backend.

**Architecture:** Pure frontend + light API extensions on the existing Next.js 16 + KV-backed marketing/license site. New pages (`/code`, `/surface`, `/resources`), home-page narrative restructure, three-track lead capture, lead-gated PDF downloads streamed via HMAC-signed route handlers, public-pricing guard extension. The two product backends (`WT-Sonaqu-2026-05-11/` and SGW Python pipeline) are NOT modified; SGW only contributes 3 one-time-produced PDFs deployed via ops.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, framer-motion, lucide-react, @vercel/kv, Sentry, Resend/SMTP, ESLint flat config. No new dependencies.

**Spec:** [docs/superpowers/specs/2026-05-15-aegiscode-dual-product-site-design.md](../specs/2026-05-15-aegiscode-dual-product-site-design.md)

---

## Testing Note

This project has **no unit-test framework** (`package.json` has no `test` script, no Jest/Vitest). Verification per task uses what already exists:

- **Type check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Public-pricing guard**: `npm run guard:public-pricing`
- **Public-branding guard**: `npm run guard:public-branding`
- **Readiness**: `npm run readiness:report` (non-blocking) or `npm run readiness` (blocking)
- **Smoke**: `npm run smoke:production` (runs against deployed; for dev only after deploy)
- **Local dev server**: `npm run dev` (default port 3000) + browser inspection
- **API verification**: `curl` against `http://localhost:3000` with documented expected JSON

Plan does NOT add a test framework — that's out of scope. Where tests are valuable (the new HMAC token logic), the plan adds a small `node --test` script that uses Node 20+'s built-in test runner (zero new deps).

**Skill references**:
- @superpowers:verification-before-completion — run all relevant checks before claiming a task complete
- @superpowers:subagent-driven-development — recommended execution mode

---

## Task Sequence Overview

| # | Task | Touches |
|---|---|---|
| 1 | Scaffold `public/downloads/` directory + .gitignore | infra |
| 2 | Rename `external-risk.tsx` → `surface-spotlight.tsx` (with re-export shim) | components |
| 3 | New page `/surface` with full Surface narrative | pages |
| 4 | 308 redirect `/external-risk` → `/surface` + delete old page | next.config |
| 5 | New page `/code` with Code product depth content | pages |
| 6 | New component `<ComplianceMatrix>` (TW law mapping) | components |
| 7 | New component `<DualPillars>` (home hero-after dual cards) | components |
| 8 | Navbar with 產品/資源 dropdowns | components |
| 9 | Home page region restructure + JSON-LD ItemList + FAQ +5 in JSON-LD | pages |
| 10 | PainPoints +2 CISO entries | components |
| 11 | FAQ +5 Surface entries (rendered list) | components |
| 12 | CtaContact dual CTA | components |
| 13 | `/pricing` dual-card restructure | pages |
| 14 | `/api/trial/signup` extend with `track` + Surface fields + always-manual for SURFACE/BOTH | api |
| 15 | `/trial` form three-track segmentation with conditional fields | pages |
| 16 | `/trial` success screen Surface/Both variant | pages |
| 17 | New lib `lib/download-sign.ts` HMAC token (signed URLs) + node test | lib |
| 18 | New `POST /api/resources/download` (lead capture + presigned URL) | api |
| 19 | New `GET /api/resources/file/[assetId]` (HMAC verify + stream PDF) | api |
| 20 | New `/resources` page with 3 asset cards + download modal | pages |
| 21 | Extend `check-public-pricing-hidden.mjs` regex (40W variants) | scripts |
| 22 | Full-site verification: typecheck + lint + build + guards | verification |
| 23 | Sales runthrough rehearsal checklist | docs |
| 24 | SGW-side PDF production handoff note | docs |
| 25 | README update + final smoke | docs |

---

## Task 1: Scaffold `public/downloads/` directory + .gitignore entry

**Files:**
- Create: `public/downloads/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Create the downloads directory placeholder**

```bash
mkdir -p public/downloads
echo "# Lead-gated PDFs deployed by ops at release time. Do not commit PDFs." > public/downloads/.gitkeep
```

- [ ] **Step 2: Add gitignore entry for PDFs only**

Edit `.gitignore`, append at end:
```
# Lead-gated PDFs are deployed by ops, not committed
public/downloads/*.pdf
```

- [ ] **Step 3: Verify gitkeep is tracked but PDFs are ignored**

```bash
echo "fake" > public/downloads/test.pdf
git status --short public/downloads/
# Expected: only `.gitkeep` is shown as untracked; `test.pdf` is ignored
rm public/downloads/test.pdf
```

- [ ] **Step 4: Commit**

```bash
git add public/downloads/.gitkeep .gitignore
git commit -m "chore: scaffold public/downloads/ for lead-gated PDFs"
```

---

## Task 2: Rename `external-risk.tsx` → `surface-spotlight.tsx` with re-export shim

**Files:**
- Create: `src/components/surface-spotlight.tsx`
- Modify: `src/components/external-risk.tsx` (becomes a 1-line re-export with deprecation comment)

**Why:** Component sits in 5+ places in the home page; renaming in one shot risks breaking imports. Re-export shim is removable after 30 days.

- [ ] **Step 1: Move file content with rename**

```bash
git mv src/components/external-risk.tsx src/components/surface-spotlight.tsx
```

- [ ] **Step 2: Rename the default export inside the new file**

In `src/components/surface-spotlight.tsx`, change:
- `export default function ExternalRisk()` → `export default function SurfaceSpotlight()`
- Section element `<section id="external-risk"` → `<section id="surface-spotlight"`
- Link `href="/external-risk"` → `href="/surface"` (CTA at end)
- Update copy headline `從程式碼治理，延伸到外部曝險與供應商風險。` → `AegisCode Surface — 從程式碼治理,延伸到外部曝險與供應商風險。`

- [ ] **Step 3: Create the back-compat shim at the old path**

Create new `src/components/external-risk.tsx` containing exactly:

```tsx
/**
 * @deprecated Renamed to `surface-spotlight.tsx` on 2026-05-15. This shim
 * exists to avoid breaking any external imports during the rename window
 * and can be deleted after 2026-06-15.
 */
export { default } from "./surface-spotlight"
```

- [ ] **Step 4: Update home page import**

In `src/app/page.tsx`:
- Change `import ExternalRisk from "@/components/external-risk";` → `import SurfaceSpotlight from "@/components/surface-spotlight";`
- Change `<ExternalRisk />` → `<SurfaceSpotlight />`

- [ ] **Step 5: Verify lint + build**

```bash
npm run lint
npx tsc --noEmit
npm run build
```
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/surface-spotlight.tsx src/components/external-risk.tsx src/app/page.tsx
git commit -m "refactor: rename external-risk component to surface-spotlight"
```

---

## Task 3: New page `/surface` with full Surface narrative

**Files:**
- Create: `src/app/surface/page.tsx`

- [ ] **Step 1: Create the page file**

Create `src/app/surface/page.tsx` with the following structure. Adapt copy from `security-governance-workbench-v0.1/.../WTMEC/40W_SALES_SCRIPT.md` Objection 1 (vs SecurityScorecard), `DELIVERY_CHECKLIST.md` (service scope), and `EXECUTIVE_DEMO_DATASET.md` (use cases). **Strip all internal sales jargon** (avoid words like 「框價」「objection」「成交」 in customer-facing copy).

```tsx
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Gauge,
  Globe2,
  Scale,
  Sparkles,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const capabilities = [
  {
    icon: Globe2,
    title: "外部評分整合",
    desc: "可搭配 SecurityScorecard、BitSight 或客戶既有 EASM,把外部曝險訊號彙整成單一治理視圖。",
  },
  {
    icon: Sparkles,
    title: "AI 修補建議",
    desc: "依弱點類型自動生成 P0–P3 優先級修補步驟與驗證方式,並附工時與 ROI 估算。",
  },
  {
    icon: Scale,
    title: "台灣法規對應",
    desc: "自動對應資通安全管理法、個資法、ISO 27001:2022,讓技術修補可被稽核理解。",
  },
  {
    icon: FileText,
    title: "顧問級 CISO 月報",
    desc: "風險量化、趨勢、Top Backlog、法規對應與 ROI 試算,一份可以呈交董事會的 PDF。",
  },
]

const versusRows: Array<[string, string, string]> = [
  ["原始評分視圖", "中文化治理工作流", "Surface 補上"],
  ["弱點清單", "修補優先順序 + 工時 + ROI", "Surface 補上"],
  ["國際標準對照", "台灣法規條目對應", "Surface 補上"],
  ["技術 dashboard", "管理層可讀月報 + 顧問解讀", "Surface 補上"],
  ["外部視角", "外部 + 內部 + 供應商整合視圖", "Surface 補上"],
]

const serviceScope = [
  "平台存取 — 治理工作台、Domain 深入分析、修補任務追蹤",
  "每週差異追蹤 — 偵測新風險、追蹤已修風險",
  "每月正式治理報告 — CISO 月報 PDF,可呈交董事會",
  "季度治理檢討 — 平均分數趨勢、P0/P1 任務、修補 ROI",
  "顧問解讀會議 — 每月 60–90 分鐘,協助管理層理解",
]

export const metadata = {
  title: "AegisCode Surface — 外部攻擊面治理 | AegisCode",
  description:
    "AegisCode Surface 是外部攻擊面年度治理服務,結合 SecurityScorecard / BitSight 評分、AI 修補建議、台灣法規對應與顧問級 CISO 月報。",
}

export default function SurfacePage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-medium text-sky-200">
            <Globe2 className="h-4 w-4" />
            AegisCode Surface · 年度顧問訂閱
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            外部攻擊面的年度治理服務 — 把評分變成董事會看得懂的報告。
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
            AegisCode Surface 不取代外部評分平台。它把外部評分、供應商 domain、修補優先順序、台灣法規對應與顧問月報整合,成為 CISO 可以每月向管理層交代的治理視圖。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trial?track=SURFACE"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              預約 Surface 諮詢
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              下載 CISO 月報 sample
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold">四個核心能力</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {cap.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Versus table */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <Gauge className="h-5 w-5 text-[#14B8A6]" />
            <h2 className="text-3xl font-bold">
              跟外部評分平台原生 dashboard 比,差在哪?
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#243447]">
            <div className="grid grid-cols-[1fr_1.4fr_auto] bg-[#0F1923] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              <div>原生 dashboard</div>
              <div>AegisCode Surface</div>
              <div className="text-right">差異</div>
            </div>
            {versusRows.map(([native, surface, note]) => (
              <div
                key={native}
                className="grid grid-cols-[1fr_1.4fr_auto] border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm"
              >
                <div className="text-gray-400">{native}</div>
                <div className="text-gray-100">{surface}</div>
                <div className="text-xs font-semibold text-[#5EEAD4]">
                  {note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service scope */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-bold">年度服務範圍</h2>
          <div className="space-y-3">
            {serviceScope.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-[#243447] bg-[#101B28] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14B8A6]" />
                <p className="text-sm leading-7 text-gray-300">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-gray-500">
            報價依 Domain / Portfolio 數量、會議頻率與顧問參與深度而定。Surface 為年度訂閱模式,合約簽訂後啟動。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            想看真實 CISO 月報長什麼樣?
          </h2>
          <p className="mt-3 text-gray-300">
            匿名化的 sample PDF 可以在資源中心下載。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              下載月報 sample
            </Link>
            <Link
              href="/trial?track=SURFACE"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              預約 Surface 諮詢
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Verify build + browse locally**

```bash
npm run dev
```

Open `http://localhost:3000/surface` in browser. Confirm:
- Hero renders, CTA buttons visible
- Capabilities grid, versus table, service scope list, CTA section all visible
- No console errors

Stop dev server with Ctrl-C.

- [ ] **Step 3: Verify lint + typecheck + build**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] **Step 4: Run public-pricing guard**

```bash
npm run guard:public-pricing
```
Expected: passes (page contains no 40W variants or AggregateOffer).

- [ ] **Step 5: Commit**

```bash
git add src/app/surface/page.tsx
git commit -m "feat: add /surface AegisCode Surface product page"
```

---

## Task 4: 308 redirect `/external-risk` → `/surface` + delete old page

**Files:**
- Modify: `next.config.ts`
- Delete: `src/app/external-risk/page.tsx`

- [ ] **Step 1: Add redirects() to next.config.ts**

Replace the existing `next.config.ts` content with:

```ts
import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/external-risk",
        destination: "/surface",
        permanent: true, // emits 308
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "aegiscode",
  project: "aegiscode-website",
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
})
```

- [ ] **Step 2: Delete the old page**

```bash
git rm src/app/external-risk/page.tsx
# Remove now-empty directory
rmdir src/app/external-risk 2>/dev/null || true
```

- [ ] **Step 3: Build to validate redirect config**

```bash
npm run build
```
Expected: build succeeds; build output mentions the redirect.

- [ ] **Step 4: Verify redirect in dev**

```bash
npm run dev
```

In another terminal:
```bash
curl -sI http://localhost:3000/external-risk
```

Expected: `HTTP/1.1 308 Permanent Redirect` with `Location: /surface`.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts
git rm src/app/external-risk/page.tsx
git commit -m "feat: 308 redirect /external-risk to /surface"
```

---

## Task 5: New page `/code` with Code product depth

**Files:**
- Create: `src/app/code/page.tsx`

- [ ] **Step 1: Create the page file**

Adapt the existing home-page narrative for Code-specific depth. Sections: Hero, 5-capability grid, vs SonarQube Enterprise table, deployment options (SaaS/地端/Air-gapped), POC 30-day deliverables, CTA. **Reuse copy from existing `features.tsx` / `workflow.tsx` / current home JSON-LD description** to maintain voice.

```tsx
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  CloudOff,
  Code2,
  FileCheck2,
  KeySquare,
  Layers,
  ShieldCheck,
  Workflow as WorkflowIcon,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const capabilities = [
  {
    icon: ShieldCheck,
    title: "SAST 弱點掃描",
    desc: "覆蓋 12 種常見企業開發語言,整合 OWASP / CWE 規則,findings 直接落入主管審核工作流。",
  },
  {
    icon: KeySquare,
    title: "CBOM / PQC 加密資產",
    desc: "盤點 Java / Python / Go / Node / TS / JS / C# 程式碼中的加密用法,評估後量子遷移風險。",
  },
  {
    icon: Layers,
    title: "SBOM / SCA",
    desc: "建立依賴清單與第三方元件風險視圖,supports 採購與稽核情境。",
  },
  {
    icon: WorkflowIcon,
    title: "Quality Gate + 主管審核",
    desc: "依 findings 嚴重度設計可配置的閘門規則,審核紀錄完整留痕,可作為金融合規證據。",
  },
  {
    icon: FileCheck2,
    title: "繁中合規證據包",
    desc: "報告、修補建議、稽核紀錄全繁中化,可直接用於 POC 與客戶內部簡報。",
  },
]

const versusRows: Array<[string, string]> = [
  ["SonarQube Enterprise 強項", "成熟的程式碼品質與 SAST 規則庫"],
  ["AegisCode Code 補強", "繁中治理工作流 + AI 程式碼健檢"],
  ["AegisCode Code 補強", "CBOM / PQC 加密資產盤點"],
  ["AegisCode Code 補強", "SBOM / SCA + 主管審核留痕"],
  ["AegisCode Code 補強", "台灣金融合規證據包"],
]

const deploymentOptions = [
  ["SaaS 託管", "最快的導入路徑,適合一般企業評估"],
  ["私有雲 / 地端", "適合高法遵組織自管環境"],
  ["Air-gapped", "適合需求離線運作的金融、政府或國防客戶"],
]

const pocDeliverables = [
  "SAST findings 與 AI 修復建議展示",
  "CBOM / PQC 加密資產盤點 Demo",
  "SBOM / SCA 報告與稽核證據包樣本",
  "Quality Gate 與主管審核紀錄試跑",
  "部署、SSO、資料留存與 DPA 需求盤點",
]

export const metadata = {
  title: "AegisCode Code — 內部程式碼資安治理 | AegisCode",
  description:
    "AegisCode Code 是企業內部程式碼資安平台,整合 SAST、CBOM/PQC、SBOM/SCA、主管審核與繁中合規證據包,適合金融、政府與高法遵組織。",
}

export default function CodePage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />

      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-medium text-[#5EEAD4]">
            <Code2 className="h-4 w-4" />
            AegisCode Code · 平台授權
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            一站式內部程式碼資安治理 — SAST + CBOM + SBOM + 主管審核閉環。
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
            AegisCode Code 把 SAST 弱點、加密資產盤點、依賴風險與主管審核留痕整合在同一個繁中治理工作台,直接服務開發團隊與資安 BU 管理者的合規工作流。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trial?track=CODE"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              預約 Code POC
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              查看方案
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold">五個核心能力</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#5EEAD4]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {cap.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-3xl font-bold">vs SonarQube Enterprise</h2>
          <div className="overflow-hidden rounded-2xl border border-[#243447]">
            {versusRows.map(([label, content], idx) => (
              <div
                key={idx}
                className="grid grid-cols-[180px_1fr] gap-4 border-t border-[#243447] bg-[#101B28] px-5 py-4 text-sm first:border-t-0"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  {label}
                </div>
                <div className="text-gray-200">{content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <CloudOff className="h-5 w-5 text-sky-300" />
            <h2 className="text-3xl font-bold">部署選項</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {deploymentOptions.map(([title, desc]) => (
              <div
                key={title}
                className="rounded-xl border border-[#243447] bg-[#0F1923] p-5"
              >
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-gray-500">
            正式部署條件、SSO、資料留存與 DPA 細節會在 30 天 POC 階段確認。
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#243447] bg-[#0F1923] p-8">
          <h2 className="mb-6 text-2xl font-bold">30 天 POC 評估內容</h2>
          <div className="space-y-3">
            {pocDeliverables.map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14B8A6]" />
                <p className="text-sm leading-7 text-gray-300">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trial?track=CODE"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              申請 30 天 POC
            </Link>
            <a
              href="mailto:sales@aegiscode.com"
              className="inline-flex items-center justify-center rounded-lg border border-[#243447] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-[#14B8A6] hover:text-white"
            >
              聯絡顧問
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Browse to verify**

```bash
npm run dev
```

Open `http://localhost:3000/code`. Confirm sections render. Stop dev server.

- [ ] **Step 3: Verify checks**

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run guard:public-pricing
```

- [ ] **Step 4: Commit**

```bash
git add src/app/code/page.tsx
git commit -m "feat: add /code AegisCode Code product page"
```

---

## Task 6: New component `<ComplianceMatrix>` (TW law mapping)

**Files:**
- Create: `src/components/compliance-matrix.tsx`

**Data source:** `security-governance-workbench-v0.1/.../WTMEC/compliance_mapping.py` — extract 3–5 mapping items per regulation. Since the planner cannot execute Python from this repo, the hard-coded items below are the **canonical mapping for the site**; if SGW's mapping diverges in the future, sync this file. (Mapping facts here verified against the WTMEC bundle by the spec author.)

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { motion, useInView } from "framer-motion"
import { Scale, ShieldCheck } from "lucide-react"
import { useRef } from "react"

const regulations: Array<{
  title: string
  subtitle: string
  items: string[]
}> = [
  {
    title: "資通安全管理法",
    subtitle: "資安事件、弱點掃描、改善追蹤",
    items: [
      "資安事件分級與通報窗口",
      "弱點掃描與修補時效要求",
      "資安治理組織與責任歸屬",
      "稽核紀錄保存與審查週期",
    ],
  },
  {
    title: "個人資料保護法",
    subtitle: "個資處理、技術保護、外洩通報",
    items: [
      "個資處理目的與最小化原則",
      "技術與組織保護措施",
      "外洩通報與當事人告知",
      "委外處理與第三方治理",
    ],
  },
  {
    title: "ISO 27001:2022",
    subtitle: "資訊安全管理系統 (ISMS)",
    items: [
      "A.5 組織控制 — 治理結構與責任",
      "A.6 人員控制 — 安全意識訓練",
      "A.8 技術控制 — 弱點管理與密碼學",
      "A.5.23 雲端服務與第三方風險",
    ],
  },
]

export default function ComplianceMatrix() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="compliance"
      className="bg-[#0F1923] py-24"
    >
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-200">
            <Scale className="h-4 w-4" />
            台灣法規對應
          </div>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            把技術修補 ↔ 管理層看得懂的法規條目對齊。
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-gray-400">
            AegisCode Surface 內建中文化法規對應,讓資安修補的每一步都能直接連到法規責任,適合金融、政府與高法遵組織的稽核情境。
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {regulations.map((reg) => (
            <div
              key={reg.title}
              className="rounded-2xl border border-[#243447] bg-[#101B28] p-6"
            >
              <div className="mb-3 flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <h3 className="text-base font-semibold">{reg.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{reg.subtitle}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {reg.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-6 text-gray-300 before:mr-2 before:text-[#5EEAD4] before:content-['•']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          完整法規對應一覽表可在
          <a
            href="/resources"
            className="ml-1 text-[#5EEAD4] hover:underline"
          >
            資源中心
          </a>
          下載。
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/compliance-matrix.tsx
git commit -m "feat: add ComplianceMatrix component for TW law mapping"
```

---

## Task 7: New component `<DualPillars>` (home hero-after dual cards)

**Files:**
- Create: `src/components/dual-pillars.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Code2,
  FileCheck2,
  Globe2,
  KeySquare,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useRef } from "react"

const codeCaps = [
  { icon: ShieldCheck, label: "SAST 弱點掃描" },
  { icon: KeySquare, label: "CBOM / PQC 加密資產" },
  { icon: Layers, label: "SBOM / SCA + 主管審核" },
  { icon: FileCheck2, label: "繁中合規證據包" },
]

const surfaceCaps = [
  { icon: Globe2, label: "外部評分整合" },
  { icon: Sparkles, label: "AI 修補建議 P0–P3" },
  { icon: Scale, label: "台灣法規對應" },
  { icon: FileCheck2, label: "顧問級 CISO 月報" },
]

export default function DualPillars() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-[#0D1521] py-20">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            兩條產品線,一個治理閉環
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-400">
            從內部程式碼到外部攻擊面,AegisCode 讓 CISO 一份報告交代兩面風險。
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Code card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="rounded-2xl border border-[#14B8A6]/30 bg-[#0F1923] p-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-3 py-1 text-xs font-semibold text-[#5EEAD4]">
              <Code2 className="h-3.5 w-3.5" />
              AegisCode Code
            </div>
            <h3 className="text-xl font-bold">內部程式碼資安治理</h3>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              SAST + CBOM/PQC + SBOM/SCA + 主管審核 + 繁中證據包。對象是研發團隊與資安 BU 管理者。
            </p>
            <ul className="mt-6 space-y-3">
              {codeCaps.map((cap) => {
                const Icon = cap.icon
                return (
                  <li
                    key={cap.label}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#14B8A6]/10 text-[#5EEAD4]">
                      <Icon className="h-4 w-4" />
                    </span>
                    {cap.label}
                  </li>
                )
              })}
            </ul>
            <Link
              href="/code"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              看 Code 詳情
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Surface card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="rounded-2xl border border-sky-400/30 bg-[#0F1923] p-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
              <Globe2 className="h-3.5 w-3.5" />
              AegisCode Surface
            </div>
            <h3 className="text-xl font-bold">外部攻擊面治理</h3>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              評分整合 + AI 修補 + 法規對應 + CISO 月報 + 年度顧問訂閱。對象是 CISO 與管理層。
            </p>
            <ul className="mt-6 space-y-3">
              {surfaceCaps.map((cap) => {
                const Icon = cap.icon
                return (
                  <li
                    key={cap.label}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-400/10 text-sky-200">
                      <Icon className="h-4 w-4" />
                    </span>
                    {cap.label}
                  </li>
                )
              })}
            </ul>
            <Link
              href="/surface"
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-sky-400/40 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
            >
              看 Surface 詳情
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/dual-pillars.tsx
git commit -m "feat: add DualPillars hero-after component"
```

---

## Task 8: Navbar with 產品/資源 dropdowns

**Files:**
- Modify: `src/components/navbar.tsx`

- [ ] **Step 1: Replace the entire navbar**

Replace `src/components/navbar.tsx` with:

```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"

type DropdownItem = { label: string; href: string }
type NavItem = { label: string; href?: string; items?: DropdownItem[] }

const navItems: NavItem[] = [
  {
    label: "產品",
    items: [
      { label: "AegisCode Code", href: "/code" },
      { label: "AegisCode Surface", href: "/surface" },
    ],
  },
  { label: "方案", href: "/pricing" },
  {
    label: "資源",
    items: [
      { label: "下載中心", href: "/resources" },
      { label: "ROI 計算", href: "/roi" },
      { label: "常見問題", href: "/#faq" },
    ],
  },
  { label: "POC 申請", href: "/trial" },
]

function Dropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  if (!item.items) {
    return (
      <Link
        href={item.href!}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        {item.label}
      </Link>
    )
  }
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <div className="absolute left-0 top-full pt-2">
          <div className="min-w-[180px] rounded-lg border border-[#243447] bg-[#0F1923] py-2 shadow-lg">
            {item.items.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2332] hover:text-white"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1521]/90 backdrop-blur-md border-b border-[#243447]/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Aegis<span className="text-[#14B8A6]">Code</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Dropdown key={item.label} item={item} />
          ))}
          <Link
            href="/trial"
            className="rounded-lg bg-[#0D9488] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F766E]"
          >
            預約 Demo
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-400 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-b border-[#243447]/50 bg-[#0D1521]/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
            {navItems.flatMap((item) =>
              item.items
                ? item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {sub.label}
                    </Link>
                  ))
                : [
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </Link>,
                  ],
            )}
            <Link
              href="/trial"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-[#0D9488] px-5 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#0F766E]"
            >
              預約 Demo
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
```

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Browse desktop + mobile**

```bash
npm run dev
```

In browser at `http://localhost:3000`:
- Hover `產品` → dropdown shows Code/Surface
- Hover `資源` → dropdown shows 3 items
- Resize to mobile width (< 768px), click hamburger, confirm flat list shows all sub-items

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "feat: navbar with 產品/資源 dropdowns for dual product"
```

---

## Task 9: Home page region restructure

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page imports + body**

Replace `src/app/page.tsx` contents with:

```tsx
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import DualPillars from "@/components/dual-pillars"
import PainPoints from "@/components/pain-points"
import Features from "@/components/features"
import ProductProof from "@/components/product-proof"
import SurfaceSpotlight from "@/components/surface-spotlight"
import ComplianceMatrix from "@/components/compliance-matrix"
import AiHealthCheck from "@/components/ai-health-check"
import Workflow from "@/components/workflow"
import Stats from "@/components/stats"
import Faq from "@/components/faq"
import CtaContact from "@/components/cta-contact"
import Footer from "@/components/footer"

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AegisCode 產品系列",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "AegisCode Code",
        brand: { "@type": "Brand", name: "AegisCode" },
        description:
          "內部程式碼資安治理:SAST 弱點掃描、CBOM/PQC 加密資產盤點、SBOM/SCA、主管審核紀錄與台灣金融合規證據包。",
        category: "Application Security Testing",
        url: "https://aegiscode.yilutek.com/code",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "AegisCode Surface",
        brand: { "@type": "Brand", name: "AegisCode" },
        description:
          "外部攻擊面年度治理服務:評分整合、AI 修補建議、台灣法規對應與顧問級 CISO 月報。",
        category: "External Attack Surface Management",
        url: "https://aegiscode.yilutek.com/surface",
      },
    },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    // Existing 4 entries kept verbatim
    {
      "@type": "Question",
      name: "AegisCode 是否支援地端或 Air-gapped 部署?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enterprise 可規劃地端、私有雲或 Air-gapped 部署,POC 階段會先確認網路、更新與授權限制。",
      },
    },
    {
      "@type": "Question",
      name: "資料留存政策與 ZDR 選項是什麼?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AegisCode 可依合約調整資料留存週期,並針對高法遵組織規劃 Zero Data Retention 評估流程。",
      },
    },
    {
      "@type": "Question",
      name: "AegisCode 與 SonarQube Enterprise 差異在哪?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AegisCode 聚焦繁中治理工作流、CBOM/PQC 加密資產盤點、主管審核紀錄與台灣金融合規證據包。",
      },
    },
    {
      "@type": "Question",
      name: "是否支援 SSO、SAML 或 OIDC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enterprise 支援 SSO 整合規劃,可依客戶 IdP 環境評估 SAML 或 OIDC。",
      },
    },
    // 5 new entries added for Surface
    {
      "@type": "Question",
      name: "AegisCode Surface 跟 SecurityScorecard 原生 dashboard 差在哪?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Surface 提供中文化治理工作流、修補優先順序、台灣法規對應、風險量化與顧問交付報告;原生 dashboard 是原始評分視圖。",
      },
    },
    {
      "@type": "Question",
      name: "Surface 需要客戶自備 SecurityScorecard 授權嗎?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "是,客戶提供 API token。Surface 也支援 BitSight 或客戶既有 EASM 工具的訊號整合。",
      },
    },
    {
      "@type": "Question",
      name: "CISO 月報長什麼樣?可以看 sample 嗎?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可,到 /resources 下載匿名化的 sample PDF。",
      },
    },
    {
      "@type": "Question",
      name: "Surface 是訂閱還是專案?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Surface 是年度顧問訂閱,含平台、每週差異追蹤、每月治理報告、季度治理檢討與顧問解讀會議。",
      },
    },
    {
      "@type": "Question",
      name: "Code 跟 Surface 可以單買嗎?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可單買,合購有 bundle 折讓。實際數字會在 POC 後依範圍報價。",
      },
    },
  ],
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <Hero />
      <DualPillars />
      <PainPoints />
      <Features />
      <ProductProof />
      <SurfaceSpotlight />
      <ComplianceMatrix />
      <AiHealthCheck />
      <Workflow />
      <Stats />
      <Faq />
      <CtaContact />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Verify lint + typecheck + build**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] **Step 3: Browse home page**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm region order top-to-bottom: Hero → DualPillars (NEW) → PainPoints → Features → ProductProof → SurfaceSpotlight → ComplianceMatrix (NEW) → AiHealthCheck → Workflow → Stats → FAQ → CtaContact → Footer. View source and confirm JSON-LD has `@type: "ItemList"` with 2 sub-Products. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: home page dual-product layout with DualPillars + ComplianceMatrix"
```

---

## Task 10: PainPoints +2 CISO entries

**Files:**
- Modify: `src/components/pain-points.tsx`

- [ ] **Step 1: Read current file**

```bash
# Just to refresh context; no command needed for the human reader
```

Read `src/components/pain-points.tsx` and locate the `painPoints` array (or equivalent). Add two entries:

```ts
{
  // CISO pain #1
  title: "外部曝險每月不知道有沒有下降",
  desc: "SecurityScorecard 或 BitSight 評分上下,但沒有人能說清楚是哪些 domain 在退步,也沒有可以呈交董事會的趨勢報告。",
}
```

```ts
{
  // CISO pain #2
  title: "內部弱點 + 外部評分 + 供應鏈,各自為政",
  desc: "三個 dashboard,三套 report 格式,管理層想看一份「整體資安狀態」永遠拼不出來。",
}
```

Insert after the existing pain points so the order is `existing → +CISO 1 → +CISO 2`.

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Browse to confirm**

```bash
npm run dev
```

At `http://localhost:3000`, scroll to PainPoints section. Confirm 2 new cards visible after the existing ones. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/pain-points.tsx
git commit -m "feat: pain-points add 2 CISO-level pain entries"
```

---

## Task 11: FAQ +5 Surface entries

**Files:**
- Modify: `src/components/faq.tsx`

- [ ] **Step 1: Append 5 entries to the `faqs` array**

In `src/components/faq.tsx`, append at the end of the `faqs` array (before the closing `]`):

```ts
{
  q: "AegisCode Surface 跟 SecurityScorecard 原生 dashboard 差在哪?",
  a: "Surface 提供中文化治理工作流、修補優先順序、台灣法規對應、風險量化與顧問交付報告;原生 dashboard 是原始評分視圖。",
},
{
  q: "Surface 需要客戶自備 SecurityScorecard 授權嗎?",
  a: "是,客戶提供 API token。Surface 也支援 BitSight 或客戶既有 EASM 工具的訊號整合。",
},
{
  q: "CISO 月報長什麼樣?可以看 sample 嗎?",
  a: "可以,到資源中心 /resources 下載匿名化的 sample PDF。",
},
{
  q: "AegisCode Surface 是訂閱還是專案?",
  a: "Surface 是年度顧問訂閱,含平台、每週差異追蹤、每月治理報告、季度治理檢討與顧問解讀會議。",
},
{
  q: "Code 跟 Surface 可以單買嗎?",
  a: "可單買,合購有 bundle 折讓。實際數字會在 POC 後依範圍報價。",
},
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Browse FAQ**

`npm run dev` → `http://localhost:3000/#faq`. Expand the new entries. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/faq.tsx
git commit -m "feat: faq add 5 Surface-related entries"
```

---

## Task 12: CtaContact dual CTA

**Files:**
- Modify: `src/components/cta-contact.tsx`

- [ ] **Step 1: Open the file and read its current structure**

Read `src/components/cta-contact.tsx`. Identify the existing primary CTA `<a>` or `<Link>`.

- [ ] **Step 2: Replace single CTA with dual CTAs**

Where the single CTA currently lives, replace with:

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
  <Link
    href="/trial?track=CODE"
    className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
  >
    申請 Code POC
  </Link>
  <Link
    href="/trial?track=SURFACE"
    className="inline-flex items-center justify-center rounded-lg border border-sky-400/40 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
  >
    預約 Surface 諮詢
  </Link>
</div>
```

Make sure `Link` from `next/link` is imported. If existing imports are `<a href>`, keep that style for consistency — but use the same dual-button pattern.

- [ ] **Step 3: Verify**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 4: Browse to confirm**

`npm run dev` → home page bottom. Two CTAs visible, side-by-side on desktop, stacked on mobile.

- [ ] **Step 5: Commit**

```bash
git add src/components/cta-contact.tsx
git commit -m "feat: cta-contact dual CTA for Code POC and Surface consult"
```

---

## Task 13: `/pricing` dual-card restructure

**Files:**
- Modify: `src/app/pricing/page.tsx`

- [ ] **Step 1: Replace the entire pricing page**

Replace `src/app/pricing/page.tsx` contents with:

```tsx
import Link from "next/link"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const codeTracks = [
  {
    name: "Starter",
    desc: "適合小型研發團隊用 30 天 POC 驗證 SAST 工作流與 AI 程式碼健檢。",
  },
  {
    name: "Professional",
    desc: "適合多 BU 研發組織導入 SAST-in-the-Loop、繁中治理流程與主管審核紀錄。",
  },
  {
    name: "Enterprise",
    desc: "適合金融業與高法遵組織評估 CBOM/PQC、SBOM/SCA、SSO 與稽核證據包。",
  },
]

const surfaceTracks = [
  {
    name: "基礎",
    desc: "適合首次導入外部攻擊面治理的資安主管,涵蓋核心 Domain 集合與基礎月報。",
  },
  {
    name: "進階",
    desc: "適合 CISO 年度治理使用,完整週差異、月報、季度治理檢討與顧問會議。",
  },
  {
    name: "企業",
    desc: "適合大型集團或金控,多 BU、多 Portfolio、客製化合規對應與管理層儀表板。",
  },
]

const pocItems = [
  "SAST findings 與 AI 修復建議展示",
  "CBOM/PQC 加密資產盤點 Demo",
  "外部評分整合視圖 + Domain 治理樣本",
  "首份 CISO 月報草稿 + 法規對應交付",
  "部署、SSO、資料留存與 DPA 需求盤點",
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-sm font-medium text-[#14B8A6]">
              <ShieldCheck className="h-4 w-4" />
              方案資訊依範圍報價
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              兩種購買路徑,對應不同治理需求
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              AegisCode Code 採平台授權 + 30 天 POC 後報價;AegisCode Surface 採年度顧問訂閱模式,報價依範圍而定。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Code card */}
            <div className="rounded-2xl border border-[#14B8A6]/30 bg-[#0F1923] p-8">
              <h2 className="mb-2 text-2xl font-bold">
                AegisCode Code · 平台授權
              </h2>
              <p className="text-sm text-gray-400">
                內部程式碼資安治理:SAST + CBOM/PQC + SBOM/SCA + 主管審核
              </p>
              <div className="mt-5 space-y-3">
                {codeTracks.map((track) => (
                  <div
                    key={track.name}
                    className="rounded-xl border border-[#243447] bg-[#1A2332] p-4"
                  >
                    <h3 className="font-semibold">{track.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {track.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-500">
                POC 後報價 · 30 天免費評估
              </div>
              <Link
                href="/trial?track=CODE"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
              >
                預約 Code POC
              </Link>
            </div>

            {/* Surface card */}
            <div className="rounded-2xl border border-sky-400/30 bg-[#0F1923] p-8">
              <h2 className="mb-2 text-2xl font-bold">
                AegisCode Surface · 顧問訂閱
              </h2>
              <p className="text-sm text-gray-400">
                外部攻擊面治理:評分整合 + AI 修補 + 法規對應 + CISO 月報
              </p>
              <div className="mt-5 space-y-3">
                {surfaceTracks.map((track) => (
                  <div
                    key={track.name}
                    className="rounded-xl border border-[#243447] bg-[#1A2332] p-4"
                  >
                    <h3 className="font-semibold">{track.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {track.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-500">
                年度訂閱 · 報價依範圍而定
              </div>
              <Link
                href="/trial?track=SURFACE"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-sky-400/40 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
              >
                預約 Surface 諮詢
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-[#14B8A6]" />
              30 天 POC 共同評估內容
            </h2>
            <div className="grid gap-3 text-sm text-gray-300 md:grid-cols-2">
              {pocItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <Link
              href="/resources"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#5EEAD4] hover:underline"
            >
              先看 Surface 服務說明書與 CISO 月報 sample →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run guard:public-pricing
```
Expected: guard passes (no specific dollar amounts).

- [ ] **Step 3: Browse**

`npm run dev` → `/pricing`. Both cards visible, dual CTAs at bottom of each. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/pricing/page.tsx
git commit -m "feat: pricing page dual-card restructure for Code and Surface"
```

---

## Task 14: `/api/trial/signup` extend with `track` + Surface fields

**Files:**
- Modify: `src/app/api/trial/signup/route.ts`

- [ ] **Step 1: Update the `TrialSignupBody` interface**

In `src/app/api/trial/signup/route.ts`, replace the `TrialSignupBody` interface with:

```ts
interface TrialSignupBody {
  companyName?: string
  contactEmail?: string
  contactPhone?: string
  tier?: "STARTER" | "PROFESSIONAL"
  teamSize?: string | number
  // New: which AegisCode product line the lead is evaluating.
  // CODE = SAST/CBOM platform (the legacy default). SURFACE/BOTH go to
  // sales for manual handling — Surface is annual consulting, not a JWT.
  track?: "CODE" | "SURFACE" | "BOTH"
  // Surface-specific fields (optional, but expected when track !== CODE)
  domainCount?: string | number
  hasExternalRating?: boolean
  monthlyReportEta?: string
  decisionMaker?: string
  // Honeypot — must be empty.
  website?: string
}
```

- [ ] **Step 2: Parse `track` after the email validation block**

After the `if (!contactEmail || ...)` validation block (around line 78), add:

```ts
const track: "CODE" | "SURFACE" | "BOTH" =
  body.track === "SURFACE"
    ? "SURFACE"
    : body.track === "BOTH"
      ? "BOTH"
      : "CODE"
```

- [ ] **Step 3: Force Surface/Both into manual review path**

Replace the line `if (!canAutoIssueTrialLicense()) {` with:

```ts
// Surface and Both are advisory subscriptions — they never get an
// auto-issued JWT, regardless of storage backend. CODE keeps the
// existing auto-issue behavior when durable storage is configured.
const forceManual = track !== "CODE"
if (forceManual || !canAutoIssueTrialLicense()) {
```

- [ ] **Step 4: Extend the manual-review payload to include track-specific context**

Inside the now-expanded manual-review branch, replace the `notifyOps` call with:

```ts
await notifyOps("TRIAL_SIGNUP", {
  companyName,
  customerEmail: contactEmail,
  contactPhone: body.contactPhone,
  teamSize: body.teamSize,
  tier,
  track,
  domainCount: body.domainCount,
  hasExternalRating: body.hasExternalRating,
  monthlyReportEta: body.monthlyReportEta,
  decisionMaker: body.decisionMaker,
  fulfillment: "manual",
  storageBackend: storage.backend,
  reason:
    track === "CODE"
      ? "Durable storage is not configured; auto license issuance paused."
      : track === "SURFACE"
        ? "Surface is an advisory subscription; sales must qualify before issuing access."
        : "Both Code and Surface evaluation; sales must qualify and scope before issuance.",
})
```

And replace the `recordAudit` call in the same branch with:

```ts
await recordAudit({
  action: "TRIAL_SIGNUP",
  customerName: companyName,
  customerEmail: contactEmail,
  tier,
  track,
  fulfillment: "manual",
  storageBackend: storage.backend,
  adminIp: adminCallerIp(req),
})
```

Replace the manual-review response JSON with track-aware instructions:

```ts
return Response.json(
  {
    ok: true,
    manualReview: true,
    track,
    instructions:
      track === "CODE"
        ? "POC request received. AegisCode sales will contact you to schedule the demo and issue an evaluation license after environment readiness is confirmed."
        : track === "SURFACE"
          ? "Surface 諮詢申請已建立。顧問會在 1-2 個工作天內聯繫,先確認 Domain 規模、現有評分授權與時程。"
          : "已收到 Code + Surface 雙產品評估申請。顧問會聯繫您安排合併評估流程。",
  },
  { status: 202 },
)
```

- [ ] **Step 5: Extend audit log on auto-issue path too**

In the auto-issue branch (further down), add `track` to the `recordAudit` call near line 180:

```ts
await recordAudit({
  action: "TRIAL_SIGNUP",
  licenseId: record.licenseId,
  customerName: companyName,
  customerEmail: contactEmail,
  tier,
  track, // <-- add this line
  expiresAt: record.expiresAt,
  adminIp: adminCallerIp(req),
})
```

And add `track` to the `notifyOps` call near line 208:

```ts
await notifyOps("TRIAL_SIGNUP", {
  licenseId: record.licenseId,
  companyName,
  customerEmail: contactEmail,
  contactPhone: body.contactPhone,
  teamSize: body.teamSize,
  tier,
  track, // <-- add this line
  expiresAt: record.expiresAt,
})
```

- [ ] **Step 6: Verify type check + build**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If `recordAudit` / `notifyOps` types complain about the new `track` field, check `src/lib/audit-log.ts` and `src/lib/notify-sales.ts`. They likely accept arbitrary record-shaped data (Record<string, unknown>); if they have a strict type for the payload, update those types to allow an optional `track?: string` field. **Do not** narrow other fields.

- [ ] **Step 7: Manual API smoke test**

```bash
npm run dev
```

In another shell:
```bash
# Test CODE track (default behavior, should match before changes)
curl -sS -X POST http://localhost:3000/api/trial/signup \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Co","contactEmail":"test+code@example.com","track":"CODE","teamSize":"10"}' \
  | head -c 500

# Test SURFACE track (should always go manual-review with Surface instructions)
curl -sS -X POST http://localhost:3000/api/trial/signup \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Co","contactEmail":"test+surface@example.com","track":"SURFACE","domainCount":50,"hasExternalRating":true,"monthlyReportEta":"4 weeks"}' \
  | head -c 500

# Test BOTH track
curl -sS -X POST http://localhost:3000/api/trial/signup \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Co","contactEmail":"test+both@example.com","track":"BOTH","decisionMaker":"CISO","teamSize":"50","domainCount":100}' \
  | head -c 500
```

Expected (Surface):
```json
{"ok":true,"manualReview":true,"track":"SURFACE","instructions":"Surface 諮詢申請已建立。..."}
```

Expected (Both):
```json
{"ok":true,"manualReview":true,"track":"BOTH","instructions":"已收到 Code + Surface 雙產品評估申請。..."}
```

CODE behavior depends on whether durable storage is configured; in local dev it'll usually go manual-review with the existing english instructions.

Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/trial/signup/route.ts src/lib/audit-log.ts src/lib/notify-sales.ts
# (only add the lib files if you needed to widen their types in step 6)
git commit -m "feat(api): trial signup accepts track and Surface fields"
```

---

## Task 15: `/trial` form three-track segmentation

**Files:**
- Modify: `src/app/trial/page.tsx`

- [ ] **Step 1: Update initial track from URL search params**

In `src/app/trial/page.tsx`'s `TrialForm()` function, change the params line:

```ts
const initialTrack: "CODE" | "SURFACE" | "BOTH" = (() => {
  const p = params.get("track")
  if (p === "SURFACE") return "SURFACE"
  if (p === "BOTH") return "BOTH"
  return "CODE"
})()

const initialTier =
  params.get("tier") === "STARTER" ? "STARTER" : "PROFESSIONAL"
```

- [ ] **Step 2: Add state for track and Surface fields**

After the existing `useState` calls, add:

```ts
const [track, setTrack] = useState<"CODE" | "SURFACE" | "BOTH">(initialTrack)
const [domainCount, setDomainCount] = useState("")
const [hasExternalRating, setHasExternalRating] = useState<"yes" | "no" | "">("")
const [monthlyReportEta, setMonthlyReportEta] = useState<"2-weeks" | "4-weeks" | "8-weeks" | "">("")
const [decisionMaker, setDecisionMaker] = useState<"management" | "engineering" | "procurement" | "">("")
```

- [ ] **Step 3: Update `onSubmit` to include new fields**

In the `fetch` body, change:
```ts
body: JSON.stringify({
  companyName,
  contactEmail,
  contactPhone,
  tier,
  teamSize,
  website,
  // new fields:
  track,
  domainCount: track !== "CODE" ? domainCount : undefined,
  hasExternalRating:
    track !== "CODE" ? hasExternalRating === "yes" : undefined,
  monthlyReportEta:
    track !== "CODE" ? monthlyReportEta || undefined : undefined,
  decisionMaker: track === "BOTH" ? decisionMaker || undefined : undefined,
}),
```

- [ ] **Step 4: Add the track radio + conditional fields above the existing fields**

Right after the error banner (`result?.ok === false ? ...`) inside the `<form>`, insert:

```tsx
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
```

- [ ] **Step 5: Make Tier dropdown conditional (Code only)**

Wrap the existing tier `<div>` (the one with `<label>` 評估方向 — yes, the LEGACY label uses the same Chinese text; rename it to avoid collision):

Find:
```tsx
<div>
  <label className="block text-sm text-gray-300 mb-1">
    評估方向 / Evaluation track
  </label>
  <select
    value={tier}
    onChange={(e) =>
      setTier(e.target.value as "STARTER" | "PROFESSIONAL")
    }
    ...
```

Replace with:
```tsx
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
```

- [ ] **Step 6: Make `teamSize` field conditional (Code/Both only)**

Wrap the existing `<Field label="團隊規模 ..." />` line:

```tsx
{track === "CODE" || track === "BOTH" ? (
  <Field
    label="團隊規模 / Team size estimate"
    value={teamSize}
    onChange={setTeamSize}
    placeholder="例如:25 developers"
  />
) : null}
```

- [ ] **Step 7: Add Surface-specific fields**

After the `teamSize` block (still inside the form), add:

```tsx
{track === "SURFACE" || track === "BOTH" ? (
  <>
    <Field
      label="管理的 Domain / Portfolio 規模"
      value={domainCount}
      onChange={setDomainCount}
      placeholder="例如:50 個 domain"
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
```

- [ ] **Step 8: Update submit button label conditionally**

Replace the submit button label `送出 30 天 POC 申請` with:

```tsx
{submitting
  ? "送出中..."
  : track === "SURFACE"
    ? "送出 Surface 諮詢申請"
    : track === "BOTH"
      ? "送出雙產品評估申請"
      : "送出 30 天 POC 申請"}
```

- [ ] **Step 9: Update page header copy to reflect track**

In the `TrialPage()` outer return (the h1 + p), wrap them in a small client component or pass via a prop. Easiest: leave the static title `預約 Demo` and adjust the subtitle inside `TrialForm()` if you want. For simplicity, **leave the outer header as-is**; the form already conveys track via the radio.

- [ ] **Step 10: Verify**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] **Step 11: Browse all three tracks**

```bash
npm run dev
```

- `http://localhost:3000/trial?track=CODE` — Tier + team size visible; domain/rating/eta hidden; submit label "送出 30 天 POC 申請"
- `http://localhost:3000/trial?track=SURFACE` — Tier + team size hidden; domain + rating + eta visible; submit label "送出 Surface 諮詢申請"
- `http://localhost:3000/trial?track=BOTH` — Everything visible + 主要驅動方 (required); submit label "送出雙產品評估申請"

Submit the SURFACE form with valid data; confirm browser network tab shows `track: "SURFACE"` in request body and `manualReview: true` in response.

Stop dev server.

- [ ] **Step 12: Commit**

```bash
git add src/app/trial/page.tsx
git commit -m "feat: trial form three-track segmentation with conditional fields"
```

---

## Task 16: `/trial` success screen Surface/Both variant

**Files:**
- Modify: `src/app/trial/page.tsx`

- [ ] **Step 1: Branch the success screen on `result.track`**

In the success state block (`if (result?.ok) { return ...`), replace it with:

```tsx
if (result?.ok) {
  const isAdvisory = !result.licenseId
  return (
    <div className="max-w-xl mx-auto bg-[#1A2332] border border-[#0D9488] rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-3 text-[#14B8A6]">
        {isAdvisory ? "諮詢申請已建立" : "POC 申請已建立"}
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
          {isAdvisory
            ? "我們已收到您的需求。在此期間,您可以先在資源中心下載服務說明書與 CISO 月報 sample,讓內部相關人員先建立共識。"
            : "我們已收到申請,顧問會先確認 Demo 情境、部署條件與資料留存需求,再提供評估授權。"}
        </div>
      )}
      {isAdvisory ? (
        <a
          href="/resources"
          className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
        >
          順手下載服務說明書 →
        </a>
      ) : null}
      {result.jwt ? (
        <div className="mt-4">
          <p className="text-xs text-yellow-400 mb-2">
            Email service 尚未設定,請將下方 JWT 放入{" "}
            <code>AegisCode/config/license.jwt</code>,或聯絡
            sales@aegiscode.com 協助啟用。
          </p>
          <pre className="bg-[#0D1521] border border-[#243447] rounded p-3 text-xs text-emerald-300 break-all whitespace-pre-wrap">
            {result.jwt}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
```

Also extend the `result` state type to include the new field at the top of `TrialForm()`:

```ts
const [result, setResult] = useState<
  | null
  | {
      ok: true
      licenseId?: string
      expiresAt?: string
      instructions: string
      manualReview?: boolean
      jwt?: string
      track?: "CODE" | "SURFACE" | "BOTH"
    }
  | { ok: false; error: string }
>(null)
```

And in the success-path of `onSubmit`, add `track: data.track as ...`:

```ts
setResult({
  ok: true,
  licenseId: data.licenseId as string | undefined,
  expiresAt: data.expiresAt as string | undefined,
  instructions: data.instructions as string,
  manualReview: data.manualReview as boolean | undefined,
  jwt: data.jwt as string | undefined,
  track: data.track as "CODE" | "SURFACE" | "BOTH" | undefined,
})
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] **Step 3: Browse and submit Surface form**

`npm run dev` → submit a Surface form. Confirm success screen shows:
- Title "諮詢申請已建立" (not "POC 申請已建立")
- No License ID block
- Pointer to `/resources` for download

Submit a CODE form. Confirm success screen still shows POC-style content.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/trial/page.tsx
git commit -m "feat: trial success screen Surface/Both advisory variant"
```

---

## Task 17: New lib `lib/download-sign.ts` HMAC token + node test

**Files:**
- Create: `src/lib/download-sign.ts`
- Create: `tests/download-sign.test.mjs`
- Modify: `package.json` (add `test:lib` script)

**Why:** Lead-gated PDF endpoints need short-lived signed URLs. The HMAC logic must be precise; using Node's built-in `node --test` runner keeps the verification rigorous without adding a test framework.

- [ ] **Step 1: Write the failing test first**

Create `tests/download-sign.test.mjs`:

```js
import { test } from "node:test"
import assert from "node:assert/strict"
import { signDownload, verifyDownload } from "../src/lib/download-sign.ts"

const SECRET = "test-secret-12345-not-for-prod"

test("signed token round-trips and verifies", () => {
  const exp = Math.floor(Date.now() / 1000) + 60 // 1 minute future
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp,
    token,
    secret: SECRET,
  })
  assert.equal(ok, true)
})

test("verification fails for tampered assetId", () => {
  const exp = Math.floor(Date.now() / 1000) + 60
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "different.pdf",
    exp,
    token,
    secret: SECRET,
  })
  assert.equal(ok, false)
})

test("verification fails for tampered exp", () => {
  const exp = Math.floor(Date.now() / 1000) + 60
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp: exp + 1,
    token,
    secret: SECRET,
  })
  assert.equal(ok, false)
})

test("verification fails after expiry", () => {
  const exp = Math.floor(Date.now() / 1000) - 1 // already expired
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp,
    token,
    secret: SECRET,
  })
  assert.equal(ok, false)
})

test("verification uses timing-safe comparison", () => {
  // Just confirm that a known-bad token of correct length fails.
  const exp = Math.floor(Date.now() / 1000) + 60
  const good = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const bad = "0".repeat(good.length)
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp,
    token: bad,
    secret: SECRET,
  })
  assert.equal(ok, false)
})
```

- [ ] **Step 2: Install tsx and add the test:lib script**

`tsx` is NOT currently in this project's devDependencies (it is used in the sibling WT-Sonaqu project, not this one). Install it:

```bash
npm install -D tsx@^4
```

In `package.json` `scripts` section, add:

```json
"test:lib": "node --import tsx --test tests/**/*.test.mjs"
```

- [ ] **Step 3: Run the test to confirm it fails**

```bash
npm run test:lib
```
Expected: fails with `Cannot find module '../src/lib/download-sign.ts'` or similar.

- [ ] **Step 4: Implement the minimal sign/verify lib**

Create `src/lib/download-sign.ts`:

```ts
import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Signed download tokens for /resources lead-gated PDFs.
 *
 * Token format: hex-encoded HMAC-SHA256 of `${assetId}|${exp}` using the
 * server's signing secret. Short-lived (5 min default). Caller passes the
 * raw (assetId, exp, token) tuple in the query string; we recompute and
 * timing-safe compare.
 */

interface SignInput {
  assetId: string
  exp: number // unix seconds
  secret: string
}

interface VerifyInput extends SignInput {
  token: string
}

export function signDownload({ assetId, exp, secret }: SignInput): string {
  const hmac = createHmac("sha256", secret)
  hmac.update(`${assetId}|${exp}`)
  return hmac.digest("hex")
}

export function verifyDownload({
  assetId,
  exp,
  token,
  secret,
}: VerifyInput): boolean {
  const now = Math.floor(Date.now() / 1000)
  if (exp < now) return false
  const expected = signDownload({ assetId, exp, secret })
  if (expected.length !== token.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token))
  } catch {
    return false
  }
}

export function getDownloadSecret(): string {
  // Prefer a dedicated secret, fall back to ADMIN_TOKEN (already a secret
  // the deploy has). In production both should be set; the fallback exists
  // so local dev doesn't need an additional env var.
  const secret =
    process.env.DOWNLOAD_SIGNING_SECRET || process.env.ADMIN_TOKEN
  if (!secret) {
    throw new Error(
      "DOWNLOAD_SIGNING_SECRET (or ADMIN_TOKEN) must be set to sign resource downloads",
    )
  }
  return secret
}
```

- [ ] **Step 5: Run the test to confirm it passes**

```bash
npm run test:lib
```
Expected: all 5 tests pass.

- [ ] **Step 6: Lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/download-sign.ts tests/download-sign.test.mjs package.json package-lock.json
git commit -m "feat(lib): add HMAC download-sign with node --test coverage"
```

---

## Task 18: New `POST /api/resources/download` (lead capture + signed URL)

**Files:**
- Create: `src/app/api/resources/download/route.ts`

- [ ] **Step 1: Create the route**

Create `src/app/api/resources/download/route.ts`:

```ts
import { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { recordAudit, adminCallerIp } from "@/lib/audit-log"
import { notifyOps } from "@/lib/notify-sales"
import { signDownload, getDownloadSecret } from "@/lib/download-sign"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface DownloadBody {
  assetId?: string
  contactEmail?: string
  companyName?: string
  contactPhone?: string
  website?: string // honeypot
}

const ALLOWED_ASSETS = new Set([
  "surface-proposal.pdf",
  "ciso-monthly-sample.pdf",
])

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const TOKEN_LIFETIME_SECONDS = 5 * 60

function rateLimitResponse(retryAfter: number): Response {
  return Response.json(
    { error: "Rate limit exceeded", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = await rateLimit(
    req,
    "resource-download",
    3,
    60 * 60 * 1000,
  )
  if (!rl.ok) return rateLimitResponse(rl.retryAfter)

  let body: DownloadBody
  try {
    body = (await req.json()) as DownloadBody
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Honeypot
  if (body.website && body.website.trim() !== "") {
    return Response.json({ ok: true })
  }

  const assetId = body.assetId?.trim()
  const contactEmail = body.contactEmail?.trim().toLowerCase()
  const companyName = body.companyName?.trim()

  if (!assetId || !ALLOWED_ASSETS.has(assetId)) {
    return Response.json(
      { error: "Unknown assetId" },
      { status: 400 },
    )
  }
  if (!contactEmail || !EMAIL_RE.test(contactEmail) || contactEmail.length > 200) {
    return Response.json(
      { error: "Valid contactEmail required" },
      { status: 400 },
    )
  }
  if (!companyName || companyName.length > 200) {
    return Response.json(
      { error: "companyName is required (max 200 chars)" },
      { status: 400 },
    )
  }

  let secret: string
  try {
    secret = getDownloadSecret()
  } catch {
    return Response.json(
      {
        error:
          "Resource downloads are not yet configured — please contact sales@aegiscode.com.",
      },
      { status: 503 },
    )
  }

  const exp = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS
  const token = signDownload({ assetId, exp, secret })

  await recordAudit({
    action: "RESOURCE_DOWNLOAD",
    assetId,
    customerName: companyName,
    customerEmail: contactEmail,
    adminIp: adminCallerIp(req),
  })
  await notifyOps("RESOURCE_DOWNLOAD", {
    assetId,
    companyName,
    customerEmail: contactEmail,
    contactPhone: body.contactPhone,
  })

  // Caller is expected to GET the file URL; token is hex.
  const url = `/api/resources/file/${assetId}?exp=${exp}&token=${token}`
  return Response.json(
    {
      ok: true,
      assetId,
      url,
      expiresInSeconds: TOKEN_LIFETIME_SECONDS,
    },
    { status: 201 },
  )
}
```

- [ ] **Step 2: Verify type + lint**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Manual smoke**

```bash
npm run dev
```

```bash
# Honeypot pass (returns ok)
curl -sS -X POST http://localhost:3000/api/resources/download \
  -H "Content-Type: application/json" \
  -d '{"assetId":"surface-proposal.pdf","contactEmail":"a@b.co","companyName":"X","website":"botfilled"}'

# Bad assetId
curl -sS -X POST http://localhost:3000/api/resources/download \
  -H "Content-Type: application/json" \
  -d '{"assetId":"hack","contactEmail":"a@b.co","companyName":"X"}'
# Expected: {"error":"Unknown assetId"}

# Good call
curl -sS -X POST http://localhost:3000/api/resources/download \
  -H "Content-Type: application/json" \
  -d '{"assetId":"surface-proposal.pdf","contactEmail":"good@example.com","companyName":"Real Co"}'
# Expected: {"ok":true,"assetId":"surface-proposal.pdf","url":"/api/resources/file/surface-proposal.pdf?exp=...&token=...","expiresInSeconds":300}
```

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/resources/download/route.ts
git commit -m "feat(api): POST /api/resources/download with lead capture and signed URL"
```

---

## Task 19: New `GET /api/resources/file/[assetId]` (HMAC verify + stream PDF)

**Files:**
- Create: `src/app/api/resources/file/[assetId]/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextRequest } from "next/server"
import { readFile, stat } from "node:fs/promises"
import { join, resolve, sep } from "node:path"
import { verifyDownload, getDownloadSecret } from "@/lib/download-sign"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOWED_ASSETS = new Set([
  "surface-proposal.pdf",
  "ciso-monthly-sample.pdf",
])

const DOWNLOADS_DIR = resolve(process.cwd(), "public", "downloads")

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ assetId: string }> },
): Promise<Response> {
  const { assetId: rawAssetId } = await context.params
  const assetId = rawAssetId.trim()

  if (!ALLOWED_ASSETS.has(assetId)) {
    return Response.json({ error: "Unknown assetId" }, { status: 404 })
  }

  const url = new URL(req.url)
  const expStr = url.searchParams.get("exp")
  const token = url.searchParams.get("token")

  if (!expStr || !token) {
    return Response.json({ error: "Missing exp or token" }, { status: 400 })
  }
  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp)) {
    return Response.json({ error: "Bad exp" }, { status: 400 })
  }

  let secret: string
  try {
    secret = getDownloadSecret()
  } catch {
    return Response.json(
      { error: "Downloads not configured" },
      { status: 503 },
    )
  }

  if (!verifyDownload({ assetId, exp, token, secret })) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    )
  }

  // Defense in depth: never read outside the downloads dir even though
  // ALLOWED_ASSETS already constrains the input.
  const filePath = resolve(DOWNLOADS_DIR, assetId)
  if (!filePath.startsWith(DOWNLOADS_DIR + sep)) {
    return Response.json({ error: "Path traversal blocked" }, { status: 400 })
  }

  let info
  try {
    info = await stat(filePath)
  } catch {
    return Response.json(
      {
        error:
          "Asset file is not yet deployed. Please contact sales@aegiscode.com.",
      },
      { status: 404 },
    )
  }

  if (!info.isFile()) {
    return Response.json({ error: "Asset is not a file" }, { status: 404 })
  }

  const buf = await readFile(filePath)
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${assetId}"`,
      "Content-Length": String(buf.byteLength),
      "Cache-Control": "private, no-store",
    },
  })
}
```

Note: the `join` import is unused; remove it if lint complains.

- [ ] **Step 2: Verify lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Manual smoke (without a real PDF file)**

Put a dummy PDF into `public/downloads/` for local testing:

```bash
# Generate a tiny placeholder PDF
printf '%%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n' > public/downloads/surface-proposal.pdf
```

Then:
```bash
npm run dev
```

In another shell:
```bash
# Get signed URL
RESP=$(curl -sS -X POST http://localhost:3000/api/resources/download \
  -H "Content-Type: application/json" \
  -d '{"assetId":"surface-proposal.pdf","contactEmail":"test@example.com","companyName":"Test"}')
echo "$RESP"

# Extract URL and fetch it
URL=$(echo "$RESP" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{console.log(JSON.parse(s).url)})")
curl -sSI "http://localhost:3000${URL}"
# Expected: HTTP/1.1 200 OK, Content-Type: application/pdf

# Tamper the token
TAMPERED="${URL/token=*/token=ffffff}"
curl -sS -o /dev/null -w "%{http_code}\n" "http://localhost:3000${TAMPERED}"
# Expected: 401
```

Clean up the dummy PDF (it should NOT be committed):
```bash
rm public/downloads/surface-proposal.pdf
```

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/resources/file
git commit -m "feat(api): GET /api/resources/file/[assetId] verifies HMAC and streams PDF"
```

---

## Task 20: `/resources` page with 3 asset cards + download modal

**Files:**
- Create: `src/app/resources/page.tsx`

- [ ] **Step 1: Create the page (client component)**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, FileText, Scale, Sparkles, X } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Asset {
  id: string
  publicHref?: string // when set, asset is public — no gating
  title: string
  desc: string
  bullets: string[]
  readTime: string
  icon: typeof FileText
}

const assets: Asset[] = [
  {
    id: "surface-proposal.pdf",
    title: "AegisCode Surface 服務說明書",
    desc: "完整年度顧問訂閱方案、交付物、客戶責任與簽約流程,可作為 RFP / 內部簡報附件。",
    bullets: [
      "年度服務範圍與交付節奏",
      "三層方案差異與適用情境",
      "簽約啟動到首份月報的時程",
    ],
    readTime: "10 分鐘讀完",
    icon: FileText,
  },
  {
    id: "ciso-monthly-sample.pdf",
    title: "CISO 月報 sample(匿名化)",
    desc: "真實顧客月報的匿名化版本,讓 CISO 在簽約前先看到「我們交付什麼」。",
    bullets: [
      "風險量化、趨勢與 Top Backlog",
      "台灣法規對應條目",
      "修補 ROI 與工時估算",
    ],
    readTime: "12 分鐘讀完",
    icon: Sparkles,
  },
  {
    id: "tw-compliance-matrix.pdf",
    publicHref: "/downloads/tw-compliance-matrix.pdf",
    title: "台灣法規對應一覽表",
    desc: "資通安全管理法 × 個資法 × ISO 27001:2022,AegisCode 對應條目的一頁速查表。",
    bullets: [
      "三條法規並列對照",
      "可貼進稽核準備文件",
      "持續更新,公開索引",
    ],
    readTime: "3 分鐘讀完",
    icon: Scale,
  },
]

function DownloadModal({
  asset,
  onClose,
}: {
  asset: Asset
  onClose: () => void
}) {
  const [companyName, setCompanyName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          contactEmail,
          companyName,
        }),
      })
      const data = (await r.json()) as Record<string, unknown>
      if (!r.ok) {
        setError((data.error as string) || `Request failed (${r.status})`)
      } else {
        setDownloadUrl(data.url as string)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold">{asset.title}</h2>
        <p className="mt-2 text-sm text-gray-400">
          填寫聯絡資訊,系統會即時產生 5 分鐘內可下載的連結。
        </p>
        {downloadUrl ? (
          <div className="mt-6 space-y-3">
            <a
              href={downloadUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F766E]"
            >
              <Download className="h-4 w-4" />
              開始下載
            </a>
            <p className="text-xs text-gray-500">
              連結 5 分鐘後失效。如需再次下載,請重新填寫。
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {error ? (
              <div className="rounded-lg border border-red-700/50 bg-red-900/20 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                公司名稱
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                maxLength={200}
                className="w-full rounded-lg border border-[#243447] bg-[#0D1521] px-3 py-2 text-gray-100 outline-none focus:border-[#0D9488]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                公司信箱
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#243447] bg-[#0D1521] px-3 py-2 text-gray-100 outline-none focus:border-[#0D9488]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#0D9488] py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E] disabled:opacity-50"
            >
              {submitting ? "送出中..." : "產生下載連結"}
            </button>
            <p className="text-center text-xs text-gray-500">
              我們不會出售或轉交您的聯絡資訊。
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [active, setActive] = useState<Asset | null>(null)

  return (
    <main className="min-h-screen bg-[#0D1521] text-white">
      <Navbar />
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold sm:text-5xl">
              資安治理資產下載中心
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-gray-400">
              業務與客戶在 RFP、簽約前評估與內部簡報常用的素材。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const Icon = asset.icon
              return (
                <div
                  key={asset.id}
                  className="flex flex-col rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#5EEAD4]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{asset.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {asset.desc}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
                    {asset.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                  <div className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-500">
                    {asset.readTime}
                  </div>
                  {asset.publicHref ? (
                    <a
                      href={asset.publicHref}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#243447] px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-[#14B8A6] hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      直接下載
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(asset)}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
                    >
                      <Download className="h-4 w-4" />
                      填寫後下載
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-12 rounded-xl border border-[#243447] bg-[#0F1923]/50 p-5 text-sm text-gray-400">
            想看完整功能,可直接{" "}
            <Link
              href="/trial?track=SURFACE"
              className="text-[#5EEAD4] hover:underline"
            >
              預約 Surface 諮詢
            </Link>
            ,顧問會在 1-2 個工作天內聯繫。
          </div>
        </div>
      </section>
      {active ? (
        <DownloadModal asset={active} onClose={() => setActive(null)} />
      ) : null}
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run guard:public-pricing
```

- [ ] **Step 3: Browse and test the modal flow**

```bash
# Put dummy PDF for the gated asset
printf '%%PDF-1.4\n%%test\n' > public/downloads/surface-proposal.pdf
printf '%%PDF-1.4\n%%test\n' > public/downloads/tw-compliance-matrix.pdf
npm run dev
```

Open `http://localhost:3000/resources`. Confirm:
- 3 cards visible
- Click 「填寫後下載」 on the proposal → modal opens
- Fill in company + email → submit → "開始下載" button appears
- Click "開始下載" → PDF download triggers (or PDF opens inline if browser default)
- Click 「直接下載」 on the compliance matrix → PDF downloads directly without modal

Stop dev server. Clean up dummy PDFs:
```bash
rm public/downloads/surface-proposal.pdf public/downloads/tw-compliance-matrix.pdf
```

- [ ] **Step 4: Commit**

```bash
git add src/app/resources/page.tsx
git commit -m "feat: /resources page with 3 lead-gated PDF assets"
```

---

## Task 21: Extend `check-public-pricing-hidden.mjs` regex for 40W variants

**Files:**
- Modify: `scripts/check-public-pricing-hidden.mjs`

- [ ] **Step 1: Add new forbidden patterns**

In `scripts/check-public-pricing-hidden.mjs`, extend the `forbidden` array. Insert after the existing entries:

```js
// Surface annual subscription concrete amounts must not appear in public
// site copy. NOTE: `\b40W\b` would technically also flag "40W power
// supply" — that's acceptable for a security marketing site (no hardware
// pages planned). If hardware content is ever added, narrow the rule.
/\b40W\b/i,
/40\s*萬/,
/四十萬/,
/\b400,?000\b/,
/NT\$?\s*400,?000/i,
/NTD\s*400,?000/i,
```

- [ ] **Step 2: Confirm guard still passes on current tree**

```bash
npm run guard:public-pricing
```
Expected: passes.

- [ ] **Step 3: Confirm guard catches a planted leak**

```bash
# Temporarily add a forbidden string to a test file
echo "<!-- TEST 40W LEAK -->" >> src/app/pricing/page.tsx
npm run guard:public-pricing
# Expected: fails with file:line of the leak

# Restore
git checkout src/app/pricing/page.tsx
```

- [ ] **Step 4: Commit**

```bash
git add scripts/check-public-pricing-hidden.mjs
git commit -m "ci: guard public-pricing also blocks 40W and TW currency variants"
```

---

## Task 22: Verification — full-site checks

**Files:** (none modified)

- [ ] **Step 1: Run all guards**

```bash
npm run guard:public-branding
npm run guard:public-pricing
```
Expected: both pass.

- [ ] **Step 2: Run lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 3: Run library tests**

```bash
npm run test:lib
```
Expected: all `download-sign` tests pass.

- [ ] **Step 4: Run full build**

```bash
npm run build
```
Expected: build succeeds. No new TypeScript errors. Redirect for `/external-risk` shown in build output.

- [ ] **Step 5: Run readiness report**

```bash
npm run readiness:report
```
Review report. Configuration warnings (KV, Sentry token, signing keys) are expected for dev; **functional** errors are not.

- [ ] **Step 6: Spot-check every new/changed URL**

```bash
npm run dev
```

Check each URL renders without console errors:
- `/` — DualPillars after Hero, ComplianceMatrix after SurfaceSpotlight
- `/code` — 5-cap grid + versus + deployment + POC
- `/surface` — 4 caps + versus + service scope + CTA
- `/pricing` — dual cards + 30-day POC bottom
- `/trial?track=CODE` — tier dropdown visible, no Surface fields
- `/trial?track=SURFACE` — domain/rating/eta visible, no tier
- `/trial?track=BOTH` — everything visible + 主要驅動方 required
- `/resources` — 3 asset cards, modal opens on click
- `/external-risk` — 308 redirects to `/surface`

Stop dev server.

- [ ] **Step 7: Commit no-op verification marker**

If everything passed, this task is verification-only and produces no commit.

---

## Task 23: Sales runthrough rehearsal checklist

**Files:**
- Create: `docs/SALES_RUNTHROUGH.md`

- [ ] **Step 1: Create the runthrough checklist**

```markdown
# AegisCode 業務帶客戶演練清單

## 5 分鐘版(電話/線上會議開場)

1. 開首頁 `https://aegiscode.yilutek.com`
2. 第一段:Hero + DualPillars — 「我們有兩條產品線」
3. 第二段:SurfaceSpotlight — 「外部攻擊面用 SecurityScorecard 整合,搭配 AI 修補建議」
4. 第三段:ComplianceMatrix — 「中文化資安法 / 個資法 / ISO 對應」
5. 結尾:點 `/resources` 給客戶看可下載的服務說明書與 CISO 月報 sample

## 15 分鐘版(客戶現場)

1. 首頁全程瀏覽(8 分鐘)
2. 點 `/code` 深入 SAST + CBOM(2 分鐘)
3. 點 `/surface` 看 vs SecurityScorecard 對比表(2 分鐘)
4. 點 `/pricing` 講清「Code 平台授權 vs Surface 顧問訂閱」雙路徑(2 分鐘)
5. 點 `/resources` 鼓勵客戶現場留 lead 拿資料(1 分鐘)

## 客戶可能問的問題與快速回答位置

| 問題 | 站上位置 |
|---|---|
| 跟 SonarQube 差在哪? | 首頁 FAQ #3 / `/code` 對比表 |
| 跟 SecurityScorecard 差在哪? | `/surface` 對比表 / 首頁 FAQ #5 |
| 月報長什麼樣? | `/resources` → CISO 月報 sample |
| 是 SaaS 還是地端? | `/code` 部署選項 / 首頁 FAQ #1 |
| 跟法規對應嗎? | 首頁 ComplianceMatrix / `/resources` 法規表 |
| 多少錢? | 「方案依範圍報價,可在 POC 後提供」— `/pricing` |
| 可以單買嗎? | 首頁 FAQ #9 |

## Trial 表單分流規則

| 客戶說 | 業務勾選 |
|---|---|
| 「我想看程式碼掃描」 | `/trial?track=CODE` |
| 「我想看外部攻擊面 / CISO 月報」 | `/trial?track=SURFACE` |
| 「我兩個都想評估」 | `/trial?track=BOTH` |

## Surface 簽約前置作業提醒

簽約前需從客戶取得:
- SecurityScorecard / BitSight API token(客戶授權)
- 評估範圍的 Domain / Portfolio 清單
- 黑名單 / 排除項目
- 月報品牌名稱、Prepared by、Classification 等資訊

第一輪 inventory + enrich 在簽約後第 1 週啟動,第 2 週交付首份月報草稿。

## 千萬不要說的話(避免 commercial leak)

- ❌ 「40 萬」「40W」「四十萬」 — 站上守規禁止,業務口頭也避免在客戶確認需求前用
- ❌ 「永久授權」 — Surface 是訂閱
- ❌ 「自動扣款」 — 目前 self-service Stripe 未啟用
- ✅ 「報價依範圍而定,在範圍確認後提供」
- ✅ 「年度訂閱,含平台、週差異、月報、季度檢討、顧問會議」
```

- [ ] **Step 2: Commit**

```bash
git add docs/SALES_RUNTHROUGH.md
git commit -m "docs: sales runthrough checklist for dual-product site"
```

---

## Task 24: SGW-side PDF production handoff note

**Files:**
- Create: `docs/SGW_ASSET_PRODUCTION.md`

**This task does not modify code — it documents the SGW-side one-time work that ops must do before launch.**

- [ ] **Step 1: Create the handoff doc**

```markdown
# SGW-side 一次性產出資產

本網站的 `/resources` 頁面期望 ops 在部署時把以下 3 份 PDF 放到 `public/downloads/`。檔案不入 git。

## 1. `surface-proposal.pdf` (AegisCode Surface 服務說明書)

**來源**:`security-governance-workbench-v0.1/.../WTMEC/ssc_service_proposal.py`

```bash
cd /path/to/WTMEC
python ssc_service_proposal.py \
  --output surface-proposal.pdf \
  --brand "AegisCode Surface"
```

**檢查項目**:
- 內容不含特定客戶名稱
- 不含 API token
- 不含內部 sales script 措辭(避免「框價」「objection」字眼)
- 可以包含具體年費數字(這份是 gated 下載,不違反站上隱藏策略)

## 2. `ciso-monthly-sample.pdf` (CISO 月報 sample,匿名化)

**來源**:`ssc_ciso_monthly_report_v3.py`

**前置**:準備一份匿名化的 demo DB(把客戶名、Domain 名改成 `Acme Bank`、`example-acme.com` 之類)。

```bash
cd /path/to/WTMEC
python ssc_ciso_monthly_report_v3.py \
  --db demo_anonymized.db \
  --output ciso-monthly-sample.pdf
```

**檢查項目**:
- 不含真實客戶 Domain
- 不含真實 IP / cert SAN
- 法規對應、修補 ROI、Top Backlog 各區塊都呈現
- 風格與顏色看起來像「可以呈給董事會」

## 3. `tw-compliance-matrix.pdf` (台灣法規對應一覽表,公開)

**來源**:`compliance_mapping.py` 中的 mapping 資料,由設計師美編。

**內容**:單頁三欄式對照表:資通安全管理法 × 個資法 × ISO 27001:2022,各列 4-5 條最常被稽核的條目。

**檢查項目**:
- 公開資產,**不**包含 sales 金額或客戶敏感內容
- 印字清晰、可作為內部 onboarding 印刷品
- AegisCode logo / 配色一致

## 部署步驟

1. ops 把 3 份 PDF SCP / rsync 到 Vercel 部署機器的 `aegiscode-website/public/downloads/` 或透過 Vercel 上傳介面
2. 重新部署或讓檔案在下次部署時帶上線
3. Smoke 測試:`curl -sI https://aegiscode.yilutek.com/downloads/tw-compliance-matrix.pdf` 應該回 200
4. 對 2 份 gated 資產,從瀏覽器走完 `/resources` 流程確認下載

## 旋轉提醒

- 旋轉 `DOWNLOAD_SIGNING_SECRET` 後,已發出的下載連結會即時失效(預期行為)
- 月報 sample 建議每季更新一次,以反映最新平台 UI 與 mapping
```

- [ ] **Step 2: Commit**

```bash
git add docs/SGW_ASSET_PRODUCTION.md
git commit -m "docs: SGW-side asset production handoff for /resources"
```

---

## Task 25: README update + final smoke

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a section about the dual-product structure**

Locate a good insertion point in `README.md` (around the Production readiness section). Insert:

```markdown
## Dual Product Structure (since 2026-05-15)

The site sells two AegisCode product lines:

- **AegisCode Code** — internal code security platform (`/code`). 30-day POC, Stripe-capable license model.
- **AegisCode Surface** — external attack surface annual advisory subscription (`/surface`). Sourced from the SGW Python pipeline (separate repo); the website hosts pre-produced PDFs but does not invoke the pipeline at runtime.

### New routes
- `/code` — Code product depth page
- `/surface` — Surface product depth page (replaces `/external-risk` via 308 redirect)
- `/resources` — Lead-gated PDF downloads
- `/api/resources/download` — POST: lead capture, returns 5-min signed URL
- `/api/resources/file/[assetId]` — GET: HMAC-verifies token and streams PDF from `public/downloads/`

### Trial form tracks
`/trial?track=CODE` (default) / `?track=SURFACE` / `?track=BOTH`. Surface and Both always go to manual review (no auto-JWT), per the advisory subscription model.

### Required env vars (new)
- `DOWNLOAD_SIGNING_SECRET` (or falls back to `ADMIN_TOKEN`) — HMAC key for resource download URLs

### One-time SGW-side work
Three PDFs in `public/downloads/` must be produced by ops from the SGW pipeline. See [docs/SGW_ASSET_PRODUCTION.md](docs/SGW_ASSET_PRODUCTION.md).

### Sales runthrough
See [docs/SALES_RUNTHROUGH.md](docs/SALES_RUNTHROUGH.md) for the customer-facing demo flow.
```

- [ ] **Step 2: Final full verification**

```bash
npm run lint
npx tsc --noEmit
npm run test:lib
npm run guard:public-branding
npm run guard:public-pricing
npm run build
npm run readiness:report
```
All should pass / produce expected report.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs(readme): describe dual-product structure and new routes"
```

---

## Acceptance Checklist (re-verifies spec §8)

After all tasks complete, verify each spec acceptance criterion:

- [ ] AC1: Sales can deliver 5-min Code+Surface pitch using home page alone — verify by reading `docs/SALES_RUNTHROUGH.md` and walking through
- [ ] AC2: `/trial` three tracks dispatch correctly — verify via curl in Task 14 Step 7
- [ ] AC3: `/resources` 3 PDFs downloadable (assumes ops uploaded files per Task 24)
- [ ] AC4: `/pricing` dual-model clear — verify by reviewing rendered page
- [ ] AC5: `/external-risk` returns 308 to `/surface` — verify via `curl -sI`
- [ ] AC6: `productJsonLd` is ItemList with 2 Products — view source on `/`
- [ ] AC7: `faqJsonLd` has 9 entries — view source on `/`
- [ ] AC8: `npm run readiness` (or `readiness:report` for dev) — passes/reports
- [ ] AC9: `npm run smoke:production` — passes after deploy
- [ ] AC10: `npm run guard:public-pricing` — passes including new 40W regex
- [ ] AC11: `npm run guard:public-branding` — passes (unchanged)
- [ ] AC12: `/admin/licenses` and `/admin/audit-log` still work — manual smoke after deploy
- [ ] AC13: `npx tsc --noEmit` + `npm run lint` — pass
- [ ] AC14: Sentry integration unchanged — verify build emits no Sentry warnings

---

## Implementation Order Cheat-Sheet

When dispatched as subagents (recommended via `superpowers:subagent-driven-development`), tasks can run in this order. Parallelism is limited because most tasks touch shared files (`page.tsx`, `navbar.tsx`); recommend serial execution.

Suggested batches that share verification:
- Batch 1: Tasks 1–4 (infrastructure + redirect)
- Batch 2: Tasks 5–7 (new pages and components, parallel-safe)
- Batch 3: Tasks 8–13 (home page + nav + content updates + pricing, serial)
- Batch 4: Tasks 14–16 (trial form + API extension)
- Batch 5: Tasks 17–20 (resources lib + APIs + page)
- Batch 6: Tasks 21–25 (guards, verification, docs)

End of plan.
