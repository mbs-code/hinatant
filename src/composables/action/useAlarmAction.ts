import { Alarm } from '../storage/useAlarmBucket'
import { addDays, compareAsc } from 'date-fns'

export const useAlarmAction = () => {
  const getNextDates = (baseDate: Date, alarm: Alarm) => {
    // 上書きcase -> 日時 -> 曜日 の順で見ていく
    // TODO: 上書き未実装

    const baseWod = baseDate.getDay() // 0-6
    const time = alarm.time

    // ■ 各曜日を、次のアラーム日時に変換
    const nextByWods = alarm.weekOfDays
      .map((wod) => {
        const plusDays = baseWod >= wod
          ? wod - baseWod
          : 7 + (wod - baseWod) // base より前の日付は+7日

        const date = addDays(baseDate, plusDays)
        let next = new Date(date.toDateString() + ' ' + time)
        if (next < baseDate) { next = addDays(next, 7) } // もし過去だったら一週間後
        return next
      })

    // ■ 各日付を、アラーム日時に変換
    const nextByDates = alarm.dates
      .map((date) => new Date(date + ' ' + time))

    // ■ 配列を結合して、base より後の直近の日付でフィルター
    const nextDates = [...nextByWods, ...nextByDates]
      .sort(compareAsc)
      .filter((date) =>  baseDate <= date)

    return nextDates
  }

  const getNextDate = (baseDate: Date, alarm: Alarm) => {
    const nextDates = getNextDates(baseDate, alarm)
    return nextDates.at(0)
  }

  return {
    getNextDates,
    getNextDate,
  }
}
