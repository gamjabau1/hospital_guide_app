import { getCategory, getSources } from "./emergency-data"
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
    label: "1단계 · 생명위험 응급",
    summary:
      "의식·호흡·순환 이상, 다량출혈, 중증 알레르기 등 즉시 119와 3C 대응이 필요한 상황입니다.",
    color: "bg-red-600 text-white",
  },
  2: {
    label: "2단계 · 응급실 검토",
    summary:
      "급격히 악화될 수 있어 보건교사 판단, 보호자 연락, 응급실 또는 119 이송 검토가 필요합니다.",
    color: "bg-orange-500 text-white",
  },
  3: {
    label: "3단계 · 관찰 및 재평가",
    summary:
      "보건실에서 처치하며 증상 변화, 활력징후, 보호자 연락 필요성을 반복 확인하세요.",
    color: "bg-amber-400 text-amber-950",
  },
  4: {
    label: "4단계 · 보건실 처치",
    summary:
      "간단한 보건실 처치와 경과 관찰이 가능한 상황입니다. 악화되면 즉시 재분류하세요.",
    color: "bg-emerald-600 text-white",
  },
}

const CLASS_LABEL: Record<GuidelineClass, string> = {
  emergency: "응급상황",
  quasi: "준응급상황",
  observation: "관찰·재평가",
  "health-office": "보건실 처치",
}

const DISCLAIMER =
  "이 앱은 공식 매뉴얼을 바탕으로 한 학교 현장 대응 보조도구입니다. 의료 진단·처방을 대신하지 않으며, 의식·호흡·순환 이상이나 판단이 어려운 경우 119와 의료기관 지시를 우선하세요."

function isCardiacArrestTriage(t: TriageAnswers): boolean {
  return (
    t.noPulse === true ||
    ((t.collapsed === true || t.noResponse === true) &&
      t.abnormalBreathing === true)
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
  if (input.checkedFlags.length > 0) {
    return { level: 3, guidelineClass: "observation" }
  }
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
    "현장 안전, 추가 위험, 주변 도움 가능 인원 확인",
    cpr
      ? "4 Check: 의식·반응·호흡·맥박을 확인하고 심장정지로 판단"
      : "의식·호흡·순환 이상, 다량출혈, 중증 알레르기 등 응급 신호 확인",
    cat ? `${cat.label} 관련 증상과 선택한 Check 항목 확인` : "상황별 증상 확인",
  ]

  const call: string[] = []
  if (level === 1 || cpr) {
    call.push("즉시 119 신고: 위치, 학생 상태, 의식·호흡 여부, 시행한 처치를 전달")
    if (cpr) call.push("주변 교직원에게 AED 요청과 학생 동선 확보를 지시")
  } else if (level === 2) {
    call.push("보건교사 판단으로 보호자 연락, 응급실 방문 또는 119 이송을 검토")
  } else {
    call.push("보건실 경과 관찰 중 악화되면 보호자·119 연락으로 전환")
  }
  call.push("보건교사, 담임교사, 관리자 역할을 분담하고 기록 담당을 지정")
  if (settings.nearestHospital && level <= 2) {
    call.push(`인근 응급실 후보: ${settings.nearestHospital}`)
  }

  const care: string[] = cat ? [...cat.careSteps] : ["상황에 맞는 초기 응급처치를 시행"]
  if (settings.aedLocation && cpr) {
    care.push(`학교 AED 위치: ${settings.aedLocation}`)
  }

  return { check, call, care }
}

function buildRoleChecklist(level: EmergencyLevel): EmergencyResult["roleChecklist"] {
  const discoverer = [
    "현장 안전 확인 후 학생 곁에서 도움 요청",
    level <= 2 ? "119 또는 보건교사에게 즉시 연락" : "보건교사에게 상황 전달",
    "학생을 혼자 두지 않고 추가 손상 방지",
  ]
  const healthTeacher = [
    "4 Check와 활력징후를 확인하고 응급/준응급/관찰로 분류",
    "3C에 따라 응급처치 시행 및 처치 시간 기록",
    "119 구급대 또는 보호자에게 객관적 정보를 인계",
    "보건일지와 응급환자 기록, 추후 경과 확인",
  ]
  const homeroom = [
    "보호자에게 현재 상태, 조치, 이송 여부를 간결히 안내",
    "관리자 보고와 학생 이동·학급 관리 지원",
    level <= 2 ? "이송 동행 또는 인계 준비" : "보건실 관찰 결과 확인",
  ]
  return { discoverer, healthTeacher, homeroom }
}

