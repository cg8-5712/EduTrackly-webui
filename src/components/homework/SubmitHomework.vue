<template>
  <div class="submit-homework">
    <h2>提交作业</h2>
    <div class="subjects-grid">
      <div
          v-for="subject in subjects"
          :key="subject"
          class="subject-item"
      >
        <label>{{ subject }}</label>
        <textarea
            v-model="homeworkContent[subject]"
            @input="resizeTextarea($event)"
            placeholder="请输入作业内容"
            rows="1"
        ></textarea>
      </div>
    </div>
    <button @click="submitHomework">提交</button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import HomeworkService from '@/services/basic/homework';
import {formatDateToYYYYMMDD} from "@/utils/formatDate.js";

const props = defineProps({
  cid: {
    type: Number,
    required: true
  }
});

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

const homeworkContent = reactive({});
function resetHomework() {
  subjects.forEach(sub => homeworkContent[sub] = '');
}
resetHomework();

watch(() => props.cid, (newCid, oldCid) => {
  resetHomework();
});

const dueDate = formatDateToYYYYMMDD(new Date())

function resizeTextarea(event) {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

async function submitHomework() {
  try {
    for (const subject of subjects) {
      if (!homeworkContent[subject].trim()) continue;
      const payload = {
        cid: props.cid,
        homework_content: `${subject}: ${homeworkContent[subject]}`,
        due_date: dueDate
      };
      const res = await HomeworkService.postHomework(payload);
      console.log(res.data.message);
    }
    alert('作业提交成功！');
    resetHomework();
  } catch (err) {
    console.error(err);
    alert('提交失败，请重试');
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
}

.subject-item textarea {
  resize: none;
  overflow: hidden;
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background-color: #2b2b3b; /* 深色输入框 */
  color: #f0f0f0;
  outline: none;
  transition: all 0.2s ease-in-out;
}

.subject-item textarea:focus {
  box-shadow: 0 0 5px #4f91ff;
  background-color: #3a3a50;
}

.subject-item textarea {
  font-size: 20px; /* 文本区域的文字大小 */
}

button {
  margin-top: 20px;
  padding: 10px 25px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background-color: #4f91ff;
  color: #fff;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #3570d1;
}
</style>
