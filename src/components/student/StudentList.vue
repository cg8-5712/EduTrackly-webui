<template>
  <div class="student-list-container">
    <div class="students-grid">
      <el-popover
        v-for="student in students"
        :key="student.sid"
        placement="top"
        trigger="click"
        width="120"
      >
        <div v-if="student.attendance">
          <el-button
            size="mini"
            type="primary"
            @click="setEvent(student.sid, 'personal')"
          >
            事假
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="setEvent(student.sid, 'sick')"
          >
            病假
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="setEvent(student.sid, 'official')"
          >
            公假
          </el-button>
        </div>
        <div v-else>
          <el-button
            size="mini"
            type="info"
            @click="setEvent(student.sid, 'temp')"
          >
            临时参加
          </el-button>
        </div>
        <template #reference>
          <div
            class="student-card"
            :class="{ absent: !student.attendance, selected: selectedEvents[student.sid] }"
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
import { ElButton, ElPopover } from 'element-plus'

const props = defineProps({
  cid: {
    type: Number,
    required: true
  }
})

const students = ref([])
const selectedEvents = ref({})
const loading = ref(false)

// 获取学生列表
const fetchStudents = async () => {
  if (!props.cid) return
  try {
    loading.value = true
    const res = await StudentService.getStudentList(props.cid)
    students.value = res.data.data.map(s => ({
      ...s
    }))
    selectedEvents.value = {} // 清空上次选择
  } catch (err) {
    console.error('获取学生列表失败', err)
  } finally {
    loading.value = false
  }
}

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

// 监听cid变化自动刷新
watch(() => props.cid, fetchStudents, { immediate: true })
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
</style>
