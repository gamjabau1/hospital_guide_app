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
  "NHS, MedlinePlus, CDC 공개 자료를 바탕으로 앱용으로 재구성한 생활 응급처치 안내"
