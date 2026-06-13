import { notFound } from "next/navigation"
import type { ReactNode } from "react"

// Print-only pages used by scripts/regenerate-pdfs.mjs to puppeteer-render
// HTML → PDF. They are NOT meant to be reached from the public site:
// src/proxy.ts (or middleware.ts) blocks /internal/* unless the request
// comes from localhost or carries a matching x-admin-token.
//
// All three pages share the same print envelope: A4 page size, white
// background, Noto Sans TC + Geist for CJK + Latin coverage, declared
// page-breaks. No Navbar / Footer (those are screen UI).

export const dynamic = "force-dynamic"

const KNOWN_IDS = new Set([
  "surface-proposal",
  "ciso-monthly-sample",
  "tw-compliance-matrix",
])

const TITLES: Record<string, string> = {
  "surface-proposal": "AegisCode Surface 服務說明書",
  "ciso-monthly-sample": "AegisCode Surface CISO 月報範本",
  "tw-compliance-matrix": "台灣資安法規對應一覽",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return {
    title: TITLES[id] ?? "AegisCode Internal Asset",
    robots: { index: false, follow: false },
  }
}

const printedAt = (): string => {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, "0")
  const d = String(now.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// Canonical compliance-matrix data lives in
// src/components/compliance-matrix.tsx. It's a "use client" file that pulls
// in framer-motion, so we re-declare the data here verbatim instead of
// importing the component. Keep the two arrays in sync (see
// docs/PDF_REGENERATION.md).
const TW_COMPLIANCE_REGULATIONS: Array<{
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

function PrintShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font --
          Intentional: only the /internal/asset-print/[id] pages need this
          font, and they are server-rendered by puppeteer rather than
          shipped to real visitors. Adding it to the root layout would
          ship CJK Web fonts to every public page. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page { size: A4; margin: 18mm 16mm; }
            html, body {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: "Noto Sans TC", "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
              font-size: 11pt;
              line-height: 1.55;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-root { max-width: 100%; }
            .brand-bar {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              border-bottom: 1.5pt solid #0f172a;
              padding-bottom: 6pt;
              margin-bottom: 18pt;
            }
            .brand-bar .brand-name {
              font-size: 14pt;
              font-weight: 700;
              letter-spacing: 0.04em;
            }
            .brand-bar .brand-tagline {
              font-size: 9pt;
              color: #475569;
            }
            h1.doc-title {
              font-size: 22pt;
              font-weight: 700;
              line-height: 1.25;
              margin: 0 0 6pt 0;
            }
            p.doc-subtitle {
              font-size: 12pt;
              color: #334155;
              margin: 0 0 18pt 0;
            }
            .tag-row {
              display: flex;
              flex-wrap: wrap;
              gap: 6pt;
              margin-bottom: 18pt;
            }
            .tag-row .tag {
              font-size: 9pt;
              padding: 2pt 8pt;
              border: 0.75pt solid #0f766e;
              color: #0f766e;
              border-radius: 12pt;
              background: #f0fdfa;
            }
            h2.section-title {
              font-size: 15pt;
              font-weight: 700;
              margin: 18pt 0 8pt 0;
              padding-bottom: 4pt;
              border-bottom: 0.75pt solid #cbd5e1;
            }
            h3.subsection-title {
              font-size: 12pt;
              font-weight: 700;
              margin: 12pt 0 4pt 0;
            }
            p, li { font-size: 10.5pt; }
            ul.bullet-list {
              padding-left: 18pt;
              margin: 4pt 0 8pt 0;
            }
            ul.bullet-list li {
              margin-bottom: 3pt;
            }
            table.print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 6pt 0 12pt 0;
              font-size: 10pt;
            }
            table.print-table th,
            table.print-table td {
              border: 0.6pt solid #94a3b8;
              padding: 5pt 7pt;
              vertical-align: top;
              text-align: left;
            }
            table.print-table th {
              background: #f1f5f9;
              font-weight: 700;
            }
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8pt;
              margin: 8pt 0 14pt 0;
            }
            .kpi-card {
              border: 0.6pt solid #94a3b8;
              border-radius: 4pt;
              padding: 8pt 10pt;
            }
            .kpi-card .kpi-label {
              font-size: 9pt;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            }
            .kpi-card .kpi-value {
              font-size: 18pt;
              font-weight: 700;
              margin: 2pt 0;
            }
            .kpi-card .kpi-note {
              font-size: 9pt;
              color: #475569;
            }
            .three-col-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10pt;
              margin-top: 6pt;
            }
            .regulation-card {
              border: 0.6pt solid #94a3b8;
              border-radius: 4pt;
              padding: 8pt 10pt;
            }
            .regulation-card h3 {
              font-size: 11pt;
              font-weight: 700;
              margin: 0 0 2pt 0;
            }
            .regulation-card .reg-subtitle {
              font-size: 9pt;
              color: #475569;
              margin: 0 0 6pt 0;
            }
            .regulation-card ul {
              padding-left: 14pt;
              margin: 0;
            }
            .regulation-card li {
              font-size: 9.5pt;
              margin-bottom: 3pt;
              line-height: 1.4;
            }
            .doc-footer {
              margin-top: 22pt;
              padding-top: 6pt;
              border-top: 0.6pt solid #cbd5e1;
              font-size: 8.5pt;
              color: #64748b;
              display: flex;
              justify-content: space-between;
            }
            .page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
          `,
        }}
      />
      <div className="print-root">{children}</div>
    </>
  )
}

function BrandHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="brand-bar">
      <span className="brand-name">AegisCode</span>
      <span className="brand-tagline">{subtitle}</span>
    </div>
  )
}

function DocFooter({ docCode }: { docCode: string }) {
  return (
    <div className="doc-footer">
      <span>AegisCode · sales@aegiscode.com · https://aegiscode.yilutek.com</span>
      <span>
        {docCode} · 印製日期 {printedAt()}
      </span>
    </div>
  )
}

function ServiceProposalPage() {
  return (
    <>
      <BrandHeader subtitle="Surface — 外部攻擊面年度治理服務" />
      <h1 className="doc-title">AegisCode Surface 年度顧問訂閱</h1>
      <p className="doc-subtitle">外部攻擊面年度治理服務</p>
      <div className="tag-row">
        <span className="tag">年度訂閱</span>
        <span className="tag">Audit-friendly</span>
        <span className="tag">zh-TW first</span>
      </div>

      <h2 className="section-title">服務範圍</h2>
      <table className="print-table avoid-break">
        <thead>
          <tr>
            <th style={{ width: "28%" }}>交付項目</th>
            <th>內容摘要</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>平台存取</td>
            <td>
              治理工作台、Domain 深入分析、修補任務追蹤、外部評分整合視圖
              (可串接既有 SecurityScorecard / BitSight 結果)。
            </td>
          </tr>
          <tr>
            <td>每週差異追蹤</td>
            <td>
              偵測新出現的曝險服務、憑證異動、評分波動,並標記須在下次月報處理的
              backlog 項目。
            </td>
          </tr>
          <tr>
            <td>每月正式治理報告</td>
            <td>
              CISO 月報 PDF(中文化、可呈交董事會),含風險量化、Top
              Backlog、台灣法規對應與 ROI 試算。
            </td>
          </tr>
          <tr>
            <td>季度治理檢討</td>
            <td>
              彙整三個月平均分數趨勢、P0/P1 任務完成率、修補 ROI,並提出下一季
              治理重點。
            </td>
          </tr>
          <tr>
            <td>顧問解讀會議</td>
            <td>
              每月 60–90 分鐘線上會議,協助 CISO / 資安主管向管理層解讀月報、
              對齊修補優先順序。
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="section-title">包含什麼</h2>
      <ul className="bullet-list">
        <li>
          年度授權:Surface 平台帳號、API 存取、Domain / 子網域追蹤(範圍依
          簽約時確認)。
        </li>
        <li>
          AI 修補建議:依弱點類型整理優先級、修補步驟、驗證方式與工時估算。
        </li>
        <li>
          台灣法規對應:資通安全管理法 × 個資法 × ISO 27001:2022 條目對齊,
          技術修補可直接連到法規責任。
        </li>
        <li>
          顧問級 CISO 月報:風險量化、趨勢、Top Backlog、法規對應與 ROI
          試算,一份可呈交董事會的 PDF。
        </li>
        <li>
          每月顧問解讀會議與 Slack / Email 治理諮詢通道(工作日內回覆)。
        </li>
      </ul>

      <h2 className="section-title">適合誰</h2>
      <p>
        金融、政府、高法遵組織的 CISO / 資安主管,過去仰賴外部評分平台
        (SecurityScorecard、BitSight、Cyberhaven 等)取得評分,但缺乏可呈交
        管理層的中文化月報、台灣法規對應與修補優先順序。Surface 不取代評分
        平台,而是把評分轉成董事會看得懂的治理視圖。
      </p>

      <h2 className="section-title">客戶責任</h2>
      <ul className="bullet-list">
        <li>提供需治理的 Domain / 子網域清單與聯絡窗口(資安、IT 維運)。</li>
        <li>指派內部 owner 接收月報與修補任務,並負責跨團隊協調。</li>
        <li>確認外部評分平台帳號(若採整合方案)、稽核資料留存政策。</li>
        <li>
          配合每月顧問解讀會議的排程(60–90 分鐘),與顧問雙向確認治理重點。
        </li>
      </ul>

      <h2 className="section-title">簽約啟動時程</h2>
      <table className="print-table avoid-break">
        <thead>
          <tr>
            <th>時程</th>
            <th>里程碑</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>第 1 週</td>
            <td>簽約啟動會議、範圍確認、平台帳號開通、Domain 清單匯入。</td>
          </tr>
          <tr>
            <td>第 2–3 週</td>
            <td>初次外部攻擊面盤點、基準分數建立、Top Backlog 草擬。</td>
          </tr>
          <tr>
            <td>第 4 週</td>
            <td>首份 CISO 月報交付、首次顧問解讀會議。</td>
          </tr>
          <tr>
            <td>第 5 週以後</td>
            <td>每週差異追蹤 → 每月月報 → 季度治理檢討,進入常態交付節奏。</td>
          </tr>
        </tbody>
      </table>

      <h2 className="section-title">報價</h2>
      <p>
        報價依範圍而定 — Domain 數量、外部評分整合的供應商、是否含
        Penetration Test 與額外顧問時數,皆會影響年費。請聯絡
        <strong>sales@aegiscode.com</strong> 取得針對貴單位範圍的正式報價。
      </p>

      <DocFooter docCode="AC-SURFACE-PROPOSAL-v1" />
    </>
  )
}

function CisoMonthlySamplePage() {
  return (
    <>
      <BrandHeader subtitle="Surface — CISO 月報範本(匿名化)" />
      <h1 className="doc-title">外部攻擊面治理月報 — 2026 年 4 月</h1>
      <p className="doc-subtitle">匿名化範本 · 不含真實客戶資料</p>

      <h2 className="section-title">本月 KPI</h2>
      <div className="kpi-grid avoid-break">
        <div className="kpi-card">
          <div className="kpi-label">範圍 Domain 數</div>
          <div className="kpi-value">42</div>
          <div className="kpi-note">主域 + 子網域,含 SaaS 整合面</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">P0 任務數</div>
          <div className="kpi-value">3</div>
          <div className="kpi-note">本月新增 1 · 已修 2 · 待處理 3</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">平均分數變化</div>
          <div className="kpi-value">+4.2</div>
          <div className="kpi-note">月初 78.5 → 月末 82.7(滿分 100)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">法規對應條目</div>
          <div className="kpi-value">12</div>
          <div className="kpi-note">資安法 5 · 個資法 3 · ISO 27001 4</div>
        </div>
      </div>

      <h2 className="section-title">風險趨勢</h2>
      <p>
        本月外部評分從月初 78.5 上升至月末 82.7,主要由於 acme-edge-01
        憑證更新與兩個過期子網域的下架。Top Backlog 從 7 項收斂至 5 項;
        新增 1 項 P0(payment 端點 TLS 1.0 殘留)。
      </p>
      <p>
        <em>
          備註:本月報為匿名化範本資料，實際客戶月報會內嵌平台產生的趨勢圖、
          熱區雷達與 90 天滾動歷史比較。
        </em>
      </p>

      <h2 className="section-title">Top 5 高風險 Domain</h2>
      <table className="print-table avoid-break">
        <thead>
          <tr>
            <th>Domain</th>
            <th>分類</th>
            <th>風險摘要</th>
            <th>等級</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>acme-payment.example.com</td>
            <td>支付閘道</td>
            <td>TLS 1.0 殘留;PCI DSS 合規風險。</td>
            <td>P0</td>
          </tr>
          <tr>
            <td>acme-edge-01.example.com</td>
            <td>邊緣節點</td>
            <td>憑證 SAN 不一致,可能造成客戶端錯誤。</td>
            <td>P1</td>
          </tr>
          <tr>
            <td>portal.acme.example.com</td>
            <td>客戶入口</td>
            <td>未強制 HSTS,SecurityHeaders C 級。</td>
            <td>P1</td>
          </tr>
          <tr>
            <td>legacy-api.acme.example.com</td>
            <td>舊版 API</td>
            <td>建議於下季下架;仍有少量第三方流量。</td>
            <td>P2</td>
          </tr>
          <tr>
            <td>marketing.acme.example.com</td>
            <td>行銷站</td>
            <td>WordPress 外掛版本落後 4 個 minor。</td>
            <td>P2</td>
          </tr>
        </tbody>
      </table>

      <div className="page-break" />

      <h2 className="section-title">法規對應彙整</h2>
      <p>
        本月新發現的 5 項 P0/P1 風險,可對應到下列法規條目。完整對應表會
        附在實際客戶月報的附錄。
      </p>
      <table className="print-table avoid-break">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>資通安全管理法</th>
            <th style={{ width: "30%" }}>個人資料保護法</th>
            <th>ISO 27001:2022</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>弱點掃描與修補時效要求</td>
            <td>技術與組織保護措施</td>
            <td>A.8 技術控制 — 弱點管理</td>
          </tr>
          <tr>
            <td>稽核紀錄保存與審查週期</td>
            <td>個資處理目的與最小化原則</td>
            <td>A.5 組織控制 — 治理結構</td>
          </tr>
          <tr>
            <td>資安治理組織與責任歸屬</td>
            <td>外洩通報與當事人告知</td>
            <td>A.5.23 雲端服務與第三方風險</td>
          </tr>
        </tbody>
      </table>

      <h2 className="section-title">ROI 試算</h2>
      <p>
        本月修補 2 項 P0(acme-edge-01 憑證、過期子網域下架),依事件機率
        與處理工時推估,等同延後或避免一輪內部資安事件處理流程。實際客戶
        月報會根據業主指定的事件成本模型(例如 NIST CSF、業主自訂工時
        單價)計算當月節省比例,並於季度治理檢討會議中累計年度回收率。
      </p>

      <h2 className="section-title">本月行動項</h2>
      <ul className="bullet-list">
        <li>
          P0 acme-payment.example.com:下週前停用 TLS 1.0,改用 TLS 1.2+
          並補上 HSTS。Owner:支付平台 SRE。
        </li>
        <li>
          P1 portal.acme.example.com:本月內補上 HSTS、CSP header,目標
          SecurityHeaders B 級。Owner:Web Ops。
        </li>
        <li>
          P2 legacy-api.acme.example.com:下季啟動下架流程,先送停用通知給
          仍在使用的第三方。Owner:API 平台。
        </li>
        <li>
          風險溝通:把本月 P0 修補成果納入下次資安委員會簡報。
          Owner:CISO Office。
        </li>
      </ul>

      <p>
        <em>
          本月報為產品範本，實際客戶月報依範圍客製
          (Domain 數量、整合的外部評分平台、法規對應深度皆可調整)。
        </em>
      </p>

      <DocFooter docCode="AC-SURFACE-MONTHLY-SAMPLE-v1" />
    </>
  )
}

function TwComplianceMatrixPage() {
  return (
    <>
      <BrandHeader subtitle="台灣資安法規對應一覽" />
      <h1 className="doc-title">台灣資安法規對應一覽</h1>
      <p className="doc-subtitle">
        資通安全管理法 × 個資法 × ISO 27001:2022 對應條目
      </p>

      <p>
        AegisCode Surface 內建中文化法規對應,讓資安修補的每一步都能直接連到
        法規責任,適合金融、政府與高法遵組織的稽核情境。下表為三條法規最常被
        稽核的條目並列對照,可貼進稽核準備文件作為快速索引。
      </p>

      <h2 className="section-title">三條法規並列對照</h2>
      <div className="three-col-grid">
        {TW_COMPLIANCE_REGULATIONS.map((reg) => (
          <div className="regulation-card avoid-break" key={reg.title}>
            <h3>{reg.title}</h3>
            <p className="reg-subtitle">{reg.subtitle}</p>
            <ul>
              {reg.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="section-title">如何使用本表</h2>
      <ul className="bullet-list">
        <li>
          稽核準備:將每項弱點對應到右側 ISO 27001 控制條目,可直接放進
          ISMS 文件附錄。
        </li>
        <li>
          管理層彙報:把技術修補映射到資安法 / 個資法的責任條目,讓主管
          理解修補的法規意義。
        </li>
        <li>
          供應商治理:第三方風險評估可參考此表,確認供應商在三條法規面的
          覆蓋程度。
        </li>
      </ul>

      <h2 className="section-title">完整客製化對應</h2>
      <p>
        本表為公開速查版本。針對貴單位實際 Domain 範圍、業務類型(金融、
        政府、醫療等)與既有 ISMS 文件的完整客製化合規對應,由 Surface
        顧問服務交付。請聯絡 <strong>sales@aegiscode.com</strong>。
      </p>

      <DocFooter docCode="AC-TW-COMPLIANCE-MATRIX-v1" />
    </>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!KNOWN_IDS.has(id)) {
    notFound()
  }

  let body: ReactNode
  switch (id) {
    case "surface-proposal":
      body = <ServiceProposalPage />
      break
    case "ciso-monthly-sample":
      body = <CisoMonthlySamplePage />
      break
    case "tw-compliance-matrix":
      body = <TwComplianceMatrixPage />
      break
    default:
      // KNOWN_IDS already gates this — keep it for type safety.
      notFound()
  }

  return <PrintShell>{body}</PrintShell>
}
