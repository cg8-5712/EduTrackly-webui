<template>
  <div class="h-screen w-full overflow-hidden p-3 md:p-4" @click="handleGlobalClick">
    <FloatingCountdown :selected-cid="selectedCid" />

    <div class="flex h-full flex-col gap-3">
      <section class="board-shell px-5 py-5 md:px-7 md:py-6">
        <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Homework Mode</Badge>
              <Badge variant="warning">{{ $t("common.today") }}</Badge>
            </div>
            <div>
              <h1 class="board-heading">{{ $t("homework.homeworkContent") }}</h1>
              <p class="board-subcopy">
                {{ todayDate }}
                <span v-if="selectedDate && selectedDate !== todayDateInt">
                  · {{ formattedSelectedDate }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 md:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="outline" @click.stop="showCalendar = !showCalendar">
              {{ selectedDate && selectedDate !== todayDateInt ? formattedSelectedDate : "Pick Date" }}
            </Button>
            <Button variant="default" @click.stop="toggleFullscreen">
              {{ isFullscreen ? $t("common.exitFullscreen") : $t("common.fullscreen") }}
            </Button>
            <div class="rounded-[1.7rem] border border-white/10 bg-white/6 px-5 py-3 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div class="text-xs uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Clock</div>
              <div class="font-display text-5xl tracking-[-0.08em] text-foreground md:text-6xl">{{ currentTime }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4">
          <ClassSwitch v-model:cid="selectedCid" />
          <div class="flex flex-wrap gap-2">
            <span class="info-pill">{{ selectedDateText }}</span>
            <span class="info-pill">Single Focus View</span>
          </div>
        </div>

        <div
          v-if="showCalendar"
          class="calendar-popup board-shell absolute right-4 top-[9.5rem] z-[1000] p-2"
          @click.stop
        >
          <Calendar mode="single" @select-date="onDateSelect" />
        </div>
      </section>

      <section class="board-shell min-h-0 flex-1 overflow-auto">
        <div class="flex items-center justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6">
          <div>
            <div class="board-kicker mb-2">All Subjects</div>
            <h2 class="panel-title">{{ $t("homework.homeworkContent") }}</h2>
          </div>
          <span class="info-pill">{{ selectedDateText }}</span>
        </div>

        <div class="px-5 pb-5 pt-4 md:px-6 md:pb-6">
          <Homework
            :selected-date="selectedDate"
            :selected-cid="selectedCid"
            :columns="2"
          />
        </div>
      </section>

      <footer v-if="!isFullscreen" class="board-shell px-5 py-4 text-sm text-[var(--color-text-secondary)]">
        <router-link to="/about" class="flex items-center justify-between gap-4 no-underline">
          <span>Focused homework projection board</span>
          <span class="text-[var(--color-text-tertiary)]">EduTrackly</span>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import Homework from "@/components/homework/homework.vue"
import Calendar from "@/components/common/calendar.vue"
import ClassSwitch from "@/components/common/ClassSwitch.vue"
import ThemeToggle from "@/components/common/ThemeToggle.vue"
import LanguageToggle from "@/components/common/LanguageToggle.vue"
import FloatingCountdown from "@/components/common/FloatingCountdown.vue"
import { formatYYYYMMDDToDate } from "@/utils/formatDate"
import Button from "@/components/ui/button/Button.vue"
import Badge from "@/components/ui/badge/Badge.vue"

const { t: $t } = useI18n()

const currentTime = ref("")
const todayDate = ref("")
const todayDateInt = ref("")
const showCalendar = ref(false)
const selectedDate = ref(null)
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
  currentTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
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
