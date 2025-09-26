<template>
  <div class="class-admin">
    <div class="container">
      <!-- 头部区域 -->
      <div class="header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="title">班级管理</h1>
            <p class="subtitle">管理所有班级信息，查看学生人数和创建时间</p>
          </div>
          <div class="header-actions">
            <button @click="showCreateDialog = true" class="create-btn">
              <span class="btn-icon">➕</span>
              创建班级
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索和过滤区域 -->
      <div class="search-section">
        <div class="search-controls">
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索班级名称..."
              class="search-input"
              @input="handleSearch"
            >
            <span class="search-icon">🔍</span>
          </div>
          <div class="page-size-controls">
            <label>每页显示：</label>
            <div class="custom-select" ref="pageSizeSelectRef">
              <div class="select-trigger" @click="togglePageSizeDropdown">
                <span class="select-value">{{ pagination.size }}条</span>
                <span class="select-arrow" :class="{ active: showPageSizeDropdown }">▼</span>
              </div>
              <div class="select-dropdown" v-show="showPageSizeDropdown">
                <div
                  class="select-option"
                  :class="{ selected: pagination.size === 5 }"
                  @click="selectPageSizeOption(5)"
                >
                  5条
                </div>
                <div
                  class="select-option"
                  :class="{ selected: pagination.size === 20 }"
                  @click="selectPageSizeOption(20)"
                >
                  20条
                </div>
                <div
                  class="select-option"
                  :class="{ selected: pagination.size === 50 }"
                  @click="selectPageSizeOption(50)"
                >
                  50条
                </div>
                <div
                  class="select-option"
                  :class="{ selected: pagination.size === 100 }"
                  @click="selectPageSizeOption(100)"
                >
                  100条
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- 班级列表 -->
      <div v-if="!loading && !error" class="class-list">
        <div class="list-header">
          <div class="list-stats">
            <span>共找到 {{ pagination.total }} 个班级，每页显示 {{ pagination.size }} 条</span>
          </div>
        </div>

        <!-- 表头排序 -->
        <div class="table-header">
          <div class="header-item flex-2">班级名称</div>
          <div class="header-item sortable" @click="handleSort('cid')">
            <span>ID</span>
            <span class="sort-arrows">
              <span class="arrow up" :class="{ active: sortField === 'cid' && sortDirection === 'asc' }">↑</span>
              <span class="arrow down" :class="{ active: sortField === 'cid' && sortDirection === 'desc' }">↓</span>
            </span>
          </div>
          <div class="header-item flex-1">学生人数</div>
          <div class="header-item sortable" @click="handleSort('create_time')">
            <span>创建时间</span>
            <span class="sort-arrows">
              <span class="arrow up" :class="{ active: sortField === 'create_time' && sortDirection === 'asc' }">↑</span>
              <span class="arrow down" :class="{ active: sortField === 'create_time' && sortDirection === 'desc' }">↓</span>
            </span>
          </div>
          <div class="header-item flex-1">操作</div>
        </div>

        <div class="class-table">
          <div
            v-for="classItem in sortedClassList"
            :key="classItem.cid"
            class="class-row"
          >
            <div class="row-item flex-2">
              <h3 class="class-name">{{ classItem.class_name }}</h3>
            </div>
            <div class="row-item">
              <span class="class-id">{{ classItem.cid }}</span>
            </div>
            <div class="row-item flex-1">
              <span class="student-count">
                <span class="count-icon">👥</span>
                {{ getStudentCount(classItem.cid) }}人
              </span>
            </div>
            <div class="row-item">
              <span class="create-time">{{ formatDate(classItem.create_time) }}</span>
            </div>
            <div class="row-item flex-1">
              <div class="action-buttons">
                <button
                  @click="viewClassDetail(classItem)"
                  class="action-btn view-btn"
                  title="查看详情"
                >
                  <span class="btn-icon">👁️</span>
                </button>
                <button
                  @click="confirmDelete(classItem)"
                  class="action-btn delete-btn"
                  title="删除班级"
                >
                  <span class="btn-icon">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页组件 -->
        <div class="pagination" v-if="pagination.pages > 1">
          <button
            @click="changePage(page)"
            v-for="page in paginationPages"
            :key="page"
            :class="['page-btn', { active: page === pagination.page }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- 创建班级对话框 -->
    <div v-if="showCreateDialog" class="modal-overlay" @click.self="showCreateDialog = false">
      <div class="modal">
        <div class="modal-header">
          <h3>创建新班级</h3>
          <button @click="showCreateDialog = false" class="close-btn">✖️</button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label for="className">班级名称</label>
            <input
              id="className"
              v-model="newClassName"
              type="text"
              placeholder="请输入班级名称"
              class="form-input"
              @keyup.enter="createClass"
            >
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showCreateDialog = false" class="cancel-btn">取消</button>
          <button @click="createClass" :disabled="!newClassName.trim() || creating" class="confirm-btn">
            {{ creating ? '创建中...' : '确认创建' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 班级详情对话框 -->
    <div v-if="showDetailDialog" class="modal-overlay" @click.self="showDetailDialog = false">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>班级详情 - {{ selectedClass?.class_name }}</h3>
          <button @click="showDetailDialog = false" class="close-btn">✖️</button>
        </div>
        <div class="modal-content">
          <div v-if="loadingDetail" class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载详情中...</p>
          </div>
          <div v-else-if="classDetail" class="class-detail">
            <div class="detail-info">
              <div class="detail-item">
                <span class="detail-label">班级ID：</span>
                <span class="detail-value">{{ classDetail.cid }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">班级名称：</span>
                <span class="detail-value">{{ classDetail.class_name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间：</span>
                <span class="detail-value">{{ formatDate(classDetail.create_time) }}</span>
              </div>
            </div>
            <div class="students-section">
              <h4>班级学生 ({{ classDetail.students?.length || 0 }}人)</h4>
              <div v-if="classDetail.students && classDetail.students.length > 0" class="students-list">
                <div
                  v-for="student in classDetail.students"
                  :key="student.sid"
                  class="student-item"
                >
                  <span class="student-name">{{ student.student_name }}</span>
                  <span class="student-id">ID: {{ student.sid }}</span>
                  <span
                    class="student-status"
                    :class="{ active: student.attendance }"
                  >
                    {{ student.attendance ? '在校' : '缺勤' }}
                  </span>
                </div>
              </div>
              <div v-else class="no-students">
                暂无学生
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="modal-overlay" @click.self="showDeleteDialog = false">
      <div class="modal">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button @click="showDeleteDialog = false" class="close-btn">✖️</button>
        </div>
        <div class="modal-content">
          <p>确定要删除班级 "{{ selectedClass?.class_name }}" 吗？</p>
          <p class="warning-text">此操作不可撤销，请谨慎操作！</p>
        </div>
        <div class="modal-actions">
          <button @click="showDeleteDialog = false" class="cancel-btn">取消</button>
          <button @click="deleteClass" :disabled="deleting" class="delete-btn">
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import AdminClassService from '@/services/admin/class'

// 响应式数据
const loading = ref(false)
const error = ref('')
const classList = ref([])
const searchQuery = ref('')
const sortOrder = ref('desc') // API排序使用（仅用于创建时间）

// 排序状态
const sortField = ref('create_time') // 当前排序字段
const sortDirection = ref('desc') // 当前排序方向

// 自定义下拉框状态（移除排序下拉框相关）
const showPageSizeDropdown = ref(false)
const pageSizeSelectRef = ref(null)

// 分页数据
const pagination = reactive({
  page: 1,
  size: 20, // 默认显示20条
  total: 0,
  pages: 0
})

// 对话框状态
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)

// 表单数据
const newClassName = ref('')
const creating = ref(false)
const deleting = ref(false)
const loadingDetail = ref(false)

// 选中的班级和详情
const selectedClass = ref(null)
const classDetail = ref(null)

// 学生人数缓存
const studentCounts = ref({})

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

// 排序后的班级列表计算属性
const sortedClassList = computed(() => {
  if (!classList.value || classList.value.length === 0) {
    return []
  }

  // 如果是创建时间排序，直接返回（由API处理）
  if (sortField.value === 'create_time') {
    return classList.value
  }

  // 前端排序处理
  const sorted = [...classList.value].sort((a, b) => {
    let aValue, bValue

    if (sortField.value === 'cid') {
      aValue = a.cid
      bValue = b.cid
    } else if (sortField.value === 'class_name') {
      aValue = a.class_name
      bValue = b.class_name
    } else {
      return 0
    }

    // 数值排序
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
    }

    // 字符串排序
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue, 'zh-CN')
      return sortDirection.value === 'asc' ? result : -result
    }

    return 0
  })

  return sorted
})

// 方法
const fetchClasses = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: pagination.page,
      size: pagination.size,
      order: sortField.value === 'create_time' ? sortDirection.value : sortOrder.value
    }

    const response = await AdminClassService.getClassList(params)

    classList.value = response.data || []
    Object.assign(pagination, response.pagination)

    // 获取每个班级的学生人数
    await fetchStudentCounts()

  } catch (err) {
    error.value = err.message || '获取班级列表失败'
    console.error('获取班级列表失败:', err)
  } finally {
    loading.value = false
  }
}

