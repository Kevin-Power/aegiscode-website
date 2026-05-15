# AegisCode 雙產品 Sales-Ready 官網設計

**日期**: 2026-05-15
**狀態**: 已批准設計,待寫實作計畫
**範圍倉庫**: `aegiscode-website`(本倉庫)
**外部依賴**: SGW (Python pipeline) 端產出 3 份對外 PDF 資產

---

## 1. 背景與動機

公司目前有兩套已存在的資安產品:

| 簡稱 | 位置 | 定位 | 棧 | 商業模式 |
|---|---|---|---|---|
| **AegisCode**(原 WT-Sonaqu / WT SecHub V2) | `WT-Sonaqu-2026-05-11/` | 企業內部 SAST + CBOM/PQC 平台 | Next.js 14 + Postgres + BullMQ + SonarQube | 軟體授權(Stripe + 30 天 POC) |
| **SGW (Security Governance Workbench)** | `security-governance-workbench-v0.1/.../WTMEC/` | 外部攻擊面治理 + CISO 顧問服務 | Python 3.10 + Streamlit + SQLite + SecurityScorecard + OpenAI | 年度顧問訂閱(40W/年起) |

兩者天然互補(內 vs 外、開發者 vs CISO、技術型 vs 顧問型、買斷 vs 訂閱、英文化技術指標 vs 中文化法規對應、單次掃描 vs 持續治理),目前由 `aegiscode-website` 對外行銷。

**問題**:目前官網以 AegisCode 單產品為主敘事,SGW 只以 `/external-risk` 隱性出現。業務無法用一張官網清楚銷售兩條產品線,SGW 既有的 sales asset(40W_SALES_SCRIPT、DEMO_RUNBOOK、DELIVERY_CHECKLIST、EXECUTIVE_DEMO_DATASET、CISO 月報產生器、服務說明書產生器、台灣法規對應)幾乎未被官網變現。

**目標**:**先把官網處理好讓業務能賣**——把 SGW 既有 sales asset 變現為官網內容與 lead-gen 資產,讓業務在 2-3 週後能帶客戶賣「Code(內) + Surface(外)」雙產品。

---

## 2. 設計決策(已批准)

| 決策 | 結論 |
|---|---|
| 合併路線 | **路線 A:Sales-ready 雙產品官網**(不動兩個產品後台) |
| 品牌結構 | **AegisCode 雙子品牌**:`AegisCode Code` + `AegisCode Surface` |
| Surface 定價揭露 | **繼續隱藏絕對金額**,僅標示「年約訂閱 — 報價依範圍而定」 |
| Trial 分流 | **三條路徑**:`AegisCode Code` / `AegisCode Surface` / `兩者都評估` |
| 主要語言 | 繁體中文(zh-Hant) |
| 動到的範圍 | 僅 `aegiscode-website` 前端、`/api/trial/signup`、新增 `/api/resources/download` |
| **不**動到的範圍 | AegisCode 掃描平台後台、SGW Python pipeline、License 後台 `/admin/*` 主邏輯 |

---

## 3. 範圍(Goals / Non-Goals)

### Goals
1. 業務能在 5 分鐘內透過官網講清「Code + Surface = 內外治理閉環」
2. `/trial` 三路分流,後台 audit log 標記 `track` 來源,業務看 lead 即知方向
3. `/resources` 三份 lead-gated PDF 可下載,Surface 銷售有實體素材
4. `/pricing` 雙商業模型(平台授權 vs 顧問訂閱)清楚對齊客戶決策路徑
5. SEO 不退步:`/external-risk` 301 → `/surface`,既有排名延續
6. `productJsonLd` 升級為 `ItemList`,Code 與 Surface 各自有 schema
7. 公開頁面**不揭露 40W 等具體年費數字**(由 `guard:public-pricing` 守規)

