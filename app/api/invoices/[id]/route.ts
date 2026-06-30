import { getInvoiceById } from "@/lib/notion"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)
    if (!invoice) {
      return NextResponse.json({ error: "견적서를 찾을 수 없습니다." }, { status: 404 })
    }
    return NextResponse.json(invoice)
  } catch (e) {
    const message = e instanceof Error ? e.message : "조회 실패"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
