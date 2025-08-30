<template>
  <MessageInfo />
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import MessageInfo from '@/components/common/MessageInfo.vue'
</script>
