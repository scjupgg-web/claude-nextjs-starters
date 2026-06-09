import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight">문서</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          개발 문서를 준비 중입니다. 곧 공개될 예정입니다.
        </p>
      </main>
      <Footer />
    </>
  )
}
