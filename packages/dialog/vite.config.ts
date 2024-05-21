import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

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
      name: 'FzDialog',
    },
    rollupOptions: {
      external: ['vue', "@fiscozen/button"],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    }
  }
})
