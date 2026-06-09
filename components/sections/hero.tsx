import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center">
      <Badge variant="secondary" className="mb-6 gap-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        Next.js 15 + ShadCN UI 스타터킷
      </Badge>
      <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        빠르게 시작하는
        <br />
        <span className="text-muted-foreground">모던 웹 개발</span>
      </h1>
      <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Next.js 15, TypeScript, TailwindCSS, ShadCN UI로 구성된 프로덕션 레디
        스타터킷. 로그인, 대시보드, 다크모드가 모두 포함되어 있습니다.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard">
            대시보드 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/register">무료로 시작하기</Link>
        </Button>
      </div>
    </section>
  )
}
