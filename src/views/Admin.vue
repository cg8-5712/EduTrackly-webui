<template>
  <div v-if="!isAuthenticated" class="min-h-screen w-full p-3 md:p-4">
    <div class="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1480px] items-center">
      <div class="grid w-full gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)]">
        <section class="board-shell p-6 md:p-8">
          <div class="board-kicker mb-4">Admin Access</div>
          <h1 class="board-heading mb-4">Classroom Operations Console</h1>
          <p class="board-subcopy mb-8">
            Manage attendance, homework, countdowns, slogans, classes and system settings from a low-glare control room layout.
          </p>

          <div class="grid gap-3 md:grid-cols-3">
            <div class="metric-panel">
              <div class="metric-label">Scenes</div>
              <div class="metric-value">3</div>
            </div>
            <div class="metric-panel">
              <div class="metric-label">Modules</div>
              <div class="metric-value">10</div>
            </div>
            <div class="metric-panel">
              <div class="metric-label">Mode</div>
              <div class="metric-value !text-3xl md:!text-4xl">Calm UI</div>
            </div>
          </div>
        </section>

        <section class="board-shell p-6 md:p-8">
          <div class="mb-6">
            <div class="board-kicker mb-3">{{ $t("admin.login") }}</div>
            <h2 class="panel-title">Enter admin password</h2>
            <p class="panel-caption mt-2">{{ $t("admin.pleaseEnterPassword") }}</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-foreground">{{ $t("common.password") }}</label>
              <Input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                :placeholder="$t('admin.pleaseEnterPassword')"
                :disabled="isLogging"
              />
            </div>

            <div
              v-if="loginError"
              class="rounded-[1.4rem] border border-[rgba(208,109,102,0.2)] bg-[rgba(208,109,102,0.12)] px-4 py-3 text-sm text-[var(--color-error)]"
            >
              {{ loginError }}
            </div>

            <Button type="submit" block size="lg" :loading="isLogging" :disabled="isLogging">
              {{ isLogging ? $t("common.loading") : $t("common.login") }}
            </Button>
          </form>
        </section>
      </div>
    </div>
  </div>

  <div v-else class="h-screen w-full p-3 md:p-4">
    <div class="grid h-full gap-3 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <aside class="board-shell flex min-h-0 flex-col p-4">
        <div class="mb-5 border-b border-white/8 pb-4">
          <div class="board-kicker mb-2">Admin</div>
          <h2 class="panel-title !text-2xl">Control Deck</h2>
        </div>

        <div class="mb-4 flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <nav class="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
          <button
            v-for="item in navigation"
            :key="item.componentName"
            type="button"
            class="flex w-full items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-left"
            :class="item.current
              ? 'border-[rgba(var(--color-primary-rgb),0.2)] bg-[rgba(var(--color-primary-rgb),0.14)] text-foreground'
              : 'border-white/8 bg-white/4 text-[var(--color-text-secondary)] hover:bg-white/6'"
            @click="changeComponent(item)"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span class="text-sm font-medium">{{ $t(item.nameKey) }}</span>
          </button>
        </nav>

        <Button variant="danger" block size="lg" class="mt-4" @click="handleLogout">
          {{ $t("common.logout") }}
        </Button>
      </aside>

      <section class="board-shell flex min-h-0 flex-col overflow-hidden">
        <header class="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-5 md:px-6">
          <div>
            <div class="board-kicker mb-2">Module</div>
            <h1 class="panel-title">{{ currentMenuName }}</h1>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="info-pill">{{ adminRole || "admin" }}</span>
            <span class="info-pill">Operational</span>
          </div>
        </header>

        <div class="admin-page min-h-0 flex-1 overflow-auto p-5 md:p-6">
          <component :is="currentComponent" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import AuthService from "@/services/common/auth"
import notificationService from "@/services/common/notification"
import CurrentAdmin from "@/components/admin/CurrentAdmin.vue"
import ClassAdmin from "@/components/admin/ClassAdmin.vue"
import StudentAdmin from "@/components/admin/StudentAdmin.vue"
import HomeworkAdmin from "@/components/admin/HomeworkAdmin.vue"
import CountdownAdmin from "@/components/admin/CountdownAdmin.vue"
import SloganAdmin from "@/components/admin/SloganAdmin.vue"
import SettingAdmin from "@/components/admin/SettingAdmin.vue"
import AdminManagement from "@/components/admin/AdminManagement.vue"
import RateLimitAdmin from "@/components/admin/RateLimitAdmin.vue"
import System from "@/components/admin/System.vue"
import ThemeToggle from "@/components/common/ThemeToggle.vue"
import LanguageToggle from "@/components/common/LanguageToggle.vue"
import Input from "@/components/ui/input/Input.vue"
import Button from "@/components/ui/button/Button.vue"
import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline"

