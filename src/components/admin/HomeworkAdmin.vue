<template>
  <div class="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      <!-- 头部区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-start flex-wrap gap-6">
          <div class="flex-1 min-w-[300px]">
            <h1 class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-2">作业管理</h1>
            <p class="text-gray-500 text-lg m-0 font-normal">管理所有班级作业，查看作业内容和截止日期</p>
          </div>
          <div class="flex gap-4">
            <button @click="showCreateDialog = true" class="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40">
              <span class="text-base">➕</span>
              创建作业
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索和过滤区域 -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <div class="flex gap-6 items-end flex-wrap">
          <!-- 班级筛选 -->
          <div class="flex-1 min-w-[200px]">
            <label class="block mb-2 font-semibold text-gray-700">班级筛选</label>
            <div class="relative" ref="classSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="toggleClassDropdown">
                <span class="flex-1 text-left">{{ selectedClassName || '全部班级' }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showClassDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200" v-show="showClassDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': !filters.cid }"
                  @click="selectClass(null, '全部班级')"
                >
                  全部班级
                  <span v-if="!filters.cid" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  v-for="classItem in classList"
                  :key="classItem.cid"
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': filters.cid === classItem.cid }"
                  @click="selectClass(classItem.cid, classItem.class_name)"
                >
                  {{ classItem.class_name }}
                  <span v-if="filters.cid === classItem.cid" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 开始日期 -->
          <div class="min-w-[160px]">
            <label class="block mb-2 font-semibold text-gray-700">开始日期</label>
            <div class="relative" ref="startDateCalendarRef">
              <input
                :value="filters.startDate"
                type="text"
                readonly
                placeholder="选择开始日期"
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm transition-colors cursor-pointer focus:outline-none focus:border-blue-600"
                @click="showStartDateCalendar = !showStartDateCalendar"
              >
              <div v-if="showStartDateCalendar" class="fixed mt-1 z-[60]" :style="startDateCalendarStyle">
                <Calendar mode="single" @select-date="handleStartDateSelect" />
              </div>
            </div>
          </div>

          <!-- 结束日期 -->
          <div class="min-w-[160px]">
            <label class="block mb-2 font-semibold text-gray-700">结束日期</label>
            <div class="relative" ref="endDateCalendarRef">
              <input
                :value="filters.endDate"
                type="text"
                readonly
                placeholder="选择结束日期"
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm transition-colors cursor-pointer focus:outline-none focus:border-blue-600"
                @click="showEndDateCalendar = !showEndDateCalendar"
              >
              <div v-if="showEndDateCalendar" class="fixed mt-1 z-[60]" :style="endDateCalendarStyle">
                <Calendar mode="single" @select-date="handleEndDateSelect" />
              </div>
            </div>
          </div>

          <!-- 排序方式 -->
          <div class="min-w-[140px]">
            <label class="block mb-2 font-semibold text-gray-700">排序</label>
            <div class="relative" ref="sortSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="toggleSortDropdown">
                <span class="flex-1 text-left">{{ sortOrder === 'desc' ? '日期降序' : '日期升序' }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showSortDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200" v-show="showSortDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': sortOrder === 'desc' }"
                  @click="selectSortOrder('desc')"
                >
                  日期降序
                  <span v-if="sortOrder === 'desc'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': sortOrder === 'incs' }"
                  @click="selectSortOrder('incs')"
                >
                  日期升序
                  <span v-if="sortOrder === 'incs'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 每页显示 -->
          <div class="min-w-[120px]">
            <label class="block mb-2 font-semibold text-gray-700">每页显示</label>
            <div class="relative" ref="pageSizeSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="togglePageSizeDropdown">
                <span class="flex-1 text-left">{{ pagination.size }}条</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showPageSizeDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200" v-show="showPageSizeDropdown">
                <div
                  v-for="size in [5, 20, 50, 100]"
                  :key="size"
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': pagination.size === size }"
                  @click="selectPageSizeOption(size)"
                >
                  {{ size }}条
                  <span v-if="pagination.size === size" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="w-12 h-12 border-4 border-gray-200 border-b-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500 text-base m-0">加载中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-center">
        {{ error }}
      </div>

      <!-- 作业列表 -->
      <div v-if="!loading && !error" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="py-5 px-6 border-b border-gray-200 bg-gray-50">
          <div class="text-gray-500 text-sm font-medium">
            <span>共找到 {{ pagination.total }} 条作业，每页显示 {{ pagination.size }} 条</span>
          </div>
        </div>

        <!-- 表头 -->
        <div class="flex bg-gray-50 border-b-2 border-gray-200 py-4 px-6 font-semibold text-gray-700 text-sm">
          <div class="flex items-center px-2 min-w-0 flex-[1.5]">班级名称</div>
          <div class="flex items-center px-2 min-w-0 flex-[3]">作业内容</div>
          <div class="flex items-center px-2 min-w-0 flex-[1.5]">截止日期</div>
          <div class="flex items-center px-2 min-w-0 flex-1">操作</div>
        </div>

        <div class="flex flex-col">
          <div
            v-for="homework in homeworkList"
            :key="`${homework.cid}-${homework.due_date}`"
            class="flex items-center py-4 px-6 border-b border-gray-100 transition-all duration-200 last:border-b-0 hover:bg-gray-50"
          >
            <div class="flex items-center px-2 min-w-0 flex-[1.5]">
              <h3 class="text-base font-semibold text-gray-800 m-0 truncate">{{ homework.class_name }}</h3>
            </div>
            <div class="flex items-center px-2 min-w-0 flex-[3]">
              <p class="text-sm text-gray-600 m-0 truncate">{{ getHomeworkSummary(homework.homework_content) }}</p>
            </div>
            <div class="flex items-center px-2 min-w-0 flex-[1.5]">
              <span class="text-sm text-gray-500 font-medium">{{ formatDate(homework.due_date) }}</span>
            </div>
            <div class="flex items-center px-2 min-w-0 flex-1">
              <div class="flex gap-2">
                <button
                  @click="viewHomeworkDetail(homework)"
                  class="flex items-center justify-center w-9 h-9 border-none rounded-lg text-sm cursor-pointer transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105"
                  title="查看详情"
                >
                  <span class="text-base">👁️</span>
                </button>
                <button
                  @click="confirmDelete(homework)"
                  class="flex items-center justify-center w-9 h-9 border-none rounded-lg text-sm cursor-pointer transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105"
                  title="删除作业"
                >
                  <span class="text-base">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页组件 -->
        <div class="flex justify-center gap-2 py-6 border-t border-gray-200" v-if="pagination.pages > 1">
          <button
            @click="changePage(page)"
            v-for="page in paginationPages"
            :key="page"
            :class="['py-2 px-4 border-2 border-gray-200 bg-white text-gray-500 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50', { 'bg-blue-600 border-blue-600 text-white': page === pagination.page }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- 创建作业对话框 -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showCreateDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h3 class="m-0 text-xl font-bold text-gray-800">创建新作业</h3>
          <button @click="showCreateDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-700">选择班级</label>
            <div class="relative" ref="createClassSelectRef">
              <div class="flex items-center justify-between py-3 px-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors text-base hover:border-blue-600" @click="toggleCreateClassDropdown">
                <span class="flex-1 text-left" :class="{ 'text-gray-400': !newHomework.cid }">
                  {{ getClassNameById(newHomework.cid) || '请选择班级' }}
                </span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showCreateClassDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto" v-show="showCreateClassDropdown">
                <div
                  v-for="classItem in classList"
                  :key="classItem.cid"
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold': newHomework.cid === classItem.cid }"
                  @click="selectCreateClass(classItem.cid)"
                >
                  {{ classItem.class_name }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-700">作业内容</label>
            <div class="flex flex-col gap-3">
              <div v-for="(label, key) in subjectNames" :key="key" class="flex items-center gap-3">
                <label class="min-w-16 text-sm text-gray-600">{{ label }}：</label>
                <input
                  v-model="newHomework.subjects[key]"
                  type="text"
                  :placeholder="`输入${label}作业`"
                  class="flex-1 py-2 px-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-600"
                >
              </div>
            </div>
          </div>
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-700">截止日期</label>
            <div class="relative" ref="createDateCalendarRef">
              <input
                :value="formatDate(newHomework.due_date)"
                type="text"
                readonly
                placeholder="选择截止日期"
                class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-colors cursor-pointer focus:outline-none focus:border-blue-600"
                @click="showCreateDateCalendar = !showCreateDateCalendar"
              >
              <div v-if="showCreateDateCalendar" class="fixed mt-1 z-[100]" :style="calendarStyle">
                <Calendar mode="single" :allow-future="true" @select-date="handleCreateDateSelect" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200 flex-shrink-0">
          <button @click="showCreateDialog = false" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">取消</button>
          <button @click="createHomework" :disabled="!isFormValid || creating" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-blue-600 text-white border-none hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ creating ? '创建中...' : '确认创建' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 作业详情对话框 -->
    <div v-if="showDetailDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDetailDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="m-0 text-xl font-bold text-gray-800">作业详情</h3>
          <button @click="showDetailDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6">
          <div v-if="selectedHomework" class="flex flex-col gap-4">
            <div class="flex items-center py-3 border-b border-gray-100">
              <span class="font-semibold text-gray-700 min-w-28">班级名称：</span>
              <span class="text-gray-600">{{ selectedHomework.class_name }}</span>
            </div>
            <div class="flex items-center py-3 border-b border-gray-100">
              <span class="font-semibold text-gray-700 min-w-28">截止日期：</span>
              <span class="text-gray-600">{{ formatDate(selectedHomework.due_date) }}</span>
            </div>

            <!-- 查看模式 -->
            <div v-if="!isEditing" class="py-3">
              <div class="font-semibold text-gray-700 mb-3">作业内容：</div>
              <div class="bg-gray-50 rounded-lg p-4 text-gray-600 whitespace-pre-wrap leading-relaxed">{{ formatHomeworkContent(selectedHomework.homework_content) }}</div>
            </div>

            <!-- 编辑模式 -->
            <div v-else class="py-3">
              <div class="font-semibold text-gray-700 mb-3">作业内容：</div>
              <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
                <div v-for="(label, key) in subjectNames" :key="key" class="flex items-center gap-3">
                  <label class="min-w-16 text-sm text-gray-600 font-medium">{{ label }}：</label>
                  <input
                    v-model="editHomework.subjects[key]"
                    type="text"
                    :placeholder="`输入${label}作业`"
                    class="flex-1 py-2 px-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-600"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button v-if="!isEditing" @click="showDetailDialog = false" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">关闭</button>
          <button v-if="!isEditing" @click="startEdit" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-blue-600 text-white border-none hover:bg-blue-700">编辑</button>

          <button v-if="isEditing" @click="cancelEdit" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">取消</button>
          <button v-if="isEditing" @click="saveHomework" :disabled="updating" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-green-600 text-white border-none hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ updating ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDeleteDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="m-0 text-xl font-bold text-gray-800">确认删除</h3>
          <button @click="showDeleteDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6">
          <p>确定要删除 "{{ selectedHomework?.class_name }}" 的作业吗？</p>
          <p class="text-sm text-gray-500 mt-2">截止日期：{{ formatDate(selectedHomework?.due_date) }}</p>
          <p class="text-red-600 text-sm mt-2">此操作不可撤销，请谨慎操作！</p>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button @click="showDeleteDialog = false" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">取消</button>
          <button @click="deleteHomework" :disabled="deleting" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-red-600 text-white border-none hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import AdminHomeworkService from '@/services/admin/homework'
import AdminClassService from '@/services/admin/class'
import notificationService from '@/services/common/notification'
import Calendar from '@/components/common/calendar.vue'

// 响应式数据
const loading = ref(false)
const error = ref('')
const homeworkList = ref([])
const classList = ref([])

// 筛选条件
const filters = reactive({
  cid: null,
  startDate: '',
  endDate: ''
})

const selectedClassName = ref('')
const sortOrder = ref('desc')

// 下拉框状态
const showClassDropdown = ref(false)
const showSortDropdown = ref(false)
const showPageSizeDropdown = ref(false)
const showCreateClassDropdown = ref(false)

const classSelectRef = ref(null)
const sortSelectRef = ref(null)
const pageSizeSelectRef = ref(null)
const createClassSelectRef = ref(null)
const startDateCalendarRef = ref(null)
const endDateCalendarRef = ref(null)
const createDateCalendarRef = ref(null)

// 分页数据
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0,
  pages: 0
})

// 对话框状态
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const showStartDateCalendar = ref(false)
const showEndDateCalendar = ref(false)
const showCreateDateCalendar = ref(false)

// 获取今天的日期（YYYY-MM-DD格式）
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取今天的日期（YYYYMMDD格式）
const getTodayDateNumber = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return parseInt(`${year}${month}${day}`)
}

