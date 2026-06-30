/**
 * 루트 페이지 (/)
 * 견적서 뷰어 시스템 안내 페이지
 * 실제 사용 시 견적서 URL (/invoice/[notionPageId])로 직접 접근
 */

import { FileText, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_CONFIG } from "@/lib/constants"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* 로고/아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-2xl bg-primary/10 p-5">
            <FileText className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{SITE_CONFIG.name}</h1>
          <p className="text-muted-foreground">{SITE_CONFIG.description}</p>
        </div>

        {/* 사용 방법 */}
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="text-base">사용 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </span>
              <p>
                노션에서 견적서 페이지의 URL을 복사합니다.
                <br />
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  https://notion.so/workspace/페이지제목-<strong>PAGE_ID</strong>
                </code>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              <p>
                아래 형식으로 접근하면 견적서를 확인할 수 있습니다.
                <br />
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  {SITE_CONFIG.url}/invoice/<strong>[Notion 페이지 ID]</strong>
                </code>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              <p>PDF 다운로드 버튼으로 견적서를 저장할 수 있습니다.</p>
            </div>
          </CardContent>
        </Card>

        {/* 예시 링크 */}
        <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          견적서 링크를 공유받으셨다면 해당 링크로 직접 접근하세요.
        </p>
      </div>
    </div>
  )
}
