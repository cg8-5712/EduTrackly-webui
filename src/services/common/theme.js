import { reactive, watch } from 'vue'
import { themes, defaultTheme, getThemeById, getAllThemes } from '@/config/themes'

/**
 * 本地存储管理类
 * 负责主题偏好的持久化存储
 */
class ThemeStorage {
  constructor() {
    this.STORAGE_KEY = 'edu-trackly-theme'
    this.ADMIN_STORAGE_KEY = 'edu-trackly-theme-admin'
  }

  /**
   * 保存主题到本地存储
   * @param {string} themeId - 主题 ID
   * @param {boolean} isAdmin - 是否为 admin 页面
   */
  save(themeId, isAdmin = false) {
    try {
      const key = isAdmin ? this.ADMIN_STORAGE_KEY : this.STORAGE_KEY
      localStorage.setItem(key, themeId)
      console.log(`主题已保存: ${themeId} (${isAdmin ? 'admin' : 'normal'})`)
    } catch (error) {
      console.error('保存主题失败:', error)
    }
  }

  /**
   * 从本地存储加载主题
   * @param {boolean} isAdmin - 是否为 admin 页面
   * @returns {string|null} 主题 ID
   */
  load(isAdmin = false) {
    try {
      const key = isAdmin ? this.ADMIN_STORAGE_KEY : this.STORAGE_KEY
      const savedTheme = localStorage.getItem(key)

      if (savedTheme && getThemeById(savedTheme)) {
        console.log(`加载缓存主题: ${savedTheme} (${isAdmin ? 'admin' : 'normal'})`)
        return savedTheme
      }

      // 没有缓存，返回默认主题
      const defaultThemeId = isAdmin ? defaultTheme.admin : defaultTheme.normal
      console.log(`使用默认主题: ${defaultThemeId} (${isAdmin ? 'admin' : 'normal'})`)
      return defaultThemeId
    } catch (error) {
      console.error('加载主题失败:', error)
      return isAdmin ? defaultTheme.admin : defaultTheme.normal
    }
  }

  /**
   * 清除本地存储的主题
   * @param {boolean} isAdmin - 是否为 admin 页面
   */
  clear(isAdmin = false) {
    try {
      const key = isAdmin ? this.ADMIN_STORAGE_KEY : this.STORAGE_KEY
      localStorage.removeItem(key)
      console.log(`主题缓存已清除 (${isAdmin ? 'admin' : 'normal'})`)
    } catch (error) {
      console.error('清除主题缓存失败:', error)
    }
  }

  /**
   * 清除所有主题缓存
   */
  clearAll() {
    this.clear(false)
    this.clear(true)
  }
}

/**
 * 主题服务类
 * 管理全局主题状态，支持主题切换和持久化
 */
class ThemeService {
  constructor() {
    // 存储管理器
    this.storage = new ThemeStorage()

    // 响应式主题状态
    this.state = reactive({
      currentThemeId: defaultTheme.normal, // 当前主题 ID
      isAdmin: false, // 是否在 admin 页面
    })

    // 初始化主题
    this.init()
  }

  /**
   * 初始化主题服务
   */
  init() {
    // 从本地存储恢复主题设置
    this.loadThemeFromStorage()

    // 监听主题变化，自动应用到 DOM
    watch(
      () => this.state.currentThemeId,
      (newThemeId) => {
        this.applyTheme(newThemeId)
        this.storage.save(newThemeId, this.state.isAdmin)
      },
      { immediate: true }
    )
  }

  /**
   * 从本地存储加载主题设置
   */
  loadThemeFromStorage() {
    const savedTheme = this.storage.load(this.state.isAdmin)
    this.state.currentThemeId = savedTheme
  }

