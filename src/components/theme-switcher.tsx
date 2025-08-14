"use client"

import * as React from "react"
import { Moon, Sun, Palette, Waves, Crown } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [colorTheme, setColorTheme] = React.useState<"ocean" | "royal" | "default">("default")

  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("color-theme") as "ocean" | "royal" | "default"
    if (savedTheme) {
      setColorTheme(savedTheme)
      updateColorTheme(savedTheme)
    }
  }, [])

  const updateColorTheme = (newTheme: "ocean" | "royal" | "default") => {
    document.documentElement.classList.remove("theme-ocean", "theme-royal")
    if (newTheme !== "default") {
      document.documentElement.classList.add(`theme-${newTheme}`)
    }
    localStorage.setItem("color-theme", newTheme)
    setColorTheme(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {/* Color Theme Selector */}
      <div className="flex items-center rounded-lg border p-1">
        <button
          onClick={() => updateColorTheme("default")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            colorTheme === "default"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Default Theme"
        >
          <Palette className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateColorTheme("ocean")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            colorTheme === "ocean"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Ocean Theme"
        >
          <Waves className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateColorTheme("royal")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            colorTheme === "royal"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Royal Theme"
        >
          <Crown className="h-4 w-4" />
        </button>
      </div>

      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-lg border p-2 hover:bg-accent"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}