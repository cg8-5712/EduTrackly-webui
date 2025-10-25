<template>
  <div class="theme-toggle" @mouseenter="showThemeMenu = true" @mouseleave="showThemeMenu = false">
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

    <!-- 主题色选择面板 -->
    <transition name="slide-fade">
      <div v-if="showThemeMenu" class="theme-menu">
        <div class="theme-menu-header">
          <span class="menu-title">{{ isDark ? '暗色主题' : '亮色主题' }}</span>
        </div>
        <div class="theme-options">
          <button
            v-for="theme in availableThemes"
            :key="theme.id"
            @click="selectTheme(theme.id)"
            class="theme-option"
            :class="{ active: currentThemeId === theme.id }"
            :style="{ '--theme-primary': theme.colors.primary }"
            :title="theme.description"
          >
            <div class="theme-color-preview" :style="{ background: theme.colors.primary }"></div>
            <span class="theme-name">{{ theme.name }}</span>
            <span v-if="currentThemeId === theme.id" class="check-icon">✓</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import themeService from '@/services/common/theme'

// 响应式状态
const showThemeMenu = ref(false)

// 计算属性
const isDark = computed(() => themeService.getThemeMode() === 'dark')
const currentThemeId = computed(() => themeService.getCurrentThemeId())

// 获取可用的主题列表(根据当前模式)
const availableThemes = computed(() => {
  return isDark.value ? themeService.getDarkThemes() : themeService.getLightThemes()
})

// 切换亮/暗模式
const toggleTheme = () => {
  themeService.toggleTheme()
}

// 选择特定主题
const selectTheme = (themeId) => {
  themeService.setTheme(themeId)
  showThemeMenu.value = false
}
</script>

<style scoped>
/* 主题切换按钮 - 使用Tailwind类和CSS变量 */
.theme-toggle {
  @apply inline-flex items-center justify-center relative;
}

.theme-toggle-btn {
  @apply flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden;
  @apply transition-all duration-300 ease-out;
  width: 48px;  /* 固定宽度，与 LanguageToggle 一致 */
  height: 48px; /* 固定高度 */
  border: 2px solid var(--color-border, #e5e7eb);
  background: var(--color-surface, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn:hover {
  @apply -translate-y-0.5;
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-toggle-btn:active {
  @apply translate-y-0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn.is-dark {
  background: var(--color-surface, #1f2937);
  border-color: var(--color-border, #374151);
}

.theme-icon {
  @apply flex items-center justify-center;
  @apply transition-transform duration-300 ease-out;
  font-size: 1.5rem; /* 增加图标大小 */
  line-height: 1;
}

.theme-toggle-btn:hover .theme-icon {
  @apply scale-110;
}

/* 主题菜单 */
.theme-menu {
  @apply absolute right-0 min-w-[220px] rounded-xl p-2 z-[1000];
  top: calc(100% + 8px);
  background: var(--color-surface, #ffffff);
  border: 2px solid var(--color-border, #e5e7eb);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.theme-menu-header {
  @apply py-2 px-3 mb-2;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.menu-title {
  @apply text-sm font-semibold;
  color: var(--color-text-primary, #111827);
}

.theme-options {
  @apply flex flex-col gap-1;
}

.theme-option {
  @apply flex items-center gap-3 py-2.5 px-3 border-none rounded-lg cursor-pointer relative;
  @apply transition-all duration-200 ease-in-out text-left w-full;
  background: transparent;
}

.theme-option:hover {
  @apply translate-x-0.5;
  background: var(--color-background, #f9fafb);
}

.theme-option.active {
  @apply text-white font-semibold;
  background: var(--theme-primary, var(--color-primary, #3b82f6));
}

.theme-option.active .theme-name {
  @apply text-white font-semibold;
}

.theme-color-preview {
  @apply w-6 h-6 rounded-md flex-shrink-0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.theme-name {
  @apply flex-1 text-sm transition-colors duration-200;
  color: var(--color-text-primary, #111827);
}

.check-icon {
  @apply text-base font-bold text-white;
}

/* 过渡动画 - 图标 */
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.fade-enter-from {
  @apply opacity-0 scale-80 -rotate-90;
}

.fade-leave-to {
  @apply opacity-0 scale-80 rotate-90;
}

/* 过渡动画 - 菜单 */
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  @apply opacity-0 -translate-y-2 scale-95;
}

.slide-fade-leave-to {
  @apply opacity-0 -translate-y-1 scale-98;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle-btn {
    width: 44px;
    height: 44px;
  }

  .theme-icon {
    font-size: 1.25rem;
  }

  .theme-menu {
    @apply min-w-[200px];
  }

  .theme-option {
    @apply py-2 px-2.5;
  }

  .theme-color-preview {
    @apply w-5 h-5;
  }

  .theme-name {
    @apply text-[13px];
  }
}
</style>
