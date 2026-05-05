<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup>
import { computed } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps({
  class: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "default",
  },
})

const variantClasses = {
  default: "border-white/10 bg-white/8 text-foreground",
  primary: "border-transparent bg-[rgba(var(--color-primary-rgb),0.16)] text-[var(--color-primary)]",
  warning: "border-transparent bg-[rgba(var(--color-secondary-rgb),0.16)] text-[var(--color-secondary)]",
  success: "border-transparent bg-[rgba(115,176,119,0.16)] text-[var(--color-success)]",
  danger: "border-transparent bg-[rgba(208,109,102,0.16)] text-[var(--color-error)]",
}

const classes = computed(() =>
  cn(
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
    variantClasses[props.variant] || variantClasses.default,
    props.class
  )
)
</script>
