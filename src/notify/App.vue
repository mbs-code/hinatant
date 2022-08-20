<template>
  時間になりました

  <pre>{{ params }}</pre>

  <Toast />
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { useAppToast } from '../composables/useAppToast'

const params = reactive<{
  date?: Date,
  alarms?: Alarm[]
}>({})

const alarmBucket = useAlarmBucket()
const appToast = useAppToast()

onMounted(async () => {
  try {
    // url params を解析
    const url = new URL(window.location.href)
    const sp = url.searchParams

    // 実行した日付を取り出す
    const date = sp.get('date')
    if (date) {
      params.date = new Date(Number(date))
    }

    // 対象の alarm を取り出す
    const alarms = sp.get('alarms')
    if (alarms) {
      const alarmIds = JSON.parse(alarms)
      params.alarms = await alarmBucket.getAll(alarmIds)
    }
  } catch (err) {
    appToast.thrown(err)
  }
})
</script>
