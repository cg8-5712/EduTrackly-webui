<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth" class="nav-btn">&#8249;</button>
      <span class="month-text">{{ currentMonth }}</span>
      <button @click="nextMonth" class="nav-btn">&#8250;</button>
    </div>
    <div class="calendar-days">
      <div 
        v-for="(day, index) in daysInMonth" 
        :key="index" 
        @click="selectDate(day)"
        :class="['day', { 'selected': isSelected(day) }]"
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
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
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
.calendar-container {
  width: 280px;
  padding: 1rem;
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-btn {
  background: none;
  border: none;
  color: #a8a8a8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  border-radius: 8px;
}

.nav-btn:hover {
  color: #ffffff;
  background-color: #3d3d3d;
}

.month-text {
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 500;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  color: #e0e0e0;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 1.1rem;
}

.day:hover {
  background-color: #3d3d3d;
}

.day.selected {
  background-color: #808080;
  color: #ffffff;
  font-weight: 500;
}
</style>
