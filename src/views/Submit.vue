<template>
  <div class="submit-container">
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

<style scoped>
.submit-container {
  min-height: 100vh;
  max-height: 100vh;
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transition: background-color var(--transition-base), color var(--transition-base);
}

/* 自定义滚动条样式 */
.submit-container::-webkit-scrollbar {
  width: 8px;
}

.submit-container::-webkit-scrollbar-track {
  background: var(--color-surface);
  border-radius: 4px;
}

.submit-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.submit-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>