const fetchStudentCounts = async () => {
  for (const classItem of classList.value) {
    try {
      const detail = await AdminClassService.getClassDetail(classItem.cid)
      studentCounts.value[classItem.cid] = detail.data.students?.length || 0
    } catch (err) {
      studentCounts.value[classItem.cid] = 0
    }
  }
}

const getStudentCount = (cid) => {
  return studentCounts.value[cid] || 0
}

const handleSearch = () => {
  // 简单的前端搜索
  // 在实际项目中，应该发送搜索请求到后端
  pagination.page = 1
  fetchClasses()
}

const changePage = (page) => {
  if (page !== '...' && page !== pagination.page) {
    pagination.page = page
    fetchClasses()
  }
}

const handlePageSizeChange = () => {
  // 每页显示数量变化时，重置到第一页
  pagination.page = 1
  fetchClasses()
}

// 排序处理方法
const handleSort = (field) => {
  if (sortField.value === field) {
    // 如果点击的是当前排序字段，切换排序方向
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 如果点击的是新字段，设置为新字段并默认降序
    sortField.value = field
    sortDirection.value = 'desc'
  }

  // 如果是创建时间排序，需要重新请求API
  if (field === 'create_time') {
    pagination.page = 1 // 重置到第一页
    fetchClasses()
  }
  // 其他排序由计算属性自动处理，不需要重新请求
}

