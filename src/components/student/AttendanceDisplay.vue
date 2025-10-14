<template>
  <div class="p-4 bg-gray-700 text-gray-200 min-h-full rounded-xl">
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
      <div class="flex flex-col gap-4">
        <div class="bg-gray-800 p-4 rounded-lg text-gray-100 text-3xl">
          <span class="font-bold">应到：</span>{{ attendance.expected_attend }}人
        </div>
        <div class="bg-gray-800 p-4 rounded-lg text-gray-100 text-3xl">
          <span class="font-bold">实到：</span>{{ attendance.actual_attend }}人
        </div>
      </div>

      <!-- 请假名单 -->
      <div v-if="hasAbsentStudents" class="">
        <h3 class="text-4xl font-semibold mb-4 text-blue-300 flex items-center gap-2">
          <span class="text-3xl">📋</span>
          <span>请假名单</span>
        </h3>
        <ul class="list-none pl-0">
          <li v-for="(event, index) in absentStudents"
              :key="index"
              class="p-4 bg-gray-800 rounded-lg mb-3 flex justify-between text-gray-200 text-2xl transition-all duration-200 hover:bg-gray-700 hover:shadow-lg">
            <span class="cursor-pointer text-blue-400 relative"
                  @mouseover="showReason(event, index)"
                  @mouseleave="hideReason">
              {{ event.student_name }}
              <span v-if="showTooltip && currentEventId === index" class="absolute left-full ml-3 bg-gray-900 bg-opacity-95 text-white py-2 px-4 rounded-lg text-sm whitespace-nowrap shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-left-2 duration-200">
                <span class="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></span>
                {{ getEventTypeText(event.event_type) }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <!-- 临时参加名单 -->
      <div v-if="tempStudents.length > 0" class="">
        <h3 class="text-4xl font-semibold mb-4 text-blue-300 flex items-center gap-2">
          <span class="text-3xl">✨</span>
          <span>临时参加名单</span>
        </h3>
        <ul class="list-none pl-0">
          <li v-for="(event, index) in tempStudents" :key="index" class="p-4 bg-gray-800 rounded-lg mb-3 flex justify-between text-gray-200 text-2xl transition-all duration-200 hover:bg-gray-700 hover:shadow-lg">
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
</style>
