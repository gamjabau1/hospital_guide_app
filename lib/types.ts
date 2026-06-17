export type Screen = "home" | "result"

export type EmergencyLevel = "urgent" | "soon" | "routine"

export type SourceRef = {
  id: string
  institution: string
  title: string
  url: string
  note: string
}

export type SymptomGuide = {
  id: string
  name: string
  shortLabel: string
  keywords: string[]
  emergencyLevel: EmergencyLevel
  recommendedDepartments: string[]
  firstAidSteps: string[]
  warningSigns: string[]
  avoidActions: string[]
  sourceIds: string[]
}

export type SymptomResult = {
  guide: SymptomGuide
  matchedKeyword?: string
}

export const GUIDELINE_SOURCE =
  "소방청 응급처치 안전교육, 질병관리청 국가건강정보포털"
