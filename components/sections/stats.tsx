const STATS = [
  { value: "15+", label: "shadcn 컴포넌트" },
  { value: "6+", label: "검증된 라이브러리" },
  { value: "4개", label: "핵심 페이지" },
  { value: "100%", label: "TypeScript" },
]

export function Stats() {
  return (
    <section id="stats" className="border-y bg-muted/50 px-4 py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-1 text-4xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
