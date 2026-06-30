import { auth } from "@/auth"
import { Client } from "@notionhq/client"
import type { InvoiceStatus } from "@/lib/types"
import { NextResponse } from "next/server"

/** Notion select 값으로 역매핑 (앱 상태 → 노션 한국어 값) */
const STATUS_TO_NOTION: Record<InvoiceStatus, string> = {
  draft: "초안",
  sent: "발송됨",
  accepted: "승인됨",
  rejected: "거절됨",
  expired: "만료됨",
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json() as { status?: InvoiceStatus }

  if (!body.status || !STATUS_TO_NOTION[body.status]) {
    return NextResponse.json({ error: "유효하지 않은 상태값입니다." }, { status: 400 })
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY })

  try {
    await notion.pages.update({
      page_id: id,
      properties: {
        status: {
          select: {
            name: STATUS_TO_NOTION[body.status],
          },
        },
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Notion 업데이트 실패"
    return NextResponse.json({ error: message }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
