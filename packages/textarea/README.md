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

FzTextarea is a form component that wraps a native `<textarea>` element with label, validation states (error/valid), help/error messages, and full ARIA accessibility. Error messages use `FzAlert` for consistency with `FzInput`.

Key design decisions:

- **Auto-generated IDs**: When no `id` prop is provided, a unique ID is generated via `utils.ts` to ensure label-textarea association always works. Uses timestamp + counter pattern (same as `@fiscozen/input`).
- **ARIA ternary pattern**: Boolean ARIA attributes use ternary expressions (e.g. `:aria-invalid="error ? 'true' : 'false'"`) because Vue 3 removes boolean attributes when `false`, but ARIA spec requires string values.
- **Error via FzAlert**: Error messages use `<FzAlert tone="error" variant="text">` with `role="alert"`, matching `FzInput` pattern. The `circle-xmark` icon is rendered automatically by FzAlert. Dependency: `@fiscozen/alert`.
- **Slot-based messages**: Error and help content are provided via `errorMessage` and `helpText` slots, matching `FzInput` pattern. Uses `defineSlots` for TypeScript typing and `useSlots()` for runtime slot detection (same approach as `FzInput`).
- **Custom focus ring**: Browser default outline is suppressed (`outline-none focus:ring-0 focus:outline-none`) and replaced with a border color change on focus (`focus:border-blue-600`). In error state, focus uses `focus:border-semantic-error-300` to maintain error context. This approach differs from `FzInput` which uses `has-[:focus]` on a wrapper div; here the border is directly on the `<textarea>` element.
- **Design token alignment (Figma)**: Border colors use `semantic-error-200` (default error) / `semantic-error-300` (error+focus). Placeholder uses `placeholder:text-grey-300`. Background `bg-core-white`, text `text-core-black`. Text is always `text-base` (16px) matching Figma spec (no size variants). Label and help text use `font-normal text-base`. Disabled/readonly states apply `text-grey-300` to label and help text.
- **Deprecated `size` prop**: The `size` prop (`sm | md | lg`) is accepted for backward compatibility but ignored. The textarea always renders with `text-base`. A runtime `console.warn` is emitted when any value is passed. Will be removed in the next major version.
- **`inheritAttrs: false` + `v-bind="$attrs"`**: Extra attributes and native event listeners are forwarded directly to the native `<textarea>` element, not the root wrapper div. No custom `defineEmits` for DOM events — blur, focus, paste, keydown, etc. all flow through `$attrs` automatically.
- **`defineExpose({ textareaRef })`**: Exposes the native `<textarea>` element ref for programmatic focus or measurement, following the same pattern as `FzInput` (`inputRef`, `containerRef`).
- **Label ID + `aria-labelledby`**: Label element gets an explicit `id` (`{effectiveId}-label`) and the textarea uses `aria-labelledby` to reference it, providing stronger screen reader association alongside `for`/`id` binding. Same pattern as `FzInput`.
- **`watch` for deprecation**: Uses `watch(() => props.size, ..., { immediate: true })` instead of `onMounted` for deprecation warnings, aligning with `FzInput`'s watcher-based approach. Catches runtime prop changes.
- **Root identification class**: `fz-textarea` class on root div for debugging and external styling, mirroring `FzInput`'s `fz-input` class.
- **Combined states**: Error+disabled, required+help, disabled+compiled are all supported. When error+disabled, both `aria-invalid` and `aria-disabled` are set to "true", and the error message remains visible. Help text is greyed out when disabled/readonly.
- **Minimum width/height**: `min-w-[96px]` prevents horizontal collapse; `min-h-[77px]` enforces minimum height with `rows: 2` default (2 rows content + 10px padding top + 10px padding bottom + 1px border top + 1px border bottom).
- **Auto-height**: When `autoHeight` is `true`, the textarea height is adjusted programmatically on every `v-model` change via `adjustHeight()`. A `ResizeObserver` is used for external size changes. Vertical resize is disabled; horizontal is preserved. Font metrics (`lineHeight`, `paddingY`, `borderY`) are cached once at mount because they are fixed by the design system. `maxRows` caps the growth; beyond that a scrollbar appears (`overflow-y: auto`). `autoHeight` must be set at mount — runtime changes are not supported because hooks (`onMounted`, `watch`) are registered conditionally at setup time.

### Code Organization

