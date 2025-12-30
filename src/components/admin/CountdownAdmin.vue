<template>
  <div class="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      <!-- 头部区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-start flex-wrap gap-6">
          <div class="flex-1 min-w-[300px]">
            <h1 class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-2">{{ $t('ui.countdownManagement') }}</h1>
            <p class="text-gray-500 text-lg m-0 font-normal">{{ $t('ui.manageCountdownInfo') }}</p>
          </div>
          <div class="flex gap-4">
            <button @click="showCreateDialog = true" class="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40">
              <span class="text-base">➕</span>
              {{ $t('ui.createCountdown') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索和过滤区域 -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <div class="flex gap-6 items-end flex-wrap">
          <!-- 班级筛选 -->
          <div class="flex-1 min-w-[200px]">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.classFilter') }}</label>
            <div class="relative" ref="classSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="toggleClassDropdown">
                <span class="flex-1 text-left">{{ selectedClassName || $t('ui.allClasses') }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showClassDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200" v-show="showClassDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': !filters.cid }"
                  @click="selectClass(null, $t('ui.allClasses'))"
                >
                  {{ $t('ui.allClasses') }}
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

          <!-- 排序方式 -->
          <div class="min-w-[140px]">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.sort') }}</label>
            <div class="relative" ref="sortSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="toggleSortDropdown">
                <span class="flex-1 text-left">{{ sortOrder === 'desc' ? $t('ui.dateDesc') : $t('ui.dateAsc') }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showSortDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200" v-show="showSortDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': sortOrder === 'desc' }"
                  @click="selectSortOrder('desc')"
                >
                  {{ $t('ui.dateDesc') }}
                  <span v-if="sortOrder === 'desc'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': sortOrder === 'asc' }"
                  @click="selectSortOrder('asc')"
                >
                  {{ $t('ui.dateAsc') }}
                  <span v-if="sortOrder === 'asc'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 每页条数 -->
          <div class="min-w-[140px]">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.itemsPerPage') }}</label>
            <div class="relative" ref="pageSizeSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="togglePageSizeDropdown">
                <span class="flex-1 text-left">{{ pagination.size }}{{ $t('pagination.itemsUnit') }}</span>
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
                  {{ size }}{{ $t('pagination.itemsUnit') }}
                  <span v-if="pagination.size === size" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner />
        <p class="text-gray-500 text-base m-0 mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-center">
        {{ error }}
      </div>

      <!-- 倒计时列表 -->
      <div v-if="!loading && !error" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="py-5 px-6 border-b border-gray-200 bg-gray-50">
          <div class="text-gray-500 text-sm font-medium">
            <span>{{ $t('ui.foundCountdownsInfo', { total: pagination.total }) }}</span>
          </div>
        </div>

        <!-- 表头 -->
        <div class="flex bg-gray-50 border-b-2 border-gray-200 py-4 px-6 font-semibold text-gray-700 text-sm">
          <div class="flex items-center px-2 min-w-0 flex-[2]">{{ $t('ui.countdownContent') }}</div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.className') }}</div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.deadline') }}</div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.daysRemaining') }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-32">{{ $t('ui.actions') }}</div>
        </div>

        <!-- 数据行 -->
        <div v-for="(countdown, index) in countdownList" :key="countdown.cdid" class="flex items-center py-5 px-6 border-b border-gray-100 transition-colors hover:bg-blue-50" :class="{ 'bg-gray-50': index % 2 === 1 }">
          <div class="px-2 min-w-0 flex-[2] text-gray-800 font-medium truncate">{{ countdown.content }}</div>
          <div class="px-2 min-w-0 flex-1 text-gray-600 truncate">{{ countdown.class_name }}</div>
          <div class="px-2 min-w-0 flex-1 text-gray-600">{{ formatDate(countdown.deadline) }}</div>
          <div class="px-2 min-w-0 flex-1 text-gray-600">
            <span :class="getDaysRemainingClass(countdown.deadline)">{{ calculateDaysRemaining(countdown.deadline) }}</span>
          </div>
          <div class="flex items-center justify-center gap-2 px-2 min-w-0 w-32">
            <button @click="openEditDialog(countdown)" class="py-2 px-4 bg-blue-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-blue-700 hover:shadow-md">
              {{ $t('ui.edit') }}
            </button>
            <button @click="handleDelete(countdown.cdid)" class="py-2 px-4 bg-red-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-red-700 hover:shadow-md">
              {{ $t('ui.delete') }}
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="countdownList.length === 0" class="text-center py-12 text-gray-500">
          {{ $t('ui.noCountdowns') }}
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="!loading && !error && pagination.total > 0" class="mt-6">
        <Pagination
          :current-page="pagination.page"
          :total-pages="pagination.pages"
          :total-items="pagination.total"
          :page-size="pagination.size"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 创建/编辑对话框 -->
    <div v-if="showCreateDialog || showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ showCreateDialog ? $t('ui.createCountdown') : $t('ui.editCountdown') }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <!-- 班级选择 -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.selectClass') }}</label>
            <select v-model="formData.cid" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :disabled="showEditDialog">
              <option :value="null">{{ $t('ui.pleaseSelect') }}</option>
              <option v-for="classItem in classList" :key="classItem.cid" :value="classItem.cid">{{ classItem.class_name }}</option>
            </select>
          </div>
          <!-- 倒计时内容 -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.countdownContent') }}</label>
            <input v-model="formData.content" type="text" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :placeholder="$t('ui.enterCountdownContent')" />
          </div>
          <!-- 截止日期 -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.deadline') }}</label>
            <input v-model="formData.deadline" type="date" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" />
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button @click="closeDialogs" class="py-2.5 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-300">
            {{ $t('ui.cancel') }}
          </button>
          <button @click="showCreateDialog ? handleCreate() : handleUpdate()" class="py-2.5 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg">
            {{ showCreateDialog ? $t('ui.create') : $t('ui.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import countdownService from '@/services/admin/countdown'
import classService from '@/services/admin/class'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Pagination from '@/components/common/Pagination.vue'
import { useAdminPermission } from '@/composables/useAdminPermission'

const { filterManagedClasses } = useAdminPermission()

const { t: $t } = useI18n()

const loading = ref(false)
const error = ref(null)
const countdownList = ref([])
const classList = ref([])
const pagination = ref({
  page: 1,
  size: 20,
  total: 0,
  pages: 0
})

const filters = ref({
  cid: null
})

const sortOrder = ref('asc')
const selectedClassName = ref('')

const showClassDropdown = ref(false)
const showSortDropdown = ref(false)
const showPageSizeDropdown = ref(false)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)

const formData = ref({
  cdid: null,
  cid: null,
  content: '',
  deadline: ''
})

const classSelectRef = ref(null)
const sortSelectRef = ref(null)
const pageSizeSelectRef = ref(null)

// 加载班级列表
const loadClassList = async () => {
  try {
    const response = await classService.getClassList({ page: 1, size: 1000 })
    if (response.code === 0) {
      // 使用权限管理过滤班级列表，只显示该管理员可以管理的班级
      const allClasses = response.data || []
      classList.value = filterManagedClasses(allClasses)
    }
  } catch (err) {
    console.error('Failed to load class list:', err)
  }
}

// 加载倒计时列表
const loadCountdowns = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await countdownService.getCountdownList({
      cid: filters.value.cid,
      order: sortOrder.value,
      page: pagination.value.page,
      size: pagination.value.size
    })
    if (response.code === 0) {
      countdownList.value = response.data
      pagination.value = response.pagination
    }
  } catch (err) {
    error.value = err.message || $t('ui.loadFailed')
  } finally {
    loading.value = false
  }
}

// 切换下拉菜单
const toggleClassDropdown = () => {
  showClassDropdown.value = !showClassDropdown.value
  showSortDropdown.value = false
  showPageSizeDropdown.value = false
}

const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value
  showClassDropdown.value = false
  showPageSizeDropdown.value = false
}

