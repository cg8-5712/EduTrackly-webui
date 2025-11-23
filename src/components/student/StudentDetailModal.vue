<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click="handleBackdropClick">
    <!-- 模态框内容 -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" @click.stop="handleModalClick">
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-xl"
            :class="getAvatarColor(student.student_name)"
          >
            {{ getNameInitial(student.student_name) }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ student.student_name }}</h2>
            <p class="text-sm text-gray-600">学号: {{ student.sid }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-800 transition-colors duration-200"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- 模态框主体 -->
      <div class="p-6">
        <!-- 加载中状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <LoadingSpinner />
          <span class="ml-3 text-gray-600">加载分析数据中...</span>
        </div>

        <!-- 错误状态 - 仍显示基本功能 -->
        <div v-else-if="error" class="space-y-6">
          <!-- 错误提示 -->
          <div class="bg-red-50 border border-red-300 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="flex-1">
                <div class="text-red-700 font-medium mb-1">加载分析数据失败</div>
                <div class="text-gray-600 text-sm">{{ error }}</div>
                <button
                  @click="loadAnalysisData"
                  class="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  重试
                </button>
              </div>
            </div>
          </div>

          <!-- 基本信息（仅使用 props 数据） -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              基本信息
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-gray-600 text-sm">姓名</span>
                <p class="text-gray-800 font-medium">{{ student.student_name }}</p>
              </div>
              <div>
                <span class="text-gray-600 text-sm block mb-2">出勤状态</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="updateAttendance(true)"
                    :disabled="updatingAttendance"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="student.attendance
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    在校
                  </button>
                  <button
                    @click="updateAttendance(false)"
                    :disabled="updatingAttendance"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="!student.attendance
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    离校
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 添加历史记录 -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加历史记录
            </h3>
            <div class="space-y-4">
              <!-- 日期选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">选择日期</label>
                <div class="relative">
                  <button
                    @click="toggleCalendar"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none text-left flex items-center justify-between"
                  >
                    <span>{{ eventForm.displayDate || '点击选择日期' }}</span>
                    <span class="text-2xl">📅</span>
                  </button>
                  <div
                    v-if="showCalendar"
                    class="calendar-popup absolute top-full left-0 mt-2 z-50"
                    @click.stop
                  >
                    <Calendar mode="single" @select-date="onDateSelect" />
                  </div>
                </div>
              </div>

              <!-- 事件类型选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">事件类型</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    @click="eventForm.eventType = 'official'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'official'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'"
                  >
                    公事
                  </button>
                  <button
                    @click="eventForm.eventType = 'personal'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'personal'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white'"
                  >
                    私事
                  </button>
                  <button
                    @click="eventForm.eventType = 'sick'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'sick'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-yellow-500 hover:text-white'"
                  >
                    病假
                  </button>
                  <button
                    @click="eventForm.eventType = 'temp'"
                    :disabled="isStudentPresent"
                    :title="isStudentPresent ? '在校学生不能选择临时外出' : ''"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'temp'
                      ? 'bg-orange-600 text-white'
                      : isStudentPresent
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white'"
                  >
                    临时外出
                  </button>
                </div>
                <p v-if="isStudentPresent" class="text-yellow-600 text-xs mt-2">
                  ⚠️ 当前学生状态为在校，不能选择临时外出
                </p>
              </div>

              <!-- 提交按钮 -->
              <div class="flex justify-end">
                <button
                  @click="submitEvent"
                  :disabled="!eventForm.date || !eventForm.eventType || submittingEvent"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <LoadingSpinner v-if="submittingEvent" size="small" />
                  {{ submittingEvent ? '提交中...' : '提交记录' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据展示 -->
        <div v-else-if="analysisData" class="space-y-6">
          <!-- 基本信息卡片 -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              基本信息
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-gray-600 text-sm">姓名</span>
                <p class="text-gray-800 font-medium">{{ analysisData.student_name }}</p>
              </div>
              <div>
                <span class="text-gray-600 text-sm block mb-2">出勤状态</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="updateAttendance(true)"
                    :disabled="updatingAttendance"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="analysisData.attendance
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    在校
                  </button>
                  <button
                    @click="updateAttendance(false)"
                    :disabled="updatingAttendance"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="!analysisData.attendance
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    离校
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 添加历史记录卡片 -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加历史记录
            </h3>
            <div class="space-y-4">
              <!-- 日期选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">选择日期</label>
                <div class="relative">
                  <button
                    @click="toggleCalendar"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none text-left flex items-center justify-between"
                  >
                    <span>{{ eventForm.displayDate || '点击选择日期' }}</span>
                    <span class="text-2xl">📅</span>
                  </button>
                  <div
                    v-if="showCalendar"
                    class="calendar-popup absolute top-full left-0 mt-2 z-50"
                    @click.stop
                  >
                    <Calendar mode="single" @select-date="onDateSelect" />
                  </div>
                </div>
              </div>

              <!-- 事件类型选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">事件类型</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    @click="eventForm.eventType = 'official'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'official'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'"
                  >
                    公事
                  </button>
                  <button
                    @click="eventForm.eventType = 'personal'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'personal'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white'"
                  >
                    私事
                  </button>
                  <button
                    @click="eventForm.eventType = 'sick'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'sick'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-yellow-500 hover:text-white'"
                  >
                    病假
                  </button>
                  <button
                    @click="eventForm.eventType = 'temp'"
                    :disabled="isStudentPresent"
                    :title="isStudentPresent ? '在校学生不能选择临时外出' : ''"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    :class="eventForm.eventType === 'temp'
                      ? 'bg-orange-600 text-white'
                      : isStudentPresent
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white'"
                  >
                    临时外出
                  </button>
                </div>
                <p v-if="isStudentPresent" class="text-yellow-600 text-xs mt-2">
                  ⚠️ 当前学生状态为在校，不能选择临时外出
                </p>
              </div>

              <!-- 提交按钮 -->
              <div class="flex justify-end">
                <button
                  @click="submitEvent"
                  :disabled="!eventForm.date || !eventForm.eventType || submittingEvent"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <LoadingSpinner v-if="submittingEvent" size="small" />
                  {{ submittingEvent ? '提交中...' : '提交记录' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 事件统计概览 -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              事件统计
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <!-- 公事 -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div class="text-blue-700 text-sm mb-1">公事</div>
                <div class="text-2xl font-bold text-gray-800">{{ analysisData.event_time.official_cnt }}</div>
                <div class="text-xs text-gray-600 mt-1">次</div>
              </div>

              <!-- 私事 -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div class="text-purple-700 text-sm mb-1">私事</div>
                <div class="text-2xl font-bold text-gray-800">{{ analysisData.event_time.personal_cnt }}</div>
                <div class="text-xs text-gray-600 mt-1">次</div>
              </div>

              <!-- 病假 -->
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div class="text-yellow-700 text-sm mb-1">病假</div>
                <div class="text-2xl font-bold text-gray-800">{{ analysisData.event_time.sick_cnt }}</div>
                <div class="text-xs text-gray-600 mt-1">次</div>
              </div>

              <!-- 临时外出 -->
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div class="text-orange-700 text-sm mb-1">临时外出</div>
                <div class="text-2xl font-bold text-gray-800">{{ analysisData.event_time.temp_cnt }}</div>
                <div class="text-xs text-gray-600 mt-1">次</div>
              </div>
            </div>
          </div>

          <!-- 事件详情列表 -->
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              事件详情
            </h3>

            <div class="space-y-4">
              <!-- 公事列表 -->
              <div v-if="sortedEventLists.official_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 class="text-blue-700 font-medium">公事记录</h4>
                </div>
                <div class="bg-white rounded-lg p-3 border border-gray-200">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in sortedEventLists.official_list"
                      :key="'official-' + date"
                      class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 私事列表 -->
              <div v-if="sortedEventLists.personal_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h4 class="text-purple-700 font-medium">私事记录</h4>
                </div>
                <div class="bg-white rounded-lg p-3 border border-gray-200">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in sortedEventLists.personal_list"
                      :key="'personal-' + date"
                      class="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 病假列表 -->
              <div v-if="sortedEventLists.sick_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <h4 class="text-yellow-700 font-medium">病假记录</h4>
                </div>
                <div class="bg-white rounded-lg p-3 border border-gray-200">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in sortedEventLists.sick_list"
                      :key="'sick-' + date"
                      class="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full"
                    >
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 临时外出列表 -->
              <div v-if="sortedEventLists.temp_list.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                  <h4 class="text-orange-700 font-medium">临时外出记录</h4>
                </div>
                <div class="bg-white rounded-lg p-3 border border-gray-200">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="date in sortedEventLists.temp_list"
                      :key="'temp-' + date"
                      class="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
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
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Calendar from '@/components/common/calendar.vue'
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
const submittingEvent = ref(false)
const showCalendar = ref(false)
const eventForm = reactive({
  date: '', // YYYYMMDD 格式
  displayDate: '', // 显示格式
  eventType: ''
})

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

// 计算属性：判断学生是否在校
const isStudentPresent = computed(() => {
  // 优先使用 analysisData 的数据，否则使用 props.student 的数据
  if (analysisData.value) {
    return analysisData.value.attendance === true
  }
  return props.student.attendance === true
})

// 计算属性：排序后的事件列表（从早到晚）
const sortedEventLists = computed(() => {
  if (!analysisData.value) {
    return {
      official_list: [],
      personal_list: [],
      sick_list: [],
      temp_list: []
    }
  }

  return {
    official_list: [...analysisData.value.event_list.official_list].sort((a, b) => a - b),
    personal_list: [...analysisData.value.event_list.personal_list].sort((a, b) => a - b),
    sick_list: [...analysisData.value.event_list.sick_list].sort((a, b) => a - b),
    temp_list: [...analysisData.value.event_list.temp_list].sort((a, b) => a - b)
  }
})

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
    notificationService.error(error.value);
  } finally {
    loading.value = false
  }
}

// 更新出勤状态
const updateAttendance = async (attendance) => {
  // 获取当前状态（优先使用 analysisData，否则使用 student）
  const currentAttendance = analysisData.value ? analysisData.value.attendance : props.student.attendance

  // 如果状态相同，不需要更新
  if (currentAttendance === attendance) return

  updatingAttendance.value = true

  try {
    await StudentAdminService.changeAttendance(props.student.sid, attendance)

    // 更新本地状态
    if (analysisData.value) {
      analysisData.value.attendance = attendance
    }
    // 同时更新 props 中的 student 对象（如果可能）
    if (props.student) {
      props.student.attendance = attendance
    }

    const studentName = analysisData.value ? analysisData.value.student_name : props.student.student_name
    notificationService.success(
      `${studentName} 状态已更改为 ${attendance ? '在校' : '离校'}`,
    )
  } catch (err) {
    console.error('更改出勤状态失败:', err)
    notificationService.error(err.message || '更改出勤状态失败');
  } finally {
    updatingAttendance.value = false
  }
}

// 获取今天的日期 (YYYY-MM-DD 格式)
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 切换日历显示
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

// 处理日历日期选择
const onDateSelect = (dateInt) => {
  // dateInt 格式为 YYYYMMDD
  eventForm.date = dateInt

  // 转换为显示格式 YYYY-MM-DD
  const dateStr = String(dateInt)
  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  eventForm.displayDate = `${year}-${month}-${day}`

  // 关闭日历
  showCalendar.value = false
}

// 提交事件记录
const submitEvent = async () => {
  if (!eventForm.date || !eventForm.eventType) {
    notificationService.warn('请选择日期和事件类型');
    return
  }

  // 检查在校学生不能选择临时外出
  if (eventForm.eventType === 'temp' && isStudentPresent.value) {
    notificationService.error('在校学生不能选择临时外出');
    return
  }

  submittingEvent.value = true

  try {
    // 构建事件数据
    const events = [{
      sid: props.student.sid,
      event_type: eventForm.eventType
    }]

    // 提交事件（date 已经是 YYYYMMDD 整数格式）
    await StudentAdminService.submitStudentEvents(events, parseInt(eventForm.date))

    notificationService.success('历史记录添加成功')

    // 重置表单
    eventForm.date = ''
    eventForm.displayDate = ''
    eventForm.eventType = ''

    // 重新加载分析数据以显示新添加的记录
    await loadAnalysisData()

  } catch (err) {
    console.error('提交事件记录失败:', err)
    notificationService.error(err.message || '提交事件记录失败');
  } finally {
    submittingEvent.value = false
  }
}

// 处理背景点击
const handleBackdropClick = () => {
  if (!loading.value) {
    emit('close')
  }
}

// 处理模态框内容点击（关闭日历）
const handleModalClick = (event) => {
  // 如果点击的不是日历按钮或日历本身，关闭日历
  if (showCalendar.value) {
    const target = event.target
    const isCalendarButton = target.closest('button')?.textContent?.includes('📅')
    const isCalendar = target.closest('.calendar-popup') || target.closest('[class*="calendar"]')

    if (!isCalendarButton && !isCalendar) {
      showCalendar.value = false
    }
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

/* 日历弹出层样式 */
.calendar-popup {
  z-index: 9999 !important;
  position: absolute;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
</style>
