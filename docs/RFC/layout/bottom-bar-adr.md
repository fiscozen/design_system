# ADR — `FzAppTemplate` Bottom-Bar Contract (teleport ownership + geometry)

**Status:** **Accepted** (2026-07-09). Decisions §D1/§D2 confirmed with the author.
**Author:** Riccardo Agnoletto
**Context:** Mini-ADR required by [`page-templates-extraction.md`](./page-templates-extraction.md) §4 as the **gate on Phase 3 (`FzAppTemplate`)**. Execution tracked in [`page-templates-extraction-oplog-2.md`](./page-templates-extraction-oplog-2.md).
**Unblocks:** RFC Phase 3 · Jira **LIB-2692** ([Design System] FO standard layout, 3 colonne) under epic **RT-2054**. The app halves (FO `StandardLayout` adapter) live in the separate `fiscozen-app` repo.
**Scope:** *only* the two bottom-bar facets §4 flagged. Everything else about `FzAppTemplate` (slot set, chrome/background/content-width props, mobile-aside overlay a11y, sticky chrome) is governed by the RFC and is out of scope here.

RFC sections are cited as `§`.

---

## 1. Context — how the bottom bar works today (evidence)

Verified against the `fiscozen-app` FO source (`it_fiscozen_app/frontoffice`):

- **Content projection is a teleport.** ~18 deep page components (`components/invoices/Invoice.vue`, `passive_invoices/PassiveInvoiceEdit.vue`, `pages/settings/*EditPage.vue`, …) render `<BottomBar>`. `layouts/BottomBar.vue:23` does `<Teleport defer :to="TELEPORT_BOTTOM_BAR_TO">` into a target the **shell** owns.
- **The target id is app-owned.** `composables/usePageTitle.ts:31-32` declares `TELEPORT_BOTTOM_BAR_ID = 'fz-layout-bottom-bar'`; `StandardLayout.vue:275-285` renders the target `<div :id>`. The teleport **soft-fails silently** if the id isn't in the DOM (e.g. a `<BottomBar>` mounted under a layout that doesn't provide the target).
- **Space is reserved by a reference-counted hack.** `composables/useBottomBarState.ts` counts live bars; `StandardLayout.vue:94` toggles `pb-[80px]` vs `pb-16` on `main` so content isn't hidden behind the fixed bar. The ref-count exists purely to survive a double-mount during `v-if` transitions.
- **Geometry is `position: fixed` with hand-duplicated rail widths.** The target (`StandardLayout.vue:277-284`) is `fixed bottom-0 left-0 right-0` but overrides `left`/`right` on desktop with `calc(clamp(256px … 280px) + 16px)` / `calc(clamp(320px … 380px) + 16px)` — **the exact `clamp()` formulas** of `.left-side-sidebar` / `.right-side-sidebar` (`StandardLayout.vue:289-294`), i.e. the widths of the *injected* nav and chat rails. The bar card itself is already `max-w-[1024px]` centered (`BottomBar.vue:24-27`), so the insets exist only to align the card's centering box with the main content column (also `max-w-[1024px] mx-auto`, `StandardLayout.vue:112`).
- **The duplication has already drifted into a latent bug.** The target's right inset clamps `320→380px`, but the actual chat rail is a fixed `min-w-[380px] max-w-[380px]` (`StandardLayout.vue:100`). At viewport widths near 1200px the target's right edge (≈336px) sits ~44px *inside* the 380px chat rail, so the bar underlaps the chat. This is precisely the class of failure §4 predicted from a template that must "know" opaque rail widths.

This ADR settles the two facets §4 flagged: **(a) teleport ownership** and **(b) geometry**. The chat side-sheet, ref-count composable, and `<BottomBar>` content stay app-side (§5).

---

## 2. Decisions

### D1 — Teleport ownership: **the region owns the target and `provide()`s it; the app injects and teleports** *(§4 "exposed-ref" form)*

