import {
  Zap,
  Shield,
  Palette,
  LayoutDashboard,
  Code2,
  Smartphone,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const FEATURES = [
  {
    icon: Zap,
    title: "빠른 성능",
    description:
      "Next.js 15 App Router와 React Server Components로 최적화된 렌더링 성능을 제공합니다.",
  },
  {
    icon: Shield,
    title: "타입 안전성",
    description:
      "TypeScript + Zod로 런타임과 컴파일 타임 모두에서 타입 안전성을 보장합니다.",
  },
  {
    icon: Palette,
    title: "다크 모드",
    description:
      "next-themes 기반 다크/라이트 모드 전환. CSS 변수로 쉽게 커스터마이징 가능합니다.",
  },
  {
    icon: LayoutDashboard,
    title: "대시보드 레이아웃",
    description:
      "ShadCN Sidebar 기반의 반응형 대시보드 레이아웃이 즉시 사용 가능합니다.",
  },
  {
    icon: Code2,
    title: "폼 & 유효성 검사",
    description:
      "React Hook Form + Zod로 구성된 로그인/회원가입 폼이 준비되어 있습니다.",
  },
  {
    icon: Smartphone,
    title: "완전한 반응형",
    description:
      "usehooks-ts의 useMediaQuery로 모든 디바이스에서 최적화된 UI를 제공합니다.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            모든 것이 준비되어 있습니다
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            반복적인 설정 없이 핵심 기능 개발에 집중하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
