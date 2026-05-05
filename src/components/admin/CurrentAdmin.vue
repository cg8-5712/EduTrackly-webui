<template>
  <div class="space-y-4">
    <section class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div class="board-shell p-5 md:p-6">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="board-kicker mb-2">Control Summary</div>
            <h2 class="panel-title">{{ t("extraUI.adminConsole") }}</h2>
          </div>
          <Button variant="outline" @click="refreshPage">{{ t("extraUI.refresh") }}</Button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="metric-panel">
            <div class="metric-label">{{ t("extraUI.totalStudents") }}</div>
            <div class="metric-value">{{ totalStudents }}</div>
          </div>
          <div class="metric-panel">
            <div class="metric-label">{{ t("extraUI.homeworkTasks") }}</div>
            <div class="metric-value">{{ totalHomework }}</div>
          </div>
          <div class="metric-panel">
            <div class="metric-label">Live Clock</div>
            <div class="metric-value !text-3xl md:!text-4xl">{{ currentTime }}</div>
          </div>
        </div>
      </div>

      <div class="board-shell p-5 md:p-6">
        <div class="mb-5">
          <div class="board-kicker mb-2">{{ t("extraUI.classSelection") }}</div>
          <h2 class="panel-title">{{ t("extraUI.currentClass") }}</h2>
        </div>

        <ClassSwitch @update:cid="handleClassChange" />

        <div class="mt-5 space-y-3">
          <div class="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              {{ t("extraUI.classIdLabel") }}
            </div>
            <div class="mt-2 text-3xl font-semibold text-foreground">{{ selectedCid || "--" }}</div>
          </div>
          <div class="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              {{ t("extraUI.systemStatus") }}
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="info-pill"><span class="status-dot" /> Service Running</span>
              <span class="info-pill"><span class="status-dot" /> Database Connected</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <StudentEventSelector :cid="selectedCid" ref="studentListComponent" />
      <SubmitHomework :cid="selectedCid" />
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import ClassSwitch from "@/components/common/ClassSwitch.vue"
import StudentEventSelector from "@/components/student/StudentEventSelector.vue"
import SubmitHomework from "@/components/homework/SubmitHomework.vue"
import Button from "@/components/ui/button/Button.vue"

const { t } = useI18n()

const selectedCid = ref(null)
const currentTime = ref("")
const totalStudents = ref(0)
const totalHomework = ref(0)

let timeInterval = null

function handleClassChange(cid) {
  selectedCid.value = cid
  updateStats()
}

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function updateStats() {
  totalStudents.value = Math.floor(Math.random() * 50) + 20
  totalHomework.value = Math.floor(Math.random() * 10) + 5
}

function refreshPage() {
  window.location.reload()
}

onMounted(() => {
  updateTime()
  updateStats()
  timeInterval = window.setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timeInterval) {
    window.clearInterval(timeInterval)
  }
})
</script>
