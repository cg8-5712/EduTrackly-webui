<template>
  <div class="inline-block">
    <slot name="reference" :open="open"></slot>

    <teleport to="body">
      <transition name="fade-slide">
        <div
          v-if="isOpen"
          ref="popupRef"
          class="bg-gray-600 border border-gray-500 rounded-lg p-2 min-w-30 text-center text-white shadow-lg"
          :style="positionStyle"
        >
          <slot />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const positionStyle = ref({})
const popupRef = ref(null)
let triggerEl = null

const open = async (event) => {
  triggerEl = event.currentTarget
  if (!isOpen.value) {
    isOpen.value = true
    await nextTick()
    updatePosition()
  }
}

// 点击外部关闭 popup
const handleClickOutside = (event) => {
  if (!popupRef.value || !triggerEl) return

  const isClickInsidePopup = popupRef.value.contains(event.target)
  const isClickOnTrigger = triggerEl.contains(event.target)

  // 点击在 popup 内或者触发元素内，不关闭
  if (isClickInsidePopup || isClickOnTrigger) return

  isOpen.value = false
  triggerEl = null
}

const updatePosition = () => {
  if (!triggerEl || !popupRef.value) return

  const triggerRect = triggerEl.getBoundingClientRect()
  const popupEl = popupRef.value
  const popupRect = popupEl.getBoundingClientRect()
  const margin = 8

  let top = triggerRect.bottom + window.scrollY + margin
  let left = triggerRect.left + window.scrollX + triggerRect.width / 2

  // 保证不超出屏幕左右
  left = Math.max(popupRect.width / 2 + 8, left)
  left = Math.min(window.innerWidth - popupRect.width / 2 - 8, left)

  // 超出底部屏幕显示在上方
  if (top + popupRect.height > window.scrollY + window.innerHeight) {
    top = triggerRect.top + window.scrollY - popupRect.height - margin
  }

  positionStyle.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    transform: 'translateX(-50%)',
    zIndex: 9999
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
