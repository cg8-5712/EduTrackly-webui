<template>
  <div :class="cn('px-5 pb-5 md:px-6 md:pb-6', $props.class)">
    <slot />
  </div>
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
