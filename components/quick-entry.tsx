"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Mic, MicOff, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { parseQuickText, QUICK_EXAMPLES } from "@/lib/quick-parse"
import type { EmergencyInput } from "@/lib/types"

type QuickEntryProps = {
  onResult: (input: EmergencyInput) => void
}

type SpeechRecognitionCtor = new () => SpeechRecognition

export function QuickEntry({ onResult }: QuickEntryProps) {
  const [text, setText] = useState("")
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const speechSupported = useCallback(() => {
    if (typeof window === "undefined") return false
    return Boolean(
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor })
        .SpeechRecognition ||
        (window as Window & { webkitSpeechRecognition?: SpeechRecognitionCtor })
          .webkitSpeechRecognition,
    )
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  function runAnalyze(sourceText?: string) {
    const value = (sourceText ?? text).trim()
    if (!value) {
      toast.error("상황을 한 줄이라도 입력해 주세요")
      return
    }
    const { input, meta } = parseQuickText(value)
    if (meta.confidence === "low") {
      toast.message("분류가 불확실합니다. 결과에서 확인한 뒤 필요하면 단계별 입력을 사용하세요.")
    } else {
      toast.success(`${meta.categoryLabel} 상황으로 분석했습니다`, {
        description: meta.hints.join(" · "),
      })
    }
    onResult(input)
  }

  function toggleVoice() {
    if (!speechSupported()) {
      toast.error("이 브라우저에서는 음성 입력을 지원하지 않습니다. 글자로 입력해 주세요.")
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const Win = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor
      webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    const Ctor = Win.SpeechRecognition ?? Win.webkitSpeechRecognition
    if (!Ctor) return

    const recognition = new Ctor()
    recognition.lang = "ko-KR"
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript).trim())
    }

    recognition.onerror = () => {
      setListening(false)
      toast.error("음성 인식에 실패했습니다. 다시 시도하거나 직접 입력해 주세요.")
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
    toast.message("말씀해 주세요")
  }

  return (
    <Card className="border-red-200 bg-white/95 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-primary" />
          빠른 상황 입력
        </CardTitle>
        <CardDescription>
          한 문장으로 적으면 3C 결과와 응급 등급을 바로 정리합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="예: 체육 시간에 3학년 학생이 쓰러졌고 깨워도 반응이 없어요."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="min-h-[112px] resize-none border-slate-200 bg-slate-50/70 text-base leading-relaxed focus-visible:bg-white"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              runAnalyze()
            }
          }}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            size="lg"
            className="min-h-11 flex-1 bg-red-600 hover:bg-red-700"
            onClick={() => runAnalyze()}
          >
            3C 결과 보기
          </Button>
          <Button
            type="button"
            size="lg"
            variant={listening ? "destructive" : "outline"}
            className="min-h-11 shrink-0"
            onClick={toggleVoice}
            aria-label={listening ? "음성 입력 중지" : "음성 입력"}
          >
            {listening ? (
              <MicOff className="size-5" />
            ) : (
              <Mic className="size-5" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Ctrl+Enter로 분석할 수 있습니다. 음성 입력은 지원 브라우저에서만 작동합니다.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setText(example)
                runAnalyze(example)
              }}
              className="rounded-md border bg-white px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              {example.length > 28 ? `${example.slice(0, 28)}...` : example}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
