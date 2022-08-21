import { crx, defineManifest } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://crxjs.dev/vite-plugin/concepts/manifest
const manifest = defineManifest({
  manifest_version: 3,
  name: 'hinatant',
  version: '1.0.0',
  permissions: [
    'alarms',
    'tabs',
    'storage',
    'unlimitedStorage',
  ],
  host_permissions: [
    '<all_urls>',
  ],
  action: {
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/main.ts',
    type: 'module',
  },
  options_page: 'src/options/index.html',
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), crx({ manifest })],

  build: {
    rollupOptions: {
      input: {
        notify: 'src/notify/index.html',
      },
    },
  },
})
