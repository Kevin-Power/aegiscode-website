const legalLinks = [
  { label: "隱私權政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
  { label: "資料處理協議 DPA", href: "/dpa" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#243447]/50 bg-[#0A0F18] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2 text-sm text-gray-500">
          <p className="font-medium text-gray-300">
            AegisCode 由宜路科技股份有限公司開發與營運
          </p>
          <p>AegisCode 是 Yilutek Security Suite 的程式碼與攻擊面治理產品線</p>
          <p>Yilutek Co., Ltd.</p>
          <p>正式網站：https://aegiscode.yilutek.com</p>
          <p>統一編號：90898596</p>
          <p>
            聯絡信箱：
            <a href="mailto:sales@aegiscode.com" className="text-[#14B8A6] hover:underline">
              sales@aegiscode.com
            </a>
          </p>
          <p>業務電話：採購建檔時提供</p>
          <p className="pt-2">
            © 2026 宜路科技股份有限公司 Yilutek Co., Ltd. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
