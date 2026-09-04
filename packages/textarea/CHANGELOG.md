# @fiscozen/textarea

## 3.3.0

### Minor Changes

- ee1c6e9: feat(textarea): let the `bare` variant delegate its focus indicator to the container

  `variant="bare"` draws a `focus-visible` outline on the field, standing in for the
  border-colour cue it turns off. That outline is offset from the _field_, so inside a
  container with padding of its own it lands within the visible box and reads as a field
  inside a field.

  `focusAffordance` moves the indicator instead of removing it:
  - `'field'` (default) keeps today's behaviour exactly — existing callers are unaffected,
    and a caller who never hears of the prop cannot lose its focus indicator.
  - `'container'` draws no indicator on the field and suppresses the browser's native ring
    as well, on the condition that the caller draws one on its own box (`focus-within:`).

  The prop transfers a WCAG 2.4.7 (Focus Visible) obligation, it does not cancel it — the
  component cannot verify the caller honoured it, which is why the default does not change.
  It applies to `variant="bare"` only; setting it on the default variant, which recolours its
  own border, warns and does nothing.

  This replaces the `!focus-visible:outline-none` override that was previously the only way to
  get that shape from a call site.

### Patch Changes

- Updated dependencies [92c1d3a]
  - @fiscozen/alert@3.0.6

## 3.2.0

### Minor Changes

- f18251b: feat(textarea): add a `bare` variant for single-line composer bars (LIB-2927)

  `variant="bare"` turns off every box-drawing declaration the component owns — border, background,
  padding, radius, minimum height and minimum width — and declares no font size, so the container
  around the field becomes the visible field and owns the type: a `text-sm` on the box carries the
  field and anything else inside it on one scale. Everything else is unchanged: label, help text,
  error ARIA, `autoHeight` and `maxRows`, which now also hold with zero padding.

  `maxRows` also gained a fallback for a line height that computes to `normal` (possible now that the
  bare field inherits its type): the ceiling uses the browser's ~1.2 ratio instead of going unbounded.
  The default variant, with its fixed `text-base`, was never exposed to that.

  Two defaults shift with the variant so a composer bar starts in the right shape: `rows` is `1` and
  `resize` is `'none'`. The focus cue is replaced rather than removed — with no border to recolour, the
  bare field draws a 2px `blue-600` `focus-visible` outline on itself.

  The default variant is untouched, visually and behaviourally.

## 3.1.4

### Patch Changes

- @fiscozen/alert@3.0.5

## 3.1.3

### Patch Changes

- @fiscozen/alert@3.0.4

## 3.1.2

### Patch Changes

- Updated dependencies [2893adb]
  - @fiscozen/alert@3.0.3

## 3.1.1

### Patch Changes

- @fiscozen/alert@3.0.2

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
