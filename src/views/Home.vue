<template>
  <div class="home-page">
    <LoadingSpinner v-if="loading" />
    <h1 v-else>{{ t('welcome') }}</h1>

    <Homework v-if="!loading" />

    <students v-if="!loading" />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Homework from "@/components/homework/homework.vue";
import students from "@/components/student/students.vue"
import notification from "@/services/common/notification";

const { t } = useI18n();

notification.notify('信息提示', 'success')


// 一直显示 loading
// const loading = ref(true);
</script>

<style scoped>
.home-page {
  padding: 20px;
  text-align: center;
}

.home-page h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}
</style>
