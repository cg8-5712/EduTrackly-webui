<template>
  <div class="flex items-center justify-between">
    <!-- 分页信息 -->
    <div class="text-sm text-gray-400">
      显示第 {{ startItem }} - {{ endItem }} 条，共 {{ totalItems }} 条记录
    </div>

    <!-- 分页控件 -->
    <div class="flex items-center gap-2">
      <!-- 首页 -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded border transition-colors duration-200"
        :class="currentPage === 1
          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'"
      >
        首页
      </button>

      <!-- 上一页 -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded border transition-colors duration-200"
        :class="currentPage === 1
          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'"
      >
        上一页
      </button>

      <!-- 页码按钮 -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="px-3 py-1 rounded border transition-colors duration-200"
        :class="page === currentPage
          ? 'border-blue-500 bg-blue-600 text-white'
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'"
      >
        {{ page }}
      </button>

      <!-- 下一页 -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded border transition-colors duration-200"
        :class="currentPage === totalPages
          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'"
      >
        下一页
      </button>

      <!-- 末页 -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded border transition-colors duration-200"
        :class="currentPage === totalPages
          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'"
      >
        末页
      </button>

      <!-- 页面跳转 -->
      <div class="flex items-center gap-2 ml-4">
        <span class="text-sm text-gray-400">跳转到</span>
        <input
          v-model="inputPage"
          @keyup.enter="jumpToPage"
          type="number"
          :min="1"
          :max="totalPages"
          class="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-200 text-center focus:border-blue-500 focus:outline-none"
        />
        <span class="text-sm text-gray-400">页</span>
        <button
          @click="jumpToPage"
          class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 20
  }
})

// Emits
const emit = defineEmits(['page-change'])

// 状态
const inputPage = ref(props.currentPage)

// 计算属性
const startItem = computed(() => {
  return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  // 调整开始位置
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 方法
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const jumpToPage = () => {
  const page = parseInt(inputPage.value)
  if (page >= 1 && page <= props.totalPages) {
    goToPage(page)
  } else {
    inputPage.value = props.currentPage
  }
}

// 监听当前页变化，更新输入框
watch(() => props.currentPage, (newPage) => {
  inputPage.value = newPage
})
</script>