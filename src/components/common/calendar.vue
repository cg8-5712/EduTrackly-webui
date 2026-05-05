<template>
  <div class="w-80 rounded-[1.6rem] border border-white/8 bg-[var(--panel-strong)] p-4 shadow-[var(--shadow-panel)] backdrop-blur-xl">
    <div class="mb-4 flex items-center justify-between">
      <button
        @click="prevMonth"
        class="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xl text-[var(--color-text-secondary)] transition-colors hover:bg-white/8 hover:text-foreground"
      >
        &#8249;
      </button>
      <span class="text-lg font-semibold text-foreground">{{ currentMonth }}</span>
      <button
        @click="nextMonth"
        class="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xl text-[var(--color-text-secondary)] transition-colors hover:bg-white/8 hover:text-foreground"
      >
        &#8250;
      </button>
    </div>

    <div class="mb-3 grid grid-cols-7 gap-2">
      <div
        v-for="weekday in weekdays"
        :key="weekday"
        class="flex h-10 items-center justify-center text-sm font-medium text-[var(--color-text-tertiary)]"
      >
        {{ weekday }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <div v-for="blank in blanksAtStart" :key="`blank-${blank}`" class="h-11" />

      <button
        v-for="(day, index) in daysInMonth"
        :key="`day-${index}`"
        type="button"
        @click="selectDate(day)"
        class="flex h-11 items-center justify-center rounded-xl text-base transition-colors"
        :class="getDayClass(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"

const props = defineProps({
  mode: {
    type: String,
    default: "single",
  },
  allowFuture: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["select-date"])

const currentDate = ref(new Date())
const selectedDate = ref(null)
const startDate = ref(null)
const endDate = ref(null)

const weekdays = ["日", "一", "二", "三", "四", "五", "六"]

function prevMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

function nextMonth() {
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

const blanksAtStart = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  return firstDay.getDay()
})

const currentMonth = computed(() => {
  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ]

  return `${currentDate.value.getFullYear()}年 ${monthNames[currentDate.value.getMonth()]}`
})

watch(
  () => props.mode,
  (newMode) => {
    if (newMode === "single") {
      startDate.value = null
      endDate.value = null
    } else if (newMode === "range") {
      selectedDate.value = null
    }
  }
)

function selectDate(day) {
  if (!props.allowFuture && isFutureDate(day)) {
    return
  }

  const selected = new Date(currentDate.value)
  selected.setDate(day)

  if (props.mode === "single") {
    selectedDate.value = formatDate(selected)
    emit("select-date", selectedDate.value)
    return
  }

  if (!startDate.value) {
    startDate.value = formatDate(selected)
    return
  }

  if (!endDate.value) {
    endDate.value = formatDate(selected)

    if (endDate.value < startDate.value) {
      startDate.value = null
      endDate.value = null
      return
    }

    emit("select-date", { start: startDate.value, end: endDate.value })
    return
  }

  startDate.value = formatDate(selected)
  endDate.value = null
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

function isFutureDate(day) {
  const today = new Date()
  const currentYear = currentDate.value.getFullYear()
  const currentMonth = currentDate.value.getMonth()
  const dateToCheck = new Date(currentYear, currentMonth, day)
  const todayEnd = new Date(today)

  todayEnd.setHours(23, 59, 59, 999)

  return dateToCheck > todayEnd
}

function isSelected(day) {
  const date = new Date(currentDate.value)
  date.setDate(day)
  return selectedDate.value === formatDate(date)
}

function isToday(day) {
  const today = new Date()
  const currentYear = currentDate.value.getFullYear()
  const currentMonth = currentDate.value.getMonth()

  return (
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day
  )
}

function getDayClass(day) {
  if (isSelected(day)) {
    return "bg-[rgba(var(--color-primary-rgb),0.2)] text-foreground"
  }

  if (isToday(day)) {
    return "border border-[rgba(var(--color-secondary-rgb),0.35)] bg-[rgba(var(--color-secondary-rgb),0.16)] text-foreground"
  }

  if (!props.allowFuture && isFutureDate(day)) {
    return "cursor-not-allowed bg-white/2 text-[var(--color-text-tertiary)] opacity-50"
  }

  return "border border-transparent bg-white/4 text-[var(--color-text-secondary)] hover:bg-white/8 hover:text-foreground"
}
</script>
