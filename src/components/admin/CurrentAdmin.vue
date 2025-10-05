<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <div class="max-w-[1920px] mx-auto">
      <!-- 头部信息卡片 -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <div class="flex justify-between items-center flex-wrap gap-4">
          <!-- 左侧：标题和统计 -->
          <div class="flex items-center gap-6 flex-wrap">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold text-2xl shadow-sm border border-gray-200">
                  <span>管</span>
                </div>
                <div class="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-4 border-white rounded-full"></div>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800 m-0 mb-1">管理员控制台</h1>
                <p class="text-gray-500 m-0 text-sm">实时监控与管理</p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">👥</span>
                  <div>
                    <div class="text-xs text-gray-500">学生总数</div>
                    <div class="text-xl font-bold text-gray-700">{{ totalStudents || '0' }}</div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">📚</span>
                  <div>
                    <div class="text-xs text-gray-500">作业任务</div>
                    <div class="text-xl font-bold text-gray-700">{{ totalHomework || '0' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：时钟和操作 -->
          <div class="flex items-center gap-4">
            <div class="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-sm">
              <div class="text-lg font-bold font-mono">{{ currentTime }}</div>
              <div class="text-xs text-gray-500">{{ currentDate }}</div>
            </div>
            <button @click="refreshPage" class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold cursor-pointer transition-all hover:border-gray-400 hover:shadow-sm">
              <span class="text-xl">🔄</span>
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 主面板 - 全宽显示 -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div class="flex items-center gap-2 mb-6">
          <span class="text-2xl">🏠</span>
          <h2 class="text-xl font-bold text-gray-800 m-0">主面板</h2>
        </div>
        <div>
          <Home />
        </div>
      </div>

      <!-- 主内容区 - 两列布局 -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- 左侧列 - 班级管理和系统状态 -->
        <div class="xl:col-span-1 space-y-6">
          <!-- 班级切换器 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">🏫</span>
              <h2 class="text-xl font-bold text-gray-800 m-0">班级选择</h2>
            </div>
            <ClassSwitch @update:cid="handleClassChange" />
          </div>

          <!-- 当前班级信息 -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">📊</span>
              <h2 class="text-xl font-bold text-gray-800 m-0">当前班级</h2>
            </div>
            <div class="space-y-3">
              <div v-if="selectedCid" class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div class="text-sm text-gray-500">班级ID</div>
                <div class="text-2xl font-bold text-gray-700">{{ selectedCid }}</div>
              </div>
              <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <div class="text-sm text-gray-500">请选择班级</div>
              </div>
            </div>
          </div>

          <!-- 系统状态 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">⚡</span>
              <h2 class="text-xl font-bold text-gray-800 m-0">系统状态</h2>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span class="text-sm text-gray-700 font-medium">服务运行中</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span class="text-sm text-gray-700 font-medium">数据库连接</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span class="text-sm text-gray-700 font-medium">实时同步</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧列 - 学生和作业管理 -->
        <div class="xl:col-span-2 space-y-6">
          <!-- 学生管理 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <span class="text-2xl">👥</span>
                <h2 class="text-xl font-bold text-gray-800 m-0">学生管理</h2>
              </div>
              <div v-if="selectedCid" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200">
                当前班级：{{ selectedCid }}
              </div>
            </div>
            <div class="max-h-[500px] overflow-auto">
              <StudentList :cid="selectedCid" ref="studentListComponent" />
            </div>
          </div>

          <!-- 作业管理 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-6">
              <span class="text-2xl">📝</span>
              <h2 class="text-xl font-bold text-gray-800 m-0">作业管理</h2>
            </div>
            <div class="max-h-[500px] overflow-auto">
              <SubmitHomework :cid="selectedCid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@/views/Home.vue'
import ClassSwitch from '@/components/common/classswitch.vue'
import StudentEventSelector from '@/components/student/StudentEventSelector.vue'
import SubmitHomework from '@/components/homework/SubmitHomework.vue'

export default {
  name: 'CurrentAdmin',
  components: {
    Home,
    ClassSwitch,
    StudentList: StudentEventSelector,
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
    this.timeInterval = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    handleClassChange(cid) {
      console.log('班级切换:', cid)
      this.selectedCid = cid
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
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    },
    updateStats() {
      this.totalStudents = Math.floor(Math.random() * 50) + 20
      this.totalHomework = Math.floor(Math.random() * 10) + 5
    },
    refreshPage() {
      console.log('刷新当前页面')
      window.location.reload()
    }
  }
}
</script>

<style scoped>
/* 滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .flex-wrap {
    flex-direction: column;
    align-items: flex-start;
  }

  .max-h-\[600px\] {
    max-height: 400px;
  }
}
</style>
