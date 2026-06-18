import { getSources, getSymptom, SYMPTOMS } from "./emergency-data"
import type { EmergencyLevel, SourceRef, SymptomGuide, SymptomResult } from "./types"

export const MEDICAL_DISCLAIMER =
  "이 서비스는 진단이 아니라 일반적인 응급처치 안내입니다. 위급한 경우 즉시 119에 연락하세요."

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
    summary: "상태가 나빠질 수 있어 빠른 진료 또는 응급실 진료를 권장합니다.",
    badgeClass: "bg-orange-500 text-white",
    panelClass: "border-orange-200 bg-orange-50 text-orange-950",
  },
  routine: {
    label: "일상 처치",
    summary: "가벼운 증상은 집에서 처치하며 변화를 살피고, 호전되지 않으면 일반 진료를 고려하세요.",
    badgeClass: "bg-emerald-600 text-white",
    panelClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "")
}

function getBigrams(value: string): string[] {
  if (value.length <= 1) return value ? [value] : []

  const grams: string[] = []
  for (let index = 0; index < value.length - 1; index += 1) {
    grams.push(value.slice(index, index + 2))
  }
  return grams
}

function diceSimilarity(left: string, right: string): number {
  const leftBigrams = getBigrams(left)
  const rightBigrams = getBigrams(right)
  if (leftBigrams.length === 0 || rightBigrams.length === 0) return 0

  const rightCounts = new Map<string, number>()
  for (const gram of rightBigrams) {
    rightCounts.set(gram, (rightCounts.get(gram) ?? 0) + 1)
  }

  let matches = 0
  for (const gram of leftBigrams) {
    const count = rightCounts.get(gram) ?? 0
    if (count > 0) {
      matches += 1
      rightCounts.set(gram, count - 1)
    }
  }

  return (2 * matches) / (leftBigrams.length + rightBigrams.length)
}

function editSimilarity(left: string, right: string): number {
  if (left === right) return 1
  if (!left || !right) return 0

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  const current = Array.from({ length: right.length + 1 }, () => 0)

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost,
      )
    }

    for (let index = 0; index < previous.length; index += 1) {
      previous[index] = current[index]
    }
  }

  const distance = previous[right.length]
  return 1 - distance / Math.max(left.length, right.length)
}

function textSimilarity(left: string, right: string): number {
  return Math.max(diceSimilarity(left, right), editSimilarity(left, right))
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
      continue
    }

    if (candidate.weight >= 4 && normalizedQuery.length >= 2 && normalizedCandidate.length >= 2) {
      const similarity = textSimilarity(normalizedQuery, normalizedCandidate)
      if (similarity >= 0.45) {
        score += candidate.weight * similarity
        keyword ??= candidate.value
      }
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
