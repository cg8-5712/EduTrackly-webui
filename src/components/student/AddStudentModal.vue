<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click="handleBackdropClick">
    <!-- 模态框内容 -->
    <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 class="text-xl font-bold text-white">添加学生</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- 模式选择控制条 -->
      <div class="px-6 pt-4 pb-2">
        <div class="flex justify-center">
          <div class="mode-switch-group flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="batchMode = false"
              :class="[
                'mode-switch-btn flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                !batchMode
                  ? 'active bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
              ]"
              :title="'手动模式'"
            >
              <UserIcon class="w-4 h-4 mr-2" />
              <span>手动</span>
            </button>
            <button
              @click="batchMode = true"
              :class="[
                'mode-switch-btn flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                batchMode
                  ? 'active bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
              ]"
              :title="'批量模式'"
            >
              <UsersIcon class="w-4 h-4 mr-2" />
              <span>批量</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 模态框主体 -->
      <div class="p-6 pt-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 目标班级选择（仅手动模式显示） -->
          <div v-if="!batchMode">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              目标班级 <span class="text-red-400">*</span>
            </label>
            <select
              v-model="selectedClassId"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              :class="{ 'border-red-500': errors.class_id }"
              required
            >
              <option value="">请选择班级</option>
              <option
                v-for="classItem in props.classList"
                :key="classItem.cid"
                :value="classItem.cid"
              >
                {{ classItem.class_name }}
              </option>
            </select>
            <p v-if="errors.class_id" class="text-red-400 text-sm mt-1">
              {{ errors.class_id }}
            </p>
          </div>

          <!-- 学生姓名（仅手动模式显示） -->
          <div v-if="!batchMode">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              学生姓名 <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.student_name"
              type="text"
              placeholder="请输入学生姓名"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              :class="{ 'border-red-500': errors.student_name }"
              required
            />
            <p v-if="errors.student_name" class="text-red-400 text-sm mt-1">
              {{ errors.student_name }}
            </p>
          </div>

          <!-- 初始出勤状态（仅手动模式显示） -->
          <div v-if="!batchMode">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              初始状态
            </label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  v-model="formData.attendance"
                  type="radio"
                  :value="true"
                  class="mr-2 text-green-500"
                />
                <span class="text-green-400">在校</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.attendance"
                  type="radio"
                  :value="false"
                  class="mr-2 text-red-500"
                />
                <span class="text-red-400">离校</span>
              </label>
            </div>
          </div>

          <!-- 批量添加文本框（仅批量模式显示） -->
          <div v-if="batchMode">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              批量输入学生信息 <span class="text-red-400">*</span>
            </label>
            <textarea
              v-model="batchNames"
              placeholder="CSV格式，每行一个学生，格式：班级ID,姓名,出勤状态&#10;例如：&#10;1,张三,1&#10;1,李四,0&#10;2,王五,1&#10;&#10;出勤状态：1=在校，0=离校"
              rows="10"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none font-mono"
              :class="{ 'border-red-500': errors.student_name }"
            ></textarea>
            <p class="text-sm text-gray-400 mt-1">
              CSV格式：班级ID,姓名,出勤状态（1=在校，0=离校）
            </p>
            <p v-if="errors.student_name" class="text-red-400 text-sm mt-1">
              {{ errors.student_name }}
            </p>
          </div>
        </form>
      </div>

      <!-- 模态框底部 -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          :disabled="submitting"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <LoadingSpinner v-if="submitting" size="small" />
          {{ submitting ? '添加中...' : '确认添加' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UserIcon, UsersIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StudentAdminService from '@/services/admin/student'
import notificationService from '@/services/common/notification'

// Props
const props = defineProps({
  cid: {
    type: Number,
    required: false
  },
  classList: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['close', 'success'])

// 状态
const submitting = ref(false)
const batchMode = ref(false)
const batchNames = ref('')
const selectedClassId = ref(props.cid || '')

// 表单数据
const formData = reactive({
  student_name: '',
  attendance: true
})

// 错误信息
const errors = reactive({
  student_name: '',
  class_id: ''
})

// 验证表单
const validateForm = () => {
  errors.student_name = ''
  errors.class_id = ''

  // 手动模式需要验证班级
  if (!batchMode.value && !selectedClassId.value) {
    errors.class_id = '请选择目标班级'
    return false
  }

  // 批量模式需要验证输入
  if (batchMode.value) {
    if (!batchNames.value.trim()) {
      errors.student_name = '请输入学生信息'
      return false
    }
  } else {
    if (!formData.student_name.trim()) {
      errors.student_name = '学生姓名不能为空'
      return false
    }

    if (formData.student_name.trim().length > 50) {
      errors.student_name = '学生姓名不能超过50个字符'
      return false
    }
  }

  return true
}

// 处理提交
const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    submitting.value = true

    let studentsToAdd = []
    let targetCid = null

    if (batchMode.value) {
      // 批量模式：解析 CSV 格式
      const lines = batchNames.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

      if (lines.length === 0) {
        errors.student_name = '请输入至少一个学生信息'
        return
      }

      // 解析每一行
      const parsedStudents = []
      const parseErrors = []

      lines.forEach((line, index) => {
        // 使用逗号分割，并去除每个部分的空格
        const parts = line.split(',').map(p => p.trim())

        console.log(`第${index + 1}行原始内容:`, line)
        console.log(`第${index + 1}行分割结果:`, parts)

        if (parts.length !== 3) {
          parseErrors.push(`第${index + 1}行格式错误：应为"班级ID,姓名,出勤状态"，当前有${parts.length}个字段`)
          return
        }

        const [cidStr, name, attendanceStr] = parts

        // 验证班级ID
        const cid = parseInt(cidStr)
        if (isNaN(cid) || cid <= 0) {
          parseErrors.push(`第${index + 1}行：班级ID"${cidStr}"必须是正整数`)
          return
        }

        // 验证姓名
        if (!name || name.length === 0) {
          parseErrors.push(`第${index + 1}行：学生姓名不能为空`)
          return
        }

        if (name.length > 50) {
          parseErrors.push(`第${index + 1}行：学生姓名"${name}"不能超过50个字符`)
          return
        }

        // 验证出勤状态
        if (attendanceStr !== '0' && attendanceStr !== '1') {
          parseErrors.push(`第${index + 1}行：出勤状态"${attendanceStr}"必须是0或1`)
          return
        }

        parsedStudents.push({
          cid: cid,
          student_name: name,
          attendance: attendanceStr === '1'
        })

        console.log(`第${index + 1}行解析成功:`, { cid, name, attendance: attendanceStr === '1' })
      })

      console.log('解析结果:', parsedStudents)
      console.log('解析错误:', parseErrors)

      if (parseErrors.length > 0) {
        errors.student_name = parseErrors.join('\n')
        return
      }

      if (parsedStudents.length === 0) {
        errors.student_name = '没有有效的学生信息'
        return
      }

      // 按班级分组
      const studentsByClass = {}
      parsedStudents.forEach(student => {
        if (!studentsByClass[student.cid]) {
          studentsByClass[student.cid] = []
        }
        studentsByClass[student.cid].push({
          student_name: student.student_name,
          attendance: student.attendance
        })
      })

      console.log('按班级分组:', studentsByClass)

      // 为每个班级调用 API
      let successCount = 0
      const addErrors = []

      for (const [cid, students] of Object.entries(studentsByClass)) {
        try {
          console.log(`为班级${cid}添加学生:`, students)
          await StudentAdminService.addStudents(parseInt(cid), students)
          successCount += students.length
        } catch (error) {
          console.error(`班级${cid}添加失败:`, error)
          addErrors.push(`班级${cid}：${error.message}`)
        }
      }

      if (addErrors.length > 0) {
        notificationService.notify(
          `部分添加失败：成功${successCount}个\n${addErrors.join('\n')}`,
          'warning'
        )
      } else {
        notificationService.notify(`成功添加 ${successCount} 个学生`, 'success')
      }

      // 重置表单
      batchNames.value = ''

      // 触发成功事件并关闭模态框
      emit('success')
      return

    } else {
      // 手动模式：使用选择的班级
      targetCid = selectedClassId.value

      studentsToAdd = [{
        student_name: formData.student_name.trim(),
        attendance: formData.attendance
      }]
    }

    // 验证学生数据（手动模式）
    const validation = StudentAdminService.validateStudentData(studentsToAdd)

    if (!validation.isValid) {
      errors.student_name = validation.errors.join('; ')
      return
    }

    // 调用API添加学生（手动模式）
    await StudentAdminService.addStudents(targetCid, validation.validStudents)

    notificationService.notify('添加学生成功', 'success')

    // 重置表单
    formData.student_name = ''
    formData.attendance = true

    // 触发成功事件并关闭模态框
    emit('success')

  } catch (error) {
    console.error('添加学生失败:', error)
    const errorMessage = error.message || '添加学生失败，请稍后重试'
    notificationService.notify(errorMessage, 'error')
    errors.student_name = errorMessage
  } finally {
    submitting.value = false
  }
}

// 处理背景点击
const handleBackdropClick = () => {
  if (!submitting.value) {
    emit('close')
  }
}
</script>

<style scoped>
.mode-switch-group {
  background: rgb(229 231 235); /* gray-200 */
}

.dark .mode-switch-group {
  background: rgb(55 65 81); /* gray-700 */
}

.mode-switch-btn {
  position: relative;
  outline: none;
  border: none;
  cursor: pointer;
  min-width: 80px;
  white-space: nowrap;
}

.mode-switch-btn.active {
  background: linear-gradient(to right, rgb(59 130 246), rgb(147 51 234)); /* blue-500 to purple-600 */
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.mode-switch-btn:not(.active) {
  color: rgb(75 85 99); /* gray-600 */
}

.mode-switch-btn:not(.active):hover {
  color: rgb(31 41 55); /* gray-800 */
}

.dark .mode-switch-btn:not(.active) {
  color: rgb(209 213 219); /* gray-300 */
}

.dark .mode-switch-btn:not(.active):hover {
  color: white;
}
</style>