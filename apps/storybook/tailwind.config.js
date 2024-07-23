import tailwindConfig from '@fiscozen/style/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
    ...tailwindConfig,
    content: [
        "./src/**/*.{html,js,ts,vue}", 
        "./node_modules/@fiscozen/**/src/**/*.{html,js,ts,vue}",
        "./node_modules/@fiscozen/input/src/**/*.{html,js,ts,vue}",
    ],
}