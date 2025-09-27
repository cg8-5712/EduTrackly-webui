<template>
  <div class="w-[90%] max-w-6xl p-6 bg-gray-800 rounded-xl text-gray-100 shadow-2xl mt-8 mx-auto">
    <h2 class="text-center mb-6 text-white text-2xl font-bold">提交作业</h2>
    <div class="grid grid-cols-3 gap-6 mb-6">
      <div
          v-for="subject in mainSubjects"
          :key="subject.key"
          class="flex flex-col"
      >
        <label class="mb-2 font-bold text-blue-300 text-center">{{ subject.name }}</label>
        <textarea
            v-model="homeworkContent[subject.key]"
            @input="resizeTextarea($event)"
            :placeholder="`请输入${subject.name}作业内容`"
            rows="2"
            class="resize-none overflow-y-auto p-3 text-base rounded-lg border-none bg-gray-700 text-gray-100 outline-none transition-all duration-200 ease-in-out max-h-16 focus:shadow-blue-500 focus:shadow-lg focus:bg-gray-600 placeholder-gray-400"
        ></textarea>
      </div>
    </div>

    <!-- 单独的"其他"科目 -->
    <div class="mb-6">
      <div class="flex flex-col w-1/3">
        <label class="mb-2 font-bold text-blue-300 text-center">{{ otherSubject.name }}</label>
        <textarea
            v-model="homeworkContent[otherSubject.key]"
            @input="resizeTextarea($event)"
            :placeholder="`请输入${otherSubject.name}作业内容`"
            rows="2"
            class="resize-none overflow-y-auto p-3 text-base rounded-lg border-none bg-gray-700 text-gray-100 outline-none transition-all duration-200 ease-in-out max-h-16 focus:shadow-blue-500 focus:shadow-lg focus:bg-gray-600 placeholder-gray-400"
        ></textarea>
      </div>
    </div>
    <button @click="submitHomework" class="mt-8 px-10 py-4 text-xl font-medium cursor-pointer border-none rounded-lg bg-blue-500 text-white transition-colors duration-200 ease-in-out block mx-auto hover:bg-blue-600 active:translate-y-px shadow-lg">提交作业</button>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import HomeworkService from '@/services/basic/homework';
import { formatDateToYYYYMMDD } from "@/utils/formatDate.js";

const props = defineProps({
  cid: {
    type: Number,
    required: true
  }
});

// 主要科目配置 - 3×3布局
const mainSubjects = [
  { key: 'chinese', name: '语文' },
  { key: 'maths', name: '数学' },
  { key: 'english', name: '英语' },
  { key: 'physics', name: '物理' },
  { key: 'chemistry', name: '化学' },
  { key: 'biology', name: '生物' },
  { key: 'history', name: '历史' },
  { key: 'geography', name: '地理' },
  { key: 'politics', name: '政治' }
];

// 其他科目配置
const otherSubject = { key: 'others', name: '其他' };

// 所有科目配置（用于循环操作）
const allSubjects = [...mainSubjects, otherSubject];

const homeworkContent = reactive({});

function resetHomework() {
  allSubjects.forEach(subject => {
    homeworkContent[subject.key] = '';
  });
}

resetHomework();

const dueDate = formatDateToYYYYMMDD(new Date());

// 自动拉取今日作业
async function fetchTodayHomework(cid) {
  try {
    const res = await HomeworkService.getTodayHomework(cid);
    console.log('获取今日作业成功:', res.data.message);

    if (res.data.code === 0 && res.data.data?.homework_content) {
      resetHomework();

      // 新API格式直接是对象，无需解析
      const apiHomeworkContent = res.data.data.homework_content;

      // 将API返回的内容填充到表单中
      allSubjects.forEach(subject => {
        if (apiHomeworkContent[subject.key]) {
          homeworkContent[subject.key] = apiHomeworkContent[subject.key];
        }
      });
    }
  } catch (err) {
    console.error('获取今日作业失败:', err);
    // 如果是404错误（暂无作业），不显示错误
    if (err.response?.status !== 404) {
      console.error('获取作业时发生错误:', err);
    }
  }
}

watch(() => props.cid, (newCid) => {
  resetHomework();
  if (newCid) {
    fetchTodayHomework(newCid);
  }
});

onMounted(() => {
  if (props.cid) {
    fetchTodayHomework(props.cid);
  }
});

function resizeTextarea(event) {
  const textarea = event.target;

  // 临时设置高度为auto以获取实际需要的高度
  textarea.style.height = 'auto';

  // 计算两行文本的高度（64px是max-h-16对应的高度）
  const maxHeight = 64;

  if (textarea.scrollHeight <= maxHeight) {
    // 如果内容不超过两行，设置为实际高度
    textarea.style.height = textarea.scrollHeight + 'px';
  } else {
    // 如果内容超过两行，固定高度并启用滚动
    textarea.style.height = maxHeight + 'px';
  }
}

async function submitHomework() {
  try {
    // 检查是否至少填写了一个科目
    const hasContent = allSubjects.some(subject =>
        homeworkContent[subject.key] && homeworkContent[subject.key].trim()
    );

    if (!hasContent) {
      alert('请至少填写一个学科的作业内容');
      return;
    }

    // 构造新API格式的homework_content对象
    const homework_content = {};
    allSubjects.forEach(subject => {
      // 只传递有内容的科目，空的传空字符串
      homework_content[subject.key] = homeworkContent[subject.key]?.trim() || "";
    });

    const payload = {
      cid: props.cid,
      homework_content: homework_content,
      due_date: parseInt(dueDate) // 确保是数字格式
    };

    console.log('提交的数据:', payload);

    const res = await HomeworkService.postHomework(payload);
    console.log('提交响应:', res.data);

    if (res.data.code === 0) {
      alert('作业提交成功！');
      resetHomework();
      fetchTodayHomework(props.cid); // 重新加载
    } else {
      alert(`提交失败：${res.data.message}`);
    }
  } catch (err) {
    console.error('提交作业失败:', err);
    if (err.response?.data?.message) {
      alert(`提交失败：${err.response.data.message}`);
    } else {
      alert('提交失败，请重试');
    }
  }
}
</script>

<style scoped>
</style>