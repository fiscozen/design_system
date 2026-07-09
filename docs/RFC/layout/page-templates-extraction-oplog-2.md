# Operational Log 2 — `@fiscozen/layout` Page Templates Extraction (Phase 3+)

Continuation of [`page-templates-extraction-oplog.md`](./page-templates-extraction-oplog.md) (oplog-1), which covers the **DS side of Phases 0–2 ✅ complete**. Companion execution log for the RFC [`page-templates-extraction.md`](./page-templates-extraction.md). RFC sections are cited as `§`.

This second log opens the **Phase 3 (`FzAppTemplate`) stream**, which the RFC gates on the bottom-bar mini-ADR (§4). It exists as a separate file so that ADR and its execution are tracked apart from the already-shipped Phase 0–2 work.

**Legend:** ✅ done · 🔜 next · ⛔ blocked/out-of-repo · 🧭 decision required (ADR)

---

## Where things stand (carried forward from oplog-1)

- **DS repo work only** here (`/Users/fiscozen/Projects/design_system`). The app layouts the RFC references (`StandardLayout`, `FocusLayout`, `AppContent`/`Page`, `BottomBar`, `usePageTitle`, `FzNavigation`) live in the **separate `fiscozen-app` repo** (multiple worktrees), **not** a working dir of this session.
- **DS-side of Phases 0–2 ✅** (oplog-1), published-ready:
  - Phase 0 — breakpoint unblock (`useBreakpoints().current()`, `FzLayout` refactor + `disablePadding`, `desktop` token, ESLint mutation guard).
  - Phase 1 — `FzLayoutMain` + `FzBlankTemplate`.
  - Phase 2 — `FzLayoutHeader`/`FzLayoutAside`/`FzLayoutFooter` + `FzFocusTemplate`.
- **Remaining DS work = Phase 3 `FzAppTemplate`** (+ its just-in-time `FzLayoutBottomBar` region and the mobile-aside overlay a11y). **Phase 3 is gated** on the bottom-bar ADR below.

---

## 2026-07-09 — Bottom-bar mini-ADR — ✅ RESOLVED (Phase 3 ungated)

The §4 gate is cleared. Full decision record: [`bottom-bar-adr.md`](./bottom-bar-adr.md). Both facets confirmed with the author, grounded in the actual FO source (`it_fiscozen_app/frontoffice`: `BottomBar.vue`, `usePageTitle.ts`, `useBottomBarState.ts`, `StandardLayout.vue`).

