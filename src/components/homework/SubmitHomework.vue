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
import { reactive, watch } from 'vue';
import HomeworkService from '@/services/basic/homework';

const props = defineProps({
  cid: {
    type: Number,
    required: true
  }
});

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

// 作业内容
const homeworkContent = reactive({});
function resetHomework() {
  subjects.forEach(sub => homeworkContent[sub] = '');
}

// 初始化作业内容
resetHomework();

// 当班级切换时，清空作业内容
watch(() => props.cid, (newCid, oldCid) => {
  console.log('班级切换', oldCid, '→', newCid);
  resetHomework();
});

const dueDate = Math.floor(Date.now() / 1000);

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
        cid: props.cid,  // 使用最新的班级ID
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
