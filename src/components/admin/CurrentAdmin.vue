<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 p-5 font-sans">
    <!-- 管理员信息头部 -->
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-5 shadow-2xl border border-white/20">
      <div class="flex justify-between items-center gap-6 flex-wrap">
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="w-15 h-15 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/30">
              <span>管</span>
            </div>
            <div class="absolute bottom-0.5 right-0.5 w-4.5 h-4.5 bg-emerald-500 border-3 border-white rounded-full animate-pulse"></div>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-1">管理员控制台</h1>
            <p class="text-gray-500 m-0 text-sm">教育管理系统 - 实时监控与管理</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex gap-4">
            <div class="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-slate-200 py-4 px-5 rounded-xl border border-slate-300/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div class="text-3xl w-10 h-10 flex items-center justify-center bg-blue-600/10 rounded-lg">
                👥
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="text-xl font-bold text-gray-800 leading-none">{{ totalStudents || '0' }}</div>
                <div class="text-xs text-gray-500 font-medium">学生总数</div>
              </div>
            </div>
            <div class="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-slate-200 py-4 px-5 rounded-xl border border-slate-300/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div class="text-3xl w-10 h-10 flex items-center justify-center bg-blue-600/10 rounded-lg">
                📚
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="text-xl font-bold text-gray-800 leading-none">{{ totalHomework || '0' }}</div>
                <div class="text-xs text-gray-500 font-medium">作业任务</div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button class="flex items-center gap-2 py-3 px-4.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none rounded-2xl text-sm font-semibold cursor-pointer transition-all duration-300 shadow-md shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40 active:translate-y-0 active:shadow-sm active:shadow-blue-600/30" @click="refreshPage" title="刷新页面">
              <span class="text-base animate-spin-on-hover">🔄</span>
              <span class="text-sm">刷新</span>
            </button>

            <div class="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-4 px-5 rounded-xl text-center shadow-lg shadow-blue-600/30 min-w-40">
              <div class="text-lg font-bold mb-1 font-mono">{{ currentTime }}</div>
              <div class="text-xs opacity-90">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex flex-col gap-5">
      <!-- 上半部分：Home页面和控制面板 -->
      <div class="flex gap-5 h-[45vh] min-h-96">
        <!-- 左侧 Views/Home 页面内容 -->
        <div class="flex-2 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
          <div class="py-5 px-5 pb-0 border-b border-slate-300/20 mb-5">
            <h2 class="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2 pb-4">
              <span class="text-lg">🏠</span>
              主面板
            </h2>
          </div>
          <div class="flex-1 overflow-auto px-5 pb-5">
            <Home />
          </div>
        </div>

        <!-- 右侧控制面板 -->
        <div class="flex-1 min-w-80 flex flex-col gap-4">
          <!-- 班级切换器 -->
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex-1">
            <div class="p-5 border-b border-slate-300/20">
              <h3 class="text-lg font-semibold text-gray-800 m-0 flex items-center gap-2">
                <span class="text-lg">🏫</span>
                班级管理
              </h3>
            </div>
            <div class="p-5">
              <ClassSwitch @update:cid="handleClassChange" />
            </div>
          </div>

          <!-- 系统状态卡片 -->
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex-1">
            <div class="p-5 border-b border-slate-300/20">
              <h3 class="text-lg font-semibold text-gray-800 m-0 flex items-center gap-2">
                <span class="text-lg">⚡</span>
                系统状态
              </h3>
            </div>
            <div class="p-5 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-sm text-gray-600 font-medium">服务运行中</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-sm text-gray-600 font-medium">数据库连接</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-sm text-gray-600 font-medium">实时同步</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部区域：学生管理和作业提交 -->
      <div class="flex gap-5 h-[45vh] min-h-[350px]">
        <!-- 学生列表区域 -->
        <div class="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
          <div class="p-5 border-b border-slate-300/20 flex justify-between items-center flex-wrap gap-3">
            <h2 class="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
              <span class="text-lg">👥</span>
              学生管理
            </h2>
            <div class="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-1 px-3 rounded-full text-xs font-medium" v-if="selectedCid">
              当前班级：{{ selectedCid }}
            </div>
          </div>
          <div class="flex-1 p-5 overflow-auto">
            <StudentList :cid="selectedCid" ref="studentListComponent" />
          </div>
        </div>

        <!-- 作业提交区域 -->
        <div class="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
          <div class="p-5 border-b border-slate-300/20">
            <h2 class="text-xl font-semibold text-gray-800 m-0 flex items-center gap-2">
              <span class="text-lg">📝</span>
              作业管理
            </h2>
          </div>
          <div class="flex-1 p-5 overflow-auto">
            <SubmitHomework :cid="selectedCid" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@/views/Home.vue'
