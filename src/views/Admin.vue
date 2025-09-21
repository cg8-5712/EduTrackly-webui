<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <div class="sidebar-header">
        <h3>管理后台</h3>
      </div>
      <div class="sidebar-content">
        <ul class="menu">
          <li
              v-for="(item, index) in navigation"
              :key="index"
              @click="changeComponent(item)"
              :class="{'active': item.current}"
          >
            <component :is="item.icon" class="menu-icon" />
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="admin-content">
      <div class="content-header">
        <h2>{{ currentMenuName }}</h2>
      </div>
      <div class="content-body">
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
.admin-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  width: 240px;
  min-width: 240px;
  background-color: #2f4050;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px 15px;
  border-bottom: 1px solid #3a5062;
  background-color: #1e2832;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding-top: 10px;
}

.menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.menu li:hover {
  background-color: #3a5062;
  border-left-color: #5cb3cc;
}

.menu .active {
  background-color: #3a5062;
  border-left-color: #5cb3cc;
  font-weight: 600;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  overflow: hidden;
}

.content-header {
  background-color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.content-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.content-body {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 自定义滚动条样式 */
.sidebar-content::-webkit-scrollbar,
.content-body::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #2f4050;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #5cb3cc;
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #4a9fb8;
}

.content-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.content-body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }

  .sidebar-content {
    overflow-x: auto;
  }

  .menu {
    display: flex;
    flex-direction: row;
  }

  .menu li {
    white-space: nowrap;
    min-width: 120px;
  }

  .content-body {
    padding: 20px 15px;
  }
}

/* 确保子组件能够正确滚动 */
.admin-content >>> * {
  max-width: 100%;
}
</style>