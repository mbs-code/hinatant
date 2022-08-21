<template>
  <Dialog
    v-model:visible="_visible"
    :style="{ width: '80vw' }"
    :draggable="false"
    modal
  >
    <template #header>
      <div class="text-2xl font-bold">
        <span><i class="pi pi-bell" /></span>
        アラーム編集
      </div>
    </template>

    <div class="field grid field-horizontal">
      <label>名前*</label>
      <div class="col">
        <InputText v-model="form.name" class="w-full" autofocus />
      </div>
    </div>

    <div class="field grid field-horizontal">
      <label>曜日</label>
      <div class="col">
        <SelectButton
          v-model="_formWeekOfDays"
          :options="weekOfDayLabels"
          option-label="name"
          option-value="value"
          multiple
        />
      </div>
    </div>

    <div class="field grid field-horizontal">
      <label>日付</label>
      <div class="col">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-calendar" />
          </span>

          <Chips v-model="form.dates" class="my-chip" @click="openDateCalendar">
            <template #chip="slotProps">
              <div class="flex-grow-1">
                <i class="pi pi-calendar px-1" />
                <span>{{ formatDate(slotProps.value) }}</span>
              </div>
            </template>
          </Chips>
        </div>

        <OverlayPanel ref="opDateCalendar" :show-close-icon="true">
          <Calendar
            v-model="_formDates"
            selection-mode="multiple"
            date-format="yy-mm-dd"
            :manual-input="false"
            :inline="true"
          />
        </OverlayPanel>
      </div>
    </div>

    <div class="field grid field-horizontal">
      <label>時間*</label>
      <div class="col col-narrow">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-clock" />
          </span>

          <Calendar
            v-model="_formTime"
            :manual-input="false"
            :time-only="true"
          />
        </div>
      </div>
    </div>

    <div class="field grid field-horizontal">
      <label>事前通知</label>
      <div class="col col-narrow">
        <div class="p-inputgroup">
          <InputNumber
            v-model="form.beforeNotifyMin"
            mode="decimal"
            :show-buttons="true"
            :step="5"
          />

          <span class="p-inputgroup-addon">
            分前
          </span>
        </div>
      </div>
    </div>

    <Divider />

    <div class="field grid field-horizontal">
      <label>URL</label>
      <div class="col">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-link" />
          </span>

          <InputText v-model="form.url" />
        </div>
      </div>
    </div>

    <div class="field grid field-horizontal">
      <label />
      <div class="col">
        <div class="field-checkbox m-0">
          <Checkbox v-model="form.isAutoOpen" input-id="isAutoOpen" binary />
          <label for="isAutoOpen" class="white-space-nowrap">URLを自動的に開く</label>
        </div>
      </div>
    </div>

    <div class="field grid field-horizontal">
      <label>メモ</label>
      <div class="col">
        <Textarea v-model="form.note" class="w-full" rows="5" />
      </div>
    </div>

    <template #footer>
      <div class="flex">
        <Button v-if="alarm?.id" class="p-button-text p-button-danger" @click="onDelete">
          Delete
        </Button>
        <Button class="p-button-text p-button-plain" @click="onInit">
          Reset
        </Button>
        <div class="flex-grow-1" />
        <Button @click="onSave">
          Save
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import Chips from 'primevue/chips'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import OverlayPanel from 'primevue/overlaypanel'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'

import { computed, reactive, ref, watch } from 'vue'
import { Alarm, AlarmParam, useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { // TODO: この辺 composable 化する
  parse as dateParse,
  format as dateFormat,
  formatDistanceToNow,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import { useAppToast } from '../composables/useAppToast'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps<{
  visible: boolean,
  alarm?: Alarm,
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'change'): void
}>()

const _visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const weekOfDayLabels = ref([
  { name: '日', value: 0 },
  { name: '月', value: 1 },
  { name: '火', value: 2 },
  { name: '水', value: 3 },
  { name: '木', value: 4 },
  { name: '金', value: 5 },
  { name: '土', value: 6 },
])

///

const opDateCalendar = ref<OverlayPanel>()
const openDateCalendar = (event: Event) => {
  opDateCalendar.value?.toggle(event)
}

const formatDate = (str?: string) => {
  if (str) {
    const date = new Date(str)
    const diffDays = formatDistanceToNow(date, { locale: ja, addSuffix: true })
    return dateFormat(date, 'yyyy-MM-dd (E, ', { locale: ja }) + `${diffDays})`
  }
}

///

const form = reactive<AlarmParam>({
  name: '',
  url: undefined,
  note: undefined,

  weekOfDays: [],
  dates: [],
  time: '',

  beforeNotifyMin: 0,
  isAutoOpen: false,
  cases: [],
})
const _formTime = computed({
  get: () => form.time ? dateParse(form.time, 'HH:mm', new Date()) : undefined,
  set: (date?: Date) => { form.time = date ? dateFormat(date, 'HH:mm') : '' },
})
const _formDates = computed({
  get: () => form.dates.map((date) => new Date(date)),
  set: (dates?: Date[]) => {
    form.dates = dates ? dates.map((date) => dateFormat(date, 'yyyy-MM-dd')).sort() : []
  }
})
const _formWeekOfDays = computed({
  get: () => form.weekOfDays ?? [],
  set: (wods: number[]) => { form.weekOfDays = wods.sort() ?? [] }
})

const onInit = () => {
  form.name = props.alarm?.name ?? ''
  form.url = props.alarm?.url ?? ''
  form.note = props.alarm?.note ?? ''

  form.weekOfDays = props.alarm?.weekOfDays ?? []
  form.dates = props.alarm?.dates ?? []
  form.time = props.alarm?.time ?? '00:00'

  form.beforeNotifyMin = props.alarm?.beforeNotifyMin ?? 0
  form.isAutoOpen = props.alarm?.isAutoOpen ?? false
  form.cases = props.alarm?.cases ?? []
}

watch(_visible, (val) => val && onInit())

///

const appToast = useAppToast()
const confirm = useConfirm()
const alarmBucket = useAlarmBucket()
const onSave = async () => {
  try {
    const alarmId = props.alarm?.id
    alarmId
      ? await alarmBucket.update(alarmId, form)
      : await alarmBucket.create(form)

    emit('change')
    appToast.success('保存しました。')
    _visible.value = false
  } catch (err) {
    appToast.thrown(err)
  }
}

const onDelete = async () => {
  const alarmId = props.alarm?.id
  if (!alarmId) return

  confirm.require({
    message: 'このレコードを削除しますか？',
    header: '確認',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await alarmBucket.remove(alarmId)

        emit('change')
        appToast.success('削除しました。')
        _visible.value = false
      } catch (err) {
        appToast.thrown(err)
      }
    },
  })
}
</script>

<style scoped lang="scss">
.field-horizontal {
  flex-wrap: nowrap;

  .p-component {
    min-height: 2.625rem;
  }
  label {
    width: 80px;
    min-width: 80px;
  }
  .col-narrow {
    max-width: 13.5rem;
  }
}

.p-checkbox {
  align-items: center;
}

.my-chip {
  ::v-deep(.p-chips-multiple-container) {
    gap: 0.25rem;
  }
  ::v-deep(.p-chips-token) {
    margin: 0;
  }
  ::v-deep(.p-chips-input-token) {
    display: none;
  }
}
</style>