// 自定义下拉框方法（仅保留每页显示数量）
const togglePageSizeDropdown = () => {
  showPageSizeDropdown.value = !showPageSizeDropdown.value
}

const selectPageSizeOption = (value) => {
  pagination.size = value
  showPageSizeDropdown.value = false
  handlePageSizeChange()
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  if (pageSizeSelectRef.value && !pageSizeSelectRef.value.contains(event.target)) {
    showPageSizeDropdown.value = false
  }
}

const createClass = async () => {
  if (!newClassName.value.trim()) {
    return
  }

  try {
    creating.value = true
    await AdminClassService.createClass(newClassName.value.trim())

    showCreateDialog.value = false
    newClassName.value = ''

    // 刷新列表
    pagination.page = 1
    await fetchClasses()

  } catch (err) {
    error.value = err.message || '创建班级失败'
    console.error('创建班级失败:', err)
  } finally {
    creating.value = false
  }
}

const viewClassDetail = async (classItem) => {
  selectedClass.value = classItem
  showDetailDialog.value = true
  loadingDetail.value = true

  try {
    const response = await AdminClassService.getClassDetail(classItem.cid)
    classDetail.value = response.data
  } catch (err) {
    error.value = err.message || '获取班级详情失败'
    console.error('获取班级详情失败:', err)
  } finally {
    loadingDetail.value = false
  }
}

const confirmDelete = (classItem) => {
  selectedClass.value = classItem
  showDeleteDialog.value = true
}

