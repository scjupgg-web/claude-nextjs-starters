"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Bell,
  Check,
  ChevronRight,
  Cloud,
  CreditCard,
  GitBranch,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Search,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// 섹션 래퍼
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight border-b pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  )
}

// Tab 1: 기본 요소
function BasicsTab() {
  return (
    <div className="space-y-10">
      <Section title="Button">
        <div className="space-y-3">
          <Row>
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Bell />
            </Button>
            <Button disabled>Disabled</Button>
          </Row>
        </div>
      </Section>

      <Section title="Badge">
        <Row>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </Row>
      </Section>

      <Section title="Alert">
        <div className="space-y-3 max-w-xl">
          <Alert>
            <Bell className="size-4" />
            <AlertTitle>알림</AlertTitle>
            <AlertDescription>
              기본 알림 메시지입니다. 중요한 정보를 전달할 때 사용합니다.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <Bell className="size-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>
              오류가 발생했습니다. 다시 시도해 주세요.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Progress">
        <div className="space-y-3 max-w-sm">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">0%</span>
            <Progress value={0} />
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">35%</span>
            <Progress value={35} />
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">70%</span>
            <Progress value={70} />
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">100%</span>
            <Progress value={100} />
          </div>
        </div>
      </Section>

      <Section title="Skeleton">
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </Section>

      <Section title="Separator">
        <div className="space-y-4 max-w-sm">
          <div>
            <p className="text-sm">위 텍스트</p>
            <Separator className="my-3" />
            <p className="text-sm">아래 텍스트</p>
          </div>
          <div className="flex items-center gap-3 h-6">
            <span className="text-sm">왼쪽</span>
            <Separator orientation="vertical" />
            <span className="text-sm">가운데</span>
            <Separator orientation="vertical" />
            <span className="text-sm">오른쪽</span>
          </div>
        </div>
      </Section>

      <Section title="Avatar">
        <div className="space-y-4">
          <Row>
            <Avatar size="sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>KR</AvatarFallback>
            </Avatar>
          </Row>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </Section>
    </div>
  )
}

// Tab 2: 폼 요소
function FormsTab() {
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(false)
  const [radio, setRadio] = useState("option-1")

  return (
    <div className="space-y-10">
      <Section title="Input & Label">
        <div className="space-y-3 max-w-sm">
          <div className="space-y-1">
            <Label htmlFor="basic-input">기본 입력</Label>
            <Input id="basic-input" placeholder="텍스트를 입력하세요" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="disabled-input">비활성화</Label>
            <Input id="disabled-input" placeholder="입력 불가" disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email-input">이메일</Label>
            <Input id="email-input" type="email" placeholder="example@email.com" />
          </div>
        </div>
      </Section>

      <Section title="Textarea">
        <div className="space-y-3 max-w-sm">
          <div className="space-y-1">
            <Label htmlFor="basic-textarea">기본 텍스트영역</Label>
            <Textarea id="basic-textarea" placeholder="내용을 입력하세요" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="disabled-textarea">비활성화</Label>
            <Textarea id="disabled-textarea" placeholder="입력 불가" disabled />
          </div>
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="check-1"
              checked={checked}
              onCheckedChange={(v) => setChecked(!!v)}
            />
            <Label htmlFor="check-1">체크됨</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="check-2" />
            <Label htmlFor="check-2">미체크</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="check-3" disabled />
            <Label htmlFor="check-3">비활성화</Label>
          </div>
        </div>
      </Section>

      <Section title="Switch">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="sw-1"
              checked={switched}
              onCheckedChange={setSwitched}
            />
            <Label htmlFor="sw-1">{switched ? "켜짐" : "꺼짐"}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw-2" disabled />
            <Label htmlFor="sw-2">비활성화</Label>
          </div>
        </div>
      </Section>

      <Section title="RadioGroup">
        <RadioGroup value={radio} onValueChange={setRadio}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-1" id="r1" />
            <Label htmlFor="r1">옵션 1</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-2" id="r2" />
            <Label htmlFor="r2">옵션 2</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-3" id="r3" />
            <Label htmlFor="r3">옵션 3</Label>
          </div>
        </RadioGroup>
      </Section>

      <Section title="Select">
        <div className="max-w-xs">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>과일</SelectLabel>
                <SelectItem value="apple">사과</SelectItem>
                <SelectItem value="banana">바나나</SelectItem>
                <SelectItem value="orange">오렌지</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>채소</SelectLabel>
                <SelectItem value="carrot">당근</SelectItem>
                <SelectItem value="potato">감자</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="InputGroup">
        <div className="space-y-3 max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
          </InputGroup>
          <InputGroup>
            <InputGroupInput type="email" placeholder="이메일 주소" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>@company.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Section>
    </div>
  )
}

