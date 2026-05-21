<template>
  <div
    class="relative"
    @mouseenter="showLanguageMenu = true"
    @mouseleave="showLanguageMenu = false"
  >
    <Button
      variant="outline"
      size="icon"
      class="!rounded-full"
      @click.stop="toggleLanguage"
    >
      <span class="text-sm font-semibold tracking-[0.18em]">{{ currentLanguage.shortName }}</span>
    </Button>

    <transition name="fade">
      <div
        v-if="showLanguageMenu"
        class="topbar-popover board-shell absolute right-0 top-[calc(100%+0.75rem)] min-w-[14rem] p-3"
      >
        <div class="mb-2 px-2">
          <p class="board-kicker mb-2">Language</p>
          <p class="panel-caption">{{ currentLanguage.name }}</p>
        </div>
        <div class="space-y-2">
          <button
            v-for="language in availableLanguages"
            :key="language.code"
            type="button"
            class="flex w-full items-center justify-between rounded-2xl border border-white/8 px-3 py-3 text-sm hover:bg-white/6"
            :class="{
              'bg-[rgba(var(--color-primary-rgb),0.16)] border-[rgba(var(--color-primary-rgb),0.22)]': language.code === currentLocale,
            }"
            @click.stop="selectLanguage(language.code)"
          >
            <span>{{ language.name }}</span>
            <span class="text-[var(--color-text-tertiary)]">{{ language.shortName }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import i18nService from "@/services/common/i18n"
import Button from "@/components/ui/button/Button.vue"

const showLanguageMenu = ref(false)

const currentLocale = computed(() => i18nService.getCurrentLocale())
const currentLanguage = computed(() => i18nService.getCurrentLanguage())
const availableLanguages = computed(() => i18nService.getAvailableLanguages())

function toggleLanguage() {
  i18nService.toggleLanguage()
}

function selectLanguage(locale) {
  i18nService.setLanguage(locale)
  showLanguageMenu.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
