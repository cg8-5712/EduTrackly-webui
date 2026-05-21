<template>
  <div class="version-info" :class="{ compact }">
    <div v-if="!compact" class="version-detail">
      <div v-for="item in detailItems" :key="item.label" class="version-item">
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
    <div v-else class="version-compact">
      <span class="compact-label">Build</span>
      <span class="compact-value">{{ versionString }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { version, getVersionString, getBuildTimeString } from "@/utils/version"

const props = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})

const versionString = computed(() => getVersionString())
const buildTimeString = computed(() => getBuildTimeString())

const detailItems = computed(() => [
  {
    label: "Version",
    value: version.version,
  },
  {
    label: "Build",
    value: `#${version.buildNumber}`,
  },
  {
    label: "Time",
    value: buildTimeString.value,
  },
  {
    label: "Branch",
    value: version.gitBranch,
  },
  {
    label: "Path",
    value: version.basePath,
  },
])
</script>

<style scoped>
.version-info {
  font-family:
    "Consolas",
    "Cascadia Mono",
    "Microsoft YaHei UI",
    monospace;
  color: var(--color-text-secondary);
}

.version-detail {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}

.version-item {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
  padding: 1rem 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.35rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(255, 255, 255, 0.03);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.value {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--foreground);
}

.version-compact {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.72rem;
  line-height: 1;
}

.compact-label {
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.compact-value {
  color: var(--foreground);
}

.version-info.compact {
  font-size: 11px;
}
</style>
