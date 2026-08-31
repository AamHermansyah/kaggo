"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  forcedTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
  [key: string]: unknown
}

interface ThemeContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  forcedTheme?: string
  resolvedTheme?: string
  themes: string[]
  systemTheme?: "light" | "dark"
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  forcedTheme: "light",
  resolvedTheme: "light",
  themes: ["light", "dark", "system"],
  systemTheme: "light",
})

export function ThemeProvider({
  children,
  defaultTheme = "light",
  forcedTheme = "light",
  storageKey = "theme",
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(
    forcedTheme || defaultTheme
  )

  const setTheme = React.useCallback(
    (newTheme: string) => {
      setThemeState(newTheme)
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch {}
    },
    [storageKey]
  )

  // The app is deliberately light-only (`forcedTheme` defaults to "light"), so
  // there is no stored preference to restore — `setTheme` still writes to
  // localStorage for whenever a theme switcher comes back.

  React.useEffect(() => {
    const root = document.documentElement
    const currentTheme = forcedTheme || theme

    if (attribute === "class") {
      root.classList.remove("light", "dark")
      if (currentTheme !== "system") {
        root.classList.add(currentTheme)
      }
    } else {
      if (currentTheme) {
        root.setAttribute(attribute, currentTheme)
      }
    }
  }, [theme, forcedTheme, attribute])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: forcedTheme || theme,
      themes: ["light", "dark", "system"],
      systemTheme: "light" as const,
    }),
    [theme, setTheme, forcedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
