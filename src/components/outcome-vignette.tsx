import type { LucideIcon } from "lucide-react"

export type OutcomeVignetteCard = {
  icon: LucideIcon
  scenario: string
  pain: string
  outcome: string
}

export type OutcomeVignetteProps = {
  title: string
  subtitle?: string
  cards: OutcomeVignetteCard[]
  accentClass?: string
}

export default function OutcomeVignette({
  title,
  subtitle,
  cards,
  accentClass = "text-[#14B8A6]",
}: OutcomeVignetteProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="mb-10 max-w-3xl text-sm leading-7 text-gray-400">
            {subtitle}
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.scenario}
                className="rounded-2xl border border-[#243447] bg-[#0F1923] p-6"
              >
                <Icon className={`mb-4 h-6 w-6 ${accentClass}`} />
                <div className="text-base font-semibold text-white">
                  {card.scenario}
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                  痛點
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-300">{card.pain}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-500">
                  使用後
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-200">
                  {card.outcome}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
