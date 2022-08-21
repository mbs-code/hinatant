<template>
  <Card>
    <template #content>
      <div class="flex align-items-center">
        <div class="w-2rem h-2rem" />

        <span class="flex-grow-1 text-center ja-break-word text-2xl font-bold">
          {{ dateStr }} のアラーム
        </span>

        <Button
          class="w-2rem h-2rem p-button-text p-button-plain"
          icon="pi pi-times"
          @click="emit('close')"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'

import { computed } from 'vue'
import { // TODO: この辺 composable 化する
  format as dateFormat,
} from 'date-fns'
import { ja } from 'date-fns/locale'

const props = defineProps<{
  date?: Date,
}>()

const emit = defineEmits<{
  (e: 'close'): void,
}>()

const dateStr = computed(() => {
  const date = props.date
  if (date) {
    return dateFormat(date, 'yyyy年M月d日 (E) HH:mm', { locale: ja })
  }

  return undefined
})
</script>

<style scoped lang="scss">
.p-card {
  padding: 0.75rem;

  ::v-deep(.p-card-body) {
    padding: 0;
  }
  ::v-deep(.p-card-content) {
    padding: 0;
  }
}
</style>
