<template>
  <section class="board-shell flex h-full min-h-0 flex-col p-5 md:p-6">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="board-kicker mb-2">{{ $t("homework.submitHomework") }}</div>
        <h2 class="panel-title">{{ $t("homework.homeworkContent") }}</h2>
      </div>
      <Button
        variant="default"
        size="lg"
        :disabled="submitting"
        :loading="submitting"
        @click="submitHomework"
      >
        {{ $t("homework.submit") }}
      </Button>
    </div>

    <div class="min-h-0 flex-1 overflow-auto pr-1">
      <div class="grid gap-4 xl:grid-cols-2">
      <div
        v-for="subject in subjects"
        :key="subject.key"
        class="rounded-[1.6rem] border border-white/8 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <span class="subject-chip">{{ subject.name }}</span>
          <span class="text-xs uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
            {{ (homeworkContent[subject.key] || "").length }} chars
          </span>
        </div>
        <Textarea
          v-model="homeworkContent[subject.key]"
          :placeholder="$t('homework.pleaseEnterContent') + subject.name"
          class="min-h-[8.75rem] resize-none"
        />
      </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, watch, ref } from "vue"
import { useI18n } from "vue-i18n"
import HomeworkService from "@/services/basic/homework"
import { formatDateToYYYYMMDD } from "@/utils/formatDate"
import notificationService from "@/services/common/notification"
import Button from "@/components/ui/button/Button.vue"
import Textarea from "@/components/ui/textarea/Textarea.vue"

const { t: $t } = useI18n()

const props = defineProps({
  cid: {
    type: Number,
    required: true,
  },
})

const subjects = computed(() => [
  { key: "chinese", name: $t("homework.subjects.chinese") },
  { key: "maths", name: $t("homework.subjects.math") },
  { key: "english", name: $t("homework.subjects.english") },
  { key: "physics", name: $t("homework.subjects.physics") },
  { key: "chemistry", name: $t("homework.subjects.chemistry") },
  { key: "biology", name: $t("homework.subjects.biology") },
  { key: "history", name: $t("homework.subjects.history") },
  { key: "geography", name: $t("homework.subjects.geography") },
  { key: "politics", name: $t("homework.subjects.politics") },
  { key: "others", name: $t("homework.subjects.others") },
])

const homeworkContent = reactive({})
const submitting = ref(false)

function resetHomework() {
  subjects.value.forEach((subject) => {
    homeworkContent[subject.key] = ""
  })
}

resetHomework()

async function fetchTodayHomework(cid) {
  try {
    const response = await HomeworkService.getTodayHomework(cid)

    if (response.data.code === 0 && response.data.data?.homework_content) {
      resetHomework()

      subjects.value.forEach((subject) => {
        const content = response.data.data.homework_content[subject.key]
        if (content) {
          homeworkContent[subject.key] = content.replace(/\\n/g, "\n")
        }
      })
    }
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error("[SubmitHomework] fetch failed:", error)
    }
  }
}

watch(
  () => props.cid,
  (newCid) => {
    resetHomework()
    if (newCid) {
      fetchTodayHomework(newCid)
    }
  }
)

onMounted(() => {
  if (props.cid) {
    fetchTodayHomework(props.cid)
  }
})

async function submitHomework() {
  const hasContent = subjects.value.some(
    (subject) => homeworkContent[subject.key] && homeworkContent[subject.key].trim()
  )

  if (!hasContent) {
    notificationService.info($t("homework.pleaseEnterContent"))
    return
  }

  try {
    submitting.value = true

    const payload = {
      cid: props.cid,
      homework_content: subjects.value.reduce((result, subject) => {
        result[subject.key] = homeworkContent[subject.key]?.trim() || ""
        return result
      }, {}),
      due_date: Number.parseInt(formatDateToYYYYMMDD(new Date()), 10),
    }

    const response = await HomeworkService.postHomework(payload)

    if (response.data.code === 0) {
      notificationService.success($t("homework.submitSuccess"))
      resetHomework()
      fetchTodayHomework(props.cid)
      return
    }

    notificationService.error(`${$t("homework.submitFailed")}: ${response.data.message}`)
  } catch (error) {
    console.error("[SubmitHomework] submit failed:", error)
    notificationService.error(
      error.response?.data?.message
        ? `${$t("homework.submitFailed")}: ${error.response.data.message}`
        : $t("homework.submitFailed")
    )
  } finally {
    submitting.value = false
  }
}
</script>
