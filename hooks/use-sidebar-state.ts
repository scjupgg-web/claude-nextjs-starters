"use client"

import { useLocalStorage } from "usehooks-ts"

export function useSidebarState() {
  const [isOpen, setIsOpen] = useLocalStorage("sidebar-open", true)
  return { isOpen, setIsOpen, toggle: () => setIsOpen((prev) => !prev) }
}
