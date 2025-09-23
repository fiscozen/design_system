import type { Preview, VueRenderer } from '@storybook/vue3'
import isChromatic from "chromatic/isChromatic";
import '../src/assets/main.css';

import '@fiscozen/style/output/global.css';

import { withThemeByClassName } from '@storybook/addon-themes';
import figmaTokens from '@fiscozen/style/tokens.json'

const viewports = Object.entries(figmaTokens.global.breakpoint)
  .reduce((acc, curr) => {
    acc[curr[0]] = {
      name: curr[0],
      styles: {width: curr[1].value, height: '900px'}
    }
    return acc;
  }, {})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    viewport: {
      viewports,
      defaultViewport: 'xl'
    },
    layout: 'fullscreen'
  },
  decorators: [
    withThemeByClassName<VueRenderer>({
      themes: {global: 'global-theme'},
      defaultTheme: 'global'
    })
  ]
}

const fontLoader = async () => ({
  fonts: await Promise.all([document.fonts.load("400 1em Inter")]),
});

export const loaders = isChromatic() && document.fonts ? [fontLoader] : [];

export default preview
