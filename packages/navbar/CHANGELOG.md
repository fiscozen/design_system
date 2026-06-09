# @fiscozen/navbar

## 0.3.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 0.3.0

### Minor Changes

- 723f609: Address QA findings from LIB-1901 on the v0.2.0 navbar:
  - **New `environment` prop** (`'frontoffice' | 'backoffice'`, default `'frontoffice'`). Propagates to the navbar's default mobile menu-button so consumers using the vertical/backoffice context get 32px (`'backoffice'`) controls without needing to override the `#menu-button` slot. Consumer-provided slot content (avatars, custom buttons) is still responsible for its own sizing — there is no implicit cascade past the default menu button.
  - **Navigation gap increased from `gap-4` to `gap-8`** on the inner navigation container (both `flex-row` and `flex-col`). The 4px gap was visually too tight for the vertical/backoffice layout; 8px matches the design spec.
  - Storybook: the `Vertical` story now uses `environment="backoffice"` and passes `environment="backoffice"` to the `FzAvatar` in `#user-menu`, so the rendered preview matches the intended 32px backoffice layout.

## 0.2.1

### Patch Changes

- 27ca593: Fix v0.2.0 CSS-variable defaults to match `@fiscozen/style` pixel spacing tokens (p-12 = 12px, h-56/w-56 = 56px, mr-32/mb-32 = 32px, gap-16 = 16px). The previous rem-based fallbacks (3rem/14rem/8rem/4rem) targeted stock Tailwind's scale, which made the navbar render ~4× larger than intended on consumers without explicit overrides — a visual regression vs. v0.1.x where the package emitted no competing CSS rules and the consumer's pixel-aligned Tailwind classes took effect directly. The variables themselves are unchanged; consumers that already set them via inline style or scoped CSS are unaffected.

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
