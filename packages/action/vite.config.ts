import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'FzAction',
    },
    rollupOptions: {
      external: ['vue', '@fiscozen/icons', '@fiscozen/link'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    }
  }
})
