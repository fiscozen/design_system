# @fiscozen/icons

## Notes

- For the current iteration we decided to ship icons in a bundle (svg + js style), no API or lazy loading is currently happening
- In order to keep the bundle size low we are leveraging the "incon kits" Pro Font Awesome feature, therefore tailoring the icon set that we ship. In order to install the design system users therefore need to configure a `.npmrc` in the application root folder, use the one in this repo as a guideline.
To avoid exposing secrets the Font Awesome Pro token should be configured in a environment variable as `FONTAWESOME_PACKAGE_TOKEN`