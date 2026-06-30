"use client"

/**
 * 견적서 페이지 에러 바운더리
 * Notion API 오류, 네트워크 오류 등 예상치 못한 에러 처리
 * Next.js App Router: error.tsx는 반드시 Client Component
 */

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvoiceErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function InvoiceError({ error, reset }: InvoiceErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등으로 전송)
    console.error("견적서 로드 오류:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            견적서를 불러올 수 없습니다
          </h1>
          <p className="text-muted-foreground">
            {error.message ?? "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
          </p>
        </div>

        {/* 재시도 버튼 */}
        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      </div>
    </div>
  )
}
