import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AegisCode — Code Quality, CBOM & PQC Governance Platform",
  description:
    "AegisCode 企業級程式碼品質、CBOM/PQC 加密資產盤點與稽核證據平台。支援 SAST、AI 程式碼健檢、主管審核、證據匯出與金融合規 demo。",
  keywords: [
    "code quality",
    "code security",
    "SAST",
    "static analysis",
    "AI code review",
    "CBOM",
    "PQC",
    "cryptographic inventory",
    "SonarQube",
    "企業資安",
    "程式碼掃描",
  ],
  openGraph: {
    title: "AegisCode — Code Quality, CBOM & PQC Governance Platform",
    description:
      "從程式碼弱點到加密資產，一次產出可稽核的治理證據。",
    type: "website",
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
