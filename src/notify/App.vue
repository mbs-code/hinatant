<template>
  <div class="flex justify-content-center">
    <div class="flex flex-column gap-2 col-12 md:col-10 lg:col-8 xl:col-8">
      <NotifyTimeCard :date="params.invokeDate" />

      <div class="my-3">
        <template v-for="(alarm, _) of params.alarms" :key="_">
          <NotifyAlarmCard
            :alarm="alarm"
            :base-date="params.lastCalledDate"
          />
        </template>
      </div>

      <Button
        class="p-button-raised p-button-text"
        label="閉じる"
        icon="pi pi-times"
        @click="onClose"
      />
    </div>
  </div>

  <pre>{{ params }}</pre>

  <Toast />
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import NotifyAlarmCard from '../components/notify/NotifyAlarmCard.vue'

import { onMounted, reactive } from 'vue'
import { Alarm, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { useAppToast } from '../composables/useAppToast'
import NotifyTimeCard from '../components/notify/NotifyTimeCard.vue'

// URL params
const params = reactive<{
  lastCalledDate?: Date,
  invokeDate?: Date,
  alarms?: Alarm[],
}>({})

const alarmBucket = useAlarmBucket()
const appToast = useAppToast()

onMounted(async () => {
  try {
    // url params を解析
    const url = new URL(window.location.href)
    const sp = url.searchParams

    // 前回呼び出した日付を取り出す
    const lastCalledAt = sp.get('called_at')
    if (lastCalledAt) {
      params.lastCalledDate = new Date(Number(lastCalledAt))
    }

    // 実行した日付を取り出す
    const invokeAt = sp.get('invoke_at')
    if (invokeAt) {
      params.invokeDate = new Date(Number(invokeAt))
    }

    // 対象の alarm を取り出す
    const alarms = sp.get('alarms')
    if (alarms) {
      const alarmIds = alarms.split(',')
        .map(id => Number(id))
        .filter((x, i, self) => self.indexOf(x) === i)
      params.alarms = await alarmBucket.getAll(alarmIds)
    }
  } catch (err) {
    appToast.thrown(err)
  }
})

const onClose = () => {
  window.close()
}
</script>