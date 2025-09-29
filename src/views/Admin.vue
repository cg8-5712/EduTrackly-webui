<template>
  <!-- 登录表单 -->
  <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          管理员登录
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          请输入管理员密码
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="password" class="sr-only">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="管理员密码"
            v-model="password"
          />
        </div>
        <div v-if="loginError" class="text-red-600 text-sm text-center">
          {{ loginError }}
        </div>
        <div>
          <button
            type="submit"
            :disabled="isLogging"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isLogging ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 管理界面 -->
  <div v-else class="flex h-screen overflow-hidden">
    <div class="w-60 min-w-60 bg-slate-700 text-white flex flex-col shadow-lg">
      <div class="p-5 border-b border-slate-600 bg-slate-800">
        <h3 class="m-0 text-lg font-semibold text-center">管理后台</h3>
      </div>
      <div class="flex-1 overflow-y-auto pt-2">
        <ul class="list-none p-0 m-0">
          <li
              v-for="(item, index) in navigation"
              :key="index"
              @click="changeComponent(item)"
              :class="{'bg-slate-600 border-l-cyan-400 font-semibold': item.current}"
              class="py-4 px-5 cursor-pointer flex items-center transition-all duration-300 border-l-4 border-l-transparent hover:bg-slate-600 hover:border-l-cyan-400"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="p-4 border-t border-slate-600">
        <button
          @click="handleLogout"
          class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div class="bg-white py-5 px-8 border-b border-gray-200 shadow-sm z-10">
        <h2 class="m-0 text-2xl font-semibold text-slate-700">{{ currentMenuName }}</h2>
      </div>
      <div class="flex-1 p-8 overflow-y-auto overflow-x-hidden">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import AuthService from '@/services/common/auth'

// 引入各个管理组件
import CurrentAdmin from '@/components/admin/CurrentAdmin.vue'
import ClassAdmin from '@/components/admin/ClassAdmin.vue'
import StudentAdmin from '@/components/admin/StudentAdmin.vue'
import HomeworkAdmin from '@/components/admin/HomeworkAdmin.vue'
import System from '@/components/admin/System.vue'

// 引入图标组件（你需要根据实际使用的图标库调整）
import { AcademicCapIcon, BookOpenIcon, UsersIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline'

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
  system: System
}

// 导航菜单配置
const navigation = ref([
  { name: '当前状态', nameKey: 'nav.currentadmin', href: '#', icon: AcademicCapIcon, current: true, componentName: 'currentadmin'  },
  { name: '班级管理', nameKey: 'nav.classadmin', href: '#', icon: UsersIcon, current: false, componentName: 'classadmin'  },
  { name: '学生管理', nameKey: 'nav.studentadmin', href: '#', icon: UsersIcon, current: false, componentName: 'studentadmin'  },
  { name: '作业管理', nameKey: 'nav.homeworkadmin', href: '#', icon: BookOpenIcon, current: false, componentName: 'homeworkadmin'  },
  { name: '系统设置', nameKey: 'nav.system', href: '#', icon: Cog8ToothIcon, current: false, componentName: 'system'  }
])

// 当前选中的菜单项
const currentComponent = ref(components[ navigation.value.find(item => item.current).componentName ])

// 当前菜单名称（用于显示页面标题）
const currentMenuName = computed(() => {
  return navigation.value.find(item => item.current)?.name || ''
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
    loginError.value = '请输入密码'
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
      loginError.value = response.message || '登录失败'
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = error.response?.data?.message || '登录失败，请重试'
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