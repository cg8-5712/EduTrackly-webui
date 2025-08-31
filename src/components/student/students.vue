<template>
  <div class="p-4">
    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <!-- 展示出勤数据 -->
    <div v-else-if="attendance.class_name" class="space-y-4">
      <div class="attendance-stats">
        <div class="stat">
          <span class="font-bold">应到：</span>{{ attendance.expected_attend }}人
        </div>
        <div class="stat">
          <span class="font-bold">实到：</span>{{ attendance.actual_attend }}人
        </div>
      </div>

      <!-- 请假名单 -->
      <div v-if="hasAbsentStudents" class="attendance-details">
        <h3 class="text-lg font-semibold">请假名单：</h3>
        <ul>
          <li v-for="(event, index) in absentStudents"
              :key="index"
              class="event-item">
            <span class="student-name"
                  @mouseover="showReason(event, index)"
                  @mouseleave="hideReason">
              {{ event.student_name }}
              <span v-if="showTooltip && currentEventId === index" class="tooltip">
                {{ getEventTypeText(event.event_type) }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <!-- 临时参加名单 -->
      <div v-if="tempStudents.length > 0" class="attendance-details">
        <h3 class="text-lg font-semibold">临时参加名单：</h3>
        <ul>
          <li v-for="(event, index) in tempStudents" :key="index" class="event-item">
            {{ event.student_name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 没有数据 -->
    <div v-else class="text-gray-400">
      暂无出勤信息
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AttendanceService from '@/services/basic/analysis'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// 接收外部传入的日期 (YYYYMMDD)
const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  }
})

const attendance = ref({
  class_name: '',
  expected_attend: 0,
  actual_attend: 0,
  event_list: [],
  personal_cnt: 0,
  temp_cnt: 0
})

const loading = ref(true)
const error = ref(null)
const showTooltip = ref(false)
const currentEventId = ref(null)

// 获取请假学生列表
const absentStudents = computed(() => {
  return attendance.value.event_list.filter(event =>
      ['personal', 'official', 'sick'].includes(event.event_type)
  )
})

// 获取临时参加学生列表
const tempStudents = computed(() => {
  return attendance.value.event_list.filter(event =>
      event.event_type === 'temp'
  )
})

const hasAbsentStudents = computed(() => absentStudents.value.length > 0)

// 请假类型转换
const getEventTypeText = (type) => {
  const typeMap = {
    'personal': '事假',
    'official': '公假',
    'sick': '病假'
  }
  return typeMap[type] || type
}

// 封装请求函数
const fetchAttendance = async () => {
  loading.value = true
  try {
    const res = props.selectedDate
        ? await AttendanceService.getAnalysisByDate(1, props.selectedDate)
        : await AttendanceService.getTodayAnalysis(1)

    if (res.data?.data) {
      attendance.value = res.data.data
    }
  } catch (err) {
    error.value = err.message || '获取出勤信息失败'
  } finally {
    loading.value = false
  }
}

// 监听 props.selectedDate 变化，首次挂载立即执行
watch(() => props.selectedDate, async () => {
  await fetchAttendance()
}, { immediate: true })

const showReason = (event, index) => {
  if (['personal', 'official', 'sick'].includes(event.event_type)) {
    showTooltip.value = true
    currentEventId.value = index
  }
}

const hideReason = () => {
  showTooltip.value = false
  currentEventId.value = null
}
</script>

<style scoped>
.attendance-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
}

.attendance-details ul {
  list-style: none;
  padding-left: 0;
}

.event-item {
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.student-name {
  cursor: pointer;
  color: #007bff;
}

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
}
</style>
