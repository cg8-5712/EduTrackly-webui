<template>
  <div class="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      <!-- 头部区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-start flex-wrap gap-6">
          <div class="flex-1 min-w-[300px]">
            <h1 class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-2">{{ $t('ui.adminManagement') }}</h1>
            <p class="text-gray-500 text-lg m-0 font-normal">{{ $t('ui.manageAdminInfo') }}</p>
          </div>
          <div class="flex gap-4">
            <button @click="showCreateDialog = true" class="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40">
              <span class="text-base">➕</span>
              {{ $t('ui.createAdmin') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <div class="flex gap-6 items-end flex-wrap">
          <!-- 角色筛选 -->
          <div class="min-w-[200px]">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.roleFilter') }}</label>
            <div class="relative" ref="roleSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="toggleRoleDropdown">
                <span class="flex-1 text-left">{{ getRoleText(filters.role) }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showRoleDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200" v-show="showRoleDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': !filters.role }"
                  @click="selectRole(null)"
                >
                  {{ $t('ui.allRoles') }}
                  <span v-if="!filters.role" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': filters.role === 'superadmin' }"
                  @click="selectRole('superadmin')"
                >
                  {{ $t('ui.superadmin') }}
                  <span v-if="filters.role === 'superadmin'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': filters.role === 'admin' }"
                  @click="selectRole('admin')"
                >
                  {{ $t('ui.admin') }}
                  <span v-if="filters.role === 'admin'" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
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

      <!-- 管理员列表 -->
      <div v-if="!loading && !error" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="py-5 px-6 border-b border-gray-200 bg-gray-50">
          <div class="text-gray-500 text-sm font-medium">
            <span>{{ $t('ui.foundAdminsInfo', { total: pagination.total }) }}</span>
          </div>
        </div>

        <!-- 表头 -->
        <div class="flex bg-gray-50 border-b-2 border-gray-200 py-4 px-6 font-semibold text-gray-700 text-sm">
          <div class="flex items-center px-2 min-w-0 w-20">ID</div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.username') }}</div>
          <div class="flex items-center px-2 min-w-0 w-32">{{ $t('ui.role') }}</div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.assignedClasses') }}</div>
          <div class="flex items-center px-2 min-w-0 w-40">{{ $t('ui.createdAt') }}</div>
          <div class="flex items-center justify-center px-2 min-w-0 w-40">{{ $t('ui.actions') }}</div>
        </div>

        <!-- 数据行 -->
        <div v-for="(admin, index) in adminList" :key="admin.aid" class="flex items-center py-5 px-6 border-b border-gray-100 transition-colors hover:bg-blue-50" :class="{ 'bg-gray-50': index % 2 === 1 }">
          <div class="px-2 min-w-0 w-20 text-gray-600">{{ admin.aid }}</div>
          <div class="px-2 min-w-0 flex-1 text-gray-800 font-medium truncate">{{ admin.username }}</div>
          <div class="px-2 min-w-0 w-32">
            <span :class="admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'" class="px-3 py-1 rounded-full text-xs font-semibold">
              {{ admin.role === 'superadmin' ? $t('ui.superadmin') : $t('ui.admin') }}
            </span>
          </div>
          <div class="px-2 min-w-0 flex-1 text-gray-600 truncate">
            <span v-if="admin.classes && admin.classes.length > 0">
              {{ admin.classes.map(c => c.class_name).join(', ') }}
            </span>
            <span v-else class="text-gray-400">{{ $t('ui.noClassAssigned') }}</span>
          </div>
          <div class="px-2 min-w-0 w-40 text-gray-600">{{ formatDate(admin.created_at) }}</div>
          <div class="flex items-center justify-center gap-2 px-2 min-w-0 w-40">
            <button @click="openEditDialog(admin)" class="py-2 px-3 bg-blue-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-blue-700 hover:shadow-md">
              {{ $t('ui.edit') }}
            </button>
            <button @click="openClassDialog(admin)" class="py-2 px-3 bg-green-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-green-700 hover:shadow-md">
              {{ $t('ui.classes') }}
            </button>
            <button @click="handleDelete(admin.aid)" class="py-2 px-3 bg-red-600 text-white text-xs font-medium rounded-lg transition-all hover:bg-red-700 hover:shadow-md" :disabled="admin.aid === currentAdminId">
              {{ $t('ui.delete') }}
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="adminList.length === 0" class="text-center py-12 text-gray-500">
          {{ $t('ui.noAdmins') }}
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

    <!-- 创建管理员对话框 -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ $t('ui.createAdmin') }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.username') }}</label>
            <input v-model="formData.username" type="text" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :placeholder="$t('ui.enterUsername')" />
          </div>
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('common.password') }}</label>
            <input v-model="formData.password" type="password" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :placeholder="$t('ui.enterPassword')" />
          </div>
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.role') }}</label>
            <select v-model="formData.role" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600">
              <option value="admin">{{ $t('ui.admin') }}</option>
              <option value="superadmin">{{ $t('ui.superadmin') }}</option>
            </select>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button @click="closeDialogs" class="py-2.5 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-300">
            {{ $t('ui.cancel') }}
          </button>
          <button @click="handleCreate" class="py-2.5 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg">
            {{ $t('ui.create') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑管理员对话框 -->
    <div v-if="showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ $t('ui.editAdmin') }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.username') }}</label>
            <input :value="editingAdmin.username" type="text" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm bg-gray-100" disabled />
          </div>
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.role') }}</label>
            <select v-model="editingAdmin.role" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :disabled="editingAdmin.aid === currentAdminId">
              <option value="admin">{{ $t('ui.admin') }}</option>
              <option value="superadmin">{{ $t('ui.superadmin') }}</option>
            </select>
          </div>
          <div>
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.newPassword') }} ({{ $t('ui.optional') }})</label>
            <input v-model="editingAdmin.newPassword" type="password" class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" :placeholder="$t('ui.leaveEmptyToKeep')" />
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button @click="closeDialogs" class="py-2.5 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-300">
            {{ $t('ui.cancel') }}
          </button>
          <button @click="handleUpdate" class="py-2.5 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg">
            {{ $t('ui.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 班级分配对话框 -->
    <div v-if="showClassDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialogs">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ $t('ui.manageClassAssignment') }}</h3>
          <p class="text-gray-500 text-sm mt-1">{{ selectedAdmin?.username }}</p>
        </div>
        <div class="p-6">
          <div class="max-h-80 overflow-y-auto space-y-2">
            <label
              v-for="classItem in classList"
              :key="classItem.cid"
              class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
              :class="selectedClasses.includes(classItem.cid) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <input
                type="checkbox"
                :checked="selectedClasses.includes(classItem.cid)"
                @change="toggleClassSelection(classItem.cid)"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-gray-700 font-medium">{{ classItem.class_name }}</span>
            </label>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button @click="closeDialogs" class="py-2.5 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-300">
            {{ $t('ui.cancel') }}
          </button>
          <button @click="handleSaveClasses" class="py-2.5 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg">
            {{ $t('ui.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import adminService from '@/services/admin/admin'
import adminClassService from '@/services/admin/adminClass'
import classService from '@/services/admin/class'
import AuthService from '@/services/common/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Pagination from '@/components/common/Pagination.vue'

const { t: $t } = useI18n()

const loading = ref(false)
const error = ref(null)
const adminList = ref([])
const classList = ref([])
const currentAdminId = ref(null)

const pagination = ref({
  page: 1,
  size: 20,
  total: 0,
  pages: 0
})

const filters = ref({
  role: null
})

const showRoleDropdown = ref(false)
const showPageSizeDropdown = ref(false)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showClassDialog = ref(false)

const formData = ref({
  username: '',
  password: '',
  role: 'admin'
})

const editingAdmin = ref({
  aid: null,
  username: '',
  role: 'admin',
  newPassword: ''
})

const selectedAdmin = ref(null)
const selectedClasses = ref([])

const roleSelectRef = ref(null)
const pageSizeSelectRef = ref(null)

// 获取当前管理员ID
const getCurrentAdminId = () => {
  const adminInfo = AuthService.getAdminInfo()
  currentAdminId.value = adminInfo.aid ? parseInt(adminInfo.aid) : null
}

// 加载班级列表
const loadClassList = async () => {
  try {
    const response = await classService.getClassList({ page: 1, size: 1000 })
    if (response.code === 0) {
      classList.value = response.data
    }
  } catch (err) {
    console.error('Failed to load class list:', err)
  }
}

// 加载管理员列表
const loadAdmins = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await adminService.getAdminList({
      page: pagination.value.page,
      size: pagination.value.size,
      role: filters.value.role
    })
    if (response.code === 0) {
      adminList.value = response.data
      pagination.value = response.pagination
    }
  } catch (err) {
    error.value = err.message || $t('ui.loadFailed')
  } finally {
    loading.value = false
  }
}

// 切换下拉菜单
const toggleRoleDropdown = () => {
  showRoleDropdown.value = !showRoleDropdown.value
  showPageSizeDropdown.value = false
}

const togglePageSizeDropdown = () => {
  showPageSizeDropdown.value = !showPageSizeDropdown.value
  showRoleDropdown.value = false
}

// 选择角色
const selectRole = (role) => {
  filters.value.role = role
  showRoleDropdown.value = false
  pagination.value.page = 1
  loadAdmins()
}

// 获取角色文本
const getRoleText = (role) => {
  if (role === 'superadmin') return $t('ui.superadmin')
  if (role === 'admin') return $t('ui.admin')
  return $t('ui.allRoles')
}

// 选择每页条数
const selectPageSizeOption = (size) => {
  pagination.value.size = size
  pagination.value.page = 1
  showPageSizeDropdown.value = false
  loadAdmins()
}

// 页码变化
const handlePageChange = (page) => {
  pagination.value.page = page
  loadAdmins()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 打开编辑对话框
const openEditDialog = (admin) => {
  editingAdmin.value = {
    aid: admin.aid,
    username: admin.username,
    role: admin.role,
    newPassword: ''
  }
  showEditDialog.value = true
}

// 打开班级分配对话框
const openClassDialog = async (admin) => {
  selectedAdmin.value = admin
  try {
    const response = await adminClassService.getAdminClasses(admin.aid)
    if (response.code === 0) {
      selectedClasses.value = response.data.map(c => c.cid)
    }
  } catch (err) {
    selectedClasses.value = admin.classes ? admin.classes.map(c => c.cid) : []
  }
  showClassDialog.value = true
}

// 切换班级选择
const toggleClassSelection = (cid) => {
  const index = selectedClasses.value.indexOf(cid)
  if (index === -1) {
    selectedClasses.value.push(cid)
  } else {
    selectedClasses.value.splice(index, 1)
  }
}

// 关闭对话框
const closeDialogs = () => {
  showCreateDialog.value = false
  showEditDialog.value = false
  showClassDialog.value = false
  formData.value = { username: '', password: '', role: 'admin' }
  editingAdmin.value = { aid: null, username: '', role: 'admin', newPassword: '' }
  selectedAdmin.value = null
  selectedClasses.value = []
}

// 创建管理员
const handleCreate = async () => {
  if (!formData.value.username || !formData.value.password) {
    alert($t('ui.pleaseFillAllFields'))
    return
  }

  try {
    const response = await adminService.createAdmin({
      username: formData.value.username,
      password: formData.value.password,
      role: formData.value.role
    })
    if (response.code === 0) {
      closeDialogs()
      loadAdmins()
    }
  } catch (err) {
    alert(err.message || $t('ui.createFailed'))
  }
}

// 更新管理员
const handleUpdate = async () => {
  try {
    const updateData = { role: editingAdmin.value.role }
    if (editingAdmin.value.newPassword) {
      updateData.password = editingAdmin.value.newPassword
    }

    const response = await adminService.updateAdmin(editingAdmin.value.aid, updateData)
    if (response.code === 0) {
      closeDialogs()
      loadAdmins()
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 删除管理员
const handleDelete = async (aid) => {
  if (aid === currentAdminId.value) {
    alert($t('ui.cannotDeleteSelf'))
    return
  }
  if (!confirm($t('ui.confirmDelete'))) return

  try {
    const response = await adminService.deleteAdmin(aid)
    if (response.code === 0) {
      loadAdmins()
    }
  } catch (err) {
    alert(err.message || $t('ui.deleteFailed'))
  }
}

// 保存班级分配
const handleSaveClasses = async () => {
  try {
    const response = await adminClassService.replaceClasses(selectedAdmin.value.aid, selectedClasses.value)
    if (response.code === 0) {
      closeDialogs()
      loadAdmins()
    }
  } catch (err) {
    alert(err.message || $t('ui.updateFailed'))
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (roleSelectRef.value && !roleSelectRef.value.contains(event.target)) {
    showRoleDropdown.value = false
  }
  if (pageSizeSelectRef.value && !pageSizeSelectRef.value.contains(event.target)) {
    showPageSizeDropdown.value = false
  }
}

onMounted(() => {
  getCurrentAdminId()
  loadClassList()
  loadAdmins()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
