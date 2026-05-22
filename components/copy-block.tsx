"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type CopyBlockProps = {
  label: string
  text: string
}

export function CopyBlock({ label, text }: CopyBlockProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} 복사됨`)
    } catch {
      toast.error("복사에 실패했습니다")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="size-4" />
          복사
        </Button>
      </div>
      <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-md border bg-slate-50 p-3 text-sm leading-relaxed">
        {text}
      </pre>
    </div>
  )
}
