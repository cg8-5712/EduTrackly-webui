import { reactive, watch } from 'vue'
import i18n from '@/i18n'

/**
 * 本地存储管理类
 * 负责语言偏好的持久化存储
 */
class LanguageStorage {
  constructor() {
    this.STORAGE_KEY = 'edutrackly-cg8-5712-edu-trackly-language'
  }

  /**
   * 保存语言到本地存储
   * @param {string} locale - 语言代码
   */
  save(locale) {
    try {
      localStorage.setItem(this.STORAGE_KEY, locale)
      console.log(`[i18n Service] Language saved: ${locale}`)
    } catch (error) {
      console.error('[i18n Service] Failed to save language:', error)
    }
  }

  /**
   * 从本地存储加载语言
   * @returns {string|null} 语言代码
   */
  load() {
    try {
      const savedLocale = localStorage.getItem(this.STORAGE_KEY)
      if (savedLocale) {
        console.log(`[i18n Service] Loaded cached language: ${savedLocale}`)
        return savedLocale
      }
      return null
    } catch (error) {
      console.error('[i18n Service] Failed to load language:', error)
      return null
    }
  }

  /**
   * 清除本地存储的语言
   */
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      console.log('[i18n Service] Language cache cleared')
    } catch (error) {
      console.error('[i18n Service] Failed to clear language cache:', error)
    }
  }
}

/**
 * 国际化服务类
 * 管理全局语言状态，支持语言切换和持久化
 */
class I18nService {
  constructor() {
    // 存储管理器
    this.storage = new LanguageStorage()

    // 支持的语言列表
    this.availableLocales = [
      { code: 'zh-CN', name: '简体中文', shortName: '中文' },
      { code: 'zh-TW', name: '繁體中文', shortName: '繁體' },
      { code: 'en-US', name: 'English', shortName: 'EN' },
      { code: 'ja-JP', name: '日本語', shortName: '日本語' }
    ]

    // 默认语言
    this.defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || 'zh-CN'

    // 响应式语言状态
    this.state = reactive({
      currentLocale: this.defaultLocale
    })

    // 初始化语言服务
    this.init()
  }

  /**
   * 初始化语言服务
   */
  init() {
    // 从本地存储恢复语言设置
    this.loadLanguageFromStorage()

    // 监听语言变化，自动保存到本地存储
    watch(
      () => this.state.currentLocale,
      (newLocale) => {
        this.applyLanguage(newLocale)
        this.storage.save(newLocale)
      },
      { immediate: true }
    )
  }

  /**
   * 从本地存储加载语言设置
   */
  loadLanguageFromStorage() {
    const savedLocale = this.storage.load()
    if (savedLocale && this.isValidLocale(savedLocale)) {
      this.state.currentLocale = savedLocale
    } else {
      // 尝试从浏览器语言中获取
      const browserLocale = this.detectBrowserLanguage()
      this.state.currentLocale = browserLocale || this.defaultLocale
      console.log(`[i18n Service] Using ${browserLocale ? 'browser' : 'default'} language: ${this.state.currentLocale}`)
    }
  }

  /**
   * 检测浏览器语言
   * @returns {string|null} 匹配的语言代码
   */
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage

    // 精确匹配
    if (this.isValidLocale(browserLang)) {
      return browserLang
    }

    // 模糊匹配（例如 zh -> zh-CN）
    const langPrefix = browserLang.split('-')[0].toLowerCase()
    const match = this.availableLocales.find(locale =>
      locale.code.toLowerCase().startsWith(langPrefix)
    )

    return match ? match.code : null
  }

  /**
   * 应用语言到 Vue i18n
   * @param {string} locale - 语言代码
   */
  applyLanguage(locale) {
    if (!this.isValidLocale(locale)) {
      console.warn(`[i18n Service] Invalid locale: ${locale}`)
      return
    }

    // 设置 Vue i18n 的当前语言
    i18n.global.locale.value = locale

    // 设置 HTML lang 属性
    document.documentElement.setAttribute('lang', locale)

    console.log(`[i18n Service] Language applied: ${locale}`)
  }

  /**
   * 检查语言代码是否有效
   * @param {string} locale - 语言代码
   * @returns {boolean}
   */
  isValidLocale(locale) {
    return this.availableLocales.some(l => l.code === locale)
  }

  /**
   * 切换到指定语言
   * @param {string} locale - 语言代码
   */
  setLanguage(locale) {
    if (!this.isValidLocale(locale)) {
      console.warn(`[i18n Service] Invalid locale: ${locale}`)
      return
    }
    this.state.currentLocale = locale
  }

  /**
   * 切换到下一个语言
   */
  toggleLanguage() {
    const currentIndex = this.availableLocales.findIndex(
      l => l.code === this.state.currentLocale
    )
    const nextIndex = (currentIndex + 1) % this.availableLocales.length
    this.setLanguage(this.availableLocales[nextIndex].code)
  }

  /**
   * 获取当前语言代码
   * @returns {string} 当前语言代码
   */
  getCurrentLocale() {
    return this.state.currentLocale
  }

  /**
   * 获取当前语言配置
   * @returns {object} 语言配置对象
   */
  getCurrentLanguage() {
    return this.availableLocales.find(l => l.code === this.state.currentLocale) ||
           this.availableLocales[0]
  }

  /**
   * 获取所有可用语言
   * @returns {Array} 语言配置数组
   */
  getAvailableLanguages() {
    return this.availableLocales
  }

  /**
   * 重置语言为默认值
   */
  resetLanguage() {
    this.setLanguage(this.defaultLocale)
  }

  /**
   * 清除语言缓存
   */
  clearCache() {
    this.storage.clear()
    console.log('[i18n Service] Language cache cleared')
  }

  /**
   * 获取翻译文本（快捷方法）
   * @param {string} key - 翻译键
   * @param {object} params - 参数
   * @returns {string} 翻译后的文本
   */
  t(key, params) {
    return i18n.global.t(key, params)
  }

  /**
   * 检查翻译键是否存在
   * @param {string} key - 翻译键
   * @returns {boolean}
   */
  te(key) {
    return i18n.global.te(key)
  }
}

// 导出单例
export default new I18nService()