### Non-Goals
- ❌ 不動 AegisCode 掃描平台(`WT-Sonaqu-2026-05-11/`)
- ❌ 不動 SGW Python pipeline 程式碼
- ❌ 不做客戶 login portal(留給路線 B)
- ❌ 不開放 Surface self-service Stripe checkout(維持顧問諮詢後簽約)
- ❌ 不做品牌重塑、不改 logo、不改主視覺色系
- ❌ 不做英文版(EN 留給後續)
- ❌ 不修改 License 後台 `/admin/licenses` 與 `/admin/audit-log` 既有邏輯

---

## 4. 站點地圖(IA)

```
/                           首頁 — 雙能力敘事
/code                       AegisCode Code 產品頁(NEW)
/surface                    AegisCode Surface 產品頁(NEW,接收 /external-risk 301)
/pricing                    雙商業模型方案頁(重組)
/trial                      Lead 入口 — 三路分流(重組)
/resources                  下載資產中心(NEW)
/external-risk              → 308 permanent redirect → /surface
/roi                        保留現況
/dpa /privacy /terms        保留現況
/admin/licenses             不動
/admin/audit-log            不動
/api/trial/signup           擴充欄位(track, surface 專欄)
/api/resources/download     新增(NEW)
/api/license/* /api/stripe/* /api/admin/* /api/health   不動
```

### Navbar 結構
```
LOGO  |  產品 ▾  |  方案  |  資源 ▾  |  POC 申請  |  [預約 Demo CTA]
         ├ AegisCode Code      ├ 下載中心 (/resources)
         └ AegisCode Surface   ├ ROI 計算 (/roi)
                               └ 常見問題 (/#faq)
```

---

## 5. 頁面設計

### 5.1 首頁 `/`

**現況區塊順序**:Hero → PainPoints → Features → ProductProof → ExternalRisk → AiHealthCheck → Workflow → Stats → FAQ → CtaContact

**新版區塊順序**(粗體 = 新增/重做):

1. **Hero**(改文案)
   - 新主標:「從內部程式碼到外部攻擊面 — AegisCode 讓 CISO 一份報告交代兩面風險」
   - 副標:強調「內 + 外」治理閉環
   - 雙 CTA:`了解 Code` / `了解 Surface`

2. **PainPoints**(擴充)
   - 加 2 條 CISO 痛點:
     - 「外部曝險每月不知道有沒有下降」
     - 「內部弱點 + 外部評分 + 供應鏈風險 各自為政,管理層收不到統一報告」

3. **DualPillars**(新元件,Hero 後最重要)
   - 左卡 `AegisCode Code`:SAST · CBOM/PQC · SBOM/SCA · 主管審核 · 證據包 — CTA `看 Code 詳情`
   - 右卡 `AegisCode Surface`:評分整合 · AI 修補 · 法規對應 · CISO 月報 · 年度顧問訂閱 — CTA `看 Surface 詳情`

4. **Features**(維持元件,改 section 標題為「AegisCode Code 的能力」)

5. **ProductProof**(維持)

6. **SurfaceSpotlight**(取代現有 `ExternalRisk` 元件,內容升級)
   - 四象限:`SecurityScorecard 評分整合` / `AI 修補建議 P0–P3` / `台灣法規對應` / `顧問級 CISO 月報`
   - CTA:`了解 Surface 服務 → /surface`
   - 元件檔重命名:`external-risk.tsx` → `surface-spotlight.tsx`(向後相容:原檔保留 re-export 一段時間以避免 import 斷)

7. **ComplianceMatrix**(新元件)
   - 三欄展示:資通安全法 / 個資法 / ISO 27001:2022
   - 每欄列 3-5 條 Surface 能對應的條目(資料來源:`compliance_mapping.py` 抽出的 mapping)
   - 這是 Surface 對台灣金融/政府/高法遵客戶**最強的差異化**

8. **AiHealthCheck**(維持,微調 section eyebrow 標 `Code 特色`)

9. **Workflow**(維持,微調 eyebrow 標 `Code 工作流`)

10. **Stats**(微調)
    - 既有掃描相關數字保留
    - 加 1-2 條 Surface 相關(例如「平均月報產出時間」「P0 修補追蹤週期」),數字可保守

11. **FAQ**(擴充見 §5.7)

