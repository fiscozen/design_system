import tailwindConfig from '@fiscozen/style/tailwind.config'

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: ['./src/**/*.{html,js,ts,vue}', '../../packages/*/src/**/*.{html,js,ts,vue}']
}
