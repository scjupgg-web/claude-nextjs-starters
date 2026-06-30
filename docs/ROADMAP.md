# 노션 기반 견적서 관리 시스템 로드맵

> 마지막 업데이트: 2026-06-24 | 버전: 1.1.0

## 프로젝트 개요

노션 데이터베이스를 백엔드로 활용하는 경량 견적서 관리 시스템입니다. 별도의 DB 구축 없이 노션에서 견적서 데이터를 입력하면, 고유 URL로 클라이언트가 웹에서 조회하고 PDF로 다운로드할 수 있습니다.

- **주 사용자**: 견적서를 발행하는 프리랜서 / 소규모 기업
- **클라이언트**: 링크를 받아 견적서를 확인하고 PDF를 저장하는 수신자
- **핵심 가치**: 노션만 있으면 별도 관리 도구 없이 전문적인 견적서를 발행

## 성공 지표 (KPIs)

- [ ] Notion API 연동 후 견적서 데이터를 3초 이내에 렌더링
- [ ] PDF 다운로드 성공률 99% 이상 (에러 없이 파일 저장 완료)
- [ ] 모바일 / 태블릿 / 데스크톱 3개 breakpoint 모두 정상 표시
- [ ] 잘못된 URL 접근 시 명확한 404 메시지 표시
- [ ] Vercel 배포 후 Core Web Vitals LCP 2.5초 이하

## 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|----------|
| 프레임워크 | Next.js 15.5.3 (App Router) + TypeScript | Server Component로 Notion API 직접 호출, SEO |
| UI | TailwindCSS v4 + shadcn/ui + Lucide React | 빠른 UI 구성, 접근성 기본 제공 |
| Notion 연동 | @notionhq/client v5 | 공식 타입 지원, 서버 사이드 전용 |
| PDF 생성 | @react-pdf/renderer | 서버 사이드 렌더링, Vercel Edge 호환 |
| 배포 | Vercel | Next.js 공식 호스팅, 환경변수 관리 간편 |

## 마일스톤 개요

```
Phase 1 MVP  [완료]  ━━━━━━━━━━━━━━
Phase 1 마무리       ━━━
Phase 2              ━━━━━━━━
Phase 3              ━━━━━━━━
Phase 4              ━━━━━━━━━━━━━━
```

---

## Phase 1: MVP 핵심 기능 (완료 + 마무리 작업)

### 현재 구현 상태

Phase 1 핵심 코드는 이미 구현되어 있습니다. 아래 항목은 완료된 것으로 표시합니다.

#### F001 — Notion API 연동
- [x] **`lib/notion.ts` — Notion 클라이언트 초기화** `BE` — `@notionhq/client` 싱글톤, 환경변수 검증
- [x] **`lib/types.ts` — Invoice / InvoiceItem 타입 정의** `BE` — `InvoiceStatus` 유니온 타입 포함
- [x] **`getInvoiceById()` 구현** `BE` — 페이지 ID로 단건 조회, 404 처리
- [x] **`getInvoiceItems()` 구현** `BE` — 블록 테이블에서 견적 항목 파싱
- [x] **`getAllInvoices()` 구현** `BE` — 데이터베이스 전체 목록 조회

#### F002 — 견적서 조회 페이지
- [x] **`app/invoice/[id]/page.tsx` — 견적서 Server Component** `FE` — Notion 페이지 ID 유효성 검사, notFound() 처리
- [x] **동적 메타데이터 (`generateMetadata`)** `FE` — 견적서 번호 / 클라이언트명 / OG 태그
- [x] **`app/invoice/[id]/loading.tsx` — 로딩 스켈레톤** `FE` — Suspense 경계
- [x] **`components/invoice/InvoiceView.tsx` — 견적서 뷰어** `FE` — 반응형 카드 레이아웃, 항목 테이블, 총액, 메모
- [x] **`lib/constants.ts` — 상태 레이블 / 포맷 상수** `FE` — `INVOICE_STATUS_LABELS`, `INVOICE_STATUS_VARIANTS`, `CURRENCY_FORMAT`, `DATE_FORMAT`

