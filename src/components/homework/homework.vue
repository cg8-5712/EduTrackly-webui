<template>
  <div class="homework-wrapper">
    <!-- 加载中 -->
    <div v-if="loading" class="homework-container">
      加载中...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error && error !== 'no-homework'" class="homework-container">
      {{ error }}
    </div>

    <!-- 作业内容展示 -->
    <template v-else>
      <!-- 如果返回是字符串说明暂无作业 -->
      <div v-if="typeof homework === 'string'" class="homework-container">
        {{ homework }}
      </div>
      <!-- 如果返回对象则显示作业内容 -->
      <template v-else>
        <div v-for="(line, index) in homeworkLines" 
             :key="index" 
             class="homework-container"
             :class="{ 'empty-line': !line.trim() }">
          {{ line || '&nbsp;' }}
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import HomeworkService from '@/services/basic/homework'

// Props：选中日期 + 选中班级
const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  },
  selectedCid: {
    type: Number,
    default: 1
  }
})

// 作业数据与状态
const homework = ref('')
const loading = ref(false)
const error = ref(null)

// 获取作业函数
const fetchHomework = async () => {
  loading.value = true
  error.value = null
  homework.value = ''

  try {
    const response = props.selectedDate
      ? await HomeworkService.getHomeworkByDate(props.selectedCid, props.selectedDate)
      : await HomeworkService.getTodayHomework(props.selectedCid)

    // 处理无作业
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

// 监听日期或班级变化，立即执行
watch(
  () => [props.selectedDate, props.selectedCid],
  () => {
    fetchHomework()
  },
  { immediate: true }
)

// 新增计算属性处理换行
const homeworkLines = computed(() => {
  if (!homework.value?.homework_content) return [];
  return homework.value.homework_content.split('\n');
});
</script>

<style scoped>
.homework-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.homework-container {
  padding: 1rem;
  background-color: #2d2d2d;
  color: #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-line {
  min-height: 20px;
  background-color: transparent;
  box-shadow: none;
}

.loading {
  font-size: 1.25rem;
  color: #9ed2ff;
}

.error {
  font-size: 1.25rem;
  color: #ff6b6b;
}

.homework-content {
  font-size: 1.25rem;
  color: #e0e0e0;
  word-break: break-word;
}
</style>
