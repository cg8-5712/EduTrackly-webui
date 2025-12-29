<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-gray-900">{{ $t('admin.management') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('admin.managementDesc') }}</p>
      </div>
      <button
        @click="showCreateDialog = true"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('admin.createAdmin') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex gap-4 items-center flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('admin.adminId') + '...'"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <select
          v-model="roleFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="all">{{ $t('admin.roleAll') }}</option>
          <option value="superadmin">{{ $t('admin.superadmin') }}</option>
          <option value="admin">{{ $t('admin.admin') }}</option>
        </select>
        <button
          @click="fetchAdmins"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ $t('common.search') }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <LoadingSpinner :size="60" :message="$t('admin.loading')" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.adminId') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.role') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.createTime') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.lastLogin') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.lastLoginIp') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="admin in paginatedAdmins" :key="admin.aid" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ admin.aid }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="admin.role === 'superadmin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ $t(`admin.${admin.role}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(admin.time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(admin.time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ admin.ip }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click="viewAdmin(admin)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    {{ $t('admin.viewDetails') }}
                  </button>
                  <button
                    @click="editAdmin(admin)"
                    class="text-green-600 hover:text-green-900"
                  >
                    {{ $t('common.edit') }}
                  </button>
                  <button
                    v-if="admin.role === 'admin'"
                    @click="manageClasses(admin)"
                    class="text-purple-600 hover:text-purple-900"
                  >
                    {{ $t('admin.manageClasses') }}
                  </button>
                  <button
                    @click="confirmDelete(admin)"
                    :disabled="admin.aid === currentAdminId"
                    class="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {{ $t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          {{ $t('ui.showingRecords', { start: (pagination.page - 1) * pagination.size + 1, end: Math.min(pagination.page * pagination.size, pagination.total), total: pagination.total }) }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="changePage(1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50"
          >
            {{ $t('ui.firstPage') }}
          </button>
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50"
          >
            {{ $t('ui.previousPage') }}
          </button>
          <span class="text-sm text-gray-700">
            {{ pagination.page }} / {{ pagination.pages }}
          </span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.pages"
            class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50"
          >
            {{ $t('ui.nextPage') }}
          </button>
          <button
            @click="changePage(pagination.pages)"
            :disabled="pagination.page === pagination.pages"
            class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50"
          >
            {{ $t('ui.lastPage') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Dialog -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showCreateDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold">{{ $t('admin.createAdminTitle') }}</h3>
          <button @click="showCreateDialog = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="createAdmin" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('admin.password') }}
            </label>
            <input
              v-model="createForm.password"
              type="password"
              :placeholder="$t('admin.passwordPlaceholder')"
              required
              minlength="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('admin.role') }}
            </label>
            <select
              v-model="createForm.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="admin">{{ $t('admin.admin') }}</option>
              <option value="superadmin">{{ $t('admin.superadmin') }}</option>
            </select>
          </div>
          <div class="flex gap-3 justify-end pt-4">
            <button
              type="button"
              @click="showCreateDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {{ creating ? $t('admin.creating') : $t('common.confirm') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Dialog -->
    <div v-if="showEditDialog && selectedAdmin" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showEditDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold">{{ $t('admin.editAdminTitle') }}</h3>
          <button @click="showEditDialog = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="updateAdmin" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('admin.passwordOptional') }}
            </label>
            <input
              v-model="editForm.password"
              type="password"
              :placeholder="$t('admin.passwordPlaceholder')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('admin.role') }}
            </label>
            <select
              v-model="editForm.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="admin">{{ $t('admin.admin') }}</option>
              <option value="superadmin">{{ $t('admin.superadmin') }}</option>
            </select>
          </div>
          <div class="flex gap-3 justify-end pt-4">
            <button
              type="button"
              @click="showEditDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {{ updating ? $t('admin.updating') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Dialog -->
    <div v-if="showDeleteDialog && selectedAdmin" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDeleteDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold">{{ $t('admin.deleteAdminTitle') }}</h3>
          <button @click="showDeleteDialog = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-gray-700 mb-4">
            {{ $t('admin.deleteConfirm', { aid: selectedAdmin.aid }) }}
          </p>
          <p class="text-red-600 text-sm">{{ $t('ui.cannotUndo') }}</p>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button
            @click="showDeleteDialog = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="deleteAdmin"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
          >
            {{ deleting ? $t('admin.deleting') : $t('ui.confirmDeleteButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminManagementService from '@/services/admin/admin'
import AuthService from '@/services/common/auth'
import notificationService from '@/services/common/notification'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { t: $t } = useI18n()

// 数据状态
const admins = ref([])
const loading = ref(false)
const error = ref('')

// 分页状态
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0,
  pages: 0
})

// 筛选状态
const roleFilter = ref('all')
const searchQuery = ref('')

// 对话框状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

// 选中项
const selectedAdmin = ref(null)

// 当前管理员 ID
const currentAdminId = computed(() => {
  const adminInfo = AuthService.getAdminInfo()
  return adminInfo.aid ? parseInt(adminInfo.aid) : null
})

// 表单数据
const createForm = reactive({
  password: '',
  role: 'admin'
})

const editForm = reactive({
  password: '',
  role: 'admin'
})

// 操作状态
const creating = ref(false)
const updating = ref(false)
const deleting = ref(false)

// 过滤后的管理员列表
const filteredAdmins = computed(() => {
  let filtered = admins.value

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(admin =>
      admin.aid.toString().includes(query)
    )
  }

  return filtered
})

// 分页后的管理员列表
const paginatedAdmins = computed(() => {
  return filteredAdmins.value
})

// 获取管理员列表
const fetchAdmins = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await AdminManagementService.getAdminList({
      page: pagination.page,
      size: pagination.size,
      role: roleFilter.value
    })

    admins.value = response.data || []
    if (response.pagination) {
      Object.assign(pagination, response.pagination)
    }
  } catch (err) {
    error.value = err.message || $t('service.getAdminListFailed')
    console.error($t('service.getAdminListFailed'), err)
  } finally {
    loading.value = false
  }
}

// 创建管理员
const createAdmin = async () => {
  try {
    creating.value = true

    await AdminManagementService.createAdmin({
      password: createForm.password,
      role: createForm.role
    })

    notificationService.success($t('service.createAdminSuccess'))
    showCreateDialog.value = false
    createForm.password = ''
    createForm.role = 'admin'

    await fetchAdmins()
  } catch (err) {
    notificationService.error(err.message || $t('service.createAdminFailed'))
  } finally {
    creating.value = false
  }
}

// 查看管理员详情
const viewAdmin = (admin) => {
  selectedAdmin.value = admin
  // 可以添加详情对话框
}

// 编辑管理员
const editAdmin = (admin) => {
  selectedAdmin.value = admin
  editForm.role = admin.role
  editForm.password = ''
  showEditDialog.value = true
}

// 更新管理员
const updateAdmin = async () => {
  try {
    updating.value = true

    const data = { role: editForm.role }
    if (editForm.password.trim()) {
      data.password = editForm.password
    }

    await AdminManagementService.updateAdmin(selectedAdmin.value.aid, data)

    notificationService.success($t('service.updateAdminSuccess'))
    showEditDialog.value = false

    await fetchAdmins()
  } catch (err) {
    notificationService.error(err.message || $t('service.updateAdminFailed'))
  } finally {
    updating.value = false
  }
}

// 确认删除
const confirmDelete = (admin) => {
  if (admin.aid === currentAdminId.value) {
    notificationService.error($t('admin.cannotDeleteSelf'))
    return
  }
  selectedAdmin.value = admin
  showDeleteDialog.value = true
}

// 删除管理员
const deleteAdmin = async () => {
  try {
    deleting.value = true

    await AdminManagementService.deleteAdmin(selectedAdmin.value.aid)

    notificationService.success($t('service.deleteAdminSuccess'))
    showDeleteDialog.value = false

    await fetchAdmins()
  } catch (err) {
    notificationService.error(err.message || $t('service.deleteAdminFailed'))
  } finally {
    deleting.value = false
  }
}

// 管理班级
const manageClasses = (admin) => {
  // TODO: 实现班级管理功能
  notificationService.info('班级管理功能开发中...')
}

// 切换页码
const changePage = (page) => {
  if (page !== pagination.page && page >= 1 && page <= pagination.pages) {
    pagination.page = page
    fetchAdmins()
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 挂载时获取数据
onMounted(() => {
  fetchAdmins()
})
</script>

<style scoped>
/* 组件样式已由 Tailwind CSS 处理 */
</style>
