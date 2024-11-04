import tailwindConfig from '@fiscozen/style/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
    ...tailwindConfig,
    content: [
        "./src/**/*.{html,js,ts,vue}", 
        "./node_modules/@fiscozen/**/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/badge/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/input/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/typeahead/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/datepicker/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/divider/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/select/src/**/*.{html,js,ts,vue}"
    ],
}