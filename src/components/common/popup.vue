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
let scrollContainer = null

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
    // 使用 requestAnimationFrame 确保 DOM 完全渲染后再计算位置
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePosition()
      })
    })

    // 找到滚动容器并添加监听
    findScrollContainer()
  }
}

const close = () => {
  // 延迟关闭，给时间让鼠标移动到popup上
  closeTimer = setTimeout(() => {
    if (!isHoveringPopup) {
      isOpen.value = false
      triggerEl = null
      removeScrollListener()
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

// 找到滚动容器
const findScrollContainer = () => {
  if (!triggerEl) return

  let element = triggerEl.parentElement
  while (element) {
    const overflow = window.getComputedStyle(element).overflow
    const overflowY = window.getComputedStyle(element).overflowY

    if (overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
      scrollContainer = element
      scrollContainer.addEventListener('scroll', updatePosition)
      break
    }
    element = element.parentElement
  }
}

// 移除滚动监听
const removeScrollListener = () => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', updatePosition)
    scrollContainer = null
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
  removeScrollListener()
}

const updatePosition = () => {
  if (!triggerEl || !popupRef.value) return

  // 获取学生姓名元素的位置信息
  const triggerRect = triggerEl.getBoundingClientRect()
  const popupEl = popupRef.value
  const popupRect = popupEl.getBoundingClientRect()

  const gap = 8 // 弹窗与触发元素之间的间距

  // 计算弹窗位置：
  // 1. 垂直位置：默认显示在学生姓名的正下方
  let top = triggerRect.bottom + gap

  // 2. 水平位置：弹窗中心对齐学生姓名中心
  let left = triggerRect.left + (triggerRect.width / 2) - (popupRect.width / 2)

  // 边界检查和调整：
  // 检查是否超出屏幕右边
  const screenPadding = 8
  if (left + popupRect.width > window.innerWidth - screenPadding) {
    left = window.innerWidth - popupRect.width - screenPadding
  }

  // 检查是否超出屏幕左边
  if (left < screenPadding) {
    left = screenPadding
  }

  // 检查是否超出屏幕底部，如果超出则显示在学生姓名上方
  if (top + popupRect.height > window.innerHeight - screenPadding) {
    top = triggerRect.top - popupRect.height - gap
  }

  // 检查是否超出屏幕顶部
  if (top < screenPadding) {
    top = screenPadding
  }

  // 应用计算好的位置
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
})

onBeforeUnmount(() => {
  if (closeTimer) {
    clearTimeout(closeTimer)
  }
  removeScrollListener()
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
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
