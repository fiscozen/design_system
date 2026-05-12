# @fiscozen/breadcrumbs

Breadcrumb navigation components for Vue 3 applications.

> For usage documentation and interactive examples, see the [Storybook stories](../../apps/storybook/src/stories/navigation/).

## Development

### Setup

```bash
pnpm install
pnpm --filter @fiscozen/breadcrumbs build
```

### Architecture

The package exports two components with distinct responsibilities:

- **`FzBreadcrumbs`** — Presentational, framework-agnostic, generic (`<script setup generic="T">`). Receives `Breadcrumb<T>[]` and renders it. Has no knowledge of Vue Router. All navigation behavior is delegated to the consumer via the `bread-label` slot.
- **`FzRouterBreadcrumbs`** — Vue Router layer. Calls `useRoute()`, builds `Breadcrumb<CustomRouteLocation>[]` either from `route.matched` (automatic) or from the `breadcrumbs` prop (manual), and passes it to `FzBreadcrumbs` via the `bread-label` slot.

```
FzRouterBreadcrumbs
  └── FzBreadcrumbs  ← actual rendering
```

Keeping the two components separate allows `FzBreadcrumbs` to be used in apps without Vue Router, with custom link components, or in any context where the navigation behavior needs to differ.

### Code Organization

```
src/
  index.ts                    Public exports (components + types)
  types.ts                    FzBreadcrumbsBaseProps, FzBreadcrumbsProps, FzRouterBreadcrumbsProps,
                              Breadcrumb, CustomRouteLocation, BreadcrumbEnvironment, DisplayItem
  FzBreadcrumbs.vue           Presentational component
  FzRouterBreadcrumbs.vue     Router-aware wrapper
  __tests__/
    FzBreadcrumbs.spec.ts     Unit tests for both components
    __snapshots__/            Auto-generated snapshot files
```

### Key Concepts

#### Shared base props

`separator` and `ariaLabel` live in `FzBreadcrumbsBaseProps` (not exported) and are inherited by both prop interfaces via `extends`. When adding a prop shared by both components, add it there.

#### Active item detection

The active item is always the **last in the array**, determined by `index === breadcrumbs.length - 1` in `FzBreadcrumbs`. This is positional — it has no relationship to the current route. `FzRouterBreadcrumbs` uses this same mechanism: `isActive` from the scoped slot is `true` only for the last item, regardless of which route is active.

#### Last item: `<span>` not a link

In `FzRouterBreadcrumbs`, the last breadcrumb renders as `<span aria-current="page">` rather than a `<RouterLink>`. This follows WAI-ARIA Authoring Practices 3.17 (Breadcrumb), which explicitly requires the current page item not to be a link. The preceding items render as `<RouterLink>`.

#### `bread-separator` slot and `aria-hidden`

The `bread-separator` slot in `FzBreadcrumbs` is always wrapped in `<span aria-hidden="true">`. This wrapper is rendered by the component itself, not the consumer — so any content passed via the slot is guaranteed to be hidden from assistive technology without the consumer needing to add `aria-hidden` manually.

#### Automatic breadcrumb generation

When `FzRouterBreadcrumbs` receives no `breadcrumbs` prop (or an empty array), it reads `route.matched` and maps each `RouteRecord` to:

```ts
{
  id:       match.name?.toString() || match.path,
  label:    match.name?.toString() || match.path,
  metadata: match  // full RouteRecord, passed directly to :to on RouterLink
}
```

Labels are route **names**, not human-readable strings. If the app uses path-only routes or needs custom labels, the `breadcrumbs` prop must be passed manually.

#### `environment` prop and rendering rules

The `environment` prop (`'frontoffice' | 'backoffice'`, default `'frontoffice'`) controls two behaviours, both handled entirely inside `FzBreadcrumbs` — the consumer always passes the full array:

