"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ScreenShellProps = {
  title: string
  subtitle?: string
  onBack?: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function ScreenShell({
  title,
  subtitle,
  onBack,
  children,
  footer,
  className,
}: ScreenShellProps) {
  return (
    <div
      className={cn(
        "min-h-dvh bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.55),transparent_28rem),radial-gradient(circle_at_top_right,rgba(196,181,253,0.38),transparent_26rem),linear-gradient(180deg,#fff7fb_0%,#f8fbff_46%,#ffffff_100%)]",
        className,
      )}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                aria-label="뒤로가기"
                className="rounded-full"
              >
                <ArrowLeft className="size-5" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-black tracking-tight text-slate-950">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-sm font-medium text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
        </header>
        <main
          className={cn(
            "flex-1 px-4 py-5 sm:px-6 sm:py-6",
            footer && "pb-36 sm:pb-6",
          )}
        >
          {children}
        </main>
        {footer && (
          <footer className="sticky bottom-0 border-t border-white/80 bg-white/90 p-4 backdrop-blur-xl sm:static sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
