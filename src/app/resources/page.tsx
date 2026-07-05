import ResourcesClient from "./resources-client"

export const metadata = {
  title: "PQC / CBOM 與台灣金融合規資源下載 — AegisCode",
  description:
    "下載台灣法規對應一覽表(資通安全管理法 × 個資法 × ISO 27001 × 金管會 2026 PQC 遷移指引)、CISO 月報範本與 Surface 服務說明書。",
}

export default function ResourcesPage() {
  return <ResourcesClient />
}
