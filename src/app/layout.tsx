import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AegisCode — SAST-in-the-Loop, CBOM & Taiwan Compliance Platform",
  description:
    "AegisCode 企業級 SAST-in-the-Loop、CBOM/PQC、SBOM/SCA 與稽核證據平台。支援 VULNFORGE AI review、主管審核、證據匯出與台灣金融合規 demo。",
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
    "企業資安",
    "程式碼掃描",
  ],
  openGraph: {
    title: "AegisCode — SAST-in-the-Loop, CBOM & Taiwan Compliance Platform",
    description:
      "從程式碼弱點、相依套件到加密資產，一次產出可稽核的治理證據。",
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
