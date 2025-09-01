<template>
  <div class="student-list-container">
    <div class="students-background">
      <div class="students-row">
        <div
          v-for="student in students"
          :key="student.sid"
          class="student-wrapper"
        >
          <Popup v-if="student.attendance">
            <!-- 触发元素 -->
            <template #reference="{ open }">
              <div
                class="student-card"
                :class="{ selected: selectedEvents[student.sid] }"
                @click="handleStudentClick(student)"
                @mouseenter="open"
              >
                {{ student.student_name }}
              </div>
            </template>

            <!-- 弹窗内容 -->
            <div class="popover-content">
              <button
                class="event-btn personal"
                @click="setEvent(student.sid, 'personal')"
              >
                事假
              </button>
              <button
                class="event-btn sick"
                @click="setEvent(student.sid, 'sick')"
              >
                病假
              </button>
              <button
                class="event-btn official"
                @click="setEvent(student.sid, 'official')"
              >
                公假
              </button>
            </div>
          </Popup>

          <div v-else
            class="student-card absent"
            :class="{ selected: selectedEvents[student.sid] }"
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
    const res = await StudentService.getStudentList(props.cid)
    const analysis = await AnalysisService.getTodayAnalysis(props.cid)
    const existingEvents = {}

    if (analysis.data?.data.event_list) {
      analysis.data.data.event_list.forEach(e => {
        const student = res.data.data.find(s => s.student_name === e.student_name)
        if (student) existingEvents[student.sid] = e.event_type
      })
    }

    students.value = res.data.data.map(s => ({ ...s }))
    selectedEvents.value = { ...existingEvents }
  } catch (err) {
    console.error(err)
    notificationService.notify('获取学生列表失败', 'error')
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
    await StudentService.submitStudentEvents(eventsArray)
    notificationService.notify('提交成功', 'success')
    await fetchStudents()
  } catch {
    notificationService.notify('提交失败', 'error')
  } finally {
    loading.value = false
  }
}

watch(() => props.cid, fetchStudents, { immediate: true })
defineExpose({ fetchStudents })
</script>

<style scoped>
.student-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.students-background {
  width: 100%;
  max-width: 85%;
  padding: 16px;
  border-radius: 12px;
  background-color: #1e1e1e;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.05) 4px,
    transparent 4px,
    transparent 8px
  );
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  /* 高度控制 */
  max-height: 60vh;        /* 最大高度为页面高度的60% */
  height: auto;             /* 内容少时自动缩小 */
  overflow-x: auto;         /* 横向滚动 */
  overflow-y: auto;         /* 超过高度时纵向滚动 */
}

/* 学生水平排列 */
.students-row {
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
  padding-bottom: 8px;
}

/* 学生卡片容器 */
.student-wrapper {
  position: relative;
  flex: 0 0 auto; /* 不缩放 */
}

/* 学生卡片 */
.student-card {
  padding: 12px 16px;
  min-width: 80px;
  text-align: center;
  border-radius: 8px;
  background-color: #2d2d2d;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.student-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.student-card.absent {
  background-color: #555;
  color: #aaa;
}

.student-card.selected {
  border: 2px solid #9ed2ff;
}

/* 弹窗内容 */
.popover-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.event-btn {
  padding: 6px 0;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.event-btn.personal { 
  background-color: #3b82f6; 
}

.event-btn.sick { 
  background-color: #22c55e; 
}

.event-btn.official { 
  background-color: #f59e0b; 
}

/* 提交按钮 */
.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>
