<template>
  <div class="homework-wrapper">
    <!-- 加载中 -->
    <div v-if="loading" class="homework-loading">
      <LoadingSpinner :size="60" color="var(--color-primary)" message="" />
    </div>

    <!-- 作业内容展示 -->
    <template v-else>
      <!-- 如果无作业数据 -->
      <div v-if="error === 'no-homework'" class="homework-empty">
        <div class="empty-content">
          <div class="empty-icon">📝</div>
          <div class="empty-title">暂无作业</div>
          <div class="empty-subtitle">今天没有布置作业哦～</div>
        </div>
      </div>
      <!-- 显示分科目作业内容 -->
      <template v-else>
        <div class="homework-grid" :style="gridStyle">
          <div v-for="subject in subjectsWithContent"
               :key="subject.key"
               class="subject-card">
            <div class="subject-label" :style="getSubjectStyle(subject.key)">
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
import notificationService from '@/services/common/notification'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

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

// 学科颜色配置（使用CSS变量和透明度）
const subjectColors = {
  chinese: { base: '#ef4444', opacity: 0.15 },     // 红色
  maths: { base: '#3b82f6', opacity: 0.15 },       // 蓝色
  english: { base: '#10b981', opacity: 0.15 },     // 绿色
  physics: { base: '#8b5cf6', opacity: 0.15 },     // 紫色
  chemistry: { base: '#f59e0b', opacity: 0.15 },   // 黄色
  biology: { base: '#059669', opacity: 0.15 },     // 翠绿色
  history: { base: '#f97316', opacity: 0.15 },     // 橙色
  geography: { base: '#06b6d4', opacity: 0.15 },   // 青色
  politics: { base: '#ec4899', opacity: 0.15 },    // 粉色
  others: { base: '#6b7280', opacity: 0.15 }       // 灰色
}

// 获取学科样式（动态生成）
const getSubjectStyle = (key) => {
  const color = subjectColors[key] || subjectColors.others
  return {
    backgroundColor: `${color.base}${Math.floor(color.opacity * 255).toString(16).padStart(2, '0')}`,
    borderColor: `${color.base}${Math.floor(color.opacity * 2 * 255).toString(16).padStart(2, '0')}`,
    color: color.base
  }
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
    notificationService.notify('获取作业失败，请稍后重试', 'error')
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

.homework-loading {
  padding: 1rem;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  transition: background-color var(--transition-base);
}

.homework-empty {
  padding: 1rem;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  font-size: 1.875rem;
  font-weight: 800;
  transition: background-color var(--transition-base);
}

.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  flex-direction: column;
}

.empty-icon {
  font-size: 3.75rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  transition: color var(--transition-base);
}

.empty-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-tertiary);
  margin-top: 0.5rem;
  transition: color var(--transition-base);
}

.homework-grid {
  display: grid;
  gap: 1rem;
}

.subject-card {
  padding: 1rem;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  font-size: 1.875rem;
  font-weight: 800;
  transition: all 0.2s;
}

.subject-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.subject-label {
  font-size: 1.125rem;
  font-weight: bold;
  min-width: 3.75rem;
  flex-shrink: 0;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid;
}

.subject-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.5rem;
  padding-left: 0.75rem;
}

.content-line {
  font-size: 1.25rem;
  line-height: 1.75;
  color: var(--color-text-primary);
  word-break: break-word;
  transition: color var(--transition-base);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subject-card {
    font-size: 1.25rem;
    padding: 0.75rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .subject-label {
    font-size: 1rem;
    min-width: auto;
    text-align: center;
  }

  .subject-content {
    padding-top: 0;
    padding-left: 0;
  }

  .content-line {
    font-size: 1.1rem;
  }
}

/* 当只有一个科目时的特殊样式 */
.homework-grid:has(.subject-card:only-child) .subject-card {
  min-height: 200px;
}

.homework-grid:has(.subject-card:only-child) .content-line {
  font-size: 1.5rem;
  line-height: 1.8;
}
</style>