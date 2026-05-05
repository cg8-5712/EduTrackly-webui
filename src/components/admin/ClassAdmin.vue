<template>
  <div class="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      <!-- 头部区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-start flex-wrap gap-6">
          <div class="flex-1 min-w-[300px]">
            <h1 class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 mb-2">{{ $t('ui.classManagement') }}</h1>
            <p class="text-gray-500 text-lg m-0 font-normal">{{ $t('ui.manageClassInfo') }}</p>
          </div>
          <div class="flex gap-4">
            <button @click="openExportDialog" class="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-green-600 to-teal-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-green-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-600/40">
              <span class="text-base">📊</span>
              {{ $t('analysis.export') }}
            </button>
            <button @click="showCreateDialog = true" class="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40">
              <span class="text-base">➕</span>
              {{ $t('ui.createClass') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索和过滤区域 -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <div class="flex gap-6 items-center flex-wrap">
          <div class="relative flex-1 min-w-[300px]">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('ui.searchClassName')"
              class="w-full py-3 pr-4 pl-12 border-2 border-gray-200 rounded-xl text-base transition-colors focus:outline-none focus:border-blue-600"
              @input="handleSearch"
            >
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">🔍</span>
          </div>
          <div class="flex items-center gap-3">
            <label>{{ $t('ui.itemsPerPage') }}：</label>
            <div class="relative min-w-40" ref="pageSizeSelectRef">
              <div class="flex items-center justify-between py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-600 hover:shadow-blue-100 hover:shadow-lg" @click="togglePageSizeDropdown">
                <span class="flex-1 text-left">{{ pagination.size }}{{ $t('pagination.itemsUnit') }}</span>
                <span class="ml-3 text-xs text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showPageSizeDropdown }">▼</span>
              </div>
              <div class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200" v-show="showPageSizeDropdown">
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': pagination.size === 5 }"
                  @click="selectPageSizeOption(5)"
                >
                  5{{ $t('pagination.itemsUnit') }}
                  <span v-if="pagination.size === 5" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': pagination.size === 20 }"
                  @click="selectPageSizeOption(20)"
                >
                  20{{ $t('pagination.itemsUnit') }}
                  <span v-if="pagination.size === 20" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': pagination.size === 50 }"
                  @click="selectPageSizeOption(50)"
                >
                  50{{ $t('pagination.itemsUnit') }}
                  <span v-if="pagination.size === 50" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
                <div
                  class="py-3 px-4 cursor-pointer transition-all duration-200 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:text-blue-600"
                  :class="{ 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold relative': pagination.size === 100 }"
                  @click="selectPageSizeOption(100)"
                >
                  100{{ $t('pagination.itemsUnit') }}
                  <span v-if="pagination.size === 100" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner />
        <p class="text-gray-500 text-base m-0 mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-center">
        {{ error }}
      </div>

      <!-- 班级列表 -->
      <div v-if="!loading && !error" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="py-5 px-6 border-b border-gray-200 bg-gray-50">
          <div class="text-gray-500 text-sm font-medium">
            <span>{{ $t('ui.foundClassesInfo', { total: pagination.total, size: pagination.size }) }}</span>
          </div>
        </div>

        <!-- 表头排序 -->
        <div class="flex bg-gray-50 border-b-2 border-gray-200 py-4 px-6 font-semibold text-gray-700 text-sm">
          <div class="flex items-center px-2 min-w-0 flex-[2]">{{ $t('ui.className') }}</div>
          <div class="flex items-center px-2 min-w-0 cursor-pointer select-none transition-colors gap-2 hover:text-blue-600" @click="handleSort('cid')">
            <span>{{ $t('ui.id') }}</span>
            <span class="flex flex-col gap-0 ml-1">
              <span class="text-xs text-gray-300 transition-colors leading-none -mb-0.5" :class="{ 'text-blue-600 font-bold': sortField === 'cid' && sortDirection === 'asc' }">↑</span>
              <span class="text-xs text-gray-300 transition-colors leading-none -mt-0.5" :class="{ 'text-blue-600 font-bold': sortField === 'cid' && sortDirection === 'desc' }">↓</span>
            </span>
          </div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.studentCount') }}</div>
          <div class="flex items-center px-2 min-w-0 cursor-pointer select-none transition-colors gap-2 hover:text-blue-600" @click="handleSort('create_time')">
            <span>{{ $t('ui.creationTime') }}</span>
            <span class="flex flex-col gap-0 ml-1">
              <span class="text-xs text-gray-300 transition-colors leading-none -mb-0.5" :class="{ 'text-blue-600 font-bold': sortField === 'create_time' && sortDirection === 'asc' }">↑</span>
              <span class="text-xs text-gray-300 transition-colors leading-none -mt-0.5" :class="{ 'text-blue-600 font-bold': sortField === 'create_time' && sortDirection === 'desc' }">↓</span>
            </span>
          </div>
          <div class="flex items-center px-2 min-w-0 flex-1">{{ $t('ui.actions') }}</div>
        </div>

        <div class="flex flex-col">
          <div
            v-for="classItem in sortedClassList"
            :key="classItem.cid"
            class="flex items-center py-4 px-6 border-b border-gray-100 transition-all duration-200 last:border-b-0 hover:bg-white/5 hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="flex items-center px-2 min-w-0 flex-[2]">
              <h3 class="text-lg font-semibold text-gray-800 m-0 truncate">{{ classItem.class_name }}</h3>
            </div>
            <div class="flex items-center px-2 min-w-0">
              <span class="text-sm text-gray-500 font-medium bg-gray-100 py-1 px-2 rounded-md">{{ classItem.cid }}</span>
            </div>
            <div class="flex items-center px-2 min-w-0 flex-1">
              <span class="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                <span class="text-base">👥</span>
                {{ getStudentCount(classItem.cid) }}{{ $t('pagination.peopleUnit') }}
              </span>
            </div>
            <div class="flex items-center px-2 min-w-0">
              <span class="text-sm text-gray-500 font-medium">{{ formatDate(classItem.create_time) }}</span>
            </div>
            <div class="flex items-center px-2 min-w-0 flex-1">
              <div class="flex gap-2">
                <button
                  @click="viewClassDetail(classItem)"
                  class="flex items-center justify-center w-9 h-9 border-none rounded-lg text-sm cursor-pointer transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-white/8 hover:scale-105"
                  :title="$t('ui.viewDetails')"
                >
                  <span class="text-base">👁️</span>
                </button>
                <button
                  @click="confirmDelete(classItem)"
                  class="flex items-center justify-center w-9 h-9 border-none rounded-lg text-sm cursor-pointer transition-all duration-200 bg-red-50 text-red-600 hover:bg-white/8 hover:scale-105"
                  :title="$t('ui.deleteClass')"
                >
                  <span class="text-base">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页组件 -->
        <div class="flex justify-center gap-2 py-6 border-t border-gray-200" v-if="pagination.pages > 1">
          <button
            @click="changePage(page)"
            v-for="page in paginationPages"
            :key="page"
            :class="['py-2 px-4 border-2 border-gray-200 bg-white text-gray-500 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50', { 'bg-blue-600 border-blue-600 text-white': page === pagination.page }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- 创建班级对话框 -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showCreateDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="m-0 text-xl font-bold text-gray-800">{{ $t('ui.createNewClass') }}</h3>
          <button @click="showCreateDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6">
          <div class="mb-5">
            <label for="className" class="block mb-2 font-semibold text-gray-700">{{ $t('ui.className') }}</label>
            <input
              id="className"
              v-model="newClassName"
              type="text"
              :placeholder="$t('ui.enterClassName')"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-600"
              @keyup.enter="createClass"
            >
          </div>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button @click="showCreateDialog = false" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">{{ $t('common.cancel') }}</button>
          <button @click="createClass" :disabled="!newClassName.trim() || creating" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-blue-600 text-white border-none hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ creating ? $t('ui.adding') : $t('ui.confirmCreate') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 班级详情对话框 -->
    <div v-if="showDetailDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDetailDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="m-0 text-xl font-bold text-gray-800">{{ $t('ui.classDetails', { className: selectedClass?.class_name }) }}</h3>
          <button @click="showDetailDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6">
          <div v-if="loadingDetail" class="text-center py-12">
            <div class="w-12 h-12 border-4 border-gray-200 border-b-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>{{ $t('ui.loadingDetails') }}</p>
          </div>
          <div v-else-if="classDetail" class="flex flex-col gap-6">
            <!-- 班级基本信息 -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center py-2 border-b border-gray-100">
                <span class="font-semibold text-gray-700 min-w-25">{{ $t('ui.classId') }}</span>
                <span class="text-gray-500">{{ classDetail.cid }}</span>
              </div>
              <div class="flex items-center py-2 border-b border-gray-100">
                <span class="font-semibold text-gray-700 min-w-25">{{ $t('ui.classNameLabel') }}</span>
                <span class="text-gray-500">{{ classDetail.class_name }}</span>
              </div>
              <div class="flex items-center py-2 border-b border-gray-100">
                <span class="font-semibold text-gray-700 min-w-25">{{ $t('ui.creationTimeLabel') }}</span>
                <span class="text-gray-500">{{ formatDate(classDetail.create_time) }}</span>
              </div>
            </div>

            <!-- 班级分析数据 -->
            <div v-if="classAnalysis" class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 class="text-gray-800 text-lg m-0 mb-4 font-bold">{{ $t('ui.classStatistics') }}</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-lg p-4 shadow-sm">
                  <div class="text-gray-500 text-sm mb-1">{{ $t('ui.totalStudents') }}</div>
                  <div class="text-2xl font-bold text-blue-600">{{ classAnalysis.student_num }}</div>
                </div>
                <div class="bg-white rounded-lg p-4 shadow-sm">
                  <div class="text-gray-500 text-sm mb-1">{{ $t('ui.expectedAttendance') }}</div>
                  <div class="text-2xl font-bold text-purple-600">{{ classAnalysis.expected_attend }}</div>
                </div>
                <div class="bg-white rounded-lg p-4 shadow-sm">
                  <div class="text-gray-500 text-sm mb-1">{{ $t('ui.todayAttendance') }}</div>
                  <div class="text-2xl font-bold text-green-600">{{ classAnalysis.today_actual_attend }}</div>
                </div>
                <div class="bg-white rounded-lg p-4 shadow-sm">
                  <div class="text-gray-500 text-sm mb-1">{{ $t('ui.todayAttendanceRate') }}</div>
                  <div class="text-2xl font-bold text-orange-600">
                    {{ classAnalysis.expected_attend > 0 ? (classAnalysis.today_actual_attend / classAnalysis.expected_attend * 100).toFixed(1) : 0 }}%
                  </div>
                </div>
              </div>

              <!-- 出勤率折线图 -->
              <div v-if="classAnalysis.daily_attendance_rates && classAnalysis.daily_attendance_rates.length > 0" class="bg-white rounded-lg p-4 shadow-sm">
                <AttendanceChart :data="classAnalysis.daily_attendance_rates" />
              </div>
              <div v-else class="bg-white rounded-lg p-6 text-center text-gray-500">
                {{ $t('ui.noHistoricalAttendance') }}
              </div>
            </div>

            <!-- 班级学生列表 -->
            <div>
              <h4 class="text-gray-800 text-lg m-0 mb-4">{{ $t('ui.classStudents') }} ({{ classDetail.students?.length || 0 }}{{ $t('pagination.peopleUnit') }})</h4>
              <div v-if="classDetail.students && classDetail.students.length > 0" class="flex flex-col gap-2 max-h-75 overflow-y-auto">
                <div
                  v-for="student in classDetail.students"
                  :key="student.sid"
                  class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span class="font-semibold text-gray-800 flex-1">{{ student.student_name }}</span>
                  <span class="text-sm text-gray-500">ID: {{ student.sid }}</span>
                  <span
                    class="py-1 px-3 rounded-full text-xs font-semibold"
                    :class="student.attendance ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'"
                  >
                    {{ student.attendance ? $t('ui.inSchool') : $t('ui.absent') }}
                  </span>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 italic py-6">
                {{ $t('ui.noStudentsYet') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showDeleteDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="m-0 text-xl font-bold text-gray-800">{{ $t('ui.confirmDelete') }}</h3>
          <button @click="showDeleteDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6">
          <p>{{ $t('ui.confirmDeleteClass', { className: selectedClass?.class_name }) }}</p>
          <p class="text-red-600 text-sm mt-2">{{ $t('ui.cannotUndo') }}</p>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button @click="showDeleteDialog = false" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">{{ $t('common.cancel') }}</button>
          <button @click="deleteClass" :disabled="deleting" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-red-600 text-white border-none hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ deleting ? $t('ui.deleting') : $t('ui.confirmDeleteButton') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 导出对话框 -->
    <div v-if="showExportDialog" class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showExportDialog = false">
      <div class="bg-white rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="m-0 text-xl font-bold text-gray-800">{{ $t('analysis.export') }} - {{ $t('ui.classData') }}</h3>
          <button @click="showExportDialog = false" class="bg-none border-none text-lg cursor-pointer p-1 rounded transition-colors hover:bg-gray-100">✖️</button>
        </div>
        <div class="p-6">
          <!-- 班级选择 -->
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('ui.selectClass') }}</label>
            <select v-model="exportClassId" class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-600">
              <option value="">{{ $t('ui.pleaseSelectClass') }}</option>
              <option v-for="classItem in classList" :key="classItem.cid" :value="classItem.cid">
                {{ classItem.class_name }} (ID: {{ classItem.cid }})
              </option>
            </select>
          </div>

          <!-- 日期范围选择 -->
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-700">{{ $t('analysis.dateRange') }}</label>
            <div class="flex gap-4 items-center">
              <div class="flex-1">
                <label class="block mb-1 text-sm text-gray-500">{{ $t('ui.startDate') }}</label>
                <input
                  type="date"
                  v-model="exportStartDate"
                  :max="exportEndDate || todayDate"
                  class="w-full py-2 px-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-600"
                />
              </div>
              <span class="text-gray-400 mt-6">~</span>
              <div class="flex-1">
                <label class="block mb-1 text-sm text-gray-500">{{ $t('ui.endDate') }}</label>
                <input
                  type="date"
                  v-model="exportEndDate"
                  :min="exportStartDate"
                  :max="todayDate"
                  class="w-full py-2 px-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <!-- 快捷选择 -->
          <div class="mb-5">
            <label class="block mb-2 text-sm text-gray-500">{{ $t('ui.quickSelect') }}</label>
            <div class="flex gap-2 flex-wrap">
              <button @click="setDateRange('week')" class="py-1.5 px-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">{{ $t('ui.lastWeek') }}</button>
              <button @click="setDateRange('month')" class="py-1.5 px-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">{{ $t('ui.lastMonth') }}</button>
              <button @click="setDateRange('quarter')" class="py-1.5 px-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">{{ $t('ui.lastQuarter') }}</button>
            </div>
          </div>
        </div>
        <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button @click="showExportDialog = false" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-none hover:bg-gray-200">{{ $t('common.cancel') }}</button>
          <button @click="exportClassData" :disabled="exporting || !canExport" class="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-green-600 text-white border-none hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ exporting ? $t('ui.exporting') : $t('analysis.export') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminClassService from '@/services/admin/class'
import AuthService from '@/services/common/auth'
import AnalysisService from '@/services/basic/analysis'
import AttendanceChart from './AttendanceChart.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import notificationService from '@/services/common/notification'

const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const error = ref('')
const classList = ref([])
const searchQuery = ref('')
const sortOrder = ref('desc') // API排序使用（仅用于创建时间）

// 排序状态
const sortField = ref('create_time') // 当前排序字段
const sortDirection = ref('desc') // 当前排序方向

// 自定义下拉框状态（移除排序下拉框相关）
const showPageSizeDropdown = ref(false)
const pageSizeSelectRef = ref(null)

// 分页数据
const pagination = reactive({
  page: 1,
  size: 20, // 默认显示20条
  total: 0,
  pages: 0
})

// 对话框状态
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const showExportDialog = ref(false)

// 导出相关状态
const exportClassId = ref('')
const exportStartDate = ref('')
const exportEndDate = ref('')
const exporting = ref(false)

// 表单数据
const newClassName = ref('')
const creating = ref(false)
const deleting = ref(false)
const loadingDetail = ref(false)

// 选中的班级和详情
const selectedClass = ref(null)
const classDetail = ref(null)
const classAnalysis = ref(null)

// 学生人数缓存
const studentCounts = ref({})

// 计算属性：分页按钮
const paginationPages = computed(() => {
  const pages = []
  const total = pagination.pages
  const current = pagination.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// 排序后的班级列表计算属性
const sortedClassList = computed(() => {
  if (!classList.value || classList.value.length === 0) {
    return []
  }

  // 如果是创建时间排序，直接返回（由API处理）
  if (sortField.value === 'create_time') {
    return classList.value
  }

  // 前端排序处理
  const sorted = [...classList.value].sort((a, b) => {
    let aValue, bValue

    if (sortField.value === 'cid') {
      aValue = a.cid
      bValue = b.cid
    } else if (sortField.value === 'class_name') {
      aValue = a.class_name
      bValue = b.class_name
    } else {
      return 0
    }

    // 数值排序
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
    }

    // 字符串排序
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue, 'zh-CN')
      return sortDirection.value === 'asc' ? result : -result
    }

    return 0
  })

  return sorted
})

// 导出相关计算属性
const todayDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const canExport = computed(() => {
  return exportClassId.value && exportStartDate.value && exportEndDate.value
})

// 方法
const fetchClasses = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: pagination.page,
      size: pagination.size,
      order: sortField.value === 'create_time' ? sortDirection.value : sortOrder.value
    }

    const response = await AdminClassService.getClassList(params)

    // 根据管理员权限过滤班级
    const allowedClasses = AuthService.getAdminClasses()
    if (allowedClasses !== null && Array.isArray(response.data)) {
      classList.value = response.data.filter(cls => allowedClasses.includes(cls.cid))
      pagination.total = classList.value.length
    } else {
      classList.value = response.data || []
      Object.assign(pagination, response.pagination)
    }

    // 获取每个班级的学生人数
    await fetchStudentCounts()

  } catch (err) {
    error.value = err.message || t('component.getClassListFailed')
    console.error(t('component.getClassListFailed') + ':', err)
  } finally {
    loading.value = false
  }
}

