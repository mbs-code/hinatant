import { crx, defineManifest } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://crxjs.dev/vite-plugin/concepts/manifest
const manifest = defineManifest({
  manifest_version: 3,
  name: 'hinatant',
  version: '1.0.0',
  permissions: ['bookmarks', 'tabs', 'contextMenus'],
  action: {
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/serviceWorker.ts',
    type: 'module',
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), crx({ manifest })],
})
