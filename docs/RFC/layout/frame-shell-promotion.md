# RFC — promoting the backoffice outer frame to `@fiscozen/layout`

**Feature Name:** frame-shell-promotion (`FzFrameTemplate`)

**Start Date:** 2026-09-01

**Author:** Riccardo Agnoletto

**Related components/issues:** LIB-2939 (spike, [it.fiscozen.app#16099](https://github.com/fiscozen/it.fiscozen.app/pull/16099))
· epic RT-2054 · `FzAppTemplate` · `FzThreeColumnsTemplate` · `FzSidebarTemplate` · `@fiscozen/navbar`
· RFC [`page-templates-extraction.md`](./page-templates-extraction.md) §4/§6.2/§8 Phase 4

---

## Summary

The LIB-2939 spike built `BackofficeFrame.vue` in the app repo: a `h-dvh`, clipping app shell
(nav rail + 48px toolbar + page slot + 400px tools drawer) whose real contribution is not the
chrome but a **switchable height contract** on its content region — `scroll` (the region is the
app's single scroll container) or `bounded` (the region clips and hands a *definite* height down).
That second mode is the missing host `FzThreeColumnsTemplate` has never had.

The spike's recommendation — promote it to `@fiscozen/layout` as a new shell — is **correct, and
for the reason it gives**. This RFC accepts it and specifies what promotion actually costs, because
the spike component as written cannot ship as a DS layout: it fails four of this package's own
rules (manifest naming, compose-only reachability, region composition, `Fz…Slots` typing), carries
three latent defects (an ignored `aria-label`, a `v-if` that destroys drawer state, a hard-capped
toolbar), leaves the one functional regression it found (`window.scrollTo`) unaddressed, and cannot
be verified at all in jsdom — the whole value proposition is a computed-height chain.

Net: **ship `FzFrameTemplate` at `@fiscozen/layout@1.4.0`**, additive, `surfaces: ["BO"]`, and use
it to close two documented gaps (`FzThreeColumnsTemplate.composeOnly.safe → true`, and its empty
`nestWithin`). Five items are spun out as separate cards; one — the `FzNavbar` hardcoded shadow —
blocks visual fidelity and must land alongside.

## Motivation

Three independent reasons, in descending order of weight.

**1. The bounded-height host is a DS-shaped gap, not an app-shaped one.** `layouts.json` already
says so out loud against `FzThreeColumnsTemplate`:

> `composeOnly.safe: false` — *"it fills its parent's height and requires a bounded-height ancestor,
> which a compose-only consumer cannot create: FzContainer exposes no height/viewport prop […] and
> no host is verified yet, so `nestWithin` is deliberately empty"*

Every shell we ship is `min-h-dvh` + document scroll — an *indefinite*-height ancestor. So today the
DS ships a layout it also tells consumers they cannot legally host. The spike is the missing host,
and the evidence it produced is exactly the evidence the manifest asks for: on
`/approvazioni/registra-documento` the template resolved to a definite 934px with zero JavaScript,
and `ApproveDocumentPage.vue`'s hand-rolled `window.innerHeight - rect.top` + resize listener was
deleted.

The same gap shows up inside this repo: `FzThreeColumnsTemplate.stories.ts:81` wraps the template in
`<div class="h-[600px] twp">`. A DS story reaching for a raw utility class is the tell that no DS
component can express the requirement — a violation of our own class-free story rule, forced by a
missing layout.

**2. Tiering.** `BackofficeFrame` is a *template*, authored in an app repo, carrying Tailwind
classes. The BO's `CLAUDE.md` mandates Tailwind-first; LIB-2906 makes templates compose-only; the
plugin's `componentPathPattern` covers `frontoffice/src/` only, so nothing enforced either rule.
Promotion removes the contradiction rather than picking a side of it.

**3. Two traps disappear for free.** The spike's §4.3 finding — *"the Tailwind `content` array is an
explicit ~120-file allowlist, a new file under `src/layouts/` produces no CSS"* — evaporates:
`backoffice/tailwind.config.js:20` already scans `./node_modules/@fiscozen/*/src/**`. And the
`chrome`/`contentHeight` route wiring stays app-side where it belongs, so the DS surface stays
presentation-only (RFC §5).

## Detailed design

### 1. Name — `FzFrameTemplate`

Non-negotiable constraint: **the name must end in `Template`.** `layouts.json` declares
`exportPattern: "Template$"`, and both the manifest parity test
(`layouts.manifest.spec.ts:exportedLayoutNames`) and the plugin's drift check
(`refresh-ds-layouts.sh`) filter the barrel by that pattern. An export named `FzBackofficeFrame`
would be invisible to *both* — manifest drift with no failing test, which is the one failure mode
this package's tooling exists to prevent.

`FzFrameTemplate` matches the vocabulary the team already uses for it ("the frame"), and collides
with nothing. Considered and rejected: `FzWorkspaceTemplate` (collides with
`FzThreeColumnsTemplate`'s own "review workspace page" description — the shell and its bounded child
would share a noun), `FzConsoleTemplate` (collides with `FzSidebarTemplate`'s "internal-tool /
console app"), `FzShellTemplate` (all four shells are shells).

### 2. Public API

Aligned with `FzAppTemplate` wherever the semantics match, so a page can move between the two shells
without renaming slots. Divergences are deliberate and listed.

```ts
type FzFrameTemplateProps = {
  /** Height contract handed to the content region. */
  contentHeight?: 'scroll' | 'bounded'      // default 'scroll'
  /** 'card' = the inset white surface; 'flat' = full-bleed. */
  chrome?: 'card' | 'flat'                  // default 'card'
  /** Page background behind the chrome. */
  background?: 'page' | 'transparent'       // default 'page'  (background/white-smoke)
  hasAside?: boolean                        // default false
  navLabel?: string
  asideLabel?: string
}

type FzFrameTemplateToggles = {             // shape-compatible with FzAppTemplateToggles
  isDesktop: boolean
  asideOpen: boolean
  toggleAside: (force?: boolean) => void
}

type FzFrameTemplateSlots = {
  nav?(p: FzFrameTemplateToggles): any
  header?(p: FzFrameTemplateToggles): any
  default?(): any
  aside?(p: FzFrameTemplateToggles): any
}
```

Plus `v-model:asideOpen` (`defineModel<boolean>`).

Decisions inside that signature:

- **`contentHeight: 'scroll' | 'bounded'`** — keep the spike's names. `bounded` is already the
  manifest `kind` of the layouts that need it, so `contentHeight="bounded"` + `kind: "bounded"` read
  as one contract. This is the prop the whole RFC exists for; it goes first in `keyProps`.
- **`chrome` defaults to `'card'`**, not the spike's `'flat'`. `'flat'` was a *migration* default for
  557 legacy components that draw their own containers; the DS default should be the design.
  BO's `AppContent.vue` already computes `chrome` per route and must default its own mapping to
  `flat` — an app-side one-liner, not a DS default.
- **`background` is a prop, not a fall-through class.** `FzAppTemplate` and `FzSidebarTemplate` each
  carry a `composeOnly` gap that reads *"the page background is reachable only through a fall-through
  `class` on the template root"*. Shipping a new shell with the same gap would be knowingly
  reproducing a known defect; two enum values cost nothing and let this entry ship
  `composeOnly: { safe: true }`.
- **`aside`, not `drawer`.** Same role as `FzAppTemplate`'s aside (a persistent cross-page tool
  surface — FO support chat there, AI chat + user messages here), so it gets the same slot name,
  `hasAside`, `asideLabel`, `v-model:asideOpen` and `toggleAside`. The *responsive treatment*
  differs (persistent 400px desktop column vs. full-screen modal drawer below the breakpoint) and
  must be stated in the component doc and in `notWhenToUse`, because the shared name otherwise
  invites the wrong assumption.
- **`header`, not `toolbar`.** The strip carries app-level wayfinding (back, breadcrumb, global
  search) — site-oriented content, i.e. a `banner`. It composes `FzLayoutHeader`, which renders that
  landmark. `FzThreeColumnsTemplate` already documents its own header row as *"a plain container, NOT
  a `<header>` banner landmark: the app's own page header owns the banner"* — this is that owner.
- **No `footer`, no `bottomBar`, no `contentWidth`.** The design has none and additive props are
  cheap later. Adding them now means shipping untested regions.

### 3. Structure

```
div.fz-frame-template            h-dvh overflow-hidden flex flex-col lg:flex-row   [background]
├─ nav.fz-frame-template__nav    w-full shrink-0 lg:h-full lg:w-auto               v-if slots.nav
│                                (a real <nav>, aria-label=navLabel)
├─ div.fz-frame-template__col    flex min-h-0 min-w-0 flex-1 flex-col
│  ├─ FzLayoutHeader             min-h-[48px] shrink-0                             v-if slots.header
│  └─ FzLayoutMain               min-h-0 flex-1 p-8
│     │                          scroll  → overflow-y-auto
│     │                          bounded → flex flex-col overflow-hidden
│     └─ div…__surface           card    → bg-core-white border-1 border-grey-200 rounded-xl border-solid
│                                scroll  → min-h-full
│                                bounded → flex min-h-0 flex-1 flex-col overflow-hidden
│                                <slot />
└─ FzLayoutAside                 hidden lg:flex w-[400px] shrink-0 p-8             v-if hasAside && slots.aside
                                 v-show asideOpen                                 (aria-label=asideLabel)
```

Two structural rules of this package are load-bearing here and the spike missed both: region
molecules are composed *by* the layout (`FzLayoutHeader` / `FzLayoutMain` / `FzLayoutAside`, sized by
fall-through class — the documented, `kind: region` arrangement), and the surface must not be a raw
`<main>`. `FzLayoutMain` also brings `safeArea` for free (see §5.4).

The `min-h-0` on `…__col` is not cosmetic: it is a flex item on the column axis below `lg` and the
row axis above it, and its automatic minimum size otherwise defeats the region's scroll/clip
contract on whichever axis is main. Keep the spike's comment.

### 4. Breakpoint — `lg` (1024px), CSS-first

`FzAppTemplate` switches at `desktop` (1200px) via `useMediaQuery`. This shell switches at `lg`
(1024px), because the *injected nav* does: `FzNavbar`'s own default threshold is `lg`, `SideBar`
reads `isGreater('lg')`, and the deleted `Page.vue` swapped `margin-left: 56px` for `margin-top` at
the same point. A frame that disagrees with its nav produced the spike's 120px shrink-wrapped stub.

The row/column switch and the aside's desktop-only visibility are **pure CSS** (`lg:flex-row`,
`hidden lg:flex`) — no JS, no resize listener, no hydration mismatch. `useMediaQuery` is used *only*
to compute the `isDesktop` slot prop, which exists so injected chrome can branch (it is part of
`FzAppTemplateToggles` and consumers rely on it).

That the DS now has two competing "desktop" thresholds is a real inconsistency. It is not this
RFC's to fix (RFC §6.4 already flagged breakpoint hygiene); it must be *documented* on both shells
so the next reader finds a decision, not drift.

### 5. Defects to fix on promotion

Five, found reviewing the spike source against this package's own precedents. All are cheap; none
touches the height contract.

**5.1 `aria-label` on a generic `div` is ignored.** `BackofficeFrame.vue` renders
`<div v-if="slots.nav" :aria-label="navLabel">`. A `div` with no role exposes no accessible name to
AT, so `navLabel` is dead code and the page has no navigation landmark. `FzAppTemplate` gets this
right with a real `<nav>`. Fix: `<nav>`, per §3.

**5.2 The aside's `v-if` destroys the state the drawer exists to preserve.**
`showDrawer = hasDrawer && !!slots.drawer && drawerOpen` gates a `v-if`, so closing the drawer
unmounts it. The spike's headline claim — *"an AI chat in the drawer keeps its transcript across
navigation with no global store"* — holds across *route* changes but not across a close/open cycle,
which is the more frequent interaction. `FzThreeColumnsTemplate` already documents the fix and the
reason: `v-show` (not `v-if`) *"preserves DOM identity so scroll position and any
IntersectionObserver a consumer wires against this content stay valid"*. Same treatment here.

**5.3 `h-48` on the toolbar is a cap, and caps clip.** `FzThreeColumnsTemplate`'s header carries a
comment written after making this exact mistake: *"`min-h-[64px]` is a floor, NOT a cap […] a hard
`max-h` was wrong here — max-height caps the box size but does not clip, so oversized slot content
would bleed past the header into the body region below."* A fixed `h-48` clips instead of bleeding —
different symptom, same defect. Use `min-h-[48px] shrink-0`.

**5.4 No safe-area handling, and `h-dvh` + clipping is hostile on iOS.** `FzAppTemplate` pays
directional `env(safe-area-inset-*)` per region precisely because each region can bleed under a
different edge. The spike frame pays none — fine for a desktop-only BO, wrong the moment the shell
is offered to the FO, and the spike's *"the frontoffice gets the same capability for free"* is its
weakest claim: a clipping `h-dvh` root interacts badly with the iOS on-screen keyboard and with
Capacitor's `documentElement.style.overflowY` runtime override (RFC §1, *"burnt this cache more than
once"*). Therefore: add directional insets to nav / header / aside now (they are correct on desktop
and cost nothing), pass `safeArea` through `FzLayoutMain`, and **ship `surfaces: ["BO"]`**. FO
readiness is a later card gated on a device verification, not a paragraph in a manifest.

**5.5 `useSlots()` + inline `defineProps` cannot satisfy the manifest.**
`layouts.manifest.spec.ts` derives the expected slot list by parsing a `type Fz<Name>Slots` block out
of `types.ts`. Props and slots go in `types.ts` with JSDoc, `defineSlots<FzFrameTemplateSlots>()`,
`withDefaults(defineProps<FzFrameTemplateProps>())` — the convention every other layout follows.

### 6. The scroll container must be exposed — `FZ_PAGE_SCROLL_TARGET`

This is the one item the spike identified and explicitly did not do (*"the fix is for the frame to
`provide()` its scroll region […] Not done here"*), and it is the only **functional regression** in
the promotion. Under `contentHeight="scroll"` the window no longer scrolls, so:

- `window.scrollTo(0, 0)` silently no-ops. The spike grepped `backoffice/src`, `vue_common/src` and
  the installed `@fiscozen/*` sources and found exactly one call site (`TaxDeclaration.vue:186`) —
  a genuinely small blast radius, and worth trusting.
- **Browser scroll restoration on back/forward degrades.** BO's router configures no
  `scrollBehavior` at all (`router.js:2459`, `createRouter({ history: createWebHistory(BASE_URL) })`),
  so restoration on popstate is currently the browser's native behaviour — which restores the
  *document* scroller only, never an inner element. Once the region owns the scroll, back-navigation
  loses its position. The spike did not test this. Recovering it means adding a `scrollBehavior` that
  writes to the injected region, i.e. app-side router work that has not been scoped.
- `scrollIntoView` call sites are unaffected — they walk to the nearest scrollable ancestor either
  way.

DS side, mirroring the `FZ_BOTTOM_BAR_TARGET` precedent exactly (namespaced string cast to
`InjectionKey`, per the repo's provide/inject convention — never a module-scope `Symbol`):

```ts
export const FZ_PAGE_SCROLL_TARGET = '@fiscozen/layout/pageScrollTarget' as unknown as InjectionKey<
  Readonly<Ref<HTMLElement | null>>
>
```

`null` until the region mounts and when no shell is an ancestor, so a miss is debuggable rather than
a silent soft-fail. The element is provided in **both** modes and its identity survives a
`contentHeight` flip (same DOM node); the doc must state that it is the page scrollport only under
`contentHeight="scroll"` — in `bounded` mode it clips and its `scrollTop` stays 0.

App side, as a follow-up card on the app repo: inject it in the shell composition and wire
`scrollBehavior` / the one `window.scrollTo`.

### 7. `twp` — resolved by construction, and it must stay resolved

The BO scopes Tailwind Preflight to `.twp`
(`tailwindcss-scoped-preflight`, `isolateInsideOfContainer('.twp')`). A DS component obviously
cannot emit `twp`, and the spike's mitigation — `twp` on the chrome regions only, *never* on an
ancestor of `<router-view>` — does not survive the move as written.

It does not need to. Preflight is a *base-element reset*; utility classes work with or without it.
The frame's own chrome is flex/size/colour utilities plus **explicit** `border-solid` (which is
exactly why `FzThreeColumnsTemplate` writes `border-solid` too — without Preflight the initial
`border-style` is `none`). So:

- the DS shell is Preflight-independent and carries no `twp`;
- the **app puts `twp` on its own slot-content roots** (`SideBar`, `FrameToolbar`, the tools drawer)
  — where it already belongs, since that is where the app's own elements are;
- the frame's page slot never gets Preflight, which is the invariant with the app-wide blast radius.

This must be written into the component doc *and* the README, as a rule about what may later be
added to the shell: no shell style may depend on Preflight.

### 8. Manifest, and the two gaps it closes

New entry (abbreviated), placed **first** in `layouts[]` for BO ordering:

```json
{
  "name": "FzFrameTemplate",
  "kind": "shell",
  "heightContract": "owns-viewport",
  "surfaces": ["BO"],
  "since": "1.4.0",
  "whenToUse": "The backoffice application frame: a persistent icon nav rail, a slim app-level toolbar (back / breadcrumb / global search), the page, and an optional 400px tools panel that survives navigation. The only shell whose content region can hand a DEFINITE height to the page inside it — set contentHeight=\"bounded\" for a page that fills the frame and scrolls its own regions (FzThreeColumnsTemplate), leave it \"scroll\" for a page that grows and scrolls as one.",
  "notWhenToUse": "Not FzAppTemplate: that shell is min-h-dvh with document scroll and a modal-drawer aside on mobile — the model this one inverts. Not FzSidebarTemplate. Its aside is a persistent desktop-only 400px column, never a modal drawer.",
  "slots": ["nav", "header", "default", "aside"],
  "keyProps": ["contentHeight", "chrome", "background", "hasAside", "navLabel", "asideLabel"],
  "composeOnly": { "safe": true }
}
```

Note that the plugin's generated shell table renders only
`name / surfaces / whenToUse / notWhenToUse / slots / keyProps` — **not** `heightContract` and not
nesting. So `contentHeight` has to earn its place at plan time inside `whenToUse` and first in
`keyProps`. That is why the sentence above is long.

Then, on `FzThreeColumnsTemplate`:

```json
"nestWithin": ["FzFrameTemplate"],
"whenNested": {
  "props": { "mainAs": "div" },
  "note": "the host must be FzFrameTemplate with contentHeight=\"bounded\" — that is what supplies the definite height this layout requires; inside a min-h-dvh shell (FzAppTemplate / FzSidebarTemplate) it collapses to zero"
},
"composeOnly": { "safe": true }
```

The schema has no field for "the host must be configured like this" (`whenNested.props` describes
props on *this* layout), but `whenNested.note` **is** rendered into the generated "When nested"
column, so the constraint reaches consumers today with zero plugin change. Proposing an optional
`whenNested.hostProps` to the plugin schema is a good follow-up — the schema is
`additionalProperties: false` and the generator only reads fields it knows, so an invented field
would be silently ignored, i.e. worse than the note.

`FzListTemplate` / `FzDetailTemplate` gain `FzFrameTemplate` in `nestWithin` once §9 covers them.

### 9. Testing — the part that cannot be done in jsdom

`layoutComposition.spec.ts` runs in jsdom, which has **no layout engine**: `clientHeight` is 0 and
`getComputedStyle` returns no resolved box. The entire proposition of this shell — *the content
region resolves to a definite height* — is therefore unverifiable there. Splitting accordingly:

| Tier | Runner | Asserts |
| --- | --- | --- |
| `FzFrameTemplate.spec.ts` | vitest / jsdom | slots render; `<nav>` + `aria-label`; single `<main>`; `v-show` (not `v-if`) keeps the aside mounted when closed; `v-model:asideOpen` + `toggleAside`; `contentHeight`/`chrome`/`background` class matrix; `FZ_PAGE_SCROLL_TARGET` is provided and non-null after mount |
| `layoutComposition.spec.ts` | vitest / jsdom | the three `nestWithin` pairs: exactly one `main` landmark with `mainAs="div"`, two without (the existing "documents why `whenNested` is not optional" case), nested rails keep their accessible names |
| `FzFrameTemplate.stories.ts` play fn | **vitest browser mode, real Chromium** (`@vitest/browser-playwright`, already configured in `apps/storybook/vitest.config.ts`) | **the height chain.** `bounded`: `__surface.clientHeight > 0` and equals main's content box, nested `FzThreeColumnsTemplate` computes a non-zero height, its right column scrolls independently (`scrollHeight > clientHeight`), `window.scrollY === 0`. `scroll`: region `scrollTop` moves, `document.scrollHeight === innerHeight`. Both at ≥1024 and <1024 |

The browser tier is not optional polish — it is the only tier that can catch a regression to the
zero-height collapse this shell exists to prevent.

Also in this change: rewrite `FzThreeColumnsTemplate.stories.ts` to nest inside `FzFrameTemplate`
with `contentHeight="bounded"` and drop the `<div class="h-[600px] twp">` wrapper. The story becomes
both the documentation of the pair and the class-free-story rule satisfied.

### 10. Release

Additive only — new component, new export, new injection key, new manifest entry, new optional props
on nothing existing. `@fiscozen/layout` **1.3.3 → 1.4.0**, `since: "1.4.0"`, one changeset at
`minor`. FO and BO keep bumping independently (RFC §10 hard constraint). `pnpm release:check:pending`
before push, per the release workflow.

## Drawbacks

- **A fifth shell.** Four already exist and one (`FzSidebarTemplate`, `surfaces: ["BO"]`, 280px
  coloured rail) matches no current design. Adding without deciding about that one leaves consumers
  choosing between five shells, two of which are for the backoffice and one of which is dead. See
  Unresolved (1).
- **Two shells now claim to implement "the content card"** with different values: `rounded-xl`
  (12px) + `p-8` gutter here, `rounded-lg` (8px) + `p-16` there. Both are sourced from their own
  Figma. Either the BO and FO cards genuinely differ (fine, but say so in both component docs) or
  one of them is stale — and reconciling `FzAppTemplate` is a visible change to every FO page,
  needing design sign-off. Not in this RFC's scope; must not be left implicit.
- **The `aside` name is borrowed from a region with different responsive behaviour.** Cheaper than a
  divergent vocabulary, but it is a real trap that only a doc line defends against.
- **`window` scroll is no longer the page scroll.** Mitigated to a documented injection key and one
  known call site, but it is a genuine model change for the whole BO, and back/forward scroll
  restoration needs app-side router work that has not been done or measured yet.

## Alternatives

**Add `contentHeight` to `FzAppTemplate`** (the RFC §4 "one app-shell template with orthogonal
props" line). Rejected, and the spike's reasoning holds: its `min-h-dvh` root plus document scroll is
the model that has to be *inverted*, not extended, and its aside is a mobile modal drawer. Bending it
reproduces the "two shells in one" failure the architecture review already flagged for the
`environment` prop.

**Leave the frame in the app repo.** Keeps the DS surface smaller and costs nothing today. But it
leaves `FzThreeColumnsTemplate` shipped with an unsatisfiable contract, leaves the
`FzThreeColumnsTemplate` story reaching for `h-[600px]` because no DS component can express a bounded
box, leaves the tiering contradiction unresolved, and means the FO cannot ever host a `fills-parent`
page without building the same shell again.

**Expose a bounded-box primitive instead** (e.g. a `viewportHeight` prop on `FzContainer`) and let
apps assemble the frame. Rejected by this package's Layers rule — *"Build a new page shape as a page
layout that composes them — never expect an app to assemble one"* — and it would not deliver the
nav/toolbar/aside chrome the design asks for anyway.

## Milestones

Grouped by what has to land together vs. what can follow.

**M1 — `FzFrameTemplate` in `@fiscozen/layout` (this card).** Component + `types.ts` + barrel +
`FZ_PAGE_SCROLL_TARGET` + manifest entry + `FzThreeColumnsTemplate` manifest update (`nestWithin`,
`whenNested.note`, `composeOnly.safe: true`) + the three test tiers + story + `FzThreeColumnsTemplate`
story rewrite + README section + changeset (minor). Includes every §5 defect fix and §6/§7.

**M2 — `@fiscozen/navbar`: drop the hardcoded `shadow` (separate card, lands with M1).** `FzNavbar.vue:59`
hardcodes Tailwind's `shadow` on the root, drawing a fake edge along a rail that the design wants
flat against the page background. `@fiscozen/style` emits box-shadow utilities as `!important`, so
neither the existing `--fz-navbar-shadow` custom property nor a plain `!shadow-none` can switch it
off — the spike needed `[&.fz-navbar]:!shadow-none` at the call site, **which a compose-only consumer
cannot write.** So this is not cosmetic: it is a capability that does not exist under our own policy.
Fix upstream (remove the utility and let the existing `--fz-navbar-shadow` fallback own it, or add an
`elevation`/`flat` prop). Blocks visual fidelity, not the shell.

**M3 — app repo: adopt the DS shell (separate card, app side).** `AppContent.vue` composes
`FzFrameTemplate`; `BackofficeFrame.vue` deleted; `FrameToolbar` / tools drawer / `SideBar` stay
(they hold router/store/`BreadCrumb` — the presentation/logic boundary, RFC §5); `twp` moves onto
those roots per §7; `chrome` route mapping defaults to `flat`; `FZ_PAGE_SCROLL_TARGET` injected and
`scrollBehavior` + `TaxDeclaration.vue:186` wired. Re-run the spike's sweep (every parameter-free
route + heavy detail pages at 1920/1600/1440/1280/1024/900/768).

**M4 — the two-row page header (separate card).** The Figma's 133px header (title + badge + actions
*and* a tab row) has no DS expression; `FzThreeColumnsTemplate`'s header is a single `min-h-[64px]`
row and measured 77px. Cheapest correct answer is **additive slots** on the page-content layouts — a
second header row alongside the existing `header-left`/`header-right`, keeping the `min-h` floor
semantics — not a new component and not a prop that reflows the region. The design uses it on every
page, so `FzListTemplate`/`FzDetailTemplate` need the same shape; do the three together or the region
diverges.

**M5 — `FzTabs` overflow affordance (separate card).** `tabStyle: 'scroll'` (the default) is a bare
`overflow-x-auto`: no arrows, no edge fade, no scroll-into-view on selection change, and on macOS
overlay scrollbars show nothing at all — 7 of 19 tabs unreachable on `/utenti/:id` at 1440px. Not
caused by the frame (the container measures and clips correctly; a trackpad gesture does scroll it),
but it surfaces wherever tabs are narrow, including the `registra-documento` 300px sidebar. The
existing `tabs-end` slot sits *outside* the scroll container and is the right hook.

**M6 — app-repo policy hygiene (small, app side).** Widen the plugin's `componentPathPattern` beyond
`frontoffice/src/` so the next template authored under `backoffice/src/layouts/` is actually caught
by LIB-2906's tiering rule. And, to the plugin: propose optional `whenNested.hostProps` (§8).

## Unresolved questions

1. **Is `FzSidebarTemplate` superseded?** Shipped 1.2.0, `surfaces: ["BO"]`, 280px coloured rail,
   two `composeOnly` gaps, and it matches no current design. If the new BO design is *the* BO design,
   it should be marked `notWhenToUse → FzFrameTemplate` and deprecated in a minor (removal needs a
   major — additive-only is a hard constraint). Needs a design answer, not an engineering one.
2. **12px or 8px card radius, 8px or 16px gutter?** §Drawbacks. Design decides; the answer changes
   whether `FzAppTemplate` gets a follow-up.
3. **Which breakpoint is "desktop" for the DS?** `lg` (1024, `FzNavbar`, this shell) vs `desktop`
   (1200, `FzAppTemplate`). §4 justifies the local choice; the DS-wide answer is still open (RFC §6.4).
4. **Does the tools drawer's *content* belong in the DS?** The 400px geometry is generic and ships
   here. "AI chat + user messages" is a Fiscozen product concept and should live in `@fzp/*` or the
   app — but if both surfaces grow one, a shared organism becomes the question.
5. **Route `meta` vs. page-declared layout for `contentHeight`.** App-side and out of DS scope, but
   worth settling before ~115 pages are ported: `meta` is one explicit line per route; inference is
   less to get wrong but needs pages to declare their template, which they do not today.
