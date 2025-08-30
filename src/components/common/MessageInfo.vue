<template>
  <div class="message-container" aria-live="assertive">
    <transition name="fade-slide">
      <div
          v-if="notificationService.state.show"
          class="message-box"
          :class="notificationService.state.type"
      >
        <div class="message-content">
          <div class="icon">
            <CheckCircleIcon v-if="notificationService.state.type === 'success'" />
            <InformationCircleIcon v-else-if="notificationService.state.type === 'info'" />
            <XCircleIcon v-else />
          </div>
          <div class="message-text">
            {{ notificationService.state.message }}
          </div>
          <button class="close-btn" @click="notificationService.close">
            <XMarkIcon />
            <span class="sr-only">{{ $t('components.messageInfo.close') }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon, InformationCircleIcon } from '@heroicons/vue/20/solid'
import notificationService from '@/services/common/notification'
</script>

<style scoped>
.message-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-box {
  display: flex;
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 250px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: #fff;
  font-weight: 500;
  align-items: center;
  position: relative;
  background-color: #333; /* 默认颜色，后续根据 type 覆盖 */
}

.message-box.success { background-color: #22c55e; } /* green */
.message-box.info { background-color: #3b82f6; }    /* blue */
.message-box.error { background-color: #ef4444; }   /* red */

.message-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.icon {
  margin-right: 12px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.message-text {
  flex: 1;
}

.close-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

/* 动画 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
