import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aegiscode.yilutek.com"),
  title: "AegisCode - SAST、CBOM、外部風險與台灣合規證據平台",
  description:
    "AegisCode 為台灣金融與高法遵組織提供 SAST 弱點掃描、CBOM/PQC 加密資產盤點、SBOM/SCA、外部風險資料整合與可稽核的合規證據包。",
  keywords: [
    "code quality",
    "code security",
    "SAST",
    "static analysis",
    "AI code review",
    "SAST-in-the-Loop",
    "VULNFORGE",
    "CBOM",
    "PQC",
    "SBOM",
    "SCA",
    "cryptographic inventory",
    "SonarQube",
    "SecurityScorecard",
    "third-party risk management",
    "external attack surface management",
    "程式碼治理",
    "台灣金融合規",
  ],
  openGraph: {
    title: "AegisCode - SAST、CBOM、外部風險與台灣合規證據平台",
    description:
      "SAST 弱點掃描、CBOM 加密資產盤點、外部風險資料整合與合規證據包，一站完成。",
    url: "https://aegiscode.yilutek.com",
    siteName: "AegisCode",
    images: [
      {
        url: "/og-aegiscode.svg",
        width: 1200,
        height: 630,
        alt: "AegisCode - SAST、CBOM、外部風險與台灣合規證據平台",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AegisCode - SAST、CBOM、外部風險與台灣合規證據平台",
    description:
      "SAST 弱點掃描、CBOM 加密資產盤點、外部風險資料整合與合規證據包，一站完成。",
    images: ["/og-aegiscode.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${inter.variable} antialiased`}>
      <body className="bg-[#0D1521] text-white min-h-screen">{children}</body>
    </html>
  );
}
