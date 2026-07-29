---
"@fiscozen/layout": minor
---

Add `layouts.json` — a machine-readable manifest of the package's page layouts

The package now publishes, alongside the components, a declarative description of what each layout is *for*: its `kind` (`shell` / `page-content` / `bounded` / `region` / `grid`), its height contract, the page shape it covers, the layout it is most easily confused with, its slots and key props, which hosts it is verified to nest inside and the props required when nesting, the version it ships in, and whether every documented capability is reachable under a strict `compose-only` styling policy.

This makes the layout choice answerable from the design system's own source of truth. Repos governed by the agentic-design plugin read the manifest at session start and generate a layout decision table, so a layout added here becomes selectable across the org with no per-repo configuration — replacing hand-copied layout lists that went stale on every release.

Parity is enforced rather than reviewed: `layouts.manifest.spec.ts` asserts that every exported layout has an entry, that entries match their `Fz…Slots` types, that `nestWithin` names real shells, and that a declared compose-only gap is described — and it runs in the pre-commit `nx affected -t test:unit` gate. `layoutComposition.spec.ts` verifies the shell + page-content pairs the manifest advertises, including the negative case that documents why `mainAs="div"` is mandatory when nesting. A new `CLAUDE.md` states the contract for contributors, and `src/index.ts` carries a marker pointing at it.

No component behaviour changes; no existing API is touched.
