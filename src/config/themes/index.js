/**
 * 主题配置索引
 * 统一导出所有主题配置
 */
import light from './light'
import dark from './dark'
import blue from './blue'
import green from './green'
import purple from './purple'

// 主题配置映射
export const themes = {
  light,
  dark,
  blue,
  green,
  purple,
}

// 主题 ID 列表
export const themeIds = Object.keys(themes)

// 默认主题配置
export const defaultTheme = {
  admin: 'light',      // admin 页面默认主题
  normal: 'dark',      // 非 admin 页面默认主题
}

/**
 * 根据 ID 获取主题配置
 * @param {string} themeId - 主题 ID
 * @returns {object|null} 主题配置对象
 */
export function getThemeById(themeId) {
  return themes[themeId] || null
}

/**
 * 获取所有可用主题列表
 * @returns {Array} 主题配置数组
 */
export function getAllThemes() {
  return Object.values(themes)
}

export default themes
