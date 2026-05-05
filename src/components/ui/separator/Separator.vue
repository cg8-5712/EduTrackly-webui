<template>
  <div
    :class="classes"
    role="separator"
  />
</template>

<script setup>
import { computed } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps({
  class: {
    type: String,
    default: "",
  },
  orientation: {
    type: String,
    default: "horizontal",
  },
})

const classes = computed(() =>
  cn(
    props.orientation === "vertical"
      ? "h-full w-px bg-white/10"
      : "h-px w-full bg-white/10",
    props.class
  )
)
</script>
