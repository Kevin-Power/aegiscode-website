# Lead sink — Google Sheet 部署說明

`/trial` 送出的 POC 評估與合作洽談申請，除了寄出通知信之外，會再寫一列到 Google Sheet。
本目錄的 [`lead-sink.gs`](lead-sink.gs) 就是接收端。

網站端的呼叫程式在 [`src/lib/sheets-lead.ts`](../../src/lib/sheets-lead.ts)。

---

## 架構

```
/trial 表單 → POST /api/trial/signup → appendLead()
                                          ↓ HTTPS + 共享密鑰
                              Apps Script Web App (/exec)
                                          ↓
                                   Google Sheet「Leads」分頁
```

寫入是 **best-effort**：Google 不通、逾時、或環境變數沒設，都只寫 log，不會讓客戶的表單送不出去。
通知信（`SALES_NOTIFY_EMAIL`）是這條資料的備援路徑，兩邊都收得到同一筆申請。

---

## 部署步驟

### 1. 建立試算表

1. 到 [sheets.new](https://sheets.new) 建一份新的試算表，命名例如 `AegisCode Leads`
2. 不用手動建欄位——第一次寫入時腳本會自動建立 `Leads` 分頁與標題列

### 2. 貼上腳本

1. 在該試算表點 **擴充功能 → Apps Script**
2. 刪掉預設的 `Code.gs` 內容，貼上 [`lead-sink.gs`](lead-sink.gs) 全文
3. 存檔（專案名稱可設為 `AegisCode Lead Sink`）

### 3. 設定共享密鑰

先產生一組夠長的隨機密鑰：

```bash
openssl rand -hex 32
```

然後在 Apps Script 編輯器：

1. 左側 **專案設定**（齒輪圖示）
2. 捲到最下面 **指令碼屬性 → 新增指令碼屬性**
3. 屬性名稱填 `WEBHOOK_SECRET`，值貼上剛剛產生的密鑰
4. 儲存

> **不要把密鑰寫進 `lead-sink.gs`。** 那個檔案在 git 裡，寫進去等於推一組外洩憑證上 GitHub。

### 4. 部署成 Web App

1. 右上 **部署 → 新增部署作業**
2. 類型選 **網頁應用程式**
3. 設定：
   - **執行身分**：我（你的帳號）
   - **具有存取權的使用者**：**任何人**
4. 按 **部署**，第一次會要求授權，同意即可
5. 複製 **網頁應用程式網址**（結尾是 `/exec`）

> 「任何人」是必要的——Vercel 的伺服器不會帶著你的 Google 身分。這也是為什麼密鑰檢查是唯一的門，請保管好那組密鑰。

### 5. 設定 Vercel 環境變數

```bash
vercel env add GOOGLE_SHEETS_WEBHOOK_URL production
# 貼上步驟 4 的 /exec 網址

vercel env add GOOGLE_SHEETS_WEBHOOK_SECRET production
# 貼上步驟 3 的同一組密鑰
```

兩個都是 **server-only**，絕對不要加 `NEXT_PUBLIC_` 前綴——那會把寫入端點和密鑰一起打包進瀏覽器。

設完要重新部署一次網站，環境變數才會生效。

---

## 驗證

部署後送一筆測試申請：

```bash
curl -X POST https://aegiscode.yilutek.com/api/trial/signup \
  -H "Content-Type: application/json" \
  -d '{"companyName":"測試公司","contactEmail":"test@example.com","track":"PARTNER","partnerType":"reseller","partnerNote":"測試"}'
```

預期：

- 回應 `202` 且 `manualReview: true`
- Google Sheet 的 `Leads` 分頁多一列
- `IT@yilutek.com` 收到通知信

沒進 Sheet 的話，看 Vercel 的 runtime log 找 `[sheets-lead]`：

| Log 訊息 | 意思 |
|---|---|
| `skipped — webhook not configured` | 環境變數沒設或沒重新部署 |
| `append rejected by Apps Script` + `forbidden` | 兩邊密鑰對不起來 |
| `append rejected by Apps Script` + `not configured` | Apps Script 的 `WEBHOOK_SECRET` 指令碼屬性沒設 |
| `append failed` | 逾時或網路問題 |

---

## 維運

**改欄位**：`lead-sink.gs` 的 `COLUMNS` 和 `src/lib/sheets-lead.ts` 的 `LeadRow` 要同步改。
新欄位一律加在 `COLUMNS` **最後面**，這樣既有列的欄位意義不會跑掉。改完要重新部署 Apps Script（部署 → 管理部署作業 → 編輯 → 版本選「新版本」）。

**輪替密鑰**：改 Apps Script 的指令碼屬性 + Vercel 環境變數即可，不用重新部署 Apps Script。兩邊要同時改，中間會有短暫的申請寫不進 Sheet（但通知信照常）。

**注意事項**：
- Apps Script 每天有配額限制（一般帳號 20,000 次 URL 請求／天），以申請表單的量體不會碰到
- 腳本會把 `=`、`+`、`-`、`@` 開頭的內容加上單引號前綴，避免客戶送出的字串被 Sheets 當公式執行
- 客戶聯絡資料會存放在這份 Google Sheet，若要更新 `/privacy` 的資料處理說明，記得一併調整
