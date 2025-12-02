<template>
  <div class="h-screen w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col p-2 md:p-4 box-border overflow-hidden transition-colors duration-200" @click="handleGlobalClick">
    <!-- 可拖动的倒计时组件 -->
    <FloatingCountdown :selected-cid="selectedCid" />

    <!-- 顶部栏 -->
    <div class="flex flex-wrap md:flex-nowrap justify-between items-center gap-3 md:gap-4 p-3 md:p-4 md:pt-8 bg-[var(--color-surface)] rounded-xl shadow-lg transition-colors duration-200">
      <!-- 日期和日历 -->
      <div class="relative flex items-center gap-2 md:gap-4 text-2xl md:text-4xl font-semibold text-[var(--color-primary)]">
        <div class="flex flex-col gap-1 md:gap-2">
          <span class="text-lg sm:text-[1.875rem] md:text-5xl font-bold text-[var(--color-primary)] transition-colors duration-200">{{ $t('common.today') }}：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="text-base sm:text-2xl md:text-[2.5rem] text-[var(--color-secondary)] transition-colors duration-200">
            {{ $t('datetime.selectDate') }}：{{ formattedSelectedDate }}
          </span>
        </div>
        <button @click="showCalendar = !showCalendar" class="bg-transparent border-none text-2xl md:text-5xl cursor-pointer p-1 rounded-lg transition-transform duration-200 hover:scale-110">
          📅
        </button>
        <div v-if="showCalendar" class="absolute top-full left-0 mt-2 z-50 bg-[var(--color-surface)] rounded-xl shadow-lg transition-colors duration-200 animate-fade-in">
          <Calendar mode="single" @select-date="onDateSelect" />
        </div>
      </div>

      <!-- 班级选择 -->
      <ClassSwitch v-model:cid="selectedCid" class="w-full md:w-auto" />

      <!-- 操作按钮区 -->
      <div class="flex items-center gap-2 sm:gap-4 md:gap-6 w-full md:w-auto justify-end">
        <LanguageToggle />
        <ThemeToggle />
        <div class="text-2xl sm:text-[2rem] md:text-[3.75rem] font-black text-[var(--color-primary)] transition-colors duration-200 whitespace-nowrap">{{ currentTime }}</div>
        <button @click.stop="toggleFullscreen" class="bg-[var(--color-surface)] text-[var(--color-primary)] border-2 border-[var(--color-border)] px-3 py-1.5 sm:px-4 sm:py-2 md:px-8 md:py-4 rounded-lg text-sm sm:text-lg md:text-[1.875rem] cursor-pointer transition-all duration-200 font-semibold whitespace-nowrap hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)]">
          <span class="hidden sm:inline">{{ isFullscreen ? $t('common.exitFullscreen') : $t('common.fullscreen') }}</span>
          <span class="sm:hidden">{{ isFullscreen ? '退出' : '全屏' }}</span>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 grid grid-cols-1 gap-2 md:gap-4 min-h-0 py-1 md:py-2 mt-2">
      <!-- 右侧作业信息 -->
      <div class="bg-[var(--color-surface)] rounded-xl p-3 sm:p-4 md:p-6 shadow-lg overflow-y-auto overflow-x-hidden min-h-0 transition-colors duration-200">
        <div class="flex justify-between items-center flex-wrap gap-2 m-0 py-1">
          <h2 class="text-2xl sm:text-4xl md:text-[3.75rem] font-bold text-[var(--color-primary)] m-0 transition-colors duration-200">{{ $t('homework.homeworkContent') }}</h2>
          <span class="text-xl sm:text-[1.875rem] md:text-5xl text-[var(--color-secondary)] transition-colors duration-200">{{ selectedDateText }}</span>
        </div>
        <Homework
            :selected-date="selectedDate"
            :selected-cid="selectedCid"
            :columns="2"
        />
      </div>
    </div>

    <footer v-if="!isFullscreen" class="bg-[var(--color-surface)] text-[var(--color-text-tertiary)] p-2 px-3 md:p-3 md:px-4 mt-auto transition-colors duration-200 border-t border-[var(--color-border)]">
      <div class="flex justify-between items-center max-w-full gap-4 flex-wrap max-md:flex-col max-md:items-center max-md:text-center">
        <div class="flex-1 min-w-[200px] max-md:justify-center max-md:min-w-full">
          <router-link to="/about" class="no-underline text-[var(--color-text-tertiary)] transition-colors duration-200 block hover:text-[var(--color-primary)]">
            <p class="m-0 text-xs md:text-sm leading-6">© 2025 EduTrackly. All rights reserved.</p>
            <p class="text-[0.625rem] md:text-xs opacity-70 mt-1">Licensed under GNU General Public License v3.0</p>
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Homework from '@/components/homework/homework.vue'
import Calendar from '@/components/common/calendar.vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LanguageToggle from '@/components/common/LanguageToggle.vue'
import FloatingCountdown from '@/components/common/FloatingCountdown.vue'
import VersionInfo from '@/components/VersionInfo.vue'
import { formatYYYYMMDDToDate } from '@/utils/formatDate'
import notificationService from '@/services/common/notification'

const { t: $t } = useI18n()

// 检测微信浏览器
const checkWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(ua)
}

// 检查是否已经显示过提示
const hasShownWechatTip = () => {
  return sessionStorage.getItem('edutrackly-cg8-5712-wechat-tip-shown') === 'true'
}

const currentTime = ref('')
const todayDate = ref('')
const todayDateInt = ref('')
const showCalendar = ref(false)
const selectedDate = ref(null)
const isFullscreen = ref(false)

// 班级相关
const selectedCid = ref(null)

// 计算属性
const formattedSelectedDate = computed(() => {
  if (selectedDate.value) {
    return formatYYYYMMDDToDate(parseInt(selectedDate.value))
  }
  return ''
})

const selectedDateText = computed(() => {
  if (selectedDate.value && selectedDate.value !== todayDateInt.value) {
    return formattedSelectedDate.value + ' ' + $t('homework.title')
  }
  return $t('homework.todayHomework')
})

// 更新时间
const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 更新日期
const updateDate = () => {
  const now = new Date()
  const dateInt = parseInt(
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0')
  )
  todayDateInt.value = String(dateInt)
  todayDate.value = formatYYYYMMDDToDate(dateInt)
}

// 日期选择
const onDateSelect = (date) => {
  selectedDate.value = date
  showCalendar.value = false
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 点击空白关闭日历
const handleGlobalClick = (event) => {
  if (showCalendar.value && !event.target.closest('.calendar-popup') && !event.target.closest('.calendar-button')) {
    showCalendar.value = false
  }
}

onMounted(() => {
  updateDate()
  updateTime()
  setInterval(updateTime, 60000)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })

  // 检测微信浏览器并显示提示
  if (checkWechatBrowser() && !hasShownWechatTip()) {
    setTimeout(() => {
      notificationService.info($t('wechatTip.message'));
      sessionStorage.setItem('edutrackly-cg8-5712-wechat-tip-shown', 'true')
    }, 1000) // 延迟1秒显示，避免干扰页面加载
  }
})
</script>

<style scoped>
/* 日历弹出动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-in-out;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 6px;
  transition: background var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>