function studentLabel(input: EmergencyInput): string {
  const { grade, classNum } = input.student
  if (grade && classNum) return `${grade}학년 ${classNum}반 학생`
  if (grade) return `${grade}학년 학생`
  return "해당 학생"
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function triageSummary(t: TriageAnswers): string {
  const parts: string[] = []
  if (t.collapsed === true) parts.push("쓰러짐")
  if (t.noResponse === true) parts.push("무반응")
  if (t.abnormalBreathing === true) parts.push("비정상 호흡")
  if (t.noPulse === true) parts.push("맥박 없음")
  if (t.chokingSign === true) parts.push("기도폐쇄 의심")
  return parts.length ? parts.join(", ") : "생명 위험 신호 없음"
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
  const call119 = level <= 2 || isCardiacArrestTriage(input.triage)
  const student = studentLabel(input)
  const flagsText =
    input.checkedFlags.length > 0
      ? input.checkedFlags
          .map((id) => category?.checkFlags.find((f) => f.id === id)?.label ?? id)
          .join(", ")
      : "선택 없음"
  const locationText = input.location || "미기재 장소"
  const school = settings.schoolName || "학교"
  const sources = getSources(category?.sourceIds ?? [])

  const parentMessage = [
    `안녕하세요. ${school} 보건실입니다.`,
    "",
    `${student}이(가) ${locationText}에서 ${categoryLabel} 관련 증상으로 보건실 응급 대응을 받았습니다.`,
    "",
    `분류: ${CLASS_LABEL[guidelineClass]} / ${meta.label}`,
    `확인 증상: ${flagsText}`,
    `즉시 확인 신호: ${triageSummary(input.triage)}`,
    `이미 한 조치: ${input.actionsTaken.length > 0 ? input.actionsTaken.join(", ") : "3C에 따른 초기 처치"}`,
    "",
    level <= 2
      ? "현재는 응급실 진료 또는 119 이송 검토가 필요한 상황으로 판단되어 연락드립니다. 가능하면 빠르게 학교 또는 안내받은 의료기관으로 와 주세요."
      : "현재 보건실에서 관찰 중입니다. 증상 변화가 있으면 즉시 추가로 연락드리겠습니다.",
    "",
    `문의: 보건실 ${settings.healthOfficePhone || "(설정에서 보건실 전화번호 입력)"}`,
    "",
    DISCLAIMER,
  ].join("\n")

  const healthJournal = [
    `기록일시: ${formatNow()}`,
    `발생장소: ${locationText}`,
    `대상: ${student}`,
    `상황분류: ${categoryLabel} (${category?.chapter ?? "-"})`,
    `가이드라인 분류: ${CLASS_LABEL[guidelineClass]} / ${meta.label}`,
    `즉시 확인: ${triageSummary(input.triage)}`,
    `Check 항목: ${flagsText}`,
    `응급처치: ${firstAid.slice(0, 5).join(" / ")}`,
    `이송 판단: ${level <= 2 ? "응급실 또는 119 검토" : "보건실 관찰 및 필요 시 진료 안내"}`,
    `진료과 참고: ${category?.department ?? "-"}`,
    `보호자 연락: 예정/완료`,
    `관리자 보고: 예정/완료`,
    `추가 메모: ${input.notes || "-"}`,
    `출처: ${GUIDELINE_SOURCE}`,
  ].join("\n")

  const roleChecklist = buildRoleChecklist(level)
  const checklist = [
    call119 ? "119 신고 또는 응급실 이송 필요성 확인" : "증상 악화 시 재분류",
    "보건교사·담임·관리자 역할 분담",
    "3C(Check-Call-Care) 조치와 시간 기록",
    level <= 2 ? "보호자 연락 및 이송 인계 준비" : "보건실 경과 관찰",
    "응급환자 기록지/보건일지 작성",
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
    hospital: level <= 2 ? "가까운 응급실 또는 119 이송" : "증상 지속 시 의료기관 진료",
    department: category?.department ?? "응급의학과",
    parentMessage,
    healthJournal,
    roleChecklist,
    checklist,
    disclaimer: DISCLAIMER,
    sources,
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
