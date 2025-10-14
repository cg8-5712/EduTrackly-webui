<template>
  <div class="fixed top-5 right-5 z-[1000] flex flex-col gap-2.5" aria-live="assertive">
    <transition
      enter-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-y-2.5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2.5"
    >
      <div
          v-if="notificationService.state.show"
          class="flex flex-col min-w-[400px] max-w-[600px] shadow-2xl text-white font-normal relative border-2 rounded-xl overflow-hidden"
          :class="{
            'bg-green-600 border-green-500': notificationService.state.type === 'success',
            'bg-blue-600 border-blue-500': notificationService.state.type === 'info',
            'bg-red-600 border-red-500': notificationService.state.type === 'error',
            'bg-gray-700 border-gray-600': !['success', 'info', 'error'].includes(notificationService.state.type)
          }"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
      >
        <!-- 主要内容区域 -->
        <div class="flex items-center p-5">
          <div class="mr-4 w-8 h-8 flex-shrink-0 animate-bounce">
            <CheckCircleIcon v-if="notificationService.state.type === 'success'" class="w-full h-full" />
            <InformationCircleIcon v-else-if="notificationService.state.type === 'info'" class="w-full h-full" />
            <XCircleIcon v-else class="w-full h-full animate-pulse" />
          </div>
          <div class="flex-1 text-xl leading-relaxed">
            {{ notificationService.state.message }}
          </div>
          <button class="bg-transparent border-0 text-white cursor-pointer flex items-center ml-4 hover:bg-white/20 rounded-lg p-1 transition-all duration-200 active:scale-90" @click="notificationService.close">
            <XMarkIcon class="w-6 h-6" />
            <span class="sr-only">关闭</span>
          </button>
        </div>

        <!-- 进度条 -->
        <div class="h-1 bg-black/20 relative">
          <div
            class="h-full bg-white/80 transition-all duration-100 ease-linear"
            :style="{ width: notificationService.state.progress + '%' }"
          ></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon, InformationCircleIcon } from '@heroicons/vue/20/solid'
import notificationService from '@/services/common/notification'

// 鼠标悬停事件处理
const handleMouseEnter = () => {
  notificationService.pause()
}

const handleMouseLeave = () => {
  notificationService.resume()
}
</script>

<style>
</style>
