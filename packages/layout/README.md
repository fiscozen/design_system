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

### `FzListTemplate`

Backoffice list-page layout — the recurring shape of a list page: an optional
full-width `banner` (alerts, action cards), an optional `filters` rail, an
optional `header` toolbar (title/search/actions) and the list content itself
(typically an `FzTable`). Each region renders only when its slot is provided.

Unlike the templates above, this is a **page-content** template designed to
render inside a shell's main region, so it does **not** force a viewport height
or apply root safe-area insets — the shell owns the scroll container and device
safe-area. It composes the region molecules (`FzLayoutAside` + `FzLayoutMain`)
with document scroll rather than `FzLayout leftShoulder`, which forces `100vh`
mobile tracks and independent per-region scroll.

| Prop              | Type              | Default  | Description                                                                                                     |
| ----------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `filtersPosition` | `'left' \| 'top'` | `'left'` | `left` = a fixed-width rail beside the content from `md` up (stacking above on mobile); `top` = full-width row.  |
| `filtersLabel`    | `string`          | —        | Accessible name (`aria-label`) for the `filters` rail's `complementary` landmark. Set it when the page exposes more than one complementary region (e.g. nested in a shell with its own aside) so screen-reader users can tell them apart. |
| `mainAs`          | `'main' \| 'div'` | `'main'` | Element the content region renders as. Set to `'div'` when nesting inside a shell that already owns `<main>`.    |

Slots: `banner`, `filters`, `header`, default (the list content).

```vue
<template>
  <FzListTemplate filters-position="left">
    <template #banner><OutOfPeriodAlert /></template>
    <template #filters><VatDeclarationFilters /></template>
    <template #header><ListTitleAndSearch /></template>
    <FzTable v-bind="tableProps" />
  </FzListTemplate>
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
`<main>`. `FzFocusTemplate`, `FzListTemplate` and `FzDetailTemplate` have a
non-landmark container `<div>` as their root, so fall-through attributes land on
that container, **not** on the inner `<main>` — label the content directly if a
`main` accessible name is required.

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

### `FzFrameTemplate`

The **backoffice application frame**: a persistent icon `nav` rail, a slim
app-level `header` toolbar, the page, and an optional 400px `aside` holding tools
available everywhere. Page layouts nest *inside* the default slot.

**Its reason for existing is the height contract, not the chrome.** Every other
shell here is `min-h-dvh` + document scroll — an ancestor with an *indefinite*
height, in which a `fills-parent` layout ([`FzThreeColumnsTemplate`](#page-templates))
collapses to zero and never scrolls its regions. This shell inverts the model: the
root is `h-dvh` and **clips**, and `contentHeight` picks which contract the content
region offers.

| `contentHeight` | The region | For |
| --- | --- | --- |
| `scroll` *(default)* | is the app's **single scroll container** — document scroll moves from the window into it | a page that grows and scrolls as one: `FzListTemplate`, `FzDetailTemplate`, any page written against document scroll |
| `bounded` | has a **definite height and clips** | a page that fills the frame and scrolls its own regions: `FzThreeColumnsTemplate` |

Because the switch is per page, a migration is incremental: a page opts into
`bounded` when it is ported, and every other page is untouched.

The frame is a column below `lg` (1024px) and a row at and above it, in CSS. `lg`
rather than the `desktop` (1200px) breakpoint `FzAppTemplate` uses, because the
*injected nav* switches at `lg`: kept in a left column past that point,
[`FzNavbar`](../navbar)'s compact bar shrink-wraps to a stub.

| Prop            | Type                          | Default    | Description                                                        |
| --------------- | ----------------------------- | ---------- | ------------------------------------------------------------------ |
| `contentHeight` | `'scroll' \| 'bounded'`       | `'scroll'` | Height contract handed to the content region (see above).          |
| `chrome`        | `'card' \| 'flat'`            | `'card'`   | `card` = the inset white surface; `flat` = full-bleed.             |
| `background`    | `'page' \| 'transparent'`     | `'page'`   | Page background behind the chrome.                                 |
| `hasAside`      | `boolean`                     | `false`    | Render the tools panel region.                                     |
| `navLabel`      | `string`                      | —          | Accessible name for the `<nav>` landmark.                          |
| `asideLabel`    | `string`                      | —          | Accessible name for the aside's `complementary` landmark.          |

Slots: `nav`, `header`, default (the page), `aside`. The chrome slots receive
`{ isDesktop, asideOpen, toggleAside }`; the panel's open state is
`v-model:asideOpen`.

`chrome` is deliberately **orthogonal** to `contentHeight`, not one "is migrated"
flag: a page ported to `FzListTemplate` still scrolls with the region (`scroll`)
but should let the frame own its container (`card`). A page that draws its own
containers stays `flat`, or two white boxes stack with a strip of page background
between them.

```vue
<template>
  <FzFrameTemplate
    v-model:aside-open="toolsOpen"
    :content-height="route.meta.contentHeight ?? 'scroll'"
    :chrome="route.meta.chrome ?? 'flat'"
    has-aside
    nav-label="Navigazione principale"
    aside-label="Strumenti"
  >
    <template #nav><AppNavigation /></template>
    <template #header="{ asideOpen, toggleAside }">
      <FrameToolbar :aside-open="asideOpen" @toggle-tools="toggleAside()" />
    </template>
    <RouterView />
    <template #aside="{ toggleAside }">
      <ToolsPanel @close="toggleAside(false)" />
    </template>
  </FzFrameTemplate>
</template>
```

The tools panel is a **sibling of the page**, not something each page renders, so
whatever is mounted in it keeps its state across navigation with no global store —
and it is hidden with `v-show` rather than unmounted, so it keeps that state
across close/open too.

#### Page scroll contract (`FZ_PAGE_SCROLL_TARGET`)

Under `contentHeight="scroll"` the **window no longer scrolls**: the content
region does. So `window.scrollTo(0, 0)` becomes a no-op, and browser scroll
restoration on back/forward — which only ever restores the document scroller —
stops reaching the page. The shell `provide()`s the region element so the app can
scroll the page and wire its router's `scrollBehavior` against it. Guard the
`null` case: it means no shell ancestor owning a scroll container.

```ts
import { inject } from 'vue'
import { FZ_PAGE_SCROLL_TARGET } from '@fiscozen/layout'

const pageScroll = inject(FZ_PAGE_SCROLL_TARGET, null)
// pageScroll?.value?.scrollTo({ top: 0 })
```

The element is provided under both contracts but only *scrolls* under `scroll`:
under `bounded` the region clips and the nested layout scrolls its own regions, so
its `scrollTop` stays 0. `scrollIntoView` call sites are unaffected either way —
they walk to the nearest scrollable ancestor.

#### A note on Tailwind Preflight

This shell is deliberately **independent of Tailwind's Preflight**, and anything
added to it must stay that way: it states `border-solid` and `box-border`
explicitly rather than relying on the reset. The backoffice scopes Preflight to a
`.twp` class, and putting that class on an ancestor of the page slot would apply
the reset to hundreds of legacy components at once. The app puts `twp` on its own
slot content instead.

See [`docs/RFC/layout/frame-shell-promotion.md`](../../docs/RFC/layout/frame-shell-promotion.md)
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
