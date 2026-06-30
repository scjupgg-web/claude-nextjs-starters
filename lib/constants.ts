/**
 * 사이트 전역 설정 상수
 * 견적서 뷰어 앱 기반, 레거시 레이아웃 컴포넌트 호환성 유지
 */

export const SITE_CONFIG = {
  name: "견적서 뷰어",
  description: "노션 기반 견적서 조회 및 PDF 다운로드 시스템",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
}

/** 레거시 헤더 네비게이션 (호환성 유지) */
export const MAIN_NAV = [
  { label: "홈", href: "/" },
]

/** 레거시 대시보드 네비게이션 (호환성 유지) */
export const DASHBOARD_NAV = [
  { label: "개요", href: "/dashboard", icon: "LayoutDashboard" },
]

/** 레거시 푸터 링크 (호환성 유지) */
export const FOOTER_LINKS = [
  {
    title: "서비스",
    links: [
      { label: "견적서 조회", href: "/" },
    ],
  },
]

/** 견적서 상태 레이블 */
export const INVOICE_STATUS_LABELS = {
  draft: "초안",
  sent: "발송됨",
  accepted: "승인됨",
  rejected: "거절됨",
  expired: "만료됨",
} as const

/** 견적서 상태별 배지 색상 (shadcn Badge variant) */
export const INVOICE_STATUS_VARIANTS = {
  draft: "secondary",
  sent: "default",
  accepted: "default",
  rejected: "destructive",
  expired: "secondary",
} as const

/** 통화 포맷 (한국 원화) */
export const CURRENCY_FORMAT = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
})

/** 날짜 포맷 (한국식) */
export const DATE_FORMAT = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
})
