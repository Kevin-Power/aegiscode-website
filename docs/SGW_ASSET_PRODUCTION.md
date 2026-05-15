# SGW-side 一次性產出資產

本網站的 `/resources` 頁面期望 ops 在部署時把以下 3 份 PDF 放到 `public/downloads/`。檔案不入 git(`.gitignore` 已排除 `public/downloads/*.pdf`)。

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

1. ops 把 3 份 PDF SCP / rsync 到 Vercel 部署機器的 `aegiscode-website/public/downloads/`,或透過 Vercel 介面上傳
2. 重新部署或讓檔案在下次部署時帶上線
3. Smoke 測試:
   - `curl -sI https://aegiscode.yilutek.com/downloads/tw-compliance-matrix.pdf` 應該回 200
   - 從瀏覽器走完 `/resources` 流程,確認 gated 資產的 POST → 簽章 URL → GET 串完整
4. 設定 `DOWNLOAD_SIGNING_SECRET`(或沿用既有的 `ADMIN_TOKEN`)在 Vercel 環境變數

## 旋轉提醒

- 旋轉 `DOWNLOAD_SIGNING_SECRET` 後,已發出的下載連結會即時失效(預期行為)
- 月報 sample 建議每季更新一次,以反映最新平台 UI 與 mapping
