import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['../vitest.setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['**/src/**'],
        exclude: ['**/index.ts', '**/__tests__/**', '**/*.stories.ts'],
        thresholds: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    }
  })
)

