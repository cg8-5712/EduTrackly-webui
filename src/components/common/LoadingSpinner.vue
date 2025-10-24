<template>
  <div class="flex flex-col items-center justify-center p-5">
    <div
        class="border-8 border-gray-200 border-t-transparent border-r-transparent rounded-full animate-spin"
        :style="spinnerStyle"
    ></div>
    <p v-if="displayMessage" class="mt-2.5 text-sm text-gray-700 text-center">{{ displayMessage }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: [String, Number],
    default: 50, // 默认 50px
  },
  color: {
    type: String,
    default: '#42b983', // 默认 Vue 绿色
  },
  message: {
    type: String,
    default: '',
  },
});

const displayMessage = computed(() => {
  return t('common.loading') || props.message;
});

const spinnerStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  borderTopColor: props.color,
}));
</script>

<style>
</style>
