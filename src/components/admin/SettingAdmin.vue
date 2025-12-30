<template>
  <div class="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      <!-- 头部区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-start flex-wrap gap-6">
          <div class="flex-1 min-w-[300px]">
            <h1 class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-2">{{ $t('ui.displaySettings') }}</h1>
            <p class="text-gray-500 text-lg m-0 font-normal">{{ $t('ui.manageDisplaySettings') }}</p>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
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

          <!-- 显示状态筛选 -->
          <div class="min-w-[200px]">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.displayStatus') }}</label>
            <div class="relative" ref="displayStatusRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="toggleDisplayStatusDropdown">
                <span class="flex-1 text-left">{{ getDisplayStatusText() }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showDisplayStatusDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200" v-show="showDisplayStatusDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': filters.displayStatus === 'all' }"
                  @click="selectDisplayStatus('all')"
                >
                  {{ $t('ui.all') }}
                  <span v-if="filters.displayStatus === 'all'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': filters.displayStatus === 'countdown' }"
                  @click="selectDisplayStatus('countdown')"
                >
                  {{ $t('ui.countdownDisplayed') }}
                  <span v-if="filters.displayStatus === 'countdown'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': filters.displayStatus === 'slogan' }"
                  @click="selectDisplayStatus('slogan')"
                >
                  {{ $t('ui.sloganDisplayed') }}
                  <span v-if="filters.displayStatus === 'slogan'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
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

      <!-- 设置列表 -->
      <div v-if="!loading && !error" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="py-5 px-6 border-b border-gray-200 bg-gray-50">
          <div class="text-gray-500 text-sm font-medium">
            <span>{{ $t('ui.foundSettingsInfo', { total: filteredSettings.length }) }}</span>
          </div>
        </div>

        <!-- 表头 -->
        <div class="flex bg-gray-50 border-b-2 border-gray-200 py-4 px-6 font-semibold text-gray-700 text-sm">
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.className') }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-40">{{ $t('ui.countdownDisplay') }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-40">{{ $t('ui.sloganDisplay') }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-32">{{ $t('ui.actions') }}</div>
        </div>

        <!-- 数据行 -->
        <div v-for="(setting, index) in filteredSettings" :key="setting.cid" class="flex items-center py-5 px-6 border-b border-gray-100 transition-colors hover:bg-blue-50" :class="{ 'bg-gray-50': index % 2 === 1 }">
          <div class="px-2 min-w-0 flex-1 text-gray-800 font-medium truncate">{{ setting.class_name }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-40">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="setting.is_countdown_display"
                @change="toggleCountdownDisplay(setting)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-center px-2 min-w-0 w-40">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="setting.is_slogan_display"
                @change="toggleSloganDisplay(setting)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-center gap-2 px-2 min-w-0 w-32">
            <button @click="openEditDialog(setting)" class="py-2 px-4 bg-blue-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-blue-700 hover:shadow-md">
              {{ $t('ui.edit') }}
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredSettings.length === 0" class="text-center py-12 text-gray-500">
          {{ $t('ui.noSettings') }}
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div v-if="showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialog">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ $t('ui.editSettings') }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <!-- 班级名称（只读） -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.className') }}</label>
            <input :value="editingSettings.class_name" type="text" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm bg-gray-100" disabled />
          </div>
          <!-- 倒计时显示 -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <label class="font-semibold text-gray-700">{{ $t('ui.countdownDisplay') }}</label>
              <p class="text-xs text-gray-500 mt-1">{{ $t('ui.countdownDisplayDesc') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="editingSettings.is_countdown_display"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <!-- 标语显示 -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <label class="font-semibold text-gray-700">{{ $t('ui.sloganDisplay') }}</label>
              <p class="text-xs text-gray-500 mt-1">{{ $t('ui.sloganDisplayDesc') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="editingSettings.is_slogan_display"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button @click="closeDialog" class="py-2.5 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-300">
            {{ $t('ui.cancel') }}
          </button>
          <button @click="handleUpdate" class="py-2.5 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg">
            {{ $t('ui.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import settingService from '@/services/admin/setting'
import classService from '@/services/admin/class'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAdminPermission } from '@/composables/useAdminPermission'

const { t: $t } = useI18n()
const { filterManagedClasses, canManageClass } = useAdminPermission()

const loading = ref(false)
const error = ref(null)
const settingsList = ref([])
const classList = ref([])

const filters = ref({
  cid: null,
  displayStatus: 'all' // all, countdown, slogan
})

const selectedClassName = ref('')

const showClassDropdown = ref(false)
const showDisplayStatusDropdown = ref(false)
const showEditDialog = ref(false)

const editingSettings = ref({
  cid: null,
  class_name: '',
  is_countdown_display: false,
  is_slogan_display: false
})

const classSelectRef = ref(null)
const displayStatusRef = ref(null)

// 筛选后的设置列表
const filteredSettings = computed(() => {
  let result = settingsList.value

  // 按班级筛选
  if (filters.value.cid) {
    result = result.filter(s => s.cid === filters.value.cid)
  }

  // 按显示状态筛选
  if (filters.value.displayStatus === 'countdown') {
    result = result.filter(s => s.is_countdown_display)
  } else if (filters.value.displayStatus === 'slogan') {
    result = result.filter(s => s.is_slogan_display)
  }

  return result
})

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

// 加载所有班级的设置
const loadSettings = async () => {
  loading.value = true
  error.value = null
  try {
    // 获取所有班级的设置
    const settingsPromises = classList.value.map(async (classItem) => {
      try {
        const response = await settingService.getSetting(classItem.cid)
        return {
          cid: classItem.cid,
          class_name: classItem.class_name,
          is_countdown_display: response.data?.is_countdown_display ?? false,
          is_slogan_display: response.data?.is_slogan_display ?? false
        }
      } catch (err) {
        // 如果设置不存在，返回默认值
        return {
          cid: classItem.cid,
          class_name: classItem.class_name,
          is_countdown_display: false,
          is_slogan_display: false
        }
      }
    })

    settingsList.value = await Promise.all(settingsPromises)
  } catch (err) {
    error.value = err.message || $t('ui.loadFailed')
  } finally {
    loading.value = false
  }
}

// 切换下拉菜单
const toggleClassDropdown = () => {
  showClassDropdown.value = !showClassDropdown.value
  showDisplayStatusDropdown.value = false
}

const toggleDisplayStatusDropdown = () => {
  showDisplayStatusDropdown.value = !showDisplayStatusDropdown.value
  showClassDropdown.value = false
}

// 选择班级
const selectClass = (cid, className) => {
  filters.value.cid = cid
  selectedClassName.value = cid ? className : ''
  showClassDropdown.value = false
}

// 选择显示状态
const selectDisplayStatus = (status) => {
  filters.value.displayStatus = status
  showDisplayStatusDropdown.value = false
}

// 获取显示状态文本
const getDisplayStatusText = () => {
  if (filters.value.displayStatus === 'countdown') return $t('ui.countdownDisplayed')
  if (filters.value.displayStatus === 'slogan') return $t('ui.sloganDisplayed')
  return $t('ui.all')
}

// 快速切换倒计时显示
const toggleCountdownDisplay = async (setting) => {
  // 检查权限：只能切换可管理班级的设置
  if (!canManageClass(setting.cid)) {
    alert($t('ui.noPermission') || '您没有权限修改此班级的设置')
    return
  }

  try {
    const newValue = !setting.is_countdown_display
    const response = await settingService.updateSetting(setting.cid, {
      is_countdown_display: newValue,
      is_slogan_display: setting.is_slogan_display
    })
    if (response.code === 0) {
      setting.is_countdown_display = newValue
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 快速切换标语显示
const toggleSloganDisplay = async (setting) => {
  // 检查权限：只能切换可管理班级的设置
  if (!canManageClass(setting.cid)) {
    alert($t('ui.noPermission') || '您没有权限修改此班级的设置')
    return
  }

  try {
    const newValue = !setting.is_slogan_display
    const response = await settingService.updateSetting(setting.cid, {
      is_countdown_display: setting.is_countdown_display,
      is_slogan_display: newValue
    })
    if (response.code === 0) {
      setting.is_slogan_display = newValue
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 打开编辑对话框
const openEditDialog = (setting) => {
  // 检查权限：只能编辑可管理班级的设置
  if (!canManageClass(setting.cid)) {
    alert($t('ui.noPermission') || '您没有权限编辑此班级的设置')
    return
  }

  editingSettings.value = {
    cid: setting.cid,
    class_name: setting.class_name,
    is_countdown_display: setting.is_countdown_display,
    is_slogan_display: setting.is_slogan_display
  }
  showEditDialog.value = true
}

// 关闭对话框
const closeDialog = () => {
  showEditDialog.value = false
  editingSettings.value = {
    cid: null,
    class_name: '',
    is_countdown_display: false,
    is_slogan_display: false
  }
}

// 更新设置
const handleUpdate = async () => {
  // 检查权限：只能更新可管理班级的设置
  if (!canManageClass(editingSettings.value.cid)) {
    alert($t('ui.noPermission') || '您没有权限修改此班级的设置')
    return
  }

  try {
    const response = await settingService.updateSetting(editingSettings.value.cid, {
      is_countdown_display: editingSettings.value.is_countdown_display,
      is_slogan_display: editingSettings.value.is_slogan_display
    })
    if (response.code === 0) {
      // 更新本地数据
      const index = settingsList.value.findIndex(s => s.cid === editingSettings.value.cid)
      if (index !== -1) {
        settingsList.value[index].is_countdown_display = editingSettings.value.is_countdown_display
        settingsList.value[index].is_slogan_display = editingSettings.value.is_slogan_display
      }
      closeDialog()
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (classSelectRef.value && !classSelectRef.value.contains(event.target)) {
    showClassDropdown.value = false
  }
  if (displayStatusRef.value && !displayStatusRef.value.contains(event.target)) {
    showDisplayStatusDropdown.value = false
  }
}

onMounted(async () => {
  await loadClassList()
  await loadSettings()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

