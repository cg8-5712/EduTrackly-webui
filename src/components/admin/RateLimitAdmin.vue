<template>
  <div class="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      <!-- 头部区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-start flex-wrap gap-6">
          <div class="flex-1 min-w-[300px]">
            <h1 class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-2">{{ $t('ui.rateLimitManagement') }}</h1>
            <p class="text-gray-500 text-lg m-0 font-normal">{{ $t('ui.manageRateLimitInfo') }}</p>
          </div>
          <div class="flex gap-4">
            <button @click="showCreateDialog = true" class="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40">
              <span class="text-base">➕</span>
              {{ $t('ui.createRateLimit') }}
            </button>
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

      <!-- 速率限制列表 -->
      <div v-if="!loading && !error" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="py-5 px-6 border-b border-gray-200 bg-gray-50">
          <div class="text-gray-500 text-sm font-medium">
            <span>{{ $t('ui.foundRateLimitsInfo', { total: rateLimitList.length }) }}</span>
          </div>
        </div>

        <!-- 表头 -->
        <div class="flex bg-gray-50 border-b-2 border-gray-200 py-4 px-6 font-semibold text-gray-700 text-sm">
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.configKey') }}</div>
          <div class="flex items-center px-2 min-w-0 w-40">{{ $t('ui.maxRequests') }}</div>
          <div class="flex items-center px-2 min-w-0 w-40">{{ $t('ui.windowMs') }}</div>
          <div class="flex items-center px-2 min-w-0 w-40">{{ $t('ui.windowDisplay') }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-32">{{ $t('ui.actions') }}</div>
        </div>

        <!-- 数据行 -->
        <div v-for="(config, index) in rateLimitList" :key="config.key" class="flex items-center py-5 px-6 border-b border-gray-100 transition-colors hover:bg-blue-50" :class="{ 'bg-gray-50': index % 2 === 1 }">
          <div class="px-2 min-w-0 flex-1 text-gray-800 font-medium truncate">
            <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ config.key }}</code>
          </div>
          <div class="px-2 min-w-0 w-40 text-gray-600">{{ config.max_requests }}</div>
          <div class="px-2 min-w-0 w-40 text-gray-600">{{ config.window_ms }}ms</div>
          <div class="px-2 min-w-0 w-40 text-gray-600">{{ formatWindowMs(config.window_ms) }}</div>
          <div class="flex items-center justify-center gap-2 px-2 min-w-0 w-32">
            <button @click="openEditDialog(config)" class="py-2 px-4 bg-blue-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-blue-700 hover:shadow-md">
              {{ $t('ui.edit') }}
            </button>
            <button @click="handleDelete(config.key)" class="py-2 px-4 bg-red-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-red-700 hover:shadow-md">
              {{ $t('ui.delete') }}
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="rateLimitList.length === 0" class="text-center py-12 text-gray-500">
          {{ $t('ui.noRateLimits') }}
        </div>
      </div>
    </div>

    <!-- 创建/编辑对话框 -->
    <div v-if="showCreateDialog || showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ showCreateDialog ? $t('ui.createRateLimit') : $t('ui.editRateLimit') }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <!-- 配置Key -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.configKey') }}</label>
            <input v-model="formData.key" type="text" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :placeholder="$t('ui.enterConfigKey')" :disabled="showEditDialog" />
            <p class="text-xs text-gray-500 mt-1">{{ $t('ui.configKeyHint') }}</p>
          </div>
          <!-- 最大请求数 -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.maxRequests') }}</label>
            <input v-model.number="formData.max_requests" type="number" min="1" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :placeholder="$t('ui.enterMaxRequests')" />
          </div>
          <!-- 时间窗口 -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.windowMs') }}</label>
            <div class="flex gap-2">
              <input v-model.number="windowValue" type="number" min="1" class="flex-1 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" />
              <select v-model="windowUnit" class="w-32 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600">
                <option value="1000">{{ $t('ui.seconds') }}</option>
                <option value="60000">{{ $t('ui.minutes') }}</option>
                <option value="3600000">{{ $t('ui.hours') }}</option>
              </select>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ $t('ui.currentValue') }}: {{ formData.window_ms }}ms ({{ formatWindowMs(formData.window_ms) }})</p>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import rateLimitService from '@/services/admin/rateLimit'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { t: $t } = useI18n()

