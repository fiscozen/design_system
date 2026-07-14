# Operational Log 4 — `@fiscozen/layout` Page Templates Extraction (`FzDetailTemplate` / LIB-2695)

Continuation of [`page-templates-extraction-oplog.md`](./page-templates-extraction-oplog.md) (oplog-1, Phases 0–2 DS ✅), [`page-templates-extraction-oplog-2.md`](./page-templates-extraction-oplog-2.md) (oplog-2, Phase 3 `FzAppTemplate` DS ✅) and [`page-templates-extraction-oplog-3.md`](./page-templates-extraction-oplog-3.md) (oplog-3, `FzListTemplate` DS ✅). Companion execution log for the RFC [`page-templates-extraction.md`](./page-templates-extraction.md). RFC sections are cited as `§`.

This fourth log opens the **`FzDetailTemplate` stream** — the backoffice detail-page layout, **Jira LIB-2695** ("[Design System] BO detail layout", Improvement) under epic **RT-2054**. It is tracked apart from the shell templates and the list template because it is a distinct card and PR. It is the **sibling of `FzListTemplate`** (LIB-2694, oplog-3): a list page pairs a *filter* rail with a table; a detail page pairs a *summary/context* rail with the record's content.

**Legend:** ✅ done · 🔜 next · ⛔ blocked/out-of-repo · 🧭 decision required

---

## Branch / PR topology

