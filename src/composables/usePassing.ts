export const usePassing = () => {
  const dbSeed = async () => {
    const res = await chrome.runtime.sendMessage({ method: 'dbSeed' })
    if (typeof res === 'object' && 'error' in res) {
      throw new Error(res.error)
    }

    return res as boolean
  }

  return {
    dbSeed,
  }
}