const { t: $t } = useI18n()

const isAuthenticated = ref(false)
const password = ref("")
const loginError = ref("")
const isLogging = ref(false)
const adminRole = ref("")

let authCheckInterval = null

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
  system: System,
}

const allNavigation = [
  { nameKey: "nav.currentadmin", icon: AcademicCapIcon, current: true, componentName: "currentadmin" },
  { nameKey: "nav.classadmin", icon: UsersIcon, current: false, componentName: "classadmin" },
  { nameKey: "nav.studentadmin", icon: UsersIcon, current: false, componentName: "studentadmin" },
  { nameKey: "nav.homeworkadmin", icon: BookOpenIcon, current: false, componentName: "homeworkadmin" },
  { nameKey: "nav.countdownadmin", icon: ClockIcon, current: false, componentName: "countdownadmin" },
  { nameKey: "nav.sloganadmin", icon: ChatBubbleBottomCenterTextIcon, current: false, componentName: "sloganadmin" },
  { nameKey: "nav.settingadmin", icon: AdjustmentsHorizontalIcon, current: false, componentName: "settingadmin" },
  { nameKey: "nav.adminmanagement", icon: ShieldCheckIcon, current: false, componentName: "adminmanagement", superadminOnly: true },
  { nameKey: "nav.ratelimitadmin", icon: BoltIcon, current: false, componentName: "ratelimitadmin", superadminOnly: true },
  { nameKey: "nav.system", icon: Cog8ToothIcon, current: false, componentName: "system" },
]

const navigation = computed(() =>
  adminRole.value === "superadmin"
    ? allNavigation
    : allNavigation.filter((item) => !item.superadminOnly)
)

const currentComponent = ref(components.currentadmin)

const currentMenuName = computed(() => {
  const currentItem = navigation.value.find((item) => item.current)
  return currentItem ? $t(currentItem.nameKey) : ""
})

function checkWechatBrowser() {
  const userAgent = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(userAgent)
}

function hasShownWechatTip() {
  return sessionStorage.getItem("edutrackly-cg8-5712-wechat-tip-shown") === "true"
}

function checkAuthStatus() {
  const authStatus = AuthService.isAdminAuthenticated()

  if (isAuthenticated.value !== authStatus) {
    isAuthenticated.value = authStatus

    if (!authStatus) {
      password.value = ""
      loginError.value = ""
      adminRole.value = ""
    } else {
      const adminInfo = AuthService.getAdminInfo()
      adminRole.value = adminInfo.role || ""
    }
  }

  return authStatus
}

function startAuthCheck() {
  checkAuthStatus()

  authCheckInterval = window.setInterval(() => {
    if (!checkAuthStatus()) {
      stopAuthCheck()
    }
  }, 30000)
}

function stopAuthCheck() {
  if (authCheckInterval) {
    window.clearInterval(authCheckInterval)
    authCheckInterval = null
  }
}

async function handleLogin() {
  if (!password.value.trim()) {
    loginError.value = $t("common.passwordRequired")
    return
  }

  isLogging.value = true
  loginError.value = ""

  try {
    const response = await AuthService.adminLogin(password.value)

    if (response.code === 0) {
      isAuthenticated.value = true
      password.value = ""
      const adminInfo = AuthService.getAdminInfo()
      adminRole.value = adminInfo.role || ""
      startAuthCheck()
      return
    }

    loginError.value = response.message || $t("admin.loginFailed")
  } catch (error) {
    console.error("[Admin] login failed:", error)
    loginError.value = error.response?.data?.message || $t("common.loginFailedRetry")
  } finally {
    isLogging.value = false
  }
}

function handleLogout() {
  AuthService.logout()
  isAuthenticated.value = false
  password.value = ""
  loginError.value = ""
  adminRole.value = ""
  allNavigation.forEach((item) => {
    item.current = item.componentName === "currentadmin"
  })
  currentComponent.value = components.currentadmin
  stopAuthCheck()
}

function changeComponent(item) {
  allNavigation.forEach((navItem) => {
    navItem.current = false
  })
  item.current = true
  currentComponent.value = components[item.componentName]
}

onMounted(() => {
  startAuthCheck()

  if (checkWechatBrowser() && !hasShownWechatTip()) {
    setTimeout(() => {
      notificationService.info($t("wechatTip.message"))
      sessionStorage.setItem("edutrackly-cg8-5712-wechat-tip-shown", "true")
    }, 1000)
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && isAuthenticated.value) {
      checkAuthStatus()
    }
  })
})

onBeforeUnmount(() => {
  stopAuthCheck()
})
</script>
