<template>
  <div class="flex flex-column gap-2">
    <div class="flex gap-2">
      <div class="flex-grow-1" />

      <Button class="p-button-secondary" icon="pi pi-cog" @click="openConfig" />
    </div>

    <template v-for="(alarm, _) of alarms" :key="_">
      <PopupAlarmCard
        :alarm="alarm"
        @open="openNotifyDialog(alarm)"
      />
    </template>
  </div>

  <PopupAlarmDialog
    v-model:visible="showNotifyDialog"
    :alarm="selectedAlarm"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import PopupAlarmCard from '../components/alarm/PopupAlarmCard.vue'

import { onMounted, ref } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { usePassing } from '../composables/usePassing'
import PopupAlarmDialog from '../components/alarm/PopupAlarmDialog.vue'

const alarmBucket = useAlarmBucket()
const alarms = ref<Alarm[]>([])

const fetchAlarms = async () => {
  try {
    alarms.value = await alarmBucket.getAll()
  } catch (err) {
    if (err instanceof Error) {
      window.alert(err.toString())
    }
  }
}

onMounted(async () => await fetchAlarms())

///

const passing = usePassing()
const openConfig = async () => {
  await passing.openOptionsPage()
}

///

const showNotifyDialog = ref<boolean>(false)
const selectedAlarm = ref<Alarm>()
const openNotifyDialog = (alarm: Alarm) => {
  showNotifyDialog.value = true
  selectedAlarm.value = alarm
}
</script>
