<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ $t('ui.studentManagement') }}</h1>
        <p class="text-gray-600">{{ $t('ui.manageStudentInfo') }}</p>
      </div>

      <!-- 班级选择和操作栏 -->
      <div class="bg-white rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
        <!-- 班级选择器 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('ui.selectClass') }}</label>
          <div class="relative">
            <button
              @click="showClassDropdown = !showClassDropdown"
              class="w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 text-left focus:border-blue-500 focus:outline-none flex items-center justify-between shadow-sm hover:border-gray-400"
            >
              <span>{{ getSelectedClassesText() }}</span>
              <span class="text-gray-500">{{ showClassDropdown ? '▲' : '▼' }}</span>
            </button>

            <!-- 下拉菜单 -->
            <div v-if="showClassDropdown" class="absolute z-10 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              <!-- 全选选项 -->
              <div class="p-3 border-b border-gray-200">
                <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="mr-3"
                  />
                  <span class="font-medium text-blue-600">{{ $t('ui.selectAll') }} ({{ classList.length }}{{ $t('ui.classes') }})</span>
                </label>
              </div>

              <!-- 班级列表 -->
              <div class="max-h-40 overflow-y-auto">
                <label
                  v-for="classItem in classList"
                  :key="classItem.cid"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-3 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    :value="classItem.cid"
                    v-model="selectedClassIds"
                    class="mr-3"
                  />
                  <div class="flex-1">
                    <span class="text-gray-800">{{ classItem.class_name }}</span>
                    <span class="text-sm text-gray-500 ml-2">(ID: {{ classItem.cid }})</span>
                  </div>
                </label>
              </div>

              <!-- 操作按钮 -->
              <div class="p-3 border-t border-gray-200 flex gap-2">
                <button
                  @click="confirmClassSelection"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  {{ $t('ui.confirmSelection') }}
                </button>
                <button
                  @click="showClassDropdown = false"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm transition-colors duration-200"
                >
                  {{ $t('common.cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 搜索和操作 -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- 搜索栏 -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('ui.searchStudentPlaceholder')"
                class="w-80 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none shadow-sm"
              />
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <button
              @click="clearSearch"
              v-if="searchQuery"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
            >
              {{ $t('ui.clear') }}
            </button>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-3">
            <button
              @click="showAddModal = true"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <span>➕</span>
              {{ $t('ui.addStudent') }}
            </button>
            <button
              @click="refreshData"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
            >
              {{ loading ? $t('ui.refreshing') : $t('ui.refresh') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">{{ $t('ui.totalStudents') }}</p>
              <p class="text-3xl font-bold">{{ totalStudents }}</p>
            </div>
            <div class="text-4xl opacity-80">👥</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">{{ $t('ui.studentsInSchool') }}</p>
              <p class="text-3xl font-bold">{{ attendingStudents }}</p>
            </div>
            <div class="text-4xl opacity-80">✅</div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm font-medium">{{ $t('ui.studentsLeftSchool') }}</p>
              <p class="text-3xl font-bold">{{ absentStudents }}</p>
            </div>
            <div class="text-4xl opacity-80">❌</div>
          </div>
        </div>
      </div>

      <!-- 学生表格 -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-800">{{ $t('ui.studentList') }}</h2>
            <div class="text-sm text-gray-500">
              {{ $t('ui.selectedClasses', { count: selectedClassIds.length }) }}
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <!-- 加载中状态 -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <LoadingSpinner />
            <span class="ml-3 text-gray-500">{{ $t('ui.loadingStudentList') }}</span>
          </div>

          <!-- 无数据状态 -->
          <div v-else-if="filteredStudents.length === 0" class="flex flex-col items-center justify-center py-12">
            <div class="text-6xl mb-4">👥</div>
            <div class="text-xl text-gray-500 mb-2">
              {{ selectedClassIds.length === 0 ? $t('ui.pleaseSelectClass') :
                 searchQuery ? $t('ui.noMatchingStudents') : $t('ui.noStudentData') }}
            </div>
            <div class="text-sm text-gray-400 mb-4">
              {{ selectedClassIds.length === 0 ? $t('ui.selectClassFromDropdown') :
                 searchQuery ? $t('ui.tryOtherKeywords') : $t('ui.noStudentsAddedYet') }}
            </div>
            <button
              v-if="selectedClassIds.length > 0 && !searchQuery"
              @click="showAddModal = true"
              class="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
            >
              <span>➕</span>
              {{ $t('ui.addStudentNow') }}
            </button>
          </div>

          <!-- 学生表格 -->
          <table v-else class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">{{ $t('ui.class') }}</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">{{ $t('ui.studentId') }}</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">{{ $t('ui.name') }}</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-700">{{ $t('ui.attendanceStatus') }}</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-700">{{ $t('ui.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in paginatedStudents"
                :key="`${student.cid}-${student.sid}`"
                class="border-b border-gray-200 even:bg-gray-50/50 hover:bg-blue-50 transition-all duration-200"
              >
                <!-- 班级 -->
                <td class="py-3 px-4 text-gray-700">
                  {{ getClassName(student.cid) }}
                </td>

                <!-- 学号 -->
                <td class="py-3 px-4 text-gray-700">
                  {{ student.sid }}
                </td>

                <!-- 姓名 -->
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                      :class="getAvatarColor(student.student_name)"
                    >
                      {{ getNameInitial(student.student_name) }}
                    </div>
                    <span class="text-gray-800 font-medium">{{ student.student_name }}</span>
                  </div>
                </td>

                <!-- 出勤状态 -->
                <td class="py-3 px-4 text-center">
                  <button
                    @click="toggleAttendance(student)"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    :class="student.attendance
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'"
                  >
                    {{ student.attendance ? $t('ui.inSchool') : $t('ui.leftSchool') }}
                  </button>
                </td>

                <!-- 操作按钮 -->
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <!-- 查看详情按钮 -->
                    <button
                      @click="showStudentDetail(student)"
                      class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      :title="$t('ui.viewDetails')"
                    >
                      {{ $t('ui.details') }}
                    </button>

                    <!-- 删除按钮 -->
                    <button
                      @click="deleteStudent(student)"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      :title="$t('ui.deleteStudent')"
                    >
                      {{ $t('ui.delete') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div v-if="filteredStudents.length > 0" class="p-6 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- 分页信息和每页大小选择 -->
            <div class="flex items-center gap-4">
              <div class="text-sm text-gray-600">
                {{ $t('ui.showingRecords', { start: startItem, end: endItem, total: filteredStudents.length }) }}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">{{ $t('ui.itemsPerPage') }}</span>
                <select
                  v-model="pageSize"
                  @change="currentPage = 1"
                  class="px-2 py-1 bg-white border border-gray-300 rounded text-gray-800 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span class="text-sm text-gray-600">{{ $t('ui.items') }}</span>
              </div>
            </div>

            <!-- 分页控件 -->
            <div class="flex items-center gap-2">
              <!-- 首页 -->
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded border transition-colors duration-200"
                :class="currentPage === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
              >
                {{ $t('ui.firstPage') }}
              </button>

              <!-- 上一页 -->
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded border transition-colors duration-200"
                :class="currentPage === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
              >
                {{ $t('ui.previousPage') }}
              </button>

              <!-- 页码按钮 -->
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="px-3 py-1 rounded border transition-colors duration-200"
                :class="page === currentPage
                  ? 'border-blue-500 bg-blue-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
              >
                {{ page }}
              </button>

              <!-- 下一页 -->
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded border transition-colors duration-200"
                :class="currentPage === totalPages
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
              >
                {{ $t('ui.nextPage') }}
              </button>

              <!-- 末页 -->
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded border transition-colors duration-200"
                :class="currentPage === totalPages
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
              >
                {{ $t('ui.lastPage') }}
              </button>

              <!-- 页面跳转 -->
              <div class="flex items-center gap-2 ml-4">
                <span class="text-sm text-gray-600">{{ $t('ui.jumpTo') }}</span>
                <input
                  v-model="jumpToPage"
                  @keyup.enter="handleJumpToPage"
                  type="number"
                  :min="1"
                  :max="totalPages"
                  class="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-gray-800 text-center text-sm focus:border-blue-500 focus:outline-none"
                />
                <span class="text-sm text-gray-600">{{ $t('ui.page') }}</span>
                <button
                  @click="handleJumpToPage"
                  class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
                >
                  {{ $t('ui.confirm') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加学生模态框 -->
      <AddStudentModal
        v-if="showAddModal"
        :cid="selectedClassIds.length > 0 ? selectedClassIds[0] : null"
        :classList="classList"
        @close="showAddModal = false"
        @success="handleAddStudentSuccess"
      />

      <!-- 学生详情模态框 -->
      <StudentDetailModal
        v-if="showDetailModal && selectedStudent"
        :student="selectedStudent"
        @close="closeDetailModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import AddStudentModal from '@/components/student/AddStudentModal.vue'
import StudentDetailModal from '@/components/student/StudentDetailModal.vue'
import StudentService from '@/services/basic/student.js'
import StudentAdminService from '@/services/admin/student.js'
import ClassService from '@/services/basic/class.js'
import notificationService from '@/services/common/notification.js'

const { t: $t } = useI18n()

// 数据状态
const students = ref([])
const classList = ref([])
const loading = ref(false)
const classLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const jumpToPage = ref(1)

// 班级选择状态
const selectedClassIds = ref([])
const showClassDropdown = ref(false)

// 模态框状态
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedStudent = ref(null)

// 班级选择相关计算属性
const isAllSelected = computed(() => {
  return classList.value.length > 0 && selectedClassIds.value.length === classList.value.length
})

const isIndeterminate = computed(() => {
  return selectedClassIds.value.length > 0 && selectedClassIds.value.length < classList.value.length
})

// 数据相关计算属性
const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) return students.value

  const query = searchQuery.value.toLowerCase().trim()
  return students.value.filter(student =>
    student.student_name.toLowerCase().includes(query) ||
    student.sid.toString().includes(query)
  )
})

const totalStudents = computed(() => students.value.length)
const attendingStudents = computed(() => students.value.filter(s => s.attendance).length)
const absentStudents = computed(() => students.value.filter(s => !s.attendance).length)

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

const startItem = computed(() => {
  return filteredStudents.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredStudents.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 获取班级名称
const getClassName = (cid) => {
  const classItem = classList.value.find(c => c.cid === cid)
  return classItem ? classItem.class_name : $t('ui.unknownClass', { cid })
}

// 获取选中班级的显示文本
const getSelectedClassesText = () => {
  if (selectedClassIds.value.length === 0) {
    return $t('ui.pleaseSelectClass')
  } else if (selectedClassIds.value.length === 1) {
    return getClassName(selectedClassIds.value[0])
  } else if (selectedClassIds.value.length === classList.value.length) {
    return $t('ui.allClasses', { count: selectedClassIds.value.length })
  } else {
    return $t('ui.selectedClasses', { count: selectedClassIds.value.length })
  }
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedClassIds.value = []
  } else {
    selectedClassIds.value = classList.value.map(c => c.cid)
  }
}

// 确认班级选择
const confirmClassSelection = () => {
  showClassDropdown.value = false
  fetchStudents()
}

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

// 获取班级列表
const fetchClassList = async () => {
  try {
    classLoading.value = true
    const response = await ClassService.getAllClasses()
    classList.value = response || []
  } catch (error) {
    console.error($t('component.getClassListFailed') + ':', error)
    notificationService.error(error.message || $t('component.getClassListFailed'));
    classList.value = []
  } finally {
    classLoading.value = false
  }
}

// 获取学生列表
const fetchStudents = async () => {
  if (selectedClassIds.value.length === 0) {
    students.value = []
    return
  }

  try {
    loading.value = true
    const allStudents = []

    // 并行获取所有选中班级的学生
    const promises = selectedClassIds.value.map(async (cid) => {
      try {
        const response = await StudentService.getStudentListAll(cid)
        if (response && response.data) {
          return response.data.map(student => ({
            ...student,
            cid // 添加班级ID
          }))
        }
        return []
      } catch (error) {
        console.error($t('component.getStudentsForClassFailed', { className: cid }) + ':', error)
        notificationService.warn($t('component.getStudentsForClassFailed', { className: getClassName(cid) }));
        return []
      }
    })

    const results = await Promise.all(promises)
    results.forEach(studentList => {
      allStudents.push(...studentList)
    })

    students.value = allStudents
  } catch (error) {
    console.error($t('component.getStudentListFailed') + ':', error)
    notificationService.error($t('component.getStudentListFailed'));
    students.value = []
  } finally {
    loading.value = false
  }
}

// 切换出勤状态
const toggleAttendance = async (student) => {
  try {
    const newAttendance = !student.attendance
    await StudentAdminService.changeAttendance(student.sid, newAttendance)

    // 更新本地状态
    student.attendance = newAttendance

    notificationService.success(
      `${student.student_name} ${$t('component.statusChangedTo')} ${newAttendance ? $t('ui.inSchool') : $t('ui.leftSchool')}`,
    )
  } catch (error) {
    console.error($t('component.changeAttendanceStatusFailed') + ':', error)
    notificationService.error(error.message || $t('component.changeAttendanceStatusFailed'));
  }
}

// 删除学生
const deleteStudent = async (student) => {
  if (!confirm($t('component.confirmDeleteStudent', { studentName: student.student_name }))) {
    return
  }

  try {
    await StudentAdminService.deleteStudent(student.sid)

    // 从本地列表中移除
    const index = students.value.findIndex(s => s.sid === student.sid)
    if (index > -1) {
      students.value.splice(index, 1)
    }

    notificationService.success($t('component.deleteStudentSuccess', { studentName: student.student_name }))
  } catch (error) {
    console.error($t('component.deleteStudentFailed') + ':', error)
    notificationService.error(error.message || $t('component.deleteStudentFailed'));
  }
}

// 显示学生详情
const showStudentDetail = (student) => {
  selectedStudent.value = student
  showDetailModal.value = true
}

// 关闭学生详情
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedStudent.value = null
  // 刷新学生列表以获取最新数据
  fetchStudents()
}

// 处理添加学生成功
const handleAddStudentSuccess = () => {
  showAddModal.value = false
  fetchStudents()
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

// 刷新数据
const refreshData = () => {
  fetchStudents()
}

// 处理页面跳转
const handleJumpToPage = () => {
  const page = parseInt(jumpToPage.value)
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
  jumpToPage.value = currentPage.value
}

// 监听搜索变化，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
})

// 监听页面大小变化，重置页码
watch(pageSize, () => {
  currentPage.value = 1
})

// 监听当前页码变化，更新跳转输入框
watch(currentPage, (newPage) => {
  jumpToPage.value = newPage
})

// 监听班级选择变化
watch(selectedClassIds, () => {
  currentPage.value = 1
}, { deep: true })

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showClassDropdown.value = false
  }
}

// 初始化
onMounted(async () => {
  await fetchClassList()

  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>