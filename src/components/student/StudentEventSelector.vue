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
    console.log(`[StudentEventSelector] 开始加载班级 ${props.cid} 的学生列表和今日事件`)

    // 并行请求学生列表和今日分析数据
    const [res, analysis] = await Promise.all([
      StudentService.getStudentListAll(props.cid),
      AnalysisService.getTodayAnalysis(props.cid)
    ])

    console.log(`[StudentEventSelector] 获取到 ${res.data?.length || 0} 个学生`)
    console.log(`[StudentEventSelector] 今日分析数据:`, analysis.data)
    console.log(`[StudentEventSelector] 今日事件列表:`, analysis.data?.event_list)

    const existingEvents = {}

    // 处理今日已有的事件记录
    if (analysis.data?.event_list && Array.isArray(analysis.data.event_list)) {
      analysis.data.event_list.forEach(e => {
        const student = res.data?.find(s => s.student_name === e.student_name)
        if (student) {
          existingEvents[student.sid] = e.event_type
          console.log(`[StudentEventSelector] 学生 ${student.student_name}(sid:${student.sid}) 今日事件: ${e.event_type}`)
        } else {
          console.warn(`[StudentEventSelector] 今日事件中的学生 ${e.student_name} 未在学生列表中找到`)
        }
      })
    }

    // 为每个学生设置attendance字段（如果后端未返回）
    // attendance为true表示学生应该在校（正常在校学生，可以设置请假事件）
    // attendance为false表示学生不应在校（临时参加的学生，不能请假）
    students.value = (res.data || []).map(s => ({
      ...s,
      // 如果后端返回了attendance字段则使用，否则默认为true
      attendance: s.attendance !== undefined ? s.attendance : true
    }))

    // 设置已有的事件状态
    selectedEvents.value = { ...existingEvents }

    console.log(`[StudentEventSelector] 加载完成: ${students.value.length} 个学生`)
    console.log(`[StudentEventSelector] 其中有状态的学生数: ${students.value.filter(s => s.attendance).length}`)
    console.log(`[StudentEventSelector] 已设置事件的学生数: ${Object.keys(existingEvents).length}`)
    console.log(`[StudentEventSelector] 当前选中的事件:`, selectedEvents.value)
  } catch (err) {
    console.error('[StudentEventSelector] 获取学生列表失败:', err)
    notificationService.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

const submitEvents = async () => {
  // 构建所有学生的事件数组，包括没有事件的学生（event_type为空字符串）
  const eventsArray = students.value.map(s => ({
    sid: s.sid,
    event_type: selectedEvents.value[s.sid] || ''
  }))

  console.log('[StudentEventSelector] 准备提交事件')
  console.log(`[StudentEventSelector] 总学生数: ${students.value.length}`)
  console.log(`[StudentEventSelector] 有事件的学生数: ${eventsArray.filter(e => e.event_type).length}`)
  console.log('[StudentEventSelector] 提交数据:', eventsArray)

  try {
    loading.value = true
    const today = formatDateToYYYYMMDD(new Date())
    console.log(`[StudentEventSelector] 提交日期: ${today}`)

    await StudentService.submitStudentEvents(eventsArray, today)
    notificationService.success('提交成功')

    // 提交成功后重新加载学生列表，确保显示最新状态
    console.log('[StudentEventSelector] 提交成功，重新加载学生列表')
    await fetchStudents()
  } catch (error) {
    console.error('[StudentEventSelector] 提交学生事件失败:', error)
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
