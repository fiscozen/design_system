# Operational Log — `@fiscozen/layout` Page Templates Extraction

Companion execution log for [`page-templates-extraction.md`](./page-templates-extraction.md). Tracks what was actually built, the decisions taken during implementation, verification evidence, and cross-repo scope. RFC sections are cited as `§`.

**Legend:** ✅ done · 🔜 next · ⛔ blocked/out-of-repo

---

## Repo/scope facts (established at kickoff)

- Work is happening in the **design-system repo** (`/Users/fiscozen/Projects/design_system`).
- The FO/BO apps the RFC references (`StandardLayout`, `FocusLayout`, `AppContent`/`Page`, the `breakpoints.*='1200px'` mutations, `main.ts` TODO) live in a **separate repo** — `/Users/fiscozen/Projects/fiscozen-app/*` (multiple git worktrees, e.g. `it_fiscozen_app/frontoffice`) — which is **not** a working directory of this session.
- ⛔ Consequence: RFC **Phase A** and **Phases 2–5** (app-side migrations) cannot be implemented from the DS repo. The DS-repo scope is **Phase 0** (unblock) and **Phase 1** (regions + `FzBlankTemplate`).

---

## 2026-07-08 — Phase 0 (DS unblock) — ✅ COMPLETE

Branch: `docs/layout-page-templates-plan`.

### Decisions taken during implementation
- **RFC status → Accepted.** Recorded in the RFC `Status:` field (RFCs use a status field; there is no `accepted/` folder convention in `docs/RFC/`).
- **New breakpoint token name = `desktop`, value = `1200px`.** Value derived from app evidence (not guessed): `frontoffice/src/main.ts:21` `breakpoints.lg = '1200px'` (with a `// remove when DS breakpoints are updated` TODO), `breakpoints.md = '1200px'` in `StandardLayout.vue:46` / `FocusLayout.vue:42` / `BottomBar.vue:18`, and the already-safe `useBreakpoints({ ...breakpoints, lg: '1200px' })` in `FzNavigation.vue:37`. Name confirmed with the author.
- **Rollout = token + guard together, now.** Confirmed with the author. `FzLayout` kept behaviour-identical (token is additive).

### Slice 1 — `useBreakpoints().current()` (§6.3) — ✅
- `packages/composables/src/composables/useBreakpoints.ts`: added a reactive `current()` accessor returning the name of the largest breakpoint whose `min-width` is currently matched. Descending priority, inclusive `min-width` (boundary-parity with the previous `viewportWidth >= value` logic), **order-independent** (sorts entries by px value), falls back to the smallest breakpoint below the first threshold.
- `packages/composables/src/__tests__/useBreakpoints.spec.ts`: **new** spec (the composable had no test before). Covers per-width resolution, boundary parity, below-first-threshold fallback, key-order independence, and `isGreater`.

### Slice 2 — `FzLayout` refactor (§6.3) — ✅
- `packages/layout/src/FzLayout.vue`:
  - Removed the bespoke `window.resize` + `getCurrentBreakpoint()` (and `onMounted`/`onUnmounted`); breakpoint tracking now flows through `useBreakpoints().current()`.
  - Added the opt-out **`disablePadding`** prop. Padding (`p-12`) stays **on by default**. Implemented via `:class` arrays that position the padding token exactly where the static class had it → **byte-identical default output** (the existing snapshots pass unchanged, proving no visual regression for the 17 BO consumers). This honours §6.3's "padding stays opt-out" constraint.
  - `FzLayout` resolves over a **fixed canonical breakpoint set** (`xs…3xl`, the names its scoped CSS defines), so adding a token to the shared scale cannot silently shift its grid or emit a `--<name>` class the stylesheet has no rule for.
- `packages/layout/src/types.ts`: documented `disablePadding?: boolean`.
- `packages/layout/src/__tests__/FzLayout.spec.ts`: rewrote the obsolete "window resize listener" test to assert matchMedia-based tracking + clean unmount; added `disablePadding` on/off coverage; added a lock-in test proving a ~1200px viewport still resolves to `--lg` (never `--desktop`).
- `apps/storybook/src/stories/panel/Layout.stories.ts`: added a `DisablePadding` story with a play function verifying regions omit `p-12`.

