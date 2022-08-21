import { AlarmParam, useAlarmBucket } from '../composables/storage/useAlarmBucket'

const alarmBucket = useAlarmBucket()

export const commands: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (request?: any, sender?: any) => Promise<unknown>
} = {
  dbSeed: async () => {
    await chrome.storage.local.clear()

    for (const seed of alarmSeeds) {
      await alarmBucket.create(seed)
    }

    return true
  },
}

export type CommandName = keyof typeof commands

///

const alarmSeeds: AlarmParam[] = [
  {
    name: 'テストA',
    url: 'https://www.hinatazaka46.com/s/official/?ima=0000',
    note: 'めもだよー\n改行実験\n展開テスト：https://ogp.me/',

    weekOfDays: [0, 6],
    dates: ['2022-08-20'],
    time: '20:00',
    beforeNotifyMin: 5,
    isAutoOpen: false,

    cases: [
      { date: '2022-08-14', overwriteTime: '20:00', note: '時間変更' },
      { date: '2022-08-21', overwriteTime: undefined, note: '中止' },
    ],
  },
  {
    name: 'テストB',
    url: 'https://www.yahoo.co.jp/',
    note: 'やふーーー',

    weekOfDays: [2, 3],
    dates: [],
    time: '22:00',
    beforeNotifyMin: 0,
    isAutoOpen: true,

    cases: [],
  },
]
