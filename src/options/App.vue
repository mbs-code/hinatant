<template>
  <div class="flex gap-2">
    <Button @click="openAlarmEditDoalog()">
      新規追加
    </Button>

    <Button @click="onDbSeed">
      テストDB作成
    </Button>
  </div>

  <div>
    <template v-for="(alarm, _) of alarms" :key="_">
      <AlarmPanel
        :alarm="alarm"
        @edit="openAlarmEditDoalog(alarm)"
      />
    </template>
  </div>

  <AlarmEditDialog
    v-model:visible="showAlarmEditDialog"
    :alarm="selectedAlarm"
    @change="fetchAlarms"
  />

  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import AlarmPanel from '../components/AlarmPanel.vue'
import AlarmEditDialog from '../components/AlarmEditDialog.vue'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

import { onMounted, ref } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { usePassing } from '../composables/usePassing'
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

const openAlarmEditDoalog = (alarm?: Alarm) => {
  selectedAlarm.value = alarm
  showAlarmEditDialog.value = true
}

///

const passing = usePassing()
const onDbSeed = async () => {
  try {
    await passing.dbSeed()
    await fetchAlarms()
  } catch (err) {
    appToast.thrown(err)
  }
}
</script>
