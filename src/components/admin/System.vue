<template>
  <div class="system-monitor">
    <div class="container">
      <!-- 标题和状态栏 -->
      <div class="header">
        <h1 class="title">
          系统监控面板
        </h1>
        <div class="status-bar">
          <div class="status-item">
            <div
                class="status-dot"
                :style="{ backgroundColor: getStatusColor(connectionStatus) }"
            ></div>
            <span class="status-text">状态: {{ connectionStatus }}</span>
          </div>
          <span class="status-text">
            监控时长: {{ systemInfo.data.os?.uptime ? formatUptime(systemInfo.data.os.uptime) : '0分' }}
          </span>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- 加载状态 -->
      <LoadingSpinner
          v-if="loading && historyData.length === 0"
          :size="60"
          messageKey="components.loadingSpinner.fetchingData"
      />

      <template v-else>
        <!-- 系统基本信息 -->
        <div v-if="systemInfo.data.os" class="card">
          <h2 class="card-title">
            <span class="title-icon">🖥️</span>
            系统信息
          </h2>
          <div class="system-grid">
            <div class="info-item">
              <div class="info-label">操作系统</div>
              <div class="info-value">{{ systemInfo.data.os.type }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">平台架构</div>
              <div class="info-value">{{ systemInfo.data.os.arch }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">系统版本</div>
              <div class="info-value">{{ systemInfo.data.os.release }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">主机名</div>
              <div class="info-value">{{ systemInfo.data.os.hostname }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">系统负载</div>
              <div class="info-value">
                {{ systemInfo.data.load ? systemInfo.data.load.join(' / ') : 'N/A' }}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">运行时间</div>
              <div class="info-value">
                {{ formatUptime(systemInfo.data.os.uptime || 0) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 实时监控图表 -->
        <div v-if="historyData.length > 0" class="card">
          <h2 class="card-title">
            <span class="title-icon">📈</span>
            实时性能监控
          </h2>
          <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- 性能指标卡片 -->
        <div class="metrics-grid">
          <!-- CPU 卡片 -->
          <div v-if="systemInfo.data.cpu" class="metric-card">
            <h3 class="metric-title">
              <span class="metric-icon cpu">⚡</span>
              CPU 性能
            </h3>
            <div class="metric-content">
              <div class="usage-row">
                <span class="usage-label">使用率</span>
                <span
                    class="usage-value"
                    :style="{ color: getUsageColor(parseFloat(systemInfo.data.cpu[0].usage_percent)) }"
                >
                  {{ systemInfo.data.cpu[0].usage_percent }}%
                </span>
              </div>
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{
                    width: `${systemInfo.data.cpu[0].usage_percent}%`,
                    backgroundColor: getUsageColor(parseFloat(systemInfo.data.cpu[0].usage_percent))
                  }"
                ></div>
              </div>
              <div class="metric-details">
                <div>型号: {{ systemInfo.data.cpu[0].model }}</div>
                <div>频率: {{ Math.round(systemInfo.data.cpu[0].speed) }} MHz</div>
              </div>
            </div>
          </div>

          <!-- 内存卡片 -->
          <div v-if="systemInfo.data.memory" class="metric-card">
            <h3 class="metric-title">
              <span class="metric-icon memory">💾</span>
              内存状态
            </h3>
            <div class="metric-content">
              <div class="usage-row">
                <span class="usage-label">使用率</span>
                <span
                    class="usage-value"
                    :style="{ color: getUsageColor(parseFloat(systemInfo.data.memory.usage_percent)) }"
                >
                  {{ systemInfo.data.memory.usage_percent }}%
                </span>
              </div>
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{
                    width: `${systemInfo.data.memory.usage_percent}%`,
                    backgroundColor: getUsageColor(parseFloat(systemInfo.data.memory.usage_percent))
                  }"
                ></div>
              </div>
              <div class="metric-details">
                <div>已用: {{ formatBytes(systemInfo.data.memory.total - systemInfo.data.memory.free) }}</div>
                <div>可用: {{ formatBytes(systemInfo.data.memory.free) }}</div>
                <div>总计: {{ formatBytes(systemInfo.data.memory.total) }}</div>
              </div>
            </div>
          </div>

          <!-- 磁盘卡片 -->
          <div v-if="systemInfo.data.disk && systemInfo.data.disk.length > 0" class="metric-card">
            <h3 class="metric-title">
              <span class="metric-icon disk">💿</span>
              磁盘存储
            </h3>
            <div class="metric-content">
              <div class="usage-row">
                <span class="usage-label">使用率</span>
                <span
                    class="usage-value"
                    :style="{ color: getUsageColor(systemInfo.data.disk[0].used_percent) }"
                >
                  {{ systemInfo.data.disk[0].used_percent }}%
                </span>
              </div>
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{
                    width: `${systemInfo.data.disk[0].used_percent}%`,
                    backgroundColor: getUsageColor(systemInfo.data.disk[0].used_percent)
                  }"
                ></div>
              </div>
              <div class="metric-details">
                <div>挂载点: {{ systemInfo.data.disk[0].mount }}</div>
                <div>已用: {{ formatBytes(systemInfo.data.disk[0].used) }}</div>
                <div>可用: {{ formatBytes(systemInfo.data.disk[0].free) }}</div>
                <div>总计: {{ formatBytes(systemInfo.data.disk[0].size) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 网络信息 -->
        <div v-if="systemInfo.data.network && systemInfo.data.network.length > 0" class="card">
          <h2 class="card-title">
            <span class="title-icon">🌐</span>
            网络接口
          </h2>
          <div class="network-grid">
            <div
                v-for="(net, index) in systemInfo.data.network"
                :key="index"
                class="network-item"
            >
              <div class="network-name">
                {{ net.interface }}
              </div>
              <div
                  v-for="(addr, addrIndex) in net.addresses"
                  :key="addrIndex"
                  class="network-details"
              >
                <div class="network-detail">
                  <span class="detail-label">IP地址:</span> {{ addr.address }}
                </div>
                <div class="network-detail">
                  <span class="detail-label">MAC地址:</span> {{ addr.mac }}
                </div>
                <div class="network-detail">
                  <span class="detail-label">类型:</span> {{ addr.family }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import SystemService from '@/services/admin/system'

export default {
  name: 'SystemMonitor',
  setup() {
    const systemInfo = reactive({ data: {} })
    const loading = ref(true)
    const error = ref(null)
    const connectionStatus = ref('连接中...')
    const historyData = ref([])
    const networkHistory = ref([])
    const intervalRef = ref(null)
    const startTime = ref(Date.now())
    const chartCanvas = ref(null)
    let chart = null

    // 模拟API调用的函数
    const fetchSystemInfo = async () => {
      try {
        loading.value = true

        const response = await SystemService.getSystemInfo()

        if (response.code !== 0) {
          throw new Error(response.message || '获取系统信息失败')
        }

        const data = response.data
        Object.assign(systemInfo.data, data) // 更新系统信息

        connectionStatus.value = '已连接'
        error.value = null
        loading.value = false

        // 更新历史数据
        const currentTime = new Date()
        const timeStr = currentTime.toLocaleTimeString()

        const newHistoryPoint = {
          time: timeStr,
          timestamp: currentTime.getTime(),
          cpu: parseFloat(data.cpu[0].usage_percent),
          memory: parseFloat(data.memory.usage_percent),
          load: parseFloat(data.load[0]) // 取第一个负载值
        }

        // 保留最近30个数据点
        historyData.value = [...historyData.value, newHistoryPoint].slice(-30)
      } catch (err) {
        console.error('获取系统信息失败:', err)
        error.value = '获取系统信息失败'
        connectionStatus.value = '连接失败'
        loading.value = false
      }
    }

    // 格式化字节
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B'
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
    }

    // 格式化运行时间
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)

      if (days > 0) return `${days}天 ${hours}时 ${minutes}分`
      if (hours > 0) return `${hours}时 ${minutes}分`
      return `${minutes}分`
    }

    // 获取使用率颜色
    const getUsageColor = (percent) => {
      if (percent >= 90) return '#e74c3c'
      if (percent >= 70) return '#f39c12'
      if (percent >= 50) return '#f1c40f'
      return '#27ae60'
    }

    // 获取状态颜色
    const getStatusColor = (status) => {
      switch (status) {
        case '已连接': return '#27ae60'
        case '连接中...': return '#f39c12'
        case '连接失败': return '#e74c3c'
        default: return '#95a5a6'
      }
    }

    // 动画相关状态
    const animationRef = ref(null)
    const animationProgress = ref(0)
    const previousData = ref([])
    const isAnimating = ref(false)

    // 初始化图表
    const initChart = async () => {
      if (!chartCanvas.value) return

      // 使用原生Canvas绘制图表，支持动画
      const drawChart = (progress = 1) => {
        if (!chartCanvas.value) return

        const canvas = chartCanvas.value
        const ctx = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()

        // 设置canvas尺寸
        canvas.width = rect.width * (window.devicePixelRatio || 1)
        canvas.height = rect.height * (window.devicePixelRatio || 1)
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

        const canvasWidth = rect.width
        const canvasHeight = rect.height

        // 清空画布
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        const padding = 60
        const chartWidth = canvasWidth - padding * 2
        const chartHeight = canvasHeight - padding * 2

        // 绘制背景网格
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1

        // 垂直网格线
        for (let i = 0; i <= 10; i++) {
          const x = padding + (chartWidth / 10) * i
          ctx.beginPath()
          ctx.moveTo(x, padding)
          ctx.lineTo(x, padding + chartHeight)
          ctx.stroke()
        }

        // 水平网格线
        for (let i = 0; i <= 10; i++) {
          const y = padding + (chartHeight / 10) * i
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(padding + chartWidth, y)
          ctx.stroke()
        }

        // 绘制Y轴刻度
        ctx.fillStyle = '#6b7280'
        ctx.font = '12px Arial'
        ctx.textAlign = 'right'
        for (let i = 0; i <= 10; i++) {
          const value = 100 - (i * 10)
          const y = padding + (chartHeight / 10) * i + 4
          ctx.fillText(`${value}%`, padding - 10, y)
        }

        if (historyData.value.length === 0) return

        // 获取当前数据和之前数据，用于动画插值
        const currentData = historyData.value
        const prevData = previousData.value

        // 如果是动画过程中，进行数据插值
        let displayData = currentData
        if (isAnimating.value && prevData.length > 0) {
          displayData = currentData.map((current, index) => {
            const prev = prevData[index] || current
            return {
              time: current.time,
              timestamp: current.timestamp,
              cpu: prev.cpu + (current.cpu - prev.cpu) * progress,
              memory: prev.memory + (current.memory - prev.memory) * progress,
              load: prev.load + (current.load - prev.load) * progress
            }
          })
        }

        if (displayData.length < 1) return

        const maxValue = 100 // 百分比最大值

        // 绘制数据线的函数
        const drawLine = (dataKey, color, lineWidth = 2) => {
          if (displayData.length < 2) {
            ctx.fillStyle = color
            const point = displayData[0]
            const x = padding + chartWidth / 2
            const y = padding + chartHeight - (point[dataKey] / maxValue) * chartHeight
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, 2 * Math.PI)
            ctx.fill()
            return
          }

          ctx.strokeStyle = color
          ctx.lineWidth = lineWidth
          ctx.beginPath()

          const points = displayData.map((point, index) => ({
            x: padding + (chartWidth / Math.max(1, displayData.length - 1)) * index,
            y: padding + chartHeight - (point[dataKey] / maxValue) * chartHeight
          }))

          ctx.moveTo(points[0].x, points[0].y)

          const tension = 0.2 // 调整曲率，0.5 比以前大，曲线更平滑

          for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i]
            const next = points[i + 1]
            const prev = points[i - 1] || curr
            const nextNext = points[i + 2] || next

            const cp1x = curr.x + (next.x - prev.x) * tension
            const cp1y = curr.y + (next.y - prev.y) * tension

            const cp2x = next.x - (nextNext.x - curr.x) * tension
            const cp2y = next.y - (nextNext.y - curr.y) * tension

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
          }

          ctx.stroke()

          // 绘制数据点
          ctx.fillStyle = color
          points.forEach((pt, index) => {
            ctx.beginPath()
            const radius = index === points.length - 1 && isAnimating.value ? 3 + progress * 2 : 3
            ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI)
            ctx.fill()
          })

          // 最新数据点发光效果
          if (isAnimating.value && points.length > 0) {
            const lastPoint = points[points.length - 1]
            ctx.save()
            ctx.globalAlpha = (1 - progress) * 0.3
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(lastPoint.x, lastPoint.y, 8, 0, 2 * Math.PI)
            ctx.fill()
            ctx.restore()
          }
        }

        // 绘制CPU线
        drawLine('cpu', '#e74c3c')

        // 绘制内存线
        drawLine('memory', '#3498db')

        // 绘制负载线
        drawLine('load', '#f39c12')

        // 绘制图例
        ctx.font = '14px Arial'
        ctx.textAlign = 'left'
        const legendY = 30
        const legendItems = [
          { color: '#e74c3c', text: 'CPU使用率', x: padding },
          { color: '#3498db', text: '内存使用率', x: padding + 120 },
          { color: '#f39c12', text: '系统负载', x: padding + 250 }
        ]

        legendItems.forEach(item => {
          // 绘制颜色块
          ctx.fillStyle = item.color
          ctx.fillRect(item.x, legendY - 8, 15, 3)

          // 绘制文本
          ctx.fillStyle = '#374151'
          ctx.fillText(item.text, item.x + 25, legendY)
        })
      }

      // 动画函数
      const animateChart = () => {
        if (animationRef.value) {
          cancelAnimationFrame(animationRef.value)
        }

        isAnimating.value = true
        animationProgress.value = 0

        const startTime = Date.now()
        const duration = 1100 // 动画持续时间800ms

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // 使用缓动函数使动画更平滑
          const easedProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic

          animationProgress.value = easedProgress
          drawChart(easedProgress)

          if (progress < 1) {
            animationRef.value = requestAnimationFrame(animate)
          } else {
            isAnimating.value = false
            previousData.value = [...historyData.value]
          }
        }

        animate()
      }

      chart = {
        update: () => {
          if (previousData.value.length === 0) {
            // 首次加载，直接绘制
            drawChart()
            previousData.value = [...historyData.value]
          } else {
            // 有新数据，启动动画
            animateChart()
          }
        }
      }

      // 初始绘制
      drawChart()
      previousData.value = [...historyData.value]
    }

    // 监听历史数据变化，更新图表
    watch(historyData, () => {
      if (chart) {
        nextTick(() => {
          chart.update()
        })
      }
    }, { deep: true })

    // 监听窗口大小变化，重绘图表
    const handleResize = () => {
      if (chart) {
        setTimeout(() => {
          chart.update()
        }, 100)
      }
    }

    onMounted(async () => {
      // 立即获取一次数据
      await fetchSystemInfo()

      // 初始化图表
      await nextTick()
      initChart()

      // 设置定时器，每5秒获取一次数据
      intervalRef.value = setInterval(fetchSystemInfo, 1000)

      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      if (intervalRef.value) {
        clearInterval(intervalRef.value)
      }
      if (animationRef.value) {
        cancelAnimationFrame(animationRef.value)
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      systemInfo,
      loading,
      error,
      connectionStatus,
      historyData,
      networkHistory,
      chartCanvas,
      formatBytes,
      formatUptime,
      getUsageColor,
      getStatusColor,
      Math
    }
  }
}
</script>

<style scoped>
/* 重置和基础样式 */
* {
  box-sizing: border-box;
}

.system-monitor {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0 0 16px 0;
  padding: 0;
}

.status-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  color: #6b7280;
  margin: 0;
}

/* 消息和加载样式 */
.error-message {
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.loading {
  text-align: center;
  padding: 48px;
}

.loading-spinner {
  width: 64px;
  height: 64px;
  border: 2px solid #e5e7eb;
  border-bottom-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-text {
  color: #6b7280;
  margin: 0;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 1.5rem;
}

/* 系统信息网格 */
.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 4px;
}

.info-value {
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* 图表样式 */
.chart-container {
  height: 320px;
  position: relative;
  width: 100%;
}

.chart-container canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* 指标网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.metric-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  transition: box-shadow 0.3s ease;
}

.metric-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.metric-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-icon {
  font-size: 1.25rem;
}

.metric-icon.cpu {
  color: #ef4444;
}

.metric-icon.memory {
  color: #3b82f6;
}

.metric-icon.disk {
  color: #8b5cf6;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.usage-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usage-label {
  color: #6b7280;
  margin: 0;
}

.usage-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.metric-details {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-details div {
  margin: 0;
}

/* 网络信息样式 */
.network-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.network-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.network-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.network-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
}

.network-detail {
  color: #6b7280;
  margin: 0;
}

.detail-label {
  font-weight: 500;
}

/* 动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .system-monitor {
    padding: 16px;
  }

  .title {
    font-size: 2rem;
  }

  .status-bar {
    gap: 16px;
  }

  .system-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .network-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 240px;
  }
}

@media (max-width: 480px) {
  .system-monitor {
    padding: 12px;
  }

  .title {
    font-size: 1.75rem;
  }

  .card {
    padding: 16px;
  }

  .metric-card {
    padding: 16px;
  }

  .usage-value {
    font-size: 1.5rem;
  }
}
</style>