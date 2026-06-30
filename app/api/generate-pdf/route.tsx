/**
 * PDF 생성 API Route
 * POST /api/generate-pdf
 * 견적서 데이터를 받아 @react-pdf/renderer로 PDF를 생성하고 반환
 *
 * 한국어 폰트: NanumGothic TTF를 Google Fonts에서 로드
 * @react-pdf/renderer는 기본 폰트가 한글을 지원하지 않으므로 반드시 필요
 */

import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import type { Invoice } from "@/lib/types"
import { INVOICE_STATUS_LABELS } from "@/lib/constants"

/**
 * 한국어 폰트 등록
 * NanumGothic Regular / Bold — public/fonts/ 로컬 파일 사용
 * CDN 의존성 제거 및 안정적인 PDF 생성을 위해 로컬 TTF 사용
 */
Font.register({
  family: "NanumGothic",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/NanumGothic-Regular.ttf"),
      fontWeight: "normal",
    },
    {
      src: path.join(process.cwd(), "public/fonts/NanumGothic-Bold.ttf"),
      fontWeight: "bold",
    },
  ],
})

/** 하이픈 자동 삽입 비활성화 (한국어 단어 분리 방지) */
Font.registerHyphenationCallback((word) => [word])

/** 요청 본문 타입 */
interface GeneratePdfRequest {
  invoice: Invoice
}

/** 원화 포맷 */
function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount)
}

/** 날짜 포맷 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "-"
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/** PDF 스타일 정의 — 모든 텍스트에 NanumGothic 적용 */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
    fontFamily: "NanumGothic",
  },
  header: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 10,
    color: "#666666",
  },
  invoiceMeta: {
    textAlign: "right",
  },
  metaLabel: {
    fontSize: 8,
    color: "#888888",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 16,
  },
  clientSection: {
    marginBottom: 24,
  },
  clientLabel: {
    fontSize: 8,
    color: "#888888",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tableContainer: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colUnitPrice: { flex: 1.5, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right" },
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6b7280",
  },
  cellText: {
    fontSize: 10,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalBox: {
    minWidth: 200,
    borderTopWidth: 2,
    borderTopColor: "#1a1a1a",
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBadge: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 4,
  },
  notes: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  notesLabel: {
    fontSize: 8,
    color: "#888888",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
  emptyItems: {
    textAlign: "center",
    color: "#9ca3af",
    padding: 16,
    fontSize: 10,
  },
})

/** 견적서 PDF Document 빌더 함수 */
function buildInvoicePdf(invoice: Invoice) {
  return (
    <Document
      title={`견적서_${invoice.invoiceNumber}`}
      author="견적서 뷰어"
      subject={`${invoice.clientName} 견적서`}
    >
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>견적서 뷰어</Text>
            <Text style={styles.title}>견적서</Text>
            <Text style={styles.statusBadge}>
              상태: {INVOICE_STATUS_LABELS[invoice.status]}
            </Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.metaLabel}>견적서 번호</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            <Text style={styles.metaLabel}>발행일</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.issueDate)}</Text>
            <Text style={styles.metaLabel}>유효 기간</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.validUntil)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 수신자 */}
        <View style={styles.clientSection}>
          <Text style={styles.clientLabel}>수신</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
        </View>

        {/* 견적 항목 테이블 */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.colDescription}>
              <Text style={styles.headerText}>항목</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.headerText}>수량</Text>
            </View>
            <View style={styles.colUnitPrice}>
              <Text style={styles.headerText}>단가</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.headerText}>금액</Text>
            </View>
          </View>

          {invoice.items.length > 0 ? (
            invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.colDescription}>
                  <Text style={styles.cellText}>{item.description}</Text>
                </View>
                <View style={styles.colQty}>
                  <Text style={styles.cellText}>
                    {item.quantity.toLocaleString("ko-KR")}
                  </Text>
                </View>
                <View style={styles.colUnitPrice}>
                  <Text style={styles.cellText}>{formatKRW(item.unitPrice)}</Text>
                </View>
                <View style={styles.colAmount}>
                  <Text style={styles.cellText}>{formatKRW(item.amount)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyItems}>견적 항목이 없습니다.</Text>
          )}
        </View>

        {/* 합계 */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>총 금액</Text>
              <Text style={styles.totalValue}>{formatKRW(invoice.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* 메모 */}
        {invoice.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>메모</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        {/* 푸터 */}
        <Text style={styles.footer}>
          이 견적서는 견적서 뷰어 시스템을 통해 발행되었습니다.
        </Text>
      </Page>
    </Document>
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GeneratePdfRequest

    if (!body.invoice) {
      return NextResponse.json(
        { error: "견적서 데이터가 없습니다." },
        { status: 400 }
      )
    }

    const invoice = body.invoice

    // PDF 버퍼 생성 (서버 사이드 렌더링)
    const pdfBuffer = await renderToBuffer(buildInvoicePdf(invoice))

    // Buffer → Uint8Array 변환 (Next.js NextResponse는 BodyInit 타입 요구)
    const uint8Array = new Uint8Array(pdfBuffer)
    const filename = `견적서_${invoice.invoiceNumber}.pdf`

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": uint8Array.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("PDF 생성 오류:", error)
    return NextResponse.json(
      { error: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
