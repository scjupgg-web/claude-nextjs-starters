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
import { RegisterForm } from "@/components/forms/register-form"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "회원가입",
}

export default function RegisterPage() {
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
            <CardTitle>회원가입</CardTitle>
            <CardDescription>계정을 만들고 시작하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?&nbsp;
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              로그인
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