12. **CtaContact**(改)
    - 雙 CTA:`Code POC 申請 → /trial?track=CODE` / `Surface 顧問諮詢 → /trial?track=SURFACE`

**JSON-LD 變更**:
- 從單 `Product` schema 改為 `ItemList`,包含兩個子 `Product`:
  - `AegisCode Code`(SAST/CBOM/SCA)
  - `AegisCode Surface`(External Attack Surface Governance)
- `FAQPage` schema 同步加入 §5.7 新增 5 題

---

### 5.2 `/code` 新頁 — AegisCode Code 產品深度頁

聚焦業務帶開發/資安 BU 客戶看的內容:
- Hero:`一站式內部程式碼資安治理 — SAST + CBOM + SBOM + 主管審核閉環`
- 能力 5 區塊:SAST/弱點掃描 · CBOM/PQC 加密資產 · SBOM/SCA · 品質政策閘門 · 三層 RBAC 與審核
- 對比區:`AegisCode Code vs SonarQube Enterprise`(重用首頁 FAQ 第 3 題擴充)
- 部署選項:SaaS / 地端 / Air-gapped 條件
- 評估證據包:列出 POC 30 天可拿到的東西
- CTA:`預約 Code POC → /trial?track=CODE` / `下載評估白皮書 → /resources`(若有則連)

複用組件:`Features`、`AiHealthCheck`、`Workflow` 可在此頁也呈現(於 `/` 之外二次出現作為深度展開)。

---

### 5.3 `/surface` 新頁 — AegisCode Surface 產品深度頁

**重要**:此頁取代既有 `/external-risk`,內容升級為 SGW 完整商品化敘事。

舊 `/external-risk` 設定 308 permanent redirect → `/surface`(在 `next.config.ts` 的 `redirects()` 或 `middleware.ts` 處理)。

頁面結構(直接從 SGW 既有 4 份內部文件抽對外文案):

1. **Hero** — `外部攻擊面的年度治理服務,把評分變成董事會看得懂的報告`
2. **4 能力區**:
   - 評分整合(SecurityScorecard / BitSight / EASM 訊號)
   - AI 修補建議(P0–P3 優先級,含工時與 ROI)
   - 台灣法規對應(資安法/個資法/ISO 27001:2022)
   - 顧問級 CISO 月報(可呈交董事會的 PDF)
3. **vs SecurityScorecard 原生 dashboard 對比表**(內容來源:`40W_SALES_SCRIPT.md` 的 Objection 1 反向問答)
4. **服務範圍**:平台存取 + 每週差異 + 每月正式治理報告 + 季度治理檢討 + 顧問解讀會議(來源:`DELIVERY_CHECKLIST.md`)
5. **適用場景**:CISO / 資安主管 / 金融業 / 高法遵組織
6. **CTA 雙鍵**:
   - `下載服務說明書 → /resources`
   - `預約 Surface 諮詢 → /trial?track=SURFACE`

**對外不揭露**:40W 具體金額、SecurityScorecard token 取得方式、AI 修補使用的 LLM 細節、平台技術棧(Python/Streamlit/SQLite)。

---

### 5.4 `/pricing` 重組

**版型**:上方雙卡片並排雙商業模型 + 下方共同 POC 評估區。

**Code 卡片**:
- 標題:`AegisCode Code 平台授權`
- 三 tier 簡述:Starter / Professional / Enterprise(沿用現有文案)
- 底部標籤:`POC 後報價 · 30 天免費評估`
- CTA:`預約 Code POC → /trial?track=CODE`

**Surface 卡片**:
- 標題:`AegisCode Surface 顧問訂閱`
- 三 tier 簡述:基礎 / 進階 / 企業(內容對應 SGW 既有方案邏輯,但不揭金額)
- 底部標籤:`年約訂閱 · 報價依範圍而定`
- CTA:`預約 Surface 諮詢 → /trial?track=SURFACE`

**下方共同區**:
- 30 天 POC 評估內容(沿用現有 4 點 + 加入 Surface 適用的點)
- 連結到 `/resources` 下載資產

