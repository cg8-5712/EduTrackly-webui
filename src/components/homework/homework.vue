<template>
  <div class="flex flex-col gap-4">
    <!-- 加载中 -->
    <div v-if="loading" class="p-4 bg-surface text-text-primary rounded-xl shadow-lg flex items-center justify-center min-h-[200px] transition-colors duration-200">
      <LoadingSpinner :size="60" color="var(--color-primary)" message="" />
    </div>

    <!-- 作业内容展示 -->
    <template v-else>
      <!-- 如果无作业数据 -->
      <div v-if="error === 'no-homework'" class="p-4 bg-surface text-text-primary rounded-xl shadow-lg flex text-3xl font-extrabold transition-colors duration-200">
        <div class="flex items-center justify-center w-full text-center flex-col">
          <div class="text-8xl mb-4">📝</div>
          <div class="text-4xl text-primary mb-2 transition-colors duration-200">{{ $t('homework.noHomework') }}</div>
          <div class="text-2xl text-text-tertiary mt-2 transition-colors duration-200">{{ $t('homework.noHomeworkToday') }}</div>
        </div>
      </div>
      <!-- 显示分科目作业内容 -->
      <template v-else>
        <div class="grid gap-4" :style="gridStyle">
          <div v-for="subject in subjectsWithContent"
               :key="subject.key"
               class="p-4 bg-surface text-text-primary rounded-xl shadow-lg flex text-4xl font-extrabold transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 max-md:text-[1.65rem] max-md:p-3 max-md:flex-col max-md:gap-2">
            <div class="text-2xl font-bold min-w-[3.75rem] flex-shrink-0 text-center p-2 rounded-lg border max-md:text-[1.35rem] max-md:min-w-0" :style="getSubjectStyle(subject.key)">
              {{ subject.name }}
            </div>
            <div class="flex-1 flex flex-col gap-1 pt-2 pl-3 max-md:pt-0 max-md:pl-0">
              <div v-for="(line, index) in subject.lines"
                   :key="index"
                   class="text-[1.65rem] leading-7 text-text-primary break-words transition-colors duration-200 max-md:text-[1.45rem]">
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
import { useI18n } from 'vue-i18n'
import HomeworkService from '@/services/basic/homework'
import notificationService from '@/services/common/notification'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { t: $t } = useI18n()

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
const subjectConfig = computed(() => ({
  chinese: $t('homework.subjects.chinese'),
  maths: $t('homework.subjects.math'),
  english: $t('homework.subjects.english'),
  physics: $t('homework.subjects.physics'),
  chemistry: $t('homework.subjects.chemistry'),
  biology: $t('homework.subjects.biology'),
  history: $t('homework.subjects.history'),
  geography: $t('homework.subjects.geography'),
  politics: $t('homework.subjects.politics'),
  others: $t('homework.subjects.others')
}))

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
  // 如果没有选择班级，不发送请求
  if (!props.selectedCid) {
    loading.value = false
    homework.value = null
    error.value = null
    return
  }

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
    error.value = $t('homework.fetchFailed')
    notificationService.error($t('homework.fetchFailed'))
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
  Object.keys(subjectConfig.value).forEach(key => {
    const content = homeworkContent[key]
    if (content && content.trim()) {
      // 先将字符串形式的 \n 替换为真正的换行符，然后再分割
      const normalizedContent = content.trim().replace(/\\n/g, '\n')
      subjects.push({
        key,
        name: subjectConfig.value[key],
        content: normalizedContent,
        lines: normalizedContent.split('\n').filter(line => line.trim() !== '')
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
/* 当只有一个科目时的特殊样式 - 使用深度选择器 */
:deep(.grid:has(> div:only-child)) > div {
  min-height: 200px;
}

:deep(.grid:has(> div:only-child)) .text-\[1\.65rem\] {
  font-size: 2rem;
  line-height: 1.8;
}
</style>