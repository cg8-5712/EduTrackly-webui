<template>
  <div class="submit-container">
    <!-- 班级选择 -->
    <ClassSwitch v-model:selectedCid="selectedCid" />

    <!-- 学生列表 -->
    <StudentList :cid="selectedCid" ref="studentListComponent" />

    <!-- 提交按钮 -->
    <div class="submit-button-wrapper">
      <el-button type="primary" @click="submitEvents">
        提交今日事件
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import StudentList from '@/components/student/StudentList.vue'

// 选中的班级ID
const selectedCid = ref(1) // 默认1班

// ref StudentList组件
const studentListComponent = ref(null)

// 点击提交按钮
const submitEvents = async () => {
  if (!studentListComponent.value) return
  try {
    await studentListComponent.value.submitSelectedEvents()
    // 提交成功可做提示
    ElMessage.success('提交成功')
  } catch (err) {
    ElMessage.error(err.message || '提交失败')
  }
}
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
