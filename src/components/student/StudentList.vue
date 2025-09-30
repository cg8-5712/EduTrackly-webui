<template>
  <div class="flex flex-col items-center">
    <div class="w-full max-w-[85%] p-4 rounded-xl bg-gray-900 min-h-[30vh] shadow-2xl max-h-[60vh] h-auto overflow-x-auto overflow-y-auto">
      <div class="flex gap-4 flex-nowrap pb-2">
        <div
          v-for="student in students"
          :key="student.sid"
          class="relative flex-none"
        >
          <Popup v-if="student.attendance">
            <!-- 触发元素 -->
            <template #reference="{ open }">
              <div
                class="py-3 px-4 min-w-20 text-center rounded-lg bg-gray-700 text-gray-200 cursor-pointer transition-all duration-200 select-none shadow-md hover:scale-105 hover:shadow-lg"
                :class="{ 'border-2 border-blue-300': selectedEvents[student.sid] }"
                @click="handleStudentClick(student)"
                @mouseenter="open"
              >
                {{ student.student_name }}
              </div>
            </template>

            <!-- 弹窗内容 -->
            <div class="flex flex-col gap-2 min-w-30">
              <button
                class="py-1.5 px-0 border-none rounded bg-blue-500 text-white cursor-pointer"
                @click="setEvent(student.sid, 'personal')"
              >
                事假
              </button>
              <button
                class="py-1.5 px-0 border-none rounded bg-green-500 text-white cursor-pointer"
                @click="setEvent(student.sid, 'sick')"
              >
                病假
              </button>
              <button
                class="py-1.5 px-0 border-none rounded bg-amber-500 text-white cursor-pointer"
                @click="setEvent(student.sid, 'official')"
              >
                公假
              </button>
            </div>
          </Popup>

          <div v-else
            class="py-3 px-4 min-w-20 text-center rounded-lg bg-gray-600 text-gray-400 cursor-pointer transition-all duration-200 select-none shadow-md hover:scale-105 hover:shadow-lg"
            :class="{ 'border-2 border-blue-300': selectedEvents[student.sid] }"
            @click="handleStudentClick(student)"
          >
            {{ student.student_name }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-3">
      <button class="py-2 px-4 border-none rounded-md bg-blue-500 text-white font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" @click="submitEvents" :disabled="loading">
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
    const res = await StudentService.getStudentListAll(props.cid)
    const analysis = await AnalysisService.getTodayAnalysis(props.cid)
    const existingEvents = {}

    if (analysis.data?.data.event_list) {
      analysis.data.data.event_list.forEach(e => {
        const student = res.data?.find(s => s.student_name === e.student_name)
        if (student) existingEvents[student.sid] = e.event_type
      })
    }

    students.value = (res.data || []).map(s => ({ ...s }))
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
</style>
