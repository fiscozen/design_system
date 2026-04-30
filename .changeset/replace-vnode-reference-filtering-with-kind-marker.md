---
"@fiscozen/tab": patch
"@fiscozen/simple-table": patch
"@fiscozen/table": patch
"@fiscozen/button": patch
"@fiscozen/link": patch
"@fiscozen/tooltip": patch
"@fiscozen/checkbox": patch
"@fiscozen/collapse": patch
---

Replace fragile reference-identity slot filtering and provide/inject keys with namespaced primitive strings.

Two related Vite dev-mode regressions are fixed at the same time, both rooted in module-instance duplication that occurs when consuming apps exclude `@fiscozen/*` packages from `optimizeDeps` (needed to preserve nested npm resolution for version-conflicting transitives). When the same `.vue` or `.ts` file is loaded as multiple distinct module instances, reference-identity comparisons (`vnode.type === Component` for slot filtering, `Symbol(...)` for provide/inject keys) silently fail.

**Slot filtering** — child components now expose a `__fzKind` marker via `defineOptions({ __fzKind: "@fiscozen/<package>/<Component>" })`, and parents filter by reading that string instead of comparing references. Affected:
- `FzTabs` filtering `FzTab` children
- `FzSimpleTable` filtering `FzColumn` children
- `FzTable` filtering `FzColumn`/`FzRow` children
- `FzButtonGroup` validating `FzButton` children
- `FzTooltip` auto-detecting `FzButton`/`FzIconButton`/`FzLink` for interactive-element handling

**Provide/inject keys** — the two module-scoped `Symbol(...)` injection keys are now namespaced primitive strings, applying the same value-equality property to provide/inject. Affected:
- `@fiscozen/checkbox` `CHECKED_SET_KEY`
- `@fiscozen/collapse` `ACCORDION_KEY`

No public API changes; consumers do not need to update their templates or call sites.
