import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '#task': fileURLToPath(new URL('./src/task', import.meta.url)),
    },
  },
})