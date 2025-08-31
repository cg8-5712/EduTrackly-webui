<template>
  <div class="homework-container">
    <!-- 作业内容展示 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>
    <div v-else-if="error && error !== 'no-homework'" class="error">
      {{ error }}
    </div>
    <div v-else class="homework-content">
      {{ homework }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import HomeworkService from '@/services/basic/homework'

const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  }
})

const homework = ref('')
const loading = ref(false)
const error = ref(null)

const fetchHomework = async () => {
  loading.value = true
  error.value = null
  homework.value = ''

  try {
    const response = props.selectedDate
        ? await HomeworkService.getHomeworkByDate(1, props.selectedDate)
        : await HomeworkService.getTodayHomework(1)

    console.log(response.data.code)

    // 处理2001错误码
    if (response.data.code === 2001) {
      homework.value = '暂无作业'
      error.value = 'no-homework'
      return
    }

    // 处理其他错误码
    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }

    homework.value = response.data.data || '暂无作业'
  } catch (err) {
    error.value = err.message || '获取作业失败'
  } finally {
    loading.value = false
  }
}

watch(() => props.selectedDate, () => {
  fetchHomework()
}, { immediate: true })
</script>

<style scoped>
.homework-container {
  font-size: 2rem; /* 增大字体 */
  line-height: 1.6;
  padding: 1rem;
}

.homework-content {
  white-space: pre-wrap;
  color: #e0e0e0;
  font-weight: 500;
}

.loading {
  color: #9ed2ff;
  text-align: center;
  font-size: 1.75rem;
}

.error {
  color: #ff6b6b;
  text-align: center;
  font-size: 1.75rem;
}
</style>