/**
 * 견적서 조회 페이지
 * 경로: /invoice/[id]
 * [id]는 Notion 페이지 ID
 *
 * Server Component - 빌드 시 또는 요청 시 Notion API에서 데이터를 가져옴
 */

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getInvoiceById } from "@/lib/notion"
import { InvoiceView } from "@/components/invoice/InvoiceView"
import { SITE_CONFIG } from "@/lib/constants"

interface InvoicePageProps {
  params: Promise<{ id: string }>
}

/**
 * 동적 메타데이터 생성
 * 견적서 번호와 클라이언트명을 페이지 타이틀에 반영
 */
export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)

    if (!invoice) {
      return {
        title: "견적서를 찾을 수 없습니다",
      }
    }

    return {
      title: `견적서 ${invoice.invoiceNumber} - ${invoice.clientName}`,
      description: `${invoice.clientName}에게 발행된 견적서 ${invoice.invoiceNumber}`,
      openGraph: {
        title: `견적서 ${invoice.invoiceNumber}`,
        description: `${invoice.clientName} | 총 금액: ${new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(invoice.totalAmount)}`,
        siteName: SITE_CONFIG.name,
      },
    }
  } catch {
    return {
      title: "견적서 조회 오류",
    }
  }
}

/**
 * 견적서 페이지
 * Notion API에서 견적서 데이터를 조회하고 InvoiceView 컴포넌트에 전달
 */
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params

  // Notion 페이지 ID 형식 유효성 검사 (32자 또는 하이픈 포함 36자)
  const cleanId = id.replace(/-/g, "")
  if (cleanId.length !== 32) {
    notFound()
  }

  let invoice = null

  try {
    invoice = await getInvoiceById(id)
  } catch (error) {
    // Notion API 환경변수 미설정 또는 네트워크 오류
    console.error("견적서 조회 오류:", error)
    throw new Error("견적서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
  }

  // 존재하지 않는 견적서 → 404
  if (!invoice) {
    notFound()
  }

  return <InvoiceView invoice={invoice} />
}
