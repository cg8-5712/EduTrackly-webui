<template>
  <div class="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] py-8 px-4 transition-colors duration-300">
    <!-- 返回按钮 -->
    <div class="max-w-[1600px] mx-auto mb-8 px-4">
      <button @click="goBack" class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg text-sm cursor-pointer transition-all duration-200 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:-translate-x-0.5">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{{ $t('about.backToHome') }}</span>
      </button>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-[1600px] mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-[var(--color-primary)] transition-colors duration-300">{{ $t('about.title') }}</h1>
      </div>

      <!-- 内容网格布局：左侧技术栈，右侧开发者和版本信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-8 items-start">
        <!-- 左侧：技术栈 -->
        <div class="flex flex-col gap-8">
          <div class="w-full bg-[var(--color-surface)] rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-6 pb-3 border-b-2 border-[var(--color-border)] transition-colors duration-300">{{ $t('about.techStackSection') }}</h2>
            <div class="flex flex-col gap-6">
              <div v-for="(row, index) in tagRows" :key="index" class="relative w-full overflow-hidden [mask:linear-gradient(90deg,transparent,white_10%,white_90%,transparent)] [-webkit-mask:linear-gradient(90deg,transparent,white_10%,white_90%,transparent)]">
                <div class="flex animate-scroll hover:[animation-play-state:paused]"
                     :class="{ '[animation-direction:reverse]': row.direction === 'right' }"
                     :style="{ '--duration': row.duration + 's' }">
                  <div class="flex gap-4 py-2 shrink-0">
                    <span v-for="tag in row.tags"
                          :key="tag"
                          class="inline-block px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
                          :style="{
                            backgroundColor: row.colors.background,
                            color: row.colors.text
                          }">
                      {{ tag }}
                    </span>
                  </div>
                  <div class="flex gap-4 py-2 shrink-0" aria-hidden="true">
                    <span v-for="tag in row.tags"
                          :key="tag + '-clone'"
                          class="inline-block px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
                          :style="{
                            backgroundColor: row.colors.background,
                            color: row.colors.text
                          }">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：开发者信息和版本信息 -->
        <div class="flex flex-col gap-8">
          <!-- 上：开发者信息 -->
          <div class="bg-[var(--color-surface)] rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-6 pb-3 border-b-2 border-[var(--color-border)] transition-colors duration-300">{{ $t('about.teamSection') }}</h2>
            <div class="flex flex-col gap-6">
              <div v-for="member in team" :key="member.name" class="flex flex-col gap-4">
                <div class="flex items-center gap-4">
                  <div class="relative inline-block rounded-full overflow-hidden transition-all duration-300">
                    <img :src="member.image" alt="team" class="w-20 h-20 rounded-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110">
                  </div>
                  <div class="flex-1">
                    <h3>
                      <a :href="member.website" target="_blank" class="text-2xl font-semibold text-[var(--color-text-primary)] no-underline transition-colors duration-200 hover:text-[var(--color-primary)]">
                        {{ member.name }}
                      </a>
                    </h3>
                    <p class="text-sm text-[var(--color-text-secondary)] mt-1">{{ member.position }}</p>
                  </div>
                </div>
                <div class="lg:pl-24">
                  <p class="text-base text-[var(--color-text-secondary)] mb-4 leading-relaxed">{{ member.description }}</p>
                  <div class="flex gap-3">
                    <a :href="member.github" target="_blank" class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-background)] text-[var(--color-text-secondary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-0.5">
                      <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </a>
                    <a :href="member.telegram" target="_blank" class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-background)] text-[var(--color-text-secondary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-0.5">
                      <svg class="w-5 h-5" viewBox="0 0 240 240" fill="currentColor">
                        <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm58.1 80.4l-17.8 84.4c-1.3 5.8-4.8 7.3-9.8 4.5l-27.1-20-13 12.5c-1.4 1.4-2.6 2.6-5.3 2.6l1.9-27.4 49.9-45.1c2.2-1.9-.5-3-3.4-1.1l-61.7 38.9-26.6-8.3c-5.8-1.8-5.9-5.8 1.3-8.6l103.9-40.1c4.8-1.8 9-0.2 7.3 8.7z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 下：版本信息和许可证信息 -->
          <div class="bg-[var(--color-surface)] rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 class="text-2xl font-bold text-[var(--color-primary)] mb-6 pb-3 border-b-2 border-[var(--color-border)] transition-colors duration-300">{{ $t('about.versionSection') }}</h2>
            <div class="mb-8">
              <VersionInfo :compact="false" />
            </div>

            <div class="mt-8 pt-8 border-t border-[var(--color-border)]">
              <h3 class="text-xl font-semibold text-[var(--color-text-primary)] mb-4">{{ $t('about.licenseSection') }}</h3>
              <div class="flex flex-col gap-4">
                <div class="text-lg text-[var(--color-primary)]">
                  <strong>{{ $t('about.license.title') }}</strong>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {{ $t('about.license.description') }}
                </p>
                <div class="flex flex-col gap-4 my-4">
                  <div class="flex gap-3 items-start">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-background)] text-[var(--color-primary)] font-bold shrink-0">✓</div>
                    <div>
                      <strong class="block text-[var(--color-text-primary)] text-sm mb-1">{{ $t('about.license.freedom') }}</strong>
                      <p class="text-xs text-[var(--color-text-tertiary)] leading-normal">{{ $t('about.license.freedomDesc') }}</p>
                    </div>
                  </div>
                  <div class="flex gap-3 items-start">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-background)] text-[var(--color-primary)] font-bold shrink-0">⚖</div>
                    <div>
                      <strong class="block text-[var(--color-text-primary)] text-sm mb-1">{{ $t('about.license.copyleft') }}</strong>
                      <p class="text-xs text-[var(--color-text-tertiary)] leading-normal">{{ $t('about.license.copyleftDesc') }}</p>
                    </div>
                  </div>
                  <div class="flex gap-3 items-start">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-background)] text-[var(--color-primary)] font-bold shrink-0">📄</div>
                    <div>
                      <strong class="block text-[var(--color-text-primary)] text-sm mb-1">{{ $t('about.license.disclosure') }}</strong>
                      <p class="text-xs text-[var(--color-text-tertiary)] leading-normal">{{ $t('about.license.disclosureDesc') }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="inline-flex items-center gap-1 text-[var(--color-primary)] no-underline text-sm font-medium transition-all duration-200 hover:underline hover:translate-x-0.5">
                    {{ $t('about.license.viewLicense') }} →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VersionInfo from '@/components/VersionInfo.vue'

const router = useRouter()
const { t } = useI18n()

// 返回上一页
const goBack = () => {
  router.back()
}

// 定义团队数据
const team = [
  {
    name: 'Cg8-5712',
    position: 'Full-Stack Developer',
    description: 'Nothing is impossible with Docker!',
    image: 'https://cn.cravatar.com/avatar/4ca6db8f5673f5f001c5901fc04b2322ff304b13c9b805576ddf47e310a481dc?s=512',
    github: 'https://github.com/cg8-5712',
    telegram: 'http://cg85712.t.me',
    website: 'mailto:5712.cg8@gmail.com'
  }
]

// 定义技术栈数据
const tagRows = [
  {
    tags: [
      'Vue.js', 'Vite', 'HTML', 'CSS', 'CORS', 'Tailwind', 'RESTFUL API', 'yarn', 'i18n',
      'TypeScript', 'Element Plus', 'Pinia', 'Sass', 'Less', 'ESLint', 'Prettier', 'Axios'
    ],
    direction: 'left',
    duration: 20,
    colors: {
      background: '#f0fdf4',
      text: '#166534'
    }
  },
  {
    tags: [
      'JavaScript', 'Python', 'Quart', 'JWT', 'async', 'pydantic', 'asncpg', 'oauth2', 'Wecom',
      'FastAPI', 'Flask', 'Node.js', 'Express', 'OpenAI API', 'Redis', 'Celery', 'WebSocket'
    ],
    direction: 'right',
    duration: 15,
    colors: {
      background: '#eff6ff',
      text: '#1e40af'
    }
  },
  {
    tags: [
      'Docker', 'Compose', 'Jenkins', 'Nginx', 'Jumpserver', 'golocproxy', 'PostgreSQL',
      'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana', 'Linux', 'Ansible'
    ],
    direction: 'left',
    duration: 22,
    colors: {
      background: '#fdf4ff',
      text: '#86198f'
    }
  }
]
</script>

<style scoped>
/* 滚动动画 - Tailwind无法直接定义keyframes，所以保留CSS */
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll var(--duration, 20s) linear infinite;
}
</style>
