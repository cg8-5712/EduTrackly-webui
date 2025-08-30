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

        <!-- 判断是否是今天，如果不是今天，显示截止日期 -->
        <span class="ml-2 text-gray-500 text-sm" v-if="!isToday(homework.due_date)">
          截止 {{ formatYYYYMMDDToDate(homework.due_date) }}
        </span>
      </h2>

      <!-- 显示作业内容 -->
      <div class="homework-content" v-html="formattedContent"></div>
    </div>

    <!-- 没有数据 -->
    <div v-else class="text-gray-400">
      暂无作业信息
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import HomeworkService from '@/services/basic/homework'
import formatYYYYMMDDToDate from '@/utils/formatDate'

const homework = ref(null)
const loading = ref(true)
const error = ref(null)
let formattedContent = ''

// 判断日期是否是今天
const isToday = (dueDate) => {
  const today = new Date()

  // 将日期格式化为 'YYYY-MM-DD'，方便比较
  const todayFormatted = today.toISOString().split('T')[0].replace(/-/g, '')
  const dueDateFormatted = homework.value.due_date.toString()

  console.log(todayFormatted, dueDateFormatted)
  console.log(todayFormatted===dueDateFormatted)

  return todayFormatted === dueDateFormatted
}

onMounted(async () => {
  try {
    const res = await HomeworkService.getTodayHomework(1)
    homework.value = res.data.data

    // 格式化作业内容，处理换行符
    formattedContent = computed(() => {
      return homework.value.homework_content.replace(/\n/g, '<br>')
    })

  } catch (err) {
    error.value = err.message || '失败'
  } finally {
    loading.value = false
  }
})
</script>