  /**
   * 应用主题到 DOM
   * @param {string} themeId - 主题 ID
   */
  applyTheme(themeId) {
    const themeConfig = getThemeById(themeId)

    if (!themeConfig) {
      console.warn(`未找到主题配置: ${themeId}`)
      return
    }

    const root = document.documentElement
    const colors = themeConfig.colors
    const shadows = themeConfig.shadows

    // 设置主题 class
    root.className = `theme-${themeId}`

    // 设置 CSS 变量 - 颜色
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text-primary', colors.text.primary)
    root.style.setProperty('--color-text-secondary', colors.text.secondary)
    root.style.setProperty('--color-text-tertiary', colors.text.tertiary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--color-error', colors.error)
    root.style.setProperty('--color-success', colors.success)
    root.style.setProperty('--color-warning', colors.warning)
    root.style.setProperty('--color-info', colors.info)

    // 设置 CSS 变量 - 阴影
    root.style.setProperty('--shadow-sm', shadows.sm)
    root.style.setProperty('--shadow-md', shadows.md)
    root.style.setProperty('--shadow-lg', shadows.lg)
    root.style.setProperty('--shadow-xl', shadows.xl)

    console.log(`主题已应用: ${themeId} (${themeConfig.name})`)
  }

  /**
   * 切换到指定主题
   * @param {string} themeId - 主题 ID
   */
  setTheme(themeId) {
    if (!getThemeById(themeId)) {
      console.warn(`无效的主题 ID: ${themeId}`)
      return
    }
    this.state.currentThemeId = themeId
  }

  /**
   * 切换浅色/深色主题（简化方法）
   */
  toggleTheme() {
    const newTheme = this.state.currentThemeId === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  /**
   * 获取当前主题的模式(light/dark)
   * @returns {string} 'light' 或 'dark'
   */
  getThemeMode() {
    return this.state.currentThemeId === 'light' ? 'light' : 'dark'
  }

  /**
   * 切换到下一个同模式的主题
   * 例如: dark -> blue -> green -> purple -> dark
   */
  cycleTheme() {
    const allThemes = this.getAvailableThemes()
    const currentMode = this.getThemeMode()

    // 获取当前模式下的所有主题
    const themesInMode = currentMode === 'light'
      ? allThemes.filter(t => t.id === 'light')
      : allThemes.filter(t => t.id !== 'light')

    if (themesInMode.length <= 1) {
      return
    }

    // 找到当前主题在列表中的索引
    const currentIndex = themesInMode.findIndex(t => t.id === this.state.currentThemeId)
    // 切换到下一个主题
    const nextIndex = (currentIndex + 1) % themesInMode.length
    this.setTheme(themesInMode[nextIndex].id)
  }

  /**
   * 获取所有暗色主题
   * @returns {Array} 暗色主题配置数组
   */
  getDarkThemes() {
    return this.getAvailableThemes().filter(t => t.id !== 'light')
  }

  /**
   * 获取所有亮色主题
   * @returns {Array} 亮色主题配置数组
   */
  getLightThemes() {
    return this.getAvailableThemes().filter(t => t.id === 'light')
  }

  /**
   * 获取当前主题 ID
   * @returns {string} 当前主题 ID
   */
  getCurrentThemeId() {
    return this.state.currentThemeId
  }

  /**
   * 获取当前主题配置
   * @returns {object} 主题配置对象
   */
  getCurrentTheme() {
    return getThemeById(this.state.currentThemeId)
  }

  /**
   * 设置是否为 admin 页面
   * @param {boolean} isAdmin - 是否在 admin 页面
   */
  setIsAdmin(isAdmin) {
    const wasAdmin = this.state.isAdmin
    this.state.isAdmin = isAdmin

    // 如果从 admin 切换到非 admin 或反之，重新加载主题
    if (wasAdmin !== isAdmin) {
      this.loadThemeFromStorage()
    }
  }

  /**
   * 检查是否为深色主题
   * @returns {boolean}
   */
  isDark() {
    return this.state.currentThemeId === 'dark'
  }

  /**
   * 检查是否为浅色主题
   * @returns {boolean}
   */
  isLight() {
    return this.state.currentThemeId === 'light'
  }

  /**
   * 获取所有可用主题
   * @returns {Array} 主题配置数组
   */
  getAvailableThemes() {
    return getAllThemes()
  }

  /**
   * 重置主题为默认值
   */
  resetTheme() {
    const defaultThemeId = this.state.isAdmin ? defaultTheme.admin : defaultTheme.normal
    this.setTheme(defaultThemeId)
  }

  /**
   * 清除主题缓存
   */
  clearCache() {
    this.storage.clearAll()
    console.log('所有主题缓存已清除')
  }
}

// 导出单例
export default new ThemeService()

// 同时导出主题配置，方便其他地方使用
export { themes, defaultTheme, getThemeById, getAllThemes }
