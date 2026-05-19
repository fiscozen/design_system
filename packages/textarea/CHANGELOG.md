# @fiscozen/textarea

## 3.1.0

### Minor Changes

- ef6f0b9: Align label baselines with FzInput / FzSelect
  - The `<label>` now renders as `font-normal text-base mb-0`, with
    `text-grey-500` (default) and `text-grey-300` (disabled, readonly).
    Same baseline as `FzInput` and `FzSelect` — consumers no longer need
    a per-component-specific theme for the label.
  - Visual change: label color moves from `text-core-black` (near black)
    to `text-grey-500` (medium grey), and the `mb-0` baseline removes
    any residual margin-bottom added by host CSS resets. Font-size stays
    `text-base` in every context (the previous backoffice convention
    based on the consumer `.fz-textarea-full` SCSS marker rendered the
    label as `text-sm` — that override is now intentionally dropped).

  No API changes.

## 3.0.1

### Patch Changes

- @fiscozen/alert@3.0.1

## 3.0.0

### Major Changes

- New layout textarea with auto-height resizing

## 2.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0

## 1.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0

## 0.1.4

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