// 表单数据
const newHomework = reactive({
  cid: null,
  subjects: {
    chinese: '',
    maths: '',
    english: '',
    physics: '',
    chemistry: '',
    biology: '',
    history: '',
    geography: '',
    politics: '',
    others: ''
  },
  due_date: getTodayDateNumber() // 默认为今天（YYYYMMDD格式）
})

const creating = ref(false)
const deleting = ref(false)
const updating = ref(false)

// 编辑状态
const isEditing = ref(false)
const editHomework = reactive({
  cid: null,
  subjects: {
    chinese: '',
    maths: '',
    english: '',
    physics: '',
    chemistry: '',
    biology: '',
    history: '',
    geography: '',
    politics: '',
    others: ''
  },
  due_date: null
})

// 选中的作业
const selectedHomework = ref(null)

// 计算属性：分页按钮
const paginationPages = computed(() => {
  const pages = []
  const total = pagination.pages
  const current = pagination.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// 计算属性：表单验证
const isFormValid = computed(() => {
  // 至少有一个科目有内容
  const hasContent = Object.values(newHomework.subjects).some(v => v && v.trim())
  return newHomework.cid && hasContent && newHomework.due_date
})

// 方法
const fetchHomeworkList = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: pagination.page,
      size: pagination.size,
      order: sortOrder.value
    }

    if (filters.cid) {
      params.cid = filters.cid
    }

    if (filters.startDate) {
      params.startDate = dateToNumber(filters.startDate)
    }

    if (filters.endDate) {
      params.endDate = dateToNumber(filters.endDate)
    }

    const response = await AdminHomeworkService.getHomeworkList(params)

    homeworkList.value = response.data || []
    Object.assign(pagination, response.pagination)

  } catch (err) {
    error.value = err.message || '获取作业列表失败'
    console.error('获取作业列表失败:', err)
  } finally {
    loading.value = false
  }
}

