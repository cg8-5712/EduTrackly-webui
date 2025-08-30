<template>
  <div class="calendar-container">
    <!-- 显示当前月份的日历 -->
    <div class="calendar-header">
      <button @click="prevMonth">&#8249;</button>
      <span>{{ currentMonth }}</span>
      <button @click="nextMonth">&#8250;</button>
    </div>
    <div class="calendar-days">
      <div class="day" v-for="(day, index) in daysInMonth" :key="index" @click="selectDate(day)">
        {{ day }}
      </div>
    </div>

    <!-- 显示选择的日期 -->
    <div v-if="mode === 'single'">
      <p>选择的日期: {{ selectedDate ? selectedDate : '无' }}</p>
    </div>
    <div v-if="mode === 'range'">
      <p>开始日期: {{ startDate ? startDate : '无' }}</p>
      <p>结束日期: {{ endDate ? endDate : '无' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    default: 'single', // 默认模式为 'single'
  }
});

const currentDate = ref(new Date());
const selectedDate = ref(null);
const startDate = ref(null);
const endDate = ref(null);

const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
};

const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
};

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
});

const currentMonth = computed(() => {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  return `${currentDate.value.getFullYear()}年 ${monthNames[currentDate.value.getMonth()]}`;
});

// 切换模式（单一日期或时间段选择）
watch(() => props.mode, (newMode) => {
  if (newMode === 'single') {
    startDate.value = null;
    endDate.value = null;
  } else if (newMode === 'range') {
    selectedDate.value = null;
  }
});

const selectDate = (day) => {
  const selected = new Date(currentDate.value);
  selected.setDate(day);

  if (props.mode === 'single') {
    selectedDate.value = formatDate(selected);
  } else if (props.mode === 'range') {
    if (!startDate.value) {
      startDate.value = formatDate(selected);
    } else if (!endDate.value) {
      endDate.value = formatDate(selected);

      // 检查结束日期是否小于开始日期，如果是，则清空
      console.log(new Date(endDate.value), startDate.value);
      console.log(new Date(endDate.value) < startDate.value);

      if (endDate.value < startDate.value) {
        startDate.value = null;
        endDate.value = null;
      }
    } else {
      // 如果已经选择了开始和结束日期，再次点击则清除之前的选择
      startDate.value = formatDate(selected);
      endDate.value = null;
    }
  }
};

// 格式化日期为 YYYYMMDD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
};
</script>

<style scoped>
.calendar-container {
  max-width: 280px;
  margin: auto;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 10px;
}

.day {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.day:hover {
  background-color: #ddd;
}

p {
  margin: 5px 0;
  text-align: center;
}

.tooltip {
  position: absolute;
  top: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
