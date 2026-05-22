import { getCategory } from "./emergency-data"
import type {
  AppSettings,
  EmergencyInput,
  EmergencyLevel,
  EmergencyResult,
  GuidelineClass,
  TriageAnswers,
} from "./types"
import { GUIDELINE_SOURCE } from "./types"

const LEVEL_META: Record<
  EmergencyLevel,
  { label: string; summary: string; color: string }
> = {
  1: {
    label: "1급 · 응급증상",
    summary:
      "「응급의료에 관한 법률」 응급증상에 해당할 수 있습니다. 즉시 119 신고 후 가이드라인 3C에 따라 처치하세요.",
    color: "bg-red-600 text-white",
  },
  2: {
    label: "2급 · 응급에 준하는 증상",
    summary:
      "응급에 준하는 증상입니다. 학부모 연락 후 응급실 이송을 검토하고, 악화 시 119를 호출하세요.",
    color: "bg-orange-500 text-white",
  },
  3: {
    label: "3급 · 관찰 후 판단",
    summary:
      "보건실에서 관찰·처치하며 담임교사·학부모와 상의해 이송 여부를 결정하세요.",
    color: "bg-amber-400 text-amber-950",
  },
  4: {
    label: "4급 · 보건실 처치",
    summary:
      "보건실에서 처치 가능한 상황입니다. 경과 관찰 후 필요 시 병원 진료를 안내하세요.",
    color: "bg-emerald-500 text-white",
  },
}

const CLASS_LABEL: Record<GuidelineClass, string> = {
  emergency: "응급증상 (표 1-2)",
  quasi: "응급에 준하는 증상",
  observation: "관찰 후 판단",
  "health-office": "보건실 처치",
}

const DISCLAIMER =
  "본 안내는 교육부 「학교 응급상황 대응 가이드라인」을 참고한 응급 대응 보조 도구이며, 의료 진단·처방을 대체하지 않습니다. 최종 판단은 보건교사·119·의료기관과 함께 하세요."

function isCardiacArrestTriage(t: TriageAnswers): boolean {
  return (
    t.collapsed === true ||
    t.noResponse === true ||
    t.abnormalBreathing === true ||
    t.noPulse === true
  )
}

function isChokingEmergency(t: TriageAnswers): boolean {
  return t.chokingSign === true
}

function tierFromFlags(
  input: EmergencyInput,
): "emergency" | "quasi" | "routine" {
  const cat = getCategory(input.categoryId)
  if (!cat) return "routine"

  let max: "emergency" | "quasi" | "routine" = "routine"
  for (const flag of cat.checkFlags) {
    if (!input.checkedFlags.includes(flag.id)) continue
    if (flag.tier === "emergency") return "emergency"
    if (flag.tier === "quasi") max = "quasi"
  }
  return max
}

function resolveLevelAndClass(input: EmergencyInput): {
  level: EmergencyLevel
  guidelineClass: GuidelineClass
} {
  if (isCardiacArrestTriage(input.triage) || input.categoryId === "cardiac-arrest") {
    return { level: 1, guidelineClass: "emergency" }
  }
  if (isChokingEmergency(input.triage) && input.categoryId === "choking") {
    return { level: 1, guidelineClass: "emergency" }
  }

  const tier = tierFromFlags(input)

  if (tier === "emergency") return { level: 1, guidelineClass: "emergency" }
  if (tier === "quasi") return { level: 2, guidelineClass: "quasi" }
  if (input.checkedFlags.length > 0)
    return { level: 3, guidelineClass: "observation" }
  return { level: 4, guidelineClass: "health-office" }
}

function buildThreeC(
  input: EmergencyInput,
  level: EmergencyLevel,
  settings: AppSettings,
): EmergencyResult["threeC"] {
  const cat = getCategory(input.categoryId)
  const cpr = isCardiacArrestTriage(input.triage)

  const check: string[] = [
    "현장 안전 및 주변 응급 자원(AED·구급함) 확인",
    cpr
      ? "보건교사 4 Check: 의식·반응·호흡·맥박 확인(표 1-1)"
      : "심장정지 여부 및 응급상황 여부 판단(표 1-2)",
    cat ? `${cat.label} 관련 증상 확인 (${cat.chapter})` : "상황별 증상 확인",
  ]

  const call: string[] = []
  if (level <= 2 || cpr) {
    call.push("119 신고 (위치·상황·환자 상태 전달)")
    if (cpr) call.push("119에 AED 요청")
  } else {
    call.push("필요 시 119 또는 담임교사 경유 학부모 연락 → 병원 진료 안내")
  }
  call.push("보건교사(또는 보건업무 담당교사) 연락")
  if (level <= 2) call.push("담임교사 → 교감 → 학교장 보고(표 1-5)")

  const care: string[] = cat ? [...cat.careSteps] : ["상황에 맞는 초기 응급처치"]
  if (settings.aedLocation && cpr) {
    care.push(`AED 위치: ${settings.aedLocation}`)
  }

  return { check, call, care }
}

function buildRoleChecklist(level: EmergencyLevel): EmergencyResult["roleChecklist"] {
  const discoverer = [
    "현장 안전 확인",
    level <= 2 ? "119 신고·보건교사 연락" : "보건교사 연락",
    "심장정지 시 CPR·AED, 보건교사 도착까지 현장 관리",
  ]
  const healthTeacher = [
    "활력징후 측정·상태 평가",
    "상황별 초기 응급처치(3C Care)",
    "119 구급대 인계·보건일지·응급환자 기록지 작성",
    "교감에게 결과 보고",
  ]
  const homeroom = [
    "학부모(보호자) 연락",
    "교감 보고",
    level <= 2 ? "의료기관 이송 동행·인계" : "경과 안내",
  ]
  return { discoverer, healthTeacher, homeroom }
}

