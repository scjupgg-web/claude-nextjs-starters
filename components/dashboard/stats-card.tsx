import { TrendingDown, TrendingUp, Minus, type LucideIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StatsCardData } from "@/types"

const TREND_CONFIG = {
  up: { icon: TrendingUp, className: "text-green-600 dark:text-green-400" },
  down: { icon: TrendingDown, className: "text-red-600 dark:text-red-400" },
  neutral: { icon: Minus, className: "text-muted-foreground" },
}

interface StatsCardProps extends StatsCardData {
  IconComponent: LucideIcon
}

export function StatsCard({ title, value, change, trend, IconComponent }: StatsCardProps) {
  const { icon: TrendIcon, className } = TREND_CONFIG[trend]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`mt-1 flex items-center gap-1 text-xs ${className}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{change} 지난달 대비</span>
        </div>
      </CardContent>
    </Card>
  )
}
