# AegisCode Code / Surface 內頁 Round-2 Polish 設計

**日期**: 2026-05-16
**狀態**: 草案,待 spec review + 使用者驗收
**範圍倉庫**: `aegiscode-website`
**前置 spec**: [`2026-05-15-aegiscode-dual-product-site-design.md`](./2026-05-15-aegiscode-dual-product-site-design.md)(已 ship)

---

## 1. 背景與動機

`2026-05-15` 雙產品 sales-ready 站的 25-task plan 全部交付,並完成多輪首頁/Stats/eyebrows polish。最近兩個 commit 把 CBOM/PQC 升為「矛尖」定位(`15f692b`)、修補 mobile sales pages(`97db21e`)。

但 `/code` 與 `/surface` 兩個產品內頁**仍停在 v1 brochure 結構**:Hero 4 行 stacked text → 能力卡 → versus 表 → 部署/服務範圍 → CTA。對比首頁有 Hero mock + Stats 雙軌 + DualPillars + ComplianceMatrix 的豐富度,兩個產品頁是現在最弱的環節。

**問題**:業務帶客戶點進 `/code` 或 `/surface` 後,沒有量化證據、沒有產業切片、沒有產品專屬異議處理,單張紙的密度撐不起年約訂閱(Surface)與 30 天 POC(Code)的對話。

**目標**:對兩個產品頁做 round-2 深化,讓 sales 在「點進來後」也能撐住 8-12 分鐘的對話,並且呼應 CBOM-forward 的新定位。

---

## 2. 設計決策

| 決策 | 結論 | 理由 |
|---|---|---|
| 改動範圍 | 只動 `/code` 與 `/surface` 兩頁 | 首頁/pricing/trial/resources 都已 polish 過 |
| IA 是否動? | **不動 page-level IA、不動 sitemap、不動 redirects** | 保住 SEO 與既有內鏈,只動 section 級別順序 |
| Section 級別順序 | 允許在頁內把 "outcome 先於 capability" 套用 | 用「Proof Strip 緊跟 Hero」實現,不重排既有 section IDs |
| 視覺新增物 | 全部 CSS/SVG 自繪,**不引入新 dep**(framer-motion 已在) | 已有 motion 庫足夠 |
| KPI 數字來源 | 只用可驗證來源:`EXECUTIVE_DEMO_DATASET.md`、`40W_SALES_SCRIPT.md`、Hero 現有 mock 數字、`DOI 10.3390/math14061072`、`30 天 POC` | 維持「不捏造」原則 |
| Industry vignette 命名 | **不寫具名客戶**,只用情境化敘事(如「某金控 BU」「某政府機關」) | 沒有實際 case study,避免錯誤暗示 |
| 揭露 40 萬絕對金額? | **不揭露**(維持 `guard:public-pricing`) | 既有政策 |
| Interactive 區塊 | **純前端 mock**,點擊切換靜態資料,不打 API | 安全範圍內 |

---

## 3. 範圍(Goals / Non-Goals)

### Goals

1. `/code` 與 `/surface` 各自增加 **5 個新 section**(Proof Strip、Outcome Quote、Visual Versus 升級、Industry Vignette、Product FAQ)
2. `/code` 增加 **1 個 Interactive Capability Tour**(4-step 切換,純前端)
3. `/code` 增加 **1 個 Inline ROI Mini**(2 個 slider,單一數字輸出)
4. `/surface` 增加 **1 個 Report Preview Flip**(3 頁 SVG 模擬月報,左右翻)
5. 全頁 CBOM-forward 定位對齊(現在 `/code` 的 5 能力中 CBOM 排第 2,要升上去)
6. Mobile-first pass:`overflow-x-hidden break-all` 已有,但 Hero 的 stacked text 在小螢幕還是過長
7. `productJsonLd` 不退步——維持前一份 spec 升級後的 **`ItemList` 結構**,並保留 **`Code` 與 `Surface` 兩個 `Product` 子項**,不可降回單品結構;`/external-risk` 308 redirect 不動;`guard:public-pricing` 不退步

### Non-Goals

- ❌ 不動首頁、`/pricing`、`/trial`、`/resources`
- ❌ 不開新 route、不動 `/api/*`
- ❌ 不新增 npm dep
- ❌ 不做 EN 版
- ❌ 不換 logo / 不換主視覺色
- ❌ 不寫具名客戶 / 不揭露絕對金額
- ❌ Surface 不開 self-service Stripe

