<template>
  <Card>
    <template #content>
      <div class="text-center ja-break-word text-2xl font-bold">
        <div>{{ dateStr }}</div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'

import { computed } from 'vue'
import { // TODO: この辺 composable 化する
  format as dateFormat,
} from 'date-fns'
import { ja } from 'date-fns/locale'

const props = defineProps<{
  date?: Date,
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
