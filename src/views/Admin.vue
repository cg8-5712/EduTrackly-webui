<template>
  <!-- 登录表单 -->
  <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-[520px]">
      <!-- 登录卡片 - 宽高比约3:4 -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-12 space-y-6 sm:space-y-8 aspect-[3/4]">
        <!-- 标题区域 -->
        <div class="text-center">
          <div class="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <svg class="h-7 w-7 sm:h-10 sm:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ $t('admin.login') }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600">
            {{ $t('admin.pleaseEnterPassword') }}
          </p>
        </div>

        <!-- 登录表单 -->
        <form class="space-y-4 sm:space-y-6 flex-1 flex flex-col justify-center" @submit.prevent="handleLogin">
          <div>
            <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.password') }}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              :placeholder="$t('admin.pleaseEnterPassword')"
              v-model="password"
              :disabled="isLogging"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="loginError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm flex items-center gap-2">
            <svg class="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ loginError }}</span>
          </div>

          <!-- 提交按钮 -->
          <div>
            <button
              type="submit"
              :disabled="isLogging"
              class="group relative w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent text-xs sm:text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <template v-if="isLogging">
                <LoadingSpinner :size="20" color="#ffffff" message="" />
                <span>{{ $t('common.loading') }}</span>
              </template>
              <template v-else>
                <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>{{ $t('common.login') }}</span>
              </template>
            </button>
          </div>
        </form>
      </div>

      <!-- 底部提示 -->
      <p class="mt-4 text-center text-[10px] sm:text-xs text-gray-300">
        {{ $t('common.passwordSafetyWarning') }}
      </p>
    </div>
  </div>

  <!-- 管理界面 -->
  <div v-else class="flex flex-col md:flex-row h-screen overflow-hidden">
    <!-- 移动端横向滚动导航 + 桌面端侧边栏 -->
    <div class="bg-slate-700 text-white md:w-60 md:min-w-60 flex flex-col shadow-lg">
      <div class="p-3 sm:p-5 border-b border-slate-600 bg-slate-800">
        <h3 class="m-0 text-base sm:text-lg font-semibold text-center">{{ $t('admin.dashboard') }}</h3>
      </div>
      <!-- 移动端横向滚动 -->
      <div class="flex-1 md:overflow-y-auto overflow-x-auto md:overflow-x-visible md:pt-2">
        <ul class="list-none p-0 m-0 flex md:block whitespace-nowrap md:whitespace-normal">
          <li
              v-for="(item, index) in navigation"
              :key="index"
              @click="changeComponent(item)"
              @keydown.enter="changeComponent(item)"
              :class="{'bg-slate-600 border-b-cyan-400 md:border-l-cyan-400 md:border-b-transparent font-semibold': item.current}"
              class="py-3 px-4 md:py-4 md:px-5 cursor-pointer flex items-center transition-all duration-300 border-b-4 md:border-b-0 md:border-l-4 border-transparent hover:bg-slate-600 hover:border-b-cyan-400 md:hover:border-l-cyan-400 md:hover:border-b-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-inset inline-flex md:flex"
              tabindex="0"
              role="button"
              :aria-label="$t(item.nameKey)"
              :aria-current="item.current ? 'page' : undefined"
          >
            <component :is="item.icon" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
            <span class="text-xs sm:text-sm md:text-base">{{ $t(item.nameKey) }}</span>
          </li>
        </ul>
      </div>
      <div class="p-3 sm:p-4 border-t border-slate-600">
        <button
          @click="handleLogout"
          class="w-full py-2 px-3 sm:px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm rounded-md transition-all duration-200"
        >
          {{ $t('common.logout') }}
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div class="bg-white py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 border-b border-gray-200 shadow-sm z-10 flex justify-between items-center">
        <h2 class="m-0 text-lg sm:text-xl md:text-2xl font-semibold text-slate-700">{{ currentMenuName }}</h2>
        <div class="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      <div class="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthService from '@/services/common/auth'
import notificationService from '@/services/common/notification'

const { t: $t } = useI18n()

// 引入各个管理组件
import CurrentAdmin from '@/components/admin/CurrentAdmin.vue'
import ClassAdmin from '@/components/admin/ClassAdmin.vue'
import StudentAdmin from '@/components/admin/StudentAdmin.vue'
import HomeworkAdmin from '@/components/admin/HomeworkAdmin.vue'
import CountdownAdmin from '@/components/admin/CountdownAdmin.vue'
import SloganAdmin from '@/components/admin/SloganAdmin.vue'
import SettingAdmin from '@/components/admin/SettingAdmin.vue'
import AdminManagement from '@/components/admin/AdminManagement.vue'
import RateLimitAdmin from '@/components/admin/RateLimitAdmin.vue'
import System from '@/components/admin/System.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LanguageToggle from '@/components/common/LanguageToggle.vue'

// 引入图标组件（你需要根据实际使用的图标库调整）
import { AcademicCapIcon, BookOpenIcon, UsersIcon, Cog8ToothIcon, ClockIcon, AdjustmentsHorizontalIcon, ChatBubbleBottomCenterTextIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/vue/24/outline'

// 检测微信浏览器
const checkWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(ua)
}

// 检查是否已经显示过提示
const hasShownWechatTip = () => {
  return sessionStorage.getItem('edutrackly-cg8-5712-wechat-tip-shown') === 'true'
}

// 登录相关状态
const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')
const isLogging = ref(false)

// 定时器ID，用于定期检查token有效性
let authCheckInterval = null

