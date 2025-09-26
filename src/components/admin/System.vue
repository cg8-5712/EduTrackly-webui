<template>
  <div class="system-monitor">
    <div class="container">
      <!-- 标题和状态栏 -->
      <div class="header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="title">系统监控面板</h1>
            <p class="subtitle">实时监控系统性能指标</p>
          </div>

          <div class="status-section">
            <div class="status-card" :class="getStatusClass(connectionStatus)">
              <div class="status-indicator">
                <div class="status-dot" :style="{ backgroundColor: getStatusColor(connectionStatus) }"></div>
                <span class="status-label">{{ connectionStatus }}</span>
              </div>
            </div>

            <div class="uptime-card">
              <div class="uptime-content">
                <span class="uptime-label">系统运行时长</span>
                <span class="uptime-value">{{ systemInfo.data.os?.uptime ? formatUptime(systemInfo.data.os.uptime) : '0分' }}</span>
              </div>
            </div>
          </div>
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
        <!-- 主要内容区域 - 使用两栏布局 -->
        <div class="main-content">
          <!-- 左栏 -->
          <div class="left-column">
            <!-- 系统基本信息 - 紧凑版 -->
            <div v-if="systemInfo.data.os" class="card compact-card">
              <h2 class="card-title">
                <span class="title-icon">🖥️</span>
                系统信息
              </h2>
              <div class="system-grid-compact">
                <div class="info-item-compact">
                  <span class="info-label-compact">系统</span>
                  <span class="info-value-compact">{{ systemInfo.data.os.type }} {{ systemInfo.data.os.arch }}</span>
                </div>
                <div class="info-item-compact">
                  <span class="info-label-compact">版本</span>
                  <span class="info-value-compact">{{ systemInfo.data.os.release }}</span>
                </div>
                <div class="info-item-compact">
                  <span class="info-label-compact">主机</span>
                  <span class="info-value-compact">{{ systemInfo.data.os.hostname }}</span>
                </div>
                <div class="info-item-compact">
                  <span class="info-label-compact">负载</span>
                  <span class="info-value-compact">{{ systemInfo.data.load ? systemInfo.data.load.join(' / ') : 'N/A' }}</span>
                </div>
                <div class="info-item-compact">
                  <span class="info-label-compact">运行时间</span>
                  <span class="info-value-compact">{{ formatUptime(systemInfo.data.os.uptime || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- 网络信息 - 紧凑版 -->
            <div v-if="systemInfo.data.network && systemInfo.data.network.length > 0" class="card compact-card">
              <h2 class="card-title">
                <span class="title-icon">🌐</span>
                网络接口
              </h2>
              <div class="network-compact">
                <div
                    v-for="(net, index) in systemInfo.data.network.slice(0, 2)"
                    :key="index"
                    class="network-item-compact"
                >
                  <div class="network-name-compact">{{ net.interface }}</div>
                  <div v-for="(addr, addrIndex) in net.addresses.slice(0, 1)" :key="addrIndex">
                    <div class="network-detail-compact">{{ addr.address }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右栏 -->
          <div class="right-column">
            <!-- 实时监控图表 - 调整高度 -->
            <div class="card">
              <h2 class="card-title">
                <span class="title-icon">📈</span>
                实时性能监控
              </h2>
              <div class="chart-container-compact">
                <canvas ref="chartCanvas"></canvas>
                <div v-if="historyData.length === 0" class="chart-placeholder">
                  <div class="placeholder-text">等待数据加载中...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 性能指标卡片 - 水平排列 -->
        <div class="metrics-row">
          <!-- CPU 卡片 -->
          <div v-if="systemInfo.data.cpu && systemInfo.data.avgCpuUsage !== undefined" class="metric-card-horizontal">
            <div class="metric-header">
              <h3 class="metric-title-small">
                <span class="metric-icon cpu">⚡</span>
                CPU ({{ systemInfo.data.cpu.length }}核)
              </h3>
              <span class="usage-value-large" :style="{ color: getUsageColor(parseFloat(systemInfo.data.avgCpuUsage || 0)) }">
                {{ systemInfo.data.avgCpuUsage || '0' }}%
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{
                width: `${systemInfo.data.avgCpuUsage || 0}%`,
                backgroundColor: getUsageColor(parseFloat(systemInfo.data.avgCpuUsage || 0))
              }"></div>
            </div>
            <div class="metric-details-small">
              {{ systemInfo.data.cpu?.[0]?.model?.split(' ').slice(0, 3).join(' ') || 'N/A' }}
            </div>
          </div>

          <!-- 内存卡片 -->
          <div v-if="systemInfo.data.memory" class="metric-card-horizontal">
            <div class="metric-header">
              <h3 class="metric-title-small">
                <span class="metric-icon memory">💾</span>
                内存
              </h3>
              <span class="usage-value-large" :style="{ color: getUsageColor(parseFloat(systemInfo.data.memory?.usage_percent || 0)) }">
                {{ systemInfo.data.memory?.usage_percent || '0' }}%
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{
                width: `${systemInfo.data.memory?.usage_percent || 0}%`,
                backgroundColor: getUsageColor(parseFloat(systemInfo.data.memory?.usage_percent || 0))
              }"></div>
            </div>
            <div class="metric-details-small">
              {{ formatBytes((systemInfo.data.memory?.total || 0) - (systemInfo.data.memory?.free || 0)) }} / {{ formatBytes(systemInfo.data.memory?.total || 0) }}
            </div>
          </div>

          <!-- 磁盘卡片 -->
          <div v-if="systemInfo.data.totalDisk" class="metric-card-horizontal">
            <div class="metric-header">
              <h3 class="metric-title-small">
                <span class="metric-icon disk">💿</span>
                磁盘 ({{ systemInfo.data.disk?.length || 0 }}个)
              </h3>
              <span class="usage-value-large" :style="{ color: getUsageColor(parseFloat(systemInfo.data.totalDisk.used_percent || 0)) }">
                {{ systemInfo.data.totalDisk.used_percent || '0' }}%
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{
                width: `${systemInfo.data.totalDisk.used_percent || 0}%`,
                backgroundColor: getUsageColor(parseFloat(systemInfo.data.totalDisk.used_percent || 0))
              }"></div>
            </div>
            <div class="metric-details-small">
              {{ formatBytes(systemInfo.data.totalDisk.used || 0) }} / {{ formatBytes(systemInfo.data.totalDisk.size || 0) }}
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'SystemMonitor',
  components: {
    LoadingSpinner
  },
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
    const fetchSystemInfo = async (isInitial = false) => {
      try {
        // 只有初始加载时才显示loading状态
        if (isInitial) {
          loading.value = true
        }

        const response = await SystemService.getSystemInfo()
        console.log('API Response:', response)

        if (response.code !== 0) {
          throw new Error(response.message || '获取系统信息失败')
        }

        const data = response.data
        console.log('System data:', data)

        // 验证数据结构
        if (!data || typeof data !== 'object') {
          throw new Error('无效的系统数据')
        }

        // 计算CPU平均使用率
        if (data.cpu && data.cpu.length > 0) {
          const totalCpuUsage = data.cpu.reduce((sum, cpu) => sum + (parseFloat(cpu.usage_percent) || 0), 0)
          data.avgCpuUsage = (totalCpuUsage / data.cpu.length).toFixed(1)
          console.log(`CPU cores: ${data.cpu.length}, average usage: ${data.avgCpuUsage}%`)
        } else {
          console.warn('CPU data missing or invalid:', data.cpu)
        }

        // 计算硬盘总容量和使用量
        if (data.disk && data.disk.length > 0) {
          const totalSize = data.disk.reduce((sum, disk) => sum + (disk.size || 0), 0)
          const totalUsed = data.disk.reduce((sum, disk) => sum + (disk.used || 0), 0)
          data.totalDisk = {
            size: totalSize,
            used: totalUsed,
            used_percent: totalSize > 0 ? ((totalUsed / totalSize) * 100).toFixed(1) : 0
          }
        }

        Object.assign(systemInfo.data, data) // 更新系统信息

        connectionStatus.value = '已连接'
        error.value = null
        if (isInitial) {
          loading.value = false
        }

        // 更新历史数据 - 使用统计后的数据
        if (data.avgCpuUsage !== undefined && data.memory && data.load && data.load.length > 0) {
          const currentTime = new Date()
          const timeStr = currentTime.toLocaleTimeString()

          const newHistoryPoint = {
            time: timeStr,
            timestamp: currentTime.getTime(),
            cpu: parseFloat(data.avgCpuUsage) || 0,
            memory: parseFloat(data.memory.usage_percent) || 0,
            load: Math.min(parseFloat(data.load[0]) * 100 || 0, 100) // 将负载转换为百分比，最大100%
          }

          console.log('New data point with stats:', newHistoryPoint)

          // 添加新数据点并保留最后30个点
          historyData.value = [...historyData.value, newHistoryPoint].slice(-30)
        } else {
          console.warn('Missing data for chart:', {
            avgCpuUsage: data.avgCpuUsage,
            memory: data.memory,
            load: data.load
          })

          // 如果数据不完整，但有部分数据，仍然尝试生成数据点
          if (data.avgCpuUsage !== undefined || data.memory || (data.load && data.load.length > 0)) {
            const currentTime = new Date()
            const timeStr = currentTime.toLocaleTimeString()

            const newHistoryPoint = {
              time: timeStr,
              timestamp: currentTime.getTime(),
              cpu: parseFloat(data.avgCpuUsage) || 0,
              memory: parseFloat(data.memory?.usage_percent) || 0,
              load: data.load && data.load.length > 0 ? Math.min(parseFloat(data.load[0]) * 100 || 0, 100) : 0
            }

            console.log('Partial data point:', newHistoryPoint)

            // 添加新数据点并保留最后30个点
            historyData.value = [...historyData.value, newHistoryPoint].slice(-30)
          }
        }
      } catch (err) {
        console.error('获取系统信息失败:', err)
        error.value = err.message || '获取系统信息失败'
        connectionStatus.value = '连接失败'
        if (isInitial) {
          loading.value = false
        }
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

    // 获取状态类名
    const getStatusClass = (status) => {
      switch (status) {
        case '已连接': return 'status-connected'
        case '连接中...': return 'status-connecting'
        case '连接失败': return 'status-error'
        default: return 'status-unknown'
      }
    }

    // 动画相关状态
    const animationRef = ref(null)
    const animationProgress = ref(0)
    const previousData = ref([])
    const isAnimating = ref(false)

    // 初始化图表
    const initChart = async () => {
      if (!chartCanvas.value) {
        console.log('Chart canvas not available')
        return
      }

      // 使用原生Canvas绘制图表，支持动画
      const drawChart = (progress = 1) => {
        if (!chartCanvas.value) return

        const canvas = chartCanvas.value
        const ctx = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()

        // 确保canvas有有效尺寸
        if (rect.width === 0 || rect.height === 0) {
          console.log('Canvas has zero dimensions, skipping draw')
          return
        }

        // 设置canvas尺寸
        const deviceRatio = window.devicePixelRatio || 1
        canvas.width = rect.width * deviceRatio
        canvas.height = rect.height * deviceRatio
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'
        ctx.scale(deviceRatio, deviceRatio)

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

        if (historyData.value.length === 0) {
          console.log('No history data available for chart')
          return
        }

        console.log('Drawing chart with', historyData.value.length, 'data points')

        // 获取当前数据和之前数据，用于动画插值
        const currentData = historyData.value
        const prevData = previousData.value

        // 固定显示时间范围 (2分钟)
        const displayTimeRange = 2 * 60 * 1000 // 2分钟
        const now = Date.now()
        const startTime = now - displayTimeRange

        // 创建显示数据，确保有足够的时间范围
        let displayData = currentData.filter(point => point.timestamp >= startTime)

        // 如果数据不足，在开始时间添加占位数据点
        if (displayData.length > 0) {
          const firstPoint = displayData[0]
          if (firstPoint.timestamp > startTime) {
            displayData = [{
              time: new Date(startTime).toLocaleTimeString(),
              timestamp: startTime,
              cpu: firstPoint.cpu,
              memory: firstPoint.memory,
              load: firstPoint.load
            }, ...displayData]
          }
        }

        // 在结束时间添加当前数据点（如果需要）
        if (displayData.length > 0) {
          const lastPoint = displayData[displayData.length - 1]
          if (lastPoint.timestamp < now - 3000) { // 如果最新数据超过3秒
            displayData = [...displayData, {
              time: new Date(now).toLocaleTimeString(),
              timestamp: now,
              cpu: lastPoint.cpu,
              memory: lastPoint.memory,
              load: lastPoint.load
            }]
          }
        }

        // 动画插值处理
        if (isAnimating.value && prevData.length > 0) {
          const prevDisplayData = prevData.filter(point => point.timestamp >= startTime)
          displayData = displayData.map((current, index) => {
            const prev = prevDisplayData[index] || current
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

          // 确保数据点充满整个图表宽度
          const points = displayData.map((point, index) => {
            // 使用索引分布确保充满整个宽度
            const xProgress = displayData.length > 1 ? index / (displayData.length - 1) : 0.5
            // 限制Y值在有效范围内，防止超出图表边界
            const clampedValue = Math.max(0, Math.min(maxValue, point[dataKey]))
            return {
              x: padding + chartWidth * xProgress,
              y: padding + chartHeight - (clampedValue / maxValue) * chartHeight,
              timestamp: point.timestamp,
              value: clampedValue
            }
          })

          ctx.moveTo(points[0].x, points[0].y)

          const tension = 0.2 // 调整曲率，0.5 比以前大，曲线更平滑

          for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i]
            const next = points[i + 1]
            const prev = points[i - 1] || curr
            const nextNext = points[i + 2] || next

            let cp1x = curr.x + (next.x - prev.x) * tension
            let cp1y = curr.y + (next.y - prev.y) * tension

            let cp2x = next.x - (nextNext.x - curr.x) * tension
            let cp2y = next.y - (nextNext.y - curr.y) * tension

            // 限制控制点Y坐标在图表范围内，防止曲线超出边界
            const minY = padding
            const maxY = padding + chartHeight

            cp1y = Math.max(minY, Math.min(maxY, cp1y))
            cp2y = Math.max(minY, Math.min(maxY, cp2y))

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
    watch(historyData, (newData, oldData) => {
      console.log('History data changed:', newData.length, 'points')
      if (chart) {
        nextTick(() => {
          chart.update()
        })
      } else if (newData.length > 0) {
        // 如果图表还未初始化但有数据了，尝试初始化图表
        console.log('Initializing chart due to data availability')
        nextTick(() => {
          initChart()
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
      // 立即获取一次数据（显示loading）
      await fetchSystemInfo(true)

      // 初始化图表 - 等待DOM更新和数据准备完成
      await nextTick()

      // 延迟初始化图表，确保DOM完全渲染
      const initChartWithRetry = () => {
        if (chartCanvas.value && chartCanvas.value.getBoundingClientRect().width > 0) {
          console.log('Initializing chart...')
          initChart()
        } else {
          console.log('Retrying chart initialization...')
          setTimeout(initChartWithRetry, 100)
        }
      }

      setTimeout(initChartWithRetry, 100)

      // 设置定时器，每5秒获取一次数据（不显示loading）
      intervalRef.value = setInterval(() => fetchSystemInfo(false), 3000)

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
      getStatusClass,
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
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0 0 8px 0;
  padding: 0;
}

.subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
  font-weight: 400;
}

.status-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-width: 120px;
}

.status-card.status-connected {
  border-color: #d1fae5;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.status-card.status-connecting {
  border-color: #fed7aa;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.status-card.status-error {
  border-color: #fecaca;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
}

.uptime-card {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  min-width: 160px;
}

.uptime-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uptime-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.uptime-value {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
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

/* 主要布局 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-column {
  display: flex;
  flex-direction: column;
}

/* 紧凑卡片样式 */
.compact-card {
  margin-bottom: 0;
}

.system-grid-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.info-label-compact {
  color: #6b7280;
  font-weight: 500;
  min-width: 60px;
}

.info-value-compact {
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

/* 网络信息紧凑样式 */
.network-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.network-item-compact {
  background: #f9fafb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
}

.network-name-compact {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.network-detail-compact {
  color: #6b7280;
  font-size: 0.8rem;
}

/* 图表样式 */
.chart-container {
  height: 320px;
  position: relative;
  width: 100%;
}

.chart-container-compact {
  height: 400px;
  position: relative;
  width: 100%;
}

.chart-container canvas,
.chart-container-compact canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.chart-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.placeholder-text {
  color: #6b7280;
  font-size: 1rem;
  text-align: center;
}

/* 水平指标行 */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card-horizontal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.3s ease;
}

.metric-card-horizontal:hover {
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.15);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-title-small {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.usage-value-large {
  font-size: 1.5rem;
  font-weight: bold;
}

.metric-details-small {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 指标网格 - 备用（保留原有） */
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
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .chart-container-compact {
    height: 350px;
  }

  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .system-monitor {
    padding: 16px;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .status-section {
    justify-content: center;
    width: 100%;
  }

  .status-card, .uptime-card {
    flex: 1;
    min-width: 140px;
  }

  .status-bar {
    gap: 16px;
  }

  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metrics-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .metric-card-horizontal {
    padding: 12px;
  }

  .usage-value-large {
    font-size: 1.25rem;
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

  .chart-container,
  .chart-container-compact {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .system-monitor {
    padding: 12px;
  }

  .title {
    font-size: 1.75rem;
  }

  .card,
  .compact-card {
    padding: 16px;
  }

  .metric-card,
  .metric-card-horizontal {
    padding: 12px;
  }

  .usage-value {
    font-size: 1.5rem;
  }

  .usage-value-large {
    font-size: 1.125rem;
  }

  .info-item-compact {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .metric-details-small {
    font-size: 0.7rem;
  }
}
</style>