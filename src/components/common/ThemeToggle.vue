<template>
  <div class="theme-toggle" @mouseenter="showThemeMenu = true" @mouseleave="showThemeMenu = false" @click.stop>
    <button
      @click.stop="toggleTheme"
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
      <div v-if="showThemeMenu" class="theme-menu" @click.stop>
        <div class="theme-menu-header">
          <span class="menu-title">{{ isDark ? '暗色主题' : '亮色主题' }}</span>
        </div>
        <div class="theme-options">
          <button
            v-for="theme in availableThemes"
            :key="theme.id"
            @click.stop="selectTheme(theme.id)"
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
/* 主题切换按钮 */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-out;
  width: 48px;
  height: 48px;
  border: 2px solid var(--color-border, #e5e7eb);
  background: var(--color-surface, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-out;
  font-size: 1.5rem;
  line-height: 1;
}

.theme-toggle-btn:hover .theme-icon {
  transform: scale(1.1);
}

/* 主题菜单 */
.theme-menu {
  position: absolute;
  right: 0;
  min-width: 220px;
  border-radius: 0.75rem;
  padding: 0.5rem;
  z-index: 1000;
  top: calc(100% + 8px);
  background: var(--color-surface, #ffffff);
  border: 2px solid var(--color-border, #e5e7eb);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.theme-menu-header {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.menu-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;
  text-align: left;
  width: 100%;
  background: transparent;
}

.theme-option:hover {
  transform: translateX(2px);
  background: var(--color-background, #f9fafb);
}

.theme-option.active {
  color: white;
  font-weight: 600;
  background: var(--theme-primary, var(--color-primary, #3b82f6));
}

.theme-option.active .theme-name {
  color: white;
  font-weight: 600;
}

.theme-color-preview {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.theme-name {
  flex: 1;
  font-size: 0.875rem;
  transition: color 0.2s;
  color: var(--color-text-primary, #111827);
}

.check-icon {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

/* 过渡动画 - 图标 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}

/* 过渡动画 - 菜单 */
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
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
    min-width: 200px;
  }

  .theme-option {
    padding: 0.5rem 0.625rem;
  }

  .theme-color-preview {
    width: 1.25rem;
    height: 1.25rem;
  }

  .theme-name {
    font-size: 0.8125rem;
  }
}
</style>
