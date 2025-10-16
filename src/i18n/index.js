import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'
import jaJP from './locales/ja-JP'

// 从环境变量读取默认语言，如果未设置则使用 zh-CN
const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
    'ja-JP': jaJP
  },
  // 禁止在生产环境中显示警告
  silentTranslationWarn: true,
  // 禁止在翻译缺失时显示警告
  missingWarn: false,
  fallbackWarn: false
})

export default i18n
