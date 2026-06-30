"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PdfDownloadButton } from "./PdfDownloadButton"
import { CURRENCY_FORMAT, INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANTS } from "@/lib/constants"
import type { Invoice } from "@/lib/types"

interface InvoiceDetailSheetProps {
  invoiceId: string | null
  invoiceNumber: string
  onClose: () => void
}

export function InvoiceDetailSheet({
  invoiceId,
  invoiceNumber,
  onClose,
}: InvoiceDetailSheetProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!invoiceId) {
      setInvoice(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setInvoice(null)

    fetch(`/api/invoices/${invoiceId}`)
      .then((res) => {
        if (!res.ok) throw new Error("견적서를 불러오지 못했습니다.")
        return res.json() as Promise<Invoice>
      })
      .then(setInvoice)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
      })
      .finally(() => setLoading(false))
  }, [invoiceId])

  return (
    <Sheet open={!!invoiceId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto data-[side=right]:sm:max-w-2xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            견적서 {invoiceNumber}
            {invoice && (
              <Badge
                variant={
                  INVOICE_STATUS_VARIANTS[invoice.status] as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
                className="text-xs"
              >
                {INVOICE_STATUS_LABELS[invoice.status]}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-1/3 ml-auto" />
          </div>
        )}

        {error && (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {invoice && !loading && (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  클라이언트
                </p>
                <p className="font-medium">{invoice.clientName}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  총 금액
                </p>
                <p className="font-bold text-base">{CURRENCY_FORMAT.format(invoice.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  발행일
                </p>
                <p>{invoice.issueDate || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  만료일
                </p>
                <p>{invoice.validUntil || "-"}</p>
              </div>
            </div>

            <Separator />

            {/* 견적 항목 */}
            <div>
              <p className="text-sm font-semibold mb-3">견적 항목</p>
              {invoice.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">항목</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                      <TableHead className="text-right">단가</TableHead>
                      <TableHead className="text-right pr-0">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-0 font-medium">{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-right">
                          {CURRENCY_FORMAT.format(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right pr-0">
                          {CURRENCY_FORMAT.format(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  견적 항목이 없습니다.
                </p>
              )}

              {/* 합계 */}
              <div className="mt-3 flex justify-end">
                <div className="flex items-center gap-4 border-t pt-3 text-sm">
                  <span className="font-semibold">총 금액</span>
                  <span className="text-base font-bold">
                    {CURRENCY_FORMAT.format(invoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* 메모 */}
            {invoice.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    메모
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* 액션 버튼 */}
            <div className="flex items-center gap-2">
              <PdfDownloadButton invoice={invoice} />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`/invoice/${invoice.id}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                전체 보기
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
