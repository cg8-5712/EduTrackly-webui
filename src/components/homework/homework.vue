<template>
  <div class="space-y-4">
    <div
      v-if="loading"
      class="board-shell flex min-h-[18rem] items-center justify-center p-10"
    >
      <LoadingSpinner :size="56" color="var(--color-primary)" message="" />
    </div>

    <div
      v-else-if="error === 'no-homework'"
      class="board-shell flex min-h-[18rem] items-center justify-center p-10 text-center"
    >
      <div>
        <div class="board-kicker mb-3">Clear Board</div>
        <div class="board-heading mb-4 !text-4xl md:!text-5xl">{{ $t("homework.noHomework") }}</div>
        <p class="panel-caption text-base md:text-lg">{{ $t("homework.noHomeworkToday") }}</p>
      </div>
    </div>

    <div
      v-else-if="error"
      class="board-shell flex min-h-[18rem] items-center justify-center p-10 text-center text-lg text-[var(--color-error)]"
    >
      {{ error }}
    </div>

    <div v-else class="grid gap-4" :style="gridStyle">
      <article
        v-for="subject in subjectsWithContent"
        :key="subject.key"
        class="board-shell overflow-hidden p-5 md:p-6"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <div class="subject-chip" :style="getSubjectStyle(subject.key)">
              {{ subject.name }}
            </div>
          </div>
          <span class="text-xs uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
            {{ subject.lines.length }} line<span v-if="subject.lines.length > 1">s</span>
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="(line, index) in subject.lines"
            :key="index"
            class="rounded-[1.4rem] border border-white/8 bg-white/6 px-4 py-4 text-[1.45rem] leading-9 text-foreground md:text-[1.65rem]"
          >
            {{ line }}
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import HomeworkService from "@/services/basic/homework"
import notificationService from "@/services/common/notification"
import LoadingSpinner from "@/components/common/LoadingSpinner.vue"

const { t: $t } = useI18n()

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
  selectedCid: {
    type: Number,
    default: 1,
  },
  columns: {
    type: Number,
    default: 1,
  },
})

const homework = ref(null)
const loading = ref(false)
const error = ref(null)

const subjectConfig = computed(() => ({
  chinese: $t("homework.subjects.chinese"),
  maths: $t("homework.subjects.math"),
  english: $t("homework.subjects.english"),
  physics: $t("homework.subjects.physics"),
  chemistry: $t("homework.subjects.chemistry"),
  biology: $t("homework.subjects.biology"),
  history: $t("homework.subjects.history"),
  geography: $t("homework.subjects.geography"),
  politics: $t("homework.subjects.politics"),
  others: $t("homework.subjects.others"),
}))

const subjectColors = {
  chinese: { border: "#be6f6a", background: "rgba(190,111,106,0.12)", text: "#f1cbc8" },
  maths: { border: "#7fbaae", background: "rgba(127,186,174,0.12)", text: "#cfe9e2" },
  english: { border: "#9abf79", background: "rgba(154,191,121,0.12)", text: "#def0d0" },
  physics: { border: "#8ea2d1", background: "rgba(142,162,209,0.12)", text: "#d8e0f6" },
  chemistry: { border: "#caa26f", background: "rgba(202,162,111,0.14)", text: "#f4dfc1" },
  biology: { border: "#84b38b", background: "rgba(132,179,139,0.12)", text: "#d7eed9" },
  history: { border: "#bc8670", background: "rgba(188,134,112,0.12)", text: "#f2d5cb" },
  geography: { border: "#74a3b3", background: "rgba(116,163,179,0.12)", text: "#cee5ec" },
  politics: { border: "#b095b9", background: "rgba(176,149,185,0.12)", text: "#e7d7ec" },
  others: { border: "#90a294", background: "rgba(144,162,148,0.12)", text: "#e4ece6" },
}

function getSubjectStyle(key) {
  const color = subjectColors[key] || subjectColors.others
  return {
    borderColor: color.border,
    background: color.background,
    color: color.text,
  }
}

async function fetchHomework() {
  if (!props.selectedCid) {
    loading.value = false
    homework.value = null
    error.value = null
    return
  }

  loading.value = true
  error.value = null
  homework.value = null

  try {
    const response = props.selectedDate
      ? await HomeworkService.getHomeworkByDate(props.selectedCid, props.selectedDate)
      : await HomeworkService.getTodayHomework(props.selectedCid)

    if (response.data.code === 2001) {
      error.value = "no-homework"
      return
    }

    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }

    homework.value = response.data.data || null
  } catch (err) {
    console.error("[Homework] fetch failed:", err)
    error.value = $t("homework.fetchFailed")
    notificationService.error($t("homework.fetchFailed"))
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.selectedDate, props.selectedCid],
  () => {
    fetchHomework()
  },
  { immediate: true }
)

const subjectsWithContent = computed(() => {
  if (!homework.value?.homework_content) {
    return []
  }

  return Object.keys(subjectConfig.value)
    .map((key) => {
      const content = homework.value.homework_content[key]
      if (!content || !content.trim()) {
        return null
      }

      const normalizedContent = content.trim().replace(/\\n/g, "\n")

      return {
        key,
        name: subjectConfig.value[key],
        lines: normalizedContent.split("\n").filter((line) => line.trim() !== ""),
      }
    })
    .filter(Boolean)
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
}))

defineExpose({ fetchHomework })
</script>
