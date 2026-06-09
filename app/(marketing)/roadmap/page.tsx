import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight">로드맵</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          서비스 개발 로드맵을 준비 중입니다. 곧 공개될 예정입니다.
        </p>
      </main>
      <Footer />
    </>
  )
}
