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
    useQueryString/
      index.ts                    Main composable entry point and re-exports
      types.ts                    Type definitions (HandledQueryStringKey, ValuesInQueryStrings, etc.)
      utils.ts                    Low-level URL/History API helpers
      transform.ts                Value extraction and type coercion logic
      provider.ts                 Provide/inject helpers for Vue Router route sharing
  __tests__/
    useFloating.spec.ts           useFloating unit tests
    FzFloating.spec.ts            FzFloating component tests
    useQueryString.spec.ts        useQueryString unit tests
    number.spec.ts                Currency/number utility tests
```

## Composables

### useQueryString

Type-safe URL query parameter management with History API synchronization.

**Architecture:** Split into four modules following the Single Responsibility Principle:

- **`index.ts`**: Orchestrates the composable. Exposes `getValuesFromQueryString`, `setValuesInQueryString`, and `initialValuesInQueryString`. Resolves the `route` parameter via auto-inject, explicit instance, or `null` (router-agnostic).
- **`types.ts`**: All public types. `HandledQueryStringKey` is the core config object (key, defaultValue, transform, nullStringIsNullValue).
- **`utils.ts`**: Pure/side-effect-isolated URL and History API helpers (`getQueryFromUrl`, `setQueryToUrl`, `buildUrlWithQuery`, `removeEmptyValues`, `buildHistoryState`). No Vue or Router dependency — independently testable.
- **`transform.ts`**: Value coercion pipeline. `transformQueryStringValue` handles priority: custom function > nullString > undefined check > type coercion (`'none'`, `'string'`, `'number'`, `'boolean'`). `extractValues` applies transforms across all handled keys. `hasAnyHandledKey` checks key presence.
- **`provider.ts`**: `provideQueryStringRoute` / `injectQueryStringRoute` using a typed `InjectionKey<RouteLocationNormalizedLoaded>`. Eliminates prop drilling: call `provideQueryStringRoute(useRoute())` once at app level, then `useQueryString` auto-injects.

**Design decisions:**

- **Route parameter tri-state**: `undefined` (auto-inject from provider), `RouteLocationNormalizedLoaded` (explicit), `null` (force router-agnostic). This avoids a boolean flag and lets the consumer control the strategy naturally.
- **Frozen initial values**: `initialValuesInQueryString` is `Object.freeze()`-d at init time so consumers always see the state at mount, regardless of subsequent URL changes.

#### Why `window.location.search` is the single source of truth

Vue Router re-mounts components when query parameters change via `router.push()` or `router.replace()`. This is unacceptable for a composable that updates query params frequently (e.g. on every page change in a paginated table) without destroying and recreating the component tree.

To avoid re-mounting, this composable writes directly to the browser's History API (`replaceState`/`pushState`), which modifies the URL without triggering Vue Router's navigation lifecycle. The trade-off is that Vue Router does not know the URL changed, which has two consequences:

1. **`route.query` becomes stale.** It stays frozen at whatever it was when the router last resolved the route. If `setValuesInQueryString` used `route.query` as the merge base for subsequent writes, the stale snapshot would silently revert values written in previous calls. For this reason, `setValuesInQueryString` always reads the live URL via `getQueryFromUrl()`. The old `route.query` code path is preserved behind the `_useRouteQueryAsMergeBase` flag (currently `false`) and can be re-enabled if Vue Router adds non-re-mounting query updates.

2. **Query params written via History API are invisible to Vue Router.** On read, the composable checks the URL first. If the handled keys are not present (e.g. after a Vue Router navigation that strips them), it falls back to values persisted in `window.history.state` under the `__queryString` key, and restores them into the URL.

The `route` parameter and the `provideQueryStringRoute`/`injectQueryStringRoute` provider pattern are retained in the public API for backward compatibility and future-proofing.

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

- `useQueryString.spec.ts`: Tests all three route modes (auto-inject, explicit, null), value extraction, transformation, history state fallback, and URL writing.
- `useFloating.spec.ts` / `FzFloating.spec.ts`: Position calculation and component rendering.
- `number.spec.ts`: Currency format/parse utilities.

Tests mock browser APIs (`window.location`, `window.history`, `window.matchMedia`) in `beforeEach`. Coverage target: >90%.

## Dependencies

- `@fiscozen/style` (workspace) — breakpoint tokens used by `useBreakpoints` / `useMediaQuery`
- `vue-router` (optional peer) — needed only when `provideQueryStringRoute()` is used. Without it, `useQueryString` works in pure History API mode.

## Build

```bash
pnpm --filter @fiscozen/composables build
```

Runs Vite library build. Output goes to `dist/`.