---

## 4. 頁面設計

### 4.1 `/code` 新版區塊順序

```
1. Hero (現有,微調文案 + 視覺對齊 CBOM-forward)
2. ★ Proof Strip (NEW)            — 3 個量化錨點
3. ★ Outcome Vignette (NEW)        — 3 個產業情境卡
4. Capability Cards (現有,5→6 卡,CBOM 升至第 1)
5. ★ Interactive Capability Tour (NEW) — 4-step 切換
6. ★ Visual Versus (UPGRADE)       — 由文字行升為 3 欄對比卡
7. Deployment Options (現有,微調)
8. ★ Inline ROI Mini (NEW)         — 簡易計算
9. ★ Product FAQ (NEW)             — 4-6 題 Code 專屬
10. POC CTA (現有,雙路徑強化)
```

#### 4.1.1 Hero 微調
- 既有 Hero 是 4 行 stacked text(`<span class="block">` × 4),sm 以下會過長
- **改為 2-3 行 stacked + 一行副標**:
  - line 1: 「以 CBOM/PQC 為矛尖」
  - line 2: 「的內部程式碼治理」
  - line 3: 「SAST + 主管審核閉環」
- 子標(`<p>`)保留並改寫對齊 CBOM-forward
- CTA 不動,維持 `/trial?track=CODE` + `/pricing`
- 數字高度:`text-3xl sm:text-5xl` 保留

#### 4.1.2 Proof Strip(緊接 Hero)
3 個量化錨點,水平排列,大字號:

| 指標 | 數字 | 副標 |
|---|---|---|
| Peer-reviewed | DOI 10.3390/math14061072 | Mathematics, MDPI |
| POC 期程 | 30 天 | Code POC 已開放 |
| 支援語言 | 12 種 | 涵蓋金融常見開發棧 |

無圖示,只用數字 + 細線分隔。

#### 4.1.3 Outcome Vignette(3 個情境卡)
不具名情境,各卡片:
- icon + 一句情境(e.g.「某金控 BU 評估 CBOM 法遵」)
- 一句痛點(現況的問題)
- 一句 outcome(用 AegisCode Code 後變什麼樣)

3 卡候選:
- **金融金控**:CBOM 法遵盤點 — 從散落 Excel → 統一 evidence pack
- **政府/國防**:Air-gapped SAST — 從外送黑盒掃描 → 地端封閉式掃描
- **製造/IoT**:Multi-language 程式碼治理 — 從多源工具拼接 → 單一 Quality Gate

#### 4.1.4 Capability Cards(由 5 升 6,CBOM 升至首位)
保留既有 5 張(SAST、CBOM、SBOM、Quality Gate、繁中合規),新增第 6 張:
- **SAST-in-the-Loop / VULNFORGE**(已在 features.tsx 出現過,內頁要呼應)

順序改為:CBOM → SAST → VULNFORGE → SBOM → Quality Gate → 繁中合規

**「主管審核留痕」歸屬**:既有 `/code/page.tsx` 把「主管審核」綁在第 4 張「Quality Gate + 主管審核」描述裡。**保持不動**——VULNFORGE 是另外加的第 3 張,Quality Gate 卡的 title 與 desc 沿用現有「Quality Gate + 主管審核」字串,確保主管審核留痕的字眼不被剝離(這是金融客戶的關鍵稽核訴求)。

#### 4.1.5 Interactive Capability Tour(NEW)
4-step tabs(client component):
1. **CBOM 盤點**:演算法 + 金鑰長度表
2. **SAST 掃描**:findings list + severity
3. **VULNFORGE**:findings → fix workflow
4. **Quality Gate**:閘門政策結果

實作:單個 `code-tour.tsx`,4 個 panel 切換,純 SVG/CSS。每個 panel 用 mock data 顯示一張卡片式畫面。Tab 間切換 `framer-motion` 淡入淡出。**不打任何 API,全 client-side**。

#### 4.1.6 Visual Versus 升級
現況是文字單欄行。升級為 3 欄卡片:
| 維度 | SonarQube Enterprise | AegisCode Code |
|---|---|---|
| 程式碼品質 + SAST | ✅ 成熟 | ✅ 整合 |
| CBOM/PQC | ❌ | ✅ 矛尖能力 |
| 繁中治理工作流 | ❌ | ✅ |
| 主管審核留痕 | 部分 | ✅ 完整 |
| 台灣金融合規證據包 | ❌ | ✅ |

