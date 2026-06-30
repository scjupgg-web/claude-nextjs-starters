# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 기술 스택

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **TailwindCSS v4** + **shadcn/ui** (Radix UI 기반)
- **react-hook-form** + **zod** (폼 검증)
- **next-themes** (다크/라이트 테마)
- **sonner** (토스트 알림)
- **@tanstack/react-table** (데이터 테이블)

## 아키텍처

### 라우트 구조 (App Router)

```
app/
  layout.tsx              # 루트 레이아웃 (ThemeProvider, Toaster, TooltipProvider)
  (marketing)/            # 마케팅 페이지 그룹 (헤더+푸터 레이아웃)
    page.tsx              # 랜딩 페이지
    roadmap, about, blog, careers, docs, faq, contact, components
  (auth)/                 # 인증 페이지 그룹
    login/, register/
  dashboard/              # 대시보드 (사이드바 레이아웃)
    analytics/, users/, settings/
```

### 컴포넌트 구조

- `components/ui/` — shadcn/ui 컴포넌트 (직접 수정 가능)
- `components/layout/` — 공통 레이아웃 (Header, Footer, Sidebar, MobileNav)
- `components/sections/` — 랜딩 페이지 섹션 (Hero, Features, Stats, CTA)
- `components/dashboard/` — 대시보드 전용 (StatsCard, DataTable)
- `components/forms/` — 폼 컴포넌트 (LoginForm, RegisterForm)
- `components/theme/` — 테마 토글

### 주요 패턴

- **경로 별칭**: `@/` → 프로젝트 루트 (예: `@/components/ui/button`)
- **사이트 설정**: `lib/constants.ts`에서 `SITE_CONFIG`, `MAIN_NAV`, `DASHBOARD_NAV`, `FOOTER_LINKS` 관리
- **폼 검증**: `lib/validations/auth.ts`에 zod 스키마 정의, react-hook-form과 연동
- **유틸리티**: `lib/utils.ts`의 `cn()` 함수로 className 병합 (clsx + tailwind-merge)
- **shadcn 컴포넌트 추가**: `npx shadcn add <component>` 명령 사용

### Next.js 버전 주의

이 프로젝트는 Next.js 16으로, 훈련 데이터의 API와 다를 수 있음. 코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 확인할 것.


### 작업 완료 체크리스트
```bash
npm run check-all
npm run build
```