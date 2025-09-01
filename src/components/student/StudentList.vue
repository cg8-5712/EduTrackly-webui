<template>
  <div class="student-list-container">
    <div class="students-grid">
      <el-popover
        v-for="student in students"
        :key="student.sid"
        placement="top"
        :trigger="student.attendance ? 'hover' : 'click'"
        :width="160"
        :show-arrow="true"
        popper-class="student-popover"
      >
        <div v-if="student.attendance" class="popover-content">
          <el-button
            size="small"
            type="primary"
            @click="setEvent(student.sid, 'personal')"
          >
            事假
          </el-button>
          <el-button
            size="small"
            type="success"
            @click="setEvent(student.sid, 'sick')"
          >
            病假
          </el-button>
          <el-button
            size="small"
            type="warning"
            @click="setEvent(student.sid, 'official')"
          >
            公假
          </el-button>
        </div>
        <template #reference>
          <div
            class="student-card"
            :class="{
              absent: !student.attendance,
              selected: selectedEvents[student.sid]
            }"
            @click="handleStudentClick(student)"
          >
            {{ student.student_name }}
          </div>
        </template>
      </el-popover>
    </div>

    <div class="submit-container">
      <el-button type="primary" @click="submitEvents" :loading="loading">
        提交
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import StudentService from '@/services/basic/student'
import { ElButton, ElPopover, ElMessage } from 'element-plus'

const props = defineProps({
  cid: {
    type: Number,
    required: true
  }
})

const students = ref([])
const selectedEvents = ref({})
const loading = ref(false)

// 设置学生事件
const setEvent = (sid, event_type) => {
  selectedEvents.value[sid] = event_type
}

// 提交所有事件
const submitEvents = async () => {
  const eventsArray = Object.entries(selectedEvents.value).map(([sid, event_type]) => ({
    sid: Number(sid),
    event_type
  }))
  if (eventsArray.length === 0) {
    return ElMessage({ type: 'warning', message: '没有需要提交的事件' })
  }
  try {
    loading.value = true
    await StudentService.submitStudentEvents(eventsArray)
    ElMessage({ type: 'success', message: '提交成功' })
    // 提交后刷新列表
    await fetchStudents()
  } catch (err) {
    ElMessage({ type: 'error', message: '提交失败' })
  } finally {
    loading.value = false
  }
}

// 处理学生点击事件
const handleStudentClick = (student) => {
  if (!student.attendance) {
    setEvent(student.sid, 'temp')
  }
}

// 获取学生列表
const fetchStudents = async () => {
  console.log('fetching students for cid:', props.cid) // 添加日志便于调试
  if (!props.cid) return
  try {
    loading.value = true
    const res = await StudentService.getStudentList(props.cid)
    students.value = res.data.data.map(s => ({
      ...s
    }))
    selectedEvents.value = {}
  } catch (err) {
    console.error('获取学生列表失败', err)
    ElMessage.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

// 移除 onMounted 中的 watch，直接使用 watch
watch(
  () => props.cid,
  async (newVal, oldVal) => {
    console.log('StudentList watching cid change:', newVal, oldVal)
    if (newVal !== oldVal) {
      await fetchStudents()
    }
  },
  { immediate: true }
)


// 导出fetchStudents方法供父组件调用
defineExpose({
  fetchStudents
})
</script>

<style scoped>
.student-list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.student-card {
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  background-color: #2d2d2d;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.student-card:hover {
  transform: scale(1.05);
}

.student-card.absent {
  background-color: #555;
  color: #aaa;
}

.student-card.selected {
  border: 2px solid #9ed2ff;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.student-popover) {
  background-color: #363636;
  border: 1px solid #4c4c4c;
}

:deep(.student-popover .el-button) {
  width: 100%;
}

:deep(.el-popover__title) {
  color: #e0e0e0;
}
</style>