`FzLayoutBottomBar` (the JIT region `FzAppTemplate` composes) owns the target element and exposes it through **provide/inject under a namespaced string key**, per the repo's provide/inject anti-fragility convention (root `CLAUDE.md` "Container component slot identification"; same rationale as `@fiscozen/tab`'s `__fzKind`). It does **not** ship a hardcoded DOM id as public API.

**DS package contract (new, additive):**

```ts
// packages/layout/src/keys.ts  (exported from index.ts)
import type { InjectionKey, Ref } from 'vue'

/**
 * Provided by FzLayoutBottomBar / FzAppTemplate. Descendant components that
 * declare bottom-bar content teleport into this element. `null` until the
 * region has mounted its target (or when no FzAppTemplate is an ancestor).
 */
export const FZ_BOTTOM_BAR_TARGET =
  '@fiscozen/layout/bottomBarTarget' as unknown as InjectionKey<Readonly<Ref<HTMLElement | null>>>
```

```vue
<!-- FzLayoutBottomBar.vue (sketch) -->
<script setup lang="ts">
  import { provide, readonly, ref } from 'vue'
  import { FZ_BOTTOM_BAR_TARGET } from './keys'
  const targetEl = ref<HTMLElement | null>(null)
  provide(FZ_BOTTOM_BAR_TARGET, readonly(targetEl))
</script>
<template>
  <div ref="targetEl" class="fz-layout-bottom-bar"><slot /></div>
</template>
```

**App side (Phase 3, `fiscozen-app`):** `BottomBar.vue` injects the ref instead of importing the id, and guards the null case explicitly — which turns today's silent soft-fail into a debuggable miss ("no `FzAppTemplate` ancestor"):

```ts
const target = inject(FZ_BOTTOM_BAR_TARGET, null)
// <Teleport v-if="target" :to="target" defer> … </Teleport>
```

The app **keeps** `useBottomBarState` (see D2 for its fate), its own `<Teleport>`, and all `<BottomBar>` markup/content. `usePageTitle.ts`'s `TELEPORT_BOTTOM_BAR_ID`/`_TO` constants are deleted in the same PR.

**Why not the alternatives** — see §3.

### D2 — Geometry: **the template places the bar as a `position: sticky` region inside the main column**

`FzAppTemplate` renders `FzLayoutBottomBar` as a `position: sticky; bottom: 0` element **within the main content column's track**, after the main content. The layout engine computes alignment: because the region is a child of the between-the-rails main box, and its inner card reuses the same centered content-width as main, the bar aligns to the content column **with zero rail-width knowledge**. No `clamp()` duplication, no rail-width props, no magic numbers.

Consequences that fall out of this (all improvements over today):

- **The `pb-[80px]` reservation and `useBottomBarState` ref-count become redundant and must be removed** in the Phase 3 app adapter. A sticky-in-flow region reserves its own height; keeping the `pb` guard would double-reserve. `useBottomBarState` is retired (nothing else consumes `hasBottomBar` for spacing). This is a deliberate, allowed change to the app internals — the RFC's "ref-count composable stays app-side *initially*" (§5) is satisfied: it stays app-side and is then dropped by the app, not migrated into the package.
- **The `320→380` latent bug (§1) is dissolved**, not ported — there is nothing left to keep in sync.
- **`hasBottomBar` prop on `FzAppTemplate`** (RFC §4) becomes advisory, not a spacing driver: when no content is slotted/teleported the region collapses to zero height on its own. Keep it optional (e.g. to force a reserved min-height or to omit the region entirely), but it no longer gates a manual `pb`.