#### F003 — PDF 다운로드
- [x] **`app/api/generate-pdf/route.tsx` — PDF 생성 API** `BE` — `@react-pdf/renderer` 서버 렌더링, A4 레이아웃
- [x] **`components/invoice/PdfDownloadButton.tsx` — 다운로드 버튼** `FE` — 로딩 상태, sonner 토스트 피드백
- [x] **`app/not-found.tsx` — 404 페이지** `FE` — 존재하지 않는 견적서 접근 시 표시

### Phase 1 잔여 태스크 (약 1주)

#### 환경 설정 및 배포
- [x] **`.env.local` 템플릿 작성 (`.env.example`)** `BE` — `NOTION_API_KEY`, `NOTION_DATABASE_ID` 변수 문서화 (예상: 0.5일)
- [x] **Notion 데이터베이스 스키마 가이드 작성** `BE` — 필수 속성명 (`invoice_number`, `client_name`, `issue_date`, `valid_until`, `total_amount`, `status`, `notes`) 및 타입 명세 (예상: 0.5일)
- [ ] **Vercel 환경변수 설정 및 배포 검증** `BE` — Production / Preview 환경 모두 확인 (예상: 0.5일)

#### 품질 보증
- [ ] **실제 Notion 데이터베이스 연동 E2E 테스트** `QA` — 견적서 조회 → PDF 다운로드 전체 흐름 수동 검증 (예상: 1일)
- [ ] **[Playwright] Notion API 연동 E2E 테스트** `QA` — `mcp__playwright__browser_navigate`로 `/invoice/[실제노션ID]` 접근, `browser_snapshot`으로 데이터 렌더링 확인, `browser_network_requests`로 API 호출 내역 검증 (예상: 0.5일)
- [x] **`route.ts` 중복 파일 정리** `BE` — `app/api/generate-pdf/route.ts`는 현재 빈 파일(`export {}`)이므로 삭제 (예상: 0.5일)
- [ ] **반응형 UI 검증** `QA` — 모바일(375px), 태블릿(768px), 데스크톱(1280px) 3개 기기 확인 (예상: 0.5일)
- [ ] **에러 상태 UI 검증** `QA` — 잘못된 Notion ID, 만료된 API 키, 네트워크 오류 시나리오 (예상: 0.5일)
- [ ] **[Playwright] PDF 다운로드 플로우 테스트** `QA` — `browser_click`으로 다운로드 버튼 클릭, `browser_network_requests`로 `/api/generate-pdf` 응답 상태 200 및 `Content-Type: application/pdf` 확인, `browser_console_messages`로 런타임 오류 없음 검증 (예상: 0.5일)
- [ ] **[Playwright] 에러 케이스 E2E 테스트** `QA` — 존재하지 않는 ID로 접근 → `browser_snapshot`으로 404 페이지 렌더링 확인, `browser_console_messages`로 콘솔 오류 없음 확인 (예상: 0.5일)

### Phase 1 완료 기준

- Notion 데이터베이스의 견적서가 `/invoice/[notionPageId]`에서 정확히 렌더링됨
- PDF 다운로드 버튼 클릭 시 올바른 파일명으로 저장됨 (`견적서_INV-2024-001.pdf`)
- 존재하지 않는 ID 접근 시 404 페이지로 이동
- Vercel Production URL에서 전체 흐름 동작 확인
- `route.ts` 중복 파일 없음
- **Playwright MCP 테스트 통과**: Notion API 연동(데이터 렌더링), PDF 다운로드(응답 상태 200 + Content-Type), 404 처리(에러 페이지 렌더링) 3개 시나리오 전부 통과

### Phase 1 위험 요소

| 위험 | 영향 | 완화 전략 |
|------|------|----------|
| Notion API 응답 속도 | 페이지 로딩 지연 | `next/cache`의 `revalidate` 설정으로 ISR 캐싱 |
| @react-pdf/renderer 한국어 폰트 미지원 | PDF에서 한글 깨짐 | NanumGothic 폰트 파일 번들링 필요 (별도 확인 필요) |
| Notion 블록 테이블 구조 변경 | 항목 파싱 실패 | `getInvoiceItems()` 파싱 실패 시 빈 배열 반환 (현재 구현됨) |

---

## Phase 2: 관리자 대시보드 (4주)

> 가정: 팀 규모 2-3명, Phase 1 배포 완료 후 시작

### 목표

견적서 발행자가 웹에서 모든 견적서를 관리할 수 있는 인증 기반 관리자 화면을 제공합니다.

