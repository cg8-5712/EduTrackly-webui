<template>
  <div class="flex flex-col gap-4">
    <!-- 加载中 -->
    <div v-if="loading" class="p-4 bg-gray-700 text-gray-200 rounded-xl shadow-lg flex text-3xl font-extrabold text-blue-300">
      加载中...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error && error !== 'no-homework'" class="p-4 bg-gray-700 text-gray-200 rounded-xl shadow-lg flex text-3xl font-extrabold text-red-400">
      {{ error }}
    </div>

    <!-- 作业内容展示 -->
    <template v-else>
      <!-- 如果无作业数据 -->
      <div v-if="error === 'no-homework'" class="p-4 bg-gray-700 text-gray-200 rounded-xl shadow-lg flex text-3xl font-extrabold">
        暂无作业
      </div>
      <!-- 显示分科目作业内容 -->
      <template v-else>
        <div class="grid gap-4" :style="gridStyle">
          <div v-for="subject in subjectsWithContent"
               :key="subject.key"
               class="p-4 bg-gray-700 text-gray-200 rounded-xl shadow-lg flex text-3xl font-extrabold">
            <div class="text-lg font-bold text-blue-300 min-w-15 flex-shrink-0 text-center py-2 px-2 bg-blue-300/10 rounded-lg border border-blue-300/20">
              {{ subject.name }}
            </div>
            <div class="flex-1 flex flex-col gap-1 pt-2 pl-3">
              <div v-for="(line, index) in subject.lines"
                   :key="index"
                   class="text-xl leading-relaxed text-gray-200 break-words">
                {{ line }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import HomeworkService from '@/services/basic/homework'

// Props：选中日期 + 选中班级 + 列数（默认值为 1）
const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  },
  selectedCid: {
    type: Number,
    default: 1
  },
  columns: {
    type: Number,
    default: 1
  }
})

// 作业数据与状态
const homework = ref(null)
const loading = ref(false)
const error = ref(null)

// 科目映射配置
const subjectConfig = {
  chinese: '语文',
  maths: '数学',
  english: '英语',
  physics: '物理',
  chemistry: '化学',
  biology: '生物',
  history: '历史',
  geography: '地理',
  politics: '政治',
  others: '其他'
}

// 获取作业函数
const fetchHomework = async () => {
  loading.value = true
  error.value = null
  homework.value = null

  try {
    const response = props.selectedDate
        ? await HomeworkService.getHomeworkByDate(props.selectedCid, props.selectedDate)
        : await HomeworkService.getTodayHomework(props.selectedCid)

    // 处理无作业
    if (response.data.code === 2001) {
      homework.value = null
      error.value = 'no-homework'
      return
    }

    // 处理其他错误码
    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }

    homework.value = response.data.data || null
  } catch (err) {
    console.error('获取作业失败:', err)
    error.value = '获取作业失败，请稍后重试'
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

// 计算有内容的科目
const subjectsWithContent = computed(() => {
  if (!homework.value?.homework_content) return []

  const subjects = []
  const homeworkContent = homework.value.homework_content

  // 遍历所有科目，只显示有内容的科目
  Object.keys(subjectConfig).forEach(key => {
    const content = homeworkContent[key]
    if (content && content.trim()) {
      subjects.push({
        key,
        name: subjectConfig[key],
        content: content.trim(),
        lines: content.trim().split('\n')
      })
    }
  })

  return subjects
})

// 计算动态样式，用于控制显示列数
const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gap: '1rem'
  }
})
</script>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 1.25rem;
  }

  .p-4 {
    padding: 0.75rem;
  }

  .flex {
    flex-direction: column;
    gap: 0.5rem;
  }

  .text-lg {
    font-size: 1rem;
    min-width: auto;
    text-align: center;
  }

  .pt-2 {
    padding-top: 0;
  }

  .text-xl {
    font-size: 1.1rem;
  }
}

/* 当只有一个科目时的特殊样式 */
.grid:has(.p-4:only-child) .p-4 {
  min-height: 200px;
}

.grid:has(.p-4:only-child) .text-xl {
  font-size: 1.5rem;
  line-height: 1.8;
}
</style>