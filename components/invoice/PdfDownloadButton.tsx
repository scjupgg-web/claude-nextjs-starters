"use client"

/**
 * PDF 다운로드 버튼 컴포넌트
 * API Route(/api/generate-pdf)를 호출하여 서버에서 PDF를 생성하고 다운로드
 * Client Component (사용자 인터랙션 필요)
 */

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/lib/types"

interface PdfDownloadButtonProps {
  invoice: Invoice
}

export function PdfDownloadButton({ invoice }: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string }
        throw new Error(errorData.error ?? "PDF 생성에 실패했습니다.")
      }

      // Blob으로 변환 후 다운로드 링크 생성
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `견적서_${invoice.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("PDF 다운로드가 시작되었습니다.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "PDF 생성 중 오류가 발생했습니다."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isLoading ? "생성 중..." : "PDF 다운로드"}
    </Button>
  )
}