### 포함 기능

#### 관리자 인증
- [x] **NextAuth.js 설치 및 설정** `BE` — Credentials Provider 또는 Google OAuth (예상: 1일)
- [x] **`app/(auth)/` 라우트 그룹 활용** `FE` — 기존 로그인/회원가입 폼 연동 (예상: 1일)
- [x] **미들웨어 기반 라우트 보호** `BE` — `/dashboard/**` 인증 필수 (예상: 0.5일)
- [x] **[Playwright] 인증 플로우 E2E 테스트** `QA` — `browser_navigate`로 `/dashboard` 직접 접근 시 로그인 페이지 리다이렉트 확인, `browser_fill_form`으로 로그인 → `/dashboard` 진입 성공 시나리오, `browser_snapshot`으로 각 단계 상태 캡처 (예상: 0.5일)

#### 견적서 목록 대시보드
- [x] **`app/dashboard/invoices/` 페이지 생성** `FE` — `getAllInvoices()` 연동 (예상: 1일)
- [x] **`@tanstack/react-table` 기반 견적서 목록 테이블** `FE` — 정렬, 필터, 페이지네이션 (예상: 2일)
- [ ] **[Playwright] 대시보드 목록 렌더링 E2E 테스트** `QA` — `browser_navigate`로 `/dashboard/invoices` 접근, `browser_snapshot`으로 테이블 렌더링 확인, `browser_network_requests`로 `getAllInvoices()` API 호출 검증, `browser_click`으로 정렬/필터 인터랙션 후 상태 변화 확인 (예상: 0.5일)
- [x] **견적서 상태 필터 (draft / sent / accepted / rejected / expired)** `FE` (예상: 1일)
- [x] **견적서 고유 링크 복사 버튼** `FE` — Clipboard API 활용 (예상: 0.5일)

#### 견적서 상태 관리
- [x] **`PATCH /api/invoices/[id]/status` API Route** `BE` — Notion API로 상태 업데이트 (예상: 1일)
- [x] **상태 변경 UI (드롭다운)** `FE` — 낙관적 업데이트 패턴 적용 (예상: 1일)
- [ ] **[Playwright] 상태 변경 API 연동 테스트** `QA` — `browser_select_option`으로 상태 드롭다운 변경, `browser_network_requests`로 `PATCH /api/invoices/[id]/status` 요청 및 응답 200 확인, `browser_snapshot`으로 UI 낙관적 업데이트 반영 검증 (예상: 0.5일)

### 완료 기준

- 로그인 후 `/dashboard/invoices`에서 모든 견적서 목록 확인 가능
- 상태 필터 및 정렬 동작
- 비인증 접근 시 로그인 페이지로 리다이렉트
- **Playwright MCP 테스트 통과**: 인증 플로우(로그인/리다이렉트), 대시보드 목록 렌더링(테이블 데이터 표시), 상태 변경 API 연동(PATCH 요청 + UI 반영) 3개 시나리오 전부 통과

---

## Phase 3: 이메일 자동 발송 및 알림 (3주)

> 가정: Phase 2 완료 후 시작

### 목표

견적서 링크를 이메일로 자동 발송하고, 만료 임박 시 알림을 제공합니다.

### 포함 기능

#### 이메일 발송
- [ ] **Resend 또는 Nodemailer 연동** `BE` — API 키 기반 이메일 서비스 (예상: 1일)
- [ ] **`POST /api/invoices/[id]/send` — 이메일 발송 API** `BE` — 클라이언트 이메일 주소 + 견적서 URL 포함 (예상: 1일)
- [ ] **이메일 템플릿 컴포넌트** `FE` — React Email 라이브러리 활용 (예상: 2일)
- [ ] **대시보드에서 이메일 발송 버튼** `FE` (예상: 0.5일)
- [ ] **[Playwright] 이메일 발송 버튼 클릭 및 API 호출 테스트** `QA` — `browser_click`으로 이메일 발송 버튼 클릭, `browser_network_requests`로 `POST /api/invoices/[id]/send` 요청 및 응답 200 확인, `browser_snapshot`으로 발송 성공 토스트 메시지 렌더링 검증 (예상: 0.5일)

