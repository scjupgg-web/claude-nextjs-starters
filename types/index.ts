export interface NavItem {
  label: string
  href: string
  icon?: string
  disabled?: boolean
  external?: boolean
}

export interface FooterLinkGroup {
  title: string
  links: NavItem[]
}

export interface StatsCardData {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
  status: "active" | "inactive"
  createdAt: string
}
