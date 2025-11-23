<template>
  <div class="min-h-screen max-h-screen w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col gap-3 md:gap-4 p-2 sm:p-3 md:p-4 box-border overflow-y-auto overflow-x-hidden transition-colors duration-200">
    <ClassSwitch @update:cid="handleClassChange" class="w-full" />
    <StudentEventSelector :cid="selectedCid" ref="studentListComponent" class="w-full" />
    <!-- 引入作业提交组件 -->
    <SubmitHomework :cid="selectedCid" class="w-full" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ClassSwitch from '@/components/common/ClassSwitch.vue'
import StudentEventSelector from '@/components/student/StudentEventSelector.vue'
import SubmitHomework from '@/components/homework/SubmitHomework.vue' // 引入组件
import notificationService from '@/services/common/notification'

const { t: $t } = useI18n()

// 检测微信浏览器
const checkWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(ua)
}

// 检查是否已经显示过提示
const hasShownWechatTip = () => {
  return sessionStorage.getItem('edutrackly-cg8-5712-wechat-tip-shown') === 'true'
}

// 选中的班级ID
const selectedCid = ref(1) // 默认 cid=1

// ref StudentList组件
const studentListComponent = ref(null)

// 处理班级变化
const handleClassChange = (newCid) => {
  console.log('Class changed:', newCid)
  selectedCid.value = newCid
}

// watch selectedCid，班级变化时刷新学生列表
watch(
    selectedCid,
    async (newVal) => {
      console.log('Selected CID changed:', newVal)
      if (studentListComponent.value) {
        await studentListComponent.value.fetchStudents()
      }
    },
    { immediate: true }
)

// 页面加载时检测微信浏览器
onMounted(() => {
  // 检测微信浏览器并显示提示
  if (checkWechatBrowser() && !hasShownWechatTip()) {
    setTimeout(() => {
      notificationService.info($t('wechatTip.message'))
      sessionStorage.setItem('edutrackly-cg8-5712-wechat-tip-shown', 'true')
    }, 1000) // 延迟1秒显示，避免干扰页面加载
  }
})
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 4px;
  }
}

::-webkit-scrollbar-track {
  background: var(--color-surface);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
  transition: background var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>
