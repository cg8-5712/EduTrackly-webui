<template>
  <div :class="compact ? 'w-full max-w-[22rem]' : 'w-full max-w-[30rem]'">
    <div class="board-shell" :class="compact ? 'p-2' : 'p-2.5'">
      <div
        class="flex items-center justify-between px-3"
        :class="compact ? 'mb-1.5 pt-0.5' : 'mb-2 pt-1'"
      >
        <span class="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
          {{ $t("class.selectClass") }}
        </span>
        <button
          type="button"
          class="info-pill"
          :class="compact ? '!px-2.5 !py-1 text-[0.66rem]' : '!px-3 !py-1 text-[0.7rem]'"
          @click="isSearching = !isSearching"
        >
          {{ isSearching ? $t("common.cancel") : $t("class.searchPlaceholder") }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <Input
          v-if="isSearching"
          v-model="searchQuery"
          :placeholder="$t('class.searchPlaceholder')"
          :class="compact ? 'h-10' : 'h-12'"
          @blur="handleBlur"
        />

        <select
          v-else
          v-model="selectedCid"
          class="flex w-full border border-white/10 bg-white/6 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
          :class="compact
            ? 'h-10 rounded-[1.15rem] px-3 py-2 text-[0.92rem]'
            : 'h-12 rounded-[1.35rem] px-4 py-3 text-sm'"
          @change="onClassChange"
        >
          <option value="" disabled>
            {{ loading ? $t("common.loading") : $t("class.selectClass") }}
          </option>
          <option
            v-for="classItem in filteredClasses"
            :key="classItem.cid"
            :value="classItem.cid"
            class="bg-[var(--color-surface)] text-foreground"
          >
            {{ classItem.class_name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import ClassService from "@/services/basic/class"
import notificationService from "@/services/common/notification"
import Input from "@/components/ui/input/Input.vue"

const props = defineProps({
  cid: {
    type: [Number, String],
    default: null,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:cid"])
const { t: $t } = useI18n()

const classes = ref([])
const searchQuery = ref("")
const selectedCid = ref("")
const loading = ref(true)
const isSearching = ref(false)

const STORAGE_KEY = "edutrackly-cg8-5712-last-selected-class"
const DEFAULT_CID = 1

const filteredClasses = computed(() => {
  if (!searchQuery.value.trim()) {
    return classes.value
  }

  return classes.value.filter((classItem) =>
    classItem.class_name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  )
})

function getLastSelectedClass() {
  try {
    const savedCid = localStorage.getItem(STORAGE_KEY)
    if (savedCid) {
      const parsed = Number.parseInt(savedCid, 10)
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error("[ClassSwitch] load failed:", error)
  }

  return DEFAULT_CID
}

function saveLastSelectedClass(cid) {
  try {
    if (cid) {
      localStorage.setItem(STORAGE_KEY, String(cid))
    }
  } catch (error) {
    console.error("[ClassSwitch] save failed:", error)
  }
}

async function fetchClasses() {
  try {
    loading.value = true
    const response = await ClassService.getAllClasses()
    classes.value = response || []

    if (!classes.value.length) {
      return
    }

    const rememberedCid = getLastSelectedClass()
    const rememberedClass = classes.value.find((item) => item.cid === rememberedCid)
    const fallbackClass = classes.value.reduce((previous, current) =>
      previous.cid < current.cid ? previous : current
    )

    selectedCid.value = String((rememberedClass || fallbackClass).cid)
    saveLastSelectedClass(selectedCid.value)
    emit("update:cid", Number(selectedCid.value))
  } catch (error) {
    console.error("[ClassSwitch] fetch failed:", error)
    classes.value = []
    notificationService.error($t("class.noClasses"))
  } finally {
    loading.value = false
  }
}

function onClassChange() {
  saveLastSelectedClass(selectedCid.value)
  emit("update:cid", Number(selectedCid.value))
}

function handleBlur() {
  if (!searchQuery.value.trim()) {
    isSearching.value = false
  }
}

watch(
  () => props.cid,
  (newCid) => {
    if (newCid) {
      selectedCid.value = String(newCid)
    }
  }
)

onMounted(fetchClasses)
</script>