每行 3 欄(維度 / SonarQube / AegisCode),桌機並排,mobile 摺成兩行。

#### 4.1.7 Inline ROI Mini(NEW)
3 個 slider/select:
- 程式碼倉庫數(10 / 25 / 50 / 100+)
- 加密敏感度(低 / 中 / 高金融)
- 目前盤點方式(Excel 散落 / 部分工具 / 已有平台)

輸出 1 個句子:
> 「依您輸入,AegisCode Code 預估可在 30 天 POC 內產出 ~N 個高風險 CBOM finding,並節省 ~M 工時/月。」

數字依輸入做簡單線性映射(client-side `useMemo`)。**不打 API,純 UI**。
標題:「快速估算 — 30 天 POC 能產出多少 CBOM finding」
免責句:「實際結果依專案範圍而定,POC 階段會校準。」

#### 4.1.8 Product FAQ(NEW)
4-6 題 Code 專屬,候選:
- Q1:跟 Snyk / Veracode / Checkmarx 比差在哪?
- Q2:CBOM/PQC 真的能合規證據用嗎?
- Q3:Air-gapped 環境部署複雜度?
- Q4:Quality Gate 與 BU 權限怎麼搭?
- Q5:POC 30 天能評估到什麼程度?
- Q6:跟我們現有 SonarQube 重複嗎?

`<details>` element 摺疊,點開展開,無 JS 依賴。

#### 4.1.9 POC CTA 強化
現況:單卡片內含 5 個 deliverables + 雙 button(POC / mailto)。
升級:加入「冷路徑」說明 — 如果現在還沒準備好 POC,可以下載 `tw-compliance-matrix.pdf`(對接 `/resources`)先評估自己環境。

---

### 4.2 `/surface` 新版區塊順序

```
1. Hero (現有,微調文案視覺)
2. ★ Proof Strip (NEW)              — 3 個量化錨點
3. ★ Outcome Vignette (NEW)         — 3 個產業情境卡
4. Capability Cards (現有,4 卡保留)
5. ★ Report Preview Flip (NEW)      — 3 頁月報 SVG 翻頁
6. Versus Table (現有,微調)
7. ★ Service Cadence Timeline (NEW) — 年度服務節奏視覺化
8. ★ Product FAQ (NEW)              — 4-6 題 Surface 專屬
9. CTA section (現有,雙路徑強化)
```

#### 4.2.1 Hero 微調
- 大標保留 4 行(已驗證)
- 副標微調對齊 Code:「外部攻擊面年度治理服務 — 把評分轉成董事會看得懂的報告」
- 加一條 trust tag:「年度顧問訂閱模式」

#### 4.2.2 Proof Strip
| 指標 | 數字 | 副標 |
|---|---|---|
| 月報交付 | 每月 1 份正式 PDF | 可呈交董事會 |
| 顧問會議 | 60–90 分鐘/月 | 管理層解讀 |
| Surface 起步 Domain 數 | 25–50 個 | 30 天首份報告 |

(數字來源:25–50 Domain 自 `40W_SALES_SCRIPT.md` 行 51;60–90 分鐘自 `DELIVERY_CHECKLIST.md` 行 32;月報節奏自 `DELIVERY_CHECKLIST.md` 行 26–32。`EXECUTIVE_DEMO_DATASET.md` 只提供 demo 順序、不含這三個數字)

#### 4.2.3 Outcome Vignette(3 卡)
- **金融金控**:供應商風險治理 — 散落表格 → CISO 月報視圖
- **政府機關**:外部曝險合規申報 — 評分 dashboard → 法規對應 evidence
- **跨國 SaaS**:子公司 Portfolio 治理 — 多 domain 分散 → 統一 portfolio 月報

#### 4.2.4 Capability Cards(保留 4 張)
不動。

#### 4.2.5 Report Preview Flip(NEW)
3 頁模擬 CISO 月報(SVG/CSS,非真檔):
- 第 1 頁:**封面 + Executive Summary**(分數、趨勢、Top 3 風險)
- 第 2 頁:**Domain Top Backlog**(P0/P1 任務、責任 BU、工時估算)
- 第 3 頁:**法規對應 + ROI 試算**(資安法、個資法、ISO 27001)

