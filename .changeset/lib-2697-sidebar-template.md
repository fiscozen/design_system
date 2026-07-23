---
"@fiscozen/layout": minor
---

Add `FzSidebarTemplate` — the collapsible-sidebar application shell

A new presentation-only page template (RFC §4, Jira LIB-2697 / epic RT-2054), extracted from the `it.fiscozen.people` app shell (`MainLayout` + `AppSidebar`) so the shape lives in the design system.

It frames a template-owned colored sidebar in three vertical zones — `brand` (top), `nav` (scrollable middle, wrapped in a `<nav>` landmark) and `footer` (pinned bottom, e.g. the signed-in user + logout) — beside the page content (`FzLayoutMain`). From the `desktop` breakpoint (1200px) up the sidebar is a persistent sticky rail; below it, it collapses to an off-canvas drawer the template opens from a hamburger in a sticky mobile top bar — a focus-trapped `role="dialog"` with `aria-modal`, a click-to-dismiss backdrop and Escape-to-close. This is the mirror of `FzAppTemplate` (where the *aside* collapses and the nav stays persistent); here the nav rail itself is what collapses.

Presentation-only: it owns the responsive/collapse state and safe-area/sticky CSS but imports no store/router/API — only the `FzLayoutHeader`/`FzLayoutMain` region molecules and `FzIconButton` (the mobile hamburger; adds `@fiscozen/button` as a dependency). Colors are app-themed via `--fz-sidebar-bg` / `--fz-sidebar-text` (and `--fz-sidebar-width`, default 280px) — never baked in — and the nav items, their RBAC, routing, the brand, the user identity and logout all stay app-side, injected through the slots. Owns a full-height root (`min-h-dvh`).
