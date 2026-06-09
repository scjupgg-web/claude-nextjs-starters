"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useToggle } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MAIN_NAV, SITE_CONFIG } from "@/lib/constants"

export function MobileNav() {
  const [open, toggle] = useToggle(false)

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="메뉴 열기">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">{SITE_CONFIG.name}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={toggle}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            <Button variant="outline" asChild>
              <Link href="/login" onClick={toggle}>로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/register" onClick={toggle}>시작하기</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