左右箭頭翻頁,鍵盤 ← → 也可。底部「下載完整 sample(PDF)」link 到 `/resources`。

實作:`report-flip.tsx` client component,單 state(currentPage 0-2),SVG 內容 inline。**無 API**。

#### 4.2.6 Versus Table 微調
現況已 3 欄,只調文案讓 CBOM-forward 不衝突(Surface 是外部 + CISO 月報,跟 CBOM 矛尖是平行價值)。

#### 4.2.7 Service Cadence Timeline(NEW)
水平時間軸,12 個月節奏:
- M0:啟動評估(25-50 Domain)
- M1:第 1 份正式月報
- M2-M3:差異追蹤 + 修補建議
- Q1 末:季度治理檢討
- M4-M6:節奏穩定,趨勢驗證
- ...

實作:水平 scroll on mobile,grid on desktop。CSS-only,無互動。

#### 4.2.8 Product FAQ(4-6 題)
從 `40W_SALES_SCRIPT.md` 的「常見 objection」搬:
- Q1:SecurityScorecard 本來就有 dashboard,為什麼還要 Surface?
- Q2:為什麼是訂閱不是一次買斷?
- Q3:報價怎麼算?
- Q4:跟 Code 是兩份合約嗎?
- Q5:第一份月報多久能出?
- Q6:可以只選平台,不要顧問服務嗎?

實作:同 Code,`<details>` 摺疊。

#### 4.2.9 CTA section 強化
現況雙 CTA(下載 sample / Surface 諮詢),保留。新增 trust strip:
- 「不取代外部評分平台」
- 「報價依範圍而定」
- 「合約簽訂後 30 天內第一份月報」

---

## 5. 元件清單

### 5.1 新增 client components(共 8 個)

| 檔案 | 用途 | 頁面 |
|---|---|---|
| `src/components/code-proof-strip.tsx` | Code Proof Strip | `/code` |
| `src/components/surface-proof-strip.tsx` | Surface Proof Strip | `/surface` |
| `src/components/outcome-vignette.tsx` | 共用 3 卡情境(props 傳 cards) | `/code` & `/surface` |
| `src/components/code-tour.tsx` | Interactive Capability Tour | `/code` |
| `src/components/roi-mini.tsx` | Inline ROI Mini | `/code` |
| `src/components/report-flip.tsx` | Report Preview Flip | `/surface` |
| `src/components/service-cadence.tsx` | Service Cadence Timeline | `/surface` |
| `src/components/product-faq.tsx` | 共用 Product FAQ(props 傳 items) | `/code` & `/surface` |

**與既有 `src/components/faq.tsx` 的關係**:既有 `faq.tsx` 是首頁專屬、hard-coded 18 題 FAQ component(包含 `id="faq"` anchor),涵蓋通用問題。新的 `product-faq.tsx` 是 props-driven、產品內頁專屬,**兩者各司其職、不互相 refactor**。`faq.tsx` 保持原狀。

### 5.2 既有檔案需動

| 檔案 | 動作 |
|---|---|
| `src/app/code/page.tsx` | 重排 section 順序,引入新元件 |
| `src/app/surface/page.tsx` | 重排 section 順序,引入新元件 |

### 5.3 不動

- `src/app/page.tsx`(首頁)
- `src/components/{hero,stats,dual-pillars,compliance-matrix,navbar,footer,cta-contact,faq,features,product-proof,workflow,ai-health-check,pain-points,surface-spotlight}.tsx`
- `src/app/api/*`
- `next.config.ts` 的 redirects
- `productJsonLd` 結構

---

## 6. 資料 & 文案來源(可驗證)

| 來源 | 用途 |
|---|---|
| `WTMEC/EXECUTIVE_DEMO_DATASET.md` | Surface Proof Strip 數字、Demo 順序 |
| `WTMEC/40W_SALES_SCRIPT.md` | Surface FAQ 文案、年度服務節奏 |
| `WTMEC/DELIVERY_CHECKLIST.md` | Service Cadence 時間軸校準 |
| `WTMEC/DEMO_RUNBOOK.md` | Capability Tour 順序對齊 demo |
| `WTMEC/compliance_mapping.py` | Surface Capability「法規對應」內容核對 |
| `src/components/hero.tsx` 現有 mock 資料 | Code Tour 的 mock data(Core Banking API 等) |
| `src/components/product-proof.tsx` | DOI 引用、Peer-reviewed 來源 |
| `src/components/features.tsx` | VULNFORGE / 12 語言 數字校準 |
| `src/components/workflow.tsx` | Service Cadence Timeline 的 motion + 水平 layout pattern 參考(內容不抄,只抄結構) |

