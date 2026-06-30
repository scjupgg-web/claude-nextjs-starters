"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  FileText,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  FileText,
}

const NAV_ITEMS = [
  { label: "개요", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "견적서 목록", href: "/dashboard/invoices", icon: "FileText" },
  { label: "분석", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "사용자", href: "/dashboard/users", icon: "Users" },
  { label: "설정", href: "/dashboard/settings", icon: "Settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const userName = session?.user?.name ?? "관리자"
  const userEmail = session?.user?.email ?? ""
  const initials = userName.slice(0, 2)

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="text-lg font-bold">
          {SITE_CONFIG.name}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon]
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} className={cn(isActive && "font-medium")}>
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="로그아웃"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
