"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ScreenShell } from "@/components/screen-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveSettings } from "@/lib/settings"
import type { AppSettings } from "@/lib/types"

type SettingsScreenProps = {
  settings: AppSettings
  onSave: (settings: AppSettings) => void
  onBack: () => void
}

export function SettingsScreen({ settings, onSave, onBack }: SettingsScreenProps) {
  const [draft, setDraft] = useState(settings)

  return (
    <ScreenShell
      title="학교 설정"
      onBack={onBack}
      footer={
        <Button
          className="w-full"
          onClick={() => {
            saveSettings(draft)
            onSave(draft)
            toast.success("설정을 저장했습니다")
            onBack()
          }}
        >
          저장
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schoolName">학교 이름</Label>
          <Input
            id="schoolName"
            value={draft.schoolName}
            onChange={(e) => setDraft({ ...draft, schoolName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">보건실 전화</Label>
          <Input
            id="phone"
            placeholder="02-000-0000"
            value={draft.healthOfficePhone}
            onChange={(e) =>
              setDraft({ ...draft, healthOfficePhone: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hospital">인근 응급실</Label>
          <Input
            id="hospital"
            placeholder="○○대병원 응급실"
            value={draft.nearestHospital}
            onChange={(e) =>
              setDraft({ ...draft, nearestHospital: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aed">AED 설치 위치</Label>
          <Input
            id="aed"
            placeholder="예: 보건실 앞 복도"
            value={draft.aedLocation}
            onChange={(e) =>
              setDraft({ ...draft, aedLocation: e.target.value })
            }
          />
        </div>
        <p className="text-xs text-muted-foreground">
          교육부 가이드라인: AED 위치·관리자·매월 점검을 학교 응급대응계획에
          반영하세요.
        </p>
      </div>
    </ScreenShell>
  )
}
