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
          <div class="sort-controls">
            <label>排序方式：</label>
            <select v-model="sortOrder" @change="fetchClasses" class="sort-select">
              <option value="asc">创建时间升序</option>
              <option value="desc">创建时间降序</option>
            </select>
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
            <span>共找到 {{ pagination.total }} 个班级</span>
          </div>
        </div>

        <div class="class-grid">
          <div
            v-for="classItem in classList"
            :key="classItem.cid"
            class="class-card"
          >
            <div class="card-header">
              <h3 class="class-name">{{ classItem.class_name }}</h3>
              <div class="class-id">ID: {{ classItem.cid }}</div>
            </div>

            <div class="card-content">
              <div class="class-info">
                <div class="info-item">
                  <span class="info-icon">👥</span>
                  <span class="info-label">学生人数</span>
                  <span class="info-value">{{ getStudentCount(classItem.cid) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-icon">📅</span>
                  <span class="info-label">创建时间</span>
                  <span class="info-value">{{ formatDate(classItem.create_time) }}</span>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <button
                @click="viewClassDetail(classItem)"
                class="action-btn view-btn"
              >
                <span class="btn-icon">👁️</span>
                查看详情
              </button>
              <button
                @click="confirmDelete(classItem)"
                class="action-btn delete-btn"
              >
                <span class="btn-icon">🗑️</span>
                删除
              </button>
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
import { ref, reactive, onMounted, computed } from 'vue'
import AdminClassService from '@/services/admin/class'

// 响应式数据
const loading = ref(false)
const error = ref('')
const classList = ref([])
const searchQuery = ref('')
const sortOrder = ref('desc')

// 分页数据
const pagination = reactive({
  page: 1,
  size: 12,
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

// 方法
const fetchClasses = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: pagination.page,
      size: pagination.size,
      order: sortOrder.value
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

.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-select {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
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

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.class-card {
  background: #f9fafb;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.class-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #2563eb;
}

.card-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.class-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.class-id {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.card-content {
  padding: 16px 20px;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.info-label {
  color: #6b7280;
  font-size: 0.875rem;
  flex: 1;
}

.info-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.card-actions {
  padding: 16px 20px 20px;
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn {
  background: #eff6ff;
  color: #2563eb;
}

.view-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
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

  .search-input-wrapper {
    min-width: auto;
  }

  .class-grid {
    grid-template-columns: 1fr;
    padding: 16px;
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

  .card-actions {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>