#### 만료 알림
- [ ] **`valid_until` 기반 만료 상태 자동 업데이트** `BE` — Vercel Cron Job 또는 Edge Config 활용 (예상: 1.5일)
- [ ] **대시보드에 만료 임박 뱃지 표시** `FE` — 7일 이내 만료 견적서 하이라이트 (예상: 0.5일)
- [ ] **[Playwright] 만료 뱃지 렌더링 E2E 테스트** `QA` — `browser_navigate`로 대시보드 접근, `browser_snapshot`으로 7일 이내 만료 견적서에 경고 뱃지 표시 여부 확인, `browser_console_messages`로 런타임 오류 없음 검증 (예상: 0.5일)

### 완료 기준

- 발송 버튼 클릭 시 클라이언트 이메일 수신 확인
- `valid_until` 초과 견적서가 `expired` 상태로 자동 전환
- 만료 7일 이내 견적서에 경고 표시
- **Playwright MCP 테스트 통과**: 이메일 발송 버튼(API 호출 + 토스트 확인), 만료 뱃지 렌더링 2개 시나리오 전부 통과

---

## Phase 4: 고급 기능 (장기 로드맵)

> 각 기능은 독립적으로 우선순위를 조정할 수 있습니다.

### P2 기능 (향후 6개월)

#### 다중 템플릿
- [ ] **PDF 템플릿 선택 UI** `FE` — 최소 2-3개 디자인 제공
- [ ] **`app/api/generate-pdf/route.tsx` 템플릿 분기 처리** `BE`
- [ ] **템플릿 미리보기** `FE`

#### 견적서 버전 관리
- [ ] **Notion 페이지 업데이트 이력 추적** `BE` — `last_edited_time` 기반
- [ ] **버전 비교 뷰** `FE`

### P3 기능 (향후 1년)

#### 다국어 지원
- [ ] **`next-intl` 또는 `next-i18next` 도입** `BE/FE`
- [ ] **영문 / 일문 PDF 출력 지원**

#### 전자 서명
- [ ] **DocuSign 또는 HelloSign API 연동** `BE`
- [ ] **서명 상태 Notion 속성 동기화** `BE`

#### 결제 연동
- [ ] **Stripe 또는 토스페이먼츠 연동** `BE`
- [ ] **견적서 → 청구서 → 결제 완료 플로우** `FE/BE`

---

## 리소스 계획

| 역할 | Phase 1 잔여 | Phase 2 | Phase 3~4 |
|------|-------------|---------|----------|
| 풀스택 개발자 | 1명 | 1-2명 | 2명 |
| 주요 책임 | 배포 검증, 버그 수정 | 인증 + 대시보드 | 이메일, 알림, 고급 기능 |

---

## 주요 위험 및 가정

### 가정 사항

- [가정] Notion 데이터베이스 속성명은 `invoice_number`, `client_name`, `issue_date`, `valid_until`, `total_amount`, `status`, `notes`로 고정
- [가정] 견적 항목은 Notion 페이지 본문의 테이블 블록 첫 번째 테이블에서 파싱
- [가정] MVP는 단일 Notion 데이터베이스 기준 (다중 데이터베이스는 Phase 2 이후)
- [가정] 인증이 없는 공개 URL 방식 — 견적서 ID를 아는 사람은 누구나 조회 가능

### 기술적 위험

| 위험 | 영향도 | 발생 가능성 | 완화 전략 |
|------|--------|------------|----------|
| @react-pdf/renderer 한국어 폰트 깨짐 | 높음 | 높음 | NanumGothic 폰트 파일(`/public/fonts/`)에 번들링 후 `Font.register()` 호출 |
| Notion API Rate Limit (3req/s) | 중간 | 중간 | `unstable_cache` + `revalidate: 60` 으로 ISR 캐싱 |
| Vercel Serverless 함수 타임아웃 (10s) | 중간 | 낮음 | PDF 생성 최적화, 복잡한 견적서는 Streaming 검토 |
| Notion 블록 구조 변경 | 낮음 | 낮음 | 파싱 실패 시 빈 배열 폴백 (현재 구현됨) |

---

## 즉시 시작 가능한 태스크 (이번 주)

다음 5개 태스크는 현재 코드베이스에서 바로 시작할 수 있습니다.

