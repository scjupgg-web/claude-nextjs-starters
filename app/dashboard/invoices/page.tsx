import { getAllInvoices } from "@/lib/notion"
import { InvoiceTable } from "@/components/invoice/InvoiceTable"
import type { Invoice } from "@/lib/types"

export const metadata = {
  title: "견적서 목록",
}

export default async function InvoicesPage() {
  let invoices: Invoice[] = []
  let error: string | null = null

  try {
    invoices = await getAllInvoices()
  } catch (e) {
    error = e instanceof Error ? e.message : "견적서를 불러오지 못했습니다."
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">견적서 목록</h1>
        <p className="text-sm text-muted-foreground">
          노션 데이터베이스에서 가져온 견적서 목록입니다.
        </p>
      </div>
      <InvoiceTable invoices={invoices} />
    </div>
  )
}
