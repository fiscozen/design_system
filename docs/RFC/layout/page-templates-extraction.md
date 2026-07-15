# RFC — `@fiscozen/layout` Page Templates Extraction

**Feature Name:** layout-page-templates
**Start Date:** 2026-07-08
**Author:** Riccardo Agnoletto
**Related components/issues:** `@fiscozen/layout` (`FzLayout`), `@fiscozen/container` (`FzContainer`); frontoffice `layouts/*` + backoffice `AppContent/Page`. Jira ticket TBD (placeholder branch).
**Status:** **Accepted** (2026-07-08). Reviewed by independent architecture + senior-engineer passes; decisions in §10 are locked. Implementation underway — **DS-side of Phases 0–2 complete** (Phase 0 unblock; Phase 1 `FzBlankTemplate` + `FzLayoutMain`; Phase 2 `FzFocusTemplate` + `FzLayoutHeader`/`Aside`/`Footer`). App migrations (Phase A, and the app halves of 2–5) remain, in the separate `fiscozen-app` repo.
**Operational log:** execution progress, per-phase decisions, and verification evidence are tracked in [`page-templates-extraction-oplog.md`](./page-templates-extraction-oplog.md) (Phases 0–2, DS side ✅) and its continuation [`page-templates-extraction-oplog-2.md`](./page-templates-extraction-oplog-2.md) (Phase 3 `FzAppTemplate` stream). The §4 bottom-bar mini-ADR is resolved in [`bottom-bar-adr.md`](./bottom-bar-adr.md) (2026-07-09), which **ungates** Phase 3.

## Summary

Turn the design-system layout layer into a standardized, presentation-only **page-template** set selected at the `<router-view>` level. Templates own the *overall page shape/chrome* (nav rail, header, main, aside, footer, bottom-bar); `FzContainer` continues to own *composition inside* the page. We extract the page templates that today live tangled inside the frontoffice and backoffice apps, following atomic-design principles.

**Non-goal:** No business logic, data fetching, store access, auth, analytics, feature flags, chat data layer, RBAC, or Capacitor calls inside the package. Those stay app-side and are injected through slots.

---

> The body below incorporates the independent architect-reviewer and senior-engineer reviews. Changes made in response to review are flagged **[R]**.

## 1. Current state (evidence — verified by both reviewers)

### Design system (`design_system`)
- `@fiscozen/layout` **already exists** (`packages/layout`, v1.0.1) as a **grid-geometry primitive**: variants `oneColumn`, `oneColumnHeader`, `twoColumns`, `leftShoulder`, `rightShoulder`, `multipleAreas`, `threeColumns` (`types.ts`). Slot-based, mostly presentational, but runs its **own** `window.resize`/`getCurrentBreakpoint()` (and *also* imports `useBreakpoints`), hardcodes `p-12` padding + `100vh` tracks in every region (`FzLayout.vue`).
- `@fiscozen/container` (`FzContainer`) is the established **in-page composition** primitive; ~357 files use it; it has **zero opinion on scroll/sticky** (`packages/container/src/FzContainer.vue`). Unchanged by this plan.
- DS conventions (`CLAUDE.md`): `Fz{PascalCase}` / `@fiscozen/{kebab}`; per-package `src/FzX.vue + types.ts + index.ts + __tests__/`; stories `apps/storybook/src/stories/{cat}/{Name}.stories.ts`; **both** unit + Storybook play tests + a11y; Changesets (`pnpm changeset`), `pnpm generate:component`. Security: never touch `.env`/`.npmrc`, never publish/version locally, add `@fiscozen/*` deps to `rollupOptions.external`.
- **[R] `breakpoints` is a shared singleton** from `@fiscozen/style` consumed by ~13 DS packages (FzTable/FzCard/FzNavbar/FzTabs/FzPagination/FzStepper/FzDatepicker…). Any module-scope mutation of it changes behavior for all of them.
- **[R] `useBreakpoints` exposes only `isGreater`/`isSmaller`/`isInBetween` booleans — there is no current-breakpoint-name accessor.** `FzLayout`'s grid keys off a breakpoint *name* string.