**沿用語氣**:現「方案資訊暫不公開」的克制語氣保留,避免 RFP 時手綁。

---

### 5.5 `/trial` 重組 — 三路分流

**新增第一個欄位**:`評估方向`(radio,必選)
- `AegisCode Code` — 程式碼掃描 / SAST / CBOM 評估
- `AegisCode Surface` — 外部攻擊面 / CISO 月報 / 顧問訂閱
- `兩者都評估` — 完整資安治理閉環

**條件渲染欄位**:

| 欄位 | Code | Surface | Both |
|---|---|---|---|
| 公司名稱 | ✅ | ✅ | ✅ |
| 公司信箱 | ✅ | ✅ | ✅ |
| 聯絡電話(選填) | ✅ | ✅ | ✅ |
| 團隊規模(developers 數) | ✅ | — | ✅ |
| Tier dropdown (Starter/Pro) | ✅ | — | — |
| Domain/Portfolio 規模 | — | ✅ | ✅ |
| 已有 SecurityScorecard/BitSight 授權 | — | ✅(yes/no) | ✅(yes/no) |
| 希望首份 CISO 月報的時程 | — | ✅(2-4-8 週) | ✅ |
| 主要驅動方(管理/開發/採購) | — | — | ✅(必填) |

**API 變更 `/api/trial/signup`**:
- 接受新欄位:`track ∈ { "CODE", "SURFACE", "BOTH" }`
- 接受新欄位(Surface/Both 路徑):`domainCount`(int), `hasExternalRating`(bool), `monthlyReportEta`(string), `decisionMaker`(string,Both 路徑)
- Surface 與 Both 路徑:**不**自動產 JWT(因為 Surface 是顧問服務,不是軟體授權),強制 `manualReview = true`,在 sales 通知 email 中標記

**成功畫面 UX 分流**(Trial 表單成功後顯示):
- `track = CODE`:沿用現有畫面 — 顯示 `licenseId`、`expiresAt`,Email 未設定時附帶 JWT
- `track = SURFACE` 或 `BOTH`:顯示 **「Surface 顧問諮詢已建立」** — 不顯示 License ID,改顯示「顧問會在 1-2 工作天內聯繫,先確認 Domain 規模、現有評分授權與時程」;同時建議客戶可順手下載服務說明書(連 `/resources`)
- Audit log 寫入 `track` 欄位,既有 `TRIAL_SIGNUP` action 擴充

**沿用機制**:rate limit、honeypot、Sentry log、Resend email 全沿用。

---

### 5.6 `/resources` 新頁 — 下載資產中心

**3 份 lead-gated 下載資產**:

| 資產 | 來源 | Gating | 大致內容 |
|---|---|---|---|
| **AegisCode Surface 服務說明書 PDF** | SGW 端離線跑 `ssc_service_proposal.py` 產出 | 留 email + 公司名 | 年度顧問服務範圍、交付物、流程、客戶責任、收費基礎(可含 40W 數字) |
| **CISO 月報 sample PDF** | SGW 端用**匿名化** demo DB 跑 `ssc_ciso_monthly_report_v3.py` | 留 email + 公司名 | 風險量化、Top Backlog、法規對應、ROI 試算 — 對外看「我們交付的長相」 |
| **台灣法規對應一覽表 PDF** | 從 `compliance_mapping.py` 抽出 mapping,設計師美編成 1-2 頁 PDF | **公開**(不 gating,利 SEO) | 資安法 / 個資法 / ISO 27001 → AegisCode 對應條目 |

**頁面結構**:
- Hero:`資安治理資產下載中心`
- 3 張卡片並列,每張:
  - 縮圖(PDF 第一頁低解析度截圖)
  - 標題 + 3-5 行說明
  - 「填寫 → 即時下載」按鈕(打開 modal 表單)
  - 預估閱讀時間(例如「8 分鐘讀完」)

