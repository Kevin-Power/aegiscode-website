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
