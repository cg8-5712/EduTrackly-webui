import { reactive, watch } from "vue"
import { defaultTheme, getAllThemes, getThemeById } from "@/config/themes"
import i18n from "@/i18n"

const t = (key) => i18n.global.t(key)

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function hexToRgb(hex) {
  const sanitized = hex.replace("#", "")
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => char + char)
          .join("")
      : sanitized

  const int = Number.parseInt(normalized, 16)

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

function rgbToString({ r, g, b }) {
  return `${r}, ${g}, ${b}`
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((channel) => clamp(channel, 0, 255).toString(16).padStart(2, "0"))
    .join("")}`
}

function mixColors(colorA, colorB, weight = 0.5) {
  const a = hexToRgb(colorA)
  const b = hexToRgb(colorB)
  const ratio = clamp(weight, 0, 1)

  return rgbToHex({
    r: Math.round(a.r * (1 - ratio) + b.r * ratio),
    g: Math.round(a.g * (1 - ratio) + b.g * ratio),
    b: Math.round(a.b * (1 - ratio) + b.b * ratio),
  })
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`
}

function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.65 ? "#09100c" : "#f7fbf4"
}

class ThemeStorage {
  constructor() {
    this.STORAGE_KEY = "edutrackly-cg8-5712-edu-trackly-theme"
    this.ADMIN_STORAGE_KEY = "edutrackly-cg8-5712-edu-trackly-theme-admin"
  }

  save(themeId, isAdmin = false) {
    try {
      localStorage.setItem(isAdmin ? this.ADMIN_STORAGE_KEY : this.STORAGE_KEY, themeId)
    } catch (error) {
      console.error(`${t("service.saveThemeFailed")}:`, error)
    }
  }

  load(isAdmin = false) {
    try {
      const storageKey = isAdmin ? this.ADMIN_STORAGE_KEY : this.STORAGE_KEY
      const savedTheme = localStorage.getItem(storageKey)
      if (savedTheme && getThemeById(savedTheme)) {
        return savedTheme
      }
    } catch (error) {
      console.error(`${t("service.loadThemeFailed")}:`, error)
    }

    return isAdmin ? defaultTheme.admin : defaultTheme.normal
  }

  clear(isAdmin = false) {
    try {
      localStorage.removeItem(isAdmin ? this.ADMIN_STORAGE_KEY : this.STORAGE_KEY)
    } catch (error) {
      console.error(`${t("service.clearThemeCacheFailed")}:`, error)
    }
  }

  clearAll() {
    this.clear(false)
    this.clear(true)
  }
}

class ThemeService {
  constructor() {
    this.storage = new ThemeStorage()
    this.state = reactive({
      currentThemeId: defaultTheme.normal,
      isAdmin: false,
    })

    this.init()
  }

  init() {
    this.loadThemeFromStorage()

    watch(
      () => this.state.currentThemeId,
      (newThemeId) => {
        this.applyTheme(newThemeId)
        this.storage.save(newThemeId, this.state.isAdmin)
      },
      { immediate: true }
    )
  }

  loadThemeFromStorage() {
    this.state.currentThemeId = this.storage.load(this.state.isAdmin)
  }

