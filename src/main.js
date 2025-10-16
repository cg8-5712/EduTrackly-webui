import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import LoadingSpinner from './components/common/LoadingSpinner.vue'
import i18n from './i18n'
import i18nService from './services/common/i18n'

const app = createApp(App)

app.component('LoadingSpinner', LoadingSpinner)

app.use(router)
app.use(i18n)

// 初始化 i18n 服务（会自动从缓存加载语言设置）
// i18nService 已经在模块加载时自动初始化

app.mount('#app')