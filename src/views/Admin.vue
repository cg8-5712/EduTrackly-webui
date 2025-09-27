<template>
  <div class="flex h-screen overflow-hidden">
    <div class="w-60 min-w-60 bg-slate-700 text-white flex flex-col shadow-lg">
      <div class="p-5 border-b border-slate-600 bg-slate-800">
        <h3 class="m-0 text-lg font-semibold text-center">管理后台</h3>
      </div>
      <div class="flex-1 overflow-y-auto pt-2">
        <ul class="list-none p-0 m-0">
          <li
              v-for="(item, index) in navigation"
              :key="index"
              @click="changeComponent(item)"
              :class="{'bg-slate-600 border-l-cyan-400 font-semibold': item.current}"
              class="py-4 px-5 cursor-pointer flex items-center transition-all duration-300 border-l-4 border-l-transparent hover:bg-slate-600 hover:border-l-cyan-400"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div class="bg-white py-5 px-8 border-b border-gray-200 shadow-sm z-10">
        <h2 class="m-0 text-2xl font-semibold text-slate-700">{{ currentMenuName }}</h2>
      </div>
      <div class="flex-1 p-8 overflow-y-auto overflow-x-hidden">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 引入各个管理组件
import CurrentAdmin from '@/components/admin/CurrentAdmin.vue'
import ClassAdmin from '@/components/admin/ClassAdmin.vue'
import StudentAdmin from '@/components/admin/StudentAdmin.vue'
import HomeworkAdmin from '@/components/admin/HomeworkAdmin.vue'
import System from '@/components/admin/System.vue'

// 引入图标组件（你需要根据实际使用的图标库调整）
import { AcademicCapIcon, BookOpenIcon, UsersIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline'

// 管理组件映射
const components = {
  currentadmin: CurrentAdmin,
  classadmin: ClassAdmin,
  studentadmin: StudentAdmin,
  homeworkadmin: HomeworkAdmin,
  system: System
}

// 导航菜单配置
const navigation = ref([
  { name: '当前状态', nameKey: 'nav.currentadmin', href: '#', icon: AcademicCapIcon, current: true, componentName: 'currentadmin'  },
  { name: '班级管理', nameKey: 'nav.classadmin', href: '#', icon: UsersIcon, current: false, componentName: 'classadmin'  },
  { name: '学生管理', nameKey: 'nav.studentadmin', href: '#', icon: UsersIcon, current: false, componentName: 'studentadmin'  },
  { name: '作业管理', nameKey: 'nav.homeworkadmin', href: '#', icon: BookOpenIcon, current: false, componentName: 'homeworkadmin'  },
  { name: '系统设置', nameKey: 'nav.system', href: '#', icon: Cog8ToothIcon, current: false, componentName: 'system'  }
])

// 当前选中的菜单项
const currentComponent = ref(components[ navigation.value.find(item => item.current).componentName ])

// 当前菜单名称（用于显示页面标题）
const currentMenuName = computed(() => {
  return navigation.value.find(item => item.current)?.name || ''
})

// 处理菜单项选择
const changeComponent = (item) => {
  // 设置当前选中项
  navigation.value.forEach(navItem => navItem.current = false)
  item.current = true

  // 切换显示的组件
  currentComponent.value = components[item.componentName]
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.bg-slate-700 .overflow-y-auto::-webkit-scrollbar-track {
  background: #334155;
}

.bg-slate-700 .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #06b6d4;
  border-radius: 3px;
}

.bg-slate-700 .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #0891b2;
}

.bg-gray-50 .overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.bg-gray-50 .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.bg-gray-50 .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }

  .w-60 {
    width: 100%;
    height: auto;
    max-height: 200px;
  }

  .flex-1.overflow-y-auto {
    overflow-x: auto;
  }

  .list-none {
    display: flex;
    flex-direction: row;
  }

  .py-4.px-5 {
    white-space: nowrap;
    min-width: 120px;
  }

  .p-8 {
    padding: 20px 15px;
  }
}

/* 确保子组件能够正确滚动 */
div >>> * {
  max-width: 100%;
}
</style>