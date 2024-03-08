import type { Preview, VueRenderer } from '@storybook/vue3'
import '../src/assets/main.css';
import { withThemeByClassName } from '@storybook/addon-themes';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withThemeByClassName<VueRenderer>({
      themes: {global: 'global-theme'},
      defaultTheme: 'global'
    })
  ]
}

export default preview
