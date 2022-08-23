<template>
  <Dialog
    v-model:visible="_visible"
    :style="{ width: '80vw' }"
    :draggable="false"
    modal
    dismissable-mask
  >
    <template #header>
      <div class="text-2xl font-bold">
        <span><i class="pi pi-cog" /></span>
        デバッグログ
      </div>
    </template>

    <pre>{{ data }}</pre>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'

import { computed, ref, watch } from 'vue'
import { useRuntimeBucket } from '../../composables/storage/useRuntimeBucket'
import { useAppToast } from '../../composables/useAppToast'

const props = defineProps<{
  visible: boolean,
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const _visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

///

const appToast = useAppToast()
const runtimeBucket = useRuntimeBucket()
const data = ref<object>()

const fetchDebugData = async () => {
  try {
    const res = await runtimeBucket.getDebugData()
    data.value = res
  } catch (err) {
    appToast.thrown(err)
  }
}

watch(_visible, async (value) => value && await fetchDebugData())
</script>
