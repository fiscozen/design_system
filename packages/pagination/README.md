# @fiscozen/pagination

> For usage documentation, see [Storybook Documentation](../../apps/storybook/src/FzPagination.mdx)

## Development

### Setup

```bash
pnpm install
pnpm --filter @fiscozen/pagination build
```

### Architecture

The package is split into two layers:

- **`usePagination` composable** (`src/usePagination.ts`): Pure logic that builds a reactive list of `PaginationItem` objects from `currentPage`, `totalPages`, and `PaginationOptions`. Accepts `MaybeRefOrGetter` inputs so it works with refs, computed values, and getter functions.
- **`FzPagination` component** (`src/FzPagination.vue`): Thin UI wrapper that maps items to `FzButton` / `FzIconButton` / `FzIcon` components and emits `update:currentPage` on click.

### Code Organization

```
src/
  index.ts              Main exports (component, composable, utility, types)
  types.ts              All public types (FzPaginationProps, PaginationOptions, PaginationItem, etc.)
  usePagination.ts      Composable: token generation, clamping, ellipsis filtering
  utils.ts              Standalone helpers (getInitialPageFromUrl)
  FzPagination.vue      Component: renders items, handles v-model
  __tests__/
    FzPagination.spec.ts  Component unit tests
    usePagination.spec.ts Composable unit tests
    utils.spec.ts         Utility function unit tests
```

### Key Concepts

#### Token Pipeline

`usePagination` builds page items through a pipeline:

1. **Clamp** current page into `[1, totalPages]`
2. **Slot config** determines how many center pages, anchors, and ellipsis slots are available based on `PaginationOptions`
3. **Token generation** creates a compact list of page numbers and `'ellipsis'` markers that fits the slot budget
4. **Ellipsis filtering** drops or keeps ellipsis based on the configured visibility (`none`, `both`, `before`, `after`)
5. **Normalization** removes redundant ellipsis (adjacent duplicates, gaps of 1)
6. **Item mapping** converts tokens into `PaginationItem` objects with `type`, `value`, `label`, `current`, `disabled`

#### Position / Alignment

The `position` prop maps to a `justifyClass` computed that applies Tailwind `justify-start`, `justify-center`, or `justify-end` to `FzContainer`. Default is `'end'`.

#### Responsive Behaviour

The component uses `useMediaQuery` from `@fiscozen/composables` to detect desktop vs mobile. On mobile, prev/next buttons render as icon-only (`FzIconButton`) wrapped in `<span>` elements with flex layout classes.

#### buttonClasses Helper

`buttonClasses(item)` centralizes all conditional CSS classes for each pagination item:
- `!min-w-44` on every item
- `flex-1` + `justify-start`/`justify-end` for prev/next on mobile
- `fz-pagination-disable-truncate` on the current page button

#### Truncate Override (Scoped CSS)

`FzButton` applies a `.truncate` class internally. The scoped CSS rule `:deep(.fz-pagination-disable-truncate > .truncate)` overrides `overflow`, `text-overflow`, and `white-space` on the active page button so long labels remain visible.

### Testing

#### Running Tests

```bash
pnpm --filter @fiscozen/pagination test:unit
pnpm --filter @fiscozen/pagination coverage
```

#### Test Structure

Tests mock `window.matchMedia` (required by `useMediaQuery`) in `beforeEach`. They query the DOM directly with `wrapper.findAll('button')` rather than component name lookups for resilience against component renaming.

Coverage target: >90% line coverage.

### Adding Features

1. **Update types** in `src/types.ts` (add props or options fields with JSDoc)
2. **Update composable** in `src/usePagination.ts` if the feature affects item generation logic
3. **Update component** in `src/FzPagination.vue` for template/rendering changes
4. **Add tests** in `src/__tests__/FzPagination.spec.ts`
5. **Update stories** in `apps/storybook/src/stories/navigation/Pagination.stories.ts`
6. **Update MDX** in `apps/storybook/src/FzPagination.mdx`

### getInitialPageFromUrl

Synchronous utility that reads a page number from `window.location.search`. Designed to be called in `setup()` so the parent can initialise its `currentPage` ref with the value already in the URL — avoiding a redundant API request that would otherwise occur when `FzPagination` emits a corrected `update:currentPage` on mount.

Works on every component mount, not just the initial app load: by the time `setup()` runs, `window.location.search` already reflects the current route.

Signature: `getInitialPageFromUrl(defaultValue = 1, urlKey = 'page'): number`.

### URL Sync

URL sync is **enabled by default** (`syncUrl: true`, `urlKey: 'page'`). The component reads the initial page from the URL and writes page changes back via `useQueryString`.

**How it works internally:**

1. If `syncUrl` is `false`, no sync logic runs — the component behaves as a pure controlled component
2. `useQueryString` is called with a single key config `{ key: urlKey, transform: 'number', defaultValue: currentPage }` (no explicit `route` argument — auto-inject resolves it)
3. `useQueryString` internally calls `injectQueryStringRoute()` to obtain the Vue Router route provided at app level, or falls back to router-agnostic mode (pure History API) if no provider exists
4. If the URL contains a value for the key that differs from `currentPage`, the component emits `update:currentPage` to notify the parent
5. On every page click, `setValuesInQueryString` updates the URL alongside the `update:currentPage` emit

The component remains fully controlled: the parent always owns state via `v-model:currentPage`. The URL sync is a transparent side-channel.

**Multiple paginations on the same page:** assign distinct `urlKey` values (e.g. `urlKey="page"` and `urlKey="commentsPage"`).

### Dependencies

- `@fiscozen/button` - `FzButton` and `FzIconButton` for page controls
- `@fiscozen/container` - `FzContainer` for layout
- `@fiscozen/icons` - `FzIcon` for ellipsis indicator
- `@fiscozen/composables` - `useMediaQuery` for responsive layout, `useQueryString` for URL sync (route injection handled internally by the composable)
- `@fiscozen/style` - `breakpoints` for media query thresholds
- `vue-router` (optional peer) - needed only when `provideQueryStringRoute()` is used at app level

### Hidden Props

The following props exist in `FzPaginationProps` but are intentionally **not documented in the public MDX** and **not exposed in Storybook argTypes/stories**:

- **`options`** (`PaginationOptions`): Fine-grained control over ellipsis, anchors, prev/next labels and visibility. Exposed only through `usePagination` for custom UIs.
- **`position`** (`'start' | 'center' | 'end'`): Controls horizontal alignment of the pagination bar via `justify-*` classes. Default is `'end'`.

These props are available for internal use and advanced consumers who import types directly, but are kept out of the public API surface to avoid exposing configuration complexity that most users do not need.

### Build

```bash
pnpm --filter @fiscozen/pagination build
```

Runs `vue-tsc` for type checking followed by Vite library build. Output goes to `dist/`.
