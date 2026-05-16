# PDF 資產再生流程 — puppeteer

本檔取代舊版 `docs/SGW_ASSET_PRODUCTION.md`。

## 為什麼換掉 SGW Python 流程

舊流程由 `security-governance-workbench` 內的 ReportLab 腳本(`ssc_*.py`)產出 PDF,
中文 (CJK) 字型在某些字元上顯示為 `?`。Sample 月報、服務說明書都受影響,
管理層不會接受看起來像出錯的 PDF。

新流程改用 puppeteer 把網站內部專用的「列印頁面」直接 render 成 PDF:

- HTML / CSS 由瀏覽器 (headless Chromium) 處理 → CJK 自然走 Noto Sans TC web font
- 內容跟現有元件(`compliance-matrix.tsx` 等)共享資料 → 不會 drift
- 整個流程留在 monorepo 內,不需要外部 Python pipeline

## 先決條件

- Node 20+
- 第一次跑 `npm install` 時 puppeteer 會下載自己的 Chromium binary,約 200–300 MB,
  目的地預設 `~/.cache/puppeteer`(Windows 為 `%LOCALAPPDATA%/puppeteer`),不會進 repo

## 一鍵再生

```bash
npm install            # 第一次或 puppeteer 版本變動時
npm run regenerate-pdfs
```

腳本會:

1. 啟動一個本機 `next dev`(預設 port 3000;可用 `NEXT_DEV_PORT` 換)
2. 等到 `/api/health` 回應 200(timeout 60 秒)
3. Launch puppeteer 後依序開三個列印頁面:
   - `/internal/asset-print/surface-proposal`
   - `/internal/asset-print/ciso-monthly-sample`
   - `/internal/asset-print/tw-compliance-matrix`
4. 每個頁面切到 print media type,輸出 A4 PDF(`printBackground: true`)
5. 寫到下列檔案路徑
6. 印出每份 PDF 的位元組大小,然後 kill `next dev`

### 已經有 `next dev` 在跑?

```bash
npm run regenerate-pdfs -- --no-spawn
```

腳本就會跳過 spawn,直接連到 `NEXT_DEV_HOST:NEXT_DEV_PORT`。

## 產出位置

| 檔案 | 路徑 | 對外? |
|------|------|--------|
| `surface-proposal.pdf` | `private/downloads/surface-proposal.pdf` | 需 lead capture → `/api/resources/download` 簽 URL → `/api/resources/file/...` |
| `ciso-monthly-sample.pdf` | `private/downloads/ciso-monthly-sample.pdf` | 需 lead capture(同上) |
| `tw-compliance-matrix.pdf` | `public/downloads/tw-compliance-matrix.pdf` | 公開,直接從 Vercel CDN 下載 |

## 修改內容

PDF 的內容、版型、字型都集中在
[`src/app/internal/asset-print/[id]/page.tsx`](../src/app/internal/asset-print/[id]/page.tsx)。

- 三個 ID 對應三份 PDF,各自的 React 元件 (`ServiceProposalPage` /
  `CisoMonthlySamplePage` / `TwComplianceMatrixPage`) 包在共用的 `PrintShell` 內
- 全頁列印 CSS 在 `PrintShell` 裡的 inline `<style>` 區塊,
  含 `@page { size: A4 }`、字型、表格、KPI 卡片等
- `tw-compliance-matrix` 的法規條目資料 array 直接複製自
  `src/components/compliance-matrix.tsx`,每次更新一個請順手把另一個改成一樣的內容

改完之後再執行一次 `npm run regenerate-pdfs`,然後 `git diff` 預覽 PDF 大小變動,提交即可。

## 部署到 Vercel

- 三份 PDF 都進 git(`.gitignore` 已經調整為允許追蹤)
- `private/downloads/**/*` 透過 [`next.config.ts`](../next.config.ts) 的
  `outputFileTracingIncludes` 被打包進 `/api/resources/file/[assetId]` 函式
- `public/downloads/*` 由 Vercel 自動上 CDN
- 不需要再有 ops SCP / rsync 步驟,也不需要 `DOWNLOAD_SIGNING_SECRET` 之外的額外設定

## 內部頁面安全性

`/internal/*` 路徑被 `src/proxy.ts` 擋住:
- 只允許從 `localhost`(任何 port)的請求 — 給本機 puppeteer 用
- 或請求 header 含 `x-admin-token` 等於 `ADMIN_TOKEN` 環境變數 — 給 ops 偵錯
- 其他情況直接回 404,不對外 acknowledge 路徑存在

## 失敗的常見原因

| 訊息 | 處置 |
|------|------|
| `Could not import 'puppeteer'` | 跑 `npm install`。若 Chromium 下載超時,設 `PUPPETEER_DOWNLOAD_BASE_URL` 鏡像或重試 |
| `next dev did not become ready within 60s` | 通常是 port 被佔。改 `NEXT_DEV_PORT=3010 npm run regenerate-pdfs` |
| 字型還是顯示成方框 | 確認跑時連得到 `fonts.googleapis.com`(CSP 已開白名單)。離線環境請改本地字型 + `next/font/local` |
| 表格被切到下一頁 | 在內容元件加 `className="avoid-break"`(已定義為 `page-break-inside: avoid`)|

## 旋轉提醒

- 旋轉 `DOWNLOAD_SIGNING_SECRET` 後,已發出的 5 分鐘下載連結會即時失效(預期行為)
- Sample 月報建議每季更新一次,以反映最新平台 UI 與法規對應
