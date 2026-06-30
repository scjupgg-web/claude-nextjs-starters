# Phase 2: 관리자 대시보드 구현 계획

## Context

ROADMAP.md Phase 2 목표: 견적서 발행자가 웹에서 모든 견적서를 관리할 수 있는 **인증 기반 관리자 화면** 구현.  
Phase 1 핵심 기능(Notion 연동, 견적서 조회, PDF)은 완료. 이제 관리자 로그인 → 대시보드에서 전체 견적서 목록 조회/상태 변경까지 구현한다.

## 현재 코드베이스 상태

| 항목 | 상태 |
|------|------|
| `app/(auth)/login`, `register` 페이지 | ✅ UI 완성, 인증 로직 TODO |
| `app/dashboard/` 레이아웃 + 기본 페이지 | ✅ 존재 (Sidebar, StatsCard 포함) |
| `components/forms/login-form.tsx` | ✅ zod+react-hook-form 완성, API 연동 없음 |
| `@tanstack/react-table` | ✅ 설치됨 (v8) |
| `next-auth` | ❌ 미설치 |
| `middleware.ts` | ❌ 없음 |
| `lib/types.ts`의 User, StatsCardData 타입 | ❌ 누락 (컴파일 오류) |
| `app/dashboard/invoices/` | ❌ 없음 |

## 구현 순서

### Step 1 — 타입 정의 보강
- `lib/types.ts`에 `User`, `StatsCardData` 타입 추가
- `components/dashboard/data-table.tsx`, `stats-card.tsx` 컴파일 오류 해소

### Step 2 — NextAuth.js 설치 및 설정
- `next-auth` 설치 (`npm install next-auth`)
- `app/api/auth/[...nextauth]/route.ts` — Credentials Provider 구성
  - 환경변수: `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `lib/auth.ts` — NextAuth 옵션 분리 (authOptions export)
- `app/(auth)/login/page.tsx` → `login-form.tsx`에서 `signIn()` 호출 연동

### Step 3 — 미들웨어 기반 라우트 보호
- `middleware.ts` (루트) 생성
  - `/dashboard/**` 경로: 미인증 시 `/login` 리다이렉트
  - `next-auth/middleware` 활용

### Step 4 — 견적서 목록 대시보드 (`app/dashboard/invoices/`)
- `app/dashboard/invoices/page.tsx` — Server Component
  - `getAllInvoices()` (`lib/notion.ts`) 호출
  - InvoiceTable 컴포넌트에 데이터 전달
- `components/invoice/InvoiceTable.tsx` — Client Component
  - `@tanstack/react-table` 기반
  - 컬럼: 견적서 번호, 클라이언트명, 발행일, 만료일, 금액, 상태
  - 상태 필터 (draft/sent/accepted/rejected/expired)
  - 고유 링크 복사 버튼 (Clipboard API)

### Step 5 — 견적서 상태 변경 API
- `app/api/invoices/[id]/status/route.ts` — `PATCH` 메서드
  - 요청 body: `{ status: InvoiceStatus }`
  - Notion API로 페이지 속성 업데이트
  - 인증 확인 (getServerSession)
- `InvoiceTable.tsx`에 상태 드롭다운 추가
  - 낙관적 업데이트 (optimistic update) 패턴
  - sonner 토스트 피드백

### Step 6 — Sidebar 네비게이션 업데이트
- `components/layout/sidebar.tsx` — 견적서 관리 메뉴 추가
- 사용자 프로필 영역에 실제 세션 데이터 표시 (`useSession`)

### Step 7 — Playwright E2E 테스트
ROADMAP 명시 3개 시나리오:
1. **인증 플로우**: `/dashboard` 직접 접근 → 로그인 리다이렉트 확인, 로그인 → 진입 성공
2. **목록 렌더링**: `/dashboard/invoices` 테이블 데이터 표시, 정렬/필터 인터랙션
3. **상태 변경**: 드롭다운 선택 → PATCH 요청 200 + UI 반영

## 핵심 파일 목록

| 파일 | 작업 |
|------|------|
| `lib/types.ts` | User, StatsCardData 타입 추가 |
| `lib/auth.ts` | NextAuth authOptions (신규) |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth handler (신규) |
| `app/api/invoices/[id]/status/route.ts` | PATCH API (신규) |
| `middleware.ts` | 라우트 보호 (신규) |
| `app/dashboard/invoices/page.tsx` | 견적서 목록 페이지 (신규) |
| `components/invoice/InvoiceTable.tsx` | 테이블 + 필터 + 상태변경 (신규) |
| `components/forms/login-form.tsx` | signIn() 연동 (수정) |
| `components/layout/sidebar.tsx` | 메뉴 추가 + 세션 연동 (수정) |
| `.env.local` / `.env.example` | NEXTAUTH_SECRET 등 추가 (수정) |

## 재사용할 기존 코드

- `lib/notion.ts` — `getAllInvoices()` 그대로 사용
- `lib/types.ts` — `InvoiceStatus` 유니온 타입 재사용
- `lib/constants.ts` — `INVOICE_STATUS_LABELS`, `INVOICE_STATUS_VARIANTS` 재사용
- `components/ui/` — badge, button, select, dropdown-menu, table 모두 설치됨
- `lib/validations/auth.ts` — 기존 loginSchema 재사용

## 환경변수 추가 필요

```
NEXTAUTH_SECRET=랜덤_시크릿
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=해시된_비밀번호
```

## 검증 방법

1. `npm run build` — 타입 오류 없음 확인
2. 미인증으로 `/dashboard` 접근 → `/login` 리다이렉트
3. 로그인 → `/dashboard/invoices`에서 Notion 견적서 목록 표시
4. 상태 드롭다운 변경 → Notion 업데이트 반영 확인
5. Playwright MCP 3개 시나리오 통과
