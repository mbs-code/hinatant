export const commands: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (request?: any, sender?: any) => Promise<unknown>
} = {
  dbSeed: async () => {
    await chrome.storage.local.clear()
    await chrome.storage.local.set({ 'alarms': [
      {
        id: 1,
        sort: 1,
        name: 'テスト',
        url: 'https://www.hinatazaka46.com/s/official/?ima=0000',
        note: 'めもだよー\n改行実験\n展開テスト：https://ogp.me/',

        weekOfDays: [0, 6],
        dates: ['2022-08-20'],
        time: '20:00',
        beforeNotifySec: 60,
        isAutoOpen: false,

        cases: [
          { date: '2022-08-14', overwriteTime: '20:00', note: '時間変更' },
          { date: '2022-08-21', overwriteTime: null, note: '中止' },
        ],

        createdAt: '2022-08-19 00:00:00',
        updatedAt: '2022-08-19 00:00:00',
      }
    ]})

    return true
  },
}

export type CommandName = keyof typeof commands
