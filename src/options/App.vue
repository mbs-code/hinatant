<template>
  <div class="flex gap-2">
    <Button @click="onDbSeed">
      テストDB作成
    </Button>
  </div>

  <AlarmTable
    :alarms="alarms"
    @edit="openAlarmEditDialog($event)"
    @swap="onSwapAlarm"
  />

  <pre>{{ alarms }}</pre>

  <AlarmEditDialog
    v-model:visible="showAlarmEditDialog"
    :alarm="selectedAlarm"
    @change="fetchAlarms"
  />

  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import AlarmEditDialog from '../components/AlarmEditDialog.vue'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

import { onMounted, ref } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { usePassing } from '../composables/usePassing'
import { useAppToast } from '../composables/useAppToast'
import AlarmTable from '../components/AlarmTable.vue'

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

///

const passing = usePassing()
const onDbSeed = async () => {
  try {
    await passing.dbSeed()
    await fetchAlarms() // 更新
  } catch (err) {
    appToast.thrown(err)
  }
}
</script>
