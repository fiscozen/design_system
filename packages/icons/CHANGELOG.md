# @fiscozen/icons

## 1.0.4

### Patch Changes

- e21feb2: update fontawesome kit@1.0.414

## 1.0.3

### Patch Changes

- 3428436: fix(FzIcon): prevent icon shrinking in flex containers on Firefox and Safari

  Add `shrink-0` to the icon container to prevent flex shrink from reducing icon dimensions below their intended size. This fixes a visual regression where icons in FzSelect (and potentially other flex-based layouts) would shrink from 20x20 to 18.5x20 in Firefox and Safari when the dropdown opens.

## 1.0.2

### Patch Changes

- 0bff17c: Update fontawesome icon package to version 1.0.412

## 1.0.1

### Patch Changes

- 5000905: Updated fiscozen fontawesome kit version

## 1.0.0

### Major Changes

- Add FzIconBackground component

## 0.2.0

### Minor Changes

- a26bc2c: Add support to v-color directive
- 2d4fc5e: Add FzIconBackground component
