"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type ThemeName = "relaxing" | "hardcore" | "psycho" | "sinner" | "unbeatable"

export interface ThemeInfo {
  name: ThemeName
  label: string
  description: string
  mood: string
}

export const themes: ThemeInfo[] = [
  {
    name: "relaxing",
    label: "Relaxing",
    description: "Calm, professional, motivating",
    mood: "Professional, clean, welcoming",
  },
  {
    name: "hardcore",
    label: "Hardcore",
    description: "Intense, powerful, aggressive",
    mood: "Dark, powerful, edgy with red accents",
  },
  {
    name: "psycho",
    label: "Psycho",
    description: "Wild, chaotic, extreme",
    mood: "Neon, cyberpunk, high-contrast, pulsing effects",
  },
  {
    name: "sinner",
    label: "Sinner",
    description: "Dark, mysterious, gothic",
    mood: "Gothic, dark purple and crimson, mysterious atmosphere",
  },
  {
    name: "unbeatable",
    label: "Unbeatable",
    description: "Champion, victorious, elite",
    mood: "Gold, champion vibes, premium feel, winner energy",
  },
]

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  themeInfo: ThemeInfo
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("relaxing")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("gym-remo-theme") as ThemeName | null
    if (savedTheme && themes.some((t) => t.name === savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme)
      localStorage.setItem("gym-remo-theme", theme)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
  }

  const themeInfo = themes.find((t) => t.name === theme) || themes[0]

  if (!mounted) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, setTheme, themeInfo }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
