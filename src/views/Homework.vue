<template>
  <div class="homework-page" @click="handleGlobalClick">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <!-- 第一行：日期和日历 -->
      <div class="top-bar-row">
        <div class="date-section">
          <div class="date-display">
            <span class="date-text">{{ $t('common.today') }}：{{ todayDate }}</span>
            <span v-if="selectedDate && selectedDate !== todayDateInt" class="date-text-selected">
              {{ $t('datetime.selectDate') }}：{{ formattedSelectedDate }}
            </span>
          </div>
          <button @click="showCalendar = !showCalendar" class="calendar-button">
            📅
          </button>
          <div v-if="showCalendar" class="calendar-popup">
            <Calendar mode="single" @select-date="onDateSelect" />
          </div>
        </div>
        
        <!-- 移动端：时间显示在第一行右侧 -->
        <div class="time-display md:hidden">{{ currentTime }}</div>
      </div>

      <!-- 第二行：班级选择和操作按钮 -->
      <div class="top-bar-row">
        <!-- 替换原有班级选择为新组件 -->
        <ClassSwitch v-model:cid="selectedCid" class="flex-1 md:flex-initial" />

        <div class="action-section">
          <LanguageToggle />
          <ThemeToggle />
          <!-- 桌面端：时间显示 -->
          <div class="time-display hidden md:block">{{ currentTime }}</div>
          <button @click.stop="toggleFullscreen" class="fullscreen-button">
            <span class="hidden sm:inline">{{ isFullscreen ? $t('common.exitFullscreen') : $t('common.fullscreen') }}</span>
            <span class="sm:hidden">{{ isFullscreen ? '退出' : '全屏' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 右侧作业信息 -->
      <div class="homework-container">
        <div class="homework-header">
          <h2 class="homework-title">{{ $t('homework.homeworkContent') }}</h2>
          <span class="homework-date">{{ selectedDateText }}</span>
        </div>
        <Homework
            :selected-date="selectedDate"
            :selected-cid="selectedCid"
            :columns="2"
        />
      </div>
    </div>

    <footer v-if="!isFullscreen" class="footer">
      <div class="footer-content">
        <div class="copyright">
          <router-link to="/about" class="copyright-link">
            <p>© 2025 EduTrackly. All rights reserved.</p>
            <p class="license-text">Licensed under GNU General Public License v3.0</p>
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
import VersionInfo from '@/components/VersionInfo.vue'
import { formatYYYYMMDDToDate } from '@/utils/formatDate'

const { t: $t } = useI18n()

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
})
</script>

<style scoped>
.homework-page {
  height: 100vh;
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
  transition: background-color var(--transition-base), color var(--transition-base);
}

@media (min-width: 768px) {
  .homework-page {
    padding: 1rem;
  }
}

.top-bar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  transition: background-color var(--transition-base);
}

@media (min-width: 768px) {
  .top-bar {
    padding: 1rem;
    padding-top: 2rem;
  }
}

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

.date-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

@media (min-width: 768px) {
  .date-section {
    gap: 1rem;
    font-size: 2.25rem;
  }
}

.date-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (min-width: 768px) {
  .date-display {
    gap: 0.5rem;
  }
}

.date-text {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--color-primary);
  transition: color var(--transition-base);
}

.date-text-selected {
  color: var(--color-secondary);
  font-size: 1rem;
  transition: color var(--transition-base);
}

@media (min-width: 640px) {
  .date-text {
    font-size: 1.875rem;
  }
  
  .date-text-selected {
    font-size: 1.5rem;
  }
}

@media (min-width: 768px) {
  .date-text {
    font-size: 3rem;
  }
  
  .date-text-selected {
    font-size: 2.5rem;
  }
}

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
    font-size: 3rem;
  }
}

.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  z-index: 50;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  transition: background-color var(--transition-base);
}

.action-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .action-section {
    gap: 1rem;
  }
}

@media (min-width: 768px) {
  .action-section {
    gap: 1.5rem;
  }
}

.time-display {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-primary);
  transition: color var(--transition-base);
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

.fullscreen-button {
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

.fullscreen-button:hover {
  background-color: var(--color-primary);
  color: var(--color-surface);
}

@media (min-width: 640px) {
  .fullscreen-button {
    padding: 0.5rem 1rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 768px) {
  .fullscreen-button {
    padding: 1rem 2rem;
    font-size: 1.875rem;
  }
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  min-height: 0;
  padding: 0.25rem 0;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .main-content {
    gap: 1rem;
    padding: 0.5rem 0;
  }
}

.homework-container {
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
  .homework-container {
    padding: 1rem;
  }
}

@media (min-width: 768px) {
  .homework-container {
    padding: 1.5rem;
  }
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0.25rem 0;
}

.homework-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
  transition: color var(--transition-base);
}

@media (min-width: 640px) {
  .homework-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 768px) {
  .homework-title {
    font-size: 3.75rem;
  }
}

.homework-date {
  font-size: 1.25rem;
  color: var(--color-secondary);
  transition: color var(--transition-base);
}

@media (min-width: 640px) {
  .homework-date {
    font-size: 1.875rem;
  }
}

@media (min-width: 768px) {
  .homework-date {
    font-size: 3rem;
  }
}

.footer {
  background-color: var(--color-surface);
  color: var(--color-text-tertiary);
  padding: 0.5rem 0.75rem;
  margin-top: auto;
  transition: background-color var(--transition-base);
  border-top: 1px solid var(--color-border);
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

.version-info-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 200px;
}

.team-info {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  min-width: 200px;
}

.team-link {
  color: var(--color-text-tertiary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.team-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

@media (max-width: 767px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .copyright,
  .version-info-wrapper,
  .team-info {
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

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
