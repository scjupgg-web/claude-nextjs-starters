import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const STATS = [
  {
    title: "총 사용자",
    value: "12,345",
    change: "+12%",
    trend: "up" as const,
    icon: "Users",
    IconComponent: Users,
  },
  {
    title: "월 매출",
    value: "₩45,231,000",
    change: "+8%",
    trend: "up" as const,
    icon: "DollarSign",
    IconComponent: DollarSign,
  },
  {
    title: "신규 주문",
    value: "1,432",
    change: "-3%",
    trend: "down" as const,
    icon: "ShoppingCart",
    IconComponent: ShoppingCart,
  },
  {
    title: "전환율",
    value: "3.24%",
    change: "+0.1%",
    trend: "up" as const,
    icon: "TrendingUp",
    IconComponent: TrendingUp,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">서비스 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
          <CardDescription>등록된 사용자를 검색하고 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable />
        </CardContent>
      </Card>
    </div>
  )
}
