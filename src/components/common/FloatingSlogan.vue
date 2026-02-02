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
      <!-- 标语列表 -->
      <TransitionGroup name="slogan-fade" tag="div">
        <div
          v-for="slogan in displaySlogans"
          :key="slogan.slid"
          class="slogan-item"
        >
          <div class="slogan-text">{{ slogan.content }}</div>
        </div>
      </TransitionGroup>
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
const randomSlogans = ref([])
const isVisible = ref(true)
const loading = ref(false)
const position = ref({ x: 20, y: 300 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const displaySettings = ref(null)
const dragStartPos = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const animationFrameId = ref(null)
const refreshTimerId = ref(null)

// 随机选择3个标语
const selectRandomSlogans = () => {
  if (slogans.value.length <= 3) {
    randomSlogans.value = [...slogans.value]
    return
  }

  const shuffled = [...slogans.value].sort(() => Math.random() - 0.5)
  randomSlogans.value = shuffled.slice(0, 3)
}

// 计算属性
const displaySlogans = computed(() => {
  return randomSlogans.value
})

const shouldShow = computed(() => {
  if (!isVisible.value) return false
  if (!props.selectedCid) return false
  if (loading.value) return false
  if (slogans.value.length === 0) return false
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
      selectRandomSlogans()
      startRefreshTimer()
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

// 启动15分钟定时刷新
const startRefreshTimer = () => {
  // 清除已有的定时器
  if (refreshTimerId.value) {
    clearInterval(refreshTimerId.value)
  }

  // 每15分钟刷新一次 (15 * 60 * 1000 = 900000ms)
  refreshTimerId.value = setInterval(() => {
    selectRandomSlogans()
  }, 15 * 60 * 1000)
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

  // 清除定时刷新器
  if (refreshTimerId.value) {
    clearInterval(refreshTimerId.value)
  }
})
</script>

<style scoped>
.floating-slogan {
  position: fixed;
  z-index: 9998;
  min-width: 280px;
  max-width: 400px;
  user-select: none;
  transition: all 0.2s;
}

.slogan-content {
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.slogan-item {
  padding: 8px 12px;
  margin-bottom: 4px;
  transition: all 0.2s;
}

.slogan-item:last-child {
  margin-bottom: 0;
}

.slogan-item:hover {
  opacity: 0.8;
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

/* 标语切换动画 */
.slogan-fade-enter-active,
.slogan-fade-leave-active {
  transition: all 0.5s ease;
}

.slogan-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slogan-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.slogan-fade-move {
  transition: transform 0.5s ease;
}
</style>
