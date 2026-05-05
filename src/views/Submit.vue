<template>
  <div class="h-screen w-full overflow-hidden p-3 md:p-4">
    <div class="mx-auto flex h-full max-w-[1800px] flex-col gap-3">
      <section class="board-shell px-5 py-4 md:px-6 md:py-4">
        <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="board-kicker mb-3">Teacher Console</div>
            <h1 class="board-heading !text-[clamp(2.5rem,3.9vw,4rem)]">Attendance + Homework Input</h1>
            <p class="board-subcopy !text-sm md:!text-base">
              Mark student events and publish the night-study homework board from one place.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="info-pill">Input Mode</span>
            <span class="info-pill">{{ selectedCid ? `Class ${selectedCid}` : "Select Class" }}</span>
          </div>
        </div>

        <ClassSwitch @update:cid="handleClassChange" class="w-full" />
      </section>

      <main class="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <StudentEventSelector :cid="selectedCid" ref="studentListComponent" class="min-h-0" />
        <SubmitHomework :cid="selectedCid" class="min-h-0" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import ClassSwitch from "@/components/common/ClassSwitch.vue"
import StudentEventSelector from "@/components/student/StudentEventSelector.vue"
import SubmitHomework from "@/components/homework/SubmitHomework.vue"
import notificationService from "@/services/common/notification"

const { t: $t } = useI18n()

const selectedCid = ref(1)
const studentListComponent = ref(null)

function checkWechatBrowser() {
  const userAgent = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(userAgent)
}

function hasShownWechatTip() {
  return sessionStorage.getItem("edutrackly-cg8-5712-wechat-tip-shown") === "true"
}

function handleClassChange(newCid) {
  selectedCid.value = newCid
}

onMounted(() => {
  if (checkWechatBrowser() && !hasShownWechatTip()) {
    setTimeout(() => {
      notificationService.info($t("wechatTip.message"))
      sessionStorage.setItem("edutrackly-cg8-5712-wechat-tip-shown", "true")
    }, 1000)
  }
})
</script>