import ClassSwitch from '@/components/common/classswitch.vue'
import StudentList from '@/components/student/studentlist.vue'
import SubmitHomework from '@/components/homework/SubmitHomework.vue'

export default {
  name: 'HomeContainer',
  components: {
    Home,
    ClassSwitch,
    StudentList,
    SubmitHomework
  },
  data() {
    return {
      selectedCid: null,
      currentTime: '',
      currentDate: '',
      timeInterval: null,
      totalStudents: 0,
      totalHomework: 0
    }
  },
  mounted() {
    this.updateTime()
    // 每秒更新时间
    this.timeInterval = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    // 清理定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    handleClassChange(cid) {
      console.log('班级切换:', cid)
      this.selectedCid = cid
      // 更新统计数据（示例）
      this.updateStats()
    },
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      this.currentDate = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    },
    updateStats() {
      // 模拟统计数据更新
      this.totalStudents = Math.floor(Math.random() * 50) + 20
      this.totalHomework = Math.floor(Math.random() * 10) + 5
    },
    refreshPage() {
      console.log('刷新当前页面')
      // 刷新当前页面
      window.location.reload()
    }
  }
}
</script>

<style scoped>
/* 动画 */
@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-on-hover:hover {
  animation: rotate 0.8s ease-in-out infinite;
}

/* 滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .p-5 {
    padding: 16px;
  }

  .p-6 {
    padding: 20px;
  }

  .gap-6 {
    gap: 20px;
  }

  .gap-4 {
    gap: 12px;
  }

  .py-3.px-4\.5 {
    padding: 10px 14px;
    font-size: 0.8rem;
  }

  .gap-6 {
    gap: 20px;
  }

  .gap-4 {
    gap: 12px;
  }

  .py-4.px-5 {
    padding: 12px 16px;
  }

  .min-w-80 {
    min-width: 280px;
  }
}

@media (max-width: 1024px) {
  .h-\[45vh\] {
    height: auto;
    min-height: 350px;
  }

  .min-h-\[350px\] {
    min-height: 300px;
  }

  .min-w-80 {
    min-width: 250px;
  }

  .text-3xl {
    font-size: 1.6rem;
  }

  .text-lg {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .p-5 {
    padding: 12px;
  }

  .p-6 {
    padding: 16px;
  }

  .flex-wrap {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .justify-center {
    justify-content: center;
  }

  .flex-direction-column {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .flex-direction-column-reverse {
    flex-direction: column-reverse;
    gap: 12px;
    align-items: center;
  }

  .self-center {
    align-self: center;
    min-width: 120px;
  }

  .justify-center {
    justify-content: center;
    flex-wrap: wrap;
  }

  .self-center {
    align-self: center;
  }

  .flex {
    flex-direction: column;
    gap: 16px;
    height: auto;
    min-height: 300px;
  }

  .flex-col.gap-4 {
    flex-direction: row;
    min-width: auto;
    gap: 12px;
  }

  .flex-1 {
    flex: 1;
  }

  .flex {
    flex-direction: column;
    gap: 16px;
    height: auto;
    min-height: 400px;
  }

  .text-3xl {
    font-size: 1.5rem;
    text-align: center;
  }

  .text-sm {
    text-align: center;
  }

  .text-lg {
    font-size: 1.1rem;
  }

  .text-xs {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .p-5 {
    padding: 8px;
  }

  .p-6 {
    padding: 12px;
  }

  .w-15.h-15 {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .text-3xl {
    font-size: 1.3rem;
  }

  .flex-col.gap-4 {
    flex-direction: column;
    gap: 8px;
  }

  .py-4.px-5 {
    padding: 10px 12px;
    justify-content: center;
  }

  .flex-col.gap-4 {
    flex-direction: column;
    gap: 8px;
  }

  .p-5 {
    padding: 12px;
  }

  .text-lg {
    font-size: 1rem;
  }

  .py-4.px-5 {
    padding: 12px 16px;
    min-width: 120px;
  }
}
</style>