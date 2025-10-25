<template>
  <div
    class="language-toggle"
    @mouseenter="showLanguageMenu = true"
    @mouseleave="showLanguageMenu = false"
    @click.stop
  >
    <!-- 语言切换按钮 -->
    <button
      @click.stop="toggleLanguage"
      class="language-toggle-btn"
      :title="currentLanguage.name"
    >
      <span class="language-icon">{{ currentLanguage.shortName }}</span>
    </button>

    <!-- 语言菜单 -->
    <transition name="slide-fade">
      <div v-if="showLanguageMenu" class="language-menu" @click.stop>
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          @click.stop="selectLanguage(lang.code)"
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
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  width: 48px;
  height: 48px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-border);
}

.language-toggle-btn:hover {
  transform: translateY(-2px);
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.language-icon {
  font-weight: bold;
  user-select: none;
  font-size: 1.125rem;
  line-height: 1;
}

/* 语言菜单 */
.language-menu {
  position: absolute;
  right: 0;
  min-width: 180px;
  border-radius: 0.75rem;
  padding: 0.5rem;
  z-index: 1000;
  top: calc(100% + 8px);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
}

.language-option {
  width: 100%;
  padding: 0.625rem 1rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  font-size: 0.875rem;
  background: transparent;
  color: var(--color-text-primary);
}

.language-option:hover {
  background: var(--color-primary);
  color: white;
}

.language-option.active {
  font-weight: 500;
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
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
  margin-left: 0.5rem;
  font-size: 1rem;
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
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}
</style>