### Frontoffice (`fiscozen-app/frontoffice/src`)
- **Target pattern already in embryo:** `App.vue:35-38,137-139` picks `layoutOverride || route.meta.layout || 'StandardLayout'` → `<component :is="layout"><router-view/></component>`. Two shells: `StandardLayout` (~139 routes), `FocusLayout` (~18 routes).
- **Layouts mix presentation with logic**, and the **support-chat block is duplicated** (`StandardLayout.vue:197-270` ≈ `FocusLayout.vue:184-251`, ~70-90 lines; both call `useCommunications()`). **[R] The two chat copies are NOT identical** — see §6.1.
- `FocusLayout` encodes "auth page" as `route.name` branches (`:47-52`), not a template.
- **[R] `disableChat` asymmetry:** `App.vue:137` passes `:disableChat` to *both* layouts, but `StandardLayout` **never declares it** → it becomes a fallthrough HTML attribute on the root `<div>` (no `inheritAttrs:false`). Only `FocusLayout` reads it.
- Nav is an app organism (`navigation/FzNavigation.vue`: RBAC menu, logout API, Freshchat clear, Vuex). Page-title chrome = `layouts/FzLayoutTitle.vue` + `usePageTitle`. Bottom bar = `layouts/BottomBar.vue` teleporting into a target defined in `StandardLayout`, reference-counted by `useBottomBarState`.
- Atomic-design **`templates/` barrels scaffolded but empty** (`src/auth/templates/index.ts`, `src/shared/templates/index.ts` → `export {}`). `route.meta.wideLayout` **read once** (`StandardLayout.vue:107`) but **never set** anywhere.
- In-page shells (NOT router-level, stay app-side): `WizardShell.vue`, `FormPreviewLayout.vue`, `InvoiceShell.vue` (KeepAlive + nested router-view).
- **[R] Sticky/scroll correctness is a 3-way distributed contract:** (1) DOM/class rules in the layouts (`FocusLayout.vue:114-125`: no `items-center`/`min-h-full`); (2) global `html,body,#app{height:100%}` + `html{overflow-y:auto}` (`scss/main.scss:11-29`, comment says required for a sticky scrollport); (3) a **Capacitor runtime override** `document.documentElement.style.overflowY='auto'` (`main-native-platform.ts`, "burnt this cache more than once").
- **[R] Breakpoint mutation is two different patterns:** *unsafe* module-scope mutation of the shared singleton — `main.ts:21` (`breakpoints.lg`), `StandardLayout.vue:46`, `FocusLayout.vue:42`, `BottomBar.vue:18` (`breakpoints.md`); vs. the *already-safe* **local spread copy** `useBreakpoints({ ...breakpoints, lg:'1200px' })` in `FzNavigation.vue:37`. The spread is the model to follow.

### Backoffice (`fiscozen-app/backoffice/src`)
- **No layout-selection mechanism.** Chrome via route nesting: `App.vue` (bare router-view) → `AppContent.vue` (`SideBar` + `Page` + `TemporaryAccessModal`, gated on `BOUser`) → `Page.vue` (`PageHeader` + nested `<router-view>` + footer). A few top-level routes (login `router.js:2587`; `mida/sync|liq|history` `:2597-2607`) are siblings of `/` → **no shell**.
- `Page.vue:40-60` depends on legacy Bootstrap "Monster" CSS, forces `.page-wrapper` margins with `!important`, ships `<style lang="scss">` (against BO CLAUDE.md), owns dark-mode logic, reads `BOUser.full_name` in the footer.
- **[R] BO shell has none of FO's chrome:** no chat aside, no bottom bar, no content max-width card, no safe-area, desktop-only (no Capacitor), a **56px icon rail** (vs FO's 256-280px labeled rail). **[R] BO `main.scss` has NO `html,body,#app{height:100%}` / `overflow-y:auto`** — the sticky foundation FO relies on is absent.
- **`FzLayout` is consumed by exactly 17 BO files** (16 `leftShoulder` + 1 `oneColumn` `IntrastatDocumentList.vue`), *inside* page components, never at `<router-view>`.
- **[R] Prop drift — corrected facts:** BO passes `:disableViewport="true"` at **4** sites (`user/UserAgECUList.vue:141`, `f24/F24PaidList.vue:139`, `cu/UserCuList.vue:155`, `intrastat/IntrastatDocumentList.vue:206`). `FzLayout` has no such prop; it reads `isViewport` (never set by BO) → defaults falsy → renders `w-full h-full`. So `disableViewport=true` is a **dead no-op that happens to match the default** — NOT an active bug. **BO never passes `disableChat`** (`disableChat` is FO-only).

---

## 2. Design principles

