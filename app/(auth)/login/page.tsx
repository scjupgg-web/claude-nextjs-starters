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
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            {SITE_CONFIG.name}
          </Link>
          <p className="text-sm text-muted-foreground">서비스를 이용하려면 로그인하세요.</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>이메일과 비밀번호를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4 text-sm text-muted-foreground">
            계정이 없으신가요?&nbsp;
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              회원가입
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