const togglePageSizeDropdown = () => {
  showPageSizeDropdown.value = !showPageSizeDropdown.value
  showClassDropdown.value = false
  showSortDropdown.value = false
}

// 选择班级
const selectClass = (cid, className) => {
  filters.value.cid = cid
  selectedClassName.value = cid ? className : ''
  showClassDropdown.value = false
  pagination.value.page = 1
  loadCountdowns()
}

// 选择排序
const selectSortOrder = (order) => {
  sortOrder.value = order
  showSortDropdown.value = false
  pagination.value.page = 1
  loadCountdowns()
}

// 选择每页条数
const selectPageSizeOption = (size) => {
  pagination.value.size = size
  pagination.value.page = 1
  showPageSizeDropdown.value = false
  loadCountdowns()
}

// 页码变化
const handlePageChange = (page) => {
  pagination.value.page = page
  loadCountdowns()
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 计算剩余天数
const calculateDaysRemaining = (deadline) => {
  const now = new Date()
  const end = new Date(deadline)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return $t('ui.expired')
  if (diff === 0) return $t('ui.today')
  return $t('ui.daysCount', { count: diff })
}

// 获取剩余天数样式
const getDaysRemainingClass = (deadline) => {
  const now = new Date()
  const end = new Date(deadline)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'text-gray-400'
  if (diff <= 3) return 'text-red-600 font-bold'
  if (diff <= 7) return 'text-orange-600 font-semibold'
  return 'text-green-600'
}

// 打开编辑对话框
const openEditDialog = (countdown) => {
  formData.value = {
    cdid: countdown.cdid,
    cid: countdown.cid,
    content: countdown.content,
    deadline: new Date(countdown.deadline).toISOString().split('T')[0]
  }
  showEditDialog.value = true
}

// 关闭对话框
const closeDialogs = () => {
  showCreateDialog.value = false
  showEditDialog.value = false
  formData.value = {
    cdid: null,
    cid: null,
    content: '',
    deadline: ''
  }
}

// 创建倒计时
const handleCreate = async () => {
  if (!formData.value.cid || !formData.value.content || !formData.value.deadline) {
    alert($t('ui.pleaseFillAllFields'))
    return
  }

  try {
    const deadline = formData.value.deadline.replace(/-/g, '')
    const response = await countdownService.createCountdown({
      cid: formData.value.cid,
      content: formData.value.content,
      deadline: parseInt(deadline)
    })
    if (response.code === 0) {
      closeDialogs()
      loadCountdowns()
    }
  } catch (err) {
    alert(err.message || $t('ui.createFailed'))
  }
}

// 更新倒计时
const handleUpdate = async () => {
  if (!formData.value.content || !formData.value.deadline) {
    alert($t('ui.pleaseFillAllFields'))
    return
  }

  try {
    const response = await countdownService.updateCountdown(formData.value.cdid, {
      content: formData.value.content,
      deadline: formData.value.deadline.replace(/-/g, '')
    })
    if (response.code === 0) {
      closeDialogs()
      loadCountdowns()
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 删除倒计时
const handleDelete = async (cdid) => {
  if (!confirm($t('ui.confirmDelete'))) return

  try {
    const response = await countdownService.deleteCountdown(cdid)
    if (response.code === 0) {
      loadCountdowns()
    }
  } catch (err) {
    alert(err.message || $t('ui.deleteFailed'))
  }
}

// 点击外部关闭下拉菜单
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
}

onMounted(() => {
  loadClassList()
  loadCountdowns()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

