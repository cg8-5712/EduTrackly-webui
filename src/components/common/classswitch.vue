<template>
  <div class="relative w-70 rounded-lg">
    <!-- 班级选择器 -->
    <div class="relative flex items-center bg-gray-800 rounded-lg p-2 shadow-md overflow-hidden">
      <input
        v-if="isSearching"
        v-model="searchQuery"
        type="text"
        placeholder="搜索班级..."
        class="flex-1 bg-transparent border-none text-gray-200 text-2xl p-2 outline-none w-full rounded-lg placeholder-blue-200 placeholder-opacity-50"
        @blur="handleBlur"
      />
      <select
        v-else
        v-model="selectedCid"
        @change="onClassChange"
        class="flex-1 bg-transparent border-none text-gray-200 text-2xl p-2 outline-none w-full cursor-pointer rounded-lg bg-gray-800 appearance-none"
      >
        <option value="" disabled>{{ loading ? '加载中...' : '选择班级' }}</option>
        <option
          v-for="cls in filteredClasses"
          :key="cls.cid"
          :value="cls.cid"
          class="bg-gray-800 text-gray-200 p-2 rounded-lg hover:bg-gray-700"
        >
          {{ cls.class_name }}
        </option>
      </select>
      <button @click="toggleSearch" class="bg-transparent border-none text-blue-200 text-3xl px-2 py-1 cursor-pointer transition-colors duration-200 hover:text-blue-300">
        {{ isSearching ? '×' : '🔍' }}
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="!loading && classes.length === 0" class="absolute top-full left-0 mt-2 text-red-400 text-sm">
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
/* 自定义滚动条样式 */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #1a1a1a;
}

select::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 8px;
}
</style>
