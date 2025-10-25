<template>
    <div class="version-info" :class="{ compact: compact }">
        <div v-if="!compact" class="version-detail">
            <div class="version-item">
                <span class="label">Version:</span>
                <span class="value">{{ version.version }}</span>
            </div>
            <div class="version-item">
                <span class="label">Build:</span>
                <span class="value">#{{ version.buildNumber }}</span>
            </div>
            <div class="version-item">
                <span class="label">Time:</span>
                <span class="value">{{ buildTimeString }}</span>
            </div>
            <div class="version-item">
                <span class="label">Branch:</span>
                <span class="value">{{ version.gitBranch }}</span>
            </div>
        </div>
        <div v-else class="version-compact">
            {{ versionString }}
        </div>
    </div>
</template>

<script setup>
import { version, getVersionString, getBuildTimeString } from '@/utils/version';
import { computed } from 'vue';

defineProps({
    compact: {
        type: Boolean,
        default: false,
    },
});

const versionString = computed(() => getVersionString());
const buildTimeString = computed(() => getBuildTimeString());
</script>

<style scoped>
.version-info {
    @apply font-mono text-xs text-gray-600;
}

.version-detail {
    @apply flex flex-col gap-1;
}

.version-item {
    @apply flex gap-2;
}

.version-item .label {
    @apply font-semibold min-w-[60px];
}

.version-item .value {
    @apply text-gray-400;
}

.version-compact {
    @apply opacity-70;
}

.version-info.compact {
    font-size: 11px;
}
</style>
