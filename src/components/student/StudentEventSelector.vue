<template>
  <section class="board-shell p-5 md:p-6">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="board-kicker mb-2">Attendance Input</div>
        <h2 class="panel-title">{{ titleText }}</h2>
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="info-pill">{{ students.length }} students</span>
        <span class="info-pill">Leave / Temp</span>
      </div>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <span class="subject-chip border-[rgba(var(--color-primary-rgb),0.2)] bg-[rgba(var(--color-primary-rgb),0.14)] text-[var(--color-primary)]">
        Personal
      </span>
      <span class="subject-chip border-[rgba(115,176,119,0.2)] bg-[rgba(115,176,119,0.14)] text-[var(--color-success)]">
        Sick
      </span>
      <span class="subject-chip border-[rgba(var(--color-secondary-rgb),0.2)] bg-[rgba(var(--color-secondary-rgb),0.14)] text-[var(--color-secondary)]">
        Official
      </span>
      <span class="subject-chip border-[rgba(121,167,160,0.2)] bg-[rgba(121,167,160,0.14)] text-[var(--color-info)]">
        Temporary
      </span>
    </div>

    <div class="flex-1 min-h-0 overflow-auto pr-1">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="student in students"
          :key="student.sid"
          class="rounded-[1.5rem] border p-4"
          :class="cardClass(student)"
        >
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <div class="text-lg font-semibold text-foreground">{{ student.student_name }}</div>
              <div class="text-xs uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
                SID {{ student.sid }}
              </div>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              :class="student.attendance ? 'bg-white/8 text-foreground' : 'bg-[rgba(121,167,160,0.14)] text-[var(--color-info)]'"
            >
              {{ student.attendance ? "On Roll" : "Temp" }}
            </span>
          </div>

          <div class="mb-3 min-h-[2rem] text-sm text-[var(--color-text-secondary)]">
            {{ getEventLabel(student.sid) }}
          </div>

          <div v-if="student.attendance" class="grid grid-cols-3 gap-2">
            <button
              v-for="option in leaveOptions"
              :key="option.value"
              type="button"
              class="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:-translate-y-0.5"
              :class="selectedEvents[student.sid] === option.value ? option.activeClass : option.idleClass"
              @click="setEvent(student.sid, option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <div v-else class="flex items-center gap-2">
            <button
              type="button"
              class="w-full rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
              :class="selectedEvents[student.sid] === 'temp'
                ? 'bg-[rgba(121,167,160,0.18)] text-[var(--color-info)]'
                : 'bg-white/8 text-foreground hover:bg-white/10'"
              @click="toggleTemporary(student.sid)"
            >
              {{ selectedEvents[student.sid] === "temp" ? "Marked Temporary" : "Mark Temporary" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 flex justify-end">
      <button
        class="submit-button"
        :disabled="loading"
        @click="submitEvents"
      >
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? "Submitting" : "Submit Events" }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import StudentService from "@/services/basic/student"
import AnalysisService from "@/services/basic/analysis"
import notificationService from "@/services/common/notification"
import { formatDateToYYYYMMDD } from "@/utils/formatDate"

const props = defineProps({ cid: Number })

const students = ref([])
const selectedEvents = ref({})
const loading = ref(false)

const leaveOptions = [
  {
    value: "personal",
    label: "Personal",
    activeClass: "bg-[rgba(var(--color-primary-rgb),0.18)] text-[var(--color-primary)]",
    idleClass: "bg-white/8 text-foreground hover:bg-white/10",
  },
  {
    value: "sick",
    label: "Sick",
    activeClass: "bg-[rgba(115,176,119,0.18)] text-[var(--color-success)]",
    idleClass: "bg-white/8 text-foreground hover:bg-white/10",
  },
  {
    value: "official",
    label: "Official",
    activeClass: "bg-[rgba(var(--color-secondary-rgb),0.18)] text-[var(--color-secondary)]",
    idleClass: "bg-white/8 text-foreground hover:bg-white/10",
  },
]

const titleText = computed(() => {
  const markedCount = Object.values(selectedEvents.value).filter(Boolean).length
  return markedCount ? `${markedCount} student events ready` : "Select student events"
})

function setEvent(sid, type) {
  if (selectedEvents.value[sid] === type) {
    delete selectedEvents.value[sid]
    return
  }

  selectedEvents.value[sid] = type
}

function toggleTemporary(sid) {
  if (selectedEvents.value[sid] === "temp") {
    delete selectedEvents.value[sid]
    return
  }

  selectedEvents.value[sid] = "temp"
}

function getEventLabel(sid) {
  const value = selectedEvents.value[sid]

  switch (value) {
    case "personal":
      return "Personal leave selected"
    case "sick":
      return "Sick leave selected"
    case "official":
      return "Official leave selected"
    case "temp":
      return "Temporary attendance selected"
    default:
      return "No special event selected"
  }
}

function cardClass(student) {
  if (selectedEvents.value[student.sid] === "temp") {
    return "border-[rgba(121,167,160,0.22)] bg-[rgba(121,167,160,0.08)]"
  }

  if (selectedEvents.value[student.sid]) {
    return "border-[rgba(var(--color-primary-rgb),0.22)] bg-[rgba(var(--color-primary-rgb),0.08)]"
  }

  return student.attendance
    ? "border-white/8 bg-white/4"
    : "border-white/8 bg-[rgba(255,255,255,0.03)]"
}

async function fetchStudents() {
  if (!props.cid) {
    students.value = []
    return
  }

  try {
    loading.value = true

    const [studentResponse, analysisResponse] = await Promise.all([
      StudentService.getStudentListAll(props.cid),
      AnalysisService.getTodayAnalysis(props.cid),
    ])

    const existingEvents = {}

    if (analysisResponse.data?.event_list && Array.isArray(analysisResponse.data.event_list)) {
      analysisResponse.data.event_list.forEach((event) => {
        const student = studentResponse.data?.find((item) => item.student_name === event.student_name)
        if (student) {
          existingEvents[student.sid] = event.event_type
        }
      })
    }

    students.value = (studentResponse.data || []).map((student) => ({
      ...student,
      attendance: student.attendance !== undefined ? student.attendance : true,
    }))

    selectedEvents.value = { ...existingEvents }
  } catch (error) {
    console.error("[StudentEventSelector] fetch failed:", error)
    notificationService.error("Failed to load student list")
  } finally {
    loading.value = false
  }
}

async function submitEvents() {
  const eventsArray = students.value.map((student) => ({
    sid: student.sid,
    event_type: selectedEvents.value[student.sid] || "",
  }))

  try {
    loading.value = true
    await StudentService.submitStudentEvents(eventsArray, formatDateToYYYYMMDD(new Date()))
    notificationService.success("Events submitted")
    await fetchStudents()
  } catch (error) {
    console.error("[StudentEventSelector] submit failed:", error)
    notificationService.error("Submit failed")
  } finally {
    loading.value = false
  }
}

watch(() => props.cid, fetchStudents, { immediate: true })

defineExpose({ fetchStudents })
</script>

<style scoped>
/* RGB color variables for rgba() usage */
:root {
  --color-primary-rgb: 96, 165, 250;
  --color-secondary-rgb: 167, 139, 250;
  --color-info-rgb: 96, 165, 250;
  --color-foreground: var(--color-text-primary);
}

.board-shell {
  background-color: var(--color-surface);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-xl);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.board-kicker {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-tertiary);
  font-weight: 600;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.info-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
}

.subject-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border-width: 1px;
  border-style: solid;
}

/* Custom scrollbar */
.flex-1::-webkit-scrollbar {
  width: 6px;
}

.flex-1::-webkit-scrollbar-track {
  background: transparent;
}

.flex-1::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.flex-1::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

.submit-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
