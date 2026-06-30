"use client"

import { useState, useTransition } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useDebounceValue } from "usehooks-ts"
import { ArrowUpDown, Copy, Check, Search } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Invoice, InvoiceStatus } from "@/lib/types"
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANTS, CURRENCY_FORMAT, DATE_FORMAT } from "@/lib/constants"
import { InvoiceDetailSheet } from "./InvoiceDetailSheet"

const ALL_STATUSES = ["all", "draft", "sent", "accepted", "rejected", "expired"] as const

function CopyLinkButton({ invoiceId }: { invoiceId: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/invoice/${invoiceId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); void handleCopy() }} title="링크 복사">
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

function StatusSelect({
  invoiceId,
  currentStatus,
  onUpdate,
}: {
  invoiceId: string
  currentStatus: InvoiceStatus
  onUpdate: (id: string, status: InvoiceStatus) => void
}) {
  const [isPending, startTransition] = useTransition()

  async function handleChange(value: string) {
    const nextStatus = value as InvoiceStatus
    // 낙관적 업데이트
    onUpdate(invoiceId, nextStatus)

    startTransition(async () => {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        })
        if (!res.ok) throw new Error("상태 업데이트 실패")
        toast.success("상태가 변경되었습니다.")
      } catch {
        // 롤백
        onUpdate(invoiceId, currentStatus)
        toast.error("상태 변경에 실패했습니다.")
      }
    })
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="h-7 w-[110px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(["draft", "sent", "accepted", "rejected", "expired"] as InvoiceStatus[]).map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {INVOICE_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface InvoiceTableProps {
  invoices: Invoice[]
}

export function InvoiceTable({ invoices: initialInvoices }: InvoiceTableProps) {
  const [data, setData] = useState<Invoice[]>(initialInvoices)
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search] = useDebounceValue(searchInput, 300)
  const [selectedInvoice, setSelectedInvoice] = useState<{ id: string; invoiceNumber: string } | null>(null)

  function handleStatusUpdate(id: string, status: InvoiceStatus) {
    setData((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    )
  }

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          견적서 번호 <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
    },
    {
      accessorKey: "clientName",
      header: "클라이언트",
    },
    {
      accessorKey: "issueDate",
      header: "발행일",
      cell: ({ row }) => {
        const date = row.getValue<string>("issueDate")
        return date ? DATE_FORMAT.format(new Date(date)) : "-"
      },
    },
    {
      accessorKey: "validUntil",
      header: "만료일",
      cell: ({ row }) => {
        const date = row.getValue<string>("validUntil")
        if (!date) return "-"
        const isExpiringSoon = new Date(date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        return (
          <span className={isExpiringSoon ? "font-medium text-orange-600 dark:text-orange-400" : ""}>
            {DATE_FORMAT.format(new Date(date))}
          </span>
        )
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          금액 <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => CURRENCY_FORMAT.format(row.getValue<number>("totalAmount")),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const invoice = row.original
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusSelect
              invoiceId={invoice.id}
              currentStatus={invoice.status}
              onUpdate={handleStatusUpdate}
            />
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "링크",
      cell: ({ row }) => <CopyLinkButton invoiceId={row.original.id} />,
    },
  ]

  const filteredData =
    statusFilter === "all" ? data : data.filter((inv) => inv.status === statusFilter)

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="견적서 번호 또는 클라이언트 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {(["draft", "sent", "accepted", "rejected", "expired"] as InvoiceStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {INVOICE_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedInvoice({
                      id: row.original.id,
                      invoiceNumber: row.original.invoiceNumber,
                    })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                  견적서가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>총 {table.getFilteredRowModel().rows.length}건</span>
        {statusFilter !== "all" && (
          <Badge variant={INVOICE_STATUS_VARIANTS[statusFilter as InvoiceStatus] as "default" | "secondary" | "destructive" | "outline"}>
            {INVOICE_STATUS_LABELS[statusFilter as InvoiceStatus]}
          </Badge>
        )}
      </div>

      <InvoiceDetailSheet
        invoiceId={selectedInvoice?.id ?? null}
        invoiceNumber={selectedInvoice?.invoiceNumber ?? ""}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  )
}
