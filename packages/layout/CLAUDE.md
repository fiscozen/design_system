# `@fiscozen/layout` — working rules

Read this before adding or changing anything in this package. It is additive to the
root `CLAUDE.md`, not a replacement.

## The layout manifest is part of the public surface

`layouts.json` declares, for every layout this package exports, what it is *for* and how
it may be used. Downstream repos governed by the **agentic-design** plugin read it to
answer the first question of any design implementation — *which layout should this page
use?* — and generate a decision table from it at session start. It is the reason a new
layout becomes usable across the org without anyone editing a consuming repo.

**Adding or removing a layout means updating `layouts.json` in the same commit.** This is
enforced, not advisory: `src/__tests__/layouts.manifest.spec.ts` asserts parity with
`src/index.ts` and runs in the pre-commit `nx affected -t test:unit` gate. The failure
message prints the JSON skeleton to add.

Per entry, the fields that carry real weight:

| Field | Why it matters |
| --- | --- |
| `kind` | `shell` (top-level, owns the viewport, one per page) / `page-content` (nests inside a shell) / `bounded` (needs a bounded-height ancestor) / `region` (layout-internal, blocked in app code) / `grid` (in-page primitive). Consumers act on this. |
| `whenToUse` | The page *shape*, in terms a designer recognises. This is the text the layout decision gets made from — not an implementation note. |
| `notWhenToUse` | The layout this one is confused with. Fill it in for any near-miss pair (e.g. `FzThreeColumnsTemplate` vs `FzLayout layout="threeColumns"`). |
| `nestWithin` | Hosts this layout is **verified** to work inside. Only list a host once a case in `src/__tests__/layoutComposition.spec.ts` proves it — the plugin presents an unlisted pair as "unverified, ask", which is the correct answer when we haven't checked. |
| `whenNested` | Props a consumer must set when nesting (e.g. `mainAs="div"` so the page doesn't expose two `main` landmarks). Treated as mandatory downstream. |
| `composeOnly` | See below. |
| `since` | The version the layout ships in. Consumers compare it against the installable version, so an agent doesn't plan a page around something unpublished. For a layout landing with a pending changeset, write the version that changeset will produce. |
| `slots` | Must match the layout's `Fz…Slots` type in `types.ts` — also asserted by the spec. |

The contract is documented in `docs/ds-layouts.schema.json` in the agentic-design plugin.

## A layout's API must be complete under `compose-only`

Consuming repos run a **compose-only** styling policy: `class`, `:class`, `style`,
`:style` and `<style>` are blocked at write time in every layer. A capability that is
only reachable through a fall-through `class`/`style` on the layout root therefore **does
not exist** for those consumers.

So: if a layout documents a capability, expose it as a prop or a design-system token —
not as "pass a class". CSS custom properties count as inaccessible too, since setting
them needs `style`.

Where a gap exists today, declare it honestly:

```json
"composeOnly": { "safe": false, "gaps": ["what is unreachable, and the tracking ticket"] }
```

The plugin surfaces those gaps to the consumer at *plan* time, before they build on the
layout. Closing a gap means flipping `safe` to `true` and removing the entry.

## Additive changes only

This package is a cross-repo contract: the frontoffice and backoffice depend on it and
bump it **independently** (RFC §10, a hard project constraint). New optional props with
defaults, new slots and new components are fine. Renaming or removing props, slots or
exports, making an optional prop required, or narrowing a prop's accepted values are
**breaking** and need a coordinated migration. Deprecate in a minor, remove in a major.

Every change ships a Changeset at the correct level; `pnpm release:check:pending` previews
the cascade.

## Layers

Region wrappers (`FzLayout{Main,Header,Aside,Footer,BottomBar}`) are **internal to the
page layouts**, which apply their sizing and padding via fall-through classes. They are
marked `kind: region` in the manifest and blocked in consuming app code. Build a new page
shape as a page layout that composes them — never expect an app to assemble one.

`FzLayout` stays the low-level grid primitive for in-page arrangement and for the
split-view master-detail shape no page layout covers yet. Its `leftShoulder` variant
forces `100vh` mobile tracks and independent per-region scroll, which is why the
list/detail layouts compose region molecules with document scroll instead.

## Height contracts

Three, and mixing them up is the most common way to break a page:

- **`owns-viewport`** — owns a full-height root (`min-h-dvh`); does not rely on app-global
  height CSS. The shells.
- **`document-scroll`** — grows with content, the host owns the scroll container and the
  device safe-area. The page-content layouts.
- **`fills-parent`** — fills the parent's height and scrolls its regions internally.
  **Requires a bounded-height ancestor**; in a box with an indefinite height it collapses
  to zero. Document the host contract on the component and verify each host with a test.