const fetchClassList = async () => {
  try {
    const response = await AdminClassService.getClassList({ page: 1, size: 1000 })
    classList.value = response.data || []
  } catch (err) {
    console.error('获取班级列表失败:', err)
  }
}

// 日期转换：YYYY-MM-DD -> YYYYMMDD
const dateToNumber = (dateStr) => {
  if (!dateStr) return null
  return parseInt(dateStr.replace(/-/g, ''))
}

// 日期转换：YYYYMMDD -> YYYY-MM-DD
const numberToDate = (num) => {
  if (!num) return ''
  const str = String(num)
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`
}

// 格式化日期显示
const formatDate = (num) => {
  if (!num) return '未知'
  const str = String(num)
  return `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(6, 8)}`
}

// 科目名称映射
const subjectNames = {
  chinese: '语文',
  maths: '数学',
  english: '英语',
  physics: '物理',
  chemistry: '化学',
  biology: '生物',
  history: '历史',
  geography: '地理',
  politics: '政治',
  others: '其他'
}

// 格式化作业内容显示
const formatHomeworkContent = (content) => {
  if (!content) return ''

  try {
    // 尝试解析JSON
    const homework = typeof content === 'string' ? JSON.parse(content) : content

    // 筛选出有内容的科目
    const subjects = Object.entries(homework)
      .filter(([key, value]) => value && value.trim())
      .map(([key, value]) => {
        const subjectName = subjectNames[key] || key
        return `${subjectName}: ${value}`
      })

    return subjects.length > 0 ? subjects.join('\n') : '暂无作业'
  } catch (e) {
    // 如果不是JSON格式，直接返回原内容
    return content
  }
}

// 获取作业简要信息（用于列表显示）
const getHomeworkSummary = (content) => {
  if (!content) return '暂无作业'

  try {
    const homework = typeof content === 'string' ? JSON.parse(content) : content

    // 获取有内容的科目数量
    const subjects = Object.entries(homework)
      .filter(([key, value]) => value && value.trim())
      .map(([key]) => subjectNames[key] || key)

    if (subjects.length === 0) return '暂无作业'

    return `${subjects.slice(0, 3).join('、')}${subjects.length > 3 ? ` 等${subjects.length}科` : ''}`
  } catch (e) {
    // 如果不是JSON格式，截取前50个字符
    return content.length > 50 ? content.substring(0, 50) + '...' : content
  }
}

// 根据班级ID获取班级名称
const getClassNameById = (cid) => {
  const classItem = classList.value.find(c => c.cid === cid)
  return classItem ? classItem.class_name : ''
}

// 筛选和排序
const selectClass = (cid, name) => {
  filters.cid = cid
  selectedClassName.value = name === '全部班级' ? '' : name
  showClassDropdown.value = false
  pagination.page = 1
  fetchHomeworkList()
}

const selectSortOrder = (order) => {
  sortOrder.value = order
  showSortDropdown.value = false
  pagination.page = 1
  fetchHomeworkList()
}

const selectPageSizeOption = (size) => {
  pagination.size = size
  showPageSizeDropdown.value = false
  pagination.page = 1
  fetchHomeworkList()
}

const handleFilterChange = () => {
  pagination.page = 1
  fetchHomeworkList()
}

// 下拉框切换
const toggleClassDropdown = () => {
  showClassDropdown.value = !showClassDropdown.value
}

const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value
}

const togglePageSizeDropdown = () => {
  showPageSizeDropdown.value = !showPageSizeDropdown.value
}

const toggleCreateClassDropdown = () => {
  showCreateClassDropdown.value = !showCreateClassDropdown.value
}

const selectCreateClass = (cid) => {
  newHomework.cid = cid
  showCreateClassDropdown.value = false
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  if (classSelectRef.value && !classSelectRef.value.contains(event.target)) {
    showClassDropdown.value = false
  }
  if (sortSelectRef.value && !sortSelectRef.value.contains(event.target)) {
    showSortDropdown.value = false
  }
  if (pageSizeSelectRef.value && !pageSizeSelectRef.value.contains(event.target)) {
    showPageSizeDropdown.value = false
  }
  if (createClassSelectRef.value && !createClassSelectRef.value.contains(event.target)) {
    showCreateClassDropdown.value = false
  }
  if (startDateCalendarRef.value && !startDateCalendarRef.value.contains(event.target)) {
    showStartDateCalendar.value = false
  }
  if (endDateCalendarRef.value && !endDateCalendarRef.value.contains(event.target)) {
    showEndDateCalendar.value = false
  }
  if (createDateCalendarRef.value && !createDateCalendarRef.value.contains(event.target)) {
    showCreateDateCalendar.value = false
  }
}

// 日期选择处理
const handleStartDateSelect = (date) => {
  filters.startDate = numberToDate(parseInt(date))
  showStartDateCalendar.value = false
  handleFilterChange()
}

const handleEndDateSelect = (date) => {
  filters.endDate = numberToDate(parseInt(date))
  showEndDateCalendar.value = false
  handleFilterChange()
}

const handleCreateDateSelect = (date) => {
  newHomework.due_date = parseInt(date)
  showCreateDateCalendar.value = false
}

// 计算日历位置
const calendarStyle = computed(() => {
  if (!createDateCalendarRef.value) return {}
  const rect = createDateCalendarRef.value.getBoundingClientRect()
  return {
    left: `${rect.left}px`,
    top: `${rect.bottom}px`
  }
})

const startDateCalendarStyle = computed(() => {
  if (!startDateCalendarRef.value) return {}
  const rect = startDateCalendarRef.value.getBoundingClientRect()
  return {
    left: `${rect.left}px`,
    top: `${rect.bottom}px`
  }
})

const endDateCalendarStyle = computed(() => {
  if (!endDateCalendarRef.value) return {}
  const rect = endDateCalendarRef.value.getBoundingClientRect()
  return {
    left: `${rect.left}px`,
    top: `${rect.bottom}px`
  }
})

const changePage = (page) => {
  if (page !== '...' && page !== pagination.page) {
    pagination.page = page
    fetchHomeworkList()
  }
}

const createHomework = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    creating.value = true

    // 过滤掉空的科目，只保留有内容的
    const filteredSubjects = {}
    Object.entries(newHomework.subjects).forEach(([key, value]) => {
      if (value && value.trim()) {
        filteredSubjects[key] = value.trim()
      }
    })

    // 如果所有科目都为空，提示用户
    if (Object.keys(filteredSubjects).length === 0) {
      notificationService.info('请至少填写一个科目的作业')
      return
    }

    const data = {
      cid: newHomework.cid,
      homework_content: filteredSubjects,
      due_date: newHomework.due_date
    }

    await AdminHomeworkService.createHomework(data)

    showCreateDialog.value = false

    // 重置表单
    newHomework.cid = null
    Object.keys(newHomework.subjects).forEach(key => {
      newHomework.subjects[key] = ''
    })
    // 重置为今天
    newHomework.due_date = getTodayDateNumber()

    // 刷新列表
    pagination.page = 1
    await fetchHomeworkList()

    // 显示成功通知
    notificationService.success('作业创建成功')

  } catch (err) {
    error.value = err.message || '创建作业失败'
    notificationService.error(err.message || '创建作业失败')
    console.error('创建作业失败:', err)
  } finally {
    creating.value = false
  }
}

const viewHomeworkDetail = (homework) => {
  selectedHomework.value = homework
  showDetailDialog.value = true
  isEditing.value = false

  // 初始化编辑数据
  editHomework.cid = homework.cid
  editHomework.due_date = homework.due_date

  try {
    const content = typeof homework.homework_content === 'string'
      ? JSON.parse(homework.homework_content)
      : homework.homework_content

    Object.keys(editHomework.subjects).forEach(key => {
      editHomework.subjects[key] = content[key] || ''
    })
  } catch (e) {
    console.error('解析作业内容失败:', e)
  }
}

const confirmDelete = (homework) => {
  selectedHomework.value = homework
  showDeleteDialog.value = true
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // 重新加载原始数据
  viewHomeworkDetail(selectedHomework.value)
}

const saveHomework = async () => {
  if (!editHomework.cid || !editHomework.due_date) {
    return
  }

  try {
    updating.value = true

    const data = {
      cid: editHomework.cid,
      homework_content: editHomework.subjects,
      due_date: editHomework.due_date
    }

    await AdminHomeworkService.updateHomework(data)

    isEditing.value = false
    showDetailDialog.value = false

    // 刷新列表
    await fetchHomeworkList()

    // 显示成功通知
    notificationService.success('作业更新成功')

  } catch (err) {
    error.value = err.message || '更新作业失败'
    notificationService.error(err.message || '更新作业失败')
    console.error('更新作业失败:', err)
  } finally {
    updating.value = false
  }
}

const deleteHomework = async () => {
  if (!selectedHomework.value) {
    return
  }

  try {
    deleting.value = true
    await AdminHomeworkService.deleteHomework(
      selectedHomework.value.cid,
      selectedHomework.value.due_date
    )

    showDeleteDialog.value = false
    selectedHomework.value = null

    // 刷新列表
    await fetchHomeworkList()

    // 显示成功通知
    notificationService.success('作业删除成功')

  } catch (err) {
    error.value = err.message || '删除作业失败'
    notificationService.error(err.message || '删除作业失败')
    console.error('删除作业失败:', err)
  } finally {
    deleting.value = false
  }
}

// 初始化
onMounted(async () => {
  await fetchClassList()
  await fetchHomeworkList()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Tailwind的animate-spin已内置 */
/* line-clamp-2 可使用 Tailwind 的 line-clamp-2 类 */
/* 所有媒体查询已移除，改用Tailwind响应式类: md:, sm: */
</style>