**API 變更 — 新增 `/api/resources/download`**:
- POST `{ assetId, contactEmail, companyName, contactPhone? }`
- 套用 rate limit(同 trial signup 機制,3/hour/IP)
- 寫入 audit log:`action = "RESOURCE_DOWNLOAD"`, `assetId`, lead 資料
- Sales notification 一份(可關)
- 回傳 5 分鐘 expires 的單次性簽章 URL,例如 `/api/resources/file/<assetId>?token=<HMAC>&exp=<unix>`,由獨立 route handler 驗章後 stream 檔案內容
- **檔案存放決定**:`public/downloads/`(在 `.gitignore` 中,不入庫;ops 部署時手動放;不採用 Vercel Blob 以避免額外服務依賴);route handler 直接 read from `public/downloads/` 並 stream

**法規對應一覽表為公開資產**(不經過 `/api/resources/download`,直接 `<a href="/downloads/tw-compliance-matrix.pdf">` 即可下載),利於 SEO 與業務快速分享。

---

### 5.7 FAQ 擴充(首頁 + `/surface` 共用)

既有 4 題保留(地端部署、ZDR、vs SonarQube、SSO)。新增 5 題:

1. **Q**:`AegisCode Surface 跟 SecurityScorecard 原生 dashboard 差在哪?`
   **A**:Surface 提供中文化治理工作流、修補優先順序、台灣法規對應、風險量化與顧問交付報告;原生 dashboard 是原始評分視圖。

2. **Q**:`Surface 需要客戶自備 SecurityScorecard 授權嗎?`
   **A**:是,客戶提供 API token;Surface 也支援 BitSight 或客戶既有 EASM 工具的訊號整合。

3. **Q**:`CISO 月報長什麼樣?可以看 sample 嗎?`
   **A**:可,到 `/resources` 下載匿名化的 sample PDF。

4. **Q**:`Surface 是訂閱還是專案?`
   **A**:年度顧問訂閱,含平台、每週差異追蹤、每月治理報告、季度治理檢討與顧問解讀會議。

5. **Q**:`Code 跟 Surface 可以單買嗎?`
   **A**:可單買,合購有 bundle 折讓(實際數字在 POC 後報價)。

**JSON-LD**:`faqJsonLd` 同步加入新 5 題。

---

## 6. SEO 與遷移

| 項目 | 處理 |
|---|---|
| `/external-risk` URL | **308 permanent redirect → `/surface`**(透過 `next.config.ts` redirects 或 middleware) |
| `/external-risk` 內部連結 | 全部更新為 `/surface`(首頁 `surface-spotlight.tsx` CTA、navbar 等) |
| sitemap | 新頁 `/code` `/surface` `/resources` 加入(若有 sitemap 產生器),`/external-risk` 移除 |
| `productJsonLd` | 改 `ItemList`,含 Code + Surface 兩個 Product |
| Meta title/description | `/code` `/surface` `/resources` 各自設定中文 title 與 description |
| `og:image` | Surface 可設不同 og:image(若有時間)以利分享 |

---

## 7. Lead 資產產出(SGW 端一次性前置作業)

**這是路線 A 唯一外部依賴**。需要在 SGW 端執行的一次性產出工作:

| 步驟 | 動作 | 產出 | 負責方 |
|---|---|---|---|
| 1 | 用既有 `demo` 或 anonymized DB 跑 `python ssc_ciso_monthly_report_v3.py` | `CISO 月報_sample.pdf` | SGW ops |
| 2 | 跑 `python ssc_service_proposal.py --output aegiscode-surface-proposal.pdf --brand "AegisCode"` | `aegiscode-surface-proposal.pdf` | SGW ops |
| 3 | 從 `compliance_mapping.py` dump mapping,設計師美編成 1-2 頁 PDF | `tw-compliance-matrix.pdf` | 設計 + SGW ops |
| 4 | 三份 PDF 給 ops,放入 `aegiscode-website/public/downloads/`(或 Vercel Storage) | 部署 | website ops |

**驗收**:三份 PDF 內容對外可見、不含客戶資料、不含 API token、不含 internal sales script 措辭(例如「框價」「objection 應對」字眼)。

---

