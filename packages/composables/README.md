# @fiscozen/composables

> For usage documentation, see [Storybook Documentation](../../apps/storybook/src/Composables.mdx)

## Development

### Setup

```bash
pnpm install
pnpm --filter @fiscozen/composables build
```

### Code Organization

```
src/
  index.ts                        Re-exports everything (composables, types, utils, FzFloating)
  types.ts                        Shared types (FzFloatingPosition, FzRect, FzUseCurrencyOptions, etc.)
  utils.ts                        Shared utilities (currency format/parse, position helpers)
  FzFloating.vue                  Component wrapper for useFloating
  composables/
    index.ts                      Barrel file for all composables
    useFloating.ts                Floating element positioning
    useMediaQuery.ts              Reactive CSS media query matching
    useBreakpoints.ts             Responsive breakpoint detection (wraps useMediaQuery)
    useClickOutside.ts            Click-outside detection
    useKeyDown.ts                 Keydown event listener
    useKeyUp.ts                   Keyup event listener
    useCurrency.ts                Currency formatting (deprecated)
  __tests__/
    useFloating.spec.ts           useFloating unit tests
    FzFloating.spec.ts            FzFloating component tests
    number.spec.ts                Currency/number utility tests
```

## Composables

### useFloating

Positioning logic for floating/popover elements (tooltips, dropdowns, popovers).

**Architecture:**

- **Lookup tables**: `positionCalculators` (with opener) and `containerPositionCalculators` (without opener) provide O(1) position resolution for all 12 explicit positions (top/bottom/left/right + -start/-end variants).
- **Auto-position resolution**: `resolveAutoPosition` delegates to `getHighestAvailableSpacePos` for `auto`, `auto-vertical`, `auto-start`, `auto-end`, and their combinations.
- **Boundary corrections**: `applyBoundaryCorrections` clamps the final position within the container bounds, resetting transforms when the element would overflow.
- **Layout shift prevention**: The element is set to `position: fixed` immediately before rect calculations.
- **Reactive repositioning**: Uses `IntersectionObserver` to track visibility changes.

The `FzFloating` component (`src/FzFloating.vue`) is the default wrapper that exposes `useFloating` through a declarative template API.

### useMediaQuery

Reactive wrapper around `window.matchMedia`. Returns a computed `Ref<boolean>` that updates when the media query match state changes. Lifecycle-aware: adds listener on mount, removes on unmount.

### useBreakpoints

Higher-level abstraction over `useMediaQuery` for responsive design. Accepts a typed breakpoint map (`Record<T, '${number}px'>`) and returns `isGreater(bp)`, `isSmaller(bp)`, and `isInBetween(min, max)`.

### useClickOutside

Detects clicks outside a target element. Accepts a component ref, a callback, and an optional element to scope the listener to (defaults to `document`). Supports dynamic listener re-attachment via `watch` when the scoped element changes.

### useKeyDown

Attaches a `keydown` listener to a component ref. Lifecycle-managed (mount/unmount). Throws if component or callback is missing.

### useKeyUp

Attaches a `keyup` listener to a component ref or to `document` when no component is provided. Argument order differs from `useKeyDown`: `(callback, component?)` — the component is optional.

### useCurrency

**Deprecated.** Wraps `format` and `parse` from `src/utils.ts`. Consumers should import those functions directly instead.

## Testing

### Running Tests

```bash
pnpm --filter @fiscozen/composables test:unit
pnpm --filter @fiscozen/composables coverage
```

### Test Structure

- `useFloating.spec.ts` / `FzFloating.spec.ts`: Position calculation and component rendering.
- `number.spec.ts`: Currency format/parse utilities.

Tests mock browser APIs (`window.location`, `window.history`, `window.matchMedia`) in `beforeEach`. Coverage target: >90%.

## Dependencies

- `@fiscozen/style` (workspace) — breakpoint tokens used by `useBreakpoints` / `useMediaQuery`

## Build

```bash
pnpm --filter @fiscozen/composables build
```

Runs Vite library build. Output goes to `dist/`.
