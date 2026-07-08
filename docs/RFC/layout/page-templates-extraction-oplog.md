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

## Next

- 🔜 **Phase 1 (DS):** build region molecules (`FzLayoutHeader/Main/Aside/Footer/BottomBar`) **just-in-time** for their first consumer + `FzBlankTemplate`; unit + Storybook play + a11y + Chromatic; publish minor (§8, §3, §9).
- ⛔ **Phases A, 2–5 (apps):** require the `fiscozen-app` repo. Hand off with: the DS `desktop` token is available; the ESLint guard will flag legacy `breakpoints.*=` mutations once the app bumps `@fiscozen/eslint-config`.
