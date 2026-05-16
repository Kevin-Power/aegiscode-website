export type ProductFaqItem = {
  q: string
  a: string
}

export type ProductFaqProps = {
  title?: string
  items: ProductFaqItem[]
}

export default function ProductFaq({
  title = "常見問題",
  items,
}: ProductFaqProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold">{title}</h2>
        <div className="divide-y divide-[#243447] overflow-hidden rounded-2xl border border-[#243447] bg-[#0F1923]">
          {items.map((item) => (
            <details
              key={item.q}
              className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="ml-2 text-[#14B8A6] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-gray-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
