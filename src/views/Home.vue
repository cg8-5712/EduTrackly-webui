<template>
  <div class="home-container">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="date-info">
        <div class="date-display">
          <span class="current-date">今日：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="selected-date-top">
            选中：{{ formattedSelectedDate }}
          </span>
        </div>
        <button @click="showCalendar = !showCalendar" class="calendar-btn">
          📅
        </button>
        <div v-if="showCalendar" class="calendar-popup">
          <Calendar mode="single" @select-date="onDateSelect" />
        </div>
      </div>
      <div class="current-time">{{ currentTime }}</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧考勤信息 -->
      <div class="left-panel">
        <students ref="studentsComponent" :selected-date="selectedDate" />
      </div>

      <!-- 右侧作业信息 -->
      <div class="right-panel">
        <div class="homework-header">
          <h2 class="homework-title">作业内容</h2>
          <span class="selected-date">{{ selectedDateText }}</span>
        </div>
        <Homework :selected-date="selectedDate" ref="homeworkComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import students from '@/components/student/students.vue'
import Homework from '@/components/homework/homework.vue'
import Calendar from '@/components/common/calendar.vue'
import formatYYYYMMDDToDate from '@/utils/formatDate'

const currentTime = ref('')
const todayDate = ref('')
const todayDateInt = ref('')
const showCalendar = ref(false)
const selectedDate = ref(null)
const studentsComponent = ref(null)
const homeworkComponent = ref(null)

// 计算属性：格式化选中的日期
const formattedSelectedDate = computed(() => {
  if (selectedDate.value) {
    return formatYYYYMMDDToDate(parseInt(selectedDate.value))
  }
  return ''
})

// 计算属性：作业标题日期显示
const selectedDateText = computed(() => {
  if (selectedDate.value && selectedDate.value !== todayDateInt.value) {
    return formattedSelectedDate.value + '作业'
  }
  return '今日作业'
})

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

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

const onDateSelect = (date) => {
  selectedDate.value = date
  showCalendar.value = false
}

onMounted(() => {
  updateDate()
  updateTime()
  setInterval(updateTime, 60000)
})
</script>

<style scoped>
/* 保留原有样式，添加新样式 */
.date-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.current-date, .selected-date-top {
  font-size: 1.5rem;
  font-weight: 600;
}

.selected-date-top {
  color: #7eb3db;
}

.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  z-index: 1000;
  background: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .date-display {
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .current-date, .selected-date-top {
    font-size: 1.25rem;
  }
}

.home-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.date-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #9ed2ff;
}

.calendar-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: transform 0.2s;
}

.calendar-btn:hover {
  transform: scale(1.1);
}

.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  z-index: 1000;
}

.current-time {
  font-size: 2rem;
  font-weight: bold;
  color: #9ed2ff;
  font-family: monospace;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
}

.left-panel, .right-panel {
  background-color: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  max-height: calc(100vh - 140px);
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.homework-title {
  font-size: 2rem;
  font-weight: 600;
  color: #9ed2ff;
}

.selected-date {
  font-size: 1.5rem;
  color: #7eb3db;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a5a5a;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .date-info, .current-time {
    font-size: 1.25rem;
  }

  .homework-title {
    font-size: 1.5rem;
  }

  .selected-date {
    font-size: 1.25rem;
  }
}
</style>