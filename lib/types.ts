export type Screen = "home" | "result"

export type EmergencyLevel = "urgent" | "soon" | "routine"

export type SourceRef = {
  id: string
  institution: string
  title: string
  url: string
  note: string
}

export type TriageQuestion = {
  id: string
  question: string
  ifYes: string
  urgent?: boolean
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
  triageQuestions: TriageQuestion[]
  pharmacyItems: string[]
  hospitalPrepItems: string[]
  sourceIds: string[]
}

export type SymptomResult = {
  guide: SymptomGuide
  matchedKeyword?: string
}

export const GUIDELINE_SOURCE =
  "NHS, CDC, NINDS 등 공개 기관 자료를 바탕으로 앱용으로 재구성한 진료과 안내"
