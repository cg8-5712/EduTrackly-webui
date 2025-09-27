<template>
  <div class="h-full w-full m-0 p-0 bg-gray-800 overflow-hidden">
    <MessageInfo />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import MessageInfo from '@/components/common/MessageInfo.vue'
</script>

<style>
</style>