1. **`app/api/generate-pdf/route.ts` 빈 파일 삭제** `BE` 0.5일
   - `route.ts`(빈 파일)와 `route.tsx`(실제 구현)가 공존 — Next.js는 같은 경로에 `.ts`/`.tsx` 중 하나만 허용
   - `rm app/api/generate-pdf/route.ts`

2. **`.env.example` 파일 생성** `BE` 0.5일
   ```
   NOTION_API_KEY=secret_xxxx
   NOTION_DATABASE_ID=xxxx
   ```

3. **한국어 PDF 폰트 검증** `BE` 1일
   - `app/api/generate-pdf/route.tsx`에서 실제 한글 견적서 PDF 출력 후 글자 깨짐 여부 확인
   - 깨질 경우 `public/fonts/NanumGothic.ttf` 추가 + `Font.register()` 호출

4. **Notion 데이터베이스 설정 가이드 작성** `BE` 0.5일
   - `docs/notion-setup.md` — 필수 속성명, 타입, 테이블 블록 구조 스크린샷 포함

5. **Vercel 배포 및 Production E2E 검증** `BE/QA` 1일
   - 환경변수 설정 → 빌드 → 실제 Notion 데이터로 견적서 조회 → PDF 다운로드 전 흐름 확인

---

## 테스트 전략

### 원칙

모든 API 연동 및 비즈니스 로직 구현은 다음 순서를 반드시 준수합니다.

```
구현 → 즉시 Playwright MCP 테스트 → 통과 확인 → 다음 태스크
```

테스트 없이 구현 완료로 표시하지 않습니다.

### Playwright MCP 테스트 수행 절차

**1단계 — 페이지/기능 접근 확인**
- `mcp__playwright__browser_navigate` → 대상 URL 접속
- `mcp__playwright__browser_snapshot` → 초기 렌더링 상태 캡처

**2단계 — 핵심 기능 동작 검증**
- `mcp__playwright__browser_click` / `mcp__playwright__browser_fill_form` → 사용자 인터랙션 수행
- `mcp__playwright__browser_snapshot` → 인터랙션 후 상태 캡처
- `mcp__playwright__browser_console_messages` → 런타임 오류 확인

**3단계 — API 연동 검증**
- `mcp__playwright__browser_network_requests` → 실제 API 호출 내역 확인 (URL, 메서드, 응답 상태, Content-Type)
- `mcp__playwright__browser_snapshot` → 응답 데이터의 UI 렌더링 정확성 확인

**4단계 — 에러 케이스 검증**
- 잘못된 입력 / 존재하지 않는 리소스 접근 → 에러 처리 UI 확인
- `mcp__playwright__browser_snapshot` → 에러 메시지 / 404 페이지 표시 확인
- `mcp__playwright__browser_console_messages` → 예상치 못한 런타임 오류 없음 검증

### 도구별 용도 요약

| MCP 도구 | 용도 |
|----------|------|
| `browser_navigate` | 특정 URL 접속 |
| `browser_snapshot` | 현재 DOM/렌더링 상태 캡처 (텍스트 기반) |
| `browser_take_screenshot` | 시각적 렌더링 캡처 (이미지) |
| `browser_click` | 버튼/링크 클릭 시뮬레이션 |
| `browser_fill_form` | 폼 입력값 채우기 |
| `browser_select_option` | 드롭다운/셀렉트 옵션 선택 |
| `browser_network_requests` | 발생한 네트워크 요청 목록 확인 |
| `browser_console_messages` | 브라우저 콘솔 메시지 (오류/경고) 확인 |

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-06-29 | 1.2.0 | Phase 1 잔여 태스크 완료(env.example, notion-setup.md, route.ts 중복 제거) + Phase 2 구현 완료(NextAuth v5, proxy.ts 라우트 보호, InvoiceTable, PATCH API) — Playwright 인증 플로우 E2E 통과 |
| 2026-06-24 | 1.1.0 | Playwright MCP 테스트 태스크 추가 — Phase 1~3 API 연동 및 비즈니스 로직 태스크에 짝 테스트 포함, 각 Phase 완료 기준에 테스트 통과 조건 명시, 테스트 전략 섹션 신설 |
| 2026-06-24 | 1.0.0 | 최초 작성 — PRD 기반 로드맵 생성, Phase 1 현재 구현 상태 반영 |
