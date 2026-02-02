<template>
  <div class="event-selector-wrapper">
    <div class="students-container">
      <div class="students-scroll">
        <div
          v-for="student in students"
          :key="student.sid"
          class="student-item"
        >
          <Popup v-if="student.attendance">
            <!-- 触发元素 -->
            <template #reference="{ open }">
              <div
                class="student-card active"
                :class="{ 'selected': selectedEvents[student.sid] }"
                @click="handleStudentClick(student)"
                @mouseenter="open"
              >
                {{ student.student_name }}
              </div>
            </template>

            <!-- 弹窗内容 -->
            <div class="event-options">
              <button
                class="event-button personal"
                @click="setEvent(student.sid, 'personal')"
              >
                事假
              </button>
              <button
                class="event-button sick"
                @click="setEvent(student.sid, 'sick')"
              >
                病假
              </button>
              <button
                class="event-button official"
                @click="setEvent(student.sid, 'official')"
              >
                公假
              </button>
            </div>
          </Popup>

          <div v-else
            class="student-card inactive"
            :class="{ 'selected': selectedEvents[student.sid] }"
            @click="handleStudentClick(student)"
          >
            {{ student.student_name }}
          </div>
        </div>
      </div>
    </div>

    <div class="submit-container">
      <button class="submit-btn" @click="submitEvents" :disabled="loading">
        {{ loading ? '提交中...' : '提交' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Popup from '@/components/common/popup.vue'
import StudentService from '@/services/basic/student'
import AnalysisService from '@/services/basic/analysis'
import notificationService from '@/services/common/notification'
import { formatDateToYYYYMMDD } from '@/utils/formatDate.js'

const props = defineProps({ cid: Number })
const students = ref([])
const selectedEvents = ref({})
const loading = ref(false)

const setEvent = (sid, type) => {
  if (selectedEvents.value[sid] === type) delete selectedEvents.value[sid]
  else selectedEvents.value[sid] = type
}

const handleStudentClick = (student) => {
  if (!student.attendance) {
    if (selectedEvents.value[student.sid] === 'temp') delete selectedEvents.value[student.sid]
    else selectedEvents.value[student.sid] = 'temp'
  } else {
    if (selectedEvents.value[student.sid]) delete selectedEvents.value[student.sid]
    else selectedEvents.value[student.sid] = 'personal'
  }
}

const fetchStudents = async () => {
  if (!props.cid) return
  try {
    loading.value = true
    // 并行请求学生列表和今日分析数据
    const [res, analysis] = await Promise.all([
      StudentService.getStudentListAll(props.cid),
      AnalysisService.getTodayAnalysis(props.cid)
    ])
    const existingEvents = {}

    if (analysis.data?.data?.event_list) {
      analysis.data.data.event_list.forEach(e => {
        const student = res.data?.find(s => s.student_name === e.student_name)
        if (student) existingEvents[student.sid] = e.event_type
      })
    }

    students.value = (res.data || []).map(s => ({ ...s }))
    selectedEvents.value = { ...existingEvents }
  } catch (err) {
    console.error(err)
    notificationService.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

const submitEvents = async () => {
  const eventsArray = students.value.map(s => ({
    sid: s.sid,
    event_type: selectedEvents.value[s.sid] || ''
  }))
  try {
    loading.value = true
    const today = formatDateToYYYYMMDD(new Date())
    await StudentService.submitStudentEvents(eventsArray, today)
    notificationService.success('提交成功')
    await fetchStudents()
  } catch (error) {
    console.error('提交学生事件失败:', error)
    notificationService.error('提交失败')
  } finally {
    loading.value = false
  }
}

watch(() => props.cid, fetchStudents, { immediate: true })
defineExpose({ fetchStudents })
</script>

<style scoped>
.event-selector-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.students-container {
  width: 100%;
  max-width: 85%;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  min-height: 30vh;
  max-height: 60vh;
  box-shadow: var(--shadow-xl);
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.students-scroll {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 0.5rem;
}

.student-item {
  position: relative;
}

.student-card {
  padding: 0.75rem 1rem;
  min-width: 80px;
  text-align: center;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
}

.student-card.active {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.student-card.inactive {
  background-color: var(--color-border);
  color: var(--color-text-tertiary);
}

.student-card:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.student-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary);
}

.event-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 120px;
}

.event-button {
  padding: 0.5rem 0;
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.event-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.event-button.personal {
  background-color: #3b82f6;
}

.event-button.personal:hover {
  background-color: #2563eb;
}

.event-button.sick {
  background-color: #10b981;
}

.event-button.sick:hover {
  background-color: #059669;
}

.event-button.official {
  background-color: #f59e0b;
}

.event-button.official:hover {
  background-color: #d97706;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
}

.submit-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 自定义滚动条 */
.students-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.students-container::-webkit-scrollbar-track {
  background: var(--color-background);
  border-radius: 4px;
}

.students-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.students-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .students-container {
    max-width: 95%;
  }

  .student-card {
    padding: 0.5rem 0.75rem;
    min-width: 60px;
    font-size: 0.875rem;
  }
}
</style>
