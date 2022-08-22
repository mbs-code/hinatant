import { formatISO9075 } from 'date-fns'
import prettyBytes from 'pretty-bytes'

export const useRuntimeBucket = () => {
  const getLastCalledAt = async () => {
    const bucket = await chrome.storage.local.get('lastCalledAt')
    const lastCalledAt = bucket.lastCalledAt as string

    return lastCalledAt
      ? new Date(lastCalledAt)
      : undefined
  }

  const setLastCalledAt = async (date: Date) => {
    const value = formatISO9075(date)
    await chrome.storage.local.set({ lastCalledAt: value })

    return value
  }

  const clear = async () => {
    await chrome.storage.local.remove('lastCalledAt')
  }

  ///

  const getDebugData = async () => {
    const buckets = await chrome.storage.local.get()
    const alarms = await chrome.alarms.getAll()

    const storageLength = await chrome.storage.local.getBytesInUse()

    const man = chrome.runtime.getManifest()
    const manifest = {
      name: man.name,
      description: man.description,
      version: man.version,
      storage: prettyBytes(storageLength),
    }

    return { manifest, alarms, buckets }
  }

  return {
    getLastCalledAt,
    setLastCalledAt,
    clear,

    getDebugData,
  }
}
