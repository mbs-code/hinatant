<template>
  <Card class="en-break-word" @click="emit('open')">
    <template #title>
      {{ alarm.name }}
    </template>

    <template #content>
      <IconText icon="pi pi-bell">
        <template v-if="next">
          <span>{{ next.date }}</span>
          <span>{{ next.time }}</span>
          <span>({{ next.duration }})</span>
        </template>
        <span v-else>-</span>
      </IconText>

      <IconText icon="pi pi-link">
        <span class="underline">{{ alarm.url }}</span>
      </IconText>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'

import { computed } from 'vue'
import { Alarm } from '../../composables/storage/useAlarmBucket'
import { useAlarmAction } from '../../composables/action/useAlarmAction'
import { // TODO: この辺 composable 化する
  format as dateFormat,
  formatDistance,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import IconText from '../IconText.vue'

const props = defineProps<{
  alarm: Alarm,
}>()

const emit = defineEmits<{
  (e: 'open'): void,
}>()

///

const alarmAction = useAlarmAction()
const next = computed(() => {
  const now = new Date()

  const nextDate = alarmAction.getNextDate(now, props.alarm)
  return nextDate
    ? {
      date: dateFormat(nextDate, 'yyyy-MM-dd (E)', { locale: ja }),
      time: dateFormat(nextDate, 'HH:mm'),
      duration: formatDistance(nextDate, now, { locale: ja, addSuffix: true }),
    }
    : undefined
})
</script>

<style scoped lang="scss">
.p-card  {
  border: 2px solid var(--surface-border);

  :hover {
    background-color: var(--surface-ground);
  }
  ::v-deep(.p-card-body) {
    padding: 1rem;
  }
  ::v-deep(.p-card-content) {
    padding: 0;
  }
}
</style>
