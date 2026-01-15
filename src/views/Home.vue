<template>
  <div class="h-screen w-full bg-[var(--color-background)] flex flex-col p-2 sm:p-4 box-border overflow-hidden transition-colors duration-200" @click="handleGlobalClick">
    <!-- 可拖动的倒计时组件 -->
    <FloatingCountdown :selected-cid="selectedCid" />

    <!-- 可拖动的标语组件 -->
    <FloatingSlogan :selected-cid="selectedCid" />

    <!-- 顶部栏 -->
    <div class="flex flex-wrap md:flex-nowrap justify-between items-center gap-3 md:gap-4 p-3 md:p-4 bg-[var(--color-header-footer)] rounded-xl shadow-lg transition-colors duration-200">
      <!-- 日期和日历 -->
      <div class="relative flex items-center gap-2 sm:gap-4 text-2xl font-semibold">
        <div class="flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span class="text-lg sm:text-2xl md:text-5xl font-bold text-[var(--color-primary)]">{{ $t('common.today') }}：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="text-base sm:text-xl md:text-[2.5rem] text-[var(--color-secondary)]">
            {{ $t('datetime.selectDate') }}：{{ formattedSelectedDate }}
          </span>
        </div>
        <div class="relative">
          <button @click.stop="showCalendar = !showCalendar" class="bg-transparent border-none text-2xl md:text-[2rem] cursor-pointer p-1 rounded-lg transition-transform duration-200 hover:scale-110">
          📅
          </button>
          <div v-if="showCalendar" class="absolute top-full right-0 mt-2 z-[1000] bg-[var(--color-surface)] rounded-xl shadow-lg animate-fade-in" @click.stop>
            <Calendar mode="single" @select-date="onDateSelect" />
          </div>
        </div>
      </div>

      <!-- 班级选择 -->
      <ClassSwitch v-model:cid="selectedCid" class="w-full md:w-auto" />

      <!-- 操作按钮区 -->
      <div class="flex items-center gap-2 sm:gap-3 md:gap-6 w-full md:w-auto justify-end">
        <LanguageToggle />
        <ThemeToggle />
        <div class="text-2xl sm:text-[2rem] md:text-[3.75rem] font-black text-[var(--color-primary)] whitespace-nowrap">
          {{ currentTime }}
        </div>
        <button @click.stop="toggleFullscreen" class="bg-[var(--color-surface)] text-[var(--color-primary)] border-2 border-[var(--color-border)] px-3 py-1.5 sm:px-4 sm:py-2 md:px-8 md:py-4 rounded-lg text-sm sm:text-lg md:text-[1.875rem] cursor-pointer transition-all duration-200 font-semibold whitespace-nowrap hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)] hover:border-[var(--color-primary)] active:scale-95">
          <span class="hidden sm:inline">{{ isFullscreen ? $t('common.exitFullscreen') : $t('common.fullscreen') }}</span>
          <span class="sm:hidden">{{ isFullscreen ? '退出' : '全屏' }}</span>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col md:flex-row gap-3 md:gap-0 min-h-0 py-2 mt-2" ref="mainContentRef">
      <!-- 考勤信息（移动端在上，桌面端在左） -->
      <div class="bg-[var(--color-surface)] rounded-xl p-3 sm:p-4 md:p-6 shadow-lg overflow-y-auto overflow-x-hidden min-h-0 transition-colors duration-200 md:flex-shrink-0" :style="mobileOrDesktopStyle('attendance')">
        <AttendanceDisplay ref="studentsComponent" :selected-date="selectedDate" :selected-cid="selectedCid" />
      </div>

      <!-- 可拖动分隔条（仅桌面端显示） -->
      <div
          class="hidden md:flex items-center justify-center w-2 cursor-col-resize bg-transparent relative flex-shrink-0 transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb,59,130,246),0.1)]"
          @mousedown="startResize"
          @touchstart="startResize"
          :class="{ 'bg-[rgba(var(--color-primary-rgb,59,130,246),0.2)]': isResizing }"
      >
        <div class="w-0.5 h-full rounded-sm transition-all duration-200 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent [background-size:100%_80%] [background-position:center]"
             :class="{ 
               'w-1 !bg-gradient-to-b !from-transparent !via-[var(--color-primary)] !to-transparent shadow-[0_0_12px_rgba(var(--color-primary-rgb,59,130,246),0.8)]': isResizing,
               'hover:w-[3px] hover:!bg-gradient-to-b hover:!from-transparent hover:!via-[var(--color-primary)] hover:!to-transparent hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb,59,130,246),0.5)]': !isResizing
             }">
        </div>
      </div>

      <!-- 作业信息（移动端在下，桌面端在右） -->
      <div class="bg-[var(--color-surface)] rounded-xl p-3 sm:p-4 md:p-6 shadow-lg overflow-y-auto overflow-x-hidden min-h-0 transition-colors duration-200 md:flex-shrink-0" :style="mobileOrDesktopStyle('homework')">
        <div class="flex justify-between items-center flex-wrap gap-2 m-0 p-0.5 mb-2 mt-2 mx-2 md:mb-4 md:mt-[1.125rem] md:ml-4 md:mr-0">
          <h2 class="text-2xl sm:text-[2rem] md:text-5xl font-bold text-[var(--color-primary)] m-0">{{ $t('homework.homeworkContent') }}</h2>
          <span class="text-xl sm:text-2xl md:text-4xl text-[var(--color-secondary)] md:mr-5">{{ selectedDateText }}</span>
        </div>
        <div class="mt-2 md:mt-6">
          <Homework :selected-date="selectedDate" :selected-cid="selectedCid" ref="homeworkComponent" :columns="1"/>
        </div>
      </div>
    </div>

    <footer v-if="!isFullscreen" class="bg-[var(--color-header-footer)] text-[var(--color-text-tertiary)] p-2 px-3 md:p-3 md:px-4 mt-auto transition-colors duration-200 border-t border-[var(--color-border)] rounded-md">
      <div class="flex justify-between items-center max-w-full gap-4 flex-wrap">
        <div class="flex-1 min-w-[200px]">
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AttendanceDisplay from '@/components/student/AttendanceDisplay.vue'
import Homework from '@/components/homework/homework.vue'
import Calendar from '@/components/common/calendar.vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LanguageToggle from '@/components/common/LanguageToggle.vue'
import FloatingCountdown from '@/components/common/FloatingCountdown.vue'
import FloatingSlogan from '@/components/common/FloatingSlogan.vue'
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
const studentsComponent = ref(null)
const homeworkComponent = ref(null)
const isFullscreen = ref(false)

