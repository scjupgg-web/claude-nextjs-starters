# 인보이스 목록 세부 항목 표시 UI/UX 개선

## Context

현재 `/dashboard/invoices` 목록 화면(`InvoiceTable`)은 견적서 번호·클라이언트·날짜·금액·상태만 표시하고, 실제 견적 항목(items)은 전혀 보이지 않는다. `getAllInvoices()`가 `items: []`로 반환하기 때문이며, 항목 데이터는 `getInvoiceById()`를 통해 추가 API 호출이 필요하다.

목표: 목록 화면에서 행을 클릭하면 **우측에 Sheet(슬라이드오버) 패널**이 열리고, 해당 견적서의 전체 항목·금액·메모를 지연 로딩으로 표시한다.

## 접근 방식

Sheet 패널 방식 선택 이유: 목록을 유지하면서 상세를 볼 수 있고, shadcn/ui Sheet가 이미 프로젝트에 설치되어 있을 가능성이 높음. 페이지 이동 없이 PDF 다운로드까지 가능.

---

## 구현 계획

### 1. API 라우트 추가 — `app/api/invoices/[id]/route.ts`

기존 `app/api/invoices/[id]/status/route.ts`와 같은 디렉토리에 `route.ts` 추가.

```ts
// GET /api/invoices/[id]
export async function GET(_, { params }) {
  const { id } = await params
  const invoice = await getInvoiceById(id)   // lib/notion.ts — items 포함
  if (!invoice) return NextResponse.json({ error: "없음" }, { status: 404 })
  return NextResponse.json(invoice)
}
```

인증 체크 불필요 (대시보드는 이미 레이아웃 레벨에서 보호).

### 2. Sheet 컴포넌트 — `components/invoice/InvoiceDetailSheet.tsx`

Client Component. `shadcn/ui Sheet`(`Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`) 사용.

**상태:**
- `open: boolean` — 시트 열림 여부
- `invoice: Invoice | null` — 로드된 상세 데이터
- `loading: boolean` — 로딩 스피너
- `error: string | null`

**동작:**
- `open` 시 `GET /api/invoices/{id}` 호출 → items 포함 데이터 수신
- 로딩 중: Skeleton 3줄
- 완료: 항목 테이블(항목명·수량·단가·금액) + 합계 + 메모 + PDF 다운로드 버튼(`PdfDownloadButton` 재사용)

**props:**
```ts
interface InvoiceDetailSheetProps {
  invoiceId: string | null   // null이면 닫힘
  invoiceNumber: string      // 제목용 (즉시 표시)
  onClose: () => void
}
```

### 3. InvoiceTable 수정 — `components/invoice/InvoiceTable.tsx`

- `selectedInvoice: { id: string; invoiceNumber: string } | null` 상태 추가
- 각 `TableRow`에 `onClick={() => setSelectedInvoice({ id, invoiceNumber })}` + `cursor-pointer hover:bg-muted/50` 클래스 추가
- 테이블 하단(또는 테이블 외부)에 `<InvoiceDetailSheet>` 마운트

기존 `CopyLinkButton` 클릭이 행 클릭 이벤트로 버블링되지 않도록 `e.stopPropagation()` 추가.

### 4. shadcn Sheet 설치 확인

`npx shadcn add sheet` — 이미 있으면 스킵.

---

## 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `app/api/invoices/[id]/route.ts` | 신규 생성 (GET 핸들러) |
| `components/invoice/InvoiceDetailSheet.tsx` | 신규 생성 |
| `components/invoice/InvoiceTable.tsx` | 행 클릭 + Sheet 마운트 추가 |

재사용:
- `lib/notion.ts` — `getInvoiceById()` (서버에서 호출)
- `components/invoice/PdfDownloadButton.tsx` — Sheet 내부에서 그대로 재사용
- `components/ui/skeleton` — 로딩 상태
- `lib/constants.ts` — `CURRENCY_FORMAT`, `DATE_FORMAT`, `INVOICE_STATUS_LABELS`

---

## 검증

1. `npm run dev` 실행
2. `/dashboard/invoices` 접속 → 행 클릭 → Sheet 열림 확인
3. 로딩 스피너 → 항목 테이블(웹사이트 디자인, 로고 제작, 명함디자인) 표시 확인
4. PDF 다운로드 버튼 동작 확인
5. Sheet 닫기(ESC / 오버레이 클릭 / X 버튼) 확인
6. 링크 복사 버튼 클릭 시 Sheet가 열리지 않는지 확인 (stopPropagation)
