import tailwindConfig from '@fiscozen/style/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
    ...tailwindConfig,
    content: [
        "./node_modules/@fiscozen/**/*.{html,js,ts,vue}",
        "./src/**/*.{html,js,ts,vue}",
        "./src/**/*.cy.ts"
    ],
}