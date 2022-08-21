<template>
  <div class="flex flex-column gap-2">
    <template v-for="(alarm, _) of items" :key="_">
      <Card>
        <template #content>
          <div>
            {{ alarm.name }}
          </div>
          <div>
            <div v-if="alarm.next" class="flex align-items-center gap-2">
              <span><i class="pi pi-bell" /></span>
              <span>{{ alarm.next.date }}</span>
              <span>{{ alarm.next.time }}</span>
              <span>({{ alarm.next.duration }})</span>
            </div>
          </div>
          <div>{{ alarm.url }}</div>
        </template>
      </Card>
    </template>
  </div>
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

const props = defineProps<{
  alarms: Alarm[],
}>()

// const emit = defineEmits<{
//   (e: 'edit', alarm?: Alarm): void,
//   (e: 'swap', dragAlarm: Alarm, dropAlarm: Alarm): void,
// }>()

// ///

const alarmAction = useAlarmAction()
const items = computed(() => {
  const now = new Date()
  return props.alarms.map(alarm => {
    const nextDate = alarmAction.getNextDate(now, alarm)
    const next = nextDate
      ? {
        date: dateFormat(nextDate, 'yyyy-MM-dd (E)', { locale: ja }),
        time: dateFormat(nextDate, 'HH:mm'),
        duration: formatDistance(nextDate, now, { locale: ja, addSuffix: true }),
      }
      : undefined

    return {
      name: alarm.name,
      url: alarm.url,
      time: alarm.time,
      next: next,

      alarm: alarm,
    }
  })
})
</script>

<style scoped lang="scss">
.p-card  {
  padding: 1rem;

  ::v-deep(.p-card-body) {
    padding: 0;
  }
  ::v-deep(.p-card-content) {
    padding: 0;
  }
}
</style>
