<template>
  <MessageInfo />
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import MessageInfo from '@/components/common/MessageInfo.vue'
</script>

<style>
:root, html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #2d2d2d;
  overflow: hidden;
}
</style>