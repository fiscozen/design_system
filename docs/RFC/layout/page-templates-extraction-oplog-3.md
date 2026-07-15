# Operational Log 3 — `@fiscozen/layout` Page Templates Extraction (`FzListTemplate` / LIB-2694)

Continuation of [`page-templates-extraction-oplog.md`](./page-templates-extraction-oplog.md) (oplog-1, Phases 0–2 DS ✅) and [`page-templates-extraction-oplog-2.md`](./page-templates-extraction-oplog-2.md) (oplog-2, Phase 3 `FzAppTemplate` DS ✅). Companion execution log for the RFC [`page-templates-extraction.md`](./page-templates-extraction.md). RFC sections are cited as `§`.

This third log opens the **`FzListTemplate` stream** — the backoffice list-page layout, **Jira LIB-2694** ("[Design System] BO list layout", Improvement) under epic **RT-2054**. It is tracked apart from the shell templates because it is a distinct card and PR.

**Legend:** ✅ done · 🔜 next · ⛔ blocked/out-of-repo · 🧭 decision required

---

## Branch / PR topology

- Branch: `feat/LIB-2694-bo-list-template`, based on `feat/LIB-2693-page-templates-extraction` (**#414**) — a **sibling** of `feat/LIB-2692-app-template` (**#415**), not stacked on it.
- Rationale: `FzListTemplate` consumes only the **region molecules** (`FzLayoutMain`/`FzLayoutAside`) + the Phase-0 `FzLayout` work, all in #414. It does **not** consume `FzAppTemplate`/`FzLayoutBottomBar` (#415) — a page-content list layout renders *inside* the shell, it does not compose it. Basing on #414 lets LIB-2694 merge as soon as #414 lands, independent of #415's review (auto-retargets to `main`).

```
main
 └─ #414 LIB-2693 (regions + Blank + Focus)
    ├─ #415 LIB-2692 (FzAppTemplate)          — sibling
    └─ #4xx LIB-2694 (FzListTemplate)         — this stream
```

---

## 2026-07-13 — BO source reconnaissance (evidence for the API)

Verified against the real BO source (`fiscozen-app/it_fiscozen_app/backoffice/src`; reference page = *Dichiarazioni IVA* → `components/vat_declaration/UserVatDeclarationList.vue`):

- **The shell is out of scope.** Render chain `App → AppContent → SideBar + Page → PageHeader + <router-view>`. Nav (56px `FzNavbar` rail), breadcrumb, footer and the `Page.vue` Monster-CSS `!important` debt are all **shell chrome** — that is `FzAppTemplate` / Phase 4 / LIB-2692 territory. The list template starts at the router-view content region and owns none of it.
- **List-content archetype (top→bottom):** optional banner/action-card → **filter rail (left)** → title/search header → **`FzTable`** (which owns its own pagination, title, record-count and search) → trailing modals.
- **The inconsistency to normalize:** only **6 of 34** `*List.vue` use `FzLayout leftShoulder` (5 `leftShoulder` + 1 `oneColumn`); the other **28 hand-roll** the same rail/table shape three ways — `grid-cols-4` (the canonical VAT page), `flex w-[300px]` (Model770), and single-card-with-inline-top-filters (`operations/UserList`). The `leftShoulder` shoulder holds **filters**, not a detail pane.
- **Presentation vs logic:** extractable = the rail/main split, spacing, responsive behaviour, semantic landmarks. Stays app-side = `useTableApi`, Vuex filter sourcing, RBAC (`operatorLevelRequired`/`usePermission`), `boApi`, modals, per-row action factories.

---

## 2026-07-13 — `FzListTemplate` — DS side ✅ COMPLETE

**DS deliverable only** — migrating the ~34 BO list pages to consume it is app-side (⛔ separate `fiscozen-app` repo).

### Decisions taken during implementation
- **Compose region molecules, not `FzLayout leftShoulder`.** `leftShoulder` forces `100vh` mobile tracks + independent per-region `overflow-auto` scroll; the 28 hand-rolled pages deliberately avoid that and scroll the document. So `FzListTemplate` follows the `FzFocusTemplate` idiom (`FzLayoutAside` + `FzLayoutMain` in a document-scroll flex). Recorded in RFC §4.
- **Name `FzListTemplate`, superseding the provisional `FzMasterDetailTemplate`** (RFC §4). The shoulder is a filter rail, not a detail pane; "list layout" matches the Jira. A genuine master-detail wrapper stays a possible *later* addition.
- **Page-content template, not a shell.** No forced viewport height (`min-h-dvh`) and no root safe-area — the shell owns the scroll container, full-height host contract (§6.2) and device safe-area. This is the meaningful distinction from the top-level templates.
- **`mainAs` defaults to `'main'`** (the list is the page's primary content; BO has no `<main>` today, so this is a net a11y gain) with a documented `'div'` escape for nesting inside a shell that already renders `<main>`. **Follow-up:** reconcile who owns `<main>` between `FzAppTemplate` and `FzListTemplate` in the BO shell-migration card.
- **Filter rail is slot-presence driven** (`filters` slot absent → single-column, full-width main) with `filtersPosition: 'left' | 'top'` for the two real archetypes (rail vs full-width filter bar). Rail defaults to a standard `md:w-[300px]` (normalizing the `w-[300px]`/`grid-cols-4`/`w-[340px]` drift); no rail-width prop (§10 spirit).
- **`header` slot is a plain `<div>`, not a `<header>` banner** — the shell already owns the page banner/breadcrumb; a second banner landmark would be an a11y regression.

### Built
- `packages/layout/src/FzListTemplate.vue` — **new.** The layout (banner + filters rail + header toolbar + main), slot-driven, `filtersPosition` + `mainAs` props. No scoped CSS (all Tailwind); no new package dependency (imports only the region molecules + Vue).
- `packages/layout/src/types.ts` — `FzListFiltersPosition`, `FzListTemplateProps`, `FzListTemplateSlots` added + exported.
- `packages/layout/src/index.ts` — exports `FzListTemplate`.
- `packages/layout/src/__tests__/FzListTemplate.spec.ts` — **new.** Rendering/structure, no forced viewport height, optional regions (banner/filters-as-complementary/header-not-banner), `filtersPosition` left/top, `mainAs` main/div, attribute forwarding onto the root, no events.
- `apps/storybook/src/stories/templates/FzListTemplate.stories.ts` — **new.** `WithFilters` / `FiltersTop` / `ListOnly`, play functions assert landmarks (main + complementary), banner/header, and the rail placement.
- `packages/layout/README.md` — `FzListTemplate` section + attribute-forwarding note updated.
- `.changeset/layout-bo-list-template.md` — `@fiscozen/layout` minor (additive).
- RFC §4 entry reconciled (this file's sibling doc edit).

### Verification ✅ (2026-07-13)
- `pnpm --filter @fiscozen/layout test:unit` → **126 passed** (6 files).
- `npx vitest run --project=storybook FzListTemplate` (browser/Playwright play) → **4 passed** (`WithFilters` / `FiltersTop` / `ListOnly` / `NestedInShell`).
- `pnpm --filter @fiscozen/layout build` (`vue-tsc` + vite) → **OK**; dts emitted; bundle 35.73 kB / gzip 5.96 kB. (Pre-existing `@apply` lightningcss warnings originate in `FzLayout.vue`'s scoped CSS, not `FzListTemplate`.)
- Prettier clean on all touched files. ESLint: the package's new-on-branch config flags the established `slot?(props: {}): any` idiom across the whole file (every template's slots, pre-existing) — `FzListTemplate.vue`/`.spec.ts` add zero new violations; eslint is not in the pre-push hook.

### Review response (code review, 2026-07-13)
Addressed the two surviving code-review items plus polish:
- **EX-002 (survived, low):** added a `NestedInShell` story (`mainAs="div"`) with a play step asserting `queryByRole('main')` is null — closes the both-tiers gap on the landmark-dedup branch.
- **EX-001 (weakened → informational):** the `filtersPosition` variant now carries stable per-position modifier hooks (`fz-list-template__body--{left,top}`, `fz-list-template__filters--{left,top}`, mirroring `FzFocusTemplate`'s `--${chrome}`); spec + story assert the hooks instead of the raw `md:w-[300px]`/`w-full` utilities, so the rail width is a single source of truth in the `.vue`.
- **TT-001 (a11y polish):** added optional `filtersLabel` prop → `aria-label` on the filters `complementary` landmark (types + README + changeset + unit + story coverage).
- **TT-003 (a11y polish):** the `WithFilters` example toolbar title is now an `<h1>` rather than a styled `<span>`.

### Not done here (deliberately)
- **App halves (⛔ `fiscozen-app`):** migrating the ~34 BO `*List.vue` pages onto `FzListTemplate`, converging the 3 hand-rolled shoulder variants. Tracked by a separate BO card under RT-2054 (mirrors the LIB-2692 → FO-adapter split). The `Page.vue` Monster-CSS cleanup belongs to the BO **shell** migration (LIB-2692 / Phase 4), not this card.
- **Playwright/WebKit** — `FzListTemplate` has no sticky chrome, so the jsdom testing gap (§9) is less acute than for `FzAppTemplate`; Chromatic runs on the PR.

---

## Next

- 🔜 **DS PR** for LIB-2694 (this branch). PR body starts with the `Jira: [LIB-2694](…)` header; on opening the PR, move the card **Implementation → Code Review** (with confirmation).
- ⛔ **App half:** new BO card under RT-2054 for the `FzListTemplate` consumption + shoulder-variant convergence.
