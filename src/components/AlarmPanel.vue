<template>
  <div style="background: #add8e6">
    <pre>
      {{ alarm }}
      {{ nextDate }}
    </pre>

    <Button @click="emit('edit')">
      edit
    </Button>

    <Button @click="onTestAlarm">
      test
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'

import { Alarm } from '../composables/storage/useAlarmBucket'
import { useAlarmAction } from '../composables/action/useAlarmAction'

const props = defineProps<{
  alarm: Alarm,
}>()

const emit = defineEmits<{
  (e: 'edit'): void,
}>()

///

const alarmAction = useAlarmAction()
const nextDate = computed(() => {
  return alarmAction.getNextDate(new Date(), props.alarm)
})

const onTestAlarm = async () => {
  await alarmAction.openAlarms(new Date(), new Date(), [props.alarm.id])
}
</script>
