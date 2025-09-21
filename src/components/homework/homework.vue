<template>
  <div class="homework-wrapper">
    <!-- 加载中 -->
    <div v-if="loading" class="homework-container loading">
      加载中...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error && error !== 'no-homework'" class="homework-container error">
      {{ error }}
    </div>

    <!-- 作业内容展示 -->
    <template v-else>
      <!-- 如果无作业数据 -->
      <div v-if="error === 'no-homework'" class="homework-container">
        暂无作业
      </div>
      <!-- 显示分科目作业内容 -->
      <template v-else>
        <div class="homework-lines" :style="gridStyle">
          <div v-for="subject in subjectsWithContent"
               :key="subject.key"
               class="homework-container">
            <div class="subject-header">
              {{ subject.name }}
            </div>
            <div class="subject-content">
              <div v-for="(line, index) in subject.lines"
                   :key="index"
                   class="content-line">
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
  display: flex;
  //align-items: center;

  font-size: 1.8rem;
  font-weight: bolder;
}

.subject-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-top: 0.5rem;

  /* 新增缩进，让内容和标签有间距 */
  padding-left: 0.8rem;
}


.subject-header {
  font-size: 1.2rem;
  font-weight: bold;
  color: #9ed2ff;
  min-width: 60px;
  flex-shrink: 0;
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(158, 210, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(158, 210, 255, 0.2);
}

.subject-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-top: 0.5rem;
}

.content-line {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #e0e0e0;
  word-break: break-word;
}

.loading {
  font-size: 2rem;
  color: #9ed2ff;
}

.error {
  font-size: 2rem;
  color: #ff6b6b;
}

.homework-lines {
  display: grid;
  gap: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .homework-container {
    font-size: 1.4rem;
    padding: 0.8rem;
  }

  .subject-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .subject-header {
    font-size: 1rem;
    min-width: auto;
    text-align: center;
  }

  .subject-content {
    padding-top: 0;
  }

  .content-line {
    font-size: 1.1rem;
  }
}

/* 当只有一个科目时的特殊样式 */
.homework-lines:has(.subject-container:only-child) .subject-container {
  min-height: 200px;
}

.homework-lines:has(.subject-container:only-child) .content-line {
  font-size: 1.5rem;
  line-height: 1.8;
}
</style>