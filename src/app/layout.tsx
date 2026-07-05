import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aegiscode.yilutek.com"),
  title: "金管會 PQC 遷移指引因應｜程式碼層 CBOM 盤點 — AegisCode",
  description:
    "金管會 2026《後量子密碼遷移參考指引》要求建立加密資產清冊（CBOM）。AegisCode 在 CI 內自動產出程式碼層 CBOM，整合 SAST/SCA 與 AI 程式碼審查，為台灣金融機構提供可稽核的盤點證據。",
  keywords: [
    "code quality",
    "code security",
    "SAST",
    "DAST",
    "static analysis",
    "AI code review",
    "SAST-in-the-Loop",
    "CBOM",
    "PQC",
    "SBOM",
    "SCA",
    "Container scan",
    "Secrets scan",
    "IaC scan",
    "cryptographic inventory",
    "後量子密碼遷移",
    "金管會 PQC 指引",
    "third-party risk management",
    "external attack surface management",
    "AI supply chain security",
    "MCP configuration",
    "AI 開發鏈攻擊面",
    "地端部署",
    "on-premise",
    "air-gapped",
    "SOC 2 evidence support",
    "SAML SSO",
    "F-ISAC 自評",
    "Compliance Dashboard",
    "audit log",
    "Group CISO",
    "程式碼治理",
    "台灣金融合規",
  ],
  openGraph: {
    title: "金管會 PQC 遷移指引因應｜程式碼層 CBOM 盤點 — AegisCode",
    description:
      "在 CI 內自動產出程式碼層 CBOM，對應金管會 2026《後量子密碼遷移參考指引》，為台灣金融機構提供可稽核的盤點證據。",
    url: "https://aegiscode.yilutek.com",
    siteName: "AegisCode",
    images: [
      {
        url: "/og-aegiscode.svg",
        width: 1200,
        height: 630,
        alt: "AegisCode｜程式碼層 CBOM／PQC 加密資產盤點平台",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "金管會 PQC 遷移指引因應｜程式碼層 CBOM 盤點 — AegisCode",
    description:
      "在 CI 內自動產出程式碼層 CBOM，對應金管會 2026《後量子密碼遷移參考指引》，為台灣金融機構提供可稽核的盤點證據。",
    images: ["/og-aegiscode.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="antialiased">
      <body className="bg-[#0D1521] text-white min-h-screen">{children}</body>
    </html>
  );
}
