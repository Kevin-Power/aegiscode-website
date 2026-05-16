const kpis = [
  {
    value: "每月 1 份",
    label: "正式月報交付",
    sub: "可呈交董事會",
  },
  {
    value: "60–90 分鐘",
    label: "顧問解讀會議",
    sub: "管理層每月參與",
  },
  {
    value: "25–50 個",
    label: "Surface 起步 Domain",
    sub: "30 天內首份正式報告",
  },
] as const

export default function SurfaceProofStrip() {
  return (
    <section className="border-y border-[#243447] bg-[#0A0F18]/90 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-[#243447] bg-[#101B28] p-5"
          >
            <div className="text-xl font-bold text-sky-300 sm:text-2xl">
              {kpi.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">
              {kpi.label}
            </div>
            <div className="mt-1 text-sm leading-6 text-gray-300">{kpi.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