### Slice 3 — `desktop` token + mutation guard (§6.4) — ✅
- `packages/style/tokens.json`: added `global.breakpoint.desktop = 1200px` (between `lg` and `xl`).
- `packages/style/output/global.json`, `output/global.css`, `tokens/global.json`: regenerated via `pnpm --filter @fiscozen/style build` (token-transformer + Style Dictionary). Token is now exposed both as `breakpoints.desktop` on the shared singleton (`src/constants.ts` reads `tokens.json` directly) and as a Tailwind `desktop:` screen.
- `packages/eslint-config/index.js`: added a `no-restricted-syntax` guard forbidding `breakpoints.<key> =` assignments, with a message pointing at the spread-copy pattern / `desktop` token. Prevents the singleton-mutation anti-pattern from regrowing across the multi-repo rollout (§6.4).

### Verification
- `pnpm --filter @fiscozen/composables test:unit` → **95/95 pass**.
- `pnpm --filter @fiscozen/layout test:unit` → **64/64 pass** (snapshots unchanged → confirmed zero default-output regression after both the refactor and the token addition).
- Builds: `@fiscozen/style`, `@fiscozen/composables`, `@fiscozen/layout`, `@fiscozen/navbar` (the only `Breakpoint`-type consumer, via `Partial<Record<Breakpoint,…>>`) all produce `dist/`. Pre-existing `TS2774`/`TS2554` diagnostics in `FzFloating.vue`/`FzButtonGroup.vue` are unrelated to this change (not in touched files).
- ESLint guard isolate-tested with the `Linter` API: flags `breakpoints.md =`, `breakpoints.lg =`, `breakpoints['md'] =`; does **not** flag `{ ...breakpoints, lg: … }`, `useBreakpoints({ ...breakpoints })`, or `prev[key] = value`.

### Changesets
- `.changeset/layout-phase0-breakpoints.md` — `@fiscozen/composables` minor, `@fiscozen/layout` minor.
- `.changeset/style-desktop-breakpoint.md` — `@fiscozen/style` minor. (`@fiscozen/eslint-config` is `private`, so changesets skips it.)

### Files touched
```
docs/RFC/layout/page-templates-extraction.md          (status → Accepted; oplog reference)
packages/composables/src/composables/useBreakpoints.ts
packages/composables/src/__tests__/useBreakpoints.spec.ts   (new)
packages/layout/src/FzLayout.vue
packages/layout/src/types.ts
packages/layout/src/__tests__/FzLayout.spec.ts
apps/storybook/src/stories/panel/Layout.stories.ts
packages/style/tokens.json
packages/style/tokens/global.json                     (generated)
packages/style/output/global.json                     (generated)
packages/style/output/global.css                      (generated)
packages/eslint-config/index.js
.changeset/layout-phase0-breakpoints.md               (new)
.changeset/style-desktop-breakpoint.md                (new)
```

### Not done in Phase 0 (deliberately — app-side, out of this repo)
- The `disableViewport → isViewport` prop-drift reconciliation + byte-identical test for the 4 BO sites (§6.5) is **app-side** (per §9, the byte-identical test targets the BO app). `FzLayout` already reads `isViewport`; no DS change was required.
- Migrating the 4 unsafe `breakpoints.*='1200px'` mutations to the new `desktop` token and dropping the `main.ts` TODO — app-side, blocked on the separate repo. The DS-side enabler (token + guard) is now published-ready.

---

## 2026-07-08 — Phase 1 (DS: `FzBlankTemplate` + first region) — ✅ COMPLETE

Branch: `docs/layout-page-templates-plan`.

