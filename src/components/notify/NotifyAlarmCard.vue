<template>
  <Card>
    <template #title>
      <div class="text-center ja-break-word">
        <div>{{ alarm.name }}</div>

        <div>
          {{ eventDateStr }}
          <span class="text-base font-semibold">
            ({{ eventDateDurationStr }})
          </span>
        </div>
      </div>
    </template>

    <template #content>
      <template v-for="(block, _) of noteBlocks" :key="_">
        <OgCard v-if="block.type === 'og'" :url="block.value" />

        <br v-if="block.type === 'br'">

        <span v-if="block.type === 'text'">{{ block.value }}</span>
      </template>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'

import { Alarm } from '../../composables/storage/useAlarmBucket'
import { useAlarmAction } from '../../composables/action/useAlarmAction'
import { computed } from 'vue'
import { // TODO: この辺 composable 化する
  format as dateFormat,
  formatDistanceToNow,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import OgCard from '../OgCard.vue'

const props = defineProps<{
  alarm: Alarm,
  baseDate?: Date,
}>()

const alarmAction = useAlarmAction()
const nextEventAt = computed(() => {
  return alarmAction.getNextDate((props.baseDate ?? new Date()), props.alarm, true)
})

const eventDateStr = computed(() => {
  const next = nextEventAt.value
  if (next) {
    const datetime = dateFormat(next, 'M/d (E) HH:mm', { locale: ja })
    return `${datetime}～`
  }

  return undefined
})

const eventDateDurationStr = computed(() => {
  const next = nextEventAt.value
  if (next) {
    const duration = formatDistanceToNow(next, { locale: ja, addSuffix: true })
    return duration
  }

  return undefined
})

///

const noteBlocks = computed(() => {
  // URL を分解していく
  const regexp = /([\s]+)|(https?:\/\/[-_.!~*\\'()a-zA-Z0-9;\\/?:\\@&=+\\$,%#]+)|(\S+)/g
  const note = props.alarm.note ?? ''
  const splits = note.match(regexp)

  const blocks = (splits || []).map(split => {
    if (split.startsWith('http')) {
      return { type: 'og', value: split }
    } else if (split.match(/[\r\n]+/)) {
      return { type: 'br' }
    } else {
      return { type: 'text', value: split }
    }
  })

  // 先頭に URL 要素を追加
  const url = props.alarm.url
  if (url) {
    blocks.unshift({ type: 'og', value: url })
  }

  return blocks
})

///
</script>

<style scoped lang="scss">
.p-card {
  border: 2px solid var(--yellow-500);

  ::v-deep(.p-card-content) {
    padding: 0;
  }
}
</style>
