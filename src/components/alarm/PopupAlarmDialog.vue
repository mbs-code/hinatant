<template>
  <Sidebar v-model:visible="_visible" position="full" modal>
    <template #header>
      <IconText
        icon="pi pi-bell"
        :label="alarm?.name"
        class="text-2xl font-bold"
      />
    </template>

    <NotifyAlarmCard
      v-if="alarm"
      :alarm="alarm"
    />
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from 'primevue/sidebar'
import NotifyAlarmCard from '../notify/NotifyAlarmCard.vue'

import { computed, onBeforeUnmount, watch } from 'vue'
import { Alarm } from '../../composables/storage/useAlarmBucket'
import IconText from '../IconText.vue'

const props = defineProps<{
  visible: boolean,
  alarm?: Alarm,
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void,
}>()

const _visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

///
// スクロールバー制御

watch(_visible, () => {
  if (_visible.value) {
    document.body.classList.add('p-overflow-hidden')
  } else {
    document.body.classList.remove('p-overflow-hidden')
  }
})

onBeforeUnmount(() => {
  document.body.classList.remove('p-overflow-hidden')
})
</script>
