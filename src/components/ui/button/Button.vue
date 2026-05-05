<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
    <slot />
  </button>
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
  size: {
    type: String,
    default: "default",
  },
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
})

const variantClasses = {
  default:
    "bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(var(--color-primary-rgb),0.16)] hover:brightness-110",
  outline:
    "border border-white/10 bg-white/5 text-foreground hover:bg-white/8 hover:border-white/16",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-[rgba(var(--color-secondary-rgb),0.2)]",
  ghost: "text-foreground hover:bg-white/6",
  muted: "bg-muted text-muted-foreground hover:text-foreground",
  danger:
    "bg-destructive text-destructive-foreground shadow-[0_14px_24px_rgba(130,32,32,0.16)] hover:brightness-110",
  link: "px-0 py-0 h-auto rounded-none text-[var(--color-primary)] underline-offset-4 hover:underline",
}

const sizeClasses = {
  sm: "h-9 px-3.5 text-sm",
  default: "h-11 px-5 text-sm md:text-base",
  lg: "h-13 px-6 text-base md:text-lg",
  icon: "h-11 w-11 px-0",
}

const classes = computed(() =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] transition duration-200 disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
    variantClasses[props.variant] || variantClasses.default,
    sizeClasses[props.size] || sizeClasses.default,
    props.block && "w-full",
    props.class
  )
)
</script>
