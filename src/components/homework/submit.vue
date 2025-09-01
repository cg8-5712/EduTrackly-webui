<template>
  <div class="submit-homework">
    <h2>提交作业</h2>
    <div class="subjects">
      <label v-for="subject in subjects" :key="subject" class="subject-label">
        {{ subject }}
        <textarea
          v-model="homeworkContent[subject]"
          @input="resizeTextarea($event)"
          placeholder="请输入作业内容"
          rows="1"
        ></textarea>
      </label>
    </div>
    <button @click="submitHomework">提交</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import HomeworkService from '@/services/basic/homework';

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

// 使用 reactive 保存各科作业内容
const homeworkContent = reactive({});
subjects.forEach(sub => homeworkContent[sub] = '');

const cid = 0; // 根据实际情况动态传入课程ID
const dueDate = Math.floor(Date.now() / 1000); // 示例: 当前时间戳

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
        cid,
        homework_content: `${subject}: ${homeworkContent[subject]}`,
        due_date: dueDate
      };
      const res = await HomeworkService.postHomework(payload);
      console.log(res.data.message);
    }
    alert('作业提交成功！');
  } catch (err) {
    console.error(err);
    alert('提交失败，请重试');
  }
}
</script>

<style scoped>
.submit-homework {
  max-width: 600px;
  margin: auto;
}

.subjects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subject-label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

textarea {
  margin-top: 5px;
  resize: none;
  overflow: hidden;
  padding: 5px;
  font-size: 14px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
