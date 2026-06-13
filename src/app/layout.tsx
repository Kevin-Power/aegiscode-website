import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aegiscode.yilutek.com"),
  title: "AegisCode - CBOM/PQC、SAST 與外部風險治理平台",
  description:
    "AegisCode 為台灣金融與高法遵組織提供 CBOM/PQC 加密資產盤點、SAST 與外部風險整合，產出主管可審核的合規證據包。",
  keywords: [
    "code quality",
    "code security",
    "SAST",
    "DAST",
    "static analysis",
    "AI code review",
    "SAST-in-the-Loop",
    "VULNFORGE",
    "CBOM",
    "PQC",
    "SBOM",
    "SCA",
    "Container scan",
    "Secrets scan",
    "IaC scan",
    "cryptographic inventory",
    "SonarQube",
    "SecurityScorecard",
    "third-party risk management",
    "external attack surface management",
    "SOC 2",
    "SAML SSO",
    "F-ISAC",
    "Compliance Dashboard",
    "audit log",
    "Group CISO",
    "程式碼治理",
    "台灣金融合規",
  ],
  openGraph: {
    title: "AegisCode - CBOM/PQC、SAST 與外部風險治理平台",
    description:
      "CBOM/PQC inventory 為核心，整合 SAST 與外部風險評分，產出主管可審核的合規證據包。",
    url: "https://aegiscode.yilutek.com",
    siteName: "AegisCode",
    images: [
      {
        url: "/og-aegiscode.svg",
        width: 1200,
        height: 630,
        alt: "AegisCode - CBOM/PQC、SAST 與外部風險治理平台",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AegisCode - CBOM/PQC、SAST 與外部風險治理平台",
    description:
      "CBOM/PQC inventory 為核心，整合 SAST 與外部風險評分，產出主管可審核的合規證據包。",
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
