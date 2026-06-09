"use client"

import { useState } from "react"
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
import { ArrowUpDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "@/types"

const SAMPLE_USERS: User[] = [
  { id: "1", name: "김민준", email: "minjun@example.com", role: "admin", status: "active", createdAt: "2024-01-15" },
  { id: "2", name: "이서연", email: "seoyeon@example.com", role: "user", status: "active", createdAt: "2024-02-20" },
  { id: "3", name: "박지호", email: "jiho@example.com", role: "viewer", status: "inactive", createdAt: "2024-03-10" },
  { id: "4", name: "최수아", email: "sua@example.com", role: "user", status: "active", createdAt: "2024-04-05" },
  { id: "5", name: "정다은", email: "daeun@example.com", role: "user", status: "active", createdAt: "2024-05-22" },
]

const COLUMNS: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
        이름 <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
  },
  { accessorKey: "email", header: "이메일" },
  {
    accessorKey: "role",
    header: "역할",
    cell: ({ row }) => {
      const role = row.getValue<string>("role")
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const status = row.getValue<string>("status")
      return (
        <Badge variant={status === "active" ? "default" : "outline"}>
          {status === "active" ? "활성" : "비활성"}
        </Badge>
      )
    },
  },
  { accessorKey: "createdAt", header: "가입일" },
]

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState("")
  const [search] = useDebounceValue(searchInput, 300)

  const table = useReactTable({
    data: SAMPLE_USERS,
    columns: COLUMNS,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="사용자 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} className="py-8 text-center text-muted-foreground">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        총 {table.getFilteredRowModel().rows.length}명
      </p>
    </div>
  )
}
