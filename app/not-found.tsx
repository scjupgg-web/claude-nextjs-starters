/**
 * 전역 404 에러 페이지
 * 존재하지 않는 견적서 또는 잘못된 URL 접근 시 표시
 */

import Link from "next/link"
import { FileX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileX className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-foreground">
            견적서를 찾을 수 없습니다
          </h2>
        </div>

        {/* 설명 */}
        <p className="text-muted-foreground">
          요청하신 견적서가 존재하지 않거나 삭제되었습니다.
          <br />
          URL을 확인하거나 발신자에게 올바른 링크를 요청하세요.
        </p>

        {/* 홈으로 버튼 */}
        <Button asChild variant="outline">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  )
}
