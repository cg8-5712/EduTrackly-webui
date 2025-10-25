<template>
  <div class="attendance-chart">
    <v-chart :option="chartOption" :autoresize="true" class="chart-container" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { formatYYYYMMDDToShort } from '@/utils/formatDate'

// 注册 ECharts 组件
use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// 计算图表配置
const chartOption = computed(() => {
  const dates = props.data.map(item => formatYYYYMMDDToShort(item.date))
  const rates = props.data.map(item => Number(item.attendance_rate).toFixed(1))

  return {
    title: {
      text: '每日出勤率趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const param = params[0]
        return `${param.name}<br/>出勤率: ${param.value}%`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#3b82f6',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '50px',
      right: '30px',
      top: '60px',
      bottom: '50px',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        rotate: dates.length > 10 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '出勤率',
        type: 'line',
        data: rates,
        smooth: true,
        smoothMonotone: 'x',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#8b5cf6' }
            ]
          }
        },
        itemStyle: {
          color: '#3b82f6',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#3b82f6',
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.5)'
          }
        }
      }
    ]
  }
})
</script>

<style scoped>
/* 已转换为 Tailwind: w-full h-full */
.attendance-chart {
  @apply w-full h-full;
}

.chart-container {
  @apply w-full;
  height: 350px;
}
</style>