const loading = ref(false)
const error = ref(null)
const rateLimitList = ref([])

const showCreateDialog = ref(false)
const showEditDialog = ref(false)

const formData = ref({
  key: '',
  max_requests: 100,
  window_ms: 60000
})

const windowValue = ref(1)
const windowUnit = ref('60000')

// 监听窗口值变化并更新 window_ms
watch([windowValue, windowUnit], ([value, unit]) => {
  formData.value.window_ms = value * parseInt(unit)
})

// 加载速率限制列表
const loadRateLimits = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await rateLimitService.getRateLimitList()
    if (response.code === 0) {
      rateLimitList.value = response.data
    }
  } catch (err) {
    error.value = err.message || $t('ui.loadFailed')
  } finally {
    loading.value = false
  }
}

// 格式化时间窗口显示
const formatWindowMs = (ms) => {
  if (!ms) return '-'
  if (ms >= 3600000) {
    const hours = ms / 3600000
    return `${hours}${$t('ui.hoursUnit')}`
  }
  if (ms >= 60000) {
    const minutes = ms / 60000
    return `${minutes}${$t('ui.minutesUnit')}`
  }
  const seconds = ms / 1000
  return `${seconds}${$t('ui.secondsUnit')}`
}

// 打开编辑对话框
const openEditDialog = (config) => {
  formData.value = {
    key: config.key,
    max_requests: config.max_requests,
    window_ms: config.window_ms
  }
  // 设置窗口值和单位
  if (config.window_ms >= 3600000 && config.window_ms % 3600000 === 0) {
    windowValue.value = config.window_ms / 3600000
    windowUnit.value = '3600000'
  } else if (config.window_ms >= 60000 && config.window_ms % 60000 === 0) {
    windowValue.value = config.window_ms / 60000
    windowUnit.value = '60000'
  } else {
    windowValue.value = config.window_ms / 1000
    windowUnit.value = '1000'
  }
  showEditDialog.value = true
}

// 关闭对话框
const closeDialogs = () => {
  showCreateDialog.value = false
  showEditDialog.value = false
  formData.value = {
    key: '',
    max_requests: 100,
    window_ms: 60000
  }
  windowValue.value = 1
  windowUnit.value = '60000'
}

// 创建速率限制
const handleCreate = async () => {
  if (!formData.value.key || !formData.value.max_requests || !formData.value.window_ms) {
    alert($t('ui.pleaseFillAllFields'))
    return
  }

  try {
    const response = await rateLimitService.createRateLimit({
      key: formData.value.key,
      max_requests: formData.value.max_requests,
      window_ms: formData.value.window_ms
    })
    if (response.code === 0) {
      closeDialogs()
      loadRateLimits()
    }
  } catch (err) {
    alert(err.message || $t('ui.createFailed'))
  }
}

// 更新速率限制
const handleUpdate = async () => {
  if (!formData.value.max_requests || !formData.value.window_ms) {
    alert($t('ui.pleaseFillAllFields'))
    return
  }

  try {
    const response = await rateLimitService.updateRateLimit(formData.value.key, {
      max_requests: formData.value.max_requests,
      window_ms: formData.value.window_ms
    })
    if (response.code === 0) {
      closeDialogs()
      loadRateLimits()
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 删除速率限制
const handleDelete = async (key) => {
  if (!confirm($t('ui.confirmDelete'))) return

  try {
    const response = await rateLimitService.deleteRateLimit(key)
    if (response.code === 0) {
      loadRateLimits()
    }
  } catch (err) {
    alert(err.message || $t('ui.deleteFailed'))
  }
}

onMounted(() => {
  loadRateLimits()
})
</script>
