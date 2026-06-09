"use client"

import Link from "next/link"
import { useMediaQuery } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"
import { MAIN_NAV, SITE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Header() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            {SITE_CONFIG.name}
          </Link>
          {isDesktop && (
            <NavigationMenu>
              <NavigationMenuList>
                {MAIN_NAV.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isDesktop ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/register">시작하기</Link>
              </Button>
            </>
          ) : (
            <MobileNav />
          )}
        </div>
      </div>
    </header>
  )
}
