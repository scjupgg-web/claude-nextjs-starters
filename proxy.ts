import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/** /dashboard/** 경로를 미인증 접근으로부터 보호 */
export function proxy(request: NextRequest) {
  const sessionToken =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token")

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