const fetchStudentCounts = async () => {
  for (const classItem of classList.value) {
    try {
      const detail = await AdminClassService.getClassDetail(classItem.cid)
      studentCounts.value[classItem.cid] = detail.data.students?.length || 0
    } catch (err) {
      studentCounts.value[classItem.cid] = 0
    }
  }
}

const getStudentCount = (cid) => {
  return studentCounts.value[cid] || 0
}

const handleSearch = () => {
  // 简单的前端搜索
  // 在实际项目中，应该发送搜索请求到后端
  pagination.page = 1
  fetchClasses()
}

const changePage = (page) => {
  if (page !== '...' && page !== pagination.page) {
    pagination.page = page
    fetchClasses()
  }
}

const handlePageSizeChange = () => {
  // 每页显示数量变化时，重置到第一页
  pagination.page = 1
  fetchClasses()
}

// 排序处理方法
const handleSort = (field) => {
  if (sortField.value === field) {
    // 如果点击的是当前排序字段，切换排序方向
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 如果点击的是新字段，设置为新字段并默认降序
    sortField.value = field
    sortDirection.value = 'desc'
  }

  // 如果是创建时间排序，需要重新请求API
  if (field === 'create_time') {
    pagination.page = 1 // 重置到第一页
    fetchClasses()
  }
  // 其他排序由计算属性自动处理，不需要重新请求
}

