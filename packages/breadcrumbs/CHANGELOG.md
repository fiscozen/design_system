# @fiscozen/breadcrumbs

## 0.2.0

### Minor Changes

- 6298eef: Add `environment` prop, frontoffice overflow, and full WCAG 2.1 AA compliance
  - Add `environment` prop (`'frontoffice' | 'backoffice'`, default `'frontoffice'`): in frontoffice mode breadcrumb trails longer than 3 items collapse to `first / … / penultimate / current`; backoffice always shows all items
  - Render nothing when fewer than 2 breadcrumbs are provided
  - WCAG 2.1 AA compliance: `<nav aria-label>` landmark, `<ol>/<li>` list semantics, `aria-current="page"` on the active item, separators hidden with `aria-hidden="true"`, active item rendered as non-interactive `<span>` in `FzRouterBreadcrumbs`
  - Add `ariaLabel` prop to customise the nav landmark label
