<template>
  <div>
    {{ alarms }}
  </div>

  <button @click="onDbSeed">
    テストDB作成
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { usePassing } from '../composables/usePassing'

const alarmBucket = useAlarmBucket()
const alarms = ref<Alarm[]>([])

const fetchAlarms = async () => {
  console.log('[front] reload alarms')
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
const onDbSeed = async () => {
  await passing.dbSeed()
  await fetchAlarms()
}
</script>
