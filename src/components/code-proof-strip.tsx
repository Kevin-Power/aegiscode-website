const kpis = [
  {
    value: "DOI 10.3390/math14061072",
    label: "Peer-reviewed",
    sub: "Mathematics, MDPI",
    href: "https://www.mdpi.com/2227-7390/14/6/1072",
  },
  {
    value: "30 天",
    label: "POC 期程",
    sub: "Code POC 已開放",
  },
  {
    value: "123 規則",
    label: "CBOM 加密盤點",
    sub: "深度涵蓋 9 種主流後端語言",
  },
] as const

export default function CodeProofStrip() {
  return (
    <section className="border-y border-[#243447] bg-[#0A0F18]/90 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {kpis.map((kpi) => {
          const inner = (
            <>
              <div className="text-xl font-bold text-[#14B8A6] sm:text-2xl break-all">
                {kpi.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">
                {kpi.label}
              </div>
              <div className="mt-1 text-sm leading-6 text-gray-300">
                {kpi.sub}
              </div>
            </>
          )
          return "href" in kpi && kpi.href ? (
            <a
              key={kpi.label}
              href={kpi.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-[#243447] bg-[#101B28] p-5 transition hover:border-[#14B8A6]/50"
            >
              {inner}
            </a>
          ) : (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#243447] bg-[#101B28] p-5"
            >
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
