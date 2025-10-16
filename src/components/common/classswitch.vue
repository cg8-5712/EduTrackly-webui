<template>
  <div class="class-switch-wrapper">
    <!-- 班级选择器 -->
    <div class="class-switch-container">
      <input
        v-if="isSearching"
        v-model="searchQuery"
        type="text"
        placeholder="搜索班级..."
        class="search-input"
        @blur="handleBlur"
      />
      <select
        v-else
        v-model="selectedCid"
        @change="onClassChange"
        class="class-select"
      >
        <option value="" disabled>{{ loading ? '加载中...' : '选择班级' }}</option>
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

export default {
  name: "ClassSwitch",
  emits: ["update:cid"],

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
        notificationService.notify('暂无班级数据，请检查网络连接', 'error');
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
  position: relative;
  width: 100%;
  max-width: 280px;
  border-radius: 0.5rem;
}

.class-switch-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all 0.3s ease;
}

.class-switch-container:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  padding: 0.5rem;
  outline: none;
  width: 100%;
  border-radius: 0.5rem;
  transition: color 0.3s ease;
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
  opacity: 0.7;
}

.class-select {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  padding: 0.5rem;
  outline: none;
  width: 100%;
  cursor: pointer;
  border-radius: 0.5rem;
  appearance: none;
  transition: color 0.3s ease;
}

.class-select option {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.class-select option:hover {
  background-color: var(--color-background);
}

.search-button {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
}

.search-button:hover {
  color: var(--color-secondary);
  transform: scale(1.1);
}

.search-button:active {
  transform: scale(0.95);
}

/* 自定义滚动条样式 */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: var(--color-background);
}

select::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 8px;
  transition: background 0.3s ease;
}

select::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .class-switch-wrapper {
    max-width: 100%;
  }

  .search-input,
  .class-select {
    font-size: 1rem;
  }

  .search-button {
    font-size: 1.25rem;
  }
}
</style>
