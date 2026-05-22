"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BookOpen,
  ClipboardList,
  History,
  Phone,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import { CopyBlock } from "@/components/copy-block"
import { QuickEntry } from "@/components/quick-entry"
import { ScreenShell } from "@/components/screen-shell"
import { SettingsScreen } from "@/components/settings-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ACTIONS_TAKEN,
  CATEGORIES,
  LOCATIONS,
  getCategory,
} from "@/lib/emergency-data"
import {
  EMPTY_INPUT,
  evaluateEmergency,
  getLevelColor,
} from "@/lib/emergency-engine"
import { loadHistory, loadSettings, saveCase } from "@/lib/settings"
import { GUIDELINE_SOURCE } from "@/lib/types"
import type {
  AppSettings,
  EmergencyInput,
  EmergencyResult,
  SavedCase,
  Screen,
} from "@/lib/types"

function OptionButton({
  selected,
  onClick,
  children,
  variant = "default",
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  variant?: "default" | "danger" | "safe"
}) {
  const base =
    variant === "danger"
      ? selected
          ? "border-red-600 bg-red-50 text-red-950 shadow-sm"
        : "border-red-200 bg-white hover:bg-red-50"
      : variant === "safe"
        ? selected
          ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
          : "border-emerald-200 bg-white hover:bg-emerald-50"
        : selected
          ? "border-primary bg-primary/5 text-slate-950 shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${base}`}
    >
      {children}
    </button>
  )
}

