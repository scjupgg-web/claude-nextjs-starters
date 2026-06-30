# ROADMAP.md 업데이트 계획 — Playwright MCP 테스트 통합

## 목표
기존 `docs/ROADMAP.md`에 Playwright MCP 테스트 관련 내용을 추가하면서 기존 내용을 최대한 보존한다.

## 변경 사항 목록

### 1. 헤더 업데이트
- 버전: 1.0.0 → 1.1.0
- 날짜: 2026-06-24 유지

### 2. Phase 1 잔여 태스크 — 품질 보증 섹션 보강
현재 QA 태스크들에 Playwright MCP 테스트 태스크를 추가한다.

추가할 태스크:
- `[ ] **[Playwright] Notion API 연동 E2E 테스트** QA` — `mcp__playwright__browser_navigate`로 `/invoice/[실제노션ID]` 접근, 데이터 렌더링 스냅샷, API 호출 내역 검증 (예상: 0.5일)
- `[ ] **[Playwright] PDF 다운로드 플로우 테스트** QA` — 다운로드 버튼 클릭 → 응답 상태 200 → Content-Type `application/pdf` 확인 (예상: 0.5일)
- `[ ] **[Playwright] 에러 케이스 E2E 테스트** QA` — 잘못된 ID → 404 렌더링, 콘솔 오류 없음 확인 (예상: 0.5일)

### 3. Phase 1 완료 기준에 테스트 조건 추가
기존 완료 기준 아래에 다음 항목 추가:
- Playwright MCP 테스트 통과: Notion API 연동, PDF 다운로드, 404 처리 시나리오 전부

### 4. Phase 2 태스크에 Playwright MCP 테스트 태스크 추가
API 연동/비즈니스 로직 태스크 각각에 짝이 되는 테스트 태스크 추가:

- `PATCH /api/invoices/[id]/status` API Route 구현 → `[Playwright] 상태 변경 API 연동 테스트` 짝 추가
- 견적서 목록 테이블 구현 → `[Playwright] 대시보드 목록 렌더링 E2E 테스트` 짝 추가
- 인증 구현 → `[Playwright] 인증 플로우 E2E 테스트` 짝 추가

### 5. Phase 2 완료 기준에 테스트 조건 추가

### 6. Phase 3 태스크에 Playwright MCP 테스트 태스크 추가
- 이메일 발송 API → `[Playwright] 이메일 발송 API 호출 테스트` 짝 추가

### 7. Phase 3 완료 기준에 테스트 조건 추가

### 8. ROADMAP.md 마지막에 "테스트 전략" 섹션 추가
Playwright MCP 사용 절차를 상세히 기술하는 새 섹션 추가:
- 테스트 수행 원칙 (구현 → 즉시 테스트 → 다음 태스크)
- 4단계 절차 (페이지 접근, 핵심 기능, API 연동, 에러 케이스)
- MCP 도구별 용도 설명

### 9. 변경 이력에 행 추가
- 2026-06-24 | 1.1.0 | Playwright MCP 테스트 태스크 추가, 각 Phase 완료 기준에 테스트 통과 조건 포함, 테스트 전략 섹션 신설

## 보존 사항
- 기존 모든 태스크, 완료 표시([x]), 단계 구조
- 기술 스택 표, 위험 요소 표, 리소스 계획 표
- 마일스톤 개요 ASCII 다이어그램
- 가정 사항 및 가정 태그