- ✅ **(a) Teleport ownership → provide/inject.** `FzLayoutBottomBar` owns the target element and `provide()`s its ref under the namespaced string key `FZ_BOTTOM_BAR_TARGET = '@fiscozen/layout/bottomBarTarget'` (matching the repo's provide/inject anti-fragility convention). The app injects + owns its own `<Teleport>` + `<BottomBar>` content; the app-owned `TELEPORT_BOTTOM_BAR_ID` magic string is deleted. No hardcoded DOM id as public API; silent soft-fail becomes an explicit inject-miss.
- ✅ **(b) Geometry → sticky region in the main column.** `FzAppTemplate` places `FzLayoutBottomBar` as `position: sticky; bottom: 0` inside the main track, so the layout engine computes alignment — **no rail-width knowledge, no `clamp()` duplication**. Dissolves both the `pb-[80px]`/`useBottomBarState` reservation hack and the latent `320→380` rail-mismatch bug found in the current target (documented in the ADR §1). Must preserve `overflow-x: clip` + the full-height host contract (§6.2) and verify sticky on WebKit.

### ADR consequences for Phase 3
- **DS:** add `keys.ts` (`FZ_BOTTOM_BAR_TARGET`, re-exported from `index.ts`); build `FzLayoutBottomBar` (JIT) provided by/placed in `FzAppTemplate`; `hasBottomBar` becomes optional/advisory (region self-collapses when empty). Playwright/WebKit sticky coverage + injection-key lock-in test.
- **App (⛔ `fiscozen-app`):** `BottomBar.vue` injects the key + null-guards `<Teleport>`; `StandardLayout.vue` adapter drops the `fixed` target, its `clamp()` insets, the `pb-[80px]` toggle; delete `TELEPORT_BOTTOM_BAR_ID` from `usePageTitle.ts` and retire `useBottomBarState.ts`.

---

## 2026-07-08 — Phase 3 (`FzAppTemplate`) — 🔜 UNGATED (ADR resolved 2026-07-09) · not started

### Gate history (resolved)
§4 required the **bottom-bar mini-ADR resolved before Phase 3**. Both facets are now decided in [`bottom-bar-adr.md`](./bottom-bar-adr.md) — see the 2026-07-09 entry above. Original framing, for reference:

- 🧭→✅ **(a) Teleport ownership.** Today `TELEPORT_BOTTOM_BAR_ID = 'fz-layout-bottom-bar'` is **app-owned** (`usePageTitle.ts`), and `BottomBar.vue` teleports into it via a CSS selector that **soft-fails silently** if unmatched. **Decided: provide/inject the target ref** (the §4 "exposed-ref" form, keeps the package from owning a magic string).
- 🧭→✅ **(b) Geometry.** With nav/aside as opaque app slots, the template cannot know rail widths. **Decided: sticky region in the main column** — geometry computed by the layout engine, no rail-width props, no app padding.

### Phase 3 scope (once ungated)
- **`FzLayoutBottomBar`** region — built JIT; `FzAppTemplate` is its first consumer.
- **`FzAppTemplate`** — the one persistent-nav app shell (§4/§10 **locked**: one template, orthogonal props, **no `environment` prop**; escalate rather than branch on the calling app):
  - Slots: `nav`, `header`/`title`, default (main), `aside`, `bottomBar`, `footer`.
  - Toggle slot-props on `nav`, `header` **and** `aside`: `{ isDesktop, navOpen, toggleNav, asideOpen, toggleAside }` as relevant.
  - Props: `hasAside?`, `hasBottomBar?`, `chrome?: 'card' | 'flat'`, `background?`, and a **single content-width API** (do **not** ship both `mainMaxWidth` and `variant='wide'`).
- **Mobile aside overlay a11y** — focus-trap + `aria-modal`/`role="dialog"` + Escape (§4/§6.1); must not regress the FO chat overlay.
- **Sticky chrome + per-region directional safe-area** — deferred from Phase 2 to here (first real sticky/notch-bleed requirement). Preserve the `overflow-x-clip` vs `-hidden` distinction (§6.2).
- **Content-width variant** replaces the dead `route.meta.wideLayout` flag (§7).

### DS-buildable here vs app-side (⛔ separate repo)
- **DS-buildable in this repo:** `FzLayoutBottomBar`, `FzAppTemplate` (frame + regions + overlay a11y + sticky CSS), with unit + Storybook play + a11y + Chromatic.
- **App-side (blocked):** FO `StandardLayout` → thin adapter (nav + `SupportChatPanel` + bottom bar via slots); **Phase A** `SupportChatPanel` extraction (§6.1 prop table); **Phase 4** BO `AppContent`/`Page` refactor + the `html,body,#app` reset in BO `main.scss` (§6.2) + the 4 `disableViewport` prop-drift sites (§6.5); WebKit/iOS device verification of sticky + safe-area.

### Testing gate (§9)
- jsdom class-presence assertions **cannot** catch sticky-degradation, safe-area, or `overflow-clip` behavior → add **Playwright against the WebKit engine** for sticky-header + chat-overlay scenarios, plus **Chromatic** visual diffs on the DS PR.

---

## Next

- ✅ **Bottom-bar ADR** — done (2026-07-09), [`bottom-bar-adr.md`](./bottom-bar-adr.md). Phase 3 is ungated.
- 🔜 **Build the DS side of Phase 3 (LIB-2692):** `keys.ts` (`FZ_BOTTOM_BAR_TARGET`) → `FzLayoutBottomBar` region → `FzAppTemplate` (sticky bar in main column, provide/inject target, mobile-aside overlay a11y, sticky chrome + per-region directional safe-area). Unit + Storybook play + a11y + Chromatic + Playwright/WebKit sticky. Changeset: `@fiscozen/layout` minor (additive).
- ⛔ **App halves (`fiscozen-app` repo):** FO `StandardLayout` → adapter (inject the target, drop the `fixed`/`clamp()` target + `pb-[80px]` + `useBottomBarState`); Phase A `SupportChatPanel` extraction; Phase 4 BO refactor.
