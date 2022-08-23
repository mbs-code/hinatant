<template>
  <Card v-if="config">
    <template #title>
      <IconText
        icon="pi pi-cog"
        label="環境設定"
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


      <div class="flex gap-2">
        <Button @click="onDebug">
          デバッグ
        </Button>

        <Button @click="onDbSeed">
          テストDB作成
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

import { onMounted, ref } from 'vue'
import { Config, useConfigBucket } from '../../composables/storage/useConfigBucket'
import { useAppToast } from '../../composables/useAppToast'
import IconText from '../IconText.vue'
import { usePassing } from '../../composables/usePassing'

const ogpDirectionLabels = ref([
  { name: '縦方向', value: 'v' },
  { name: '横方向', value: 'h' },
])

///

const appToast = useAppToast()
const configBucket = useConfigBucket()
const config = ref<Config>()

const fetchConfig = async () => {
  try {
    config.value = await configBucket.get()
  } catch (err) {
    appToast.thrown(err)
  }
}

onMounted(async () => await fetchConfig())

const onChange = async () => {
  console.log('change')

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

const passing = usePassing()
const onDbSeed = async () => {
  try {
    await passing.dbSeed()
    window.location.reload() // リロード
  } catch (err) {
    appToast.thrown(err)
  }
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
