<template>
  <div
    v-if="shouldShow"
    class="floating-countdown"
    :style="floatingStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="countdown-header">
      <span class="countdown-title">📅 {{ $t('ui.countdownContent') }}</span>
      <button @click="closeCountdown" class="close-btn" :title="$t('common.close')">✕</button>
    </div>
    <div class="countdown-content">
      <!-- 加载中状态 -->
      <div v-if="loading" class="countdown-loading">
        <div class="loading-spinner"></div>
        <span>{{ $t('common.loading') }}</span>
      </div>

      <!-- 无数据提示 -->
      <div v-else-if="countdowns.length === 0" class="countdown-empty">
        <span>{{ $t('ui.noCountdowns') }}</span>
      </div>

      <!-- 倒计时列表 -->
      <div
        v-else
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

// 计算属性
const displayCountdowns = computed(() => {
  return countdowns.value.slice(0, 5) // 最多显示5个倒计时
})

const shouldShow = computed(() => {
  // 如果用户关闭了，不显示
  if (!isVisible.value) return false

  // 如果没有选择班级，不显示
  if (!props.selectedCid) return false

  // 显示组件（即使没有数据也显示，让用户知道倒计时功能存在）
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
  // 如果点击的是关闭按钮，不触发拖动
  if (event.target.classList.contains('close-btn')) return

  isDragging.value = true

  const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
  const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY

  dragOffset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)

  event.preventDefault()
}

const onDrag = (event) => {
  if (!isDragging.value) return

  const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
  const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY

  let newX = clientX - dragOffset.value.x
  let newY = clientY - dragOffset.value.y

  // 限制在视口内
  const maxX = window.innerWidth - 300 // 假设组件宽度为300px
  const maxY = window.innerHeight - 100

  newX = Math.max(0, Math.min(newX, maxX))
  newY = Math.max(0, Math.min(newY, maxY))

  position.value = { x: newX, y: newY }

  // 保存位置到 localStorage
  localStorage.setItem('floating-countdown-position', JSON.stringify(position.value))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 关闭倒计时
const closeCountdown = () => {
  isVisible.value = false
  // 保存关闭状态到 sessionStorage
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
  border: 2px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-width: 400px;
  user-select: none;
  backdrop-filter: blur(10px);
  background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.95);
  transition: box-shadow 0.2s;
}

.floating-countdown:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.countdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: 10px 10px 0 0;
  color: white;
}

.countdown-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
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
  opacity: 0.6;
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
}

.countdown-days.expired {
  background: #f3f4f6;
  color: #9ca3af;
}

.countdown-days.today {
  background: #fef3c7;
  color: #d97706;
}

.countdown-days.urgent {
  background: #fee2e2;
  color: #dc2626;
}

.countdown-days.warning {
  background: #fef3c7;
  color: #f59e0b;
}

.countdown-days.normal {
  background: #dbeafe;
  color: #2563eb;
}

/* 滚动条样式 */
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

  .countdown-header {
    padding: 10px 12px;
  }

  .countdown-title {
    font-size: 14px;
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

/* 加载中状态 */
.countdown-loading {
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
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.countdown-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--color-text-secondary);
  font-size: 14px;
  text-align: center;
}
</style>
