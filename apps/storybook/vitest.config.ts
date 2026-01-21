import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      storybookTest({
        // Percorso alla configurazione di Storybook
        storybookScript: 'pnpm run storybook --ci'
      })
    ],
    test: {
      name: 'storybook',
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Add teardown timeout to allow browser to close gracefully
      teardownTimeout: 10000,
      // Global test timeout
      testTimeout: 30000,
      // Hook timeout for setup/teardown
      hookTimeout: 30000,
      // Retry flaky tests
      retry: 1,
      // Disable parallel file execution to reduce browser instability
      fileParallelism: false,
      browser: {
        enabled: true,
        provider: 'playwright',
        headless: true,
        instances: [
          { browser: 'chromium' }
        ]
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,vue}', 'src/**/*.stories.ts'],
        exclude: [
          '**/*.spec.ts',
          '**/*.test.ts',
          '**/node_modules/**'
        ]
      }
    }
  })
)