function studentLabel(input: EmergencyInput): string {
  const { grade, classNum } = input.student
  if (grade && classNum) return `${grade}학년 ${classNum}반`
  if (grade) return `${grade}학년`
  return "해당 학생"
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function triageSummary(t: TriageAnswers): string {
  const parts: string[] = []
  if (t.collapsed === true) parts.push("쓰러짐·의식없음")
  if (t.noResponse === true) parts.push("무반응")
  if (t.abnormalBreathing === true) parts.push("이상호흡")
  if (t.noPulse === true) parts.push("맥박없음")
  if (t.chokingSign === true) parts.push("기도폐쇄의심")
  return parts.length ? parts.join(", ") : "특이 소견 없음"
}

export function evaluateEmergency(
  input: EmergencyInput,
  settings: AppSettings,
): EmergencyResult {
  const { level, guidelineClass } = resolveLevelAndClass(input)
  const meta = LEVEL_META[level]
  const category = getCategory(input.categoryId)
  const categoryLabel = category?.label ?? "미분류"
  const threeC = buildThreeC(input, level, settings)
  const firstAid = threeC.care
  const call119 = level === 1 || isCardiacArrestTriage(input.triage)
  const student = studentLabel(input)
  const flagsText =
    input.checkedFlags.length > 0
      ? input.checkedFlags
          .map((id) => category?.checkFlags.find((f) => f.id === id)?.label ?? id)
          .join(", ")
      : "선택 없음"
  const locationText = input.location || "미기입"
  const school = settings.schoolName || "학교"
  const nearest = settings.nearestHospital
    ? `인근 의료기관(설정): ${settings.nearestHospital}`
    : ""

  const parentMessage = [
    `안녕하세요, ${school} 보건실입니다.`,
    ``,
    `${student} 학생이 ${locationText}에서 ${categoryLabel} 관련 증상으로 응급 대응을 진행했습니다.`,
    ``,
    `▶ 가이드라인 분류: ${CLASS_LABEL[guidelineClass]}`,
    `▶ 조치 등급: ${meta.label}`,
    `▶ 확인 증상: ${flagsText}`,
    `▶ 즉시 확인(4 Check 등): ${triageSummary(input.triage)}`,
    `▶ 보건실 조치: ${input.actionsTaken.length > 0 ? input.actionsTaken.join(", ") : "가이드라인 3C에 따른 응급처치 진행"}`,
    ``,
    level <= 2
      ? `응급실 방문 또는 119 이송이 필요할 수 있어 연락드립니다. 가능하시면 빠르게 학교로 와 주시거나 보건교사 안내에 따라 병원으로 이동해 주세요.`
      : `현재 보건실에서 관찰 중이며, 경과에 따라 추가 연락드리겠습니다.`,
    ``,
    `문의: 보건실 ${settings.healthOfficePhone || "(설정에서 전화번호 입력)"}`,
    ``,
    DISCLAIMER,
  ].join("\n")

  const healthJournal = [
    `【기록일시】${formatNow()}`,
    `【장소】${locationText}`,
    `【대상】${student}`,
    `【상황】${categoryLabel} (${category?.chapter ?? "-"})`,
    `【가이드라인 분류】${CLASS_LABEL[guidelineClass]} / ${meta.label}`,
    `【즉시확인】${triageSummary(input.triage)}`,
    `【Check 항목】${flagsText}`,
    `【응급처치】${firstAid.slice(0, 5).join(" → ")}`,
    `【이송】${level <= 2 ? "응급실·119 검토" : "필요 시 병원"} (${category?.department ?? "-"})`,
    `【119】${call119 ? "신고·권장" : "필요 시"}`,
    `【학부모】연락 예정/완료`,
    `【담임·교감】보고 예정/완료`,
    `【비고】${input.notes || "-"}`,
    `【출처】${GUIDELINE_SOURCE}`,
  ].join("\n")

  const roleChecklist = buildRoleChecklist(level)
  const checklist = [
    ...(call119 ? ["119 신고 완료"] : ["119 필요 여부 재확인"]),
    "보건교사·담임 연락",
    "3C: Check-Call-Care 기록",
    level <= 2 ? "응급 이송·동행·학부모 인계" : "보건실 관찰·재평가",
    "응급환자 기록지/보건일지 저장",
    "사후 경과 확인",
  ]

  return {
    level,
    levelLabel: meta.label,
    levelSummary: meta.summary,
    guidelineClass,
    guidelineClassLabel: CLASS_LABEL[guidelineClass],
    call119,
    threeC,
    firstAid,
    hospital: level <= 2 ? "가장 가까운 응급실" : "증상 지속 시 병원",
    department: category?.department ?? "소아과·응급실",
    parentMessage,
    healthJournal,
    roleChecklist,
    checklist,
    disclaimer: DISCLAIMER,
  }
}

export function getLevelColor(level: EmergencyLevel): string {
  return LEVEL_META[level].color
}

export const EMPTY_INPUT = (): EmergencyInput => ({
  mode: "quick",
  triage: {
    collapsed: null,
    noResponse: null,
    abnormalBreathing: null,
    noPulse: null,
    chokingSign: null,
  },
  student: { grade: "", classNum: "" },
  categoryId: "",
  checkedFlags: [],
  location: "",
  notes: "",
  actionsTaken: [],
})
