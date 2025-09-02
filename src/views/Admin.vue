<template>
  <div class="admin-container">
    <div class="admin-sidebar">
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

    <div class="admin-content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
}

.admin-sidebar {
  width: 200px;
  background-color: #2f4050;
  color: white;
  padding-top: 10%;
}

.menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu li:hover {
  background-color: #3a5062;
}

.menu .active {
  background-color: #3a5062;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>
