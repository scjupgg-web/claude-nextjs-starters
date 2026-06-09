export const SITE_CONFIG = {
  name: "StarterKit",
  description: "Next.js 15 + TypeScript + TailwindCSS + ShadCN UI 모던 웹 스타터킷",
  url: "https://example.com",
}

export const MAIN_NAV = [
  { label: "홈", href: "/" },
  { label: "기능", href: "/#features" },
  { label: "통계", href: "/#stats" },
  { label: "대시보드", href: "/dashboard" },
]

export const DASHBOARD_NAV = [
  { label: "개요", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "분석", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "사용자", href: "/dashboard/users", icon: "Users" },
  { label: "설정", href: "/dashboard/settings", icon: "Settings" },
]

export const FOOTER_LINKS = [
  {
    title: "제품",
    links: [
      { label: "로드맵", href: "/roadmap" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "/about" },
      { label: "블로그", href: "/blog" },
      { label: "채용", href: "/careers" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "컴포넌트", href: "/components" },
      { label: "문서", href: "/docs" },
      { label: "FAQ", href: "/faq" },
      { label: "문의", href: "/contact" },
    ],
  },
]
