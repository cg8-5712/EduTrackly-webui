<template>
  <div class="inline-block" ref="wrapperRef">
    <slot name="reference" :open="open"></slot>

    <teleport to="body">
      <transition name="fade-slide">
        <div
          v-if="isOpen"
          ref="popupRef"
          class="bg-gray-600 border border-gray-500 rounded-lg p-2 min-w-30 text-center text-white shadow-lg"
          :style="positionStyle"
          @mouseenter="onPopupEnter"
          @mouseleave="onPopupLeave"
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
const wrapperRef = ref(null)
let triggerEl = null
let isHoveringPopup = false
let closeTimer = null

const open = async (event) => {
  // 清除可能存在的关闭定时器
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }

  triggerEl = event.currentTarget
  if (!isOpen.value) {
    isOpen.value = true
    await nextTick()
    updatePosition()
  }
}

const close = () => {
  // 延迟关闭，给时间让鼠标移动到popup上
  closeTimer = setTimeout(() => {
    if (!isHoveringPopup) {
      isOpen.value = false
      triggerEl = null
    }
  }, 100)
}

const onPopupEnter = () => {
  isHoveringPopup = true
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

const onPopupLeave = () => {
  isHoveringPopup = false
  close()
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

  // 默认显示在元素下方，居中对齐
  let top = triggerRect.bottom + margin
  let left = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2

  // 保证不超出屏幕左右边界
  const minLeft = 8
  const maxLeft = window.innerWidth - popupRect.width - 8
  left = Math.max(minLeft, Math.min(maxLeft, left))

  // 如果超出底部屏幕，显示在上方
  if (top + popupRect.height > window.innerHeight) {
    top = triggerRect.top - popupRect.height - margin
  }

  positionStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onBeforeUnmount(() => {
  if (closeTimer) {
    clearTimeout(closeTimer)
  }
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
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
