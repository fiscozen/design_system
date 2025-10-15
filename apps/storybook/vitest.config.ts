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
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true
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