- Branch: `feat/LIB-2695-bo-detail-template`, based on `feat/LIB-2693-page-templates-extraction` (**#414**) — a **sibling** of `feat/LIB-2692-app-template` (**#415**) and `feat/LIB-2694-bo-list-template` (**#416**), not stacked on either.
- Rationale: `FzDetailTemplate` consumes only the **region molecules** (`FzLayoutMain`/`FzLayoutAside`) + the Phase-0 `FzLayout` work, all in #414. It does **not** consume `FzAppTemplate`/`FzLayoutBottomBar` (#415) — a page-content detail layout renders *inside* the shell, it does not compose it — and it does **not** consume `FzListTemplate` (#416); the two are independent page-content siblings. Basing on #414 lets LIB-2695 merge as soon as #414 lands, independent of #415/#416 review (auto-retargets to `main`).

```
main
 └─ #414 LIB-2693 (regions + Blank + Focus)
    ├─ #415 LIB-2692 (FzAppTemplate)          — sibling
    ├─ #416 LIB-2694 (FzListTemplate)         — sibling
    └─ #4xx LIB-2695 (FzDetailTemplate)       — this stream, sibling
```

- Because the RFC §4 / README / `types.ts` export list / oplog index are shared surfaces edited by each sibling, a trivial merge conflict on those lines is expected when the siblings land; the component code itself is fully independent.

---

## 2026-07-14 — BO source reconnaissance (evidence for the API)

Verified against the real BO source (`fiscozen-app/it_fiscozen_app/backoffice/src`; reference page = *dettaglio dichiarazione IVA* → `components/vat_declaration/UserVatDeclarationDetail.vue` + `UserVatDeclarationSideBar.vue`, per the Jira reference URL):

- **The shell is out of scope** (same boundary as the list template). Nav rail, breadcrumb, footer and the `Page.vue` Monster-CSS `!important` debt are `FzAppTemplate` / Phase 4 / LIB-2692 territory. The detail template starts at the router-view content region.
- **Detail-content archetype (left→right):** a fixed-width **summary sidebar** (identity, ref-year/status badges, contacts, documents, sync/exclusion actions — `UserVatDeclarationSideBar`, `flex: 0 0 343px`) beside the **detail body** (`flex flex-col gap-16`): an optional alerts card, then `FzTabs` of `FzCard`/forms.
- **The inconsistency to normalize:** the ~15 BO `*Detail.vue` pages hand-roll this sidebar/body split **two ways** — `FzLayout leftShoulder` with a `#sidebar` slot (CU, Intrastat, LIPE, Welfare) and a raw `flex`/`d-flex` row (VAT declaration, Model770). The `leftShoulder` shoulder holds a **summary rail**, not a second navigable pane.
- **Presentation vs logic:** extractable = the rail/body split, spacing, responsive behaviour, semantic landmarks. Stays app-side = `boApi` loads, route params, per-record actions/modals, RBAC, the sidebar's own content.

---

## 2026-07-14 — `FzDetailTemplate` — DS side ✅ COMPLETE

**DS deliverable only** — migrating the BO detail pages to consume it is app-side (⛔ separate `fiscozen-app` repo).

### Decisions taken during implementation

- **Compose region molecules, not `FzLayout leftShoulder`.** Same finding as the list template: `leftShoulder` forces `100vh` mobile tracks + independent per-region `overflow-auto`; the hand-rolled detail pages deliberately scroll the document. So `FzDetailTemplate` follows the `FzFocusTemplate`/`FzListTemplate` idiom (`FzLayoutAside` + `FzLayoutMain` in a document-scroll flex). Recorded in RFC §4.
- **Name `FzDetailTemplate`, the list template's sibling.** It covers the BO *detail page* (summary sidebar + body). This is distinct from the still-optional `FzMasterDetailTemplate`, which is reserved for a genuine **split-view** master-detail (list + navigable detail pane in one view); the BO `leftShoulder` detail pages hold a *summary* rail, not a second pane, so `FzDetailTemplate` covers them. RFC §4 clarified accordingly.
- **Page-content template, not a shell.** No forced viewport height (`min-h-dvh`), no root safe-area — the shell owns the scroll container, full-height host contract (§6.2) and device safe-area. The meaningful distinction from the top-level templates, shared with `FzListTemplate`.
- **`sidebar` is slot-presence driven** (`sidebar` slot absent → single-column, full-width body). The rail is a fixed `md:w-[340px]` (matching the BO `343px` summary rail, distinct from the list template's `300px` filter rail); stacks above the body on narrow viewports, sits beside it (`md:flex-row md:items-start`, natural height) from `md` up. No rail-width prop (§10 spirit).
- **No `sidebarPosition` prop (yet).** Every real BO detail sidebar is a left rail, so a `left`/`right` variant would be speculative (§10 guardrail: avoid props no consumer needs). It is trivially additive later if a page needs a right-hand contextual panel.
- **`sidebar` is a `complementary` landmark** (`FzLayoutAside` → `<aside>`), with an optional `sidebarLabel` → `aria-label` (mirrors the list template's `filtersLabel`) so screen-reader users can name the summary rail when the page has more than one complementary region.
- **`header` slot is a plain `<div>`, not a `<header>` banner** — the shell already owns the page banner/breadcrumb; a second banner landmark would be an a11y regression. (Same as the list template.)
- **`mainAs` defaults to `'main'`** (the detail body is the page's primary content; BO has no `<main>` today → net a11y gain) with a documented `'div'` escape for nesting inside a shell that already renders `<main>`. **Follow-up:** reconcile who owns `<main>` between `FzAppTemplate` and `FzDetailTemplate`/`FzListTemplate` in the BO shell-migration card.

### Built

- `packages/layout/src/FzDetailTemplate.vue` — **new.** The layout (banner + summary sidebar + header toolbar + main body), slot-driven, `sidebarLabel` + `mainAs` props. No scoped CSS (all Tailwind); no new package dependency (imports only the region molecules + Vue).
- `packages/layout/src/types.ts` — `FzDetailTemplateProps`, `FzDetailTemplateSlots` added + exported.
- `packages/layout/src/index.ts` — exports `FzDetailTemplate`.
- `packages/layout/src/__tests__/FzDetailTemplate.spec.ts` — **new.** Rendering/structure, no forced viewport height, optional regions (banner / sidebar-as-complementary / header-not-banner), `sidebarLabel`, `mainAs` main/div, attribute forwarding onto the root, no events.
- `apps/storybook/src/stories/templates/FzDetailTemplate.stories.ts` — **new.** `Default` / `WithoutSidebar` / `NestedInShell`; play functions assert landmarks (main + named complementary), banner/header, and the shell-nesting landmark de-duplication. Example content is DS components only (`FzAlert` / `FzCard` / `FzBadge` / `FzDivider` / `FzButton` / `FzTabs`/`FzTab`).
- `packages/layout/README.md` — `FzDetailTemplate` section + attribute-forwarding note updated.
- `.changeset/layout-bo-detail-template.md` — `@fiscozen/layout` minor (additive).
- RFC §4 entry + taxonomy row added (this file's sibling doc edit).

### Verification ✅ (2026-07-14)

- `pnpm --filter @fiscozen/layout test:unit` → **125 passed** (6 files; 14 new in `FzDetailTemplate.spec.ts`).
- `npx vitest run --project=storybook FzDetailTemplate` (browser/Playwright play) → **3 passed** (`Default` / `WithoutSidebar` / `NestedInShell`).
- `pnpm --filter @fiscozen/layout build` (`vue-tsc` + vite) → **OK**; dts emitted (`dist/src/FzDetailTemplate.vue.d.ts`); bundle 35.46 kB / gzip 5.92 kB. (The `@apply` lightningcss warnings originate in `FzLayout.vue`'s scoped CSS, not `FzDetailTemplate`, which ships none.)
- Prettier clean on all touched code + README + changeset. (The RFC markdown was already non-conformant at HEAD and prettier is not in the pre-push hook; RFC additions match the surrounding prose style.)

### Not done here (deliberately)

- **App halves (⛔ `fiscozen-app`):** migrating the BO `*Detail.vue` pages onto `FzDetailTemplate`, converging the two hand-rolled sidebar/body variants. Tracked by a separate BO card under RT-2054 (mirrors the LIB-2692 → FO-adapter split, and the list template's app-half card). The `Page.vue` Monster-CSS cleanup belongs to the BO **shell** migration (LIB-2692 / Phase 4), not this card.
- **`sidebarPosition` (`left`/`right`) and a sticky sidebar** — deferred as speculative; additive later if a real page needs them.
- **Playwright/WebKit** — `FzDetailTemplate` has no sticky chrome, so the jsdom testing gap (§9) is less acute than for `FzAppTemplate`; Chromatic runs on the PR.

---

## Next

- 🔜 **DS PR** for LIB-2695 (this branch). PR body starts with the `Jira: [LIB-2695](…)` header; on opening the PR, move the card **Implementation → Code Review** (with confirmation).
- ⛔ **App half:** new BO card under RT-2054 for the `FzDetailTemplate` consumption + sidebar/body-variant convergence.
