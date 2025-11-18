<template>
  <div class="submit-homework-wrapper">
    <h2 class="submit-title">{{ $t('homework.submitHomework') }}</h2>
    <div class="subjects-grid">
      <div
          v-for="subject in mainSubjects"
          :key="subject.key"
          class="subject-item"
      >
        <label class="subject-label">{{ subject.name }}</label>
        <textarea
            v-model="homeworkContent[subject.key]"
            @input="resizeTextarea($event)"
            :placeholder="$t('homework.pleaseEnterContent') + subject.name"
            rows="2"
            class="subject-textarea"
        ></textarea>
      </div>
    </div>

    <button @click="submitHomework" class="submit-button">{{ $t('homework.submit') }}</button>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import HomeworkService from '@/services/basic/homework';
import { formatDateToYYYYMMDD } from "@/utils/formatDate.js";
import notificationService from '@/services/common/notification';

const { t: $t } = useI18n();

const props = defineProps({
  cid: {
    type: Number,
    required: true
  }
});

// 主要科目配置 - 3×3布局
const mainSubjects = computed(() => [
  { key: 'chinese', name: $t('homework.subjects.chinese') },
  { key: 'maths', name: $t('homework.subjects.math') },
  { key: 'english', name: $t('homework.subjects.english') },
  { key: 'physics', name: $t('homework.subjects.physics') },
  { key: 'chemistry', name: $t('homework.subjects.chemistry') },
  { key: 'biology', name: $t('homework.subjects.biology') },
  { key: 'history', name: $t('homework.subjects.history') },
  { key: 'geography', name: $t('homework.subjects.geography') },
  { key: 'politics', name: $t('homework.subjects.politics') },
  { key: 'others', name: $t('homework.subjects.others') }
]);

// 其他科目配置
const otherSubject = computed(() => ({ key: 'others', name: $t('homework.subjects.others') }));

// 所有科目配置（用于循环操作）
const allSubjects = computed(() => [...mainSubjects.value, otherSubject.value]);

const homeworkContent = reactive({});

function resetHomework() {
  allSubjects.value.forEach(subject => {
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

      // 将API返回的内容填充到表单中，并处理换行符
      allSubjects.value.forEach(subject => {
        if (apiHomeworkContent[subject.key]) {
          // 将字符串形式的 \n 替换为真正的换行符
          homeworkContent[subject.key] = apiHomeworkContent[subject.key].replace(/\\n/g, '\n');
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
    const hasContent = allSubjects.value.some(subject =>
        homeworkContent[subject.key] && homeworkContent[subject.key].trim()
    );

    if (!hasContent) {
      notificationService.info($t('homework.pleaseEnterContent'));
      return;
    }

    // 构造新API格式的homework_content对象
    const homework_content = {};
    allSubjects.value.forEach(subject => {
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
      notificationService.success($t('homework.submitSuccess'));
      resetHomework();
      fetchTodayHomework(props.cid); // 重新加载
    } else {
      notificationService.error(`${$t('homework.submitFailed')}：${res.data.message}`, 'error');
    }
  } catch (err) {
    console.error('提交作业失败:', err);
    if (err.response?.data?.message) {
      notificationService.error(`${$t('homework.submitFailed')}：${err.response.data.message}`, 'error');
    } else {
      notificationService.error($t('homework.submitFailed'), 'error');
    }
  }
}
</script>

<style scoped>
.submit-homework-wrapper {
  width: 90%;
  max-width: 1152px;
  padding: 1.5rem;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  color: var(--color-text-primary);
  box-shadow: var(--shadow-xl);
  margin: 2rem auto;
  transition: all 0.3s ease;
}

.submit-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  font-weight: bold;
  transition: color 0.3s ease;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.subject-item {
  display: flex;
  flex-direction: column;
}

.subject-label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-align: center;
  transition: color 0.3s ease;
}

.subject-textarea {
  resize: none;
  overflow-y: auto;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 2px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  outline: none;
  transition: all 0.2s ease;
  max-height: 64px;
}

.subject-textarea:focus {
  box-shadow: 0 0 0 3px var(--color-primary);
  background-color: var(--color-surface);
  border-color: var(--color-primary);
}

.subject-textarea::placeholder {
  color: var(--color-text-tertiary);
  opacity: 0.7;
}

.other-subject-section {
  margin-bottom: 1.5rem;
}

.other-subject-item {
  display: flex;
  flex-direction: column;
  width: 33.333%;
}

.submit-button {
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-primary);
  color: white;
  transition: all 0.2s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: var(--shadow-lg);
}

.submit-button:hover {
  background-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.submit-button:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .subjects-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .other-subject-item {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .submit-homework-wrapper {
    width: 95%;
    padding: 1rem;
  }

  .subjects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .other-subject-item {
    width: 100%;
  }

  .submit-title {
    font-size: 1.25rem;
  }

  .submit-button {
    font-size: 1rem;
    padding: 0.75rem 2rem;
  }
}
</style>
