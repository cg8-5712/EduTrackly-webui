<template>
  <div class="homework-page" @click="handleGlobalClick">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="date-section">
        <div class="date-display">
          <span class="date-text">今日：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="date-text-selected">
            选中：{{ formattedSelectedDate }}
          </span>
        </div>
        <button @click="showCalendar = !showCalendar" class="calendar-button">
          📅
        </button>
        <div v-if="showCalendar" class="calendar-popup">
          <Calendar mode="single" @select-date="onDateSelect" />
        </div>
      </div>

      <!-- 替换原有班级选择为新组件 -->
      <ClassSwitch v-model:cid="selectedCid" />

      <div class="action-section">
        <ThemeToggle />
        <div class="time-display">{{ currentTime }}</div>
        <button @click.stop="toggleFullscreen" class="fullscreen-button">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 右侧作业信息 -->
      <div class="homework-container">
        <div class="homework-header">
          <h2 class="homework-title">作业内容</h2>
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
      <p>© 2024 Edutrackly. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Homework from '@/components/homework/homework.vue'
import Calendar from '@/components/common/calendar.vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { formatYYYYMMDDToDate } from '@/utils/formatDate'

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
    return formattedSelectedDate.value + '作业'
  }
  return '今日作业'
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
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  padding-top: 2rem;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  transition: background-color var(--transition-base);
}

.date-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.date-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-text {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-primary);
  transition: color var(--transition-base);
}

.date-text-selected {
  color: var(--color-secondary);
  font-size: 2.5rem;
  transition: color var(--transition-base);
}

.calendar-button {
  background: transparent;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.calendar-button:hover {
  transform: scale(1.1);
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
  gap: 1.5rem;
}

.time-display {
  font-size: 3.75rem;
  font-weight: 900;
  color: var(--color-primary);
  transition: color var(--transition-base);
}

.fullscreen-button {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-border);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.875rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.fullscreen-button:hover {
  background-color: var(--color-primary);
  color: var(--color-surface);
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  min-height: 0;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.homework-container {
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  transition: background-color var(--transition-base);
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0.25rem 0;
}

.homework-title {
  font-size: 3.75rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
  transition: color var(--transition-base);
}

.homework-date {
  font-size: 3rem;
  color: var(--color-secondary);
  transition: color var(--transition-base);
}

.footer {
  text-align: center;
  background-color: var(--color-surface);
  color: var(--color-text-tertiary);
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  margin-top: auto;
  transition: background-color var(--transition-base);
}

.footer p {
  margin: 0;
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