### Decisions taken during implementation
- **Just-in-time really means one region, not five.** Only `FzLayoutMain` was built — the sole region `FzBlankTemplate` consumes. `FzLayoutHeader`/`Aside`/`Footer`/`BottomBar` are deferred to their first template consumers (Phases 2–3), honouring §3's "built just-in-time … not as a speculative library."
- **`FzLayoutMain` API scoped to the blank template's needs only:** `as` (semantic `<main>` landmark by default, overridable so a page never exposes two `main`s), `align` (`stretch`/`top`/`center`), `safeArea` (`env(safe-area-inset-*)` insets). Padding / internal scroll / max-width / sticky are intentionally **not** added yet — they arrive JIT when the focus/app-shell templates need them (Phases 2–3). Because `FzLayoutMain` is brand-new with **zero consumers**, padding polarity was chosen as explicit **opt-in** (added later, default off), rather than `FzLayout`'s legacy opt-out — no back-compat constraint applies.
- **`FzBlankTemplate` owns a full-height root (`min-h-dvh`)** to make §6.2's host contract *explicit* instead of silently depending on app-global `#app{height:100%}` / `overflow-y:auto`. Used `min-h` (not fixed `h`) so content taller than the viewport stays reachable when centered — avoids the classic flexbox "centered overflow clips the top" bug. Safe-area is **always on** for this template (it is the outermost full-screen shell and covers auth/login on notched/Capacitor devices).
- **File layout:** new components kept **flat in `src/`** (`FzLayoutMain.vue`, `FzBlankTemplate.vue`), matching the package's existing `FzLayout.vue` and the DS `FzTab.vue`/`FzTabs.vue` multi-component convention — no subfolder.
- **No `__fzKind` markers:** neither the template nor the region filters slot children by type, so the CLAUDE.md container-slot-identification convention does not apply here.

### Slice 1 — `FzLayoutMain` region molecule — ✅
- `packages/layout/src/FzLayoutMain.vue`: **new.** Renders `<component :is="as">` (default `main`), flex-column with `align`-driven cross/main-axis classes and an `env()`-based `--safe-area` class. Plain scoped CSS + `env()` only (no `@apply`), so it is fully processed at package build time.
- `packages/layout/src/types.ts`: added `FzLayoutAlign`, `FzLayoutMainProps`, `FzLayoutMainSlots` (JSDoc per convention).
- `packages/layout/src/__tests__/FzLayoutMain.spec.ts`: **new.** Semantic `<main>` landmark, `as` override, slot rendering, align variants, safe-area toggle, aria-forwarding, no-events.

### Slice 2 — `FzBlankTemplate` page template — ✅
- `packages/layout/src/FzBlankTemplate.vue`: **new.** Composes `FzLayoutMain` as its full-height root (`min-h-dvh`), maps `align` (`center`|`top`) onto the region, safe-area always on.
- `packages/layout/src/types.ts`: added `FzBlankTemplateProps`, `FzBlankTemplateSlots`.
- `packages/layout/src/__tests__/FzBlankTemplate.spec.ts`: **new.** Slot rendering, single-`main`/no-chrome composition, full-height root, safe-area, align mapping, no-events.
- `packages/layout/src/index.ts`: export `FzLayoutMain`, `FzBlankTemplate`.

### Slice 3 — Stories (play + a11y + Chromatic source) — ✅
- `apps/storybook/src/stories/templates/FzLayoutMain.stories.ts`: **new.** `Stretch`/`Centered`/`TopAligned`/`SafeArea`/`AsDiv`; play functions assert the `main` landmark via `getByRole('main')` and align/safe-area/tag behaviour.
- `apps/storybook/src/stories/templates/FzBlankTemplate.stories.ts`: **new.** `Centered`/`TopAligned` with a sample login card; play functions assert single `main`, full-height root, centering, and absence of nav/header/aside/footer chrome. `layout: 'fullscreen'` so Chromatic captures the true full-bleed shape.

