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

## 2026-07-09 — Phase 3 (`FzAppTemplate`) — DS side ✅ COMPLETE

Branch: `feat/LIB-2692-app-template` (stacked on `feat/LIB-2693-page-templates-extraction`). **DS deliverable only** — the FO `StandardLayout` → adapter migration is app-side (⛔ separate `fiscozen-app` repo).

### Decisions taken during implementation
- **Nav is persistent and defers to the injected nav; only the aside collapses. [revised 2026-07-09 after investigating the FO nav — see the correction note below.]** Desktop → nav sticky **left rail** + aside sticky **right panel** (both `shrink-0`, widths follow the *injected* content — no rail widths in the template, per §4/§10). On mobile → the nav stays rendered as a full-width **top region** (the injected nav owns its own responsive collapse/menu), and **only the aside** collapses into a **modal drawer** with `role="dialog"`/`aria-modal`/focus-trap/Escape. Nav is a plain positioning wrapper (not a landmark) — the injected nav owns its own `<nav>` (no `FzLayoutNav` region needed; §3's region list has none).
- **Desktop aside is persistent** (matches FO: chat always shown on desktop). `toggleAside` drives the **mobile aside drawer** only. Toggle slot-props exposed on `nav`/`header`/`aside` are `{ isDesktop, asideOpen, toggleAside }` — no `navOpen`/`toggleNav` (the nav's open/menu state is the injected nav's concern, not the template's).
- **provide lives on `FzAppTemplate`, not on `FzLayoutBottomBar`.** provide/inject only reaches descendants, and the page components that teleport a bar are descendants of the *template*, not of the region. So the region (`FzLayoutBottomBar`) exposes its root `el` via `defineExpose`, and the template `provide()`s that element under `FZ_BOTTOM_BAR_TARGET` — a refinement of the ADR sketch (which drew `provide` inside the region) that preserves the exact contract (namespaced key + exposed target element).
- **`background` prop dropped** in favour of a fall-through `class` on the root (matches the `FzFocusTemplate` story pattern — `class="bg-…"`); avoids a loose arbitrary-CSS string prop. Single content-width API shipped as `contentWidth: 'standard' | 'wide' | 'full'` (no second width prop), replacing the dead `wideLayout` flag (§7). `hasBottomBar` defaults `true` (region self-collapses when empty; ADR D2).
- **Focus trap** implemented in-template (no repo utility exists): on drawer open, save `document.activeElement`, move focus in, trap Tab/Shift+Tab within the overlay, Escape closes, restore focus on close. Applied to whichever single drawer is open.
- **Directional safe-area** via scoped CSS (header→top, rail→left, panel→right, drawers→their exposed edges); the bottom bar owns its own bottom inset. Main region keeps `overflow-x: clip` (not `-hidden`) so app sticky descendants keep the document scroll container (§6.2).

### Built
- `packages/layout/src/keys.ts` — **new.** `FZ_BOTTOM_BAR_TARGET = '@fiscozen/layout/bottomBarTarget'` namespaced-string `InjectionKey<Readonly<Ref<HTMLElement | null>>>` (provided as a plain ref; key type signals read-only to consumers).
- `packages/layout/src/FzLayoutBottomBar.vue` — **new.** Sticky bottom-0 region, `pointer-events:none` container / interactive children, bottom safe-area, `max-height:480px` hide, exposes root `el`.
- `packages/layout/src/FzAppTemplate.vue` — **new.** The shell (frame + regions + overlay a11y + sticky CSS + provide).
- `packages/layout/src/types.ts`, `index.ts` — bottom-bar + app-template types; export the two components + `FZ_BOTTOM_BAR_TARGET`.
- `packages/layout/src/__tests__/FzLayoutBottomBar.spec.ts` + `FzAppTemplate.spec.ts` — **new** (matchMedia mocked per-file). Cover structure/regions, persistent nav (rail desktop / top-bar mobile, never a dialog), aside/bottom-bar gating, chrome + contentWidth, toggle slot-props, the mobile aside drawer (dialog/aria-modal/backdrop/Escape), responsive reset, the provide/teleport integration, and the injection-key string lock-in.
- `apps/storybook/src/stories/templates/FzAppTemplate.stories.ts` — **new.** `Default` / `WithAside` / `WideFlat` / `BottomBarViaTeleport` (the last demonstrates the real inject+`<Teleport>` pattern), play functions assert landmarks + card/flat + sticky header + the teleported bar.
- `packages/layout/README.md`, `.changeset/layout-phase3-app-template.md` (minor, additive).

### Verification (after the nav-defers-to-FzNavbar revision)
- `pnpm --filter @fiscozen/layout test:unit` → **140/140** (109 from Phases 0–2 unchanged + 31 new).
- Storybook play (real Chromium, 1280px → `isDesktop` true): `vitest --project=storybook src/stories/templates` → **20/20** across 5 files (4 new `FzAppTemplate`); no icon/deprecation warnings.
- `pnpm --filter @fiscozen/layout build` → **exit 0**, `dist/layout.js` 39.50 kB + declaration files. Only pre-existing diagnostics remain (`FzLayout.vue` `@apply`, `@fiscozen/composables` `FzFloating.vue` TS2774 — both documented in oplog-1); **zero** in the new files.

### Not done here (deliberately)
- **Playwright/WebKit** sticky + safe-area verification and **Chromatic** diffs — the DS PR triggers Chromatic in CI; WebKit/iOS device verification of sticky/notch-bleed happens with the app migration (§9).
- All app halves (FO `StandardLayout` adapter, Phase A chat, Phase 4 BO) — ⛔ separate `fiscozen-app` repo.

### Correction — nav defers to `FzNavbar` (2026-07-09, post-investigation)

Investigated how the FO mobile nav (the top bar: ☰ · logo · 💬) is actually built (`fiscozen-app/it_fiscozen_app/frontoffice/src/navigation/FzNavigation.vue`). Finding: it is **already a DS component — `FzNavbar` (`@fiscozen/navbar`)** in its `isMobile` state. `FzNavbar.vue:87-104` renders the mobile bar (`#menu-button` hamburger owning `isMenuOpen`, centered `#brand-logo`, `#notifications` = the chat button); `FzNavigation` fills those slots and renders its **own** RBAC menu drawer. Decisively, **`FzNavbar`'s `horizontal` variant is `@deprecated` "in favor of the frontoffice three-column layout"** (`navbar/src/types.ts:12-17`) — i.e. this work.

So my first cut of `FzAppTemplate` (symmetric nav+aside **drawers** with `navOpen`/`toggleNav` + a nav focus trap) **duplicated and conflicted** with `FzNavbar`, which already owns the mobile bar + hamburger + menu. Revised the component **within this PR** (nothing merged/published yet):
- Nav is now **persistent** — a rail on desktop, a full-width top region on mobile — and the template renders **no** nav drawer/overlay/focus-trap/backdrop-for-nav. The injected nav (`FzNavbar`) transforms itself.
- Dropped `navOpen`/`toggleNav`/`navLabel`; toggle slot-props are now `{ isDesktop, asideOpen, toggleAside }`.
- The **aside** stays the template's one collapsible region (desktop panel / mobile modal drawer with the full a11y) — that overlay genuinely is app-shell-owned today (`StandardLayout`, not `FzNavbar`).

**Tracking outcome:** the mobile nav needs **no new DS extraction** (it's already `FzNavbar`). The FO consumption (adopt `FzAppTemplate`, migrate `FzNavbar` off the deprecated `horizontal` → `vertical`) is the app half — a new FO card under RT-2054 (created), a `fiscozen-app` PR. So all DS work stays tracked under LIB-2692.

---

## Next

- ✅ **Bottom-bar ADR** — done (2026-07-09), [`bottom-bar-adr.md`](./bottom-bar-adr.md). Phase 3 ungated.
- ✅ **DS side of Phase 3 (LIB-2692)** — done (2026-07-09, see entry above): `FZ_BOTTOM_BAR_TARGET` + `FzLayoutBottomBar` + `FzAppTemplate`, 138/138 unit + 20/20 storybook + build clean. This completes the DS-repo scope of the RFC (Phases 0–3 DS side ✅). Remaining DS niceties: Playwright/WebKit sticky spec + Chromatic review on the PR.
- ⛔ **App halves (`fiscozen-app` repo):** FO `StandardLayout` → adapter (inject the target, drop the `fixed`/`clamp()` target + `pb-[80px]` + `useBottomBarState`); Phase A `SupportChatPanel` extraction; Phase 4 BO refactor.
