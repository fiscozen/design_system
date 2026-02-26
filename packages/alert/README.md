# @fiscozen/alert

Alert component: callout for timely information (info, error, warning, success, danger).

> For usage documentation and examples, see [Storybook Documentation – Messages / FzAlert](https://main--*.storybook.inspire.cloud/?path=/docs/documentation-messages-fzalert).

## Development

### Setup

From the repo root: install dependencies with `pnpm install`. Run unit tests with `pnpm --filter @fiscozen/alert test:unit`. Run Storybook from the repo root to try the component.

### Architecture

- **Variants**: `background` (always expanded, optional title and actions), `accordion` (collapsible), `text` (description only, no title/actions/dismiss, transparent background, tone ignored).
- **Tone**: Drives icon, background and border for `background` and `accordion`; ignored for `text` (transparent background; icon still reflects tone for semantics).
- **Environment**: `frontoffice` (default) vs `backoffice`. Affects padding (`p-12` vs `p-6`) and is passed to `FzButton` / `FzIconButton`. For variant `text` + `environment: 'backoffice'`, the leading icon uses size `sm`; otherwise `md`.

### Code organization

- `src/FzAlert.vue`: main component; computed `safeVariant`, `safeEnvironment`, `isTextVariant`, `iconSize`, `containerClass`, etc.
- `src/types.ts`: `AlertProps`, `AlertVariant`; deprecated props `alertStyle`, `size`.
- `src/index.ts`: exports component and types.

### Key concepts

**Text variant**: No title, no button/link actions, not collapsible, not dismissible. Container uses `bg-transparent` (tone-based background and border are not applied). Icon size is `sm` when `environment === 'backoffice'`, `md` otherwise (`iconSize` computed).

**Environment and padding**: Root div gets `p-6` only in backoffice. Inner `FzContainer` uses `p-6` (backoffice) or `p-12` (frontoffice).

### Testing

- Unit tests: `pnpm --filter @fiscozen/alert test:unit` (or `test:unit --run -u` to update snapshots).
- Tests cover rendering, props (all variants including `text`), events, CSS classes, accessibility expectations, edge cases, and snapshots (including `text` and `text` + backoffice).

### Build

- `pnpm --filter @fiscozen/alert build`: runs `vue-tsc` and `vite build`.
