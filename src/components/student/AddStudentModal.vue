<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click="handleBackdropClick">
    <!-- 模态框内容 -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">添加学生</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-800 transition-colors duration-200"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">
              目标班级 <span class="text-red-600">*</span>
            </label>
            <select
              v-model="selectedClassId"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none"
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
            <p v-if="errors.class_id" class="text-red-600 text-sm mt-1">
              {{ errors.class_id }}
            </p>
          </div>

          <!-- 学生姓名（仅手动模式显示） -->
          <div v-if="!batchMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              学生姓名 <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.student_name"
              type="text"
              placeholder="请输入学生姓名"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              :class="{ 'border-red-500': errors.student_name }"
              required
            />
            <p v-if="errors.student_name" class="text-red-600 text-sm mt-1">
              {{ errors.student_name }}
            </p>
          </div>

          <!-- 初始出勤状态（仅手动模式显示） -->
          <div v-if="!batchMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
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
                <span class="text-green-600">在校</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.attendance"
                  type="radio"
                  :value="false"
                  class="mr-2 text-red-500"
                />
                <span class="text-red-600">离校</span>
              </label>
            </div>
          </div>

          <!-- 批量添加文本框（仅批量模式显示） -->
          <div v-if="batchMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              批量输入学生信息 <span class="text-red-600">*</span>
            </label>

            <!-- 文件上传区域 -->
            <div class="mb-3">
              <div class="flex items-center gap-2">
                <label
                  class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg cursor-pointer transition-colors duration-200 border border-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>选择文件</span>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".txt,.csv,.xlsx,.xls"
                    @change="handleFileUpload"
                    class="hidden"
                  />
                </label>
                <span v-if="uploadedFileName" class="text-sm text-gray-600">
                  {{ uploadedFileName }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                支持上传 .txt、.csv 或 .xlsx/.xls 文件（每行格式：班级ID,姓名,出勤状态）
              </p>
            </div>

            <textarea
              v-model="batchNames"
              placeholder="CSV格式，每行一个学生，格式：班级ID,姓名,出勤状态&#10;例如：&#10;1,张三,1&#10;1,李四,0&#10;2,王五,1&#10;&#10;出勤状态：1=在校，0=离校"
              rows="10"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none font-mono"
              :class="{ 'border-red-500': errors.student_name }"
            ></textarea>
            <p class="text-sm text-gray-600 mt-1">
              CSV格式：班级ID,姓名,出勤状态（1=在校，0=离校）
            </p>
            <p v-if="errors.student_name" class="text-red-600 text-sm mt-1">
              {{ errors.student_name }}
            </p>
          </div>
        </form>
      </div>

      <!-- 模态框底部 -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
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
import * as XLSX from 'xlsx'
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
const fileInput = ref(null)
const uploadedFileName = ref('')

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

// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }

  // 检查文件类型
  const fileName = file.name.toLowerCase()
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
  const isTextOrCsv = fileName.endsWith('.txt') || fileName.endsWith('.csv')

  if (!isExcel && !isTextOrCsv) {
    notificationService.notify('仅支持上传 .txt、.csv、.xlsx 或 .xls 文件', 'error')
    // 清空文件输入
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    return
  }

  // 检查文件大小（限制为 5MB）
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    notificationService.notify('文件大小不能超过 5MB', 'error')
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    return
  }

  try {
    uploadedFileName.value = file.name

    if (isExcel) {
      // 处理 Excel 文件
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })

          // 获取第一个工作表
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]

          // 将工作表转换为 CSV 格式
          const csvData = XLSX.utils.sheet_to_csv(worksheet, { FS: ',', RS: '\n' })

          // 处理 CSV 数据，移除可能的表头行
          const lines = csvData.split('\n').filter(line => line.trim())

          // 检测是否有表头（第一行包含中文字符或"班级"、"姓名"等关键字）
          let startIndex = 0
          if (lines.length > 0) {
            const firstLine = lines[0].toLowerCase()
            if (firstLine.includes('班级') || firstLine.includes('姓名') || firstLine.includes('出勤') ||
                firstLine.includes('class') || firstLine.includes('name') || firstLine.includes('attendance')) {
              startIndex = 1 // 跳过表头
              notificationService.notify('检测到表头行，已自动跳过', 'info')
            }
          }

          // 获取数据行
          const dataLines = lines.slice(startIndex)

          // 填充到文本框
          batchNames.value = dataLines.join('\n')

          notificationService.notify(`成功加载 Excel 文件: ${file.name}，共 ${dataLines.length} 行数据`, 'success')

          // 清空错误信息
          errors.student_name = ''
        } catch (error) {
          console.error('解析 Excel 文件错误:', error)
          notificationService.notify('解析 Excel 文件失败，请检查文件格式', 'error')
          uploadedFileName.value = ''
        }
      }

      reader.onerror = () => {
        notificationService.notify('读取 Excel 文件失败', 'error')
        uploadedFileName.value = ''
      }

      // 以 ArrayBuffer 形式读取文件
      reader.readAsArrayBuffer(file)

    } else {
      // 处理文本文件（.txt 或 .csv）
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result

        // 处理文件内容
        let processedContent = content

        // 如果是 CSV 文件，尝试智能处理常见格式
        if (fileName.endsWith('.csv')) {
          // 移除 BOM 标记（如果有）
          processedContent = processedContent.replace(/^\uFEFF/, '')

          // 尝试检测并转换常见的错误分隔符
          const lines = processedContent.split('\n')
          const processedLines = lines.map(line => {
            line = line.trim()
            if (!line) return line

            // 如果已经使用英文逗号且格式正确，直接返回
            if (line.split(',').length === 3) {
              return line
            }

            // 尝试转换中文逗号
            if (line.includes('，')) {
              return line.replace(/，/g, ',')
            }

            return line
          })

          processedContent = processedLines.join('\n')
        }

        // 将内容填充到文本框
        batchNames.value = processedContent.trim()

        notificationService.notify(`成功加载文件: ${file.name}`, 'success')

        // 清空错误信息
        errors.student_name = ''
      }

      reader.onerror = () => {
        notificationService.notify('读取文件失败', 'error')
        uploadedFileName.value = ''
      }

      // 以文本形式读取文件
      reader.readAsText(file, 'UTF-8')
    }

  } catch (error) {
    console.error('文件上传错误:', error)
    notificationService.notify('文件上传失败', 'error')
    uploadedFileName.value = ''
  }
}

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
          // 检测常见的分隔符错误
          let errorDetail = `第${index + 1}行格式错误：应为"班级ID,姓名,出勤状态"，当前有${parts.length}个字段`

          // 检测是否使用了中文逗号
          if (line.includes('，')) {
            errorDetail += '（检测到中文逗号"，"，请使用英文逗号","）'
          }
          // 检测是否使用了空格作为分隔符
          else if (line.includes(' ') || line.includes('\t')) {
            const spaceCount = (line.match(/ /g) || []).length
            const tabCount = (line.match(/\t/g) || []).length
            if (spaceCount > 0) {
              errorDetail += '（检测到空格分隔符，请使用英文逗号","）'
            } else if (tabCount > 0) {
              errorDetail += '（检测到制表符Tab分隔符，请使用英文逗号","）'
            }
          }
          // 检测是否使用了分号
          else if (line.includes(';') || line.includes('；')) {
            if (line.includes('；')) {
              errorDetail += '（检测到中文分号"；"，请使用英文逗号","）'
            } else {
              errorDetail += '（检测到分号";"，请使用英文逗号","）'
            }
          }
          // 检测是否使用了竖线
          else if (line.includes('|')) {
            errorDetail += '（检测到竖线"|"，请使用英文逗号","）'
          }

          parseErrors.push(errorDetail)
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