import light from "./light"
import dark from "./dark"
import blue from "./blue"
import green from "./green"
import purple from "./purple"

export const themes = {
  light,
  dark,
  blue,
  green,
  purple,
}

export const themeIds = Object.keys(themes)

export const defaultTheme = {
  admin: "dark",
  normal: "dark",
}

export function getThemeById(themeId) {
  return themes[themeId] || null
}

export function getAllThemes() {
  return Object.values(themes)
}

export default themes
