<template>
  <div style="background: #add8e6">
    <pre>{{ alarm }}</pre>

    <Button @click="emit('edit')">
      edit
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

import { Alarm } from '../composables/storage/useAlarmBucket'

defineProps<{
  alarm: Alarm,
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()
</script>
