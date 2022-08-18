import { commands, CommandName } from './command'

chrome.runtime.onInstalled.addListener(() => {
  console.log('init')

  chrome.contextMenus.create({
    id: 'sampleContextMenu',
    title: 'Sample Context Menu',
    contexts: ['all'],
  })
})

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
