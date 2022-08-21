<template>
  <DataTable :value="items" responsive-layout="stack" breakpoint="800px">
    <template #header>
      <div class="flex align-items-center justify-content-between">
        <div>
          <span><i class="pi pi-bell" /></span>
          アラーム一覧
        </div>

        <div>
          <Button
            icon="pi pi-plus"
            label="作成"
            @click="emit('edit', undefined)"
          />
        </div>
      </div>
    </template>

    <Column field="name" header="名前" />

    <Column field="dates" header="日時">
      <template #body="{ data: { dates } }: { data: { dates: string[] } }">
        <div>
          <div v-for="(date, _) of dates" :key="_" class="white-space-nowrap">
            {{ date }}
          </div>
        </div>
      </template>
    </Column>

    <Column field="time" header="時間" />

    <Column field="time" header="事前通知">
      <template #body="{ data: { alarm } }: { data: { alarm: Alarm } }">
        <span v-if="alarm.beforeNotifyMin">{{ alarm.beforeNotifyMin }}分前</span>
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="next" header="次回アラーム">
      <template #body="{ data: { next } }: { data: { next: { date?: string, time?: string, duration?: string } } }">
        <div v-if="next">
          <div class="flex gap-1 flex-wrap">
            <span class="white-space-nowrap">{{ next.date }}</span>
            <span class="white-space-nowrap">{{ next.time }}</span>
          </div>
          <div class="white-space-nowrap">
            ({{ next.duration }})
          </div>
        </div>
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="actions">
      <template #body="{ data: { alarm } }: { data: { alarm: Alarm } }">
        <div class="flex gap-1">
          <Button
            class="p-button-success"
            icon="pi pi-pencil"
            label="編集"
            @click="emit('edit', alarm)"
          />
          <Button
            class="p-button-outlined p-button-plain"
            icon="pi pi-bell"
            label="通知テスト"
            @click="onTestAlarm(alarm)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import { computed } from 'vue'
import { Alarm } from '../composables/storage/useAlarmBucket'
import { useAlarmAction } from '../composables/action/useAlarmAction'
import { // TODO: この辺 composable 化する
  format as dateFormat,
  formatDistance,
} from 'date-fns'
import { ja } from 'date-fns/locale'

const props = defineProps<{
  alarms: Alarm[],
}>()

const emit = defineEmits<{
  (e: 'edit', alarm?: Alarm): void,
}>()

///

const alarmAction = useAlarmAction()
const items = computed(() => {
  const now = new Date()
  return props.alarms.map(alarm => {
    const dates = alarm.dates.map((date) => {
      return dateFormat(new Date(date), 'yyyy-MM-dd (E)', { locale: ja })
    })
    const wods = alarm.weekOfDays.map((wod) => {
      return ja.localize?.day(wod) ?? wod
    })

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
      dates: [...wods, ...dates],
      time: alarm.time,
      next: next,

      alarm: alarm,
    }
  })
})

// const nextDate = computed(() => {
//   return alarmAction.getNextDate(new Date(), props.alarm)
// })


///

const onTestAlarm = async (alarm: Alarm) => {
  await alarmAction.openAlarms(new Date(), new Date(), [alarm.id])
}
</script>

<style scoped lang="scss">
.p-datatable  {
  ::v-deep(.p-column-title) {
    white-space: nowrap;
  }
}
</style>
