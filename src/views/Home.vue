<template>
  <div class="h-screen w-full overflow-hidden p-3 md:p-4" @click="handleGlobalClick">
    <FloatingCountdown :selected-cid="selectedCid" />
    <FloatingSlogan :selected-cid="selectedCid" />

    <div class="flex h-full flex-col gap-3">
      <section class="board-shell relative z-30 overflow-visible px-5 py-3 md:px-6 md:py-3.5">
        <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,30rem)_auto] xl:items-center">
          <div class="space-y-2.5">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Night Study Board</Badge>
              <Badge variant="warning">{{ $t("common.today") }}</Badge>
            </div>
            <div>
              <h1 class="board-heading !text-[clamp(2.6rem,3.8vw,4rem)]">EduTrackly</h1>
              <p class="board-subcopy !text-sm md:!text-base">
                {{ todayDate }}
                <span v-if="selectedDate && selectedDate !== todayDateInt">
                  / {{ formattedSelectedDate }}
                </span>
              </p>
            </div>
          </div>

          <div class="w-full xl:justify-self-center">
            <ClassSwitch v-model:cid="selectedCid" prominent class="mx-auto w-full" />
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 md:gap-4 xl:justify-self-end">
            <LanguageToggle />
            <ThemeToggle />

            <div class="relative">
              <Button variant="outline" @click.stop="showCalendar = !showCalendar">
                {{ selectedDate && selectedDate !== todayDateInt ? formattedSelectedDate : "Pick Date" }}
              </Button>

              <div
                v-if="showCalendar"
                class="calendar-popup board-shell absolute right-0 top-[calc(100%+0.9rem)] w-[22rem] p-2 md:w-[24rem]"
                @click.stop
              >
                <Calendar mode="single" @select-date="onDateSelect" />
              </div>
            </div>

            <Button variant="default" @click.stop="toggleFullscreen">
              {{ isFullscreen ? $t("common.exitFullscreen") : $t("common.fullscreen") }}
            </Button>

            <span class="info-pill !px-3 !py-1.5">{{ selectedDateText }}</span>
            <span class="info-pill !px-3 !py-1.5">Projection Ready</span>

            <div class="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-3 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div class="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Clock</div>
              <div class="font-display text-4xl tracking-[-0.08em] text-foreground md:text-6xl">
                {{ currentTime }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main class="relative z-0 grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.55fr)]">
        <section class="board-shell min-h-0 overflow-auto">
          <div class="flex items-center justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6">
            <div>
              <div class="board-kicker mb-2">Attendance</div>
              <h2 class="panel-title">{{ $t("extraUI.actualAttend") }}</h2>
            </div>
            <span class="info-pill">{{ selectedCid ? `Class ${selectedCid}` : "--" }}</span>
          </div>
          <div class="px-5 pb-5 pt-4 md:px-6 md:pb-6">
            <AttendanceDisplay
              ref="studentsComponent"
              :selected-date="selectedDate"
              :selected-cid="selectedCid"
            />
          </div>
        </section>

        <section class="board-shell min-h-0 overflow-auto">
          <div class="flex items-center justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6">
            <div>
              <div class="board-kicker mb-2">Homework</div>
              <h2 class="panel-title">{{ $t("homework.homeworkContent") }}</h2>
            </div>
            <span class="info-pill">{{ selectedDateText }}</span>
          </div>
          <div class="px-5 pb-5 pt-4 md:px-6 md:pb-6">
            <Homework
              ref="homeworkComponent"
              :selected-date="selectedDate"
              :selected-cid="selectedCid"
              :columns="1"
            />
          </div>
        </section>
      </main>

      <footer v-if="!isFullscreen" class="board-shell px-5 py-4 text-sm text-[var(--color-text-secondary)]">
        <router-link
          to="/about"
          class="flex flex-col gap-3 no-underline md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-1">
            <p class="text-sm text-foreground">© 2025 EduTrackly. All rights reserved.</p>
            <p class="text-xs text-[var(--color-text-tertiary)]">
              Licensed under GNU General Public License v3.0
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="info-pill !px-3 !py-1.5">Classroom Board System</span>
            <VersionInfo compact />
          </div>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import AttendanceDisplay from "@/components/student/AttendanceDisplay.vue"
import Homework from "@/components/homework/homework.vue"
import Calendar from "@/components/common/calendar.vue"
import ClassSwitch from "@/components/common/ClassSwitch.vue"
import ThemeToggle from "@/components/common/ThemeToggle.vue"
import LanguageToggle from "@/components/common/LanguageToggle.vue"
import FloatingCountdown from "@/components/common/FloatingCountdown.vue"
import FloatingSlogan from "@/components/common/FloatingSlogan.vue"
import VersionInfo from "@/components/VersionInfo.vue"
import { formatYYYYMMDDToDate } from "@/utils/formatDate"
import Button from "@/components/ui/button/Button.vue"
import Badge from "@/components/ui/badge/Badge.vue"

const { t: $t } = useI18n()

const currentTime = ref("")
const todayDate = ref("")
const todayDateInt = ref("")
const showCalendar = ref(false)
const selectedDate = ref(null)
const studentsComponent = ref(null)
const homeworkComponent = ref(null)
const isFullscreen = ref(false)
const selectedCid = ref(null)

let clockTimer = null

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) {
    return ""
  }

  return formatYYYYMMDDToDate(Number.parseInt(selectedDate.value, 10))
})

const selectedDateText = computed(() => {
  if (selectedDate.value && selectedDate.value !== todayDateInt.value) {
    return `${formattedSelectedDate.value} ${$t("homework.title")}`
  }

  return $t("homework.todayHomework")
})

function updateTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  currentTime.value = `${hours}:${minutes}`

  const currentDateInt = String(
    now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0")
  )

  if (currentDateInt !== todayDateInt.value) {
    updateDate()
  }
}

function updateDate() {
  const now = new Date()
  const dateInt = Number.parseInt(
    now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0"),
    10
  )

  todayDateInt.value = String(dateInt)
  todayDate.value = formatYYYYMMDDToDate(dateInt)
}

function onDateSelect(date) {
  selectedDate.value = date
  showCalendar.value = false
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
    return
  }

  document.exitFullscreen()
  isFullscreen.value = false
}

function handleGlobalClick(event) {
  if (showCalendar.value && !event.target.closest(".calendar-popup")) {
    showCalendar.value = false
  }
}

watch(
  selectedCid,
  () => {
    if (studentsComponent.value?.fetchAttendance) {
      studentsComponent.value.fetchAttendance()
    }

    if (homeworkComponent.value?.fetchHomework) {
      homeworkComponent.value.fetchHomework()
    }
  },
  { immediate: true }
)

onMounted(() => {
  updateDate()
  updateTime()
  clockTimer = window.setInterval(updateTime, 60000)

  document.addEventListener("fullscreenchange", () => {
    isFullscreen.value = Boolean(document.fullscreenElement)
  })
})

onUnmounted(() => {
  if (clockTimer) {
    window.clearInterval(clockTimer)
  }
})
</script>