export function SchoolCareApp() {
  const [screen, setScreen] = useState<Screen>("home")
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [history, setHistory] = useState<SavedCase[]>([])
  const [input, setInput] = useState<EmergencyInput>(EMPTY_INPUT)
  const [result, setResult] = useState<EmergencyResult | null>(null)

  useEffect(() => {
    setSettings(loadSettings())
    setHistory(loadHistory())
  }, [screen])

  const category = getCategory(input.categoryId)
  const schoolLabel = settings.schoolName || "학교"

  const goHome = useCallback(() => {
    setScreen("home")
    setInput(EMPTY_INPUT())
    setResult(null)
  }, [])

  const finishAndShowResult = useCallback(
    (data: EmergencyInput) => {
      const res = evaluateEmergency(data, settings)
      setResult(res)
      setScreen("result")
    },
    [settings],
  )

  function updateInput(patch: Partial<EmergencyInput>) {
    setInput((prev) => ({ ...prev, ...patch }))
  }

  function toggleFlag(flagId: string) {
    setInput((prev) => ({
      ...prev,
      checkedFlags: prev.checkedFlags.includes(flagId)
        ? prev.checkedFlags.filter((f) => f !== flagId)
        : [...prev.checkedFlags, flagId],
    }))
  }

  function toggleAction(action: string) {
    setInput((prev) => ({
      ...prev,
      actionsTaken: prev.actionsTaken.includes(action)
        ? prev.actionsTaken.filter((a) => a !== action)
        : [...prev.actionsTaken, action],
    }))
  }

  function handleSaveCase() {
    if (!result) return
    const item: SavedCase = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      categoryLabel: category?.label ?? "기타",
      level: result.level,
      summary: result.levelLabel,
      input: { ...input },
      result: { ...result },
    }
    saveCase(item)
    setHistory(loadHistory())
    toast.success("오늘 목록에 저장했습니다")
  }

  const triageComplete = useMemo(() => {
    const t = input.triage
    return (
      t.collapsed !== null &&
      t.noResponse !== null &&
      t.abnormalBreathing !== null &&
      t.noPulse !== null &&
      t.chokingSign !== null
    )
  }, [input.triage])

  const criticalTriage = useMemo(() => {
    const t = input.triage
    return (
      t.collapsed === true ||
      t.noResponse === true ||
      t.abnormalBreathing === true ||
      t.noPulse === true ||
      t.chokingSign === true
    )
  }, [input.triage])

  const cardiacArrestTriage = useMemo(() => {
    const t = input.triage
    return (
      t.noPulse === true ||
      ((t.collapsed === true || t.noResponse === true) &&
        t.abnormalBreathing === true)
    )
  }, [input.triage])

  if (screen === "home") {
    return (
      <ScreenShell title="스쿨케어 SOS" subtitle={`${schoolLabel} 보건실`}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-red-600 text-white">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-red-950">
                    의식·호흡·순환 이상이면 앱보다 119가 먼저입니다.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    입력한 내용은 교육부 3C 흐름에 맞춰 Check, Call, Care 순서로 정리됩니다.
                  </p>
                </div>
              </div>
            </div>

            <QuickEntry
              onResult={(parsed) => {
                setInput(parsed)
                finishAndShowResult(parsed)
              }}
            />
          </section>

          <aside className="space-y-3">
            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">즉시 연락</CardTitle>
                <CardDescription>통화 버튼과 학교 설정</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="destructive" className="h-11" asChild>
                    <a href="tel:119">119</a>
                  </Button>
                  <Button variant="outline" className="h-11" asChild>
                    <a href="tel:112">112</a>
                  </Button>
                </div>
                <Button variant="outline" className="h-11 w-full" asChild>
                  <a
                    href={
                      settings.healthOfficePhone
                        ? `tel:${settings.healthOfficePhone}`
                        : "#"
                    }
                    onClick={(e) => {
                      if (!settings.healthOfficePhone) {
                        e.preventDefault()
                        toast.message("설정에서 보건실 전화번호를 입력하세요")
                        setScreen("settings")
                      }
                    }}
                  >
                    <Phone className="size-4" />
                    보건실
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-2">
              <Button
                variant="outline"
                className="h-11 justify-start bg-white"
                onClick={() => {
                  setInput(EMPTY_INPUT())
                  setResult(null)
                  setScreen("start")
                }}
              >
                <AlertTriangle className="size-4" />
                단계별 입력
              </Button>

              <Button
                variant="secondary"
                className="h-11 justify-start"
                onClick={() => setScreen("history")}
              >
                <History className="size-4" />
                오늘 처리한 상황 ({history.length})
              </Button>

              <Button
                variant="ghost"
                className="h-11 justify-start"
                onClick={() => setScreen("settings")}
              >
                <Settings className="size-4" />
                학교 설정
              </Button>
            </div>

            <Card className="border-teal-200 bg-teal-50/70">
              <CardContent className="space-y-2 pt-5 text-sm text-teal-950">
                <div className="flex items-center gap-2 font-semibold">
                  <BookOpen className="size-4" />
                  공식 근거
                </div>
                <p className="text-teal-900">
                  교육부 2025 학교 응급상황 대응 가이드라인, 서울시교육청 학생안전매뉴얼, 소방청 응급처치 안전교육을 반영했습니다.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </ScreenShell>
    )
  }

  if (screen === "start") {
    return (
      <ScreenShell
        title="입력 방식"
        subtitle="상황에 맞게 선택하세요"
        onBack={goHome}
      >
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          <OptionButton
            selected={input.mode === "quick"}
            onClick={() => {
              updateInput({ mode: "quick" })
              setScreen("triage")
            }}
          >
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-amber-500" />
              <div>
                <p className="font-semibold">빠른 입력</p>
                <p className="text-xs font-normal text-muted-foreground">
                  1~2분 · 자주 나오는 상황
                </p>
              </div>
            </div>
          </OptionButton>
          <OptionButton
            selected={input.mode === "detailed"}
            onClick={() => {
              updateInput({ mode: "detailed" })
              setScreen("triage")
            }}
          >
            <div>
              <p className="font-semibold">상세 입력</p>
              <p className="text-xs font-normal text-muted-foreground">
                3~5분 · 장소·조치 기록 포함
              </p>
            </div>
          </OptionButton>
        </div>
      </ScreenShell>
    )
  }

  if (screen === "triage") {
    return (
      <ScreenShell
        title="보건교사 4 Check"
        subtitle="표 1-1 · 심장정지·응급 여부"
        onBack={() => setScreen("start")}
        footer={
          <Button
            className="w-full"
            disabled={!triageComplete}
            onClick={() => {
              if (criticalTriage) {
                const catId =
                  input.triage.chokingSign === true
                    ? "choking"
                    : cardiacArrestTriage
                      ? "cardiac-arrest"
                      : "consciousness"
                finishAndShowResult({
                  ...input,
                  categoryId: catId,
                })
              } else {
                setScreen("category")
              }
            }}
          >
            {criticalTriage ? "즉시 3C 결과 보기" : "다음"}
          </Button>
        }
      >
        <div className="mx-auto max-w-2xl space-y-5">
          <Card className="border-amber-300 bg-amber-50/80">
            <CardContent className="pt-4 text-sm text-amber-950">
              「예」가 하나라도 있으면 119·심폐소생술·AED를 검토하세요. (가이드라인
              제1장)
            </CardContent>
          </Card>

          {(
            [
              ["collapsed", "의식을 잃고 쓰러졌나요?"],
              ["noResponse", "깨워도 반응이 없나요?"],
              ["abnormalBreathing", "호흡이 없거나 헐떡이는 호흡인가요?"],
              ["noPulse", "맥박이 없나요? (보건교사 확인)"],
              ["chokingSign", "기도폐쇄 의심(말·기침 불가)인가요?"],
            ] as const
          ).map(([key, label]) => (
            <section key={key} className="space-y-2">
              <Label>{label}</Label>
          <div className="grid gap-2 sm:grid-cols-2">
                <OptionButton
                  selected={input.triage[key] === false}
                  onClick={() =>
                    updateInput({
                      triage: { ...input.triage, [key]: false },
                    })
                  }
                  variant="safe"
                >
                  아니오
                </OptionButton>
                <OptionButton
                  selected={input.triage[key] === true}
                  onClick={() =>
                    updateInput({
                      triage: { ...input.triage, [key]: true },
                    })
                  }
                  variant="danger"
                >
                  예
                </OptionButton>
              </div>
            </section>
          ))}
        </div>
      </ScreenShell>
    )
  }

  if (screen === "category") {
    return (
      <ScreenShell
        title="상황 분류"
        subtitle="가이드라인 제2장"
        onBack={() => setScreen("triage")}
        footer={
          <Button
            className="w-full"
            disabled={!input.categoryId}
            onClick={() => setScreen("symptoms")}
          >
            다음
          </Button>
        }
      >
        <div className="mx-auto mb-4 grid max-w-3xl grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">학년 (선택)</Label>
            <Input
              placeholder="예: 3"
              value={input.student.grade}
              onChange={(e) =>
                updateInput({
                  student: { ...input.student, grade: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label className="text-xs">반 (선택)</Label>
            <Input
              placeholder="예: 2"
              value={input.student.classNum}
              onChange={(e) =>
                updateInput({
                  student: { ...input.student, classNum: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <OptionButton
              key={cat.id}
              selected={input.categoryId === cat.id}
              onClick={() =>
                updateInput({ categoryId: cat.id, checkedFlags: [] })
              }
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="mt-1 block font-semibold">{cat.label}</span>
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {cat.chapter}
              </span>
            </OptionButton>
          ))}
        </div>
      </ScreenShell>
    )
  }

  if (screen === "symptoms") {
    const cat = getCategory(input.categoryId)
    return (
      <ScreenShell
        title="3C · Check"
        subtitle={cat?.label}
        onBack={() => setScreen("category")}
        footer={
          <Button
            className="w-full"
            onClick={() => {
              if (input.mode === "detailed") setScreen("details")
              else finishAndShowResult(input)
            }}
          >
            {input.mode === "detailed" ? "다음" : "3C 결과 보기"}
          </Button>
        }
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="text-sm text-muted-foreground">
            가이드라인 Check 항목 중 해당되는 것을 모두 선택하세요. (V = 응급)
          </p>
          {cat?.quasiNote && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="py-3 text-xs text-blue-900">
                {cat.quasiNote}
              </CardContent>
            </Card>
          )}
          <div className="space-y-2">
            {cat?.checkFlags.map((flag) => (
              <label
                key={flag.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border bg-white px-3 py-2 ${
                  flag.tier === "emergency"
                    ? "border-red-200"
                    : flag.tier === "quasi"
                      ? "border-orange-200"
                      : ""
                }`}
              >
                <Checkbox
                  checked={input.checkedFlags.includes(flag.id)}
                  onCheckedChange={() => toggleFlag(flag.id)}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm">{flag.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {flag.tier === "emergency"
                      ? "응급"
                      : flag.tier === "quasi"
                        ? "준응급"
                        : "보건실"}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </ScreenShell>
    )
  }

  if (screen === "details") {
    return (
      <ScreenShell
        title="상세 정보"
        onBack={() => setScreen("symptoms")}
        footer={
          <Button className="w-full" onClick={() => finishAndShowResult(input)}>
            결과 보기
          </Button>
        }
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <section className="space-y-2">
            <Label>발생 장소</Label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <Button
                  key={loc}
                  type="button"
                  size="sm"
                  variant={input.location === loc ? "default" : "outline"}
                  onClick={() => updateInput({ location: loc })}
                >
                  {loc}
                </Button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <Label>이미 한 조치</Label>
            <div className="space-y-2">
              {ACTIONS_TAKEN.map((action) => (
                <label
                  key={action}
                  className="flex cursor-pointer items-center gap-3 rounded-md border bg-white px-3 py-2"
                >
                  <Checkbox
                    checked={input.actionsTaken.includes(action)}
                    onCheckedChange={() => toggleAction(action)}
                  />
                  <span className="text-sm">{action}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <Label>추가 메모</Label>
            <Textarea
              placeholder="예: 체육 시간, 담임 확인함"
              value={input.notes}
              onChange={(e) => updateInput({ notes: e.target.value })}
              rows={3}
            />
          </section>
        </div>
      </ScreenShell>
    )
  }

  if (screen === "result" && result) {
    return (
      <ScreenShell
        title="응급 대응 결과"
        onBack={goHome}
        footer={
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleSaveCase}>
                저장
              </Button>
              <Button variant="outline" onClick={goHome}>
                홈으로
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setScreen("category")}
            >
              분류가 다르면 단계별로 수정
            </Button>
            {result.call119 && (
              <Button variant="destructive" asChild>
                <a href="tel:119">119 전화 또는 이송 상담</a>
              </Button>
            )}
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            <div
              className={`rounded-lg p-4 text-center shadow-sm ${getLevelColor(result.level)}`}
            >
            <p className="text-lg font-bold">{result.levelLabel}</p>
            <p className="mt-1 text-sm opacity-90">
              {result.guidelineClassLabel}
            </p>
            <p className="mt-2 text-sm opacity-95">{result.levelSummary}</p>
            {result.call119 && (
              <Badge variant="destructive" className="mt-3">
                119·응급실 검토
              </Badge>
            )}
            </div>

            <Tabs defaultValue="three-c" className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap gap-1">
              <TabsTrigger value="three-c">3C</TabsTrigger>
              <TabsTrigger value="level">분류</TabsTrigger>
              <TabsTrigger value="triage">Care</TabsTrigger>
              <TabsTrigger value="roles">역할</TabsTrigger>
              <TabsTrigger value="parent">학부모</TabsTrigger>
              <TabsTrigger value="journal">보건일지</TabsTrigger>
              <TabsTrigger value="sources">근거</TabsTrigger>
            </TabsList>

            <TabsContent value="three-c" className="mt-4 space-y-3">
              {(["check", "call", "care"] as const).map((phase) => (
                <Card key={phase}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base uppercase">
                      {phase === "check"
                        ? "Check · 상황판단"
                        : phase === "call"
                          ? "Call · 도움요청"
                          : "Care · 응급처치"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-4 text-sm">
                      {result.threeC[phase].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="level" className="mt-4">
              <Card>
                <CardContent className="space-y-2 pt-6 text-sm">
                  <p className="font-semibold">{result.levelLabel}</p>
                  <p>{result.guidelineClassLabel}</p>
                  <p className="text-muted-foreground">{result.levelSummary}</p>
                  <p>
                    <span className="font-medium">이송:</span> {result.hospital}
                  </p>
                  <p>
                    <span className="font-medium">진료과:</span>{" "}
                    {result.department}
                  </p>
                  <p>
                    119:{" "}
                    <strong>{result.call119 ? "신고·이송 검토" : "필요 시"}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {GUIDELINE_SOURCE}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="mt-4 space-y-3">
              {(
                [
                  ["discoverer", "최초발견자"],
                  ["healthTeacher", "보건교사"],
                  ["homeroom", "담임교사"],
                ] as const
              ).map(([key, title]) => (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-4 text-sm">
                      {result.roleChecklist[key].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="triage" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">응급처치 순서</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal space-y-2 pl-4 text-sm">
                    {result.firstAid.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parent" className="mt-4">
              <CopyBlock label="학부모 안내문" text={result.parentMessage} />
            </TabsContent>

            <TabsContent value="journal" className="mt-4">
              <CopyBlock label="보건일지 기록" text={result.healthJournal} />
            </TabsContent>

            <TabsContent value="sources" className="mt-4 space-y-2">
              {result.sources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="space-y-1 pt-5 text-sm">
                    <p className="font-semibold">
                      {source.institution} · {source.title}
                    </p>
                    <p className="text-muted-foreground">{source.note}</p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      자료 열기
                    </a>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            </Tabs>
          </section>

          <Card className="h-fit bg-white/95 lg:sticky lg:top-20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-4" />
                지금 할 일
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {result.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 size-4 shrink-0 rounded border" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                {result.disclaimer}
              </p>
            </CardContent>
          </Card>
        </div>
      </ScreenShell>
    )
  }

  if (screen === "history") {
    return (
      <ScreenShell title="처리 기록" onBack={goHome}>
        {history.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            저장된 기록이 없습니다.
          </p>
        ) : (
          <div className="mx-auto max-w-2xl space-y-2">
            {history.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer transition-colors hover:bg-muted/30"
                onClick={() => {
                  setInput(item.input)
                  setResult(item.result)
                  setScreen("result")
                }}
              >
                <CardContent className="flex items-center justify-between gap-2 py-4">
                  <div>
                    <p className="font-medium">{item.categoryLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <Badge>{item.summary}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScreenShell>
    )
  }

  if (screen === "settings") {
    return (
      <SettingsScreen
        settings={settings}
        onSave={setSettings}
        onBack={goHome}
      />
    )
  }

  return null
}
