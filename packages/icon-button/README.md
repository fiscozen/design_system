# @fiscozen/icon-button

## Notes
- I choose the "Variant" attribute name instead of "Type" because the latter has a different HTML meaning and I did not want it to be mixed up.
- The IconButton component depends on @fiscozen/Icon, therefore the IconButton exposes the same (prefixed) props. Importing actual icons will not be necessary when using the `string` icon name. Using the `Array<string>` iconName prop requires to import icons, please refer to its README. 