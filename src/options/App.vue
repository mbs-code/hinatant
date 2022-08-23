<template>
  <AlarmTable
    :alarms="alarms"
    @edit="openAlarmEditDialog($event)"
    @swap="onSwapAlarm"
  />

  <OptionsConfigCard />

  <AlarmEditDialog
    v-model:visible="showAlarmEditDialog"
    :alarm="selectedAlarm"
    @change="fetchAlarms"
  />

  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import AlarmEditDialog from '../components/alarm/AlarmEditDialog.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import AlarmTable from '../components/alarm/AlarmTable.vue'
import OptionsConfigCard from '../components/options/OptionsConfigCard.vue'

import { onMounted, ref } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { useAppToast } from '../composables/useAppToast'

const appToast = useAppToast()
const alarmBucket = useAlarmBucket()
const alarms = ref<Alarm[]>([])

const fetchAlarms = async () => {
  try {
    alarms.value = await alarmBucket.getAll()
  } catch (err) {
    appToast.thrown(err)
  }
}

onMounted(async () => await fetchAlarms())

///

const showAlarmEditDialog = ref<boolean>(false)
const selectedAlarm = ref<Alarm>()

const openAlarmEditDialog = (alarm?: Alarm) => {
  selectedAlarm.value = alarm
  showAlarmEditDialog.value = true
}

const onSwapAlarm = async (dragAlarm: Alarm, dropAlarm: Alarm) => {
  try {
    await alarmBucket.swap(dragAlarm.id, dropAlarm.id)
    await fetchAlarms() // 更新
  } catch (err) {
    appToast.thrown(err)
  }
}
</script>