## 8. 驗收標準(Acceptance Criteria)

實作完成需通過以下:

1. ✅ 業務在客戶面前可 **5 分鐘內**透過首頁講完「Code + Surface = 內外治理閉環」
2. ✅ `/trial` 三條路徑分流正確,後端 audit log 看得到 `track` 欄位,sales notification email 標明 track
3. ✅ `/resources` 三份 PDF 都有可下載版本,lead capture 後台寫入正常
4. ✅ `/pricing` 雙商業模型卡片並列,Code(POC 後報價)與 Surface(年約)分區清楚
5. ✅ 既有 `/external-risk` URL **308 不斷**,Google ranking 延續
6. ✅ `productJsonLd` 升級為 `ItemList`,含 Code 與 Surface 兩個 Product schema
7. ✅ `faqJsonLd` 含 9 題(原 4 + 新 5)
8. ✅ `npm run readiness` 全綠(現有檢查不退步)
9. ✅ `npm run smoke:production` 全綠
10. ✅ `npm run guard:public-pricing` 守規:`/pricing` `/surface` `/code` `/resources` HTML 中**不出現**「40 萬」「40W」「四十萬」「400000」「NT$400,000」「NTD400,000」等具體數字 — guard 的 regex 在 planning 階段更新涵蓋這些變體
11. ✅ `npm run guard:public-branding` 沿用 — 既有檢查不退步
12. ✅ License 後台(`/admin/*`)零受影響:`/admin/licenses` 與 `/admin/audit-log` 既有功能完全保留
13. ✅ TypeScript strict 通過、ESLint 通過
14. ✅ Sentry 既有整合不退步

---

## 9. 風險與待解事項

| 風險 | 影響 | 緩解 |
|---|---|---|
| SGW 端產 sample PDF 需時間,卡 `/resources` 上線 | 中 | `/resources` 可分階段上線:第一階段先上 `tw-compliance-matrix.pdf`(資料最易產),其餘兩份後補 |
| 業務若把 40W 數字寫進站上文案 | 高(違反隱藏策略) | `guard:public-pricing` 已在 readiness 中阻擋;新增 check 涵蓋 `/surface` `/pricing` |
| `/external-risk` 舊 URL 還有人在外部分享連結 | 低(SEO) | 308 permanent redirect + 內部連結全改 |
| Surface 三 tier 命名與 SGW 內部文件不一致 | 中 | 文案校對階段對齊 SGW `40W_SALES_SCRIPT.md` 的「進階方案」說法 |
| 客戶從 `/trial?track=SURFACE` 進來,但業務以 CODE 流程接待 | 中 | sales notification email 明標 `track`,加 emoji 或 colored badge |
| `external-risk.tsx` 元件改名後外部 import 斷 | 低 | 保留舊檔名 re-export 至少 30 天,加 deprecation comment |
| 移動到 Next 16 後 redirects API 可能有變化 | 低 | 設計使用 stable redirects,中介層 fallback 可用 middleware |

---

## 10. 時程估計

純前端 + 內容,**2–3 週**:

- 第 1 週:`/code` `/surface` 頁、`surface-spotlight` 元件、`ComplianceMatrix` 元件、Navbar 改造、首頁區塊重排、JSON-LD 升級
- 第 2 週:`/pricing` 重組、`/trial` 三路分流 + API 擴充、`/resources` + `/api/resources/download`、FAQ 擴充、SEO redirect
- 第 3 週:lead asset 整合(等 SGW 端 PDF)、guard 與 readiness 更新、smoke 測試、業務試講演練

---

## 11. 不在本 spec 範圍(留給未來)

- 路線 B:客戶 login portal(看授權狀態、下載歷史報告、看 demo dashboard 截圖)
- 路線 C:品牌重塑、logo / 主視覺
- 英文版 i18n
- Surface self-service Stripe checkout
- 把 SGW Python 重寫進 Next.js 棧(技術平台整合)
- Surface 與 Code 共用 customer auth 與資料庫
- 月報自動推送(透過 webhook 由 SGW 觸發到客戶 inbox)
