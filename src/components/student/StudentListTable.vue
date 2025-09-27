<template>
  <div class="overflow-x-auto">
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner />
      <span class="ml-3 text-gray-400">加载学生列表中...</span>
    </div>

    <!-- 无数据状态 -->
    <div v-else-if="students.length === 0" class="flex flex-col items-center justify-center py-12">
      <div class="text-6xl mb-4">👥</div>
      <div class="text-xl text-gray-400 mb-2">暂无学生数据</div>
      <div class="text-sm text-gray-500">请添加学生或切换班级</div>
    </div>

    <!-- 学生表格 -->
    <table v-else class="w-full">
      <thead>
        <tr class="bg-gray-700 border-b border-gray-600">
          <th class="text-left py-3 px-4 font-semibold text-gray-200">学号</th>
          <th class="text-left py-3 px-4 font-semibold text-gray-200">姓名</th>
          <th class="text-center py-3 px-4 font-semibold text-gray-200">出勤状态</th>
          <th class="text-center py-3 px-4 font-semibold text-gray-200">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in students"
          :key="student.sid"
          class="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
        >
          <!-- 学号 -->
          <td class="py-3 px-4 text-gray-300">
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
              <span class="text-gray-200 font-medium">{{ student.student_name }}</span>
            </div>
          </td>

          <!-- 出勤状态 -->
          <td class="py-3 px-4 text-center">
            <button
              @click="$emit('toggle-attendance', student)"
              class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
              :class="student.attendance
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'"
            >
              {{ student.attendance ? '在校' : '离校' }}
            </button>
          </td>

          <!-- 操作按钮 -->
          <td class="py-3 px-4 text-center">
            <div class="flex items-center justify-center gap-2">
              <!-- 编辑按钮 -->
              <button
                @click="$emit('edit-student', student)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                title="编辑学生"
              >
                编辑
              </button>

              <!-- 查看详情按钮 -->
              <button
                @click="showStudentDetail(student)"
                class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                title="查看详情"
              >
                详情
              </button>

              <!-- 删除按钮 -->
              <button
                @click="$emit('delete-student', student)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                title="删除学生"
              >
                删除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// Props
const props = defineProps({
  students: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['edit-student', 'delete-student', 'toggle-attendance'])

// 状态
const showDetailModal = ref(false)
const selectedStudent = ref(null)

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

// 显示学生详情
const showStudentDetail = (student) => {
  selectedStudent.value = student
  showDetailModal.value = true
}
</script>