---

## 7. SEO / 結構化資料

- `metadata` 的 `title` / `description` 微調反映新內容(加 CBOM 矛尖、報告預覽等關鍵字)
- `productJsonLd`(在 `src/app/layout.tsx`)**不動**,結構保持
- 不新增 anchor link,既有頁內錨點(若有)保持

---

## 8. Mobile / a11y

- 所有新元件 mobile-first
- `overflow-x-hidden break-all` 維持
- Capability Tour tabs: 桌機 horizontal,mobile 改 dropdown
- Report Flip: 桌機左右箭頭,mobile swipe(用原生 scroll-snap,不引入 swiper lib)
- Service Cadence: 桌機 grid,mobile horizontal scroll
- 所有 FAQ 用 native `<details>`(內建 a11y)
- ROI Mini 的 input 用 `<label>` 包,a11y 完整

---

## 9. Guard / Test

- `guard:public-pricing` regex **不退步**:任何新文案不可含 40 萬 / NT$400,000 / 40W 等變體
- `tests/` 既有 node test 全綠
- `scripts/smoke-production.mjs` 現已覆蓋首頁與 `/resources`;**新增 2 個 URL 檢查**(`/code`、`/surface`),確認 200 + render 不報錯

---

## 10. 工程量估算

| 任務分組 | 估 task 數 | 風險 |
|---|---|---|
| 共用元件(outcome-vignette、product-faq) | 2 | 低 |
| `/code` 新元件 (proof-strip + tour + roi-mini) | 3 | 中(tour 有互動) |
| `/surface` 新元件 (proof-strip + report-flip + service-cadence) | 3 | 中(report-flip 有互動) |
| `/code/page.tsx` 重組 | 1 | 低 |
| `/surface/page.tsx` 重組 | 1 | 低 |
| Visual Versus 升級(/code) | 1 | 低 |
| Mobile/a11y pass | 1 | 低 |
| Guard + smoke 擴充 | 1 | 低 |
| 全頁 build + tsc + lint 驗證 | 1 | 低 |
| Sales runthrough 文檔更新 | 1 | 低 |

**總計 15 tasks 左右**,subagent-driven 跑 2-3 個 batch。

---

## 11. 開放問題(brainstorm 不擋,留給 plan 階段處理)

1. **Code Tour 用 SVG vs Lottie?** — SVG 路徑簡單但動效有限;Lottie 質感好但要 lib。**建議 SVG**(不新增 dep)。
2. **ROI Mini 顯示「節省工時」的具體公式?** — 留 plan 階段定義,要可解釋。
3. **Industry Vignette 是 3 卡還是 4 卡?** — 3 卡較緊湊,4 卡需要排版,**建議 3 卡**。
4. **Report Flip 第 3 頁要不要放 CTA?** — 不放,避免內元件搶 page CTA 焦點,**建議翻完 3 頁後在元件下方 link 到 `/resources`**。

---

## 12. 驗收條件

- [ ] `/code` 與 `/surface` 桌機 + mobile 體感一致,無 horizontal overflow
- [ ] CBOM-forward 定位在 `/code` 全頁體現(Capability Cards 第 1 位、Hero 副標、Tour 第 1 步)
- [ ] Surface 全頁不出現 40 萬絕對金額
- [ ] 所有新元件無 API call,純前端
- [ ] `npm run build` + `npm run lint` + `npm run typecheck` 全綠
- [ ] `npm test`(node test)全綠
- [ ] `guard:public-pricing` 通過
- [ ] `scripts/smoke-production.mjs` 通過
- [ ] `productJsonLd` 結構不退步
- [ ] 文檔:`docs/SALES_RUNTHROUGH.md` 補入 Round-2 區塊指南

---

**Spec 結束。下一步**:跑 spec-document-reviewer → 使用者驗收 → writing-plans。
