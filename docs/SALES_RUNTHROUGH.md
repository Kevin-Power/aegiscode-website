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

---

## Round-2 內頁加深(2026-05-16 ship)

`/code` 與 `/surface` 兩個內頁新增的 section,搭配下列銷售話術。

### `/code` 新區塊對應話術

| 區塊 | 帶客戶 demo 講什麼 | 來源/根據 |
|---|---|---|
| Hero(CBOM-forward) | 「AegisCode Code 的矛尖是 CBOM/PQC 加密資產盤點,其他能力都是支援體系」 | `15f692b` 定位 shift |
| Code Proof Strip | 「DOI 10.3390/math14061072 是 peer-reviewed,POC 30 天,12 種開發語言」 | `product-proof.tsx` 引用同一 DOI |
| Outcome Vignette | 「3 個典型場景:金控 CBOM、政府 air-gapped、製造多語言。您屬於哪一個?」 | 不具名情境,引導客戶自我定位 |
| Capability Cards(6 卡,CBOM 首位) | 「6 個能力,排第 1 的就是矛尖能力」 | 對齊 CBOM-forward |
| Code Tour | 4-step click through:CBOM 盤點 → SAST findings → VULNFORGE 修補 → Quality Gate | `DEMO_RUNBOOK.md` demo 順序 |
| Visual Versus(3 欄) | 「vs SonarQube,5 個維度差異化:程式碼品質持平、CBOM/PQC 矛尖、繁中/主管審核/合規證據包全勝」 | 既有 vs 表升級 |
| ROI Mini | 「您選 3 個維度,我們估給您看 30 天 POC 能產出多少 finding。實際 POC 會校準」 | 純估算,線性映射可解釋 |
| Product FAQ(4 題) | Snyk/Veracode/Checkmarx 差異 / CBOM 合規可用性 / Air-gapped 部署 / POC 範圍 | 不重複首頁 `faq.tsx` |
| POC CTA(雙路徑) | 熱:`/trial?track=CODE`;冷:`/resources` 下載合規證據包;備用:mailto sales | 雙速分流 |

### `/surface` 新區塊對應話術

| 區塊 | 帶客戶 demo 講什麼 | 來源/根據 |
|---|---|---|
| Surface Proof Strip | 「每月 1 份正式月報,60–90 分鐘顧問會議,起步 25–50 個 Domain」 | `DELIVERY_CHECKLIST.md` + `40W_SALES_SCRIPT.md` |
| Outcome Vignette | 「3 個 CISO 場景:金控供應商風險、政府曝險合規、跨國 SaaS Portfolio」 | `40W_SALES_SCRIPT.md` 客戶痛點 |
| Report Flip(3 頁翻) | 翻 3 頁:封面 Exec Summary → Domain Top Backlog → 法規對應 + ROI | `monthly_watchlist_pdf.py` 的實際月報結構 |
| Service Cadence(12 個月) | M0 啟動 → M1 首份月報 → Q1 末檢討 → M12 年度總結 | `DELIVERY_CHECKLIST.md` |
| Product FAQ(4 題) | SecurityScorecard/BitSight 差異 / 訂閱 vs 買斷 / 報價 / 首次月報期程 | `40W_SALES_SCRIPT.md` 客戶問題 |

### Round-2 切記

- 不在公開頁面講絕對金額(40 萬 / 400,000 / NT$ 任一變體都被 guard 擋)
- ROI Mini 的數字是「估算」——客戶問細節時引導到 POC 校準對話
- Report Flip 內容是匿名化情境(「某金控 BU」),不對應任何真實客戶
- Code Tour 的 mock data(Critical findings、TLS 1.3 等)是 demo 情境,不暗示實際客戶資料
- `/code` Hero 從 4 行 stacked 縮成 3 行;`/surface` Hero 維持 4 行(已驗證 mobile 體感)
