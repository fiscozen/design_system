import tailwindConfig from '@fiscozen/style/tailwind.config'

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: [
    './src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/**/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/badge/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/input/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/typeahead/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/datepicker/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/divider/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/composables/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/tooltip/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/select/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/table/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/pdf-viewer/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/layout/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/radio/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/container/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/action/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/tab/src/**/*.{html,js,ts,vue}',
    './node_modules/@fiscozen/chat-container/src/**/*.{html,js,ts,vue}'
  ]
}