// 管理组件映射
const components = {
  currentadmin: CurrentAdmin,
  classadmin: ClassAdmin,
  studentadmin: StudentAdmin,
  homeworkadmin: HomeworkAdmin,
  countdownadmin: CountdownAdmin,
  sloganadmin: SloganAdmin,
  settingadmin: SettingAdmin,
  adminmanagement: AdminManagement,
  ratelimitadmin: RateLimitAdmin,
  system: System
}

// 导航菜单配置
const navigation = ref([
  { nameKey: 'nav.currentadmin', href: '#', icon: AcademicCapIcon, current: true, componentName: 'currentadmin'  },
  { nameKey: 'nav.classadmin', href: '#', icon: UsersIcon, current: false, componentName: 'classadmin'  },
  { nameKey: 'nav.studentadmin', href: '#', icon: UsersIcon, current: false, componentName: 'studentadmin'  },
  { nameKey: 'nav.homeworkadmin', href: '#', icon: BookOpenIcon, current: false, componentName: 'homeworkadmin'  },
  { nameKey: 'nav.countdownadmin', href: '#', icon: ClockIcon, current: false, componentName: 'countdownadmin'  },
  { nameKey: 'nav.sloganadmin', href: '#', icon: ChatBubbleBottomCenterTextIcon, current: false, componentName: 'sloganadmin'  },
  { nameKey: 'nav.settingadmin', href: '#', icon: AdjustmentsHorizontalIcon, current: false, componentName: 'settingadmin'  },
  { nameKey: 'nav.adminmanagement', href: '#', icon: ShieldCheckIcon, current: false, componentName: 'adminmanagement'  },
  { nameKey: 'nav.ratelimitadmin', href: '#', icon: BoltIcon, current: false, componentName: 'ratelimitadmin'  },
  { nameKey: 'nav.system', href: '#', icon: Cog8ToothIcon, current: false, componentName: 'system'  }
])

// 当前选中的菜单项
const currentComponent = ref(components[ navigation.value.find(item => item.current).componentName ])

// 当前菜单名称（用于显示页面标题）
const currentMenuName = computed(() => {
  const currentItem = navigation.value.find(item => item.current)
  return currentItem ? $t(currentItem.nameKey) : ''
})

// 检查登录状态
const checkAuthStatus = () => {
  const authStatus = AuthService.isAdminAuthenticated()
  if (isAuthenticated.value !== authStatus) {
    isAuthenticated.value = authStatus

    // 如果未认证，清空敏感信息
    if (!authStatus) {
      password.value = ''
      loginError.value = ''
    }
  }
  return authStatus
}

// 启动定期检查认证状态
const startAuthCheck = () => {
  // 立即检查一次
  checkAuthStatus()

  // 每30秒检查一次认证状态
  authCheckInterval = setInterval(() => {
    if (!checkAuthStatus()) {
      // 如果认证失败，停止定时器
      stopAuthCheck()
    }
  }, 30000)
}

// 停止定期检查认证状态
const stopAuthCheck = () => {
  if (authCheckInterval) {
    clearInterval(authCheckInterval)
    authCheckInterval = null
  }
}

// 处理登录
const handleLogin = async () => {
  if (!password.value.trim()) {
    loginError.value = $t('common.passwordRequired')
    return
  }

  isLogging.value = true
  loginError.value = ''

  try {
    const response = await AuthService.adminLogin(password.value)

    if (response.code === 0) {
      isAuthenticated.value = true
      password.value = ''
      // 登录成功后启动定期检查
      startAuthCheck()
    } else {
      loginError.value = response.message || $t('admin.loginFailed')
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = error.response?.data?.message || $t('common.loginFailedRetry')
  } finally {
    isLogging.value = false
  }
}

// 处理登出
const handleLogout = () => {
  AuthService.logout()
  isAuthenticated.value = false
  password.value = ''
  loginError.value = ''
  // 停止定期检查
  stopAuthCheck()
}

// 处理菜单项选择
const changeComponent = (item) => {
  // 设置当前选中项
  navigation.value.forEach(navItem => navItem.current = false)
  item.current = true

  // 切换显示的组件
  currentComponent.value = components[item.componentName]
}

// 组件挂载时检查登录状态
onMounted(() => {
  startAuthCheck()

  // 检测微信浏览器并显示提示
  if (checkWechatBrowser() && !hasShownWechatTip()) {
    setTimeout(() => {
      notificationService.info($t('wechatTip.message'));
      sessionStorage.setItem('edutrackly-cg8-5712-wechat-tip-shown', 'true')
    }, 1000) // 延迟1秒显示，避免干扰页面加载
  }
})

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  stopAuthCheck()
})

// 监听页面可见性变化，当页面重新可见时检查认证状态
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isAuthenticated.value) {
    checkAuthStatus()
  }
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.bg-slate-700 .overflow-y-auto::-webkit-scrollbar-track {
  background: #334155;
}

.bg-slate-700 .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #06b6d4;
  border-radius: 3px;
}

.bg-slate-700 .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #0891b2;
}

.bg-gray-50 .overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.bg-gray-50 .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.bg-gray-50 .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }

  .w-60 {
    width: 100%;
    height: auto;
    max-height: 200px;
  }

  .flex-1.overflow-y-auto {
    overflow-x: auto;
  }

  .list-none {
    display: flex;
    flex-direction: row;
  }

  .py-4.px-5 {
    white-space: nowrap;
    min-width: 120px;
  }

  .p-8 {
    padding: 20px 15px;
  }
}

/* 确保子组件能够正确滚动 */
div >>> * {
  max-width: 100%;
}
</style>