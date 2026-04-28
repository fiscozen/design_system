# Fiscozen Design System

## Architecture

Vue 3 component library monorepo. 47 packages under `packages/` published as `@fiscozen/*`.

- **Package manager:** pnpm (^10) with workspaces (`packages/*`, `apps/*`)
- **Task runner:** Nx 20.7 with caching (`nx affected` for incremental runs)
- **Build:** Vite 8 + vue-tsc (each package: `vue-tsc && vite build`)
- **Test:** Vitest 4 (unit) + Storybook 10 play functions (interaction)
- **Styling:** Tailwind CSS 3.4 + design tokens via Style Dictionary (`@fiscozen/style`)
- **Release:** Changesets + custom `release-check.mjs` analysis tool
- **Storybook:** `apps/storybook` — stories, MDX docs, a11y addon, Chromatic visual tests

Shared config packages: `@fiscozen/eslint-config`, `@fiscozen/prettier-config`, `@fiscozen/tsconfig`.

## Commands

```bash
# Testing
pnpm test                          # All unit tests (Vitest)
pnpm test:affected                 # Only affected packages
pnpm test:coverage                 # With coverage
pnpm test:storybook                # Storybook play function tests
pnpm test:storybook:watch          # Watch mode
pnpm test:storybook:ui             # Vitest UI dashboard

# Building
pnpm build                         # Build all packages
pnpm storybook                     # Storybook dev server

# Scaffolding
pnpm generate:component            # Plop: scaffold new component package

# Release analysis (read-only, safe to run)
pnpm release:check                 # Full analysis (all 4 sections)
pnpm release:check:unpublished     # Local vs npm registry versions
pnpm release:check:pending         # Changeset impact preview + cascade
pnpm release:check:graph           # Internal dependency graph + hub packages
pnpm release:check:health          # Peer dep alignment, 0.x flags, diamond deps

# Changesets
pnpm changeset                     # Add a changeset
pnpm changeset:status              # View pending changesets
```

## Component Conventions

- **Naming:** `Fz{PascalCase}` prefix (FzButton, FzDatepicker, FzSelect)
- **Package name:** `@fiscozen/{kebab-case}` (e.g., `@fiscozen/button`)
- **File structure:**
  ```
  packages/{name}/src/
    FzName.vue          # Component (Composition API, <script setup>)
    types.ts            # Props interface with JSDoc
    index.ts            # Named exports
    __tests__/          # Unit tests (.spec.ts)
  ```
- **Stories:** `apps/storybook/src/stories/{category}/{Name}.stories.ts`
- **MDX docs:** `apps/storybook/src/Fz{Name}.mdx`
- **Exports:** Named component export + type re-exports from `index.ts`

## Icons

Icons are rendered via `FzIcon` / `FzIconButton` using the Font Awesome kit `@awesome.me/kit-8137893ad3`.
**Only use icon names that exist in this kit.** The full list of available icon names can be inspected at:
`node_modules/.pnpm/@awesome.me+kit-8137893ad3@*/node_modules/@awesome.me/kit-8137893ad3/icons/modules/classic/{solid|regular}.js`

## Code Style

- Vue 3 Composition API with `<script setup lang="ts">`
- TypeScript strict mode, props via `defineProps<T>()` with `withDefaults`
- `defineModel()` for v-model bindings (Vue 3.4+)
- Tailwind CSS utility classes, tokens from `@fiscozen/style`
- Prettier: no semicolons, single quotes, 100 char width, Tailwind plugin
- ESLint: `@fiscozen/eslint-config` (vue3-essential + typescript + prettier)

## Testing Requirements

- **Both tiers required:** unit tests (`.spec.ts`) AND Storybook play functions (`.stories.ts`)
- **Coverage thresholds:** 80% statements, 75% branches, 80% functions/lines
- **Accessibility:** aria-* attributes, keyboard nav, role verification in both test types
- **Storybook:** Use `fn()` spies from `storybook/test` for interaction verification
- **Async:** Use `waitFor()` from `storybook/test` for async state — never `setTimeout`
- **Import:** `from 'storybook/test'` (NOT `'@storybook/test'`)
- **v-model:** Test with `'onUpdate:modelValue': fn()` spy pattern

## Release Workflow

1. Make changes to packages
2. Run `pnpm changeset` to document the change (required by pre-push hook)
3. Run `pnpm release:check:pending` to preview cascade impact
4. Push (pre-push runs: changeset check + full build + storybook tests)
5. `changeset:publish` runs in CI only — never locally

## Security (NON-NEGOTIABLE)

- NEVER read or modify `.env` files (contains Chromatic token)
- NEVER read or modify `.npmrc` (contains registry token config)
- NEVER run publish commands (`changeset:publish`, `npm publish`, `pnpm publish`)
- NEVER run `changeset:version` without explicit human review
- NEVER use `--no-verify` or `SKIP_*_CHECK` to bypass git hooks
- NEVER force-push or delete remote branches
- Component code must not contain dynamic code execution or network requests
- When adding `@fiscozen/*` dependencies, add them to `rollupOptions.external` in `vite.config.ts`
