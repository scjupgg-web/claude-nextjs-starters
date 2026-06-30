import { NextResponse } from "next/server"
import { getAllInvoices, getInvoiceById } from "@/lib/notion"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const invoiceId = searchParams.get("id")

  // 단건 조회 테스트
  if (invoiceId) {
    try {
      const invoice = await getInvoiceById(invoiceId)
      return NextResponse.json({ ok: true, invoice })
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 502 })
    }
  }

  // 전체 목록 조회 테스트
  try {
    const invoices = await getAllInvoices()
    return NextResponse.json({
      ok: true,
      count: invoices.length,
      invoices,
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 502 })
  }
}
