import { getSources, getSymptom, SYMPTOMS } from "./emergency-data"
import type { EmergencyLevel, SourceRef, SymptomGuide, SymptomResult } from "./types"

export const MEDICAL_DISCLAIMER =
  "이 서비스는 진단이 아니라 일반적인 응급처치와 진료과 안내입니다. 위급한 경우 즉시 119에 연락하세요."

export const LEVEL_META: Record<
  EmergencyLevel,
  { label: string; summary: string; badgeClass: string; panelClass: string }
> = {
  urgent: {
    label: "긴급",
    summary: "생명과 직결될 수 있어 119 또는 응급실을 우선 고려해야 합니다.",
    badgeClass: "bg-stone-800 text-white",
    panelClass: "border-stone-200 bg-stone-50 text-stone-950",
  },
  soon: {
    label: "빠른 진료 권장",
    summary: "상태가 나빠질 수 있어 빠른 진료 또는 응급실 진료를 권장합니다.",
    badgeClass: "bg-amber-500 text-white",
    panelClass: "border-amber-200 bg-amber-50 text-amber-950",
  },
  routine: {
    label: "일반 진료/관찰",
    summary: "가벼운 증상은 변화를 살피고, 호전되지 않으면 일반 진료를 고려하세요.",
    badgeClass: "bg-indigo-700 text-white",
    panelClass: "border-indigo-100 bg-indigo-50 text-indigo-950",
  },
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "")
}

function scoreSymptom(query: string, symptom: SymptomGuide): { score: number; keyword?: string } {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return { score: 0 }

  let score = 0
  let keyword: string | undefined
  const candidates = [
    { value: symptom.name, weight: 10 },
    { value: symptom.shortLabel, weight: 10 },
    ...symptom.keywords.map((value) => ({ value, weight: 6 })),
    ...symptom.warningSigns.map((value) => ({ value, weight: 4 })),
    ...symptom.recommendedDepartments.map((value) => ({ value, weight: 2 })),
  ]

  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate.value)
    if (!normalizedCandidate) continue
    if (
      normalizedQuery.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedQuery)
    ) {
      score += candidate.weight
      keyword ??= candidate.value
    }
  }

  return { score, keyword }
}

export function searchSymptoms(query: string): SymptomResult[] {
  const results = SYMPTOMS.map((guide) => {
    const match = scoreSymptom(query, guide)
    return { guide, matchedKeyword: match.keyword, score: match.score }
  })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)

  return results.map(({ guide, matchedKeyword }) => ({ guide, matchedKeyword }))
}

export function resolveSymptom(queryOrId: string): SymptomResult | undefined {
  const directMatch = getSymptom(queryOrId)
  return directMatch ? { guide: directMatch } : searchSymptoms(queryOrId)[0]
}

export function getLevelMeta(level: EmergencyLevel) {
  return LEVEL_META[level]
}

export function getSymptomSources(symptom: SymptomGuide): SourceRef[] {
  return getSources(symptom.sourceIds)
}
