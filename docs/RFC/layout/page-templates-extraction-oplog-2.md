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

## 2026-07-08 — Phase 3 (`FzAppTemplate`) — 🧭 GATED (ADR pending) · not started

### Why it is gated
§4 requires the **bottom-bar mini-ADR resolved before Phase 3**. Two facets must both be decided:

- 🧭 **(a) Teleport ownership.** Today `TELEPORT_BOTTOM_BAR_ID = 'fz-layout-bottom-bar'` is **app-owned** (`usePageTitle.ts`), and `BottomBar.vue` teleports into it via a CSS selector that **soft-fails silently** if unmatched. Decide: DS guarantees a stable documented ID forever, **or** `FzAppTemplate` exposes the target via a `defineExpose`d ref the app threads into its own `<Teleport :to>`. RFC **prefers the exposed-ref form** (keeps the package from owning a magic string).
- 🧭 **(b) Geometry.** With nav/aside as opaque app slots, the template cannot know rail widths. Either rail widths become **explicit props**, or the bar is **full-width and the app pads it**.

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

- 🧭 **Draft the bottom-bar ADR** — both facets (teleport ownership + geometry), each with options + a recommendation. This is the immediate gate before any Phase 3 code. Working recommendation: exposed-ref teleport form; geometry TBD in the ADR.
- 🔜 **After the ADR:** build `FzLayoutBottomBar` + `FzAppTemplate` (DS side) here; hand the app halves (FO `StandardLayout` adapter, Phase A chat extraction, Phase 4 BO refactor) to the `fiscozen-app` repo.
