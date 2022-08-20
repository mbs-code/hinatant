import { commands, CommandName } from './command'
import { addSeconds } from 'date-fns'
import { useRuntimeBucket } from '../composables/storage/useRuntimeBucket'
import { useAlarmBucket } from '../composables/storage/useAlarmBucket'
import { useAlarmAction } from '../composables/action/useAlarmAction'

// コマンド受信
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async function() {
    try {
      console.log('[back] listen:', request)

      const method = request?.method as string
      if (!(method in commands)) {
        throw new ReferenceError(`Method is not implements. method=${method}`)
      }

      const res = await commands[method as CommandName](request, sender)
      sendResponse(res)
    } catch (err) {
      if (err instanceof Error) {
        sendResponse({ error: err.toString() })
      }
      throw err
    }
  })()

  return true
})

///

const runtimeBucket = useRuntimeBucket()
const alarmBucket = useAlarmBucket()
const alarmAction = useAlarmAction()

// 起動時に
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[back] onStartup')

  // 今の時間を Storage に記録
  const now = new Date()
  await runtimeBucket.setLastCalledAt(now)

  // 初回実行時間を算出
  const sec = now.getSeconds()
  const when = addSeconds(now, (60 - sec) + 5) // 負荷対策に5秒遅らす
  console.log('[back] waitAfter:', when)

  // when から一分おきに実行
  chrome.alarms.create('check', { when:  when.getTime(), periodInMinutes : 1 })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'check') { return }

  const now = new Date(alarm.scheduledTime)
  console.log('[back] checkAlarm:', now)

  const lastCalledAt = await runtimeBucket.getLastCalledAt()
  if (!lastCalledAt) {
    console.log('[back] err: lastCalledAt is undefined')
    await runtimeBucket.setLastCalledAt(now)
    return
  }

  // lastCalledAt - now 間のアラームを取得
  const calledAlarms = (await alarmBucket.getAll())
    .filter(alarm => {
      const nextCalledAt = alarmAction.getNextDate(lastCalledAt, alarm)
      return nextCalledAt && nextCalledAt <= now
    })

  console.log('[back] targetAlarm:', calledAlarms.length)
  if (calledAlarms.length) {
    // TODO: 自動起動未実装

    const alarmIds = calledAlarms.map(alarm => alarm.id)
    const params = new URLSearchParams({
      date: String(new Date().getTime()),
      alarms: JSON.stringify(alarmIds),
    })

    await chrome.tabs.create({ 'url': `/src/toast/index.html?${params.toString()}` })
  }

  // 実行記録を付ける
  await runtimeBucket.setLastCalledAt(now)
})