// 自定义下拉框方法（仅保留每页显示数量）
const togglePageSizeDropdown = () => {
  showPageSizeDropdown.value = !showPageSizeDropdown.value
}

const selectPageSizeOption = (value) => {
  pagination.size = value
  showPageSizeDropdown.value = false
  handlePageSizeChange()
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  if (pageSizeSelectRef.value && !pageSizeSelectRef.value.contains(event.target)) {
    showPageSizeDropdown.value = false
  }
}

const createClass = async () => {
  if (!newClassName.value.trim()) {
    return
  }

  try {
    creating.value = true
    await AdminClassService.createClass(newClassName.value.trim())

    showCreateDialog.value = false
    newClassName.value = ''

    // 刷新列表
    pagination.page = 1
    await fetchClasses()

    // 显示成功通知
    notificationService.success(t('component.classCreatedSuccess'))

  } catch (err) {
    error.value = err.message || t('component.createClassFailed')
    notificationService.error(err.message || t('component.createClassFailed'))
    console.error(t('component.createClassFailed') + ':', err)
  } finally {
    creating.value = false
  }
}

const viewClassDetail = async (classItem) => {
  selectedClass.value = classItem
  showDetailDialog.value = true
  loadingDetail.value = true
  classAnalysis.value = null

  try {
    // 并行获取班级详情和分析数据
    const [detailResponse, analysisResponse] = await Promise.all([
      AdminClassService.getClassDetail(classItem.cid),
      AdminClassService.getClassAnalysis(classItem.cid).catch(err => {
        console.warn(t('component.getClassAnalysisFailed') + ':', err)
        return null
      })
    ])

    classDetail.value = detailResponse.data
    classAnalysis.value = analysisResponse?.data || null
  } catch (err) {
    error.value = err.message || t('component.getClassDetailFailed')
    console.error(t('component.getClassDetailFailed') + ':', err)
  } finally {
    loadingDetail.value = false
  }
}

