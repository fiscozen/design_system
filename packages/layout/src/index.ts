// ─────────────────────────────────────────────────────────────────────────────
// ⚠ MANIFEST CONTRACT — every layout exported from this barrel MUST have an
// entry in ./layouts.json (see ../CLAUDE.md). That manifest is how every repo
// built on this design system decides which layout a page should use; a layout
// that is exported but unlisted is invisible to that tooling.
//
// Enforced by ./__tests__/layouts.manifest.spec.ts, which runs in the
// pre-commit `nx affected -t test:unit` gate. Add the entry in the same commit
// as the export. Add a `nestWithin` host only when a composition test in
// ./__tests__/layoutComposition.spec.ts proves the pair works.
// ─────────────────────────────────────────────────────────────────────────────
export { default as FzLayout } from './FzLayout.vue'
export { default as FzLayoutMain } from './FzLayoutMain.vue'
export { default as FzLayoutHeader } from './FzLayoutHeader.vue'
export { default as FzLayoutAside } from './FzLayoutAside.vue'
export { default as FzLayoutFooter } from './FzLayoutFooter.vue'
export { default as FzLayoutBottomBar } from './FzLayoutBottomBar.vue'
export { default as FzBlankTemplate } from './FzBlankTemplate.vue'
export { default as FzFocusTemplate } from './FzFocusTemplate.vue'
export { default as FzAppTemplate } from './FzAppTemplate.vue'
export { default as FzListTemplate } from './FzListTemplate.vue'
export { default as FzDetailTemplate } from './FzDetailTemplate.vue'
export { default as FzThreeColumnsTemplate } from './FzThreeColumnsTemplate.vue'
export { default as FzSidebarTemplate } from './FzSidebarTemplate.vue'
export { default as FzFrameTemplate } from './FzFrameTemplate.vue'
export { FZ_BOTTOM_BAR_TARGET, FZ_PAGE_SCROLL_TARGET } from './keys'
export type * from './types'