const deleteClass = async () => {
  if (!selectedClass.value) {
    return
  }

  try {
    deleting.value = true
    await AdminClassService.deleteClass(selectedClass.value.cid)

    showDeleteDialog.value = false
    selectedClass.value = null

    // 刷新列表
    await fetchClasses()

  } catch (err) {
    error.value = err.message || '删除班级失败'
    console.error('删除班级失败:', err)
  } finally {
    deleting.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return '未知'
  const date = new Date(timestamp * 1000) // 假设是Unix时间戳
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(() => {
  fetchClasses()
  // 添加点击外部关闭下拉框的事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 重置和基础样式 */
* {
  box-sizing: border-box;
}

.class-admin {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-icon {
  font-size: 1rem;
}

/* 搜索区域 */
.search-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.search-controls {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #6b7280;
}

/* 排序控制器已移除，保留作为备用 */

.page-size-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 自定义下拉框样式 */
.custom-select {
  position: relative;
  min-width: 160px;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.select-trigger:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.1);
}

.select-value {
  flex: 1;
  text-align: left;
}

.select-arrow {
  margin-left: 12px;
  font-size: 0.75rem;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.select-arrow.active {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlide 0.2s ease;
}

.select-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.select-option:last-child {
  border-bottom: none;
}

.select-option:hover {
  background: #f8fafc;
  color: #2563eb;
}

.select-option.selected {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  font-weight: 600;
  position: relative;
}

.select-option.selected::after {
  content: '✓';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #2563eb;
  font-weight: bold;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 旧样式移除，保留作为备用 */
.sort-select {
  display: none;
}

/* 加载和错误状态 */
.loading-container {
  text-align: center;
  padding: 48px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-bottom-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: center;
}

/* 班级列表 */
.class-list {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.list-stats {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 表头样式 */
.table-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
  padding: 16px 24px;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.header-item {
  display: flex;
  align-items: center;
  padding: 0 8px;
  min-width: 0;
}

.header-item.flex-1 {
  flex: 1;
}

.header-item.flex-2 {
  flex: 2;
}

.header-item.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
  gap: 8px;
}

.header-item.sortable:hover {
  color: #2563eb;
}

.sort-arrows {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-left: 4px;
}

.arrow {
  font-size: 0.7rem;
  color: #d1d5db;
  transition: color 0.2s ease;
  line-height: 1;
}

.arrow.active {
  color: #2563eb;
  font-weight: bold;
}

.arrow.up {
  margin-bottom: -2px;
}

.arrow.down {
  margin-top: -2px;
}

/* 表格内容样式 */
.class-table {
  display: flex;
  flex-direction: column;
}

.class-row {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.class-row:hover {
  background: #f8fafc;
}

.class-row:last-child {
  border-bottom: none;
}

.row-item {
  display: flex;
  align-items: center;
  padding: 0 8px;
  min-width: 0;
}

.row-item.flex-1 {
  flex: 1;
}

.row-item.flex-2 {
  flex: 2;
}

.class-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.class-id {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}

.student-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.count-icon {
  font-size: 1rem;
}

.create-time {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn {
  background: #eff6ff;
  color: #2563eb;
}

.view-btn:hover {
  background: #dbeafe;
  transform: scale(1.05);
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
  transform: scale(1.05);
}

.btn-icon {
  font-size: 1rem;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
}

.page-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn, .confirm-btn, .delete-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: none;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  background: #2563eb;
  color: white;
  border: none;
}

.confirm-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  background: #dc2626;
  color: white;
  border: none;
}

.delete-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.warning-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 8px;
}

/* 班级详情 */
.class-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
}

.detail-value {
  color: #6b7280;
}

.students-section h4 {
  color: #1f2937;
  font-size: 1.125rem;
  margin: 0 0 16px 0;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.student-name {
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.student-id {
  font-size: 0.875rem;
  color: #6b7280;
}

.student-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fef2f2;
  color: #dc2626;
}

.student-status.active {
  background: #f0f9ff;
  color: #0369a1;
}

.no-students {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 24px;
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .class-admin {
    padding: 16px;
  }

  .title {
    font-size: 2rem;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .search-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .page-size-controls {
    justify-content: space-between;
  }

  .custom-select {
    min-width: 140px;
  }

  .select-trigger {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .search-input-wrapper {
    min-width: auto;
  }

  .table-header {
    padding: 12px 16px;
    font-size: 0.8rem;
  }

  .class-row {
    padding: 12px 16px;
  }

  .header-item,
  .row-item {
    padding: 0 4px;
  }

  .class-name {
    font-size: 1rem;
  }

  .sort-arrows {
    gap: 0;
  }

  .arrow {
    font-size: 0.6rem;
  }

  .modal {
    width: 95%;
    margin: 16px;
  }
}

@media (max-width: 480px) {
  .class-admin {
    padding: 12px;
  }

  .title {
    font-size: 1.75rem;
  }

  .custom-select {
    min-width: 120px;
  }

  .select-trigger {
    padding: 6px 10px;
    font-size: 0.75rem;
  }

  .select-option {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .table-header {
    padding: 10px 12px;
    font-size: 0.75rem;
  }

  .class-row {
    padding: 10px 12px;
  }

  .header-item,
  .row-item {
    padding: 0 2px;
  }

  .class-name {
    font-size: 0.9rem;
  }

  .class-id {
    font-size: 0.75rem;
    padding: 2px 6px;
  }

  .student-count,
  .create-time {
    font-size: 0.75rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .btn-icon {
    font-size: 0.9rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>