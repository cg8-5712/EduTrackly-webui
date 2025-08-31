<!-- homework.vue -->
<template>
  <div class="homework-container">
    <!-- 作业内容展示 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>
    <div v-else-if="error" class="error">
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

console.log(props.selectedDate)

const homework = ref('')
const loading = ref(false)
const error = ref(null)

const fetchHomework = async () => {
  loading.value = true
  error.value = null

  try {
    console.log(props.selectedDate)
    const response = props.selectedDate
        ? await HomeworkService.getHomeworkByDate(1, props.selectedDate)
        : await HomeworkService.getTodayHomework(1)

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
  font-size: 1.5rem;
  line-height: 1.6;
}

.homework-content {
  white-space: pre-wrap;
  color: #e0e0e0;
}

.loading {
  color: #9ed2ff;
  text-align: center;
  font-size: 1.25rem;
}

.error {
  color: #ff6b6b;
  text-align: center;
}
</style>