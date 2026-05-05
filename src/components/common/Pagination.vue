<template>
  <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
    <div class="text-sm text-[var(--color-text-tertiary)]">
      显示第 {{ startItem }} - {{ endItem }} 条，共 {{ totalItems }} 条记录
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-sm transition-colors duration-200"
        :class="
          currentPage === 1
            ? 'cursor-not-allowed text-[var(--color-text-tertiary)] opacity-60'
            : 'text-[var(--color-text-secondary)] hover:bg-white/8'
        "
      >
        首页
      </button>

      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-sm transition-colors duration-200"
        :class="
          currentPage === 1
            ? 'cursor-not-allowed text-[var(--color-text-tertiary)] opacity-60'
            : 'text-[var(--color-text-secondary)] hover:bg-white/8'
        "
      >
        上一页
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="rounded-full border px-3 py-1.5 text-sm transition-colors duration-200"
        :class="
          page === currentPage
            ? 'border-[rgba(var(--color-primary-rgb),0.22)] bg-[rgba(var(--color-primary-rgb),0.18)] text-foreground'
            : 'border-white/8 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/8'
        "
      >
        {{ page }}
      </button>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-sm transition-colors duration-200"
        :class="
          currentPage === totalPages
            ? 'cursor-not-allowed text-[var(--color-text-tertiary)] opacity-60'
            : 'text-[var(--color-text-secondary)] hover:bg-white/8'
        "
      >
        下一页
      </button>

      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-sm transition-colors duration-200"
        :class="
          currentPage === totalPages
            ? 'cursor-not-allowed text-[var(--color-text-tertiary)] opacity-60'
            : 'text-[var(--color-text-secondary)] hover:bg-white/8'
        "
      >
        末页
      </button>

      <div class="flex items-center gap-2 xl:ml-4">
        <span class="text-sm text-[var(--color-text-tertiary)]">跳转到</span>
        <input
          v-model="inputPage"
          @keyup.enter="jumpToPage"
          type="number"
          :min="1"
          :max="totalPages"
          class="w-16 rounded-full border border-white/8 bg-white/5 px-2 py-1 text-center text-sm text-foreground focus:border-[rgba(var(--color-primary-rgb),0.32)] focus:outline-none"
        />
        <span class="text-sm text-[var(--color-text-tertiary)]">页</span>
        <button
          @click="jumpToPage"
          class="rounded-full border border-[rgba(var(--color-primary-rgb),0.18)] bg-[rgba(var(--color-primary-rgb),0.16)] px-3 py-1 text-sm text-foreground transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.22)]"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(["page-change"])

const inputPage = ref(props.currentPage)

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

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  return pages
})

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("page-change", page)
  }
}

function jumpToPage() {
  const page = Number.parseInt(inputPage.value, 10)
  if (page >= 1 && page <= props.totalPages) {
    goToPage(page)
  } else {
    inputPage.value = props.currentPage
  }
}

watch(
  () => props.currentPage,
  (newPage) => {
    inputPage.value = newPage
  }
)
</script>
