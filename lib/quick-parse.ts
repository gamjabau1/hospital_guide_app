import { getCategory } from "./emergency-data"
import { EMPTY_INPUT } from "./emergency-engine"
import type { EmergencyInput, TriageAnswers } from "./types"

export type QuickParseMeta = {
  categoryLabel: string
  hints: string[]
  confidence: "high" | "medium" | "low"
}

type Rule = {
  keywords: string[]
  categoryId: string
  flags?: string[]
  triage?: Partial<TriageAnswers>
  location?: string
  weight?: number
}

const RULES: Rule[] = [
  {
    keywords: ["심장정지", "심폐", "cpr", "aed", "맥박없", "맥박 없", "호흡없", "호흡 없"],
    categoryId: "cardiac-arrest",
    flags: ["unconscious", "no-breath"],
    triage: {
      collapsed: true,
      noResponse: true,
      abnormalBreathing: true,
    },
    weight: 10,
  },
  {
    keywords: ["질식", "목막", "목 막", "사탕 걸", "기침 못", "말 못", "v자"],
    categoryId: "choking",
    flags: ["cannot-speak"],
    triage: { chokingSign: true },
    weight: 10,
  },
  {
    keywords: ["실신", "쓰러", "의식 없", "의식없", "무반응", "반응 없", "깨우"],
    categoryId: "consciousness",
    flags: ["unresponsive"],
    triage: { collapsed: true, noResponse: true },
    weight: 8,
  },
  {
    keywords: ["과호흡", "숨 가쁘", "공황", "손발 저림", "입술 파래"],
    categoryId: "hyperventilation",
    flags: ["tachypnea"],
    weight: 6,
  },
  {
    keywords: [
      "아나필",
      "알레르",
      "두드러",
      "입술 부",
      "얼굴 부",
      "에피네프린",
    ],
    categoryId: "asthma-anaphylaxis",
    flags: ["facial-swelling", "severe-breath"],
    weight: 9,
  },
  {
    keywords: ["천식", "쌕쌕", "기관지", "흡입기", "벤톨린"],
    categoryId: "asthma-anaphylaxis",
    flags: ["wheeze"],
    weight: 7,
  },
  {
    keywords: ["지혈 안", "지혈안", "피 많", "대량 출혈", "심한 출혈"],
    categoryId: "bleeding",
    flags: ["uncontrolled", "shock"],
    weight: 9,
  },
  {
    keywords: ["출혈", "피 나", "코피", "상처", "찰과", "베임"],
    categoryId: "bleeding",
    flags: ["minor-cut"],
    weight: 5,
  },
  {
    keywords: ["화상", "데임", "데였", "뜨거운 물", "끓는"],
    categoryId: "burn",
    flags: ["blister"],
    weight: 7,
  },
  {
    keywords: ["저혈당", "고혈당", "당뇨", "혈당", "글루카곤", "인슐린"],
    categoryId: "diabetes",
    weight: 7,
  },
  {
    keywords: ["경련", "발작", "뇌전", "씩씩"],
    categoryId: "seizure",
    flags: ["active"],
    weight: 8,
  },
  {
    keywords: ["벌", "쏘", "따벌", "말벌", "뱀"],
    categoryId: "sting-foreign",
    weight: 6,
  },
  {
    keywords: ["이물", "눈에", "코에", "들어갔"],
    categoryId: "sting-foreign",
    flags: ["eye-foreign"],
    weight: 5,
  },
  {
    keywords: ["골절", "절봄", "탈구", "염좌", "넘어져", "다리 아", "팔 아"],
    categoryId: "fracture",
    flags: ["deformity"],
    weight: 6,
  },
  {
    keywords: ["우하복", "복통", "배 아", "구토", "토했"],
    categoryId: "pain",
    flags: ["acute-abdomen"],
    weight: 6,
  },
  {
    keywords: ["흉통", "가슴 아", "가슴이"],
    categoryId: "pain",
    flags: ["chest-pain"],
    weight: 7,
  },
  {
    keywords: ["두통", "머리 아"],
    categoryId: "pain",
    flags: ["mild-pain"],
    weight: 4,
  },
  {
    keywords: ["약물", "중독", "마약", "술"],
    categoryId: "overdose",
    weight: 6,
  },
  {
    keywords: ["눈 맞", "타박", "안와", "복시"],
    categoryId: "facial",
    flags: ["eye-trauma"],
    weight: 6,
  },
]

const LOCATION_KEYWORDS: Record<string, string> = {
  운동장: "운동장",
  체육관: "체육관",
  체육: "운동장",
  교실: "교실",
  급식: "급식실",
  화장실: "화장실",
  복도: "복도",
  과학: "과학실",
  보건: "보건실",
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "")
}

function scoreRule(text: string, rule: Rule): number {
  const n = normalize(text)
  let score = 0
  for (const kw of rule.keywords) {
    if (n.includes(normalize(kw))) score += rule.weight ?? 3
  }
  return score
}

