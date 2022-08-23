import { formatISO9075 } from 'date-fns'
import prettyBytes from 'pretty-bytes'

export type AppAlarm = chrome.alarms.Alarm

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

  const getStorageUsed = async () => {
    const bytes = await chrome.storage.local.getBytesInUse()
    return {
      bytes: bytes,
      pretty: prettyBytes(bytes),
    }
  }

  const getAlarmData = async () => {
    const alarms = await chrome.alarms.getAll()
    return alarms
  }

  const getDebugData = async () => {
    const buckets = await chrome.storage.local.get()
    const alarms = await getAlarmData()
    const storage = await getStorageUsed()

    const man = chrome.runtime.getManifest()
    const manifest = {
      name: man.name,
      description: man.description,
      version: man.version,
      storage: storage.bytes,
    }

    return { manifest, alarms, buckets }
  }

  return {
    getLastCalledAt,
    setLastCalledAt,
    clear,

    getStorageUsed,
    getAlarmData,
    getDebugData,
  }
}
