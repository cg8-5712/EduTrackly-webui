<template>
  <div class="space-y-4">
    <div
      v-if="loading"
      class="board-shell flex min-h-[18rem] items-center justify-center p-10"
    >
      <LoadingSpinner />
    </div>

    <div
      v-else-if="error"
      class="board-shell flex min-h-[18rem] items-center justify-center p-10 text-center text-lg text-[var(--color-error)]"
    >
      {{ error }}
    </div>

    <div v-else-if="attendance.class_name" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="metric-panel">
          <div class="metric-label">{{ t("extraUI.expectedAttend") }}</div>
          <div class="mt-4 flex items-end gap-3">
            <div class="metric-value">{{ attendance.expected_attend }}</div>
            <div class="text-base text-[var(--color-text-secondary)]">
              {{ t("extraUI.peopleUnit") }}
            </div>
          </div>
        </div>

        <div class="metric-panel">
          <div class="metric-label">{{ t("extraUI.actualAttend") }}</div>
          <div class="mt-4 flex items-end gap-3">
            <div class="metric-value">{{ attendance.actual_attend }}</div>
            <div class="text-base text-[var(--color-text-secondary)]">
              {{ t("extraUI.peopleUnit") }}
            </div>
          </div>
        </div>
      </div>

      <div class="board-shell p-5 md:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <div class="board-kicker mb-2">{{ attendance.class_name }}</div>
            <h3 class="panel-title">{{ t("extraUI.leaveList") }}</h3>
          </div>
          <span class="info-pill">{{ absentStudents.length }}</span>
        </div>

        <div v-if="hasAbsentStudents" class="flex flex-wrap gap-3">
          <div
            v-for="(event, index) in absentStudents"
            :key="index"
            class="group relative rounded-full border border-white/10 bg-white/6 px-4 py-2 text-lg text-foreground"
            @mouseenter="showReason(event, index)"
            @mouseleave="hideReason"
          >
            <span class="font-medium text-[var(--color-primary)]">{{ event.student_name }}</span>

            <div
              v-if="showTooltip && currentEventId === index"
              class="absolute left-1/2 top-[calc(100%+0.75rem)] z-10 -translate-x-1/2 rounded-2xl border border-white/10 bg-panel-strong px-4 py-3 text-sm text-muted-foreground shadow-panel"
            >
              {{ getEventTypeText(event.event_type) }}
            </div>
          </div>
        </div>

        <div v-else class="rounded-[1.5rem] border border-dashed border-white/10 bg-white/4 px-5 py-10 text-center text-lg text-muted-foreground">
          {{ t("extraUI.noAttendanceInfo") }}
        </div>
      </div>

      <div v-if="tempStudents.length" class="board-shell p-5 md:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <div class="board-kicker mb-2">Temporary</div>
            <h3 class="panel-title">{{ t("extraUI.temporaryJoinList") }}</h3>
          </div>
          <span class="info-pill">{{ tempStudents.length }}</span>
        </div>

        <div class="flex flex-wrap gap-3">
          <div
            v-for="(event, index) in tempStudents"
            :key="index"
            class="rounded-full border border-white/10 bg-[rgba(var(--color-secondary-rgb),0.14)] px-4 py-2 text-lg text-foreground"
          >
            {{ event.student_name }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="board-shell flex min-h-[18rem] items-center justify-center p-10 text-center text-lg text-muted-foreground"
    >
      {{ t("extraUI.noAttendanceInfo") }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import AttendanceService from "@/services/basic/analysis"
import LoadingSpinner from "@/components/common/LoadingSpinner.vue"

const { t } = useI18n()

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
  selectedCid: {
    type: Number,
    required: true,
    default: 1,
  },
})

const attendance = ref({
  class_name: "",
  expected_attend: 0,
  actual_attend: 0,
  event_list: [],
})

const loading = ref(true)
const error = ref(null)
const showTooltip = ref(false)
const currentEventId = ref(null)

const absentStudents = computed(() =>
  attendance.value.event_list.filter((event) =>
    ["personal", "official", "sick"].includes(event.event_type)
  )
)

const tempStudents = computed(() =>
  attendance.value.event_list.filter((event) => event.event_type === "temp")
)

const hasAbsentStudents = computed(() => absentStudents.value.length > 0)

function getEventTypeText(type) {
  const typeMap = {
    personal: t("attendance.personalLeave"),
    official: t("attendance.officialLeave"),
    sick: t("attendance.sickLeave"),
  }

  return typeMap[type] || type
}

async function fetchAttendance() {
  if (!props.selectedCid) {
    error.value = t("extraUI.pleaseSelectClassFirst")
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = props.selectedDate
      ? await AttendanceService.getAnalysisByDate(Number(props.selectedCid), props.selectedDate)
      : await AttendanceService.getTodayAnalysis(Number(props.selectedCid))

    if (response.code === 0 && response.data) {
      attendance.value = response.data
      return
    }

    throw new Error(response.message || t("extraUI.fetchDataFailed"))
  } catch (err) {
    console.error("[AttendanceDisplay] fetch failed:", err)
    error.value = t("extraUI.fetchAttendanceInfoFailed")
    attendance.value = {
      class_name: "",
      expected_attend: 0,
      actual_attend: 0,
      event_list: [],
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.selectedDate, props.selectedCid],
  async () => {
    await fetchAttendance()
  },
  { immediate: true }
)

function showReason(event, index) {
  if (["personal", "official", "sick"].includes(event.event_type)) {
    showTooltip.value = true
    currentEventId.value = index
  }
}

function hideReason() {
  showTooltip.value = false
  currentEventId.value = null
}

defineExpose({ fetchAttendance })
</script>
