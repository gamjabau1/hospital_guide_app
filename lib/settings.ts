import type { AppSettings, SavedCase } from "./types"
import { DEFAULT_SETTINGS } from "./types"

const SETTINGS_KEY = "school-care-sos-settings"
const HISTORY_KEY = "school-care-sos-history"

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadHistory(): SavedCase[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedCase[]
  } catch {
    return []
  }
}

export function saveCase(caseItem: SavedCase) {
  const history = loadHistory()
  const next = [caseItem, ...history].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}