- **≤ 1 item**: the component renders nothing (`v-if` on the `<nav>` root). The consumer does not need to guard against this.
- **`frontoffice` + more than 3 items**: `displayedItems` collapses the list to four entries — first item, an ellipsis (`...` styled `text-blue-500`), the penultimate item, and the last (active) item. Intermediate items are dropped.
- **`backoffice`**: all items are always shown regardless of count.

#### `DisplayItem<T>` — the computed display structure

`displayedItems` is a `ComputedRef<DisplayItem<T>[]>` where `DisplayItem<T>` is defined in `types.ts`:

```ts
type DisplayItem<T> =
  | { kind: 'breadcrumb'; item: Breadcrumb<T>; isActive: boolean }
  | { kind: 'ellipsis' }
```

The template iterates `displayedItems` (not `breadcrumbs` directly), keying on `item.id` for breadcrumbs and `'__ellipsis__'` for the ellipsis entry.

#### `FzRouterBreadcrumbs` does not re-expose `bread-label`

`FzRouterBreadcrumbs` uses the `bread-label` slot internally and does not forward it to consumers. Consumers who need custom label rendering must use `FzBreadcrumbs` directly. The `bread-separator` slot is technically forwarded but `FzRouterBreadcrumbs` does not use it internally — a consumer wrapping `FzRouterBreadcrumbs` cannot inject a custom separator through it.

### Accessibility

Implements WAI-ARIA Authoring Practices 3.17 (Breadcrumb):

| Requirement | Implementation |
|---|---|
| `<nav>` landmark | Root element of `FzBreadcrumbs`, bound to `:aria-label="ariaLabel"` |
| `aria-label` on `<nav>` | Default `'Breadcrumb'`, overridable via `ariaLabel` prop (needed when multiple nav landmarks coexist on a page — WCAG 2.4.1) |
| Ordered list `<ol>/<li>` | Template structure of `FzBreadcrumbs` |
| `aria-current="page"` on current item | Default `bread-label` slot fallback (div) and `FzRouterBreadcrumbs` active span |
| Decorative separators hidden from AT | `<span aria-hidden="true">` wrapper always rendered around `bread-separator` slot |
| Current item not a link | `FzRouterBreadcrumbs` renders active item as `<span>`, not `<RouterLink>` |

### Testing

```bash
pnpm --filter @fiscozen/breadcrumbs test
pnpm --filter @fiscozen/breadcrumbs test:coverage
```

Tests cover both components in a single spec file (`FzBreadcrumbs.spec.ts`) with `describe` blocks for: Rendering, Props (including `environment`), Events, CSS Classes, Accessibility (ARIA), Edge Cases, Snapshots.

`FzRouterBreadcrumbs` tests mount with a real `createRouter` instance (not mocked) using `createWebHistory` and `flushPromises` for async route resolution. Tests that exercise the `environment` collapse behaviour use `global.stubs: { RouterLink: true }` to avoid route resolution errors from arbitrary metadata paths.

Snapshot tests render the full HTML. After any structural template change, delete the snapshot file and re-run to regenerate:

```bash
rm src/__tests__/__snapshots__/FzBreadcrumbs.spec.ts.snap
pnpm --filter @fiscozen/breadcrumbs test
```

### Adding Features

1. **Update types** in `src/types.ts` — shared props go in `FzBreadcrumbsBaseProps`, component-specific props in their own interface
2. **Update components** — `FzBreadcrumbs.vue` for rendering changes, `FzRouterBreadcrumbs.vue` for router layer changes
3. **Add tests** in `src/__tests__/FzBreadcrumbs.spec.ts`
4. **Update Storybook stories** in `apps/storybook/src/stories/navigation/` (`Breadcrumbs.stories.ts` for `FzBreadcrumbs`, `RouterBreadcrumbs.stories.ts` for `FzRouterBreadcrumbs`)

### Dependencies

- `vue-router` — peer dependency, required only by `FzRouterBreadcrumbs`; `FzBreadcrumbs` has no router dependency

### Build

```bash
pnpm --filter @fiscozen/breadcrumbs build
```

Runs `vue-tsc` for type checking followed by Vite library build. Output goes to `dist/`.
