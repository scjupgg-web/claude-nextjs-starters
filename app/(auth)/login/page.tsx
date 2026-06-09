import Link from "next/link"
import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/forms/login-form"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "로그인",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">
            {SITE_CONFIG.name}
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>이메일과 비밀번호로 로그인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            계정이 없으신가요?&nbsp;
            <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
              회원가입
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
