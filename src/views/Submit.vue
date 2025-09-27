<template>
  <div class="min-h-screen h-screen w-full bg-gray-900 text-gray-200 flex flex-col gap-4 p-4 box-border overflow-hidden">
    <ClassSwitch @update:cid="handleClassChange" />
    <StudentList :cid="selectedCid" ref="studentListComponent" />
    <!-- 引入作业提交组件 -->
    <SubmitHomework :cid="selectedCid" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import StudentList from '@/components/student/StudentList.vue'
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

<style scoped>
</style>
