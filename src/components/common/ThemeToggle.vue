<template>
  <div class="theme-toggle">
    <button
      @click="toggleTheme"
      class="theme-toggle-btn"
      :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      :class="{ 'is-dark': isDark }"
    >
      <transition name="fade" mode="out-in">
        <span v-if="isDark" key="dark" class="theme-icon">🌙</span>
        <span v-else key="light" class="theme-icon">☀️</span>
      </transition>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import themeService from '@/services/common/theme'

// 计算属性
const isDark = computed(() => themeService.isDark())

// 切换主题
const toggleTheme = () => {
  themeService.toggleTheme()
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary, #3b82f6);
}

.theme-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn.is-dark {
  background: var(--color-surface, #1f2937);
  border-color: var(--color-border, #374151);
}

.theme-icon {
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-btn:hover .theme-icon {
  transform: scale(1.1);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle-btn {
    width: 44px;
    height: 44px;
  }

  .theme-icon {
    font-size: 20px;
  }
}
</style>
