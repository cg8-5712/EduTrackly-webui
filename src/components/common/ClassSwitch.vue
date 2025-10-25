<template>
  <div class="class-switch-wrapper">
    <!-- 班级选择器 -->
    <div class="class-switch-container">
      <input
        v-if="isSearching"
        v-model="searchQuery"
        type="text"
        :placeholder="$t('class.searchPlaceholder')"
        class="search-input"
        @blur="handleBlur"
      />
      <select
        v-else
        v-model="selectedCid"
        @change="onClassChange"
        class="class-select"
      >
        <option value="" disabled>{{ loading ? $t('common.loading') : $t('class.selectClass') }}</option>
        <option
          v-for="cls in filteredClasses"
          :key="cls.cid"
          :value="cls.cid"
          class="class-option"
        >
          {{ cls.class_name }}
        </option>
      </select>
      <button @click="toggleSearch" class="search-button">
        {{ isSearching ? '×' : '🔍' }}
      </button>
    </div>

    <!-- 错误提示通过 MessageInfo 显示 -->
  </div>
</template>

<script>
import ClassService from "@/services/basic/class";
import notificationService from '@/services/common/notification';
import { useI18n } from 'vue-i18n'

export default {
  name: "ClassSwitch",
  emits: ["update:cid"],

  setup() {
    const { t } = useI18n()
    return { t }
  },

  data() {
    return {
      classes: [],        // 班级列表
      searchQuery: "",    // 搜索关键字
      selectedCid: "",    // 当前选中班级 cid
      loading: true,      // 是否加载中
      isSearching: false, // 是否在搜索
    };
  },

  computed: {
    filteredClasses() {
      if (!this.searchQuery) return this.classes;
      const query = this.searchQuery.toLowerCase();
      return this.classes.filter(cls =>
        cls.class_name.toLowerCase().includes(query)
      );
    },
  },

  methods: {
    async fetchClasses() {
      try {
        this.loading = true;
        this.classes = await ClassService.getAllClasses();

        // ✅ 初次加载默认选择 cid 最小的班级
        if (this.classes.length > 0) {
          const minCidClass = this.classes.reduce((prev, curr) => prev.cid < curr.cid ? prev : curr);
          this.selectedCid = minCidClass.cid;
          this.$emit("update:cid", this.selectedCid);
        }
      } catch (error) {
        console.error("加载班级列表失败:", error);
        this.classes = [];
        notificationService.notify(this.t('class.noClasses'), 'error');
      } finally {
        this.loading = false;
      }
    },

    onClassChange() {
      this.$emit("update:cid", this.selectedCid);
    },

    toggleSearch() {
      this.isSearching = !this.isSearching;
      if (!this.isSearching) {
        this.searchQuery = "";
      }
    },

    handleBlur() {
      if (!this.searchQuery) {
        this.isSearching = false;
      }
    }
  },

  mounted() {
    this.fetchClasses();
  },
};
</script>


<style scoped>
.class-switch-wrapper {
  @apply relative w-full max-w-[280px] rounded-lg;
}

.class-switch-container {
  @apply relative flex items-center p-2 overflow-hidden;
  @apply transition-all duration-300 ease-in-out;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

.class-switch-container:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.search-input {
  @apply flex-1 px-2 py-2 rounded-lg outline-none w-full;
  @apply transition-colors duration-300;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.25rem;
}

.search-input::placeholder {
  @apply opacity-70;
  color: var(--color-text-tertiary);
}

.class-select {
  @apply flex-1 px-2 py-2 rounded-lg outline-none w-full cursor-pointer;
  @apply transition-colors duration-300;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  appearance: none;
}

.class-select option {
  @apply py-2 px-2 rounded-lg;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.class-select option:hover {
  background-color: var(--color-background);
}

.search-button {
  @apply px-2 py-1 rounded cursor-pointer;
  @apply transition-all duration-200 ease-in-out;
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: 1.5rem;
}

.search-button:hover {
  @apply scale-110;
  color: var(--color-secondary);
}

.search-button:active {
  @apply scale-95;
}

/* 自定义滚动条样式 */
select::-webkit-scrollbar {
  @apply w-2;
}

select::-webkit-scrollbar-track {
  background: var(--color-background);
}

select::-webkit-scrollbar-thumb {
  @apply rounded-lg;
  @apply transition-colors duration-300;
  background: var(--color-border);
}

select::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .class-switch-wrapper {
    @apply max-w-full;
  }

  .search-input,
  .class-select {
    @apply text-base;
  }

  .search-button {
    @apply text-xl;
  }
}
</style>
