/**
 * Notion API 클라이언트 및 데이터 조회 함수
 * @notionhq/client를 사용하여 노션 데이터베이스에서 견적서 데이터를 가져옴
 */

import { Client } from "@notionhq/client"
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { Invoice, InvoiceItem, InvoiceStatus } from "./types"

/** Notion 클라이언트 싱글톤 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

/** 환경변수 검증 */
function getNotionDatabaseId(): string {
  const dbId = process.env.NOTION_DATABASE_ID
  if (!dbId) {
    throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.")
  }
  return dbId
}

/** Rich Text 배열에서 plain_text 추출 */
function extractRichText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("")
}

/**
 * Notion 페이지 속성에서 문자열 값 추출 (타입 안전)
 * unknown 타입을 거쳐 런타임에 속성을 검사
 */
function getPropString(
  props: PageObjectResponse["properties"],
  key: string,
  type: "title" | "rich_text"
): string {
  const prop = props[key] as unknown
  if (!prop || typeof prop !== "object") return ""

  const propObj = prop as Record<string, unknown>

  if (type === "title" && propObj["type"] === "title") {
    const title = propObj["title"] as RichTextItemResponse[] | undefined
    return title ? extractRichText(title) : ""
  }

  if (type === "rich_text" && propObj["type"] === "rich_text") {
    const richText = propObj["rich_text"] as RichTextItemResponse[] | undefined
    return richText ? extractRichText(richText) : ""
  }

  return ""
}

/** Notion 페이지 속성에서 숫자 값 추출 */
function getPropNumber(
  props: PageObjectResponse["properties"],
  key: string
): number {
  const prop = props[key] as unknown
  if (!prop || typeof prop !== "object") return 0

  const propObj = prop as Record<string, unknown>
  if (propObj["type"] === "number" && typeof propObj["number"] === "number") {
    return propObj["number"]
  }
  return 0
}

/** Notion 페이지 속성에서 날짜 값 추출 */
function getPropDate(
  props: PageObjectResponse["properties"],
  key: string
): string {
  const prop = props[key] as unknown
  if (!prop || typeof prop !== "object") return ""

  const propObj = prop as Record<string, unknown>
  if (propObj["type"] === "date" && propObj["date"]) {
    const date = propObj["date"] as Record<string, unknown>
    return typeof date["start"] === "string" ? date["start"] : ""
  }
  return ""
}

/** Notion 페이지 속성에서 선택 값 추출 */
function getPropSelect(
  props: PageObjectResponse["properties"],
  key: string
): string {
  const prop = props[key] as unknown
  if (!prop || typeof prop !== "object") return ""

  const propObj = prop as Record<string, unknown>
  if (propObj["type"] === "select" && propObj["select"]) {
    const select = propObj["select"] as Record<string, unknown>
    return typeof select["name"] === "string" ? select["name"] : ""
  }
  return ""
}

/**
 * 한국어 status 값 → 앱 내부 InvoiceStatus 매핑
 * Notion DB의 Select 옵션명이 한국어인 경우를 처리
 */
function mapStatus(rawStatus: string): InvoiceStatus {
  const map: Record<string, InvoiceStatus> = {
    대기: "sent",
    발송: "sent",
    발송됨: "sent",
    승인: "accepted",
    승인됨: "accepted",
    거절: "rejected",
    거절됨: "rejected",
    만료: "expired",
    만료됨: "expired",
    초안: "draft",
    draft: "draft",
    sent: "sent",
    accepted: "accepted",
    rejected: "rejected",
    expired: "expired",
  }
  return map[rawStatus] ?? "draft"
}

/**
 * Notion 페이지에서 견적서 데이터 파싱
 * 실제 DB 속성명: invoice_number(title), client(rich_text),
 * issue_date(date), expiration_date(date), status(select), total_amount(number)
 */
function parseInvoiceFromPage(page: PageObjectResponse): Invoice {
  const props = page.properties

  const invoiceNumber = getPropString(props, "invoice_number", "title") || "N/A"
  const clientName = getPropString(props, "client", "rich_text") || "미상"
  const issueDate = getPropDate(props, "issue_date")
  const validUntil = getPropDate(props, "expiration_date")
  const totalAmount = getPropNumber(props, "total_amount")
  const notes = getPropString(props, "notes", "rich_text") || undefined

  const rawStatus = getPropSelect(props, "status")
  const status = mapStatus(rawStatus)

  return {
    id: page.id,
    invoiceNumber,
    clientName,
    issueDate,
    validUntil,
    items: [],
    totalAmount,
    status,
    notes,
  }
}

/**
 * Items DB relation에서 견적 항목 조회
 * 실제 DB 구조: 항목(relation) → Items DB (Item_name, cnt, price, amount)
 */
async function getInvoiceItems(page: PageObjectResponse): Promise<InvoiceItem[]> {
  try {
    const relationProp = page.properties["항목"] as unknown
    if (!relationProp || typeof relationProp !== "object") return []

    const relationObj = relationProp as Record<string, unknown>
    if (relationObj["type"] !== "relation" || !Array.isArray(relationObj["relation"])) return []

    const relations = relationObj["relation"] as Array<{ id: string }>
    if (relations.length === 0) return []

    const items: InvoiceItem[] = []

    for (const rel of relations) {
      const itemPage = await notion.pages.retrieve({ page_id: rel.id })
      if (!("properties" in itemPage)) continue

      const itemProps = (itemPage as PageObjectResponse).properties
      const description = getPropString(itemProps, "Item_name", "title")
      const quantity = getPropNumber(itemProps, "cnt")
      const unitPrice = getPropNumber(itemProps, "price")
      const amount = getPropNumber(itemProps, "amount")

      if (description) {
        items.push({
          description,
          quantity,
          unitPrice,
          amount: amount || quantity * unitPrice,
        })
      }
    }

    return items
  } catch {
    return []
  }
}

/**
 * Notion 페이지 ID로 견적서 단건 조회
 */
export async function getInvoiceById(pageId: string): Promise<Invoice | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId })

    if (!("properties" in page)) {
      return null
    }

    const typedPage = page as PageObjectResponse
    const invoice = parseInvoiceFromPage(typedPage)
    invoice.items = await getInvoiceItems(typedPage)

    return invoice
  } catch (error: unknown) {
    if (
      error !== null &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "object_not_found"
    ) {
      return null
    }
    throw error
  }
}

/**
 * 데이터베이스의 모든 견적서 목록 조회
 * @notionhq/client v5: databases.query 제거 → search API 사용
 */
export async function getAllInvoices(): Promise<Invoice[]> {
  const databaseId = getNotionDatabaseId()

  const response = await notion.search({
    filter: {
      value: "page",
      property: "object",
    },
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  })

  // ID 정규화: 대시 제거 후 비교 (API는 대시 포함, 환경변수는 대시 없을 수 있음)
  const normalizeId = (id: string) => id.replace(/-/g, "")
  const normalizedDbId = normalizeId(databaseId)

  // 특정 데이터베이스에 속한 페이지만 필터링
  // @notionhq/client v5: parent.type이 "data_source_id"로 변경됨
  return response.results
    .filter((page): page is PageObjectResponse => {
      if (!("properties" in page)) return false
      const parent = (page as PageObjectResponse & { parent?: Record<string, unknown> }).parent
      if (!parent || typeof parent !== "object") return false
      const parentObj = parent as Record<string, unknown>
      const parentDbId = parentObj["database_id"]
      return (
        typeof parentDbId === "string" &&
        normalizeId(parentDbId) === normalizedDbId
      )
    })
    .map((page) => parseInvoiceFromPage(page as PageObjectResponse))
}
