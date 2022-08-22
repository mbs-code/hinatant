export type Config = {
  useAlarm: boolean
  useOgp: boolean
  ogpImageDirection: 'v' | 'h'
  checkIntervalMin: number // アラームチェック間隔
}

export const useConfigBucket = () => {
  const get = async () => {
    const bucket = await chrome.storage.local.get('config')
    let config = bucket.config as Config

    if (!config) {
      config = {
        useAlarm: true,
        useOgp: false,
        ogpImageDirection: 'v',
        checkIntervalMin: 1,
      }
    }

    return config
  }

  const set = async (config: Config) => {
    await chrome.storage.local.set({ config: config })
    return config
  }

  const clear = async (): Promise<void> => {
    await chrome.storage.local.remove('config')
  }

  return {
    get,
    set,
    clear,
  }
}
