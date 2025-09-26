<template>
  <div class="admin-dashboard">
    <!-- 管理员信息头部 -->
    <div class="admin-header">
      <div class="header-content">
        <div class="admin-info-section">
          <div class="admin-avatar">
            <div class="avatar-circle">
              <span class="avatar-text">管</span>
            </div>
            <div class="online-indicator"></div>
          </div>
          <div class="admin-details">
            <h1 class="admin-title">管理员控制台</h1>
            <p class="admin-subtitle">教育管理系统 - 实时监控与管理</p>
          </div>
        </div>

        <div class="header-actions">
          <div class="quick-stats">
            <div class="stat-item">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <div class="stat-value">{{ totalStudents || '0' }}</div>
                <div class="stat-label">学生总数</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📚</div>
              <div class="stat-info">
                <div class="stat-value">{{ totalHomework || '0' }}</div>
                <div class="stat-label">作业任务</div>
              </div>
            </div>
          </div>

          <div class="header-controls">
            <button class="refresh-btn" @click="refreshPage" title="刷新页面">
              <span class="refresh-icon">🔄</span>
              <span class="refresh-text">刷新</span>
            </button>

            <div class="time-display">
              <div class="current-time">{{ currentTime }}</div>
              <div class="current-date">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 上半部分：Home页面和控制面板 -->
      <div class="top-section">
        <!-- 左侧 Views/Home 页面内容 -->
        <div class="home-content">
          <div class="content-header">
            <h2 class="content-title">
              <span class="title-icon">🏠</span>
              主面板
            </h2>
          </div>
          <div class="home-wrapper">
            <Home />
          </div>
        </div>

        <!-- 右侧控制面板 -->
        <div class="control-panel">
          <!-- 班级切换器 -->
          <div class="class-control-card">
            <div class="card-header">
              <h3 class="card-title">
                <span class="title-icon">🏫</span>
                班级管理
              </h3>
            </div>
            <div class="class-switch-container">
              <ClassSwitch @update:cid="handleClassChange" />
            </div>
          </div>

          <!-- 系统状态卡片 -->
          <div class="system-status-card">
            <div class="card-header">
              <h3 class="card-title">
                <span class="title-icon">⚡</span>
                系统状态
              </h3>
            </div>
            <div class="status-grid">
              <div class="status-item">
                <div class="status-indicator active"></div>
                <span class="status-text">服务运行中</span>
              </div>
              <div class="status-item">
                <div class="status-indicator active"></div>
                <span class="status-text">数据库连接</span>
              </div>
              <div class="status-item">
                <div class="status-indicator active"></div>
                <span class="status-text">实时同步</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部区域：学生管理和作业提交 -->
      <div class="bottom-section">
        <!-- 学生列表区域 -->
        <div class="student-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">👥</span>
              学生管理
            </h2>
            <div class="section-badge" v-if="selectedCid">
              当前班级：{{ selectedCid }}
            </div>
          </div>
          <div class="student-container">
            <StudentList :cid="selectedCid" ref="studentListComponent" />
          </div>
        </div>

        <!-- 作业提交区域 -->
        <div class="homework-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">📝</span>
              作业管理
            </h2>
          </div>
          <div class="homework-container">
            <SubmitHomework :cid="selectedCid" />
          </div>
        </div>
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
      timeInterval: null,
      totalStudents: 0,
      totalHomework: 0
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
      // 更新统计数据（示例）
      this.updateStats()
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
    },
    updateStats() {
      // 模拟统计数据更新
      this.totalStudents = Math.floor(Math.random() * 50) + 20
      this.totalHomework = Math.floor(Math.random() * 10) + 5
    },
    refreshPage() {
      console.log('刷新当前页面')
      // 刷新当前页面
      window.location.reload()
    }
  }
}
</script>

<style scoped>
/* 重置和基础样式 */
* {
  box-sizing: border-box;
}

.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 头部区域样式 */
.admin-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.admin-info-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-avatar {
  position: relative;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.admin-details {
  flex: 1;
}

.admin-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0 0 4px 0;
}

.admin-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.refresh-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.refresh-icon {
  font-size: 1rem;
  animation: rotate 0.5s ease-in-out;
}

.refresh-btn:hover .refresh-icon {
  animation: rotate 0.8s ease-in-out infinite;
}