// Tab 3: 오버레이
function OverlaysTab() {
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <div className="space-y-10">
      <Section title="Dialog">
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">기본 다이얼로그 열기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>다이얼로그 제목</DialogTitle>
                <DialogDescription>
                  이것은 기본 다이얼로그 예제입니다. 중요한 정보나 확인이
                  필요한 액션에 사용됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <p className="text-sm text-muted-foreground">다이얼로그 본문 내용이 여기에 표시됩니다.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">취소</Button>
                <Button>확인</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">삭제 확인</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없습니다. 데이터가 영구적으로 삭제됩니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">취소</Button>
                <Button variant="destructive">삭제</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      <Section title="Sheet">
        <Row>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">왼쪽 Sheet</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>왼쪽 패널</SheetTitle>
                <SheetDescription>
                  왼쪽에서 슬라이드로 열리는 패널입니다.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">패널 내용이 여기에 표시됩니다.</p>
              </div>
              <SheetFooter>
                <Button>저장</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">오른쪽 Sheet</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>오른쪽 패널</SheetTitle>
                <SheetDescription>
                  오른쪽에서 슬라이드로 열리는 패널입니다.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">설정이나 상세 정보를 표시할 때 유용합니다.</p>
              </div>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>

      <Section title="Tooltip">
        <Row>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">마우스를 올려보세요</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>툴팁 메시지입니다</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <Bell />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>알림</p>
            </TooltipContent>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">팝오버 열기</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">팝오버 제목</h4>
              <p className="text-sm text-muted-foreground">
                클릭으로 열리는 팝오버 컴포넌트입니다. 추가 정보나 작은 폼에
                활용합니다.
              </p>
              <Button size="sm" className="w-full">
                액션 버튼
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </Section>

      <Section title="DropdownMenu">
        <Row>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">기본 드롭다운</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User />
                  <span>프로필</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  <span>결제</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  <span>설정</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Keyboard />
                  <span>단축키</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users />
                  <span>팀</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus />
                    <span>멤버 초대</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Mail />
                        <span>이메일로 초대</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare />
                        <span>메시지로 초대</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle />
                        <span>더 보기...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  <Plus />
                  <span>새 팀</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <GitBranch />
                <span>GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy />
                <span>지원</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut />
                <span>로그아웃</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      <Section title="Command">
        <div className="space-y-3">
          <Button variant="outline" onClick={() => setCommandOpen(true)}>
            커맨드 팔레트 열기 <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
          </Button>
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="명령어를 검색하세요..." />
            <CommandList>
              <CommandEmpty>결과가 없습니다.</CommandEmpty>
              <CommandGroup heading="추천">
                <CommandItem>
                  <Search />
                  <span>검색</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>설정</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="페이지">
                <CommandItem>
                  <User />
                  <span>프로필</span>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>결제</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </Section>

      <Section title="Sonner (Toast)">
        <Row>
          <Button
            variant="outline"
            onClick={() => toast.success("성공적으로 저장되었습니다!")}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("오류가 발생했습니다.")}
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("새로운 업데이트가 있습니다.")}
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning("주의가 필요합니다.")}
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: "처리 중...",
                  success: "완료되었습니다!",
                  error: "실패했습니다.",
                }
              )
            }
          >
            Promise
          </Button>
        </Row>
      </Section>
    </div>
  )
}

