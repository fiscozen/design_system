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

### `FzLayoutBottomBar`

The sticky bottom action-bar region. Placed by a template inside the main
content column, it `position: sticky`s to the viewport bottom while the page
scrolls, reserves its own height in the flow (so an empty bar collapses and no
manual bottom-padding is needed), and pads the bottom device safe-area inset.
The container is `pointer-events: none` so taps pass through the empty gutters;
its direct children are interactive again. It takes no props and exposes its
root element as `el` so a template can use it as the bottom-bar teleport target.

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

**Attribute forwarding.** `FzBlankTemplate`'s single root _is_ its `<main>`
region, so fall-through attributes (`aria-label`, `id`, `data-*`) land on that
`<main>`. `FzFocusTemplate`'s root is a non-landmark container `<div>`, so its
fall-through attributes land on that container, **not** on the inner `<main>` —
label the flow content directly if a `main` accessible name is required.

### `FzAppTemplate`

The persistent-nav application shell (the frontoffice standard layout). Frames a
persistent `nav`, an optional sticky `header`, the primary content, an optional
complementary `aside`, an optional sticky bottom action bar and an optional
`footer`. From the `desktop` breakpoint (1200px) up, the nav is a sticky left
rail and the aside a sticky right panel — their widths follow the **injected**
content, never the template. The **nav is persistent** (a top region on mobile);
the injected nav — e.g. [`FzNavbar`](../navbar) — owns its own responsive
collapse and hamburger, so the template renders no nav drawer. Only the
**aside** collapses below the breakpoint, into a modal drawer (`role="dialog"` +
`aria-modal` + focus trap + Escape-to-close). Owns a full-height root and applies
directional safe-area insets to its sticky chrome.

| Prop           | Type                                | Default      | Description                                                         |
| -------------- | ----------------------------------- | ------------ | ------------------------------------------------------------------- |
| `hasAside`     | `boolean`                           | `false`      | Render the complementary aside (desktop panel / mobile drawer).     |
| `hasBottomBar` | `boolean`                           | `true`       | Render the sticky bottom-bar region and provide its teleport target. |
| `chrome`       | `'card' \| 'flat'`                  | `'card'`     | Content frame. `card` = contained white card; `flat` = full-bleed.  |
| `contentWidth` | `'standard' \| 'wide' \| 'full'`    | `'standard'` | Main content column width (replaces the app's old `wideLayout`).    |
| `asideLabel`   | `string`                            | —            | Accessible name for the aside when it is a modal drawer (mobile).   |

Slots: `nav`, `header`, default (content), `aside`, `bottomBar`, `footer`. The
`nav`, `header` and `aside` slots receive the responsive toggle props
`{ isDesktop, asideOpen, toggleAside }`.

```vue
<template>
  <FzAppTemplate has-aside class="bg-[#f7f6f3]">
    <!-- FzNavbar renders its own rail (desktop) / bar + hamburger (mobile) -->
    <template #nav><AppNavigation /></template>
    <template #header="{ toggleAside }">
      <PageTitleBar @help="toggleAside(true)" />
    </template>
    <RouterView />
    <template #aside><SupportChatPanel /></template>
  </FzAppTemplate>
</template>
```

#### Bottom-bar teleport contract (`FZ_BOTTOM_BAR_TARGET`)

`FzAppTemplate` `provide()`s its bottom-bar region element under
`FZ_BOTTOM_BAR_TARGET`, so a deep page component can render bar content at the
shell level without the app owning a magic DOM id. The template owns the bar's
geometry (it aligns to the content column automatically); the page owns the
content. Guard the `null` case — it means no `FzAppTemplate` ancestor.

```ts
import { inject } from 'vue'
import { FZ_BOTTOM_BAR_TARGET } from '@fiscozen/layout'

const bottomBarTarget = inject(FZ_BOTTOM_BAR_TARGET, null)
// <Teleport v-if="bottomBarTarget" :to="bottomBarTarget" defer> …actions… </Teleport>
```

See [`docs/RFC/layout/bottom-bar-adr.md`](../../docs/RFC/layout/bottom-bar-adr.md)
for the decision record.

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
