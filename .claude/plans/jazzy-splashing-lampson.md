# Plan: Notion 데이터베이스 스키마 가이드 문서 작성 + 코드 수정

## Context

사용자가 제공한 실제 Notion Export CSV 파일을 분석한 결과, `docs/notion-setup.md`와 `lib/notion.ts`에 기록된 스키마가 실제 데이터베이스와 불일치함이 확인되었다. 문서를 실제 스키마 기준으로 재작성하고, 코드도 함께 수정한다.

---

## 발견된 불일치 (CSV 기준 정답)

| 항목 | 현재 코드/문서 | 실제 CSV 스키마 |
|------|--------------|----------------|
| 클라이언트 속성명 | `client_name` | `client` |
| 유효기간 속성명 | `valid_until` | `expiration_date` |
| 견적 항목 구조 | 페이지 본문 **테이블 블록** 파싱 | **별도 Items 데이터베이스** (Relation) |
| 상태값 | 영문 소문자 (`draft`, `sent` …) | 한국어 (`대기`, …) — 매핑 필요 |

### Invoices DB 실제 속성
| 속성명 | 타입 | 비고 |
|--------|------|------|
| `invoice_number` | Title | 견적서 번호 |
| `client` | Text | 클라이언트명 |
| `issue_date` | Date | 발행일 |
| `expiration_date` | Date | 만료일 |
| `status` | Select | 한국어 값 (대기 등) |
| `total_amount` | Number | 총액 |
| `항목` | Relation → Items DB | 견적 항목 관계 |

### Items DB 실제 속성
| 속성명 | 타입 | 비고 |
|--------|------|------|
| `Item_name` | Title | 항목명 |
| `Invoices` | Relation → Invoices DB | 역관계 |
| `amount` | Number | 금액 (수량 × 단가) |
| `cnt` | Number | 수량 |
| `price` | Number | 단가 |

---

## 구현 계획

### 1. `docs/notion-setup.md` 전면 재작성
- 실제 CSV에서 확인된 속성명/타입으로 교체
- Invoices DB와 Items DB **두 데이터베이스** 구조 설명
- Items DB는 별도 생성 후 Relation으로 연결하는 방법 설명
- `NOTION_DATABASE_ID` (Invoices), `NOTION_ITEMS_DATABASE_ID` (Items) 두 환경변수 안내
- status 한국어 옵션값 명시 (대기/발송/승인/거절/만료 또는 사용자 커스텀)
- 오류 테이블 업데이트

### 2. `lib/notion.ts` 속성명 수정
- `client_name` → `client`
- `valid_until` → `expiration_date`
- `getInvoiceItems()`: 페이지 블록 파싱 → Items DB Relation 조회로 교체
  - `props["항목"]`의 relation 배열에서 page_id 목록 추출
  - 각 page_id에 대해 `notion.pages.retrieve()` 호출
  - `Item_name`(title), `cnt`(number), `price`(number), `amount`(number) 파싱
- status 매핑: 한국어 → 영문 InvoiceStatus (예: `대기` → `sent`, `승인` → `accepted` 등)
- `NOTION_ITEMS_DATABASE_ID` 환경변수 추가 (getAllInvoices용 Items 조회에 필요시)

### 3. `.env.example` 업데이트
- `NOTION_ITEMS_DATABASE_ID` 항목 추가

---

## 수정 대상 파일

- `docs/notion-setup.md` — 전면 재작성
- `lib/notion.ts` — 속성명 수정 + getInvoiceItems() 로직 교체
- `.env.example` — Items DB ID 추가

---

## 검증 방법

1. `npm run build` — TypeScript 오류 없음 확인
2. `.env.local`에 실제 Notion 키 설정 후 `npm run dev`
3. `/invoice/{실제페이지ID}` 접속 → 클라이언트명, 날짜, 항목 목록이 올바르게 표시되는지 확인
