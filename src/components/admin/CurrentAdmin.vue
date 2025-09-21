<template>
  <div class="home-container">
    <!-- 顶部区域 - Home页面和侧边栏 -->
    <div class="top-section">
      <!-- 左侧 Views/Home 页面内容 - 只占上半部分 -->
      <div class="home-content">
        <div class="home-wrapper">
          <Home />
        </div>
      </div>

      <!-- 右侧时间和班级切换器 -->
      <div class="sidebar">
        <!-- 时间显示 -->
        <div class="time-display">
          <div class="current-time">{{ currentTime }}</div>
          <div class="current-date">{{ currentDate }}</div>
        </div>

        <!-- 班级切换器 -->
        <div class="class-switch-container">
          <ClassSwitch @update:cid="handleClassChange" />
        </div>
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="bottom-section">
      <!-- 学生列表 -->
      <StudentList :cid="selectedCid" ref="studentListComponent" />
      <!-- 作业提交 -->
      <div class="submit-homework-container">
        <SubmitHomework :cid="selectedCid" />
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@/views/Home.vue'
import ClassSwitch from '@/components/common/classswitch.vue'
import StudentList from '@/components/student/studentlist.vue'
import SubmitHomework from '@/components/homework/SubmitHomework.vue'

export default {
  name: 'HomeContainer',
  components: {
    Home,
    ClassSwitch,
    StudentList,
    SubmitHomework
  },
  data() {
    return {
      selectedCid: null,
      currentTime: '',
      currentDate: '',
      timeInterval: null
    }
  },
  mounted() {
    this.updateTime()
    // 每秒更新时间
    this.timeInterval = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    // 清理定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    handleClassChange(cid) {
      console.log('班级切换:', cid)
      this.selectedCid = cid
    },
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      this.currentDate = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;
  gap: 15px;
}

.top-section {
  display: flex;
  height: 45vh;
  min-height: 350px;
  gap: 15px;
}

.home-content {
  flex: 3;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.home-wrapper {
  flex: 1;
  overflow: auto;
  max-height: 100%;
}

.sidebar {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.time-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.current-time {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}

.current-date {
  font-size: 0.85rem;
  opacity: 0.9;
}

.class-switch-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bottom-section {
  display: flex;
  gap: 15px;
  height: 45vh;
  min-height: 300px;
}

.student-list-container {
  flex: 1.2;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.submit-homework-container {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

/* 滚动条样式 */
.home-wrapper::-webkit-scrollbar,
.student-list-container::-webkit-scrollbar,
.submit-homework-container::-webkit-scrollbar {
  width: 6px;
}

.home-wrapper::-webkit-scrollbar-track,
.student-list-container::-webkit-scrollbar-track,
.submit-homework-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.home-wrapper::-webkit-scrollbar-thumb,
.student-list-container::-webkit-scrollbar-thumb,
.submit-homework-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.home-wrapper::-webkit-scrollbar-thumb:hover,
.student-list-container::-webkit-scrollbar-thumb:hover,
.submit-homework-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .home-container {
    padding: 10px;
    gap: 10px;
  }

  .top-section, .bottom-section {
    gap: 10px;
  }

  .sidebar {
    min-width: 240px;
  }

  .current-time {
    font-size: 1.6rem;
  }
}

@media (max-width: 1024px) {
  .top-section {
    height: 50vh;
    min-height: 400px;
  }

  .bottom-section {
    height: 40vh;
    min-height: 280px;
  }

  .sidebar {
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 8px;
    min-height: calc(100vh - 16px);
  }

  .top-section {
    flex-direction: column;
    height: auto;
    min-height: 300px;
  }

  .sidebar {
    flex-direction: row;
    min-width: auto;
    height: 140px;
  }

  .time-display {
    flex: 1;
    min-height: auto;
    padding: 15px;
  }

  .class-switch-container {
    flex: 1;
    padding: 15px;
  }

  .bottom-section {
    flex-direction: column;
    height: auto;
    min-height: 400px;
  }

  .current-time {
    font-size: 1.4rem;
  }

  .current-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .sidebar {
    flex-direction: column;
    height: auto;
  }

  .time-display {
    min-height: 100px;
  }

  .current-time {
    font-size: 1.2rem;
  }
}
</style>