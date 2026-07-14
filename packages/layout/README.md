# @fiscozen/layout

Layout building blocks for Vue 3 applications, organised by atomic-design layer.

## `FzLayout` — grid primitive (organism)

A grid-based layout component providing multiple layout variants (e.g.
`oneColumn`, `twoColumns`, `multipleAreas`, `threeColumns`) to cover common
page structures. Padding is on by default; opt out per instance with
`disablePadding` for full-bleed regions.

## Regions (molecules)

Presentation-only wrappers for the regions of a page, composed by the page
templates. Regions are built **just-in-time** with their first template
consumer rather than as a speculative library.

### `FzLayoutMain`

The "main" content region. Renders a semantic `<main>` landmark and centralises
region-level concerns.

| Prop       | Type                             | Default     | Description                                                                                |
| ---------- | -------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `as`       | `'main' \| 'div'`                | `'main'`    | Element the region renders as. Override to `'div'` when it is not the page's `main`.       |
| `align`    | `'stretch' \| 'top' \| 'center'` | `'stretch'` | Content alignment within the region's block.                                               |
| `safeArea` | `boolean`                        | `false`     | Pad by the device safe-area insets (`env(safe-area-inset-*)`) for notches/home indicators. |

### `FzLayoutHeader` · `FzLayoutAside` · `FzLayoutFooter`

Thin semantic wrappers for the top-bar (`<header>` banner), complementary
(`<aside>`) and footer (`<footer>` contentinfo) regions. They render the
landmark element and a stable class hook; layout-specific sizing/padding is
applied by the composing template. Each accepts a single `as` prop — typed to
its landmark element or `'div'` — to override the element when the page must not
expose that landmark twice.

## Page templates

Full-page, presentation-only shells selected at the `<router-view>` level. They
render frames + regions and expose named slots; the app fills those slots with
its own organisms (nav, chat, title, actions) and owns all logic.

### `FzBlankTemplate`

Full-bleed template with no chrome — a single full-height content region and
nothing else. For auth/login screens and standalone tools that render their own
self-contained UI. It owns a full-height root (`min-h-dvh`), so it does **not**
depend on app-global `#app { height: 100% }` / `overflow-y: auto` CSS being
present.

| Prop    | Type                | Default    | Description                                     |
| ------- | ------------------- | ---------- | ----------------------------------------------- |
| `align` | `'center' \| 'top'` | `'center'` | Where content sits within the full-height page. |

```vue
<template>
  <FzBlankTemplate align="center">
    <LoginCard />
  </FzBlankTemplate>
</template>
```

### `FzFocusTemplate`

Distraction-reduced flow template for guided flows (onboarding) and auth
screens. A centered main region, optionally framed by a `topbar`, `aside` and
`footer` (each renders only when its slot is provided; the `aside` stacks below
the content on narrow viewports and sits beside it from `lg` up). Owns a
full-height root and applies safe-area insets.

| Prop     | Type               | Default  | Description                                                                   |
| -------- | ------------------ | -------- | ----------------------------------------------------------------------------- |
| `chrome` | `'card' \| 'flat'` | `'card'` | Content frame. `card` = contained max-width card; `flat` = full-bleed (auth). |

Slots: `topbar`, default (centered content), `aside`, `footer`.

```vue
<template>
  <FzFocusTemplate chrome="card">
    <template #topbar><OnboardingTopBar /></template>
    <OnboardingStep />
    <template #aside><SupportChatPanel /></template>
  </FzFocusTemplate>
</template>
```

### `FzDetailTemplate`

Backoffice detail-page layout — the sibling of `FzListTemplate` (LIB-2694). Where
a list page pairs a _filter_ rail with a table, a detail page pairs a persistent
`sidebar` summary/context rail (the record's identity, status, meta and actions)
with the record's content (typically `FzTabs`/`FzCard`s). It also exposes an
optional full-width `banner` (page-level alerts) and an optional `toolbar` (title/actions).
Each region renders only when its slot is provided; the summary rail stacks above
the body on narrow viewports and sits beside it from `md` up.

Like `FzListTemplate`, this is a **page-content** template designed to render
inside a shell's main region, so it does **not** force a viewport height or apply
root safe-area insets — the shell owns the scroll container and device safe-area.
It composes the region molecules (`FzLayoutAside` + `FzLayoutMain`) with document
scroll rather than `FzLayout leftShoulder`, which forces `100vh` mobile tracks and
independent per-region scroll.

| Prop           | Type              | Default  | Description                                                                                                                                                                                                                 |
| -------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sidebarLabel` | `string`          | —        | Accessible name (`aria-label`) for the `sidebar`'s `complementary` landmark. Set it when the page exposes more than one complementary region (e.g. nested in a shell with its own aside) so screen readers tell them apart. |
| `mainAs`       | `'main' \| 'div'` | `'main'` | Element the content region renders as. Set to `'div'` when nesting inside a shell that already owns `<main>`.                                                                                                               |

Slots: `banner`, `sidebar`, `toolbar`, default (the detail body). The `toolbar`
region is a plain container, **not** a `<header>`/banner landmark — the shell
owns the page banner.

```vue
<template>
  <FzDetailTemplate sidebar-label="Riepilogo dichiarazione">
    <template #banner><NotYetSentAlert /></template>
    <template #sidebar><VatDeclarationSummary /></template>
    <template #toolbar><DetailTitleAndActions /></template>
    <FzTabs>
      <FzTab title="Dichiarazione">…</FzTab>
      <FzTab title="F24">…</FzTab>
    </FzTabs>
  </FzDetailTemplate>
</template>
```

**Attribute forwarding.** `FzBlankTemplate`'s single root _is_ its `<main>`
region, so fall-through attributes (`aria-label`, `id`, `data-*`) land on that
`<main>`. `FzFocusTemplate` and `FzDetailTemplate` have a non-landmark container
`<div>` as their root, so fall-through attributes land on that container, **not**
on the inner `<main>` — label the content directly if a `main` accessible name is
required.

## Stability & contribution policy

This package intentionally ships the grid primitive, the region molecules, and
the page templates together, and the frontoffice and backoffice apps depend on
it and bump it **independently**. That makes the public surface a shared,
cross-repo contract (RFC §10):

- **Changes to published components must be additive.** New optional props (with
  defaults), new slots, and new components are fine; renaming/removing props,
  slots or exports, making an optional prop required, or narrowing a prop's
  accepted values are **breaking** and are not allowed without a coordinated
  frontoffice + backoffice migration.
- **Deprecate before removing.** Mark the old API `@deprecated` in a minor
  release, keep it working, and remove it only in a subsequent major.
- Every change ships a Changeset at the correct bump level; run
  `pnpm release:check:pending` to preview the cascade before publishing.

See [`docs/RFC/layout/page-templates-extraction.md`](../../docs/RFC/layout/page-templates-extraction.md)
§10 for the rationale — this is a hard project constraint, not a preference.
