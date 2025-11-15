<template>
  <div class="h-screen w-full bg-background flex flex-col p-2 sm:p-4 box-border overflow-hidden transition-[background-color] duration-200" @click="handleGlobalClick">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <!-- 第一行：日期和日历 -->
      <div class="top-bar-row">
        <div class="relative flex items-center gap-2 sm:gap-4 text-2xl font-semibold flex-1">
          <div class="flex flex-col sm:flex-row gap-1 sm:gap-4">
            <span class="date-text">{{ $t('common.today') }}：{{ todayDate }}</span>
            <span v-if="selectedDate && selectedDate !== todayDateInt" class="date-text selected-date">
              {{ $t('datetime.selectDate') }}：{{ formattedSelectedDate }}
            </span>
          </div>
          <div class="relative">
            <button @click.stop="showCalendar = !showCalendar" class="calendar-button">
            📅
            </button>
            <div v-if="showCalendar" class="calendar-popup" @click.stop>
              <Calendar mode="single" @select-date="onDateSelect" />
            </div>
          </div>
        </div>
        
        <!-- 移动端：时间显示在第一行右侧 -->
        <div class="time-display md:hidden">
          {{ currentTime }}
        </div>
      </div>

      <!-- 第二行：班级选择和操作按钮 -->
      <div class="top-bar-row">
        <!-- 替换原有班级选择为新组件 -->
        <ClassSwitch v-model:cid="selectedCid" class="flex-1 md:flex-initial" />

        <div class="flex items-center gap-2 sm:gap-3 md:gap-6">
          <LanguageToggle />
          <ThemeToggle />
          <!-- 桌面端：时间显示 -->
          <div class="time-display hidden md:block">
            {{ currentTime }}
          </div>
          <button @click.stop="toggleFullscreen" class="fullscreen-btn">
            <span class="hidden sm:inline">{{ isFullscreen ? $t('common.exitFullscreen') : $t('common.fullscreen') }}</span>
            <span class="sm:hidden">{{ isFullscreen ? '退出' : '全屏' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col md:flex-row gap-3 md:gap-0 min-h-0 py-2 mt-2" ref="mainContentRef">
      <!-- 考勤信息（移动端在上，桌面端在左） -->
      <div class="content-card" :style="mobileOrDesktopStyle('attendance')">
        <AttendanceDisplay ref="studentsComponent" :selected-date="selectedDate" :selected-cid="selectedCid" />
      </div>

      <!-- 可拖动分隔条（仅桌面端显示） -->
      <div
          class="resizer"
          @mousedown="startResize"
          @touchstart="startResize"
          :class="{ 'resizing': isResizing }"
      >
        <div class="resizer-line"></div>
      </div>

      <!-- 作业信息（移动端在下，桌面端在右） -->
      <div class="content-card" :style="mobileOrDesktopStyle('homework')">
        <div class="homework-header">
          <h2 class="homework-title">{{ $t('homework.homeworkContent') }}</h2>
          <span class="homework-date">{{ selectedDateText }}</span>
        </div>
        <div class="homework-content">
          <Homework :selected-date="selectedDate" :selected-cid="selectedCid" ref="homeworkComponent" :columns="1"/>
        </div>
      </div>
    </div>

    <footer v-if="!isFullscreen" class="footer">
      <div class="footer-content">
        <div class="copyright">
          <router-link to="/about" class="copyright-link">
            <p class="m-0 text-sm leading-6">© 2025 EduTrackly. All rights reserved.</p>
            <p class="license-text">Licensed under GNU General Public License v3.0</p>
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
import { formatYYYYMMDDToDate } from '@/utils/formatDate'

const { t: $t } = useI18n()

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
  const saved = localStorage.getItem('home-split-ratio')
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
  localStorage.setItem('home-split-ratio', percentage.toString())
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
})

onUnmounted(() => {
  // 清理可能残留的样式
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})
</script>

<style scoped>
/* 顶部栏 */
.top-bar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--color-header-footer);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  transition: background-color var(--transition-base);
}

@media (min-width: 768px) {
  .top-bar {
    padding: 1rem;
  }
}

/* 顶部栏行 */
.top-bar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .top-bar-row {
    gap: 1rem;
  }
}

/* 日历按钮 */
.calendar-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.calendar-button:hover {
  transform: scale(1.1);
}

@media (min-width: 768px) {
  .calendar-button {
    font-size: 2rem;
  }
}

