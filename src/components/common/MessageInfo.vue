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
          class="flex items-center p-3 rounded-lg min-w-[250px] shadow-lg text-white font-medium relative"
          :class="{
            'bg-green-500': notificationService.state.type === 'success',
            'bg-blue-500': notificationService.state.type === 'info',
            'bg-red-500': notificationService.state.type === 'error',
            'bg-gray-700': !['success', 'info', 'error'].includes(notificationService.state.type)
          }"
      >
        <div class="flex items-center w-full">
          <div class="mr-3 w-6 h-6 flex-shrink-0">
            <CheckCircleIcon v-if="notificationService.state.type === 'success'" />
            <InformationCircleIcon v-else-if="notificationService.state.type === 'info'" />
            <XCircleIcon v-else />
          </div>
          <div class="flex-1">
            {{ notificationService.state.message }}
          </div>
          <button class="bg-transparent border-0 text-white cursor-pointer flex items-center ml-3" @click="notificationService.close">
            <XMarkIcon class="w-5 h-5" />
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

<style>
</style>
