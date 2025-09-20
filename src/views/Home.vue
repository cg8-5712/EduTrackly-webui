<template>
  <div class="home-container" @click="handleGlobalClick">
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

      <!-- 替换原有班级选择为新组件 -->
      <ClassSwitch v-model:cid="selectedCid" />

      <div class="controls">
        <div class="current-time">{{ currentTime }}</div>
        <button @click.stop="toggleFullscreen" class="fullscreen-btn">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧考勤信息 -->
      <div class="left-panel">
        <students ref="studentsComponent" :selected-date="selectedDate" :selected-cid="selectedCid" />
      </div>

      <!-- 右侧作业信息 -->
      <div class="right-panel">
        <div class="homework-header">
          <h2 class="homework-title">作业内容</h2>
          <span class="selected-date">{{ selectedDateText }}</span>
        </div>
        <Homework :selected-date="selectedDate" :selected-cid="selectedCid" ref="homeworkComponent" :columns="1"/>
      </div>
    </div>

    <footer v-if="!isFullscreen" class="footer">
      <p>© 2024 Edutrackly. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import students from '@/components/student/students.vue'
import Homework from '@/components/homework/homework.vue'
import Calendar from '@/components/common/calendar.vue'
import ClassSwitch from '@/components/common/ClasssWitch.vue'
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
/* 基础样式重置 */
html, body {
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  overflow: hidden;
}

.home-container {
  height: 100vh;
  width: 100%;
  background-color: #1a1a1a;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* -------- 原有样式保持不变 -------- */
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
  font-size: 2.5rem;
  font-weight: 700;
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
  font-size: 2.5rem;
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
  font-size: 3.7rem;
  font-weight: bolder;
  color: #9ed2ff;
  font-family: inherit;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.fullscreen-btn {
  background: #3a3a3a;
  color: #9ed2ff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.fullscreen-btn:hover {
  background: #4a4a4a;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 1rem;
  min-height: 0; /* 关键：允许内容收缩 */
  padding: 0.5rem 0 0.5rem 0; /* 添加上边距 */
  margin-top: 0.5rem; /* 增加与顶部的距离 */
}

.left-panel {
  background-color: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* 关键：允许内容收缩 */
}

.right-panel {
  background-color: #2d2d2d;
  border-radius: 12px;
  padding: 0.2rem 0.6rem 1rem; /* 上0.5rem，左右1rem，下1rem */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* 关键：允许内容收缩 */
}


.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;          /* 清掉外边距 */
  padding: 0.1rem 0; /* 缩小上下内边距 */
}

.homework-header > * {
  margin: 0;          /* 去掉子元素的默认 margin（尤其是 h1、h2、p） */
}

.homework-title {
  font-size: 3rem;
  font-weight: 700;
  color: #9ed2ff;
}

.selected-date {
  font-size: 2.5rem;
  color: #7eb3db;
}

.footer {
  text-align: center;
  background: #2d2d2d;
  color: #666;
  padding: 0.25rem 0.5rem;
  font-size: 1.2rem;
  margin-top: auto;
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

  .left-panel, .right-panel {
    max-height: 45vh;
  }
}
</style>