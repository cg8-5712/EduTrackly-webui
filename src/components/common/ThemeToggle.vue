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

/* 主题菜单 */
.theme-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--color-surface, #ffffff);
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.theme-menu-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  margin-bottom: 8px;
}

.menu-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  position: relative;
}

.theme-option:hover {
  background: var(--color-background, #f9fafb);
  transform: translateX(2px);
}

.theme-option.active {
  background: var(--theme-primary, var(--color-primary, #3b82f6));
  color: white;
}

.theme-option.active .theme-name {
  color: white;
  font-weight: 600;
}

.theme-color-preview {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.theme-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary, #111827);
  transition: color 0.2s ease;
}

.check-icon {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

/* 过渡动画 - 图标 */
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
    font-size: 20px;
  }

  .theme-menu {
    min-width: 200px;
  }

  .theme-option {
    padding: 8px 10px;
  }

  .theme-color-preview {
    width: 20px;
    height: 20px;
  }

  .theme-name {
    font-size: 13px;
  }
}
</style>
