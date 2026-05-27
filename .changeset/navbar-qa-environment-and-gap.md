---
'@fiscozen/navbar': minor
---

Address QA findings from LIB-1901 on the v0.2.0 navbar:

- **New `environment` prop** (`'frontoffice' | 'backoffice'`, default `'frontoffice'`). Propagates to the navbar's default mobile menu-button so consumers using the vertical/backoffice context get 32px (`'backoffice'`) controls without needing to override the `#menu-button` slot. Consumer-provided slot content (avatars, custom buttons) is still responsible for its own sizing — there is no implicit cascade past the default menu button.
- **Navigation gap increased from `gap-4` to `gap-8`** on the inner navigation container (both `flex-row` and `flex-col`). The 4px gap was visually too tight for the vertical/backoffice layout; 8px matches the design spec.
- Storybook: the `Vertical` story now uses `environment="backoffice"` and passes `environment="backoffice"` to the `FzAvatar` in `#user-menu`, so the rendered preview matches the intended 32px backoffice layout.
