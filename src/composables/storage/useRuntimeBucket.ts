import { formatISO9075 } from 'date-fns'

export const useRuntimeBucket = () => {
  const getLastCalledAt = async () => {
    const bucket = await chrome.storage.local.get('lastCalledAt')
    const lastCalledAt = bucket.lastCalledAt as string

    return lastCalledAt
      ? new Date(lastCalledAt)
      : undefined
  }

  const setLastCalledAt = async (date: Date) => {
    console.log('[back] setLastCalled:', date)
    const value = formatISO9075(date)
    await chrome.storage.local.set({ lastCalledAt: value })

    return value
  }

  const clear = async () => {
    await chrome.storage.local.remove('lastCalledAt')
  }

  return {
    getLastCalledAt,
    setLastCalledAt,
    clear,
  }
}
