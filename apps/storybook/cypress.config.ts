import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    // Supporto per multiple environments
    env: {
      STORYBOOK_URL: 'http://localhost:6006'
    },
    // Configurazione ottimizzata per component testing
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    // Timeout ottimizzati per Storybook
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  },
  
  // Configurazione component testing per Vue (futuro uso)
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    // TypeScript support
    supportFile: 'cypress/support/component.ts'
  }
})
