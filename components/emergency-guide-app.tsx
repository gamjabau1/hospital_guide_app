"use client"

import { useMemo, useState } from "react"
import { ClipboardList, MapPin, Phone, Pill, Search } from "lucide-react"
import { toast } from "sonner"
import { ScreenShell } from "@/components/screen-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { QUICK_SYMPTOM_IDS, getSymptom } from "@/lib/emergency-data"
import {
  MEDICAL_DISCLAIMER,
  getLevelMeta,
  getSymptomSources,
  resolveSymptom,
  searchSymptoms,
} from "@/lib/emergency-engine"
import type { EmergencyLevel, Screen, SymptomGuide } from "@/lib/types"

const QUICK_SYMPTOMS = QUICK_SYMPTOM_IDS.map(getSymptom).filter(Boolean) as SymptomGuide[]

function levelAccent(level: EmergencyLevel) {
  if (level === "urgent") return "border-rose-200 bg-rose-50 text-rose-950"
  if (level === "soon") return "border-amber-200 bg-amber-50 text-amber-950"
  return "border-sky-200 bg-sky-50 text-sky-950"
}

function naverMapSearchUrl(query: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`
}

function getTriageLevel(selected: SymptomGuide, answers: Record<string, boolean>): EmergencyLevel {
  const yesQuestions = selected.triageQuestions.filter((question) => answers[question.id])
  if (yesQuestions.some((question) => question.urgent)) return "urgent"
  if (yesQuestions.length > 0 && selected.emergencyLevel === "routine") return "soon"
  return selected.emergencyLevel
}

export function EmergencyGuideApp() {
  const [screen, setScreen] = useState<Screen>("home")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<SymptomGuide | undefined>()
  const [triageAnswers, setTriageAnswers] = useState<Record<string, boolean>>({})

  const suggestions = useMemo(() => searchSymptoms(query).slice(0, 4), [query])
  const triageLevel = selected ? getTriageLevel(selected, triageAnswers) : undefined
  const meta = triageLevel ? getLevelMeta(triageLevel) : undefined
  const sources = selected ? getSymptomSources(selected) : []
  const recommendedDepartment = selected?.recommendedDepartments[0] ?? "병원"
  const yesAnswers = selected?.triageQuestions.filter((question) => triageAnswers[question.id]) ?? []

  function selectSymptom(symptom: SymptomGuide) {
    setSelected(symptom)
    setQuery(symptom.name)
    setTriageAnswers({})
    setScreen("result")
  }

  function handleSearch() {
    const result = resolveSymptom(query)
    if (!result) {
      toast.error("증상을 찾지 못했어요. 빠른 증상 버튼을 선택해 주세요.")
      return
    }
    selectSymptom(result.guide)
  }

  function updateTriageAnswer(id: string, value: boolean) {
    setTriageAnswers((current) => ({ ...current, [id]: value }))
  }

  if (screen === "result" && selected && meta) {
    return (
      <ScreenShell
        title={selected.name}
        subtitle="증상 안내 결과"
        onBack={() => setScreen("home")}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="min-h-12 rounded-full bg-white"
              onClick={() => setScreen("home")}
            >
              다시 검색
            </Button>
            <Button variant="destructive" className="min-h-12 rounded-full" asChild>
              <a href="tel:119" aria-label="119 전화">
                119 전화
              </a>
            </Button>
          </div>
        }
      >
        <section className="mx-auto max-w-3xl space-y-4">
          <Card className={`${meta.panelClass} rounded-[2rem] shadow-sm`}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium opacity-80">문진 반영 안내</p>
                  <h2 className="text-3xl font-black">{meta.label}</h2>
                </div>
                <Badge className={`${meta.badgeClass} rounded-full px-3 py-1`}>
                  {meta.label}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed">{meta.summary}</p>
              {yesAnswers.length > 0 && (
                <div className="space-y-1 rounded-3xl bg-white/70 p-3 text-sm">
                  {yesAnswers.map((answer) => (
                    <p key={answer.id}>• {answer.ifYes}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-4" />
                짧은 문진
              </CardTitle>
              <CardDescription>
                해당되는 항목을 고르면 안내 수준이 더 보수적으로 바뀝니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.triageQuestions.map((question) => (
                <div key={question.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-950">{question.question}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant={triageAnswers[question.id] === true ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => updateTriageAnswer(question.id, true)}
                    >
                      예
                    </Button>
                    <Button
                      variant={triageAnswers[question.id] === false ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => updateTriageAnswer(question.id, false)}
                    >
                      아니요
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-sky-100 bg-sky-50/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-sky-950">추천 진료과</CardTitle>
              <CardDescription className="text-sky-900">
                가장 먼저 고려할 진료과는 {recommendedDepartment}입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selected.recommendedDepartments.map((department) => (
                  <Badge
                    key={department}
                    className="rounded-full bg-white px-3 py-1 text-sm text-sky-950 shadow-sm hover:bg-white"
                  >
                    {department}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button className="min-h-12 rounded-full" asChild>
                  <a
                    href={naverMapSearchUrl(`내 주변 ${recommendedDepartment}`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin className="size-4" />
                    네이버지도에서 {recommendedDepartment} 찾기
                  </a>
                </Button>
                <Button variant="outline" className="min-h-12 rounded-full bg-white" asChild>
                  <a href={naverMapSearchUrl("내 주변 약국")} target="_blank" rel="noreferrer">
                    <Pill className="size-4" />
                    네이버지도에서 약국 찾기
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-[2rem] border-violet-100 bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">지금 해볼 수 있는 처치</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                  {selected.firstAidSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-rose-100 bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-rose-700">하지 말아야 할 행동</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {selected.avoidActions.map((action) => (
                    <li key={action} className="rounded-2xl bg-rose-50 px-3 py-2 text-rose-950">
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[2rem] border-emerald-100 bg-emerald-50/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-emerald-950">
                <Pill className="size-4" />
                약국에서 물어볼 수 있는 물품
              </CardTitle>
              <CardDescription className="text-emerald-900">
                증상과 나이, 복용 중인 약을 말하고 정확한 사항은 약사와 상의하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {selected.pharmacyItems.map((item) => (
                <Badge
                  key={item}
                  className="rounded-full bg-white px-3 py-1 text-emerald-950 shadow-sm hover:bg-white"
                >
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-indigo-100 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-indigo-950">병원 갈 때 준비할 것</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm leading-relaxed sm:grid-cols-2">
                {selected.hospitalPrepItems.map((item) => (
                  <li key={item} className="rounded-2xl bg-indigo-50 px-3 py-2 text-indigo-950">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-amber-200 bg-amber-50/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-amber-950">위험 신호</CardTitle>
              <CardDescription className="text-amber-900">
                해당하면 119 또는 응급실을 우선하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {selected.warningSigns.map((sign) => (
                <Badge
                  key={sign}
                  className="rounded-full bg-white px-3 py-1 text-amber-950 shadow-sm hover:bg-white"
                >
                  {sign}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {sources.length > 0 && (
            <Card className="rounded-[2rem] bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">참고한 공개 자료</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-3xl border border-slate-100 bg-white p-3 text-sm hover:bg-slate-50"
                  >
                    <span className="font-semibold">{source.institution}</span> · {source.title}
                    <span className="mt-1 block text-xs text-slate-500">{source.note}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          <p className="text-xs leading-relaxed text-slate-500">{MEDICAL_DISCLAIMER}</p>
        </section>
      </ScreenShell>
    )
  }

  return (
    <ScreenShell title="어디로 가야 해?" subtitle="일상 속 작은 응급처치를 빠르게 확인해요">
      <section className="mx-auto max-w-3xl space-y-5">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-white/90 shadow-sm shadow-pink-100/50">
          <CardContent className="space-y-5 p-5">
            <div className="space-y-2 rounded-[1.5rem] bg-gradient-to-br from-pink-50 to-violet-50 p-4">
              <p className="text-sm font-bold text-pink-500">간단하게 확인해요</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                어디가 불편한가요?
              </h2>
              <p className="text-sm font-medium text-slate-600">
                증상을 선택하거나 검색하면 문진, 응급처치, 진료과, 약국 물품을 안내합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch()
                  }}
                  className="min-h-14 rounded-full border-pink-100 bg-pink-50/70 pl-10 text-base shadow-inner focus-visible:bg-white"
                  placeholder="예: 살짝 베였어요"
                  aria-label="증상 검색"
                />
              </div>
              <Button className="min-h-14 rounded-full px-5 shadow-sm" onClick={handleSearch}>
                검색
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="grid gap-2">
                {suggestions.map(({ guide, matchedKeyword }) => (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => selectSymptom(guide)}
                    className="min-h-11 rounded-3xl border border-pink-100 bg-white px-4 py-2 text-left text-sm shadow-sm hover:bg-pink-50"
                  >
                    <span className="font-semibold">{guide.name}</span>
                    {matchedKeyword && (
                      <span className="ml-2 text-xs text-slate-500">
                        {matchedKeyword} 관련
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {QUICK_SYMPTOMS.map((symptom) => (
            <button
              key={symptom.id}
              type="button"
              onClick={() => selectSymptom(symptom)}
              className={`min-h-16 rounded-[1.5rem] border px-4 py-3 text-left text-sm font-bold shadow-sm transition hover:scale-[1.01] hover:shadow-md ${levelAccent(
                symptom.emergencyLevel,
              )}`}
            >
              {symptom.shortLabel}
            </button>
          ))}
        </div>

        <Button variant="destructive" className="min-h-14 w-full rounded-full text-base shadow-sm" asChild>
          <a href="tel:119" aria-label="119 전화">
            <Phone className="size-5" />
            119 전화
          </a>
        </Button>

        <p className="rounded-[1.5rem] bg-white/80 px-4 py-3 text-xs leading-relaxed text-slate-600 shadow-sm">
          {MEDICAL_DISCLAIMER}
        </p>
      </section>
    </ScreenShell>
  )
}