const confirmDelete = (classItem) => {
  selectedClass.value = classItem
  showDeleteDialog.value = true
}

const deleteClass = async () => {
  if (!selectedClass.value) {
    return
  }

  try {
    deleting.value = true
    await AdminClassService.deleteClass(selectedClass.value.cid)

    showDeleteDialog.value = false
    selectedClass.value = null

    // 刷新列表
    await fetchClasses()

    // 显示成功通知
    notificationService.success(t('component.classDeletedSuccess'))

  } catch (err) {
    error.value = err.message || t('component.deleteClassFailed')
    notificationService.error(err.message || t('component.deleteClassFailed'))
    console.error(t('component.deleteClassFailed') + ':', err)
  } finally {
    deleting.value = false
  }
}

// 导出相关方法
const openExportDialog = () => {
  exportClassId.value = ''
  exportStartDate.value = ''
  exportEndDate.value = ''
  showExportDialog.value = true
}

const setDateRange = (range) => {
  const today = new Date()
  const end = new Date(today)
  let start = new Date(today)

  switch (range) {
    case 'week':
      start.setDate(start.getDate() - 7)
      break
    case 'month':
      start.setMonth(start.getMonth() - 1)
      break
    case 'quarter':
      start.setMonth(start.getMonth() - 3)
      break
  }

  exportStartDate.value = start.toISOString().split('T')[0]
  exportEndDate.value = end.toISOString().split('T')[0]
}

