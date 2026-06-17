import { getSources, getSymptom, SYMPTOMS } from "./emergency-data"
import type { EmergencyLevel, SourceRef, SymptomGuide, SymptomResult } from "./types"

export const MEDICAL_DISCLAIMER =
  "이 서비스는 진단이 아니며, 위급한 경우 즉시 119에 연락하세요."

export const LEVEL_META: Record<
  EmergencyLevel,
  { label: string; summary: string; badgeClass: string; panelClass: string }
> = {
  urgent: {
    label: "긴급",
    summary: "생명과 직결될 수 있어 119 또는 응급실을 우선 고려해야 합니다.",
    badgeClass: "bg-red-600 text-white",
    panelClass: "border-red-200 bg-red-50 text-red-950",
  },
  soon: {
    label: "빠른 진료 권장",
    summary: "상태가 악화될 수 있으니 빠른 진료 또는 응급실 진료를 권장합니다.",
    badgeClass: "bg-orange-500 text-white",
    panelClass: "border-orange-200 bg-orange-50 text-orange-950",
  },
  routine: {
    label: "일반 진료",
    summary: "증상 변화를 살피며 일반 외래 진료를 고려할 수 있습니다.",
    badgeClass: "bg-emerald-600 text-white",
    panelClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
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
  return getSymptom(queryOrId)
    ? { guide: getSymptom(queryOrId)! }
    : searchSymptoms(queryOrId)[0]
}

export function getLevelMeta(level: EmergencyLevel) {
  return LEVEL_META[level]
}

export function getSymptomSources(symptom: SymptomGuide): SourceRef[] {
  return getSources(symptom.sourceIds)
}
