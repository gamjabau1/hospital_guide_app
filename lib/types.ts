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

export type GuidelineClass =
  | "emergency"
  | "quasi"
  | "observation"
  | "health-office"

export type EmergencyLevel = 1 | 2 | 3 | 4

export type SourceRef = {
  id: string
  institution: string
  title: string
  url: string
  note: string
}

export type TriageAnswers = {
  collapsed: boolean | null
  noResponse: boolean | null
  abnormalBreathing: boolean | null
  noPulse: boolean | null
  chokingSign: boolean | null
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
  roleChecklist: {
    discoverer: string[]
    healthTeacher: string[]
    homeroom: string[]
  }
  checklist: string[]
  disclaimer: string
  sources: SourceRef[]
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
  schoolName: "우리 학교",
  healthOfficePhone: "",
  nearestHospital: "",
  aedLocation: "",
}

export const GUIDELINE_SOURCE =
  "교육부 「학교 응급상황 대응 가이드라인」(2025), 서울특별시교육청 「학생안전매뉴얼」(2024.12 개정), 소방청 응급처치 안전교육"
