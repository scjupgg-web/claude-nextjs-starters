/**
 * 견적서 뷰어 컴포넌트
 * 견적서 데이터를 화면에 표시하는 Server Component
 */

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_VARIANTS,
  SITE_CONFIG,
} from "@/lib/constants"
import type { Invoice } from "@/lib/types"
import { PdfDownloadButton } from "./PdfDownloadButton"

interface InvoiceViewProps {
  invoice: Invoice
}

/** 날짜 문자열을 한국식으로 포맷 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "-"
  try {
    return DATE_FORMAT.format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/** 금액을 한국 원화로 포맷 */
function formatCurrency(amount: number): string {
  return CURRENCY_FORMAT.format(amount)
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const statusLabel = INVOICE_STATUS_LABELS[invoice.status]
  const statusVariant = INVOICE_STATUS_VARIANTS[invoice.status]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 상단 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{SITE_CONFIG.name}</p>
            <h1 className="text-2xl font-bold tracking-tight">
              견적서 {invoice.invoiceNumber}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusVariant as "default" | "secondary" | "destructive" | "outline"}>
              {statusLabel}
            </Badge>
            <PdfDownloadButton invoice={invoice} />
          </div>
        </div>

        {/* 견적서 본문 */}
        <Card className="print:shadow-none">
          <CardHeader className="space-y-6 pb-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* 수신자 정보 */}
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  수신
                </p>
                <p className="text-lg font-semibold">{invoice.clientName}</p>
              </div>

              {/* 견적서 번호 및 날짜 */}
              <div className="space-y-3 sm:text-right">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    견적서 번호
                  </p>
                  <p className="font-mono text-sm">{invoice.invoiceNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:block sm:space-y-1">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      발행일
                    </p>
                    <p className="text-sm">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      유효 기간
                    </p>
                    <p className="text-sm">{formatDate(invoice.validUntil)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* 견적 항목 테이블 */}
            {invoice.items.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">항목</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                      <TableHead className="text-right">단가</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                견적 항목이 없습니다.
              </p>
            )}

            {/* 합계 */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-base font-semibold">총 금액</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* 메모 */}
            {invoice.notes && (
              <div className="mt-8">
                <Separator className="mb-4" />
                <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
                  메모
                </CardTitle>
                <p className="whitespace-pre-wrap text-sm">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 푸터 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          이 견적서는 {SITE_CONFIG.name}을 통해 발행되었습니다.
        </p>
      </div>
    </div>
  )
}
