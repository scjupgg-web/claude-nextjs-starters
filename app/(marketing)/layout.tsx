/**
 * 마케팅(루트) 레이아웃
 * 간단한 래퍼 레이아웃 - 헤더/푸터 없이 콘텐츠만 렌더링
 */

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
