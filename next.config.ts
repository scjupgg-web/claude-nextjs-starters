import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Next.js 16: Turbopack이 기본값
  turbopack: {},

  /**
   * 서버 전용 외부 패키지 설정
   * @react-pdf/renderer는 Node.js 네이티브 API를 사용하므로
   * Next.js 번들러가 아닌 Node.js가 직접 처리하도록 설정
   * (Next.js 15+: experimental.serverComponentsExternalPackages → serverExternalPackages 로 변경됨)
   */
  serverExternalPackages: ["@react-pdf/renderer"],
}

export default nextConfig
