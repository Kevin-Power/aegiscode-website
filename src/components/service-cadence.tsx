import { Calendar, CheckCircle2, FileText, RefreshCcw, BarChart3, Expand, Trophy } from "lucide-react"

const milestones = [
  {
    icon: Calendar,
    timing: "M0",
    title: "啟動評估",
    desc: "確認 25–50 個 Domain、Portfolio 範圍與聯絡窗口",
  },
  {
    icon: FileText,
    timing: "M1",
    title: "首份正式月報",
    desc: "Domain PDF + Portfolio PDF + 顧問解讀會議",
  },
  {
    icon: RefreshCcw,
    timing: "M2–M3",
    title: "差異追蹤 + 修補建議",
    desc: "每週 enrich + 每月修補任務更新",
  },
  {
    icon: BarChart3,
    timing: "Q1 末",
    title: "季度治理檢討",
    desc: "平均分數趨勢、P0/P1 任務、修補 ROI",
  },
  {
    icon: CheckCircle2,
    timing: "M4–M6",
    title: "節奏穩定",
    desc: "趨勢驗證、管理層持續參與顧問會議",
  },
  {
    icon: Expand,
    timing: "M7–M9",
    title: "擴展範圍",
    desc: "依需求新增 Domain / Portfolio,持續監控",
  },
  {
    icon: Trophy,
    timing: "M10–M12",
    title: "年度成效總結",
    desc: "KPI 改善幅度、續約方案與下年度治理目標",
  },
]

export default function ServiceCadence() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold">12 個月服務節奏</h2>
        <p className="mb-10 max-w-3xl text-sm leading-7 text-gray-400">
          年度顧問訂閱不是一次性專案。節奏化的差異追蹤、月報與顧問會議,讓管理層每月都能掌握外部風險是否下降。
        </p>

        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-7">
            {milestones.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.timing}
                  className="flex w-60 shrink-0 flex-col rounded-xl border border-[#243447] bg-[#0F1923] p-4 md:w-auto"
                >
                  <Icon className="mb-3 h-5 w-5 text-sky-300" />
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                    {m.timing}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {m.title}
                  </div>
                  <div className="mt-2 text-xs leading-6 text-gray-400">
                    {m.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
