<template>
  <div
    class="language-toggle"
    @mouseenter="showLanguageMenu = true"
    @mouseleave="showLanguageMenu = false"
  >
    <!-- 语言切换按钮 -->
    <button
      @click="toggleLanguage"
      class="language-toggle-btn"
      :title="currentLanguage.name"
    >
      <span class="language-icon">{{ currentLanguage.shortName }}</span>
    </button>

    <!-- 语言菜单 -->
    <transition name="slide-fade">
      <div v-if="showLanguageMenu" class="language-menu">
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="language-option"
          :class="{ active: lang.code === currentLocale }"
        >
          <span class="language-name">{{ lang.name }}</span>
          <span v-if="lang.code === currentLocale" class="check-icon">✓</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import i18nService from '@/services/common/i18n'

// 显示语言菜单
const showLanguageMenu = ref(false)

// 当前语言
const currentLocale = computed(() => i18nService.getCurrentLocale())
const currentLanguage = computed(() => i18nService.getCurrentLanguage())

// 可用语言列表
const availableLanguages = computed(() => i18nService.getAvailableLanguages())

// 切换语言（循环切换）
const toggleLanguage = () => {
  i18nService.toggleLanguage()
}

// 选择指定语言
const selectLanguage = (locale) => {
  i18nService.setLanguage(locale)
  showLanguageMenu.value = false
}
</script>

<style scoped>
.language-toggle {
  position: relative;
  display: inline-block;
}

.language-toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.language-toggle-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.language-icon {
  font-size: 14px;
  font-weight: 600;
  user-select: none;
}

/* 语言菜单 */
.language-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 8px;
  z-index: 1000;
  border: 1px solid var(--color-border);
}

.language-option {
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.language-option:hover {
  background: var(--color-primary);
  color: white;
}

.language-option.active {
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.language-option.active:hover {
  background: var(--color-primary);
  color: white;
}

.language-name {
  flex: 1;
  text-align: left;
}

.check-icon {
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
}

/* 过渡动画 */
.slide-fade-enter-active {
  animation: slideIn 0.2s ease;
}

.slide-fade-leave-active {
  animation: slideOut 0.15s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .language-menu {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
