<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="board-kicker mb-2">Student Operations</div>
        <h1 class="panel-title !text-3xl md:!text-4xl">{{ $t('ui.studentManagement') }}</h1>
        <p class="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
          {{ $t('ui.manageStudentInfo') }}
        </p>
      </div>
      <span class="info-pill !px-3 !py-1.5">
        {{ $t('ui.selectedClasses', { count: selectedClassIds.length }) }}
      </span>
    </header>

    <section class="board-shell p-5 md:p-6">
      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              {{ $t('ui.selectClass') }}
            </label>
            <div class="relative student-class-dropdown">
              <button
                @click="showClassDropdown = !showClassDropdown"
                class="flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-3 text-left text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-white/8"
              >
                <span class="truncate">{{ getSelectedClassesText() }}</span>
                <span class="ml-3 text-[var(--color-text-tertiary)]">{{ showClassDropdown ? '▲' : '▼' }}</span>
              </button>

              <div
                v-if="showClassDropdown"
                class="board-shell absolute left-0 right-0 top-[calc(100%+0.65rem)] z-20 overflow-hidden rounded-[1.5rem]"
              >
                <div class="border-b border-white/8 p-3">
                  <label class="flex cursor-pointer items-center gap-3 rounded-[1rem] px-3 py-2 transition hover:bg-white/5">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      :indeterminate="isIndeterminate"
                      @change="toggleSelectAll"
                      class="h-4 w-4"
                    />
                    <span class="text-sm font-medium text-foreground">
                      {{ $t('ui.selectAll') }} ({{ classList.length }}{{ $t('ui.classes') }})
                    </span>
                  </label>
                </div>

                <div class="max-h-56 overflow-y-auto p-2">
                  <label
                    v-for="classItem in classList"
                    :key="classItem.cid"
                    class="flex cursor-pointer items-center gap-3 rounded-[1rem] px-3 py-3 transition hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      :value="classItem.cid"
                      v-model="selectedClassIds"
                      class="h-4 w-4"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm text-foreground">{{ classItem.class_name }}</div>
                      <div class="text-xs text-[var(--color-text-tertiary)]">ID {{ classItem.cid }}</div>
                    </div>
                  </label>
                </div>

                <div class="flex gap-2 border-t border-white/8 p-3">
                  <button
                    @click="confirmClassSelection"
                    class="rounded-[1rem] border border-[rgba(var(--color-primary-rgb),0.2)] bg-[rgba(var(--color-primary-rgb),0.16)] px-4 py-2 text-sm text-foreground transition hover:bg-[rgba(var(--color-primary-rgb),0.22)]"
                  >
                    {{ $t('ui.confirmSelection') }}
                  </button>
                  <button
                    @click="showClassDropdown = false"
                    class="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-2 text-sm text-[var(--color-text-secondary)] transition hover:bg-white/8"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="relative min-w-[16rem] flex-1">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('ui.searchStudentPlaceholder')"
                class="w-full rounded-[1.25rem] border border-white/10 bg-white/6 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-[var(--color-text-tertiary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              />
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">/</span>
            </div>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-[var(--color-text-secondary)] transition hover:bg-white/8"
            >
              {{ $t('ui.clear') }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-start justify-end gap-3 xl:justify-end">
          <button
            @click="openExportDialog"
            :disabled="filteredStudents.length === 0"
            class="rounded-[1.1rem] border border-[rgba(111,151,138,0.24)] bg-[rgba(111,151,138,0.16)] px-4 py-3 text-sm text-[#d7e7e1] transition hover:bg-[rgba(111,151,138,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ $t('analysis.export') }}
          </button>
          <button
            @click="showAddModal = true"
            class="rounded-[1.1rem] border border-[rgba(176,155,116,0.24)] bg-[rgba(176,155,116,0.16)] px-4 py-3 text-sm text-[#eadfc5] transition hover:bg-[rgba(176,155,116,0.22)]"
          >
            {{ $t('ui.addStudent') }}
          </button>
          <button
            @click="refreshData"
            :disabled="loading"
            class="rounded-[1.1rem] border border-[rgba(var(--color-primary-rgb),0.22)] bg-[rgba(var(--color-primary-rgb),0.16)] px-4 py-3 text-sm text-foreground transition hover:bg-[rgba(var(--color-primary-rgb),0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ loading ? $t('ui.refreshing') : $t('ui.refresh') }}
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-3 md:grid-cols-3">
      <div class="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(135deg,rgba(69,86,111,0.38),rgba(19,24,32,0.92))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#bdc8da]">{{ $t('ui.totalStudents') }}</div>
        <div class="text-4xl font-semibold tracking-[-0.06em] text-white">{{ totalStudents }}</div>
      </div>
      <div class="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(135deg,rgba(77,103,96,0.4),rgba(18,24,23,0.92))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#cfe1d9]">{{ $t('ui.studentsInSchool') }}</div>
        <div class="text-4xl font-semibold tracking-[-0.06em] text-white">{{ attendingStudents }}</div>
      </div>
      <div class="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(135deg,rgba(110,79,89,0.42),rgba(24,18,21,0.92))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e1cad2]">{{ $t('ui.studentsLeftSchool') }}</div>
        <div class="text-4xl font-semibold tracking-[-0.06em] text-white">{{ absentStudents }}</div>
      </div>
    </section>

    <section class="board-shell overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-5 md:px-6">
        <div>
          <div class="board-kicker mb-2">Roster</div>
          <h2 class="text-2xl font-semibold tracking-[-0.04em] text-foreground">{{ $t('ui.studentList') }}</h2>
        </div>
        <div class="text-sm text-[var(--color-text-tertiary)]">
          {{ $t('ui.showingRecords', { start: startItem, end: endItem, total: filteredStudents.length }) }}
        </div>
      </div>

      <div class="overflow-x-auto">
        <div v-if="loading" class="flex items-center justify-center gap-3 px-6 py-16">
          <LoadingSpinner />
          <span class="text-sm text-[var(--color-text-secondary)]">{{ $t('ui.loadingStudentList') }}</span>
        </div>

        <div v-else-if="filteredStudents.length === 0" class="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-tertiary)]">Empty State</div>
          <div class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {{ selectedClassIds.length === 0 ? $t('ui.pleaseSelectClass') :
               searchQuery ? $t('ui.noMatchingStudents') : $t('ui.noStudentData') }}
          </div>
          <div class="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
            {{ selectedClassIds.length === 0 ? $t('ui.selectClassFromDropdown') :
               searchQuery ? $t('ui.tryOtherKeywords') : $t('ui.noStudentsAddedYet') }}
          </div>
          <button
            v-if="selectedClassIds.length > 0 && !searchQuery"
            @click="showAddModal = true"
            class="mt-5 rounded-[1rem] border border-[rgba(176,155,116,0.24)] bg-[rgba(176,155,116,0.16)] px-4 py-3 text-sm text-[#eadfc5] transition hover:bg-[rgba(176,155,116,0.22)]"
          >
            {{ $t('ui.addStudentNow') }}
          </button>
        </div>

        <table v-else class="w-full min-w-[820px]">
          <thead>
            <tr class="border-b border-white/8 bg-white/[0.03]">
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">{{ $t('ui.class') }}</th>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">{{ $t('ui.studentId') }}</th>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">{{ $t('ui.name') }}</th>
              <th class="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">{{ $t('ui.attendanceStatus') }}</th>
              <th class="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">{{ $t('ui.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in paginatedStudents"
              :key="`${student.cid}-${student.sid}`"
              class="border-b border-white/6 transition hover:bg-white/[0.04]"
            >
              <td class="px-4 py-4 text-sm text-[var(--color-text-secondary)]">
                {{ getClassName(student.cid) }}
              </td>
              <td class="px-4 py-4 text-sm text-[var(--color-text-secondary)]">
                {{ student.sid }}
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-slate-100"
                    :class="getAvatarColor(student.student_name)"
                  >
                    {{ getNameInitial(student.student_name) }}
                  </div>
                  <span class="font-medium text-foreground">{{ student.student_name }}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-center">
                <button
                  @click="toggleAttendance(student)"
                  class="rounded-full px-3 py-1.5 text-sm font-medium transition"
                  :class="student.attendance
                    ? 'border border-[rgba(111,151,138,0.24)] bg-[rgba(111,151,138,0.16)] text-[#d7e7e1] hover:bg-[rgba(111,151,138,0.22)]'
                    : 'border border-[rgba(199,121,134,0.24)] bg-[rgba(199,121,134,0.16)] text-[#f0d7dd] hover:bg-[rgba(199,121,134,0.22)]'"
                >
                  {{ student.attendance ? $t('ui.inSchool') : $t('ui.leftSchool') }}
                </button>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="showStudentDetail(student)"
                    class="rounded-[0.9rem] border border-[rgba(157,151,189,0.24)] bg-[rgba(157,151,189,0.16)] px-3 py-1.5 text-sm text-[#e1dbf4] transition hover:bg-[rgba(157,151,189,0.22)]"
                    :title="$t('ui.viewDetails')"
                  >
                    {{ $t('ui.details') }}
                  </button>
                  <button
                    @click="deleteStudent(student)"
                    class="rounded-[0.9rem] border border-[rgba(199,121,134,0.24)] bg-[rgba(199,121,134,0.14)] px-3 py-1.5 text-sm text-[#f0d7dd] transition hover:bg-[rgba(199,121,134,0.22)]"
                    :title="$t('ui.deleteStudent')"
                  >
                    {{ $t('ui.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredStudents.length > 0" class="flex flex-col gap-4 border-t border-white/8 px-5 py-5 md:px-6">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
            <span>{{ $t('ui.itemsPerPage') }}</span>
            <select
              v-model="pageSize"
              @change="currentPage = 1"
              class="rounded-[0.9rem] border border-white/10 bg-white/6 px-3 py-2 text-sm text-foreground"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>{{ $t('ui.items') }}</span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="rounded-[0.9rem] border px-3 py-2 text-sm transition"
              :class="currentPage === 1
                ? 'cursor-not-allowed border-white/8 bg-white/[0.03] text-[var(--color-text-tertiary)]'
                : 'border-white/10 bg-white/6 text-[var(--color-text-secondary)] hover:bg-white/8'"
            >
              {{ $t('ui.firstPage') }}
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="rounded-[0.9rem] border px-3 py-2 text-sm transition"
              :class="currentPage === 1
                ? 'cursor-not-allowed border-white/8 bg-white/[0.03] text-[var(--color-text-tertiary)]'
                : 'border-white/10 bg-white/6 text-[var(--color-text-secondary)] hover:bg-white/8'"
            >
              {{ $t('ui.previousPage') }}
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              class="rounded-[0.9rem] border px-3 py-2 text-sm transition"
              :class="page === currentPage
                ? 'border-[rgba(var(--color-primary-rgb),0.24)] bg-[rgba(var(--color-primary-rgb),0.18)] text-foreground'
                : 'border-white/10 bg-white/6 text-[var(--color-text-secondary)] hover:bg-white/8'"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="rounded-[0.9rem] border px-3 py-2 text-sm transition"
              :class="currentPage === totalPages
                ? 'cursor-not-allowed border-white/8 bg-white/[0.03] text-[var(--color-text-tertiary)]'
                : 'border-white/10 bg-white/6 text-[var(--color-text-secondary)] hover:bg-white/8'"
            >
              {{ $t('ui.nextPage') }}
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="rounded-[0.9rem] border px-3 py-2 text-sm transition"
              :class="currentPage === totalPages
                ? 'cursor-not-allowed border-white/8 bg-white/[0.03] text-[var(--color-text-tertiary)]'
                : 'border-white/10 bg-white/6 text-[var(--color-text-secondary)] hover:bg-white/8'"
            >
              {{ $t('ui.lastPage') }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span>{{ $t('ui.jumpTo') }}</span>
          <input
            v-model="jumpToPage"
            @keyup.enter="handleJumpToPage"
            type="number"
            :min="1"
            :max="totalPages"
            class="w-20 rounded-[0.9rem] border border-white/10 bg-white/6 px-3 py-2 text-center text-sm text-foreground"
          />
          <span>{{ $t('ui.page') }}</span>
          <button
            @click="handleJumpToPage"
            class="rounded-[0.9rem] border border-[rgba(var(--color-primary-rgb),0.22)] bg-[rgba(var(--color-primary-rgb),0.16)] px-3 py-2 text-sm text-foreground transition hover:bg-[rgba(var(--color-primary-rgb),0.22)]"
          >
            {{ $t('ui.confirm') }}
          </button>
        </div>
      </div>
    </section>

    <AddStudentModal
      v-if="showAddModal"
      :cid="selectedClassIds.length > 0 ? selectedClassIds[0] : null"
      :classList="classList"
      @close="showAddModal = false"
      @success="handleAddStudentSuccess"
    />

    <StudentDetailModal
      v-if="showDetailModal && selectedStudent"
      :student="selectedStudent"
      @close="closeDetailModal"
    />

    <div
      v-if="showExportDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(6,8,12,0.82)] px-4 backdrop-blur-md"
      @click.self="showExportDialog = false"
    >
      <div class="board-shell w-full max-w-2xl overflow-hidden rounded-[2rem]">
        <div class="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <div class="board-kicker mb-2">Export</div>
            <h3 class="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {{ $t('analysis.export') }} - {{ $t('ui.studentData') }}
            </h3>
          </div>
          <button
            @click="showExportDialog = false"
            class="rounded-full border border-white/10 bg-white/6 p-2 text-[var(--color-text-secondary)] transition hover:bg-white/8"
          >
            X
          </button>
        </div>

        <div class="space-y-6 px-6 py-6">
          <div>
            <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              {{ $t('ui.selectStudents') }}
            </label>
            <label class="mb-3 flex cursor-pointer items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                :checked="isAllStudentsSelected"
                :indeterminate="isStudentsIndeterminate"
                @change="toggleSelectAllStudents"
                class="h-4 w-4"
              />
              <span>{{ $t('ui.selectAll') }} ({{ filteredStudents.length }}{{ $t('pagination.peopleUnit') }})</span>
            </label>
            <div class="max-h-44 space-y-1 overflow-y-auto rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-2">
              <label
                v-for="student in filteredStudents"
                :key="student.sid"
                class="flex cursor-pointer items-center gap-3 rounded-[1rem] px-3 py-2 transition hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  :value="student.sid"
                  v-model="exportStudentIds"
                  class="h-4 w-4"
                />
                <span class="text-sm text-foreground">{{ student.student_name }}</span>
                <span class="text-xs text-[var(--color-text-tertiary)]">ID {{ student.sid }}</span>
              </label>
            </div>
            <div class="mt-2 text-sm text-[var(--color-text-tertiary)]">
              {{ $t('ui.selectedCount', { count: exportStudentIds.length }) }}
            </div>
          </div>

          <div>
            <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              {{ $t('analysis.dateRange') }}
            </label>
            <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-end">
              <div>
                <label class="mb-2 block text-sm text-[var(--color-text-secondary)]">{{ $t('ui.startDate') }}</label>
                <input
                  type="date"
                  v-model="exportStartDate"
                  :max="exportEndDate || todayDate"
                  class="w-full rounded-[1rem] border border-white/10 bg-white/6 px-3 py-3 text-sm text-foreground"
                />
              </div>
              <div class="text-center text-[var(--color-text-tertiary)]">~</div>
              <div>
                <label class="mb-2 block text-sm text-[var(--color-text-secondary)]">{{ $t('ui.endDate') }}</label>
                <input
                  type="date"
                  v-model="exportEndDate"
                  :min="exportStartDate"
                  :max="todayDate"
                  class="w-full rounded-[1rem] border border-white/10 bg-white/6 px-3 py-3 text-sm text-foreground"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              {{ $t('ui.quickSelect') }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button @click="setDateRange('week')" class="rounded-[0.9rem] border border-white/10 bg-white/6 px-3 py-2 text-sm text-[var(--color-text-secondary)] transition hover:bg-white/8">{{ $t('ui.lastWeek') }}</button>
              <button @click="setDateRange('month')" class="rounded-[0.9rem] border border-white/10 bg-white/6 px-3 py-2 text-sm text-[var(--color-text-secondary)] transition hover:bg-white/8">{{ $t('ui.lastMonth') }}</button>
              <button @click="setDateRange('quarter')" class="rounded-[0.9rem] border border-white/10 bg-white/6 px-3 py-2 text-sm text-[var(--color-text-secondary)] transition hover:bg-white/8">{{ $t('ui.lastQuarter') }}</button>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-end gap-3 border-t border-white/8 px-6 py-5">
          <button
            @click="showExportDialog = false"
            class="rounded-[1rem] border border-white/10 bg-white/6 px-5 py-3 text-sm text-[var(--color-text-secondary)] transition hover:bg-white/8"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="exportStudentData"
            :disabled="exporting || !canExport"
            class="rounded-[1rem] border border-[rgba(111,151,138,0.24)] bg-[rgba(111,151,138,0.16)] px-5 py-3 text-sm text-[#d7e7e1] transition hover:bg-[rgba(111,151,138,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ exporting ? $t('ui.exporting') : $t('analysis.export') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import AddStudentModal from '@/components/student/AddStudentModal.vue'
import StudentDetailModal from '@/components/student/StudentDetailModal.vue'
import StudentService from '@/services/basic/student.js'
import StudentAdminService from '@/services/admin/student.js'
import ClassService from '@/services/basic/class.js'
import AuthService from '@/services/common/auth.js'
import AnalysisService from '@/services/basic/analysis.js'
import notificationService from '@/services/common/notification.js'

const { t: $t } = useI18n()

const students = ref([])
const classList = ref([])
const loading = ref(false)
const classLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const jumpToPage = ref(1)

const selectedClassIds = ref([])
const showClassDropdown = ref(false)

const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedStudent = ref(null)
const showExportDialog = ref(false)

const exportStudentIds = ref([])
const exportStartDate = ref('')
const exportEndDate = ref('')
const exporting = ref(false)

const isAllSelected = computed(() => {
  return classList.value.length > 0 && selectedClassIds.value.length === classList.value.length
})

const isIndeterminate = computed(() => {
  return selectedClassIds.value.length > 0 && selectedClassIds.value.length < classList.value.length
})

const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) return students.value

  const query = searchQuery.value.toLowerCase().trim()
  return students.value.filter((student) =>
    student.student_name.toLowerCase().includes(query) ||
    student.sid.toString().includes(query)
  )
})

const totalStudents = computed(() => students.value.length)
const attendingStudents = computed(() => students.value.filter((student) => student.attendance).length)
const absentStudents = computed(() => students.value.filter((student) => !student.attendance).length)

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

const startItem = computed(() => {
  return filteredStudents.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredStudents.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  return pages
})

const todayDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const canExport = computed(() => {
  return exportStudentIds.value.length > 0 && exportStartDate.value && exportEndDate.value
})

const isAllStudentsSelected = computed(() => {
  return filteredStudents.value.length > 0 && exportStudentIds.value.length === filteredStudents.value.length
})

const isStudentsIndeterminate = computed(() => {
  return exportStudentIds.value.length > 0 && exportStudentIds.value.length < filteredStudents.value.length
})

const getClassName = (cid) => {
  const classItem = classList.value.find((item) => item.cid === cid)
  return classItem ? classItem.class_name : $t('ui.unknownClass', { cid })
}

const getSelectedClassesText = () => {
  if (selectedClassIds.value.length === 0) {
    return $t('ui.pleaseSelectClass')
  }

  if (selectedClassIds.value.length === 1) {
    return getClassName(selectedClassIds.value[0])
  }

  if (selectedClassIds.value.length === classList.value.length) {
    return $t('ui.allClasses', { count: selectedClassIds.value.length })
  }

  return $t('ui.selectedClasses', { count: selectedClassIds.value.length })
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedClassIds.value = []
    return
  }

  selectedClassIds.value = classList.value.map((classItem) => classItem.cid)
}

const confirmClassSelection = () => {
  showClassDropdown.value = false
  fetchStudents()
}

const getNameInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const getAvatarColor = (name) => {
  const colors = [
    'bg-[linear-gradient(135deg,#7f5f72,#57414d)]',
    'bg-[linear-gradient(135deg,#5b6d8a,#445165)]',
    'bg-[linear-gradient(135deg,#5c776d,#41584f)]',
    'bg-[linear-gradient(135deg,#8a7756,#5f523b)]',
    'bg-[linear-gradient(135deg,#6e668b,#4b4561)]',
    'bg-[linear-gradient(135deg,#8b6374,#5b4450)]',
    'bg-[linear-gradient(135deg,#61708d,#46526a)]',
    'bg-[linear-gradient(135deg,#5b7e7e,#436060)]',
  ]
  const hash = name.split('').reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const fetchClassList = async () => {
  try {
    classLoading.value = true
    let response = await ClassService.getAllClasses()

    const allowedClasses = AuthService.getAdminClasses()
    if (allowedClasses !== null && Array.isArray(response)) {
      response = response.filter((classItem) => allowedClasses.includes(classItem.cid))
    }

    classList.value = response || []
  } catch (error) {
    console.error(`${$t('component.getClassListFailed')}:`, error)
    notificationService.error(error.message || $t('component.getClassListFailed'))
    classList.value = []
  } finally {
    classLoading.value = false
  }
}

const fetchStudents = async () => {
  if (selectedClassIds.value.length === 0) {
    students.value = []
    return
  }

  try {
    loading.value = true
    const allStudents = []

    const promises = selectedClassIds.value.map(async (cid) => {
      try {
        const response = await StudentService.getStudentListAll(cid)
        if (response && response.data) {
          return response.data.map((student) => ({
            ...student,
            cid,
          }))
        }
        return []
      } catch (error) {
        console.error(`${$t('component.getStudentsForClassFailed', { className: cid })}:`, error)
        notificationService.warn($t('component.getStudentsForClassFailed', { className: getClassName(cid) }))
        return []
      }
    })

    const results = await Promise.all(promises)
    results.forEach((studentList) => {
      allStudents.push(...studentList)
    })

    students.value = allStudents
  } catch (error) {
    console.error(`${$t('component.getStudentListFailed')}:`, error)
    notificationService.error($t('component.getStudentListFailed'))
    students.value = []
  } finally {
    loading.value = false
  }
}

const toggleAttendance = async (student) => {
  try {
    const newAttendance = !student.attendance
    await StudentAdminService.changeAttendance(student.sid, newAttendance)
    student.attendance = newAttendance

    notificationService.success(
      `${student.student_name} ${$t('component.statusChangedTo')} ${newAttendance ? $t('ui.inSchool') : $t('ui.leftSchool')}`,
    )
  } catch (error) {
    console.error(`${$t('component.changeAttendanceStatusFailed')}:`, error)
    notificationService.error(error.message || $t('component.changeAttendanceStatusFailed'))
  }
}

const deleteStudent = async (student) => {
  if (!confirm($t('component.confirmDeleteStudent', { studentName: student.student_name }))) {
    return
  }

  try {
    await StudentAdminService.deleteStudent(student.sid)

    const index = students.value.findIndex((item) => item.sid === student.sid)
    if (index > -1) {
      students.value.splice(index, 1)
    }

    notificationService.success($t('component.deleteStudentSuccess', { studentName: student.student_name }))
  } catch (error) {
    console.error(`${$t('component.deleteStudentFailed')}:`, error)
    notificationService.error(error.message || $t('component.deleteStudentFailed'))
  }
}

const showStudentDetail = (student) => {
  selectedStudent.value = student
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedStudent.value = null
  fetchStudents()
}

const handleAddStudentSuccess = () => {
  showAddModal.value = false
  fetchStudents()
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const refreshData = () => {
  fetchStudents()
}

const handleJumpToPage = () => {
  const page = parseInt(jumpToPage.value, 10)
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
  jumpToPage.value = currentPage.value
}

const openExportDialog = () => {
  exportStudentIds.value = []
  exportStartDate.value = ''
  exportEndDate.value = ''
  showExportDialog.value = true
}

const toggleSelectAllStudents = () => {
  if (isAllStudentsSelected.value) {
    exportStudentIds.value = []
    return
  }

  exportStudentIds.value = filteredStudents.value.map((student) => student.sid)
}

const setDateRange = (range) => {
  const today = new Date()
  const end = new Date(today)
  const start = new Date(today)

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
    default:
      break
  }

  exportStartDate.value = start.toISOString().split('T')[0]
  exportEndDate.value = end.toISOString().split('T')[0]
}

const formatDateToYYYYMMDD = (dateStr) => {
  return dateStr.replace(/-/g, '')
}

const exportStudentData = async () => {
  if (!canExport.value) return

  try {
    exporting.value = true
    const startDate = formatDateToYYYYMMDD(exportStartDate.value)
    const endDate = formatDateToYYYYMMDD(exportEndDate.value)

    const blob = await AnalysisService.exportStudentsAttendance(
      exportStudentIds.value,
      startDate,
      endDate
    )

    const filename = `students_attendance_${startDate}_${endDate}.xlsx`
    AnalysisService.downloadExcel(blob, filename)

    notificationService.success($t('component.exportSuccess'))
    showExportDialog.value = false
  } catch (error) {
    console.error('Export failed:', error)
    notificationService.error(error.message || $t('component.exportFailed'))
  } finally {
    exporting.value = false
  }
}

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(pageSize, () => {
  currentPage.value = 1
})

watch(currentPage, (newPage) => {
  jumpToPage.value = newPage
})

watch(selectedClassIds, () => {
  currentPage.value = 1
}, { deep: true })

const handleClickOutside = (event) => {
  if (!event.target.closest('.student-class-dropdown')) {
    showClassDropdown.value = false
  }
}

onMounted(async () => {
  await fetchClassList()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