### Verification
- `pnpm --filter @fiscozen/layout test:unit` → **84/84 pass** (64 pre-existing `FzLayout`, unchanged, + 20 new). No `FzLayout` snapshot churn → the additive change did not perturb the existing grid primitive.
- Storybook play tests (real Chromium): `vitest --project=storybook src/stories/templates` → **7/7 pass** across the 2 new story files.
- `pnpm --filter @fiscozen/layout build` → `dist/` emitted (`layout.js` 32.33 kB). The `[lightningcss] Unknown at rule: @apply` warnings are **pre-existing** (from `FzLayout.vue`, processed by the consuming app's Tailwind); the new components emit none.

### Changesets
- `.changeset/layout-phase1-blank-template.md` — `@fiscozen/layout` minor (additive).

### Files touched
```
packages/layout/src/FzLayoutMain.vue                         (new)
packages/layout/src/FzBlankTemplate.vue                      (new)
packages/layout/src/types.ts
packages/layout/src/index.ts
packages/layout/src/__tests__/FzLayoutMain.spec.ts           (new)
packages/layout/src/__tests__/FzBlankTemplate.spec.ts        (new)
packages/layout/README.md
apps/storybook/src/stories/templates/FzLayoutMain.stories.ts     (new)
apps/storybook/src/stories/templates/FzBlankTemplate.stories.ts  (new)
.changeset/layout-phase1-blank-template.md                   (new)
docs/RFC/layout/page-templates-extraction.md                 (status)
docs/RFC/layout/page-templates-extraction-oplog.md
```

### Not done in Phase 1 (deliberately)
- Other region molecules (`FzLayoutHeader/Aside/Footer/BottomBar`) and the `FzFocusTemplate`/`FzAppTemplate`/`FzMasterDetailTemplate` templates — deferred to Phases 2–5, built just-in-time with their first consumer.
- App-side migrations (Phases A, 2–5) — blocked on the separate `fiscozen-app` repo.

---

## 2026-07-08 — Phase 2 (DS side: `FzFocusTemplate` + flow regions) — ✅ COMPLETE

Branch: `docs/layout-page-templates-plan`. **DS deliverable only** — the FO `FocusLayout.vue` → adapter migration is app-side (⛔ separate `fiscozen-app` repo).

### Decisions taken during implementation
- **Three regions built JIT, `FzLayoutMain` reused, bottom-bar deferred.** `FzFocusTemplate`'s slots map to `FzLayoutHeader` (topbar), the existing `FzLayoutMain` (centered content), `FzLayoutAside` (aside) and `FzLayoutFooter` (footer). `FzLayoutBottomBar` is **not** built — it has no consumer until the app-shell (Phase 3).
- **Regions kept deliberately thin (`as` only).** Each renders its landmark element (`<header>`/`<aside>`/`<footer>`) + a stable class hook; sizing/padding is applied by the composing template via fall-through attributes. No `safeArea`/padding/sticky props yet — those are added JIT when a template needs them.
- **Safe-area handled once at the template root, not per region.** `FzFocusTemplate`'s root carries all-4 `env(safe-area-inset-*)` insets. Per-region *directional* safe-area (e.g. a sticky topbar whose background must bleed under the notch while its content is inset) is a genuinely different requirement and is deferred JIT to Phase 3 (app-shell). This is why the new regions carry no `safeArea` prop while `FzLayoutMain` (built for the full-screen blank template) does.
- **`chrome` default = `card`.** Onboarding — the primary `FocusLayout` consumer — presents its flow in a contained card; auth is the explicit `chrome="flat"` variant (matches §4's framing of auth as the special-cased branch). Card styling is applied via **bound Tailwind utilities** (`bg-core-white rounded-lg shadow p-24 max-w-[640px]`) plus a BEM marker class (`fz-focus-template__content--card`) for test stability — avoids relying on `@apply` that is left unprocessed in the package's own `dist` CSS.
- **Aside is responsive but not an overlay.** It stacks below the content on narrow viewports and sits beside it (`lg:w-[360px]`) from `lg` up. The mobile slide-in **overlay** with focus-trap + `aria-modal`/Escape (§4/§6.1) is `FzAppTemplate`'s concern and is deferred to Phase 3 — the focus flow's aside is a plain complementary region.
- **Full-height root `min-h-dvh`** (not fixed `h`), same reasoning as `FzBlankTemplate` (overflowing content stays reachable when centered).

### Slice 1 — flow region molecules — ✅
- `packages/layout/src/FzLayoutHeader.vue`, `FzLayoutAside.vue`, `FzLayoutFooter.vue`: **new.** Thin `<component :is="as">` wrappers (default `header`/`aside`/`footer`) with base classes `fz-layout-header`/`-aside`/`-footer`.
- `packages/layout/src/types.ts`: added `FzLayoutRegionProps`/`Slots` (shared) and the six per-region type aliases.
- `packages/layout/src/__tests__/FzLayoutRegions.spec.ts`: **new**, `describe.each` over the three — landmark element, slot, `as` override, attr-forwarding, no-events.

### Slice 2 — `FzFocusTemplate` — ✅
- `packages/layout/src/FzFocusTemplate.vue`: **new.** `min-h-dvh` flex-column root (topbar / body / footer); body is `flex-col lg:flex-row` (main + optional aside); optional regions render only when their slot is provided (`slots.topbar`/`aside`/`footer`); `chrome` drives the content frame; root scoped style applies safe-area insets.
- `packages/layout/src/types.ts`: added `FzFocusChrome`, `FzFocusTemplateProps`, `FzFocusTemplateSlots`.
- `packages/layout/src/__tests__/FzFocusTemplate.spec.ts`: **new** — centered main, full-height root, conditional topbar/aside/footer landmarks, `chrome` card/flat mapping (+ default), no-events.
- `packages/layout/src/index.ts`: export the 3 regions + `FzFocusTemplate`.

### Slice 3 — Stories (play + a11y + Chromatic source) — ✅
- `apps/storybook/src/stories/templates/FzFocusTemplate.stories.ts`: **new.** `Card`/`Flat`/`WithTopbarAsideFooter`; play functions assert the centered `main`, the card/flat frame, the full-height root, and — with all slots filled — the `banner`/`main`/`complementary`/`contentinfo` landmarks via `getByRole`. `layout: 'fullscreen'`.
- `apps/storybook/src/stories/templates/FzLayoutRegions.stories.ts`: **new.** `Header`/`Aside`/`Footer` isolated, each asserting its landmark role + class + content.

### Verification
- `pnpm --filter @fiscozen/layout test:unit` → **109/109 pass** (84 from Phases 0/1, unchanged, + 25 new). No `FzLayout` snapshot churn.
- Storybook play tests (real Chromium): `vitest --project=storybook src/stories/templates` → **13/13 pass** across the 4 template story files. `getByRole('banner'|'complementary'|'contentinfo')` resolve, confirming the landmark semantics render as intended.
- `pnpm --filter @fiscozen/layout build` → `vue-tsc` clean (declaration files built, no type errors), `dist/` emitted (`layout.js` 34.51 kB). New components emit **no** `@apply` warnings (only the pre-existing `FzLayout.vue` ones remain).

### Changesets
- `.changeset/layout-phase2-focus-template.md` — `@fiscozen/layout` minor (additive).

### Files touched
```
packages/layout/src/FzLayoutHeader.vue                          (new)
packages/layout/src/FzLayoutAside.vue                           (new)
packages/layout/src/FzLayoutFooter.vue                          (new)
packages/layout/src/FzFocusTemplate.vue                         (new)
packages/layout/src/types.ts
packages/layout/src/index.ts
packages/layout/src/__tests__/FzLayoutRegions.spec.ts          (new)
packages/layout/src/__tests__/FzFocusTemplate.spec.ts          (new)
packages/layout/README.md
apps/storybook/src/stories/templates/FzFocusTemplate.stories.ts  (new)
apps/storybook/src/stories/templates/FzLayoutRegions.stories.ts  (new)
.changeset/layout-phase2-focus-template.md                     (new)
docs/RFC/layout/page-templates-extraction.md                   (status)
docs/RFC/layout/page-templates-extraction-oplog.md
```

### Not done in Phase 2 (deliberately)
- `FzLayoutBottomBar` region and the mobile aside **overlay** (focus-trap/`aria-modal`/Escape) — deferred to Phase 3 (`FzAppTemplate`), built JIT.
- The FO `FocusLayout.vue` → thin-adapter migration (auth → explicit `chrome="flat"`), and WebKit/onboarding verification — **app-side**, blocked on the separate `fiscozen-app` repo.

---

## Next

The DS side of Phases 0–2 is complete (above). **Phase 3 onward is tracked in a second log:** [`page-templates-extraction-oplog-2.md`](./page-templates-extraction-oplog-2.md) — it opens the `FzAppTemplate` stream, which is **gated on the §4 bottom-bar ADR** (teleport ownership + geometry) and introduces `FzLayoutBottomBar`, the mobile-aside overlay a11y, and sticky chrome + per-region directional safe-area.

Hand-off state for the `fiscozen-app` repo: DS `desktop` token available; the ESLint guard flags legacy `breakpoints.*=` once the app bumps `@fiscozen/eslint-config`; `FzBlankTemplate` (login/tools) and `FzFocusTemplate` (onboarding/auth) are published-ready.