function mergeTriage(
  base: TriageAnswers,
  patch?: Partial<TriageAnswers>,
): TriageAnswers {
  if (!patch) return base
  const next = { ...base }
  for (const key of Object.keys(patch) as (keyof TriageAnswers)[]) {
    if (patch[key] === true) next[key] = true
    else if (patch[key] === false && next[key] === null) next[key] = false
  }
  return next
}

function inferTriageFromText(text: string, triage: TriageAnswers): TriageAnswers {
  const n = normalize(text)
  let t = { ...triage }

  if (
    /쓰러|실신|의식없|의식없|무반응|반응없|반응없/.test(n)
  ) {
    t.collapsed = true
    t.noResponse = true
  }
  if (/호흡없|호흡없|숨안|숨안|헐떡|가쁜호흡곤란/.test(n)) {
    t.abnormalBreathing = true
  }
  if (/맥박없|맥박없/.test(n)) t.noPulse = true
  if (/질식|목막|기침못|말못/.test(n)) t.chokingSign = true

  if (t.collapsed === null) t.collapsed = false
  if (t.noResponse === null) t.noResponse = false
  if (t.abnormalBreathing === null) t.abnormalBreathing = false
  if (t.noPulse === null) t.noPulse = false
  if (t.chokingSign === null) t.chokingSign = false

  return t
}

function inferLocation(text: string): string {
  for (const [kw, loc] of Object.entries(LOCATION_KEYWORDS)) {
    if (text.includes(kw)) return loc
  }
  return ""
}

export function parseQuickText(raw: string): {
  input: EmergencyInput
  meta: QuickParseMeta
} {
  const text = raw.trim()
  const base = EMPTY_INPUT()
  base.mode = "quick"
  base.notes = text

  if (!text) {
    return {
      input: base,
      meta: {
        categoryLabel: "미입력",
        hints: ["상황을 입력해 주세요"],
        confidence: "low",
      },
    }
  }

  let bestCategory = "consciousness"
  let bestScore = 0
  const matchedFlags = new Set<string>()
  let triagePatch: Partial<TriageAnswers> | undefined

  for (const rule of RULES) {
    const s = scoreRule(text, rule)
    if (s > bestScore) {
      bestScore = s
      bestCategory = rule.categoryId
      triagePatch = rule.triage
      matchedFlags.clear()
      rule.flags?.forEach((f) => matchedFlags.add(f))
    } else if (s > 0 && s === bestScore) {
      rule.flags?.forEach((f) => matchedFlags.add(f))
    }
  }

  const cat = getCategory(bestCategory)
  if (cat && matchedFlags.size === 0) {
    const n = normalize(text)
    for (const flag of cat.checkFlags) {
      const labelN = normalize(flag.label)
      if (labelN.length >= 4 && n.includes(labelN.slice(0, 4))) {
        matchedFlags.add(flag.id)
      }
      if (flag.tier === "emergency") {
        for (const kw of ["심함", "심한", "심하게", "못", "없", "안"]) {
          if (n.includes(kw)) matchedFlags.add(flag.id)
        }
      }
    }
    if (matchedFlags.size === 0 && cat.checkFlags[0]) {
      matchedFlags.add(
        cat.checkFlags.find((f) => f.tier === "quasi")?.id ??
          cat.checkFlags[0].id,
      )
    }
  }

  let triage = mergeTriage(base.triage, triagePatch)
  triage = inferTriageFromText(text, triage)

  const input: EmergencyInput = {
    ...base,
    categoryId: bestCategory,
    checkedFlags: [...matchedFlags],
    triage,
    location: inferLocation(text),
  }

  const confidence: QuickParseMeta["confidence"] =
    bestScore >= 8 ? "high" : bestScore >= 4 ? "medium" : "low"

  const hints: string[] = []
  if (cat) hints.push(`분류: ${cat.label}`)
  if (input.location) hints.push(`장소: ${input.location}`)
  if (
    triage.collapsed ||
    triage.noResponse ||
    triage.abnormalBreathing ||
    triage.noPulse ||
    triage.chokingSign
  ) {
    hints.push("생명 위험 신호 감지 → 119 검토")
  }

  return {
    input,
    meta: {
      categoryLabel: cat?.label ?? bestCategory,
      hints,
      confidence,
    },
  }
}

export const QUICK_EXAMPLES = [
  "체육 시간에 갑자기 쓰러졌고 깨워도 반응이 없어요",
  "사탕 먹다가 목 막혀서 말을 못 해요",
  "벌에 쏘여 얼굴이 부어오르고 숨쉬기 힘들어요",
  "운동장에서 넘어져 무릎에서 피가 많이 나요",
  "급식실에서 뜨거운 국에 손을 데였어요",
  "3학년인데 갑자기 경련을 해요",
]
