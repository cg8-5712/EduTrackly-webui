<template>
  <div class="submit-container">
    <!-- 使用 update:cid 而不是 update:selectedCid -->
    <ClassSwitch @update:cid="handleClassChange" />
    <StudentList :cid="selectedCid" ref="studentListComponent" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import StudentList from '@/components/student/StudentList.vue'

// 选中的班级ID
const selectedCid = ref(1) // 默认1班

// ref StudentList组件
const studentListComponent = ref(null)

// 处理班级变化
const handleClassChange = (newCid) => {
  console.log('Class changed:', newCid)
  selectedCid.value = newCid
}

// 移除 onMounted 中的 watch，改用普通的 watch
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.submit-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
