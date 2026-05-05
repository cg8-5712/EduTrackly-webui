<template>
  <div class="flex flex-col items-center justify-center gap-3 p-5">
    <div
      class="rounded-full border-[6px] border-white/8 border-t-transparent border-r-transparent animate-spin"
      :style="spinnerStyle"
    />
    <p
      v-if="displayMessage"
      class="text-center text-sm text-[var(--color-text-secondary)]"
    >
      {{ displayMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  size: {
    type: [String, Number],
    default: 50,
  },
  color: {
    type: String,
    default: "var(--color-primary)",
  },
  message: {
    type: String,
    default: "",
  },
})

function resolveSize(size) {
  if (typeof size === "number") {
    return `${size}px`
  }

  if (size === "small") {
    return "22px"
  }

  if (size === "large") {
    return "64px"
  }

  return size || "50px"
}

const displayMessage = computed(() => props.message || t("common.loading"))

const spinnerStyle = computed(() => ({
  width: resolveSize(props.size),
  height: resolveSize(props.size),
  borderTopColor: props.color,
}))
</script>
