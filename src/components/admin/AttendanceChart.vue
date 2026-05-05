<template>
  <div class="attendance-chart">
    <v-chart :option="chartOption" :autoresize="true" class="chart-container" />
  </div>
</template>

<script setup>
import { computed } from "vue"
import VChart from "vue-echarts"
import { use } from "echarts/core"
import { LineChart } from "echarts/charts"
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import { formatYYYYMMDDToShort } from "@/utils/formatDate"

use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
])

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

function getCssVar(name, fallback) {
  if (typeof window === "undefined") {
    return fallback
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

const chartOption = computed(() => {
  const dates = props.data.map((item) => formatYYYYMMDDToShort(item.date))
  const rates = props.data.map((item) => Number(item.attendance_rate).toFixed(1))

  const foreground = getCssVar("--color-text-primary", "#f1f4fb")
  const secondary = getCssVar("--color-text-secondary", "#c0c7d4")
  const tertiary = getCssVar("--color-text-tertiary", "#727887")
  const primary = getCssVar("--color-primary", "#93a1bb")
  const border = getCssVar("--border", "rgba(255,255,255,0.08)")

  return {
    backgroundColor: "transparent",
    title: {
      text: "每日出勤率趋势",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: foreground,
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const param = params[0]
        return `${param.name}<br/>出勤率 ${param.value}%`
      },
      backgroundColor: "rgba(10, 13, 18, 0.96)",
      borderColor: border,
      borderWidth: 1,
      textStyle: {
        color: foreground,
      },
    },
    grid: {
      left: "48px",
      right: "28px",
      top: "62px",
      bottom: "42px",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: border,
        },
      },
      axisLabel: {
        color: tertiary,
        fontSize: 12,
        rotate: dates.length > 10 ? 45 : 0,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: {
        formatter: "{value}%",
        color: tertiary,
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: border,
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "出勤率",
        type: "line",
        data: rates,
        smooth: true,
        smoothMonotone: "x",
        symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          width: 3,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: primary },
              { offset: 1, color: "#b89a68" },
            ],
          },
        },
        itemStyle: {
          color: primary,
          borderColor: "#080a0f",
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(147, 161, 187, 0.24)" },
              { offset: 1, color: "rgba(147, 161, 187, 0.03)" },
            ],
          },
        },
        emphasis: {
          focus: "series",
          itemStyle: {
            color: primary,
            borderColor: secondary,
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: "rgba(147, 161, 187, 0.34)",
          },
        },
      },
    ],
  }
})
</script>

<style scoped>
@reference "tailwindcss";

.attendance-chart {
  @apply h-full w-full;
}

.chart-container {
  @apply w-full;
  height: 350px;
}
</style>
