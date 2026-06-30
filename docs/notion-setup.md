# Notion 데이터베이스 설정 가이드

이 가이드는 견적서 뷰어 시스템에서 사용할 Notion 데이터베이스를 설정하는 방법을 설명합니다.

## 데이터베이스 구조 개요

이 앱은 **두 개의 Notion 데이터베이스**를 사용합니다.

```
Invoices DB ──(Relation: 항목)──► Items DB
```

- **Invoices DB**: 견적서 헤더 정보 (번호, 고객사, 날짜, 상태, 총액)
- **Items DB**: 견적 항목 상세 (항목명, 수량, 단가, 금액)

---

## 1. Notion Integration 생성

1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. **"New integration"** 클릭
3. 이름 입력 (예: `견적서 뷰어`)
4. 워크스페이스 선택 후 **"Submit"** 클릭
5. 생성된 **"Internal Integration Token"** 복사 → `.env.local`에 저장

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2. Invoices 데이터베이스 생성

Notion에서 새 데이터베이스를 생성하고 아래 속성을 추가합니다.

### 필수 속성 목록

| 속성명 | 타입 | 설명 | 예시 값 |
|--------|------|------|---------|
| `invoice_number` | **Title** | 견적서 번호 (기본 제목 속성) | `INV-2026-001` |
| `client` | **Text** | 클라이언트(수신자) 이름 | `KOTITI` |
| `issue_date` | **Date** | 견적서 발행일 | `2026-06-25` |
| `expiration_date` | **Date** | 견적서 만료일 | `2026-07-25` |
| `total_amount` | **Number** | 총 견적 금액 (원화) | `5000000` |
| `status` | **Select** | 견적서 상태 | 아래 옵션 참고 |
| `항목` | **Relation** | Items DB와 연결 | (3단계에서 설정) |
| `notes` | **Text** | 메모 / 특이사항 (선택) | `부가세 별도입니다.` |

> **주의**: 속성명은 대소문자와 언더스코어(`_`), 한글까지 정확히 일치해야 합니다.

### `status` Select 옵션 설정

| 옵션값 | 앱 내부 상태 | 색상 권장 |
|--------|------------|---------|
| `대기` | sent | 파랑 |
| `승인` | accepted | 초록 |
| `거절` | rejected | 빨강 |
| `만료` | expired | 주황 |
| `초안` | draft | 회색 |

> 영문 옵션값(`draft`, `sent`, `accepted`, `rejected`, `expired`)도 지원합니다.

---

## 3. Items 데이터베이스 생성

별도의 Notion 데이터베이스를 생성하고 아래 속성을 추가합니다.

### 필수 속성 목록

| 속성명 | 타입 | 설명 | 예시 값 |
|--------|------|------|---------|
| `Item_name` | **Title** | 항목명 (기본 제목 속성) | `웹사이트 디자인` |
| `Invoices` | **Relation** | Invoices DB와 연결 (역관계 자동 생성) | — |
| `cnt` | **Number** | 수량 | `2` |
| `price` | **Number** | 단가 (원) | `500000` |
| `amount` | **Number** | 금액 = 수량 × 단가 | `1000000` |

> `amount`는 Notion Formula 속성(`prop("cnt") * prop("price")`)으로 자동 계산하도록 설정할 수 있습니다.

### Relation 연결 방법

1. **Invoices DB**에서 `항목` 속성 추가 → 타입: **Relation**
2. 연결 대상: **Items DB** 선택
3. **"Add a relation to [Items DB]"** 활성화 → 역관계 속성명 `Invoices`로 설정
4. Items DB에 자동으로 `Invoices` Relation 속성이 생성됨

---

## 4. Integration을 두 데이터베이스에 연결

**Invoices DB**와 **Items DB** 모두에 Integration을 연결해야 합니다.

각 데이터베이스에서:
1. 우측 상단 **"..."** 클릭
2. **"Connections"** (또는 "Add connections") 선택
3. 앞서 생성한 Integration 검색 및 선택
4. **"Confirm"** 클릭

---

## 5. 데이터베이스 ID 복사

### Invoices DB ID

데이터베이스 URL에서 복사합니다.

```
https://www.notion.so/myworkspace/8589d95cb8c3412b9f007bdea1ebea2e?v=xxx
                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                   NOTION_DATABASE_ID = 8589d95cb8c3412b9f007bdea1ebea2e
```

### Items DB ID

```
https://www.notion.so/myworkspace/2cf4dc678abf45d7b177b8b8394e1d03?v=xxx
                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                   NOTION_ITEMS_DATABASE_ID = 2cf4dc678abf45d7b177b8b8394e1d03
```

`.env.local`에 저장:

```env
NOTION_DATABASE_ID=8589d95cb8c3412b9f007bdea1ebea2e
NOTION_ITEMS_DATABASE_ID=2cf4dc678abf45d7b177b8b8394e1d03
```

---

## 6. 견적서 URL 접근

데이터베이스에 견적서 페이지를 생성하면 고유 페이지 ID가 부여됩니다.

```
https://your-domain.vercel.app/invoice/{노션페이지ID}
```

노션 페이지 ID 확인 방법:
```
https://www.notion.so/페이지제목-38a20c50e6b980debb41d0ddf484d937
                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                  이 32자리가 페이지 ID
```

또는 페이지 우측 상단 **"..."** → **"Copy link"** 에서 복사 후 마지막 32자리를 사용합니다.

---

## 7. 환경 변수 최종 확인

```env
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        # Invoices DB
NOTION_ITEMS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Items DB
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app        # 선택
```

---

## 자주 발생하는 오류

| 오류 | 원인 | 해결 방법 |
|------|------|---------|
| 404 페이지 표시 | 잘못된 페이지 ID | Notion URL에서 페이지 ID 재확인 |
| 견적 항목이 비어있음 | `항목` Relation 미연결 또는 Items DB 미접근 | Items DB에도 Integration Connections 설정 확인 |
| 클라이언트명이 "미상"으로 표시 | `client` 속성명 오타 | 속성명을 정확히 `client`로 수정 (client_name 아님) |
| 만료일이 표시 안 됨 | `expiration_date` 속성명 오타 | 속성명을 정확히 `expiration_date`로 수정 (valid_until 아님) |
| 상태가 "초안"으로 고정 | `status` Select 옵션값 불일치 | 위 표의 옵션값으로 정확히 입력 |
| API Key 오류 | Integration 미연결 | 두 DB 모두 Integration Connections 재설정 |
