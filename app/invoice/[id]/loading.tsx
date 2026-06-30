/**
 * 견적서 페이지 로딩 UI
 * Next.js Suspense를 활용한 스켈레톤 로딩 상태
 */

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function InvoiceLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>

        {/* 카드 스켈레톤 */}
        <Card>
          <CardHeader className="space-y-6 pb-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-3 sm:text-right">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* 테이블 헤더 스켈레톤 */}
            <div className="mb-2 flex gap-4 rounded-md bg-muted p-3">
              <Skeleton className="h-4 flex-[3]" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
            </div>

            {/* 테이블 행 스켈레톤 */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b p-3">
                <Skeleton className="h-4 flex-[3]" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}

            {/* 합계 스켈레톤 */}
            <div className="mt-6 flex justify-end">
              <div className="w-48 space-y-2">
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
