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
      STORAGE_KEY: 'edutrackly-cg8-5712-last-selected-class', // 班级记忆的存储键名
      DEFAULT_CID: 1,     // 默认班级ID
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
    /**
     * 获取用户最后选择的班级ID
     * @returns {number} 班级ID，如果没有记录则返回默认值1
     */
    getLastSelectedClass() {
      try {
        const savedCid = localStorage.getItem(this.STORAGE_KEY);
        if (savedCid) {
          const cid = parseInt(savedCid, 10);
          if (!isNaN(cid) && cid > 0) {
            console.log(`[ClassSwitch] Loaded last selected class: ${cid}`);
            return cid;
          }
        }
      } catch (error) {
        console.error('[ClassSwitch] Failed to load class:', error);
      }
      console.log(`[ClassSwitch] Using default class: ${this.DEFAULT_CID}`);
      return this.DEFAULT_CID;
    },

    /**
     * 保存用户选择的班级ID
     * @param {number} cid - 班级ID
     */
    saveLastSelectedClass(cid) {
      try {
        if (cid) {
          localStorage.setItem(this.STORAGE_KEY, String(cid));
          console.log(`[ClassSwitch] Saved last selected class: ${cid}`);
        }
      } catch (error) {
        console.error('[ClassSwitch] Failed to save class:', error);
      }
    },

    async fetchClasses() {
      try {
        this.loading = true;
        this.classes = await ClassService.getAllClasses();

        if (this.classes.length > 0) {
          // 获取上次记忆的班级ID
          const rememberedCid = this.getLastSelectedClass();

          // 检查记忆的班级是否存在于当前班级列表中
          const rememberedClass = this.classes.find(cls => cls.cid === rememberedCid);

          if (rememberedClass) {
            // 如果记忆的班级存在，使用它
            this.selectedCid = rememberedCid;
          } else {
            // 如果记忆的班级不存在，选择cid最小的班级
            const minCidClass = this.classes.reduce((prev, curr) => prev.cid < curr.cid ? prev : curr);
            this.selectedCid = minCidClass.cid;
            // 保存新的选择
            this.saveLastSelectedClass(this.selectedCid);
          }

          this.$emit("update:cid", this.selectedCid);
        }
      } catch (error) {
        console.error("加载班级列表失败:", error);
        this.classes = [];
        notificationService.error(this.t('class.noClasses'));
      } finally {
        this.loading = false;
      }
    },

    onClassChange() {
      // 保存用户的班级选择
      this.saveLastSelectedClass(this.selectedCid);
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
@reference "tailwindcss";
.class-switch-wrapper {
  @apply relative w-full rounded-lg;
  max-width: 400px; /* 从 280px 增加到 400px */
}

.class-switch-container {
  @apply relative flex items-center overflow-hidden;
  @apply transition-all duration-300 ease-in-out;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.75rem; /* 从 0.5rem 增加到 0.75rem */
  box-shadow: var(--shadow-md);
  padding: 0.75rem 1rem; /* 从 p-2 增加内边距 */
}

.class-switch-container:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.search-input {
  @apply flex-1 rounded-lg outline-none w-full;
  @apply transition-colors duration-300;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.5rem; /* 从 1.25rem 增加到 1.5rem */
  padding: 0.5rem 0.75rem; /* 增加内边距 */
  font-weight: 600; /* 增加字重 */
}

.search-input::placeholder {
  @apply opacity-70;
  color: var(--color-text-tertiary);
}

.class-select {
  @apply flex-1 rounded-lg outline-none w-full cursor-pointer;
  @apply transition-colors duration-300;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.5rem; /* 从 1.25rem 增加到 1.5rem */
  padding: 0.5rem 0.75rem; /* 增加内边距 */
  font-weight: 600; /* 增加字重 */
  appearance: none;
}

.class-select option {
  @apply py-2 px-3 rounded-lg; /* 增加内边距 */
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 1.125rem; /* 增加选项字体大小 */
}

.class-select option:hover {
  background-color: var(--color-background);
}

.search-button {
  @apply rounded cursor-pointer;
  @apply transition-all duration-200 ease-in-out;
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: 1.75rem; /* 从 1.5rem 增加到 1.75rem */
  padding: 0.5rem; /* 增加内边距 */
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
    @apply text-lg; /* 移动端稍小 */
  }

  .search-button {
    @apply text-xl;
  }
}
</style>
