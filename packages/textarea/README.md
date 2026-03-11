# @fiscozen/textarea

Multi-line text input component with label, validation states, resize control, and WCAG 2.1 AA accessibility.

> For usage documentation, see [Storybook Documentation](../../apps/storybook/src/FzTextarea.mdx)

## Development

### Setup

```bash
pnpm install
pnpm --filter @fiscozen/textarea build
```

### Architecture

FzTextarea is a form component that wraps a native `<textarea>` element with label, validation states (error/valid), help/error messages, and full ARIA accessibility.

Key design decisions:

- **Auto-generated IDs**: When no `id` prop is provided, a unique ID is generated via `utils.ts` to ensure label-textarea association always works. Uses timestamp + counter pattern (same as `@fiscozen/input`).
- **ARIA ternary pattern**: Boolean ARIA attributes use ternary expressions (e.g. `:aria-invalid="error ? 'true' : 'false'"`) because Vue 3 removes boolean attributes when `false`, but ARIA spec requires string values.
- **Error message with role="alert"**: Error messages are wrapped in a container with `role="alert"` so screen readers announce them immediately.
- **Prop-based messages**: Error and help messages are passed as props (`errorMessage`, `helpMessage`) rather than slots. This differs from `FzInput` which uses slots.

### Code Organization

- `src/FzTextarea.vue`: Main component
- `src/types.ts`: Type definitions (`FzTextareaProps`, `FzTextareaEvents`)
- `src/utils.ts`: ID generation utility (`generateTextareaId`)
- `src/index.ts`: Public exports

### Key Concepts

#### Effective ID

The component computes an `effectiveId` that falls back to an auto-generated ID when no explicit `id` prop is provided. This ensures:
- Label `for` attribute always matches textarea `id`
- `aria-describedby` references (error/help IDs) are always valid
- Error message container ID (`{effectiveId}-error`) and help message ID (`{effectiveId}-help`) are deterministic

#### Message Priority

When both `errorMessage` and `helpMessage` are provided, error takes precedence. The `ariaDescribedBy` computed follows the same priority: error ID > help ID.

### Testing

#### Running Tests

```bash
pnpm --filter @fiscozen/textarea test:unit
pnpm --filter @fiscozen/textarea coverage
```

#### Test Structure

Tests are organized in nested `describe` blocks:
- **Rendering**: Basic component rendering
- **Props**: Each prop has its own `describe` block
- **Events**: Blur, focus, paste, v-model
- **Accessibility**: ARIA attributes, role="alert", decorative icons, keyboard navigation
- **CSS Classes**: Static and dynamic class application
- **Edge Cases**: Null/undefined/empty values, special characters
- **Snapshots**: All major states with explicit IDs for stability

#### Snapshot Stability

Snapshot tests provide explicit `id` props to avoid auto-generated IDs (which contain timestamps) from causing flaky comparisons across test runs.

### Adding Features

1. Update types in `src/types.ts` with JSDoc
2. Implement logic in `src/FzTextarea.vue`
3. Add tests in `src/__tests__/FzTextarea.spec.ts`
4. Update Storybook stories in `apps/storybook/src/stories/form/Textarea.stories.ts`
5. Update MDX documentation in `apps/storybook/src/FzTextarea.mdx`

### Build

```bash
pnpm --filter @fiscozen/textarea build
```
