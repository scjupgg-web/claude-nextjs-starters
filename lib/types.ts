/**
 * 견적서 관련 타입 정의
 * Notion API에서 가져온 데이터를 앱 내부에서 사용하는 타입으로 변환
 */

/** 견적서 상태 */
export type InvoiceStatus = "draft" | "sent" | "accepted" | "rejected" | "expired"

/** 견적 항목 */
export interface InvoiceItem {
  /** 항목 설명 */
  description: string
  /** 수량 */
  quantity: number
  /** 단가 (원) */
  unitPrice: number
  /** 금액 = 수량 × 단가 */
  amount: number
}

/** 견적서 */
export interface Invoice {
  /** Notion 페이지 ID */
  id: string
  /** 견적서 번호 (예: INV-2024-001) */
  invoiceNumber: string
  /** 클라이언트(수신자) 이름 */
  clientName: string
  /** 발행일 (ISO 8601) */
  issueDate: string
  /** 유효 기간 (ISO 8601) */
  validUntil: string
  /** 견적 항목 목록 */
  items: InvoiceItem[]
  /** 총 금액 (원) */
  totalAmount: number
  /** 상태 */
  status: InvoiceStatus
  /** 메모 (선택) */
  notes?: string
}

/** Notion API에서 가져온 견적서 데이터 응답 타입 */
export interface NotionInvoiceResponse {
  invoice: Invoice | null
  error?: string
}

/** 관리자 사용자 */
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
  status: "active" | "inactive"
  createdAt: string
}

/** 통계 카드 데이터 */
export interface StatsCardData {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
}
