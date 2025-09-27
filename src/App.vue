<template>
  <div class="min-h-screen h-screen w-full m-0 p-0 bg-gray-900 overflow-hidden">
    <MessageInfo />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import MessageInfo from '@/components/common/MessageInfo.vue'
</script>

<style>
/* 确保全屏显示 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}
</style>