// 班级相关
const selectedCid = ref(null)

// 可调整大小相关
const mainContentRef = ref(null)
const isResizing = ref(false)
const leftWidth = ref('40%')
const rightWidth = ref('calc(60% - 8px)') // 减去分隔条宽度
const leftPercentage = ref(40) // 保存左侧百分比

// 从 localStorage 加载保存的比例
const loadSavedRatio = () => {
  const saved = localStorage.getItem('edutrackly-cg8-5712-home-split-ratio')
  if (saved) {
    const ratio = parseFloat(saved)
    if (ratio >= 20 && ratio <= 80) {
      leftPercentage.value = ratio
      updateWidths(ratio)
    }
  }
}

// 更新宽度
const updateWidths = (percentage) => {
  leftPercentage.value = percentage
  leftWidth.value = `${percentage}%`
  rightWidth.value = `calc(${100 - percentage}% - 8px)` // 减去分隔条宽度

  // 保存到 localStorage
  localStorage.setItem('edutrackly-cg8-5712-home-split-ratio', percentage.toString())
}

// 移动端/桌面端样式切换
const mobileOrDesktopStyle = (section) => {
  // 移动端使用固定高度，桌面端使用百分比宽度
  if (section === 'attendance') {
    return {
      width: window.innerWidth < 768 ? '100%' : leftWidth.value,
      height: window.innerWidth < 768 ? '45%' : 'auto'
    }
  } else {
    return {
      width: window.innerWidth < 768 ? '100%' : rightWidth.value,
      height: window.innerWidth < 768 ? '55%' : 'auto'
    }
  }
}

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

// 开始调整大小
const startResize = (e) => {
  e.preventDefault()
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  const handleMove = (e) => {
    if (!isResizing.value || !mainContentRef.value) return

    const containerRect = mainContentRef.value.getBoundingClientRect()
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    const offsetX = clientX - containerRect.left
    const containerWidth = containerRect.width

    // 计算新的百分比
    let newPercentage = (offsetX / containerWidth) * 100

    // 限制范围在 20% - 80% 之间
    newPercentage = Math.max(20, Math.min(80, newPercentage))

    updateWidths(newPercentage)
  }

  const handleEnd = () => {
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('touchend', handleEnd)
}

// 监听班级变化刷新学生和作业
watch(selectedCid, (newCid) => {
  if (!newCid) return

  if (studentsComponent.value?.fetchAttendance) {
    studentsComponent.value.fetchAttendance()
  }
  if (homeworkComponent.value?.fetchHomework) {
    homeworkComponent.value.fetchHomework()
  }
}, { immediate: true })

onMounted(() => {
  updateDate()
  updateTime()
  setInterval(updateTime, 60000)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })

  // 加载保存的比例
  loadSavedRatio()

  // 检测微信浏览器并显示提示
  if (checkWechatBrowser() && !hasShownWechatTip()) {
    setTimeout(() => {
      notificationService.info($t('wechatTip.message'));
      sessionStorage.setItem('wechat-tip-shown', 'true')
    }, 1000) // 延迟1秒显示，避免干扰页面加载
  }
})

onUnmounted(() => {
  // 清理可能残留的样式
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
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
