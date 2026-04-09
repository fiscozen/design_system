# @fiscozen/collapse

## 3.0.0

### Major Changes

- 267ce05: Redesign FzCollapse and add FzAccordion component.

  Breaking changes:
  - `summary` prop renamed to `title`
  - `summaryClass` prop renamed to `headerClass`
  - `content` prop removed (use `#content` slot instead)
  - Summary slot renamed to `#header`
  - Icon slot renamed to `#chevron`
  - Open-state blue highlight styling removed
  - Chevron icons changed from `chevron-down`/`chevron-up` to `angle-down`/`angle-up`

  New features:
  - `variant` prop (`'button' | 'section'`, default `'section'`) with different sizing/typography
  - `subtitle` prop (section variant, visible when closed)
  - `icon` prop (optional leading icon with content indentation)
  - `#rightContent` slot (button variant only)
  - New `FzAccordion` wrapper component with `multiple` prop for exclusive/multi-panel mode

## 2.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0

## 1.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
