# @fiscozen/navbar

## 0.2.0

### Minor Changes

- c6445b3: Additive modernization of FzNavbar (no required consumer changes):
  - Add `mobileBreakpoint` prop (number or `${number}px`) — replaces the need for consumers to mutate `@fiscozen/style`'s imported `breakpoints` object to align the navbar with their desktop threshold. The legacy `breakpoints` prop is deprecated and now emits a dev-mode warning when used.
  - Add `position` prop (`'static' | 'fixed' | 'sticky'`) — replaces the `class="fixed top-0 left-0"` pattern consumers use at the call site.
  - Add `respectSafeArea` prop (default `false`) — when enabled, adds `env(safe-area-inset-*)` to top/left/right padding for devices with notches. Honors the `--safe-area-inset-*` CSS-variable fallback used by Capacitor / Cordova apps.
  - Add v-model support on `isMenuOpen` — the existing prop + `fznavbar:menuButtonClick` event continue to work; consumers can opt in to `v-model:isMenuOpen` for cleaner two-way binding.
  - Add `#menu-button` slot with scope `{ isOpen, toggle }` — lets consumers replace the default `FzIconButton` hamburger on mobile.
  - Expose layout values as CSS custom properties on the root (`--fz-navbar-padding`, `--fz-navbar-shadow`, `--fz-navbar-height`, `--fz-navbar-width`, `--fz-navbar-brand-gap`, `--fz-navbar-actions-gap`, `--fz-navbar-z-index`, `--fz-navbar-bg`). Defaults match the previous Tailwind utility values, so visual behavior is unchanged. Consumers can override per-instance via inline style without `!important` resets.
  - Add Bootstrap interop hardening — root `<header>` carries `box-border`, `m-0`, `border-0` so the component renders identically with or without `tailwindcss-scoped-preflight` (`.twp`) scoping.
  - Bug fix: on mobile, both `#notifications` and `#user-menu` slots render simultaneously when both are provided. The previous mutually-exclusive behavior was a hard-coded limitation.
  - Default alignment fix: the root `<header>` and the inner navigation / actions flex containers now use `items-center`, so slot content with mixed heights (icon, button, avatar) sits visually centered along the cross-axis. Frontoffice previously worked around this on mobile by adding `items-center` at the call site.

## 0.1.11

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1

## 0.1.10

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3

## 0.1.9

### Patch Changes

- @fiscozen/button@3.0.0

## 0.1.8

### Patch Changes

- Updated dependencies [a26bc2c]
  - @fiscozen/style@0.3.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
