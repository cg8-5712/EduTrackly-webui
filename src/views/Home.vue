<template>
  <div class="h-screen w-full bg-gray-900 text-gray-200 flex flex-col p-4 box-border overflow-hidden" @click="handleGlobalClick">
    <!-- 顶部栏 -->
    <div class="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow-lg">
      <div class="relative flex items-center gap-4 text-2xl font-semibold text-blue-300">
        <div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <span class="text-2xl sm:text-3xl md:text-5xl font-bold">今日：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-400">
            选中：{{ formattedSelectedDate }}
          </span>
        </div>
        <div class="relative">
          <button @click="showCalendar = !showCalendar" class="calendar-btn text-4xl md:text-5xl p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95 border-0 bg-transparent cursor-pointer">
            📅
          </button>
          <div v-if="showCalendar" class="calendar-popup absolute top-full right-0 mt-2 z-[1000] bg-gray-800 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <Calendar mode="single" @select-date="onDateSelect" />
          </div>
        </div>
      </div>

      <!-- 替换原有班级选择为新组件 -->
      <ClassSwitch v-model:cid="selectedCid" />

      <div class="flex items-center gap-3 sm:gap-6">
        <div class="text-3xl sm:text-5xl md:text-6xl font-black text-blue-300 font-[inherit]">
          {{ currentTime }}
        </div>
        <button @click.stop="toggleFullscreen" class="bg-gray-700 text-blue-300 border-0 px-4 sm:px-8 py-2 sm:py-4 rounded-lg text-lg sm:text-2xl md:text-3xl cursor-pointer transition-all duration-200 hover:bg-gray-600 active:scale-95">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-4 min-h-0 py-2 mt-2">
      <!-- 左侧考勤信息 -->
      <div class="bg-gray-800 rounded-xl p-6 shadow-lg overflow-y-auto overflow-x-hidden min-h-0">
        <AttendanceDisplay ref="studentsComponent" :selected-date="selectedDate" :selected-cid="selectedCid" />
      </div>

      <!-- 右侧作业信息 -->
      <div class="bg-gray-800 rounded-xl p-1 px-2.5 pb-4 shadow-lg overflow-y-auto overflow-x-hidden min-h-0">
        <div class="flex justify-between items-center m-0 py-0.5 mb-4 mt-4.5 ml-4">
          <h2 class="text-4xl md:text-5xl font-bold text-blue-300 m-0">作业内容</h2>
          <span class="text-3xl md:text-4xl text-blue-400 mr-5">{{ selectedDateText }}</span>
        </div>
        <div class="mt-6">
          <Homework :selected-date="selectedDate" :selected-cid="selectedCid" ref="homeworkComponent" :columns="1"/>
        </div>
      </div>
    </div>

    <footer v-if="!isFullscreen" class="text-center bg-gray-800 text-gray-500 py-3 px-2 text-lg mt-auto">
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

<style>
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
</style>