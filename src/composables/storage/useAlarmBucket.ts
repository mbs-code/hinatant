import { formatISO9075 } from 'date-fns'

export type AlarmCase = {
  date: string
  overwriteTime: string
  note?: string
}

export type AlarmParam = {
  name: string
  url?: string
  note?: string

  weekOfDays: number[] // 0-6
  dates: string[] // YYYY-mm-dd[]
  time: string // HH:mm

  beforeNotifyMin: number // default: 0, マイナスで逆方向
  isAutoOpen: boolean

  cases: AlarmCase[]
}

export type Alarm = AlarmParam & {
  id: number
  sort: number
  lastNotifyAt?: string
  createdAt: string
  updatedAt: string
}

const validate = (alarms: Alarm[], alarm: Alarm) => {
  // ！ name が重複していないか確認
  const existName = alarms.find((al) => al.id !== alarm.id && al.name === alarm.name)
  if (existName) { throw new Error('名前が重複しています') }

  // ！ 必須要素が存在するか確認
  if (!alarm.name?.trim()) { throw new Error('名前を入力してください' )}
  if (!alarm.time?.trim()) { throw new Error('時間を入力してください' )}
}

export const useAlarmBucket = () => {
  const getAll = async (): Promise<Alarm[]> => {
    const bucket = await chrome.storage.local.get()
    return bucket.alarms ?? []
  }

  const create = async (param: AlarmParam) => {
    // 全件取得する
    const alarms = await getAll()

    // alarm の作成
    const maxId = alarms.reduce((prev, al) => Math.max(prev, al.id), 0)
    const date = new Date()
    const copyParam = JSON.parse(JSON.stringify(param)) // Proxy 解除
    const newAlarm: Alarm = {
      ...copyParam,
      id: maxId + 1,
      sort: maxId + 1,
      createdAt: formatISO9075(date),
      updatedAt: formatISO9075(date),
    }

    // バリデする
    validate(alarms, newAlarm)

    // 追加する
    alarms.push(newAlarm)
    await chrome.storage.local.set({ alarms })

    return newAlarm
  }

  const update = async (alarmId: number, param: AlarmParam) => {
    // 全件取得する
    const alarms = await getAll()

    // alarm を取り出す
    const alarmIndex = alarms.findIndex((al) => al.id === alarmId)
    if (alarmIndex === -1) {
      throw new Error('更新対象が存在しません')
    }
    const alarm = alarms[alarmIndex]

    // alarm の更新
    const date = new Date()
    const copyParam = JSON.parse(JSON.stringify(param)) // Proxy 解除
    const updAlarm: Alarm = {
      ...copyParam,
      id: alarm.id,
      sort: alarm.sort,
      createdAt: alarm.createdAt,
      updatedAt: formatISO9075(date),
    }

    // バリデする
    validate(alarms, updAlarm)

    // 置き換える
    alarms.splice(alarmIndex, 1, updAlarm)
    await chrome.storage.local.set({ alarms })

    return updAlarm
  }

  const remove = async (alarmId: number) => {
    // 全件取得する
    const alarms = await getAll()

    // alarm を取り出す
    const alarmIndex = alarms.findIndex((al) => al.id === alarmId)
    if (alarmIndex === -1) {
      throw new Error('削除対象が存在しません')
    }

    // 削除する
    alarms.splice(alarmIndex, 1)
    await chrome.storage.local.set({ alarms })

    return true
  }

  const clear = async (): Promise<void> => {
    await chrome.storage.local.remove('alarms')
  }

  return {
    getAll,
    create,
    update,
    remove,
    clear,
  }
}
