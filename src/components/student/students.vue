<template>
  <div class="p-4 dark-theme">
    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-400 text-center">
      {{ error }}
    </div>

    <!-- 展示出勤数据 -->
    <div v-else-if="attendance.class_name" class="space-y-6">
      <!-- 出勤统计 -->
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
        <h3 class="section-title">请假名单</h3>
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
        <h3 class="section-title">临时参加名单</h3>
        <ul>
          <li v-for="(event, index) in tempStudents" :key="index" class="event-item">
            {{ event.student_name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 没有数据 -->
    <div v-else class="text-gray-400 text-center">
      暂无出勤信息
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AttendanceService from '@/services/basic/analysis'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  },
  selectedCid: {
    type: Number,
    required: true,
    default: 1
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

const absentStudents = computed(() =>
    attendance.value.event_list.filter(event =>
        ['personal', 'official', 'sick'].includes(event.event_type)
    )
)

const tempStudents = computed(() =>
    attendance.value.event_list.filter(event => event.event_type === 'temp')
)

const hasAbsentStudents = computed(() => absentStudents.value.length > 0)

const getEventTypeText = (type) => {
  const typeMap = {
    'personal': '事假',
    'official': '公假',
    'sick': '病假'
  }
  return typeMap[type] || type
}

const fetchAttendance = async () => {
  if (!props.selectedCid) {
    error.value = '请先选择班级'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const res = props.selectedDate
        ? await AttendanceService.getAnalysisByDate(Number(props.selectedCid), props.selectedDate)
        : await AttendanceService.getTodayAnalysis(Number(props.selectedCid))

    if (res.data?.code === 0 && res.data?.data) {
      attendance.value = res.data.data
    } else {
      throw new Error(res.data?.message || '获取数据失败')
    }
  } catch (err) {
    console.error('获取出勤信息失败:', err)
    error.value = '获取出勤信息失败'
    attendance.value = {
      class_name: '',
      expected_attend: 0,
      actual_attend: 0,
      event_list: []
    }
  } finally {
    loading.value = false
  }
}

// 同时监听日期和班级变化
watch(
  () => [props.selectedDate, props.selectedCid],
  async () => {
    await fetchAttendance()
  },
  { immediate: true }
)

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
.dark-theme {
  background-color: #2d2d2d;
  color: #e0e0e0;
  min-height: 100%;
  border-radius: 12px;
}

.attendance-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat {
  background-color: #2b2b3d;
  padding: 12px;
  border-radius: 8px;
  color: #f0f0f0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #90caf9;
}

.attendance-details ul {
  list-style: none;
  padding-left: 0;
}

.event-item {
  padding: 10px;
  background-color: #2b2b3d;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  color: #e0e0e0;
}

.student-name {
  cursor: pointer;
  color: #64b5f6;
  position: relative;
}

.tooltip {
  position: absolute;
  left: 100%;
  margin-left: 8px;
  background-color: rgba(30, 30, 30, 0.9);
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
</style>
