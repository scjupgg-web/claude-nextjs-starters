# 로그인 페이지 개선 플랜

## Context
현재 `app/(auth)/login/page.tsx`와 `components/forms/login-form.tsx`에 로그인 페이지가 이미 존재하지만,
사용자가 요구하는 요소들을 반영하여 디자인을 업그레이드한다.

shadcn MCP 서버에서 `login-01` (simple login form) 블록 패턴을 참고하여 구현한다.

## 변경 사항

### 1. `components/forms/login-form.tsx`
- 버튼 텍스트 "로그인" → "로그인하기"
- 비밀번호 필드 아래 "비밀번호를 잊으셨나요?" 링크 추가 (우측 정렬)
- isSubmitting 상태 개선 (버튼 비활성화 + 스피너 유지)

### 2. `app/(auth)/login/page.tsx`
- 로고 영역 개선: 아이콘 + 브랜드명 조합, 더 명확한 시각적 계층
- 카드 헤더: 제목/설명 텍스트 polish
- CardFooter: "회원가입" 링크 스타일 강조
- 배경: `bg-muted/40` 추가하여 카드가 돋보이도록
- 모바일 반응형: `w-full max-w-sm` → `w-full max-w-md` (약간 더 넓게), 패딩 조정

## 수정할 파일

| 파일 | 변경 내용 |
|------|-----------|
| `app/(auth)/login/page.tsx` | 배경, 로고, 카드 레이아웃 개선 |
| `components/forms/login-form.tsx` | 버튼 텍스트, 비밀번호 링크 추가 |

## 재사용할 기존 컴포넌트
- `components/ui/card.tsx` (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `components/ui/form.tsx` (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
- `components/ui/input.tsx` (Input)
- `components/ui/button.tsx` (Button)
- `lib/validations/auth.ts` (loginSchema, LoginInput)
- `lib/constants.ts` (SITE_CONFIG)

## 검증
1. `npm run dev` 실행 후 `http://localhost:3000/login` 접속
2. 모바일 뷰포트(375px)에서 레이아웃 확인
3. 유효하지 않은 이메일/짧은 비밀번호 입력 시 zod 에러 메시지 표시 확인
4. 정상 입력 시 "로그인 성공! (데모)" 토스트 확인
