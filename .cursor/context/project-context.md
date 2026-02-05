# Project Context

## Overview

Fiscozen Design System - A Vue 3 component library with Tailwind CSS

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3.4+ with Composition API |
| Language | TypeScript 5.3 |
| Build Tool | Vite 5 |
| Test Framework | Vitest 1.0 |
| Component Testing | Storybook Test |
| Styling | Tailwind CSS 3.4 |
| Monorepo | NX 20 |
| Package Manager | pnpm 10 |
| Code Generation | Plop |

## Repository Structure

```
design_system/
├── apps/
│   └── storybook/          # Storybook app
├── packages/               # 30+ component packages
│   ├── button/
│   ├── dialog/
│   ├── input/
│   └── ... (more components)
├── templates/
│   └── component/          # Plop template for new components
├── nx.json                 # NX configuration
├── plopfile.js             # Component generator config
└── vitest.workspace.ts     # Vitest workspace config
```

## Key Commands

```bash
# Generate new component
pnpm generate:component

# Run all tests
pnpm test:storybook

# Run tests in watch mode
pnpm test:storybook:watch

# Build all packages
pnpm build

# Run linting on specific package
nx run @fiscozen/{component}:lint

# Run affected tests
nx affected:test
```

## Design System Features

- **Two Environments**: `backoffice` (larger) and `frontoffice` (smaller)
- **Semantic Colors**: `core-white`, `grey-*`, `semantic-error-*`, etc.
- **Component Pattern**: Vue 3 `<script setup>` with TypeScript
- **Testing**: Storybook play functions with accessibility assertions

## Component Categories (Storybook)

- Button
- Form (input, checkbox, radio, etc.)
- Navigation (navbar, navlist, breadcrumbs)
- Overlay (dialog, tooltip, dropdown)
- Messages (alert, toast)
- Panel (card, collapse)

## Dependencies

Core peer dependencies:
- `vue`: ^3.4.13
- `tailwindcss`: ^3.4.1

## Important Notes

1. Always use `pnpm` (not npm/yarn)
2. Node version: ^22.12.0
3. Components are auto-exported via `src/index.ts`
4. Always run typecheck before committing
5. Use design tokens for colors, avoid hardcoded values
