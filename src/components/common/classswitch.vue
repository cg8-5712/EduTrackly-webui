<template>
  <div class="class-switch-container">
    <!-- 班级选择器 -->
    <div class="select-wrapper">
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
        >
          {{ cls.class_name }}
        </option>
      </select>
      <button @click="toggleSearch" class="search-toggle">
        {{ isSearching ? '×' : '🔍' }}
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="!loading && classes.length === 0" class="error-text">
      暂无班级数据
    </div>
  </div>
</template>

<script>
import ClassService from "@/services/basic/class";

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
.class-switch-container {
  position: relative;
  width: 280px;
  border-radius: 8px;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #2b2b3d;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.class-select,
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 1.6rem;
  padding: 0.5rem;
  outline: none;
  width: 100%;
  border-radius: 8px;
}

.class-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  border-radius: 8px;
  background-color: #2b2b3d;
  padding: 0.5rem;
}

/* 选项样式 */
.class-select option {
  background-color: #2b2b3d;
  color: #e0e0e0;
  padding: 0.5rem;
  border-radius: 8px;
}

/* 修改select在展开时的样式 */
.class-select:focus {
  border-radius: 8px 8px 0 0;
  outline: none;
  border-radius: 8px;
}

/* 添加选项hover效果 */
.class-select option:hover {
  background-color: #3d3d4f;
}

/* 设置选中状态的样式 */
.class-select option:checked {
  background-color: #3d3d4f;
}

/* 确保下拉框展开时的容器也有圆角 */
select::-ms-expand {
  display: none;
}

.search-input::placeholder {
  color: #9ed2ff80;
}

.search-toggle {
  background: none;
  border: none;
  color: #9ed2ff;
  font-size: 1.8rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.search-toggle:hover {
  color: #7eb3db;
}

.error-text {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  color: #ff6b6b;
  font-size: 1.4rem;
}

/* 滚动条样式 */
.class-select::-webkit-scrollbar {
  width: 8px;
}

.class-select::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.class-select::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 8px;
}
</style>
