<template>
  <div class="attendance-container">
    <!-- 加载中 -->
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 展示出勤数据 -->
    <div v-else-if="attendance.class_name" class="attendance-content">
      <!-- 出勤统计 -->
      <div class="stats-container">
        <div class="stat-card">
          <span class="stat-label">应到：</span>{{ attendance.expected_attend }}人
        </div>
        <div class="stat-card">
          <span class="stat-label">实到：</span>{{ attendance.actual_attend }}人
        </div>
      </div>

      <!-- 请假名单 -->
      <div v-if="hasAbsentStudents" class="section">
        <h3 class="section-title">
          <span class="section-icon">📋</span>
          <span>请假名单</span>
        </h3>
        <ul class="student-list">
          <li v-for="(event, index) in absentStudents"
              :key="index"
              class="student-item">
            <span class="student-name"
                  @mouseover="showReason(event, index)"
                  @mouseleave="hideReason">
              {{ event.student_name }}
              <span v-if="showTooltip && currentEventId === index" class="tooltip">
                <span class="tooltip-arrow"></span>
                {{ getEventTypeText(event.event_type) }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <!-- 临时参加名单 -->
      <div v-if="tempStudents.length > 0" class="section">
        <h3 class="section-title">
          <span class="section-icon">✨</span>
          <span>临时参加名单</span>
        </h3>
        <ul class="student-list">
          <li v-for="(event, index) in tempStudents" :key="index" class="student-item">
            {{ event.student_name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 没有数据 -->
    <div v-else class="no-data">
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
.attendance-container {
  padding: 1rem;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  min-height: 100%;
  border-radius: 0.75rem;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10rem;
}

.error-message {
  color: var(--color-error);
  text-align: center;
  font-size: 1.125rem;
}

.attendance-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card {
  background-color: var(--color-background);
  padding: 1rem;
  border-radius: 0.5rem;
  color: var(--color-text-primary);
  font-size: 1.875rem;
  transition: background-color var(--transition-base);
}

.stat-label {
  font-weight: bold;
}

.section {
  margin-top: 1rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color var(--transition-base);
}

.section-icon {
  font-size: 1.875rem;
}

.student-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.student-item {
  padding: 1rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  transition: all 0.2s;
}

.student-item:hover {
  background-color: var(--color-surface);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.student-name {
  cursor: pointer;
  color: var(--color-primary);
  position: relative;
  transition: color var(--transition-fast);
}

.student-name:hover {
  color: var(--color-secondary);
}

.tooltip {
  position: absolute;
  left: 100%;
  margin-left: 0.75rem;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  animation: fadeIn 0.2s ease-in-out;
  z-index: 10;
}

.tooltip-arrow {
  position: absolute;
  left: -0.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-surface);
  transform: translateY(-50%) rotate(45deg);
  border-left: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.no-data {
  color: var(--color-text-tertiary);
  text-align: center;
  font-size: 1.125rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