- `src/FzTextarea.vue`: Main component (imports FzAlert, FzIcon)
- `src/types.ts`: Type definitions (`FzTextareaProps`)
- `src/utils.ts`: ID generation utility (`generateTextareaId`)
- `src/index.ts`: Public exports

### Dependencies

- `@fiscozen/alert` (workspace): FzAlert for error messages
- `@fiscozen/icons` (peer): FzIcon for valid check icon

### Key Concepts

#### Effective ID

The component computes an `effectiveId` that falls back to an auto-generated ID when no explicit `id` prop is provided. This ensures:
- Label `for` attribute always matches textarea `id`
- Label `id` (`{effectiveId}-label`) is referenced by `aria-labelledby` on the textarea
- `aria-describedby` references (error/help IDs) are always valid
- Error message container ID (`{effectiveId}-error`) and help message ID (`{effectiveId}-help`) are deterministic

#### Auto Height Algorithm

When `autoHeight` is enabled:

1. **Mount**: `measureMetrics()` reads `lineHeight`, `paddingTop+paddingBottom`, `borderTopWidth+borderBottomWidth` from `getComputedStyle()`. These are cached for the component lifetime.
2. **On input** (`watch(model)`): `adjustHeight()` is called after `nextTick`. It resets `height` to `"auto"` so `scrollHeight` reflects the natural content height, then computes the constrained height: if `maxRows` is set and `scrollHeight > maxRows * lineHeight + paddingY`, it caps the height and sets `overflow-y: auto`; otherwise `overflow-y: hidden`.
3. **`ResizeObserver`**: Watches for external width changes (e.g. container resize) that could reflow text, calling `adjustHeight()` to recalculate.
4. **Cleanup**: Observer is disconnected in `onBeforeUnmount`.

The `autoHeightResizeMap` object maps `resize` prop values to their auto-height equivalent, stripping vertical resize while preserving horizontal.

#### Slot Priority

When both `errorMessage` and `helpText` slots are provided, error takes precedence (only shown when `error` prop is true). The `ariaDescribedBy` computed uses `useSlots()` (runtime) to detect which slots are provided, following the same priority: error ID > help ID. This matches `FzInput`'s approach where `defineSlots` is only for TypeScript typing.

### Testing

#### Running Tests

```bash
pnpm --filter @fiscozen/textarea test:unit
pnpm --filter @fiscozen/textarea coverage
```

#### Test Structure

Tests are organized in nested `describe` blocks:
- **Rendering**: Basic component rendering, FzAlert integration
- **Props**: Each prop has its own `describe` block
- **Events**: Native event forwarding via $attrs, v-model
- **Expose**: `textareaRef` availability and type
- **Accessibility**: ARIA attributes (including `aria-labelledby`), role="alert", decorative icons, keyboard navigation
- **CSS Classes**: Static and dynamic class application
- **Edge Cases**: Null/undefined/empty values, special characters, combined states (error+disabled, help+disabled, required+help)
- **Auto Height**: Resize class mapping, warnings (maxRows without autoHeight, vertical resize), height adjustment, overflow-y behavior
- **Snapshots**: All major states and combinations with explicit IDs for stability

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

## Breaking Changes

### Removed `errorMessage` and `helpMessage` props (replaced with slots)

The `errorMessage` and `helpMessage` props have been removed. Error and help content are now provided via named slots, aligning with `FzInput` and `FzSelect` patterns.

**Before:**
```vue
<FzTextarea label="Notes" :error="hasError" errorMessage="Error text" helpMessage="Help text" />
```

**After:**
```vue
<FzTextarea label="Notes" :error="hasError">
  <template #errorMessage>Error text</template>
  <template #helpText>Help text</template>
</FzTextarea>
```

### Deprecated `size` prop

The `size` prop is accepted but ignored. The textarea always uses `text-base` (16px). A runtime warning is emitted when any value is passed. Will be removed in the next major version.

### Removed `FzTextareaEvents` type and explicit event emits

Native DOM events (`blur`, `focus`, `paste`, etc.) are no longer declared via `defineEmits`. They are forwarded automatically to the native `<textarea>` via `v-bind="$attrs"` (with `inheritAttrs: false`). The `FzTextareaEvents` type has been removed from exports.

**Before:**
```vue
<FzTextarea label="Notes" @blur="onBlur" />
<!-- Worked via defineEmits + explicit emit('blur', $event) -->
```

**After:**
```vue
<FzTextarea label="Notes" @blur="onBlur" @keydown="onKeydown" />
<!-- Works via $attrs forwarding. Any native event is supported. -->
```
