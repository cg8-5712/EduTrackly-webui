<template>
  <div
    v-if="shouldShow"
    class="floating-countdown"
    :style="floatingStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @dblclick="closeCountdown"
    :title="$t('ui.countdownContent') + ' (' + $t('common.close') + ')'"
  >
    <div class="countdown-content">
      <!-- 倒计时列表 -->
      <div
        v-for="countdown in displayCountdowns"
        :key="countdown.cdid"
        class="countdown-item"
        :class="{ 'expired': countdown.remainingDays < 0 }"
      >
        <div class="countdown-text">{{ countdown.content }}</div>
        <div class="countdown-info">
          <span class="countdown-date">{{ formatDate(countdown.deadline) }}</span>
          <span class="countdown-days" :class="getDaysClass(countdown.remainingDays)">
            {{ getDaysText(countdown.remainingDays) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import countdownService from '@/services/admin/countdown'
import settingService from '@/services/admin/setting'

const { t } = useI18n()

const props = defineProps({
  selectedCid: {
    type: Number,
    default: null
  }
})

// 状态
const countdowns = ref([])
const isVisible = ref(true)
const loading = ref(false)
const position = ref({ x: 20, y: 100 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const displaySettings = ref(null)
const dragStartPos = ref({ x: 0, y: 0 }) // 记录拖动起始位置
const hasMoved = ref(false) // 记录是否发生了拖动
const animationFrameId = ref(null) // 用于 requestAnimationFrame

// 计算属性
const displayCountdowns = computed(() => {
  // 过滤掉已过期的，最多显示5个倒计时
  return countdowns.value.filter(item => item.remainingDays >= 0).slice(0, 5)
})

const shouldShow = computed(() => {
  // 如果用户关闭了，不显示
  if (!isVisible.value) return false

  // 如果没有选择班级，不显示
  if (!props.selectedCid) return false

  // 如果正在加载，不显示
  if (loading.value) return false

  // 如果没有有效的倒计时数据，不显示
  if (displayCountdowns.value.length === 0) return false

  return true
})

const floatingStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  cursor: isDragging.value ? 'grabbing' : 'grab'
}))

// 获取倒计时数据
const fetchCountdowns = async () => {
  if (!props.selectedCid) {
    console.log('[FloatingCountdown] No class selected')
    return
  }

  loading.value = true
  console.log('[FloatingCountdown] Fetching countdowns for class:', props.selectedCid)

  try {
    // 检查显示设置
    const settingResponse = await settingService.getSetting(props.selectedCid)
    console.log('[FloatingCountdown] Display settings response:', settingResponse)
    console.log('[FloatingCountdown] Display settings data:', settingResponse.data)

    displaySettings.value = settingResponse.data

    // 如果倒计时显示被禁用，不显示组件
    // 检查 is_countdown_display 字段：false, 0, null, undefined 都视为禁用
    const cdEnabled = displaySettings.value?.is_countdown_display
    console.log('[FloatingCountdown] Countdown display enabled (is_countdown_display):', cdEnabled)

    if (!cdEnabled) {
      console.log('[FloatingCountdown] Countdown display is disabled for this class (is_countdown_display =', displaySettings.value?.is_countdown_display, ')')
      isVisible.value = false
      loading.value = false
      countdowns.value = []
      return
    }

    console.log('[FloatingCountdown] Countdown display is enabled, fetching data...')
    isVisible.value = true

    // 获取倒计时列表
    const response = await countdownService.getCountdownList({
      cid: props.selectedCid,
      order: 'asc',
      page: 1,
      size: 10
    })

    console.log('[FloatingCountdown] Countdown list response:', response)

    // 修复：data 直接是数组，不是 data.list
    if (response.code === 0 && response.data && Array.isArray(response.data)) {
      // 计算剩余天数
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      countdowns.value = response.data.map(item => {
        const deadlineDate = new Date(item.deadline)
        deadlineDate.setHours(0, 0, 0, 0)
        const diffTime = deadlineDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          ...item,
          remainingDays: diffDays
        }
      }).sort((a, b) => {
        // 未过期的排在前面，按剩余天数升序
        if (a.remainingDays >= 0 && b.remainingDays < 0) return -1
        if (a.remainingDays < 0 && b.remainingDays >= 0) return 1
        return a.remainingDays - b.remainingDays
      })

      console.log('[FloatingCountdown] Processed countdowns:', countdowns.value)
      console.log('[FloatingCountdown] Total countdowns:', countdowns.value.length)
    } else {
      countdowns.value = []
      console.log('[FloatingCountdown] No countdowns found or invalid response')
    }
  } catch (error) {
    console.error('[FloatingCountdown] Failed to fetch countdowns:', error)
    // 出错时不显示组件
    countdowns.value = []
    isVisible.value = false
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取天数显示文本
const getDaysText = (days) => {
  if (days < 0) {
    return t('ui.expired')
  } else if (days === 0) {
    return t('common.today')
  } else {
    return t('ui.daysCount', { count: days })
  }
}

// 获取天数样式类
const getDaysClass = (days) => {
  if (days < 0) return 'expired'
  if (days === 0) return 'today'
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'warning'
  return 'normal'
}

// 拖动相关
const startDrag = (event) => {
  const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
  const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY

  // 记录起始位置
  dragStartPos.value = { x: clientX, y: clientY }
  hasMoved.value = false

  dragOffset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }

  // 使用更高效的事件监听
  document.addEventListener('mousemove', onDrag, { passive: false })
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

const updatePosition = (clientX, clientY) => {
  let newX = clientX - dragOffset.value.x
  let newY = clientY - dragOffset.value.y

  // 限制在视口内
  const componentWidth = 300 // 根据 .floating-countdown min-width 估算
  const componentHeight = 100 // 估算值
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

  // 计算移动距离
  const deltaX = Math.abs(clientX - dragStartPos.value.x)
  const deltaY = Math.abs(clientY - dragStartPos.value.y)

  // 只有移动超过5px才认为是拖动（防止误触）
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

  // 如果发生了拖动，保存位置
  if (hasMoved.value) {
    localStorage.setItem('floating-countdown-position', JSON.stringify(position.value))
  }

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 关闭倒计时 - 只有在没有拖动时才触发
const closeCountdown = (event) => {
  // 如果刚刚发生了拖动，不触发关闭
  if (hasMoved.value) {
    return
  }

  isVisible.value = false
  sessionStorage.setItem('floating-countdown-closed', 'true')
}

// 监听班级变化
watch(() => props.selectedCid, (newCid) => {
  console.log('[FloatingCountdown] Class changed to:', newCid)
  if (newCid) {
    fetchCountdowns()
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  console.log('[FloatingCountdown] Component mounted')

  // 恢复位置
  const savedPosition = localStorage.getItem('floating-countdown-position')
  if (savedPosition) {
    try {
      position.value = JSON.parse(savedPosition)
    } catch (e) {
      console.error('Failed to parse saved position:', e)
    }
  }

  // 检查是否已关闭
  const isClosed = sessionStorage.getItem('floating-countdown-closed')
  if (isClosed === 'true') {
    isVisible.value = false
  }

  // 获取倒计时数据
  if (props.selectedCid) {
    fetchCountdowns()
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
.floating-countdown {
  position: fixed;
  z-index: 9999;
  background: var(--color-surface);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-width: 400px;
  user-select: none;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.floating-countdown:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-color: var(--color-secondary);
}

.countdown-content {
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.countdown-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.countdown-item:last-child {
  margin-bottom: 0;
}

.countdown-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.countdown-item.expired {
  opacity: 0.5;
  background: var(--color-background);
}

.countdown-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.countdown-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.countdown-date {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.countdown-days {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
  color: white;
}

/* 使用主题色彩系统的倒计时状态 */
.countdown-days.expired {
  background: var(--color-text-tertiary);
  color: var(--color-surface);
  opacity: 0.7;
}

.countdown-days.today {
  background: var(--color-warning);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

.countdown-days.urgent {
  background: var(--color-error);
  color: white;
  animation: urgent-pulse 1.5s ease-in-out infinite;
}

.countdown-days.warning {
  background: var(--color-warning);
  color: white;
}

.countdown-days.normal {
  background: var(--color-primary);
  color: white;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.05);
  }
}

@keyframes urgent-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.08);
  }
}

/* 滚动条样式 - 使用主题色 */
.countdown-content::-webkit-scrollbar {
  width: 6px;
}

.countdown-content::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 3px;
}

.countdown-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
  transition: background 0.2s;
}

.countdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .floating-countdown {
    min-width: 240px;
    max-width: 90vw;
  }

  .countdown-content {
    padding: 10px;
  }

  .countdown-item {
    padding: 10px;
  }

  .countdown-text {
    font-size: 13px;
  }
}
</style>
