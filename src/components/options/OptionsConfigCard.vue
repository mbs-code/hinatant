<template>
  <Card v-if="config">
    <template #title>
      <IconText
        icon="pi pi-cog"
        label="環境設定 (デフォルト推奨)"
      />
    </template>

    <template #content>
      <div class="field-horizontal">
        <div class="p-inputgroup">
          <Checkbox
            v-model="config.useAlarm"
            input-id="useAlarm"
            binary
            @change="onChange"
          />
          <label for="useAlarm">アラームを使用する</label>
        </div>
      </div>

      <div class="field-horizontal">
        <div class="p-inputgroup">
          <Checkbox
            v-model="config.useOgp"
            input-id="useOgp"
            binary
            @change="onChange"
          />
          <label for="useOgp">OGPを使用する(リンクカード)</label>
        </div>
      </div>

      <div class="field-horizontal">
        <label>OGP画像の配置方向</label>
        <SelectButton
          v-model="config.ogpImageDirection"
          :options="ogpDirectionLabels"
          option-label="name"
          option-value="value"
          :unselectable="false"
          :disabled="!config.useOgp"
          @change="onChange"
        />
      </div>

      <div class="field-horizontal">
        <label>チェック間隔</label>
        <div class="p-inputgroup">
          <InputNumber
            v-model="config.checkIntervalMin"
            mode="decimal"
            class="addon-after"
            :show-buttons="true"
            :step="1"
            :min="1"
            :max="60"
            @change="onChange"
          />

          <span class="p-inputgroup-addon">
            分間隔
          </span>
        </div>
      </div>

      <div class="field-horizontal">
        <label>ストレージ容量</label>

        <label>{{ storageUsed?.pretty }}</label>
      </div>

      <div class="field-horizontal">
        <label>最終チェック日時</label>

        <label>{{ lastCalledDateStr ?? '-' }}</label>
      </div>

      <div class="field-horizontal">
        <label>次回チェック日時</label>

        <label>{{ nextAlarmDateStr ?? '-' }}</label>
      </div>

      <div class="field-horizontal gap-4">
        <Button
          class="p-button-plain p-button-text"
          icon="pi pi-sync"
          :label="(fetchdDateStr ?? '-') + ' 時点'"
          @click="fetchData"
        />

        <Button class="p-button-outlined" @click="onDebug">
          デバッグ
        </Button>

        <Button class="p-button-danger p-button-outlined" @click="onDbSeed">
          初期化
        </Button>
      </div>
    </template>
  </Card>

  <AppDebugDialog v-model:visible="showDebugDialog" />
</template>

<script setup lang="ts">
import Button from'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import SelectButton from 'primevue/selectbutton'
import InputNumber from 'primevue/inputnumber'
import AppDebugDialog from './AppDebugDialog.vue'

import { computed, onMounted, ref } from 'vue'
import { Config, useConfigBucket } from '../../composables/storage/useConfigBucket'
import { useAppToast } from '../../composables/useAppToast'
import IconText from '../IconText.vue'
import { usePassing } from '../../composables/usePassing'
import { useConfirm } from 'primevue/useconfirm'
import { useRuntimeBucket, AppAlarm } from '../../composables/storage/useRuntimeBucket'
import { // TODO: この辺 composable 化する
  format as dateFormat,
} from 'date-fns'

const ogpDirectionLabels = ref([
  { name: '縦方向', value: 'v' },
  { name: '横方向', value: 'h' },
])

///

const appToast = useAppToast()
const configBucket = useConfigBucket()
const runtimeBucket = useRuntimeBucket()

const config = ref<Config>()
const storageUsed = ref<{ bytes: number, pretty: string}>()
const appAlarms = ref<AppAlarm[]>([])
const lastCalledAt = ref<Date>()

const fetchdAt = ref<Date>()

const fetchData = async () => {
  try {
    config.value = await configBucket.get()
    appAlarms.value = await runtimeBucket.getAlarmData()
    storageUsed.value = await runtimeBucket.getStorageUsed()
    lastCalledAt.value = await runtimeBucket.getLastCalledAt()

    fetchdAt.value = new Date()
  } catch (err) {
    appToast.thrown(err)
  }
}

onMounted(async () => await fetchData())

const fetchdDateStr = computed(() => {
  return fetchdAt.value
    ? dateFormat(fetchdAt.value, 'yyyy-MM-dd HH:mm:ss')
    : undefined
})

const nextAlarmDateStr = computed(() => {
  return appAlarms.value
    .map((al) => dateFormat(new Date(al.scheduledTime), 'yyyy-MM-dd HH:mm:ss'))
    .join(', ') ?? undefined
})

const lastCalledDateStr = computed(() => {
  return lastCalledAt.value
    ? dateFormat(lastCalledAt.value, 'yyyy-MM-dd HH:mm:ss')
    : undefined
})

///

const onChange = async () => {
  const nuget = config.value
  if (!nuget) return

  try {
    await configBucket.set(nuget)
  } catch (err) {
    appToast.thrown(err)
  }
}

///

const showDebugDialog = ref<boolean>(false)
const onDebug = () => {
  showDebugDialog.value = true
}

///

const confirm = useConfirm()
const passing = usePassing()
const onDbSeed = async () => {
  confirm.require({
    message: '全てのデータを削除します。よろしいですか？',
    header: '確認',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await passing.dbSeed()
        window.location.reload() // リロード
      } catch (err) {
        appToast.thrown(err)
      }
    },
  })
}
</script>

<style scoped lang="scss">
.p-card {
  ::v-deep(.p-card-body) {
    padding: 1rem;
  }
  ::v-deep(.p-card-content) {
    padding: 0;
  }
}
</style>
