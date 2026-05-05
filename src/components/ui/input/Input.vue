<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    :class="classes"
    @input="emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
import { computed } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
})
const emit = defineEmits(["update:modelValue"])

const classes = computed(() =>
  cn(
    "flex h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm",
    "focus-visible:ring-4 focus-visible:ring-ring",
    props.class
  )
)
</script>
