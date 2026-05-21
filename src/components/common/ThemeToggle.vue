<template>
  <div
    class="relative"
    @mouseenter="showThemeMenu = true"
    @mouseleave="showThemeMenu = false"
  >
    <Button
      variant="outline"
      size="icon"
      class="!rounded-full"
      @click.stop="toggleTheme"
    >
      <span class="text-lg">{{ isDark ? "MN" : "LT" }}</span>
    </Button>

    <transition name="fade">
      <div
        v-if="showThemeMenu"
        class="topbar-popover board-shell absolute right-0 top-[calc(100%+0.75rem)] min-w-[18rem] p-3"
      >
        <div class="mb-3 px-2">
          <p class="board-kicker mb-2">{{ isDark ? "Night Themes" : "Light Theme" }}</p>
          <p class="panel-caption">{{ currentTheme?.description }}</p>
        </div>
        <div class="space-y-2">
          <button
            v-for="theme in availableThemes"
            :key="theme.id"
            type="button"
            class="flex w-full items-center gap-3 rounded-2xl border border-white/8 px-3 py-3 text-left hover:bg-white/6"
            :class="{
              'bg-[rgba(var(--color-primary-rgb),0.16)] border-[rgba(var(--color-primary-rgb),0.22)]': currentThemeId === theme.id,
            }"
            @click.stop="selectTheme(theme.id)"
          >
            <span
              class="h-4 w-4 rounded-full border border-white/10"
              :style="{ background: theme.colors.primary }"
            />
            <span class="flex-1">
              <span class="block text-sm font-medium text-foreground">{{ theme.name }}</span>
              <span class="block text-xs text-[var(--color-text-secondary)]">{{ theme.description }}</span>
            </span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import themeService from "@/services/common/theme"
import Button from "@/components/ui/button/Button.vue"

const showThemeMenu = ref(false)

const isDark = computed(() => themeService.getThemeMode() === "dark")
const currentThemeId = computed(() => themeService.getCurrentThemeId())
const currentTheme = computed(() => themeService.getCurrentTheme())
const availableThemes = computed(() =>
  isDark.value ? themeService.getDarkThemes() : themeService.getLightThemes()
)

function toggleTheme() {
  themeService.toggleTheme()
}

function selectTheme(themeId) {
  themeService.setTheme(themeId)
  showThemeMenu.value = false
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
