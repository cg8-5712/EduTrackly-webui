<template>
  <div class="app-container">
    <MessageInfo />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'
import MessageInfo from '@/components/common/MessageInfo.vue'
import themeService from '@/services/common/theme'

const route = useRoute()

// 监听路由变化，判断是否在 admin 页面
watch(
  () => route.path,
  (newPath) => {
    const isAdmin = newPath.startsWith('/admin')
    themeService.setIsAdmin(isAdmin)
  },
  { immediate: true }
)

// 初始化主题
onMounted(() => {
  const isAdmin = route.path.startsWith('/admin')
  themeService.setIsAdmin(isAdmin)
})
</script>

<style>
@import '@/assets/styles/theme.css';

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

.app-container {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: background-color var(--transition-base), color var(--transition-base);
}
</style>