  applyTheme(themeId) {
    const themeConfig = getThemeById(themeId)
    if (!themeConfig) {
      console.warn(`${t("error.themeConfigNotFound")}: ${themeId}`)
      return
    }

    const root = document.documentElement
    const { colors, shadows } = themeConfig
    const primaryForeground = getContrastColor(colors.primary)
    const secondaryForeground = colors.text.primary
    const panelSoft = withAlpha(colors.surface, 0.74)
    const panelStrong = withAlpha(colors.headerFooter || colors.surface, 0.94)

    root.className = `theme-${themeId}`

    root.style.setProperty("--color-primary", colors.primary)
    root.style.setProperty("--color-primary-rgb", rgbToString(hexToRgb(colors.primary)))
    root.style.setProperty("--color-secondary", colors.secondary)
    root.style.setProperty("--color-secondary-rgb", rgbToString(hexToRgb(colors.secondary)))
    root.style.setProperty("--color-background", colors.background)
    root.style.setProperty("--color-surface", colors.surface)
    root.style.setProperty("--color-header-footer", colors.headerFooter || colors.surface)
    root.style.setProperty("--color-text-primary", colors.text.primary)
    root.style.setProperty("--color-text-secondary", colors.text.secondary)
    root.style.setProperty("--color-text-tertiary", colors.text.tertiary)
    root.style.setProperty("--color-border", colors.border)
    root.style.setProperty("--color-error", colors.error)
    root.style.setProperty("--color-success", colors.success)
    root.style.setProperty("--color-warning", colors.warning)
    root.style.setProperty("--color-info", colors.info)

    root.style.setProperty("--shadow-sm", shadows.sm)
    root.style.setProperty("--shadow-md", shadows.md)
    root.style.setProperty("--shadow-lg", shadows.lg)
    root.style.setProperty("--shadow-xl", shadows.xl)

    root.style.setProperty("--background", colors.background)
    root.style.setProperty("--foreground", colors.text.primary)
    root.style.setProperty("--card", colors.surface)
    root.style.setProperty("--card-foreground", colors.text.primary)
    root.style.setProperty("--popover", colors.surface)
    root.style.setProperty("--popover-foreground", colors.text.primary)
    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--primary-foreground", primaryForeground)
    root.style.setProperty("--secondary", withAlpha(colors.secondary, 0.14))
    root.style.setProperty("--secondary-foreground", secondaryForeground)
    root.style.setProperty("--muted", withAlpha(mixColors(colors.surface, colors.background, 0.22), 0.88))
    root.style.setProperty("--muted-foreground", colors.text.secondary)
    root.style.setProperty("--accent", withAlpha(colors.primary, 0.14))
    root.style.setProperty("--accent-foreground", colors.text.primary)
    root.style.setProperty("--destructive", colors.error)
    root.style.setProperty("--destructive-foreground", getContrastColor(colors.error))
    root.style.setProperty("--border", withAlpha(mixColors(colors.border, "#ffffff", 0.12), 0.9))
    root.style.setProperty("--input", withAlpha(mixColors(colors.surface, "#ffffff", 0.08), 0.88))
    root.style.setProperty("--ring", withAlpha(colors.primary, 0.42))
    root.style.setProperty("--panel-soft", panelSoft)
    root.style.setProperty("--panel-strong", panelStrong)
    root.style.setProperty("--shadow-panel", shadows.lg)
    root.style.setProperty(
      "--shadow-glow",
      `0 0 0 1px ${withAlpha(colors.primary, 0.12)}, 0 18px 42px rgba(0, 0, 0, 0.28)`
    )
  }

  setTheme(themeId) {
    if (!getThemeById(themeId)) {
      console.warn(`${t("error.invalidThemeId")}: ${themeId}`)
      return
    }

    this.state.currentThemeId = themeId
  }

  toggleTheme() {
    this.setTheme(this.state.currentThemeId === "light" ? "dark" : "light")
  }

  getThemeMode() {
    return this.state.currentThemeId === "light" ? "light" : "dark"
  }

  cycleTheme() {
    const themes = this.getAvailableThemes()
    const inCurrentMode =
      this.getThemeMode() === "light"
        ? themes.filter((theme) => theme.id === "light")
        : themes.filter((theme) => theme.id !== "light")

    if (inCurrentMode.length <= 1) {
      return
    }

    const currentIndex = inCurrentMode.findIndex((theme) => theme.id === this.state.currentThemeId)
    const nextTheme = inCurrentMode[(currentIndex + 1) % inCurrentMode.length]
    this.setTheme(nextTheme.id)
  }

  getDarkThemes() {
    return this.getAvailableThemes().filter((theme) => theme.id !== "light")
  }

  getLightThemes() {
    return this.getAvailableThemes().filter((theme) => theme.id === "light")
  }

  getCurrentThemeId() {
    return this.state.currentThemeId
  }

  getCurrentTheme() {
    return getThemeById(this.state.currentThemeId)
  }

  setIsAdmin(isAdmin) {
    const previousMode = this.state.isAdmin
    this.state.isAdmin = isAdmin

    if (previousMode !== isAdmin) {
      this.loadThemeFromStorage()
    }
  }

  isDark() {
    return this.state.currentThemeId !== "light"
  }

  isLight() {
    return this.state.currentThemeId === "light"
  }

  getAvailableThemes() {
    return getAllThemes()
  }

  resetTheme() {
    this.setTheme(this.state.isAdmin ? defaultTheme.admin : defaultTheme.normal)
  }

  clearCache() {
    this.storage.clearAll()
  }
}

export default new ThemeService()
export { defaultTheme, getAllThemes, getThemeById }
