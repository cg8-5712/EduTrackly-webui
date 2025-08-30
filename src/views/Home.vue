<template>
  <div class="home-page">
    <LoadingSpinner v-if="loading" />
    <h1 v-else>{{ t('welcome') }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const { t } = useI18n();

// 一直显示 loading
const loading = ref(true);
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
