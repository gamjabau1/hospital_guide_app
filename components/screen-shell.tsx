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
        "min-h-dvh bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_42%,#f8f9fc_100%)]",
        className,
      )}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
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
              <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950">
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
          <footer className="sticky bottom-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur-xl sm:static sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
