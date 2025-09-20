<template>
  <div class="submit-homework">
    <h2>提交作业</h2>
    <div class="subjects-grid">
      <div
          v-for="subject in subjectsConfig"
          :key="subject.key"
          class="subject-item"
      >
        <label>{{ subject.name }}</label>
        <textarea
            v-model="homeworkContent[subject.key]"
            @input="resizeTextarea($event)"
            :placeholder="`请输入${subject.name}作业内容`"
            rows="1"
        ></textarea>
      </div>
    </div>
    <button @click="submitHomework">提交</button>
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

// 科目配置 - 与API字段对应
const subjectsConfig = [
  { key: 'chinese', name: '语文' },
  { key: 'maths', name: '数学' },
  { key: 'english', name: '英语' },
  { key: 'physics', name: '物理' },
  { key: 'chemistry', name: '化学' },
  { key: 'biology', name: '生物' },
  { key: 'history', name: '历史' },
  { key: 'geography', name: '地理' },
  { key: 'politics', name: '政治' },
  { key: 'others', name: '其他' }
];

const homeworkContent = reactive({});

function resetHomework() {
  subjectsConfig.forEach(subject => {
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
      subjectsConfig.forEach(subject => {
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
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

async function submitHomework() {
  try {
    // 检查是否至少填写了一个科目
    const hasContent = subjectsConfig.some(subject =>
        homeworkContent[subject.key] && homeworkContent[subject.key].trim()
    );

    if (!hasContent) {
      alert('请至少填写一个学科的作业内容');
      return;
    }

    // 构造新API格式的homework_content对象
    const homework_content = {};
    subjectsConfig.forEach(subject => {
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
.submit-homework {
  width: 85%;
  padding: 20px;
  background-color: #1f1f2e; /* 深色背景 */
  border-radius: 12px;
  color: #f0f0f0; /* 字体颜色亮一点 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  font-size: 22px;
}

.submit-homework h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.subject-item {
  display: flex;
  flex-direction: column;
}

.subject-item label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #9ed2ff;
}

.subject-item textarea {
  resize: none;
  overflow: hidden;
  padding: 8px;
  font-size: 20px;
  border-radius: 6px;
  border: none;
  background-color: #2b2b3b; /* 深色输入框 */
  color: #f0f0f0;
  outline: none;
  transition: all 0.2s ease-in-out;
  min-height: 40px;
}

.subject-item textarea:focus {
  box-shadow: 0 0 5px #4f91ff;
  background-color: #3a3a50;
}

.subject-item textarea::placeholder {
  color: #888;
}

button {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background-color: #4f91ff;
  color: #fff;
  transition: background-color 0.2s ease-in-out;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

button:hover {
  background-color: #3570d1;
}

button:active {
  transform: translateY(1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subjects-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .submit-homework {
    width: 95%;
    padding: 15px;
    font-size: 18px;
  }

  .subject-item textarea {
    font-size: 16px;
  }
}
</style>