<template>
  <div class="system-info-container">

    <h2 class="title">系统信息概览</h2>

    <div class="info-layout">

      <!-- 左侧系统信息 -->
      <div class="left-panel" v-if="systemInfo.data?.os">
        <div class="info-card system-card">
          <h3>系统信息</h3>
          <div class="info-item"><span>类型:</span> {{ systemInfo.data.os.type }}</div>
          <div class="info-item"><span>平台:</span> {{ systemInfo.data.os.platform }}</div>
          <div class="info-item"><span>版本:</span> {{ systemInfo.data.os.release }}</div>
          <div class="info-item"><span>架构:</span> {{ systemInfo.data.os.arch }}</div>
          <div class="info-item"><span>主机名:</span> {{ systemInfo.data.os.hostname }}</div>
        </div>
      </div>

      <!-- 右侧指标信息 -->
      <div class="right-panel">

        <!-- CPU -->
        <div class="info-card chart-card" v-if="systemInfo.data?.cpu">
          <h3>CPU 使用率</h3>
          <div class="chart-wrapper">
            <Pie :data="cpuChartData" :options="chartOptions" />
            <div class="chart-label" :style="{ color: getLevelColor(systemInfo.data.cpu[0].usage_percent) }">
              {{ systemInfo.data.cpu[0].usage_percent }}%
            </div>
          </div>
          <div class="metric-info">
            <span>速度:</span> {{ systemInfo.data.cpu[0].speed }} MHz
          </div>
        </div>

        <!-- 内存 -->
        <div class="info-card chart-card" v-if="systemInfo.data?.memory">
          <h3>内存使用率</h3>
          <div class="chart-wrapper">
            <Pie :data="memoryChartData" :options="chartOptions" />
            <div class="chart-label" :style="{ color: getLevelColor(systemInfo.data.memory.usage_percent) }">
              {{ systemInfo.data.memory.usage_percent }}%
            </div>
          </div>
          <div class="metric-info">
            <span>已用:</span> {{ formatBytes(systemInfo.data.memory.total - systemInfo.data.memory.free) }}
            <span>空闲:</span> {{ formatBytes(systemInfo.data.memory.free) }}
            <span>总计:</span> {{ formatBytes(systemInfo.data.memory.total) }}
          </div>
        </div>

        <!-- 硬盘 -->
        <div class="info-card chart-card" v-if="totalDisk">
          <h3>硬盘使用率</h3>
          <div class="chart-wrapper">
            <Pie :data="diskChartData" :options="chartOptions" />
            <div class="chart-label" :style="{ color: getLevelColor(totalDisk.used_percent) }">
              {{ totalDisk.used_percent }}%
            </div>
          </div>
          <div class="metric-info">
            <span>已用:</span> {{ formatBytes(totalDisk.used) }}
            <span>空闲:</span> {{ formatBytes(totalDisk.free) }}
            <span>总容量:</span> {{ formatBytes(totalDisk.size) }}
          </div>
        </div>

        <!-- 网络 -->
        <div class="info-card network-card" v-if="systemInfo.data?.network?.length">
          <h3>网络信息</h3>
          <div class="network-scroll">
            <div v-for="(net, i) in systemInfo.data.network" :key="i" class="network-card-item">
              <div class="net-interface">{{ net.interface }}</div>
              <div v-for="(addr, j) in net.addresses" :key="j" class="net-detail">
                <div><span>IP:</span> {{ addr.address }}</div>
                <div><span>MAC:</span> {{ addr.mac }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import SystemServices from '@/services/admin/system'

ChartJS.register(ArcElement, Tooltip, Legend)

const systemInfo = ref({ data: {} })

// 获取系统信息
const fetchSystemInfo = async () => {
  try {
    const response = await SystemServices.getSystemInfo()
    systemInfo.value = response.data
  } catch (err) {
    console.error(err)
  }
}

// 每10秒刷新
let interval
onMounted(() => {
  fetchSystemInfo()
  interval = setInterval(fetchSystemInfo, 10000)
})
onUnmounted(() => clearInterval(interval))

// 格式化字节
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const sizes = ['Bytes','KB','MB','GB','TB']
  const i = Math.floor(Math.log(bytes)/Math.log(1024))
  return Math.round(bytes/Math.pow(1024,i)) + ' ' + sizes[i]
}

