---
name: component-creation
description: End-to-end workflow for creating a new Vue 3 component in the design system
---

# Component Creation Workflow

## Step 1: Scaffold

```bash
pnpm generate:component
```

This runs Plop and creates the full package under `packages/{name}/` with:
- Package config (package.json, tsconfig, vite, vitest, eslint, prettier)
- Component scaffold (FzName.vue, types.ts, index.ts)
- Test template (FzName.spec.ts with 6 test categories)
- Story template (Name.stories.ts with play functions)
- Auto-installs the new package in `@fiscozen/storybook`

## Step 2: Define Types

Edit `packages/{name}/src/types.ts`:

```typescript
/**
 * Props for FzComponentName.
 */
export interface FzComponentNameProps {
  /** The visible label text */
  label?: string
  /** Disables the component */
  disabled?: boolean
  /** Component sizing environment */
  environment?: 'frontoffice' | 'backoffice'
}
```

Use `interface` (not `type`) with JSDoc on every prop.

## Step 3: Implement Component

Edit `packages/{name}/src/FzName.vue`:

- Use `<script setup lang="ts">`
- Use `defineProps<Props>()` with `withDefaults`
- Use `defineModel()` for v-model bindings
- Use `defineEmits<{...}>()` for typed events
- Tailwind classes for styling, tokens from `@fiscozen/style`

If the component uses `@fiscozen/*` dependencies, add them to:
1. `package.json` dependencies (use `workspace:*` for internal deps)
2. `vite.config.ts` `rollupOptions.external` array

## Step 4: Write Unit Tests

Edit `packages/{name}/src/__tests__/FzName.spec.ts`:

Required test categories:
1. Rendering (default props, labels, slots)
2. Props (each public prop, disabled, environment)
3. Events (emitted events, blocked when disabled, v-model)
4. Accessibility (aria-*, keyboard focus)
5. Edge Cases (undefined props, multiple instances)
6. Snapshots (default, disabled states)

Run: `cd packages/{name} && pnpm test:unit`

## Step 5: Write Stories with Play Functions

Edit `apps/storybook/src/stories/{category}/{Name}.stories.ts`:

Required stories:
1. Default — basic rendering + ARIA verification + fn() click spy
2. Disabled — disabled state + verify handler NOT called
3. KeyboardNavigation — Tab, Enter, Space
4. AllStates — visual overview

Import from `'storybook/test'` (not `'@storybook/test'`).
Use `fn()` spies in `args` for interaction verification.

Run: `pnpm test:storybook`

## Step 6: Write MDX Documentation

Create `apps/storybook/src/Fz{Name}.mdx`.
See `/mdx-documentation` skill for template and rules.

## Step 7: Verify and Create Changeset

```bash
pnpm test:affected          # Unit tests
pnpm test:storybook         # Play function tests
pnpm build                  # Build all (catches type errors)
pnpm changeset              # Document the new component
```

## Checklist

- [ ] Types defined with JSDoc in types.ts
- [ ] Component uses Composition API + defineProps/defineModel
- [ ] Internal @fiscozen/* deps added to vite.config.ts externals
- [ ] Unit tests cover all 6 categories
- [ ] Stories use fn() spies and waitFor()
- [ ] MDX documentation created
- [ ] Changeset added
- [ ] All tests pass