1. **Presentation-only, slot-driven.** Templates render frames + regions and expose named slots. No store/API/Capacitor/feature-component imports. Allowed deps: `@fiscozen/style`, `@fiscozen/composables`, minimal frame atoms (e.g. `FzIcon`/`FzIconButton` for a toggle).
2. **Selected at the router-view level.** App maps route → template and injects content via slots. Templates never import the router.
3. **`FzContainer` owns inside-the-page composition** (unchanged).
4. **Atomic-design layering** (§3): regions (molecules) → grid primitive (organism) → page templates → app pages fill slots.
5. **Backward compatible.** Existing `FzLayout` grid API keeps working for the 17 BO consumers; templates are additive. **[R] "Additive" is a hard constraint, not a hope — see §6.3 & §10.**
6. **[R] Host contract is explicit.** Any template relying on `position: sticky` documents its prerequisites (full-height `#app`, `overflow-y:auto`) as a stated contract and/or owns a full-height root wrapper itself — it does not silently depend on invisible app-global CSS.

---

## 3. Atomic-design taxonomy

| Layer | Entity | Responsibility | Presentation-only? |
|---|---|---|---|
| **Region (molecule)** | `FzLayoutHeader`, `FzLayoutMain`, `FzLayoutAside`, `FzLayoutFooter`, `FzLayoutBottomBar` | Region wrappers owning padding, scroll (`overflow`/`scrollbar-gutter`), sticky, `max-width`, **safe-area insets** (centralizing today's ≥5 ad-hoc copies). Built **just-in-time with their first template consumer**, not as a speculative library. **[R]** | Yes |
| **Grid primitive (organism)** | `FzLayout` (existing) | Low-level responsive grid arranger. Kept for in-page master-detail (BO `leftShoulder`). API stable for 17 consumers. | Yes |
| **Page template (templates)** | `FzAppTemplate`, `FzFocusTemplate`, `FzBlankTemplate`, `FzDetailTemplate` (+ optional `FzMasterDetailTemplate`) | Full-page shells composed from regions + grid primitive. Selected at router-view level. | Yes |
| **Page (app-side)** | route components | Fill template slots with app organisms (nav, chat, title, actions, modals). Own all logic. | No (in apps) |

**Naming:** `*Template` suffix (aligns with the "templates" layer and the goal wording).

---

## 4. Target template catalog

### `FzAppTemplate` — persistent-nav application shell
Covers **FO `StandardLayout`** and **BO `AppContent`+`Page`**.
- **Slots:** `nav`, `header`/`title`, default (main), `aside`, `bottomBar`, `footer`.
- **[R] Slot props for toggles exposed on `nav`, `header` AND `aside`** (the chat toggle today lives in the nav — `StandardLayout` `@chatClick` — and in the topbar — `FocusLayout:140-156` — not in the aside): each gets `{ isDesktop, navOpen, toggleNav, asideOpen, toggleAside }` as relevant.
- **Props (presentation-only):** `hasAside?`, `hasBottomBar?`, `chrome?: 'card' | 'flat'` (card = max-width white card; flat = full-bleed), `background?`. **[R] `mainMaxWidth` and `variant='wide'` collapsed into a single content-width API** — do not ship both.
- **[R] DECIDED — one template, orthogonal props, NO `environment` prop.** The FO/BO differences (chat, bottom bar, content card, safe-area, background, rail width) are expressed as the orthogonal props above; the rail width is a function of the *injected nav content*, not the template. **Guardrail:** if during Phase 3/4 a difference genuinely cannot be expressed orthogonally, **escalate** and reconsider a second template that shares the region molecules + grid primitive — never resolve it by branching on which app calls the component (the apps are being split into separate repos per root `CLAUDE.md`).
- **[R] Bottom-bar contract (mini-ADR — ✅ RESOLVED 2026-07-09 in [`bottom-bar-adr.md`](./bottom-bar-adr.md): (a) provide/inject the target ref; (b) sticky region in the main column):** resolve BOTH facets: (a) **geometry** — with nav/aside as opaque app slots the template can't know rail widths, so either rail widths become explicit props, or the bar is full-width and the app pads it; (b) **teleport ownership** — today `TELEPORT_BOTTOM_BAR_ID='fz-layout-bottom-bar'` is app-owned (`usePageTitle.ts:31-32`) and `BottomBar.vue` teleports to it via CSS selector (soft-fails silently if unmatched). Decide: DS guarantees a stable documented ID forever, **or** `FzAppTemplate` exposes the target via a `defineExpose`d ref the app threads into its own `<Teleport :to>`. Prefer the exposed-ref form (keeps the package from owning a magic string).
- **[R] a11y ownership:** if the template owns the mobile aside overlay frame, it owns/exposes focus-trap + `aria-modal`/`role="dialog"` + Escape handling (FO sets these on the chat overlay today; must not regress).

### `FzFocusTemplate` — distraction-reduced flow shell
Covers **FO `FocusLayout`** (onboarding).
- **Slots:** `topbar`, default (centered), `aside`, `footer`. **Props:** `chrome?: 'card' | 'flat'` — makes today's implicit "auth" branch an **explicit variant**.

### `FzBlankTemplate` — full-bleed, no chrome
Covers **FO/BO auth (login)** + standalone tools (BO `MidaSync`, `CustomerInvoices`). **Slots:** default. **Props:** `align?: 'center' | 'top'`.

### `FzListTemplate` — backoffice list-page layout (**Jira LIB-2694**)
Covers the recurring **BO list page** shape (e.g. *Dichiarazioni IVA*): an optional full-width `banner`, an optional `filters` rail, an optional `header` toolbar (title/search/actions) and the list content (typically an `FzTable`). Only 6 of the ~34 BO `*List.vue` pages use `FzLayout leftShoulder` today; the other 28 hand-roll the same rail/table shape three ways (`grid-cols-4`, `flex w-[300px]`, single card) — this template converges them.
- **Slots:** `banner`, `filters`, `header`, default (list content). **Props:** `filtersPosition?: 'left' | 'top'`, `mainAs?: 'main' | 'div'`.
- **[R] Composes the region molecules, not `FzLayout leftShoulder`.** The BO reconnaissance (2026-07-13) found `leftShoulder` forces `100vh` mobile tracks + independent per-region `overflow-auto` scroll — exactly what the hand-rolled pages avoid by scrolling the document. So `FzListTemplate` follows the `FzFocusTemplate` idiom (region molecules + document-scroll flex). This **supersedes the provisional name `FzMasterDetailTemplate`**: the BO `leftShoulder` shoulder holds *filters*, not a detail pane, so "list layout" is the accurate framing (matches the Jira wording).
- **[R] Page-content template, not a shell.** It renders *inside* the app shell (`FzAppTemplate`, LIB-2692 / Phase 4), so — unlike the top-level templates — it does **not** own a viewport height or root safe-area (the shell does). `mainAs` defaults to `main` (the list is the page's primary content; a net a11y gain for BO, which has no `<main>` today) with a documented `'div'` escape for shell nesting. **Guardrail:** the who-owns-`<main>` reconciliation between `FzAppTemplate` and `FzListTemplate` is a follow-up for the BO shell-migration card.
- A true master-detail (list + detail pane) wrapper over `FzLayout leftShoulder` remains a possible *later* addition for the genuine split-view BO pages; `FzLayout leftShoulder` keeps working meanwhile.

### `FzDetailTemplate` — backoffice detail-page layout (**Jira LIB-2695**)
Covers the recurring **BO record-detail page** shape (e.g. *dettaglio dichiarazione IVA*): a persistent **summary/context sidebar** (the record's identity, status, meta and actions) beside the **detail body** (tabs/cards/forms), with an optional full-width `banner` and an optional `toolbar` (title/actions). It is the **sibling of `FzListTemplate`** (LIB-2694): a list page pairs a *filter* rail with a table; a detail page pairs a *summary* rail with the record's content.
- **Slots:** `banner`, `sidebar`, `toolbar`, default (the detail body). **Props:** `sidebarLabel?` (accessible name for the sidebar `complementary` landmark), `mainAs?: 'main' | 'div'`. The `toolbar` slot is a plain container, deliberately **not** a `<header>`/banner landmark — named `toolbar` (not `header`) so it does not read as the shell's banner region.
- **[R] Composes the region molecules, not `FzLayout leftShoulder`** — same reconnaissance finding as the list template. The BO detail pages that use `leftShoulder` (CU, Intrastat, LIPE, Welfare) inherit its `100vh` mobile tracks + independent per-region scroll, whereas the hand-rolled ones (VAT declaration, Model770) scroll the document. So `FzDetailTemplate` follows the `FzFocusTemplate`/`FzListTemplate` idiom (region molecules + document-scroll flex): the summary rail (`FzLayoutAside`, `md:w-[340px]`) beside `FzLayoutMain`, stacking above on mobile.
- **[R] Page-content template, not a shell.** It renders *inside* the app shell (`FzAppTemplate`, LIB-2692 / Phase 4), so — like `FzListTemplate` — it does **not** own a viewport height or root safe-area (the shell does). `mainAs` defaults to `main` with a documented `'div'` escape for shell nesting; the who-owns-`<main>` reconciliation between `FzAppTemplate` and `FzDetailTemplate` is a follow-up for the BO shell-migration card.

### `FzMasterDetailTemplate` (optional, later)
Thin semantic wrapper over `FzLayout leftShoulder` for a genuine **split-view** master-detail (list + navigable detail pane in one view). Note the BO `leftShoulder` *detail* pages hold a **summary sidebar**, not a second navigable pane — so `FzDetailTemplate` (summary rail + body) covers them, just as `FzListTemplate` covers the *filter*-rail lists; this template remains a possible *later* addition only for the true split-view case. `FzLayout leftShoulder` keeps working meanwhile.

*Out of package (stay app-side):* `WizardShell`, `FormPreviewLayout`, `InvoiceShell`.

---

## 5. Presentation vs. logic boundary

| Concern | Today | Target |
|---|---|---|
| Page frame / grid / regions | tangled in app layouts | **→ package** |
| Safe-area insets | ad hoc ×5 | **→ package** regions |
| Responsive nav/aside collapse **frame** | app layouts | **→ package** (frame only; toggles via slot props on nav/header/aside) |
| Bottom-bar target + geometry | `StandardLayout` + `BottomBar` + `useBottomBarState` | **per §4 ADR**; reference-count composable stays app-side initially |
| Support chat (data + markup) | duplicated in both FO layouts | **stays app-side** → single `SupportChatPanel.vue` organism into `aside` slot |
| Navigation menu (routes/RBAC/logout) | `FzNavigation`/`SideBar` | **stays app-side** → `nav` slot |
| Page title / back / "Nuova" | `FzLayoutTitle` + `usePageTitle` | **stays app-side** → `header` slot |
| Global modals, notices | FO `AppContent` | **stays app-side** |
| Auth/analytics/boot/flags/dark-mode | `App.vue`, BO `Page.vue` | **stays app-side** |
| Capacitor back-button/native bootstrap + WebView overflow override | `main-native-platform.ts` | **stays app-side** |
| Global `html,body,#app` height/overflow reset | `scss/main.scss` (FO only) | **stays app-side**, but becomes a **documented template prerequisite**; **[R] BO must add it before Phase 4** |

---

## 6. Correctness deep-dives (from reviews)

### 6.1 `SupportChatPanel` extraction — the two copies are NOT identical
Before writing the component, produce an explicit **prop table** covering every delta, so behavior is *designed*, not inherited from whichever file is copied first:
- **default-open:** `StandardLayout` opens on desktop; `FocusLayout` starts closed.
- **Escape-to-close:** exists only in `StandardLayout.vue:121-129,143-151` (mobile); `FocusLayout` has none.
- **ARIA:** `StandardLayout.vue:191-196` sets `role="dialog"`/`aria-modal`/`aria-label`; `FocusLayout` sets none.
- **mobile slide-in animation:** `.mobile-sidebar-right` keyframe only on `StandardLayout:296-312`.
- **safe-area padding objects:** both have them but differ.
- **`disableChat` semantics (decision point):** decide explicitly whether `FzAppTemplate`/StandardLayout pages *gain* real `disableChat` support (behavior change — today it's silently ignored via attribute fallthrough) or preserve status-quo non-support. Do not let the copy order decide this.

### 6.2 Sticky/scroll — reproduce the full contract or it breaks on WebKit
The contract is 3-way distributed (§1 FO). The template must either own a full-height root wrapper or **document** the `#app{height:100%}` + `overflow-y:auto` prerequisite. **BO lacks this global reset entirely** and is desktop-**Safari** (WebKit) capable → Phase 4 must add the reset and explicitly verify sticky nav/header on Safari. The `overflow-x-clip` vs `-hidden` distinction (`StandardLayout.vue:87-89`) is load-bearing for `FormPreviewLayout`'s sticky preview and must be preserved in the region CSS.

### 6.3 `FzLayout` refactor — NOT free, NOT purely additive
- **Padding:** today every region is `p-12`. Making padding **opt-in** would strip padding from all 17 BO consumers (visual regression) → keep padding **opt-out** (default on; prop to disable), or explicitly budget touching all 17 files. Do not claim "additive" while flipping the default.
- **`getCurrentBreakpoint()` → `useBreakpoints`:** not a drop-in — `useBreakpoints` has no current-name accessor, and the grid CSS keys off a name (`fz-layout__leftShoulder--lg`). Either add a `current()` to the composable (descending-priority, boundary-parity with the old `>=`) or rework the grid to Tailwind responsive classes. This is real, test-worthy work — not a Phase-0 one-liner.

### 6.4 Breakpoint fix — new token, never overload `md`; add a regrowth guard
- Introduce a **new named token** in `@fiscozen/style` (e.g. a distinct desktop breakpoint); **never** reassign `md`/`lg` (13 packages read them). Sequence consumption so dependent packages don't shift.
- **Interim safe pattern** = `FzNavigation`'s local spread `{ ...breakpoints, lg:'1200px' }` (no singleton mutation). Migrate the 4 unsafe sites to this or to the new token.
- **Add a CI/ESLint rule** forbidding `breakpoints.<key> =` assignments outside `@fiscozen/style` source, so the mutation can't regrow across a multi-month, ~30-engineer rollout.

### 6.5 Prop-drift reconciliation — pick the polarity and lock it with a test
Reconciling `disableViewport`→`isViewport` must map **`disableViewport:true` → `isViewport:false`** to preserve today's accidental `w-full/h-full` on the 4 BO pages. Add a unit test asserting those 4 call sites render byte-identical output before/after (they have no coverage today). Also sweep the FO `App.vue` `disableChat` fallthrough in the same reconciliation pass.

---

## 7. Router integration
- **FO:** keep `meta.layout` → map → `<component :is>`. Change map values to thin adapters that render the DS templates with app content in slots (`StandardLayout.vue` becomes a ~30-line adapter). **No route files change.** Introduce the content-width variant where `wideLayout` was intended (and delete the dead flag).
- **BO:** lowest-risk = refactor `AppContent.vue`/`Page.vue` internals to compose the app-shell template (SideBar→`nav`, PageHeader→`header`, nested `<router-view>`→default, footer→`footer`) **without touching the router**. Neutralize Monster `.page-wrapper` CSS + remove `<style>` blocks. Optional later: add `meta.layout` + selector for `FzBlankTemplate` login/tools.

---

## 8. Migration phases (staged, cross-repo) — **[R] reordered**

> **Execution status is tracked in the [operational log](./page-templates-extraction-oplog.md).** As of 2026-07-08: DS side of Phase 0 ✅, Phase 1 ✅ (`FzLayoutMain` + `FzBlankTemplate`) and Phase 2 ✅ (`FzLayoutHeader`/`Aside`/`Footer` + `FzFocusTemplate`) complete in the DS repo. The DS side of Phase 3 (`FzAppTemplate`) is gated on the §4 bottom-bar ADR; all app migrations (Phase A + the app halves of Phases 2–5) require the separate `fiscozen-app` repo.

Cross-repo sequencing: `@fiscozen/layout` is separately published. Each DS-touching phase = DS PR → changeset (minor) → merge/publish → app PR bumps dep + migrates. Fewest cleanly-cleaving stacked PRs per repo.

- **Phase A — `SupportChatPanel` extraction (FO app-only, no DS/cross-repo dep). [R] moved first.** Build the single chat organism from the §6.1 prop table; drop it into both existing FO layouts' `aside` region. Kills ~90 lines of duplication with zero DS/version risk. Independently shippable + reversible.
- **Phase 0 — Unblock (DS).** New breakpoint token + CI guard (§6.4); reconcile `FzLayout` prop drift with the byte-identical test (§6.5); `FzLayout` refactor scoped honestly (§6.3, padding opt-out, breakpoint-name work). Stories/tests green. No app behavior change (verified, not assumed).
- **Phase 1 — `FzBlankTemplate` + first regions (DS).** Build regions **just-in-time** for this template. Unit + Storybook play + a11y + Chromatic. Publish minor.
- **Phase 2 — `FzFocusTemplate` + FO migration.** DS: template with `chrome` variant. App: `FocusLayout.vue` → adapter; auth becomes explicit `chrome="flat"`. Verify onboarding + login/forgot-password, desktop + mobile, **including WebKit**.
- **Phase 3 — `FzAppTemplate` + FO migration.** Requires the §4 bottom-bar ADR resolved first. App: `StandardLayout.vue` → adapter (nav + `SupportChatPanel` + bottom-bar via slots), content-width variant. Verify dashboard, invoice sub-pages (bottom bar), mobile overlays, safe-area on device, **sticky on WebKit/iOS**.
- **Phase 4 — BO shell migration.** **Prerequisite: add the `html,body,#app{height:100%}`+`overflow-y:auto` reset to BO `main.scss`.** Refactor `AppContent`/`Page` onto the app-shell template; remove Monster `!important` + `<style>`; reconcile the 4 `disableViewport` sites. Verify home, a user detail, a `leftShoulder` page, login (no-shell), dark-mode, **and sticky nav/header on desktop Safari**.
- **Phase 5 — Cleanup & convergence.** Populate/delete the empty `templates/` barrels; decide `FzMasterDetailTemplate`; optional BO `meta.layout`; MDX docs; confirm the dead `wideLayout` reads are gone.

---

## 9. Testing & release
- Per DS rules: each new component ships **unit + Storybook play + a11y**, meets coverage thresholds; **[R]** but jsdom class-presence assertions (as in today's `FzLayout.spec.ts`) **cannot** catch sticky-degradation, safe-area, or `overflow-clip` behavior. So: add **Playwright against the WebKit engine** for sticky-header + chat-overlay scenarios (Chromium-only devcontainer runs will miss the exact bug class), plus **Chromatic** visual diffs on DS PRs.
- Each DS phase: **Changeset** (minor), `pnpm release:check:pending` for cascade. No local version/publish.
- App-side: byte-identical unit test for the 4 BO `disableViewport` sites (Phase 0); adapter unit tests; browser verification via the **devcontainer prod-build URL** (`https://app.fiscozen.internal/app/`), not localhost.

---

## 10. Risks & decisions
- **[R] DECIDED — everything in `@fiscozen/layout`** (primitive + regions + templates in one package, per original scope). Because FO/BO bump the dependency independently and are being split into separate repos, this decision **requires an enforced additive-only + documented-deprecation policy**: template prop/slot changes must be additive; breaking changes to the shared app-shell template are prohibited without a coordinated FO+BO migration. Make this policy explicit in the package README/CONTRIBUTING and, ideally, back it with the DS `release:check` tooling so a would-be breaking change is surfaced before publish. This is now a hard project constraint, not a preference.
- **[R] DECIDED — one app-shell template with orthogonal props** (§4). The Phase 3/4 guardrail stands: escalate rather than add an app-branching switch if a difference resists orthogonal modeling.
- **Chat parity** (§6.1), **sticky/WebKit** (§6.2), **bottom-bar ADR** (§4), **breakpoint blast radius + regrowth** (§6.4), **prop-drift polarity** (§6.5) — all now have explicit mitigations above.
- **BO Monster CSS removal** risks regressions elsewhere; audit what else `scss/monster` styles before deleting overrides.
- **CODEOWNERS:** declare DS-package + cross-app template ownership so PR review routing is correct (root `CLAUDE.md`).

## 11. Backward compatibility
`FzLayout` grid variants stay exported; behavior unchanged for the 17 BO consumers **provided** padding stays opt-out and the prop-drift reconciliation preserves polarity (§6.3, §6.5). Templates are additive. App-local layout files become thin adapters, so `route.meta.layout` strings and page code stay valid.

---

## Appendix — review provenance

This RFC was reviewed by two independent passes before this draft was committed:
- **Architecture review** — verdict *approve-with-changes*. Caught a factual error (backoffice never passes `disableChat`), flagged the `environment` prop as two-shells-in-one, the non-additive `FzLayout` padding/breakpoint refactor, the bottom-bar rail-width leak, the breakpoint blast radius across ~13 packages, and single-package coupling.
- **Senior-engineer review** — verdict *approve-with-changes*. Detailed the chat-copy behavioral deltas, the 3-way sticky contract (incl. the Capacitor override) and BO's missing global reset, the teleport soft-fail contract, the breakpoint mutation-vs-spread distinction + regrowth guard, the prop-drift polarity test, and the jsdom/WebKit testing gap.

All actionable items are folded into §§4, 6, 8, 9, 10 above.