// Tab 4: 데이터/레이아웃
function DataTab() {
  const invoices = [
    { id: "INV001", status: "결제완료", method: "신용카드", amount: "₩250,000" },
    { id: "INV002", status: "대기중", method: "페이팔", amount: "₩150,000" },
    { id: "INV003", status: "미결제", method: "계좌이체", amount: "₩350,000" },
    { id: "INV004", status: "결제완료", method: "신용카드", amount: "₩450,000" },
    { id: "INV005", status: "결제완료", method: "페이팔", amount: "₩550,000" },
  ]

  const scrollItems = Array.from({ length: 30 }, (_, i) => `항목 ${i + 1}`)

  return (
    <div className="space-y-10">
      <Section title="Card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>기본 카드</CardTitle>
              <CardDescription>카드 설명 텍스트입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">카드 본문 내용이 여기에 표시됩니다.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">액션</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>통계 카드</CardTitle>
              <CardDescription>이번 달 매출</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₩1,234,000</p>
              <p className="text-sm text-green-500 mt-1">+12.5% 지난달 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>알림 카드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["새 메시지 3개", "댓글 5개", "좋아요 12개"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-green-500" />
                  {item}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                모두 보기
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section title="Table">
        <Table>
          <TableCaption>최근 인보이스 목록</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>인보이스</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>결제 방법</TableHead>
              <TableHead className="text-right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.status === "결제완료"
                        ? "default"
                        : inv.status === "미결제"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell>{inv.method}</TableCell>
                <TableCell className="text-right">{inv.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>합계</TableCell>
              <TableCell className="text-right">₩1,750,000</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Section>

      <Section title="Tabs">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Default variant</p>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">계정</TabsTrigger>
                <TabsTrigger value="tab2">비밀번호</TabsTrigger>
                <TabsTrigger value="tab3">알림</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm">계정 설정 내용이 표시됩니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2" className="mt-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm">비밀번호 변경 폼이 표시됩니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab3" className="mt-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm">알림 설정이 표시됩니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Line variant</p>
            <Tabs defaultValue="overview">
              <TabsList variant="line">
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="analytics">분석</TabsTrigger>
                <TabsTrigger value="reports">보고서</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-3">
                <p className="text-sm text-muted-foreground">개요 콘텐츠</p>
              </TabsContent>
              <TabsContent value="analytics" className="mt-3">
                <p className="text-sm text-muted-foreground">분석 콘텐츠</p>
              </TabsContent>
              <TabsContent value="reports" className="mt-3">
                <p className="text-sm text-muted-foreground">보고서 콘텐츠</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>

      <Section title="ScrollArea">
        <ScrollArea className="h-48 w-64 rounded-md border">
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">스크롤 목록</h4>
            {scrollItems.map((item) => (
              <div key={item} className="text-sm py-1 border-b last:border-0">
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Section>
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">컴포넌트 쇼케이스</h1>
          <p className="text-muted-foreground text-lg">
            프로젝트에 포함된 UI 컴포넌트 예제 모음입니다.
          </p>
        </div>

        <Tabs defaultValue="basics">
          <TabsList className="mb-8">
            <TabsTrigger value="basics">기본 요소</TabsTrigger>
            <TabsTrigger value="forms">폼 요소</TabsTrigger>
            <TabsTrigger value="overlays">오버레이</TabsTrigger>
            <TabsTrigger value="data">데이터 &amp; 레이아웃</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <BasicsTab />
          </TabsContent>
          <TabsContent value="forms">
            <FormsTab />
          </TabsContent>
          <TabsContent value="overlays">
            <OverlaysTab />
          </TabsContent>
          <TabsContent value="data">
            <DataTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  )
}
