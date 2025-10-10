import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from '@storybook/vue3-vite'

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("storybook-addon-vue-mdx"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs")
  ],

  framework: {
    name: getAbsolutePath("@storybook/vue3-vite"),
    options: {}
  }
}
export default config

function getAbsolutePath(value: string): any {
  if (value.includes('..') || value.startsWith('/')) {
    throw new Error('Invalid package path');
  }
  
  return dirname(require.resolve(join(value, "package.json")));
}
