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
  @apply relative inline-block;
}

.language-toggle-btn {
  @apply border-none rounded-lg cursor-pointer;
  @apply flex items-center justify-center;
  @apply transition-all duration-300 ease-in-out;
  width: 48px;  /* 固定宽度 */
  height: 48px; /* 固定高度 */
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-border); /* 添加边框 */
}

.language-toggle-btn:hover {
  @apply -translate-y-0.5;
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.language-icon {
  @apply font-bold select-none;
  font-size: 1.125rem; /* 增加字体大小 */
  line-height: 1;
}

/* 语言菜单 */
.language-menu {
  @apply absolute right-0 min-w-[180px] rounded-xl p-2 z-[1000];
  top: calc(100% + 8px);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
}

.language-option {
  @apply w-full py-2.5 px-4 border-none cursor-pointer;
  @apply flex items-center justify-between rounded-lg;
  @apply transition-all duration-200 ease-in-out text-sm;
  background: transparent;
  color: var(--color-text-primary);
}

.language-option:hover {
  background: var(--color-primary);
  color: white;
}

.language-option.active {
  @apply font-medium;
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
  color: var(--color-primary);
}

.language-option.active:hover {
  background: var(--color-primary);
  color: white;
}

.language-name {
  @apply flex-1 text-left;
}

.check-icon {
  @apply ml-2 text-base font-bold;
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
    @apply opacity-0 -translate-y-2.5;
  }
  to {
    @apply opacity-100 translate-y-0;
  }
}

@keyframes slideOut {
  from {
    @apply opacity-100 translate-y-0;
  }
  to {
    @apply opacity-0 -translate-y-2.5;
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .language-menu {
    @apply left-1/2 -translate-x-1/2;
    right: auto;
  }
}
</style>
