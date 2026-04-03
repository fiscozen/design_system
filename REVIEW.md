# Code Review Rules — Fiscozen Design System

These rules are enforced during `/code-review` and multi-agent code review.
Violations marked BLOCK must be fixed before merge. Others are warnings.

## Accessibility (BLOCK if violated)

- Form components MUST have: `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-disabled`, `aria-required`
- Interactive elements MUST have keyboard navigation (Tab, Enter, Space, Escape where applicable)
- Expandable elements: `aria-expanded`, `aria-haspopup`
- Selectable options: `aria-selected`
- Error messages: `role="alert"` on container
- Decorative icons: `aria-hidden="true"`
- Both unit tests AND play functions must verify accessibility attributes

## API Stability (BLOCK if violated)

- Breaking prop/event/slot changes require a **major** version bump via changeset
- Removed exports require deprecation cycle: minor with `@deprecated` JSDoc, then major removal
- New **required** props on existing components = breaking change (use optional with default)
- Type narrowing (making a union type smaller) = breaking change
- Check cascade impact with `pnpm release:check:graph` before major bumps

## Performance (warn)

- No CSS-in-JS at runtime — use Tailwind utility classes and CSS variables
- Components must be tree-shakeable: named exports, no side effects in module scope
- No heavy dependencies (full lodash, moment.js, date-fns full import)
- Warn if single component bundle exceeds 10KB gzipped
- When using `@fiscozen/*` deps, add them to `rollupOptions.external` in vite.config.ts

## Code Quality (warn)

- Props defined in `types.ts` with JSDoc, not inline in `.vue` file
- Both unit tests (`.spec.ts`) AND play function stories (`.stories.ts`) required
- Play functions must use `fn()` spies for interaction verification (not just attribute checks)
- No `setTimeout` in play functions — use `waitFor()` from `storybook/test`
- Storybook imports from `'storybook/test'` not `'@storybook/test'`
- MDX documentation updated for any public API change
- Changeset present for any `packages/*/src/` change
