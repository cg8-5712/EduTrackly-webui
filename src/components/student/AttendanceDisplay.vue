<template>
  <div class="p-4 min-h-full rounded-xl transition-colors duration-300"
       style="background-color: var(--color-surface); color: var(--color-text-primary);">
    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-center text-lg" style="color: var(--color-error);">
      {{ error }}
    </div>

    <!-- 展示出勤数据 -->
    <div v-else-if="attendance.class_name" class="flex flex-col gap-6">
      <!-- 出勤统计 -->
      <div class="flex flex-col gap-4">
        <div class="p-4 rounded-lg text-3xl transition-colors duration-300"
             style="background-color: var(--color-background); color: var(--color-text-primary);">
          <span class="font-bold">{{ t('extraUI.expectedAttend') }}：</span>{{ attendance.expected_attend }}{{ t('extraUI.peopleUnit') }}
        </div>
        <div class="p-4 rounded-lg text-3xl transition-colors duration-300"
             style="background-color: var(--color-background); color: var(--color-text-primary);">
          <span class="font-bold">{{ t('extraUI.actualAttend') }}：</span>{{ attendance.actual_attend }}{{ t('extraUI.peopleUnit') }}
        </div>
      </div>

      <!-- 请假名单 -->
      <div v-if="hasAbsentStudents" class="mt-4">
        <h3 class="text-4xl font-semibold mb-4 flex items-center gap-2 transition-colors duration-300"
            style="color: var(--color-primary);">
          <span class="text-3xl">📋</span>
          <span>{{ t('extraUI.leaveList') }}</span>
        </h3>
        <ul class="list-none p-0 m-0 flex flex-wrap gap-3">
          <li v-for="(event, index) in absentStudents"
              :key="index"
              class="px-4 py-2 rounded-lg text-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style="background-color: var(--color-background); color: var(--color-text-primary);">
            <span class="cursor-pointer relative transition-colors duration-150"
                  style="color: var(--color-primary);"
                  @mouseover="showReason(event, index)"
                  @mouseleave="hideReason">
              {{ event.student_name }}
              <span v-if="showTooltip && currentEventId === index"
                    class="absolute left-full ml-3 px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10 animate-fade-in"
                    style="background-color: var(--color-surface); color: var(--color-text-primary); box-shadow: var(--shadow-xl); border: 1px solid var(--color-border);">
                <span class="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
                      style="background-color: var(--color-surface); border-left: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"></span>
                {{ getEventTypeText(event.event_type) }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <!-- 临时参加名单 -->
      <div v-if="tempStudents.length > 0" class="mt-4">
        <h3 class="text-4xl font-semibold mb-4 flex items-center gap-2 transition-colors duration-300"
            style="color: var(--color-primary);">
          <span class="text-3xl">✨</span>
          <span>{{ t('extraUI.temporaryJoinList') }}</span>
        </h3>
        <ul class="list-none p-0 m-0 flex flex-wrap gap-3">
          <li v-for="(event, index) in tempStudents"
              :key="index"
              class="px-4 py-2 rounded-lg text-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style="background-color: var(--color-background); color: var(--color-text-primary);">
            {{ event.student_name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 没有数据 -->
    <div v-else class="text-center text-lg" style="color: var(--color-text-tertiary);">
      {{ t('extraUI.noAttendanceInfo') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AttendanceService from '@/services/basic/analysis'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { t } = useI18n()

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
    'personal': t('attendance.personalLeave'),
    'official': t('attendance.officialLeave'),
    'sick': t('attendance.sickLeave')
  }
  return typeMap[type] || type
}

const fetchAttendance = async () => {
  if (!props.selectedCid) {
    error.value = t('extraUI.pleaseSelectClassFirst')
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const res = props.selectedDate
        ? await AttendanceService.getAnalysisByDate(Number(props.selectedCid), props.selectedDate)
        : await AttendanceService.getTodayAnalysis(Number(props.selectedCid))

    if (res.code === 0 && res.data) {
      attendance.value = res.data
    } else {
      throw new Error(res.message || t('extraUI.fetchDataFailed'))
    }
  } catch (err) {
    console.error(t('extraUI.fetchAttendanceInfoFailed'), err)
    error.value = t('extraUI.fetchAttendanceInfoFailed')
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
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-in-out;
}
</style>
