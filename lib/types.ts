export type Screen =
  | "home"
  | "start"
  | "triage"
  | "category"
  | "symptoms"
  | "details"
  | "result"
  | "history"
  | "settings"

export type InputMode = "quick" | "detailed"

/** 가이드라인 표 1-2 기준 분류 */
export type GuidelineClass =
  | "emergency" // 응급증상 → 119
  | "quasi" // 응급에 준하는 증상 → 응급실·신속 이송
  | "observation" // 관찰 후 판단
  | "health-office" // 보건실 처치

export type EmergencyLevel = 1 | 2 | 3 | 4

/** 보건교사 4 Check + 핵심 위험 신호 (표 1-1, 1-2) */
export type TriageAnswers = {
  collapsed: boolean | null // 의식 잃고 쓰러짐
  noResponse: boolean | null // 깨워도 반응 없음
  abnormalBreathing: boolean | null // 무호흡·심장정지 호흡
  noPulse: boolean | null // 맥박 없음 (보건교사 확인)
  chokingSign: boolean | null // 기도폐쇄 의심(말·기침 불가)
}

export type StudentInfo = {
  grade: string
  classNum: string
}

export type EmergencyInput = {
  mode: InputMode
  triage: TriageAnswers
  student: StudentInfo
  categoryId: string
  /** 가이드라인 Check 항목 중 해당(V) 선택 */
  checkedFlags: string[]
  location: string
  notes: string
  actionsTaken: string[]
}

export type ThreeCPlan = {
  check: string[]
  call: string[]
  care: string[]
}

export type EmergencyResult = {
  level: EmergencyLevel
  levelLabel: string
  levelSummary: string
  guidelineClass: GuidelineClass
  guidelineClassLabel: string
  call119: boolean
  threeC: ThreeCPlan
  firstAid: string[]
  hospital: string
  department: string
  parentMessage: string
  healthJournal: string
  /** 표 1-5 역할별 체크리스트 */
  roleChecklist: {
    discoverer: string[]
    healthTeacher: string[]
    homeroom: string[]
  }
  checklist: string[]
  disclaimer: string
}

export type SavedCase = {
  id: string
  createdAt: string
  categoryLabel: string
  level: EmergencyLevel
  summary: string
  input: EmergencyInput
  result: EmergencyResult
}

export type AppSettings = {
  schoolName: string
  healthOfficePhone: string
  nearestHospital: string
  aedLocation: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  schoolName: "○○초등학교",
  healthOfficePhone: "",
  nearestHospital: "",
  aedLocation: "",
}

export const GUIDELINE_SOURCE =
  "교육부 「학교 응급상황 대응 가이드라인」(2025) · 3C(Check-Call-Care)"
