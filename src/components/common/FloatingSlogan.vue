<template>
  <div
    v-if="shouldShow"
    class="floating-slogan"
    :style="floatingStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @dblclick="closeSlogan"
    :title="$t('ui.sloganContent') + ' (' + $t('common.close') + ')'"
  >
    <div class="slogan-content">
      <!-- 加载中状态 -->
      <div v-if="loading" class="slogan-loading">
        <div class="loading-spinner"></div>
        <span>{{ $t('common.loading') }}</span>
      </div>

      <!-- 无数据提示 -->
      <div v-else-if="slogans.length === 0" class="slogan-empty">
        <span>{{ $t('ui.noSlogans') }}</span>
      </div>

      <!-- 标语列表 -->
      <div
        v-else
        v-for="slogan in displaySlogans"
        :key="slogan.slid"
        class="slogan-item"
      >
        <div class="slogan-text">{{ slogan.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import sloganService from '@/services/admin/slogan'
import settingService from '@/services/admin/setting'

const { t } = useI18n()

const props = defineProps({
  selectedCid: {
    type: Number,
    default: null
  }
})

// 状态
const slogans = ref([])
const isVisible = ref(true)
const loading = ref(false)
const position = ref({ x: 20, y: 300 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const displaySettings = ref(null)
const dragStartPos = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const animationFrameId = ref(null)

// 计算属性
const displaySlogans = computed(() => {
  return slogans.value.slice(0, 5)
})

const shouldShow = computed(() => {
  if (!isVisible.value) return false
  if (!props.selectedCid) return false
  return true
})

const floatingStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  cursor: isDragging.value ? 'grabbing' : 'grab'
}))

// 获取标语数据
const fetchSlogans = async () => {
  if (!props.selectedCid) return

  loading.value = true

  try {
    const settingResponse = await settingService.getSetting(props.selectedCid)
    displaySettings.value = settingResponse.data

    const sloganEnabled = displaySettings.value?.is_slogan_display
    if (!sloganEnabled) {
      isVisible.value = false
      loading.value = false
      slogans.value = []
      return
    }

    isVisible.value = true

    const response = await sloganService.getSloganList({
      cid: props.selectedCid,
      order: 'asc',
      page: 1,
      size: 10
    })

    if (response.code === 0 && response.data && Array.isArray(response.data)) {
      slogans.value = response.data
    } else {
      slogans.value = []
    }
  } catch (error) {
    console.error('[FloatingSlogan] Failed to fetch slogans:', error)
    slogans.value = []
    isVisible.value = false
  } finally {
    loading.value = false
  }
}

// 拖动相关
const startDrag = (event) => {
  const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
  const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY

  dragStartPos.value = { x: clientX, y: clientY }
  hasMoved.value = false

  dragOffset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }

  document.addEventListener('mousemove', onDrag, { passive: false })
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

const updatePosition = (clientX, clientY) => {
  let newX = clientX - dragOffset.value.x
  let newY = clientY - dragOffset.value.y

  const componentWidth = 300
  const componentHeight = 100
  const maxX = window.innerWidth - componentWidth
  const maxY = window.innerHeight - componentHeight

  newX = Math.max(0, Math.min(newX, maxX))
  newY = Math.max(0, Math.min(newY, maxY))

  position.value = { x: newX, y: newY }
  animationFrameId.value = null
}

const onDrag = (event) => {
  event.preventDefault()

  const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
  const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY

  const deltaX = Math.abs(clientX - dragStartPos.value.x)
  const deltaY = Math.abs(clientY - dragStartPos.value.y)

  if (!hasMoved.value && (deltaX > 5 || deltaY > 5)) {
    isDragging.value = true
    hasMoved.value = true
  }

  if (hasMoved.value) {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
    }
    animationFrameId.value = requestAnimationFrame(() => updatePosition(clientX, clientY))
  }
}

const stopDrag = () => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }

  isDragging.value = false

  if (hasMoved.value) {
    localStorage.setItem('floating-slogan-position', JSON.stringify(position.value))
  }

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

const closeSlogan = () => {
  if (hasMoved.value) return
  isVisible.value = false
  sessionStorage.setItem('floating-slogan-closed', 'true')
}

// 监听班级变化
watch(() => props.selectedCid, (newCid) => {
  if (newCid) {
    fetchSlogans()
  }
}, { immediate: true })

onMounted(() => {
  const savedPosition = localStorage.getItem('floating-slogan-position')
  if (savedPosition) {
    try {
      position.value = JSON.parse(savedPosition)
    } catch (e) {
      console.error('Failed to parse saved position:', e)
    }
  }

  const isClosed = sessionStorage.getItem('floating-slogan-closed')
  if (isClosed === 'true') {
    isVisible.value = false
  }

  if (props.selectedCid) {
    fetchSlogans()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<style scoped>
.floating-slogan {
  position: fixed;
  z-index: 9998;
  background: var(--color-surface);
  border: 2px solid var(--color-secondary);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-width: 400px;
  user-select: none;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.floating-slogan:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-color: var(--color-primary);
}

.slogan-content {
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.slogan-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.slogan-item:last-child {
  margin-bottom: 0;
}

.slogan-item:hover {
  border-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.slogan-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.5;
  text-align: center;
}

.slogan-content::-webkit-scrollbar {
  width: 6px;
}

.slogan-content::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 3px;
}

.slogan-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
  transition: background 0.2s;
}

.slogan-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}

@media (max-width: 768px) {
  .floating-slogan {
    min-width: 240px;
    max-width: 90vw;
  }

  .slogan-content {
    padding: 10px;
  }

  .slogan-item {
    padding: 10px;
  }

  .slogan-text {
    font-size: 14px;
  }
}

.slogan-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-secondary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.slogan-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--color-text-secondary);
  font-size: 14px;
  text-align: center;
}
</style>
