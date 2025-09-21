<template>
  <div class="spinner-container">
    <div
        class="spinner"
        :style="spinnerStyle"
    ></div>
    <p v-if="displayMessage" class="spinner-message">{{ displayMessage }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: [String, Number],
    default: 50,
  },
  color: {
    type: String,
    default: '#42b983',
  },
  // 传入 i18n key
  messageKey: {
    type: String,
    default: 'components.loadingSpinner.loading',
  },
});

const displayMessage = computed(() => {
  return t(props.messageKey);
});

const spinnerStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  borderTopColor: props.color,
}));
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  animation: spin 1s linear infinite;
}

.spinner-message {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
