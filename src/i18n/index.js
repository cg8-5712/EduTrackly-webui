import { createI18n } from 'vue-i18n';
import zhcn from './locales/zhcn';
import en from './locales/en';
import ja from './locales/ja';
import zhtw from './locales/zhtw';

const i18n = createI18n({
    legacy: false,
    locale: 'zhcn', // 默认语言
    fallbackLocale: 'en',
    messages: {
        zhcn,
        en,
        ja,
        zhtw
    }
});

export default i18n;
