<template>
  <h3 :class="cn('font-display text-2xl font-semibold tracking-[-0.03em] text-card-foreground', $props.class)">
    <slot />
  </h3>
</template>

<script setup>
import { cn } from "@/lib/utils"

defineProps({
  class: {
    type: String,
    default: "",
  },
})
</script>
