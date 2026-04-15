import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AegisCode — Enterprise Code Quality & Security Platform",
  description:
    "AegisCode 企業級程式碼品質與安全平台。支援 30+ 語言靜態分析、AI 程式碼健檢、多 BU 管理、審核工作流，讓每一行程式碼都值得信賴。",
  keywords: [
    "code quality",
    "code security",
    "SAST",
    "static analysis",
    "AI code review",
    "SonarQube",
    "企業資安",
    "程式碼掃描",
  ],
  openGraph: {
    title: "AegisCode — Enterprise Code Quality & Security Platform",
    description:
      "讓每一行程式碼都值得信賴。Enterprise-grade code quality and security scanning.",
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
