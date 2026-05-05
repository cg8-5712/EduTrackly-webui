<template>
  <div class="w-full max-w-[30rem]">
    <div class="board-shell p-2.5">
      <div class="mb-2 flex items-center justify-between px-3 pt-1">
        <span class="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
          {{ $t("class.selectClass") }}
        </span>
        <button
          type="button"
          class="info-pill !px-3 !py-1 text-[0.7rem]"
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
          class="h-12"
          @blur="handleBlur"
        />

        <select
          v-else
          v-model="selectedCid"
          class="flex h-12 w-full rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
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