// 分级颜色
const getLevelColor = (percent) => {
  if(percent >= 90) return '#e74c3c' // 红
  if(percent >= 70) return '#f39c12' // 橙
  return '#27ae60' // 绿
}

// CPU 图表数据
const cpuChartData = computed(() => {
  if(!systemInfo.value.data.cpu)
    return { labels: ['使用', '空闲'], datasets: [{ data: [0, 100], backgroundColor: ['#27ae60','#dcdcdc'] }] }

  const used = parseFloat(systemInfo.value.data.cpu[0].usage_percent)
  return {
    labels: ['使用', '空闲'],
    datasets: [{
      label: 'CPU使用率',
      data: [used, 100-used],
      backgroundColor: [getLevelColor(used), '#dcdcdc']
    }]
  }
})

// 内存图表数据
const memoryChartData = computed(() => {
  if(!systemInfo.value.data.memory)
    return { labels: ['已用','空闲'], datasets: [{ data:[0,100], backgroundColor:['#27ae60','#dcdcdc'] }] }

  const used = parseFloat(systemInfo.value.data.memory.usage_percent)
  return {
    labels: ['已用','空闲'],
    datasets: [{
      label: '内存使用率',
      data: [used,100-used],
      backgroundColor: [getLevelColor(used),'#dcdcdc']
    }]
  }
})

// 硬盘总计
const totalDisk = computed(() => {
  const disks = systemInfo.value.data.disk?.filter(d=>d.size>0) || []
  if(!disks.length) return null
  const totalSize = disks.reduce((sum,d)=>sum+d.size,0)
  const totalUsed = disks.reduce((sum,d)=>sum+d.used,0)
  return {
    size: totalSize,
    used: totalUsed,
    free: totalSize-totalUsed,
    used_percent: Math.round(totalUsed/totalSize*100)
  }
})

// 硬盘图表数据
const diskChartData = computed(() => {
  if(!totalDisk.value)
    return { labels:['已用','空闲'], datasets:[{ data:[0,100], backgroundColor:['#27ae60','#dcdcdc'] }] }

  return {
    labels:['已用','空闲'],
    datasets:[{
      label:'硬盘使用率',
      data:[totalDisk.value.used_percent,100-totalDisk.value.used_percent],
      backgroundColor:[getLevelColor(totalDisk.value.used_percent),'#dcdcdc']
    }]
  }
})

// 饼图显示配置
const chartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.parsed
          return `${value}%`
        }
      }
    }
  }
}
</script>

<style scoped>
.system-info-container {
  padding: 20px;
  font-family: 'Segoe UI', Roboto, sans-serif;
  background: #f5f6fa;
  color: #333;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg,#6a11cb,#2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 两列布局 */
.info-layout {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.left-panel {
  flex: 1 1 250px;
}

.right-panel {
  flex: 3 1 700px;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(320px,1fr));
  gap: 20px;
}

/* 卡片通用样式 */
.info-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

h3 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
}

/* 系统信息卡 */
.system-card .info-item {
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.system-card .info-item span {
  font-weight: bold;
  color: #3498db;
}

/* 饼图样式 */
.chart-card .chart-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
}

.chart-card .chart-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 1.4rem;
  font-weight: bold;
}

/* 指标文字 */
.metric-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.metric-info span {
  font-size: 0.9rem;
  color: #555;
}

/* 网络信息 */
.network-card {
  max-height: 350px;
  overflow-y: auto;
}

.network-scroll {
  padding-right: 5px;
}

.network-card-item {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  transition: background 0.2s;
}

.network-card-item:hover {
  background: #e0e0e0;
}

.net-interface {
  font-weight: bold;
  color: #3498db;
  margin-bottom: 6px;
}

.net-detail span {
  font-weight: bold;
  color: #333;
  margin-right: 5px;
}
</style>
