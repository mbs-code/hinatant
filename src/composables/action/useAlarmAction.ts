import { Alarm } from '../storage/useAlarmBucket'
import { addDays, subMinutes, compareAsc } from 'date-fns'

export const useAlarmAction = () => {
  const getNextDates = (baseDate: Date, alarm: Alarm, ignoreBeforeNotify?: boolean) => {
    // 上書きcase -> 日時 -> 曜日 の順で見ていく
    // TODO: 上書き未実装

    const baseWod = baseDate.getDay() // 0-6
    const time = alarm.time
    const beforeNotifyMin = alarm.beforeNotifyMin // 事前通知

    // ■ 各曜日を、次のアラーム日時に変換
    const nextByWods = alarm.weekOfDays.map((wod) => {
      const plusDays = baseWod <= wod
        ? wod - baseWod
        : 7 + (wod - baseWod) // base より前の日付は+7日

      const date = addDays(baseDate, plusDays)
      let next = new Date(date.toDateString() + ' ' + time)
      if (!ignoreBeforeNotify) {
        next = subMinutes(next, beforeNotifyMin) // 事前通知分を引く
      }
      if (next < baseDate) {
        next = addDays(next, 7) // もし過去だったら一週間後
      }

      return next
    })

    // ■ 各日付を、アラーム日時に変換
    const nextByDates = alarm.dates.map((date) => {
      let next = new Date(date + ' ' + time)
      if (!ignoreBeforeNotify) {
        next = subMinutes(next, beforeNotifyMin) // 事前通知分を引く
      }

      return next
    })

    // ■ 配列を結合して、base より後の直近の日付でフィルター
    const nextDates = [...nextByWods, ...nextByDates]
      .sort(compareAsc)
      .filter((date) =>  baseDate <= date)

    return nextDates
  }

  const getNextDate = (baseDate: Date, alarm: Alarm, ignoreBeforeNotify?: boolean) => {
    const nextDates = getNextDates(baseDate, alarm, ignoreBeforeNotify)
    return nextDates.at(0)
  }

  ///

  const openAlarms = async (lastCalledDate: Date, invokeDate: Date, alarmIds: number[]) => {
    // TODO: 自動起動未実装

    const params = new URLSearchParams({
      last_called_at: String(lastCalledDate.getTime()),
      invoke_at: String(invokeDate.getTime()),
      alarms: alarmIds.join(','),
    })

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    await chrome.tabs.create({
      url: `/src/notify/index.html?${params.toString()}`,
      windowId: tab?.windowId,
      openerTabId: tab?.id,
    })
  }


  return {
    getNextDates,
    getNextDate,
    openAlarms,
  }
}
