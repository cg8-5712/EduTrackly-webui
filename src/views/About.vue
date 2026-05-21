<template>
  <div class="min-h-screen w-full p-3 md:p-4">
    <div class="mx-auto max-w-[1600px] space-y-3">
      <section class="board-shell p-5 md:p-7">
        <div class="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_24rem] xl:items-start">
          <div>
            <div class="board-kicker mb-3">Project Archive</div>
            <h1 class="board-heading">{{ $t("about.title") }}</h1>
            <p class="board-subcopy">
              A classroom-facing study board with attendance, homework, countdown, and admin management.
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span v-for="fact in projectFacts" :key="fact.label" class="info-pill !px-3 !py-1.5">
                <span class="text-[var(--color-text-tertiary)]">{{ fact.label }}</span>
                <span class="text-foreground">{{ fact.value }}</span>
              </span>
            </div>
          </div>

          <section class="rounded-[1.8rem] border border-white/8 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div class="mb-4 flex items-start justify-between gap-3">
              <div>
                <div class="board-kicker mb-2">Maintainer Snapshot</div>
                <h2 class="text-2xl font-semibold tracking-[-0.04em] text-foreground">{{ primaryMember.name }}</h2>
              </div>
              <Button variant="outline" @click="goBack">{{ $t("about.backToHome") }}</Button>
            </div>

            <div class="flex items-center gap-4">
              <img
                :src="primaryMember.image"
                alt="maintainer avatar"
                class="h-28 w-28 rounded-[1.8rem] border border-white/10 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
              >
              <div class="min-w-0 flex-1">
                <p class="text-sm uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                  {{ primaryMember.position }}
                </p>
                <p class="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {{ primaryMember.description }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <a :href="primaryMember.github" target="_blank" class="info-pill no-underline">GitHub</a>
              <a :href="primaryMember.telegram" target="_blank" class="info-pill no-underline">Telegram</a>
              <a :href="primaryMember.website" target="_blank" class="info-pill no-underline">Email</a>
            </div>
          </section>
        </div>
      </section>

      <div class="grid gap-3 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section class="board-shell p-5 md:p-6">
          <div class="mb-5">
            <div class="board-kicker mb-2">{{ $t("about.versionSection") }}</div>
            <h2 class="panel-title">Release Archive</h2>
          </div>

          <div class="mb-5 rounded-[1.6rem] border border-white/8 bg-[linear-gradient(135deg,rgba(var(--color-primary-rgb),0.14),rgba(var(--color-secondary-rgb),0.1))] p-5">
            <div class="mb-2 text-xs uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              Current Snapshot
            </div>
            <p class="text-xl font-semibold text-foreground">{{ versionHeadline }}</p>
            <p class="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              Version, build, branch, and deployment path stay visible here so the whiteboard build is easy to verify on site.
            </p>
          </div>

          <VersionInfo :compact="false" />
        </section>

        <div class="space-y-3">
          <section class="board-shell p-5 md:p-6">
            <div class="mb-5">
              <div class="board-kicker mb-2">{{ $t("about.techStackSection") }}</div>
              <h2 class="panel-title">Built for display and control</h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(row, index) in tagRows"
                :key="index"
                class="rounded-[1.5rem] border border-white/8 bg-white/5 p-4"
              >
                <div class="mb-3 text-xs uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
                  Layer {{ index + 1 }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in row.tags"
                    :key="tag"
                    class="rounded-full border px-3 py-1.5 text-sm"
                    :style="{
                      borderColor: row.colors.text,
                      backgroundColor: row.colors.background,
                      color: row.colors.text,
                    }"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section class="board-shell p-5 md:p-6">
            <div class="mb-5">
              <div class="board-kicker mb-2">{{ $t("about.licenseSection") }}</div>
              <h2 class="panel-title">{{ $t("about.license.title") }}</h2>
            </div>
            <p class="mb-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              {{ $t("about.license.description") }}
            </p>
            <div class="grid gap-3 md:grid-cols-3">
              <div class="rounded-[1.4rem] border border-white/8 bg-white/5 p-4">
                <div class="mb-2 text-sm font-semibold text-foreground">{{ $t("about.license.freedom") }}</div>
                <p class="text-sm leading-6 text-muted-foreground">{{ $t("about.license.freedomDesc") }}</p>
              </div>
              <div class="rounded-[1.4rem] border border-white/8 bg-white/5 p-4">
                <div class="mb-2 text-sm font-semibold text-foreground">{{ $t("about.license.copyleft") }}</div>
                <p class="text-sm leading-6 text-muted-foreground">{{ $t("about.license.copyleftDesc") }}</p>
              </div>
              <div class="rounded-[1.4rem] border border-white/8 bg-white/5 p-4">
                <div class="mb-2 text-sm font-semibold text-foreground">{{ $t("about.license.disclosure") }}</div>
                <p class="text-sm leading-6 text-muted-foreground">{{ $t("about.license.disclosureDesc") }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import VersionInfo from "@/components/VersionInfo.vue"
import Button from "@/components/ui/button/Button.vue"
import { getVersionString, version } from "@/utils/version"

const router = useRouter()

function goBack() {
  router.back()
}

const team = [
  {
    name: "Cg8-5712",
    position: "Full-Stack Developer",
    description: "Nothing is impossible with Docker!",
    image:
      "https://cn.cravatar.com/avatar/4ca6db8f5673f5f001c5901fc04b2322ff304b13c9b805576ddf47e310a481dc?s=512",
    github: "https://github.com/cg8-5712",
    telegram: "http://cg85712.t.me",
    website: "mailto:5712.cg8@gmail.com",
  },
]

const primaryMember = team[0]

const projectFacts = computed(() => [
  { label: "Version", value: `v${version.version}` },
  { label: "Build", value: `#${version.buildNumber}` },
  { label: "Branch", value: version.gitBranch },
])

const versionHeadline = computed(() => `${getVersionString()} · ${version.gitBranch}`)

const tagRows = [
  {
    tags: ["Vue.js", "Vite", "Tailwind CSS", "vue-router", "vue-i18n", "yarn"],
    colors: {
      background: "rgba(137,184,111,0.14)",
      text: "#cfe5c2",
    },
  },
  {
    tags: ["Axios", "JWT", "Chart.js", "ECharts", "xlsx", "Docker"],
    colors: {
      background: "rgba(121,167,160,0.14)",
      text: "#d6eeea",
    },
  },
  {
    tags: ["Classroom Board", "Homework", "Attendance", "Countdown", "Admin Console"],
    colors: {
      background: "rgba(211,170,103,0.16)",
      text: "#f1ddbb",
    },
  },
]
</script>
