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
      toast.message("분류가 불확실합니다. 결과 확인 후 필요하면 단계별 입력을 이용하세요.")
    } else {
      toast.success(`${meta.categoryLabel}으로 분석했습니다`, {
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
    toast.message("말씀해 주세요…")
  }

  return (
    <Card className="border-primary/40 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-primary" />
          바로 말하기 · 입력
        </CardTitle>
        <CardDescription>
          상황을 글 또는 음성으로 적으면 바로 3C 결과를 보여 줍니다. (클릭 단계 생략)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="예: 체육 시간에 3학년 학생이 쓰러졌고 반응이 없어요. 호흡이 이상해요."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="min-h-[100px] resize-none text-base"
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
            className="min-h-11 flex-1"
            onClick={() => runAnalyze()}
          >
            바로 결과 보기
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
          Ctrl+Enter로도 바로 분석 · 음성은 크롬·엣지에서 잘 됩니다
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
              className="rounded-full border bg-muted/50 px-2.5 py-1 text-left text-xs hover:bg-muted"
            >
              {example.length > 28 ? `${example.slice(0, 28)}…` : example}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