**Host contract (§6.2).** `sticky bottom-0` pins to the viewport bottom only while the document (or an ancestor) is the scroll container. `FzAppTemplate` therefore follows the same explicit full-height host contract the other templates already own (`min-h-dvh` root; document scroll), and **must preserve `overflow-x: clip` (not `-hidden`) on the main region** — the current code chose `clip` precisely so sticky descendants keep the document as their scroll container (`StandardLayout.vue:87-89`); `-hidden` would make main a never-scrolling scroll container and break the sticky bar (and `FormPreviewLayout`'s sticky preview). Preserve the `[@media(max-height:480px)]:hidden` rule (hide when the mobile keyboard is open) and the `pointer-events-none` container / `pointer-events-auto` card split so taps pass through the gutters.

**Why not the alternatives** — see §3.

---

## 3. Alternatives considered

### Facet (a) — teleport ownership
| Option | Verdict | Rationale |
|---|---|---|
| **provide/inject target ref** *(chosen, D1)* | ✅ | Idiomatic Vue; matches the repo's namespaced-string provide/inject convention; no public magic string; auto-scoped to "inside an `FzAppTemplate`"; converts silent soft-fail into an explicit inject-miss. |
| `defineExpose`d ref threaded into the app's own `<Teleport>` | ❌ | §4's literal wording, but ergonomically awkward: the app would have to attach a template ref to the `<component :is="layout">`/router-view indirection and thread it down to deep `<BottomBar>` sites — reintroducing prop-drilling that provide/inject removes. |
| DS guarantees a stable documented DOM id forever | ❌ | Lowest effort, but makes the package own a magic string as a permanent public API (against the §10 additive-only contract's spirit and the `CLAUDE.md` "prefer namespaced string keys over module-scope symbols/refs" guidance) and preserves the silent soft-fail. |

### Facet (b) — geometry
| Option | Verdict | Rationale |
|---|---|---|
| **Sticky region in the main column** *(chosen, D2)* | ✅ | Geometry computed by the layout engine — no rail-width leak, no `clamp()` duplication, kills the `pb`/ref-count hack and the `320→380` bug. Consistent with the existing `overflow-x-clip` sticky contract. Cost: higher migration + mandatory WebKit sticky verification (§4). |
| Explicit `navWidth`/`asideWidth` props | ❌ | Preserves today's exact `fixed` visual with least behavioral change, but leaks app concerns into the template API and requires the app to keep props in sync with the real injected rails — the exact fragility that produced the `320→380` mismatch. |
| Full-width bar, app supplies padding | ❌ | Simplest template, but merely relocates the rail-width duplication back into the app; the leak is moved, not dissolved. |

---

## 4. Consequences & follow-ups

**DS repo (Phase 3, buildable here):**
- New `packages/layout/src/keys.ts` exporting `FZ_BOTTOM_BAR_TARGET`; re-export from `index.ts`.
- New `FzLayoutBottomBar` region (JIT; `FzAppTemplate` is its first consumer): owns + `provide()`s the target, renders `<slot />`, carries the sticky/pointer-events/max-height CSS. Unit + Storybook play + a11y.
- `FzAppTemplate` places the region sticky in the main column; `hasBottomBar` optional per D2.
- **Testing (§9):** jsdom cannot catch sticky degradation → add **Playwright/WebKit** coverage for the sticky bar (pin-to-bottom on scroll, alignment to the content column, collapse-when-empty) plus Chromatic diffs. A unit test locks in the injection-key string (mirrors the `__fzKind` lock-in tests).
- **Changeset:** `@fiscozen/layout` minor (additive) — provide/inject key + new region + template are all additive; the §10 additive-only contract holds.

**App repo (Phase 3, `fiscozen-app` — out of this session):**
- `BottomBar.vue`: `inject(FZ_BOTTOM_BAR_TARGET)` + null-guarded `<Teleport>`; drop the `TELEPORT_BOTTOM_BAR_ID` import.
- `StandardLayout.vue` → thin adapter: remove the `fixed` target `<div>` + its `clamp()` insets, the `pb-[80px]` toggle, and the `.left/right-side-sidebar` coupling to the bar.
- Delete `TELEPORT_BOTTOM_BAR_ID`/`_TO` from `usePageTitle.ts`; retire `useBottomBarState.ts`.
- Verify invoice sub-pages (bar appears/aligns), mobile keyboard hide, and **sticky on WebKit/iOS** (§6.2).

**Gate status:** with D1 + D2 accepted, the RFC §4 bottom-bar mini-ADR is **resolved** and Phase 3 (`FzAppTemplate`) is **ungated** on the DS side.
