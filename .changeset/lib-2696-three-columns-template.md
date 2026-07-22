---
"@fiscozen/layout": minor
---

Add `FzThreeColumnsTemplate` — the backoffice three-column workspace layout (header bar + collapsible list `sidebar` + two equal-width content columns, the left one a preview and the right one an independently scrollable body). Extracted from the app-internal `@fzp/shared` `FzLayoutThreeColumns` so the shape lives in the design system (LIB-2696 / epic RT-2054).

Presentation-only and chrome-free: it owns the structural scaffold (flex regions, the collapsible sidebar's width animation + `v-model:sidebarCollapsed`, the independent-scroll regions, borders and the `aside`/`main` landmarks) and injects the back button, title, badge, filters and toggle control through slots (`sidebar-header` receives `{ collapsed, toggle }`). Fills the height of its bounded-height parent (documented height contract). The collapsible sidebar body uses `v-show` (not `v-if`) so scroll position and consumer-wired observers survive a collapse/expand cycle.
