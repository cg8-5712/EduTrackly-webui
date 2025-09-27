<template>
  <div class="w-70 p-4 bg-gray-700 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <button @click="prevMonth" class="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-2 transition-colors duration-200 rounded-lg hover:text-white hover:bg-gray-600">&#8249;</button>
      <span class="text-gray-200 text-xl font-medium">{{ currentMonth }}</span>
      <button @click="nextMonth" class="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-2 transition-colors duration-200 rounded-lg hover:text-white hover:bg-gray-600">&#8250;</button>
    </div>
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        @click="selectDate(day)"
        :class="['flex items-center justify-center h-10 text-gray-200 cursor-pointer rounded-lg transition-all duration-200 text-lg hover:bg-gray-600', { 'bg-gray-500 text-white font-medium': isSelected(day) }]"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'single', // 默认模式为 'single'
  }
})

// ✅ 新增 emit
const emit = defineEmits(['select-date'])

const currentDate = ref(new Date())
const selectedDate = ref(null)
const startDate = ref(null)
const endDate = ref(null)

const prevMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(date.getDate())
    date.setDate(date.getDate() + 1)
  }
  return days
})

const currentMonth = computed(() => {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]
  return `${currentDate.value.getFullYear()}年 ${monthNames[currentDate.value.getMonth()]}`
})

// 切换模式
watch(() => props.mode, (newMode) => {
  if (newMode === 'single') {
    startDate.value = null
    endDate.value = null
  } else if (newMode === 'range') {
    selectedDate.value = null
  }
})

const selectDate = (day) => {
  const selected = new Date(currentDate.value)
  selected.setDate(day)

  if (props.mode === 'single') {
    selectedDate.value = formatDate(selected)
    emit('select-date', selectedDate.value)   // ✅ 通知父组件
  } else if (props.mode === 'range') {
    if (!startDate.value) {
      startDate.value = formatDate(selected)
    } else if (!endDate.value) {
      endDate.value = formatDate(selected)

      // 检查结束日期是否小于开始日期
      if (endDate.value < startDate.value) {
        startDate.value = null
        endDate.value = null
      } else {
        emit('select-date', { start: startDate.value, end: endDate.value }) // ✅ 抛给父组件
      }
    } else {
      startDate.value = formatDate(selected)
      endDate.value = null
    }
  }
}

// 格式化日期为 YYYYMMDD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}${month}${day}`
}

// 添加判断选中日期的方法
const isSelected = (day) => {
  const date = new Date(currentDate.value)
  date.setDate(day)
  return selectedDate.value === formatDate(date)
}
</script>

<style scoped>
</style>
