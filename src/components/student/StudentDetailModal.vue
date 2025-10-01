<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click="handleBackdropClick">
    <!-- 模态框内容 -->
    <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-xl"
            :class="getAvatarColor(student.student_name)"
          >
            {{ getNameInitial(student.student_name) }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ student.student_name }}</h2>
            <p class="text-sm text-gray-400">学号: {{ student.sid }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- 模态框主体 -->
      <div class="p-6">
        <!-- 加载中状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <LoadingSpinner />
          <span class="ml-3 text-gray-400">加载分析数据中...</span>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-400 text-lg mb-2">加载失败</div>
          <div class="text-gray-400 text-sm">{{ error }}</div>
          <button
            @click="loadAnalysisData"
            class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            重试
          </button>
        </div>

        <!-- 数据展示 -->
        <div v-else-if="analysisData" class="space-y-6">
          <!-- 基本信息卡片 -->
          <div class="bg-gray-700/50 rounded-lg p-5">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              基本信息
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-gray-400 text-sm">姓名</span>
                <p class="text-white font-medium">{{ analysisData.student_name }}</p>
              </div>
              <div>
                <span class="text-gray-400 text-sm block mb-2">出勤状态</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="updateAttendance(true)"
                    :disabled="updatingAttendance"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="analysisData.attendance
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    在校
                  </button>
                  <button
                    @click="updateAttendance(false)"
                    :disabled="updatingAttendance"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="!analysisData.attendance
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    离校
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 事件统计概览 -->
          <div class="bg-gray-700/50 rounded-lg p-5">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              事件统计
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <!-- 公事 -->
              <div class="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
                <div class="text-blue-400 text-sm mb-1">公事</div>
                <div class="text-2xl font-bold text-white">{{ analysisData.event_time.official_cnt }}</div>
                <div class="text-xs text-gray-400 mt-1">次</div>
              </div>

              <!-- 私事 -->
              <div class="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 text-center">
                <div class="text-purple-400 text-sm mb-1">私事</div>
                <div class="text-2xl font-bold text-white">{{ analysisData.event_time.personal_cnt }}</div>
                <div class="text-xs text-gray-400 mt-1">次</div>
              </div>

              <!-- 病假 -->
              <div class="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-center">
                <div class="text-yellow-400 text-sm mb-1">病假</div>
                <div class="text-2xl font-bold text-white">{{ analysisData.event_time.sick_cnt }}</div>
                <div class="text-xs text-gray-400 mt-1">次</div>
              </div>

              <!-- 临时外出 -->
              <div class="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 text-center">
                <div class="text-orange-400 text-sm mb-1">临时外出</div>
                <div class="text-2xl font-bold text-white">{{ analysisData.event_time.temp_cnt }}</div>
                <div class="text-xs text-gray-400 mt-1">次</div>
              </div>
            </div>
          </div>

          <!-- 事件详情列表 -->
          <div class="bg-gray-700/50 rounded-lg p-5">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              事件详情
            </h3>

            <div class="space-y-4">
              <!-- 公事列表 -->
              <div v-if="analysisData.event_list.official_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 class="text-blue-400 font-medium">公事记录</h4>
                </div>
                <div class="bg-gray-800/50 rounded-lg p-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in analysisData.event_list.official_list"
                      :key="'official-' + date"
                      class="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 私事列表 -->
              <div v-if="analysisData.event_list.personal_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h4 class="text-purple-400 font-medium">私事记录</h4>
                </div>
                <div class="bg-gray-800/50 rounded-lg p-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in analysisData.event_list.personal_list"
                      :key="'personal-' + date"
                      class="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 病假列表 -->
              <div v-if="analysisData.event_list.sick_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <h4 class="text-yellow-400 font-medium">病假记录</h4>
                </div>
                <div class="bg-gray-800/50 rounded-lg p-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in analysisData.event_list.sick_list"
                      :key="'sick-' + date"
                      class="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 临时外出列表 -->
              <div v-if="analysisData.event_list.temp_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                  <h4 class="text-orange-400 font-medium">临时外出记录</h4>
                </div>
                <div class="bg-gray-800/50 rounded-lg p-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in analysisData.event_list.temp_list"
                      :key="'temp-' + date"
                      class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 无事件记录 -->
              <div
                v-if="analysisData.event_time.official_cnt === 0 &&
                     analysisData.event_time.personal_cnt === 0 &&
                     analysisData.event_time.sick_cnt === 0 &&
                     analysisData.event_time.temp_cnt === 0"
                class="text-center py-8"
              >
                <div class="text-gray-500 text-sm">暂无事件记录</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-700 sticky bottom-0 bg-gray-800">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StudentAdminService from '@/services/admin/student'
import notificationService from '@/services/common/notification'

// Props
const props = defineProps({
  student: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// 状态
const loading = ref(false)
const error = ref(null)
const analysisData = ref(null)
const updatingAttendance = ref(false)

// 获取姓名首字母
const getNameInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

// 获取头像颜色
const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// 格式化日期 (20250825 -> 2025-08-25)
const formatDate = (dateNum) => {
  const dateStr = String(dateNum)
  if (dateStr.length !== 8) return dateStr

  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)

  return `${year}-${month}-${day}`
}

// 加载分析数据
const loadAnalysisData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await StudentAdminService.getStudentAnalysis(props.student.sid)

    if (response.code === 0 && response.data) {
      analysisData.value = response.data
    } else {
      throw new Error(response.message || '获取分析数据失败')
    }
  } catch (err) {
    console.error('加载学生分析数据失败:', err)
    error.value = err.message || '获取分析数据失败'
    notificationService.notify(error.value, 'error')
  } finally {
    loading.value = false
  }
}

// 更新出勤状态
const updateAttendance = async (attendance) => {
  // 如果状态相同，不需要更新
  if (analysisData.value.attendance === attendance) return

  updatingAttendance.value = true

  try {
    await StudentAdminService.changeAttendance(props.student.sid, attendance)

    // 更新本地状态
    analysisData.value.attendance = attendance

    notificationService.notify(
      `${analysisData.value.student_name} 状态已更改为 ${attendance ? '在校' : '离校'}`,
      'success'
    )
  } catch (err) {
    console.error('更改出勤状态失败:', err)
    notificationService.notify(err.message || '更改出勤状态失败', 'error')
  } finally {
    updatingAttendance.value = false
  }
}

// 处理背景点击
const handleBackdropClick = () => {
  if (!loading.value) {
    emit('close')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadAnalysisData()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.5);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.8);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}
</style>
