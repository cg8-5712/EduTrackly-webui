<template>
  <section :class="classes">
    <slot />
  </section>
</template>

<script setup>
import { computed } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps({
  class: {
    type: String,
    default: "",
  },
})

const classes = computed(() =>
  cn("board-shell text-card-foreground", props.class)
)
</script>
