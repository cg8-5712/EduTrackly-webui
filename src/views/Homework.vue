<template>
  <div class="h-screen w-full bg-gray-900 text-gray-200 flex flex-col p-4 box-border overflow-hidden" @click="handleGlobalClick">
    <!-- 顶部栏 -->
    <div class="flex justify-between items-center p-4 pt-8 bg-gray-700 rounded-xl shadow-lg">
      <div class="relative flex items-center gap-4 text-4xl font-semibold text-blue-200">
        <div class="flex flex-col gap-2">
          <span class="text-5xl font-bold">今日：{{ todayDate }}</span>
          <span v-if="selectedDate && selectedDate !== todayDateInt" class="text-blue-400">
            选中：{{ formattedSelectedDate }}
          </span>
        </div>
        <button @click="showCalendar = !showCalendar" class="bg-transparent border-none text-5xl cursor-pointer p-1 rounded transition-transform duration-200 hover:scale-110">
          📅
        </button>
        <div v-if="showCalendar" class="absolute top-full left-0 mt-2 z-50">
          <Calendar mode="single" @select-date="onDateSelect" />
        </div>
      </div>

      <!-- 替换原有班级选择为新组件 -->
      <ClassSwitch v-model:cid="selectedCid" />

      <div class="flex items-center gap-6">
        <div class="text-6xl font-black text-blue-200 font-inherit">{{ currentTime }}</div>
        <button @click.stop="toggleFullscreen" class="bg-gray-600 text-blue-200 border-none p-4 px-8 rounded-lg text-3xl cursor-pointer transition-colors duration-200 hover:bg-gray-500">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 grid grid-cols-1 gap-4 min-h-0 py-2 mt-2">
      <!-- 右侧作业信息 -->
      <div class="bg-gray-700 rounded-xl p-6 shadow-lg overflow-y-auto overflow-x-hidden min-h-0">
        <div class="flex justify-between items-center m-0 py-1">
          <h2 class="text-6xl font-bold text-blue-200 m-0">作业内容</h2>
          <span class="text-5xl text-blue-400">{{ selectedDateText }}</span>
        </div>
        <Homework
            :selected-date="selectedDate"
            :selected-cid="selectedCid"
            :columns="2"
        />
      </div>
    </div>

    <footer v-if="!isFullscreen" class="text-center bg-gray-700 text-gray-500 py-1 px-2 text-xl mt-auto">
      <p>© 2024 Edutrackly. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Homework from '@/components/homework/homework.vue'
import Calendar from '@/components/common/calendar.vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
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
  if (showCalendar.value && !event.target.closest('.calendar-popup') && !event.target.closest('.calendar-btn')) {
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

  .right-panel {
    max-height: 45vh;
  }
}
</style>