const formatDateToYYYYMMDD = (dateStr) => {
  return dateStr.replace(/-/g, '')
}

const exportClassData = async () => {
  if (!canExport.value) return

  try {
    exporting.value = true
    const startDate = formatDateToYYYYMMDD(exportStartDate.value)
    const endDate = formatDateToYYYYMMDD(exportEndDate.value)

    const blob = await AnalysisService.exportClassAttendance(
      exportClassId.value,
      startDate,
      endDate
    )

    // 获取班级名称用于文件名
    const classItem = classList.value.find(c => c.cid === exportClassId.value)
    const className = classItem ? classItem.class_name : `class_${exportClassId.value}`
    const filename = `${className}_attendance_${startDate}_${endDate}.xlsx`

    AnalysisService.downloadExcel(blob, filename)

    notificationService.success(t('component.exportSuccess'))
    showExportDialog.value = false
  } catch (err) {
    console.error('Export failed:', err)
    notificationService.error(err.message || t('component.exportFailed'))
  } finally {
    exporting.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return $t('common.unknown')
  const date = new Date(timestamp) // API返回的是毫秒级时间戳
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(() => {
  fetchClasses()
  // 添加点击外部关闭下拉框的事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 下拉框动画 */
@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .p-6 {
    padding: 16px;
  }

  .text-4xl {
    font-size: 2rem;
  }

  .flex-wrap {
    flex-direction: column;
    gap: 16px;
  }

  .flex-wrap {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .justify-between {
    justify-content: space-between;
  }

  .min-w-40 {
    min-width: 140px;
  }

  .py-2\.5.px-4 {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .min-w-\[300px\] {
    min-width: auto;
  }

  .py-4.px-6 {
    padding: 12px 16px;
    font-size: 0.8rem;
  }

  .py-4.px-6 {
    padding: 12px 16px;
  }

  .px-2 {
    padding: 0 4px;
  }

  .text-lg {
    font-size: 1rem;
  }

  .text-xs {
    gap: 0;
  }

  .text-xs {
    font-size: 0.6rem;
  }

}

@media (max-width: 480px) {
  .p-6 {
    padding: 12px;
  }

  .text-4xl {
    font-size: 1.75rem;
  }

  .min-w-40 {
    min-width: 120px;
  }

  .py-2\.5.px-4 {
    padding: 6px 10px;
    font-size: 0.75rem;
  }

  .py-3.px-4 {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .py-4.px-6 {
    padding: 10px 12px;
    font-size: 0.75rem;
  }

  .py-4.px-6 {
    padding: 10px 12px;
  }

  .px-2 {
    padding: 0 2px;
  }

  .text-lg {
    font-size: 0.9rem;
  }

  .text-sm {
    font-size: 0.75rem;
    padding: 2px 6px;
  }

  .text-sm {
    font-size: 0.75rem;
  }

  .w-9.h-9 {
    width: 32px;
    height: 32px;
  }

  .text-base {
    font-size: 0.9rem;
  }

  .flex {
    flex-direction: column;
  }
}
</style>
