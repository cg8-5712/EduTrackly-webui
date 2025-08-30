<!-- src/views/Homework.vue -->
<template>
  <div class="p-4">
    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <LoadingSpinner />
    </div>

    <!-- 出错提示 -->
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <!-- 正常展示作业 -->
    <div v-else-if="homework" class="space-y-2">
      <h2 class="text-xl font-semibold">
        {{ homework.class_name }}
        <span class="ml-2 text-gray-500 text-sm">
          截止 {{ new Date(homework.due_date).toLocaleDateString() }}
        </span>
      </h2>
      <p class="text-base">
        {{ homework.homework_content }}
      </p>
    </div>

    <!-- 没有数据 -->
    <div v-else class="text-gray-400">
      暂无作业信息
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomeworkService from '@/services/basic/homework'

const homework = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await HomeworkService.getTodayHomework(1)
    homework.value = res.data.data
  } catch (err) {
    error.value = err.message || '获取作业失败'
  } finally {
    loading.value = false
  }
})
</script>
