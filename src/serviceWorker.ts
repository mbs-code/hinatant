export {}

chrome.runtime.onInstalled.addListener(() => {
  console.log('init')

  chrome.contextMenus.create({
    id: 'sampleContextMenu',
    title: 'Sample Context Menu',
    contexts: ['all'],
  })
})
