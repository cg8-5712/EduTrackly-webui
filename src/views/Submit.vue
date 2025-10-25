<template>
  <div class="min-h-screen max-h-screen w-full bg-background text-text-primary flex flex-col gap-4 p-4 box-border overflow-y-auto overflow-x-hidden transition-colors duration-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-text-tertiary">
    <ClassSwitch @update:cid="handleClassChange" />
    <StudentEventSelector :cid="selectedCid" ref="studentListComponent" />
    <!-- 引入作业提交组件 -->
    <SubmitHomework :cid="selectedCid" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import StudentEventSelector from '@/components/student/StudentEventSelector.vue'
import SubmitHomework from '@/components/homework/SubmitHomework.vue' // 引入组件

// 选中的班级ID
const selectedCid = ref(1) // 默认1班

// ref StudentList组件
const studentListComponent = ref(null)

// 处理班级变化
const handleClassChange = (newCid) => {
  console.log('Class changed:', newCid)
  selectedCid.value = newCid
}

// watch selectedCid，班级变化时刷新学生列表
watch(
    selectedCid,
    async (newVal) => {
      console.log('Selected CID changed:', newVal)
      if (studentListComponent.value) {
        await studentListComponent.value.fetchStudents()
      }
    },
    { immediate: true }
)
</script>
