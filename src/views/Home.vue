<template>
  <div class="home-container" @click="handleGlobalClick">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="date-section">
        <div class="date-display">
          <span class="date-text">今日：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="date-text selected-date">
            选中：{{ formattedSelectedDate }}
          </span>
        </div>
        <div class="calendar-wrapper">
          <button @click="showCalendar = !showCalendar" class="calendar-btn">
            📅
          </button>
          <div v-if="showCalendar" class="calendar-popup">
            <Calendar mode="single" @select-date="onDateSelect" />
          </div>
        </div>
      </div>

      <!-- 替换原有班级选择为新组件 -->
      <ClassSwitch v-model:cid="selectedCid" />

      <div class="action-bar">
        <ThemeToggle />
        <div class="time-display">
          {{ currentTime }}
        </div>
        <button @click.stop="toggleFullscreen" class="fullscreen-btn">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧考勤信息 -->
      <div class="content-card">
        <AttendanceDisplay ref="studentsComponent" :selected-date="selectedDate" :selected-cid="selectedCid" />
      </div>

      <!-- 右侧作业信息 -->
      <div class="content-card">
        <div class="homework-header">
          <h2 class="homework-title">作业内容</h2>
          <span class="homework-date">{{ selectedDateText }}</span>
        </div>
        <div class="homework-content">
          <Homework :selected-date="selectedDate" :selected-cid="selectedCid" ref="homeworkComponent" :columns="1"/>
        </div>
      </div>
    </div>

    <footer v-if="!isFullscreen" class="footer">
      <p>© 2024 Edutrackly. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import AttendanceDisplay from '@/components/student/AttendanceDisplay.vue'
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
const studentsComponent = ref(null)
const homeworkComponent = ref(null)
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
  if (showCalendar.value && !event.target.closest('.calendar-popup') && !event.target.closest('.calendar-btn')) {
    showCalendar.value = false
  }
}

// 监听班级变化刷新学生和作业
watch(selectedCid, (newCid) => {
  if (!newCid) return
  
  const cid = Number(newCid)
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
})
</script>

<style scoped>
/* 容器样式 */
.home-container {
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

/* 顶部栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  transition: background-color var(--transition-base);
}

/* 日期区域 */
.date-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.date-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .date-display {
    flex-direction: row;
    gap: 1rem;
  }
}

.date-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
}

.selected-date {
  color: var(--color-secondary);
}

@media (min-width: 640px) {
  .date-text {
    font-size: 1.875rem;
  }
}

@media (min-width: 768px) {
  .date-text {
    font-size: 3rem;
  }
}

/* 日历按钮 */
.calendar-wrapper {
  position: relative;
}

.calendar-btn {
  font-size: 2.25rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
}

.calendar-btn:hover {
  transform: scale(1.1);
}

.calendar-btn:active {
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .calendar-btn {
    font-size: 3rem;
  }
}

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

/* 操作栏 */
.action-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .action-bar {
    gap: 1.5rem;
  }
}

.time-display {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--color-primary);
}

@media (min-width: 640px) {
  .time-display {
    font-size: 3rem;
  }
}

@media (min-width: 768px) {
  .time-display {
    font-size: 3.75rem;
  }
}

.fullscreen-btn {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
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
    padding: 1rem 2rem;
    font-size: 1.5rem;
  }
}

@media (min-width: 768px) {
  .fullscreen-btn {
    font-size: 1.875rem;
  }
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  min-height: 0;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .main-content {
    grid-template-columns: 0.8fr 1.2fr;
  }
}

.content-card {
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  transition: background-color var(--transition-base);
}

/* 作业区域 */
.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0.125rem 0;
  margin-bottom: 1rem;
  margin-top: 1.125rem;
  margin-left: 1rem;
}

.homework-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

@media (min-width: 768px) {
  .homework-title {
    font-size: 3rem;
  }
}

.homework-date {
  font-size: 1.875rem;
  color: var(--color-secondary);
  margin-right: 1.25rem;
}

@media (min-width: 768px) {
  .homework-date {
    font-size: 2.25rem;
  }
}

.homework-content {
  margin-top: 1.5rem;
}

/* 页脚 */
.footer {
  text-align: center;
  background-color: var(--color-surface);
  color: var(--color-text-tertiary);
  padding: 0.75rem 0.5rem;
  font-size: 1.125rem;
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
</style>