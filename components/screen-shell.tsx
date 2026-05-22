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
    <div className={cn("mx-auto flex min-h-dvh max-w-lg flex-col bg-background", className)}>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-2 px-4 py-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로">
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{title}</h1>
            {subtitle && (
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
      {footer && (
        <footer className="sticky bottom-0 border-t bg-background p-4">{footer}</footer>
      )}
    </div>
  )
}