/* 日期文本 */
.date-text {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--color-primary);
}

.selected-date {
  color: var(--color-secondary);
  font-size: 1rem;
}

@media (min-width: 640px) {
  .date-text {
    font-size: 1.5rem;
  }
  
  .selected-date {
    font-size: 1.25rem;
  }
}

@media (min-width: 768px) {
  .date-text {
    font-size: 3rem;
  }
  
  .selected-date {
    font-size: 2.5rem;
  }
}

/* 时间显示 */
.time-display {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-primary);
  white-space: nowrap;
}

@media (min-width: 640px) {
  .time-display {
    font-size: 2rem;
  }
}

@media (min-width: 768px) {
  .time-display {
    font-size: 3.75rem;
  }
}

/* 全屏按钮 */
.fullscreen-btn {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-border);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  white-space: nowrap;
}

.fullscreen-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-surface);
  border-color: var(--color-primary);
}

.fullscreen-btn:active {
  transform: scale(0.95);
}

@media (min-width: 640px) {
  .fullscreen-btn {
    padding: 0.5rem 1rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 768px) {
  .fullscreen-btn {
    padding: 1rem 2rem;
    font-size: 1.875rem;
  }
}

/* 日历弹出动画 */
.calendar-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  z-index: 1000;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 内容卡片 */
.content-card {
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  transition: background-color var(--transition-base);
}

@media (min-width: 640px) {
  .content-card {
    padding: 1rem;
  }
}

@media (min-width: 768px) {
  .content-card {
    flex-shrink: 0;
    padding: 1.5rem;
  }
}

/* 可拖动分隔条 */
.resizer {
  width: 8px;
  cursor: col-resize;
  background-color: transparent;
  position: relative;
  display: none;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

@media (min-width: 768px) {
  .resizer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.resizer:hover {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
}

.resizer.resizing {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.2);
}

.resizer-line {
  width: 2px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-border) 10%,
    var(--color-border) 90%,
    transparent 100%
  );
  transition: all 0.2s ease;
  border-radius: 1px;
}

.resizer:hover .resizer-line {
  width: 3px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-primary) 10%,
    var(--color-primary) 90%,
    transparent 100%
  );
  box-shadow: 0 0 8px rgba(var(--color-primary-rgb, 59, 130, 246), 0.5);
}

.resizer.resizing .resizer-line {
  width: 4px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-primary) 10%,
    var(--color-primary) 90%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(var(--color-primary-rgb, 59, 130, 246), 0.8);
}

/* 作业区域 */
.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0.125rem 0;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

@media (min-width: 768px) {
  .homework-header {
    margin-bottom: 1rem;
    margin-top: 1.125rem;
    margin-left: 1rem;
    margin-right: 0;
  }
}

.homework-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

@media (min-width: 640px) {
  .homework-title {
    font-size: 2rem;
  }
}

@media (min-width: 768px) {
  .homework-title {
    font-size: 3rem;
  }
}

.homework-date {
  font-size: 1.25rem;
  color: var(--color-secondary);
}

@media (min-width: 640px) {
  .homework-date {
    font-size: 1.5rem;
  }
}

@media (min-width: 768px) {
  .homework-date {
    font-size: 2.25rem;
    margin-right: 1.25rem;
  }
}

.homework-content {
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .homework-content {
    margin-top: 1.5rem;
  }
}

/* 页脚 */
.footer {
  background-color: var(--color-header-footer);
  color: var(--color-text-tertiary);
  padding: 0.5rem 0.75rem;
  margin-top: auto;
  transition: background-color var(--transition-base);
  border-top: 1px solid var(--color-border);
  border-radius: 0.375rem;
}

@media (min-width: 768px) {
  .footer {
    padding: 0.75rem 1rem;
  }
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  gap: 1rem;
  flex-wrap: wrap;
}

.copyright {
  flex: 1;
  min-width: 200px;
}

.copyright-link {
  text-decoration: none;
  color: var(--color-text-tertiary);
  transition: color 0.2s ease;
  display: block;
}

.copyright-link:hover {
  color: var(--color-primary);
}

.copyright p {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .copyright p {
    font-size: 0.875rem;
  }
}

.license-text {
  font-size: 0.625rem !important;
  opacity: 0.7;
  margin-top: 0.25rem !important;
}

@media (min-width: 768px) {
  .license-text {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 767px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .copyright {
    justify-content: center;
    min-width: 100%;
  }
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
