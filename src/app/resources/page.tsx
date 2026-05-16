import ResourcesClient from "./resources-client"

export const metadata = {
  title: "資源中心 — AegisCode",
  description:
    "下載 AegisCode Surface 服務說明書、CISO 月報 sample 與台灣法規對應一覽表。",
}

export default function ResourcesPage() {
  return <ResourcesClient />
}