.refresh-text {
  font-size: 0.875rem;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.quick-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.8rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.time-display {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  min-width: 160px;
}

.current-time {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 4px;
  font-family: 'Courier New', monospace;
}

.current-date {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-section {
  display: flex;
  gap: 20px;
  height: 45vh;
  min-height: 400px;
}

.home-content {
  flex: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  margin-bottom: 20px;
}

.content-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
}

.title-icon {
  font-size: 1.2rem;
}

.home-wrapper {
  flex: 1;
  overflow: auto;
  padding: 0 20px 20px 20px;
}

.control-panel {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.class-control-card,
.system-status-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.class-control-card {
  flex: 1;
}

.system-status-card {
  flex: 1;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.class-switch-container {
  padding: 20px;
}

.status-grid {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc2626;
  position: relative;
}

.status-indicator.active {
  background: #10b981;
  animation: pulse-green 2s infinite;
}

.status-text {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

/* 底部区域样式 */
.bottom-section {
  display: flex;
  gap: 20px;
  height: 45vh;
  min-height: 350px;
}

.student-section,
.homework-section {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-badge {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
}

.btn-icon {
  font-size: 0.875rem;
}

.student-container,
.homework-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* 滚动条样式 */
.home-wrapper::-webkit-scrollbar,
.student-container::-webkit-scrollbar,
.homework-container::-webkit-scrollbar {
  width: 6px;
}

.home-wrapper::-webkit-scrollbar-track,
.student-container::-webkit-scrollbar-track,
.homework-container::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 3px;
}

.home-wrapper::-webkit-scrollbar-thumb,
.student-container::-webkit-scrollbar-thumb,
.homework-container::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 3px;
}

.home-wrapper::-webkit-scrollbar-thumb:hover,
.student-container::-webkit-scrollbar-thumb:hover,
.homework-container::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .admin-dashboard {
    padding: 16px;
  }

  .admin-header {
    padding: 20px;
  }

  .header-content {
    gap: 20px;
  }

  .header-controls {
    gap: 12px;
  }

  .refresh-btn {
    padding: 10px 14px;
    font-size: 0.8rem;
  }

  .header-content {
    gap: 20px;
  }

  .quick-stats {
    gap: 12px;
  }

  .stat-item {
    padding: 12px 16px;
  }

  .control-panel {
    min-width: 280px;
  }
}

@media (max-width: 1024px) {
  .top-section {
    height: auto;
    min-height: 350px;
  }

  .bottom-section {
    height: auto;
    min-height: 300px;
  }

  .control-panel {
    min-width: 250px;
  }

  .admin-title {
    font-size: 1.6rem;
  }

  .current-time {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 12px;
  }

  .admin-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .admin-info-section {
    justify-content: center;
  }

  .header-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-controls {
    flex-direction: column-reverse;
    gap: 12px;
    align-items: center;
  }

  .refresh-btn {
    align-self: center;
    min-width: 120px;
  }

  .quick-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .time-display {
    align-self: center;
  }

  .top-section {
    flex-direction: column;
    gap: 16px;
    height: auto;
    min-height: 300px;
  }

  .control-panel {
    flex-direction: row;
    min-width: auto;
    gap: 12px;
  }

  .class-control-card,
  .system-status-card {
    flex: 1;
  }

  .bottom-section {
    flex-direction: column;
    gap: 16px;
    height: auto;
    min-height: 400px;
  }

  .admin-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .admin-subtitle {
    text-align: center;
  }

  .current-time {
    font-size: 1.1rem;
  }

  .current-date {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .admin-dashboard {
    padding: 8px;
  }

  .admin-header {
    padding: 12px;
  }

  .admin-avatar .avatar-circle {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .admin-title {
    font-size: 1.3rem;
  }

  .quick-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-item {
    padding: 10px 12px;
    justify-content: center;
  }

  .control-panel {
    flex-direction: column;
    gap: 8px;
  }

  .content-header,
  .card-header,
  .section-header {
    padding: 12px;
  }

  .home-wrapper,
  .class-switch-container,
  .status-grid,
  .student-container,
  .homework-container {
    padding: 12px;
  }

  .current-time {
    font-size: 1rem;
  }

  .time-display {
    padding: 12px 16px;
    min-width: 120px;
  }
}
</style>