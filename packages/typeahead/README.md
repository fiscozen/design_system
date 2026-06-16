# @fiscozen/typeahead

> ⚠️ **Deprecated.** This package is deprecated. Use [`@fiscozen/select`](../select/README.md) with `filterable: true` (optionally paired with `filterFn`) instead. The package and its npm releases remain in place for backward compatibility, but no new features will be developed and existing call sites should migrate to `FzSelect`. See [Migration to FzSelect](#migration-to-fzselect) below.

> For usage documentation, see [Storybook Documentation](https://storybook-url/FzTypeahead)

## Migration to FzSelect

`FzSelect` is a superset of `FzTypeahead`: the same floating panel, lazy-loading, Fuse.js-powered filtering, and keyboard navigation, exposed through a corrected prop name and a wider option-value type. Replace `FzTypeahead` with `FzSelect` and apply the following changes.

### Props

| FzTypeahead | FzSelect | Notes |
| --- | --- | --- |
| `filtrable` (default `true`) | `filterable` (default `false`) | Spelling fix **and** default flipped. To keep typeahead behavior you must explicitly pass `:filterable="true"`. |
| `filterFn` | `filterFn` | Same signature: `(text?: string) => FzSelectOptionsProps[] \| Promise<FzSelectOptionsProps[]>`. Available only when `filterable` is `true`. |
| `delayTime` | `delayTime` | Identical, default 500ms. |
| `fuzzySearch` | `fuzzySearch` | Identical, default `true`. |
| `options: FzTypeaheadOptionsProps[]` | `options: FzSelectOptionsProps[]` | Same shape; option `value` is now `string \| number` (was `string` only). |
| `label`, `placeholder`, `required`, `disabled`, `readonly`, `error`, `clearable`, `noResultsMessage`, `leftIcon`/`leftIconVariant`, `rightIcon`/`rightIconVariant`, `rightIconButton`/`rightIconButtonVariant`, `pickerClass`, `extOpener`, `floatingPanelMaxHeight`, `optionsToShow`, `disableTruncate`, `environment`, `variant`, `position`, `teleport` | Same names, same defaults | No changes required. |

`FzSelect` also adds props absent from `FzTypeahead`: `highlighted` / `highlightedDescription` (warning state, two-way via `v-model:highlighted`) and `aiReasoning` / `aiReasoningDescription` (AI-suggestion state, two-way via `v-model:aiReasoning`).

### Events

| FzTypeahead | FzSelect | Notes |
| --- | --- | --- |
| `fztypeahead:select` (payload: `value`) | `fzselect:select` (payload: `value, option`) | Now also receives the full option object as the second argument. |
| — | `fzselect:clear` | Emitted when the selection is cleared. |
| — | `fzselect:right-icon-click` | Emitted when the right icon button is clicked. |
| `update:modelValue` (`string \| undefined`) | `update:modelValue` (`string \| number \| undefined`) | Wider type to match the option `value`. |

### `filterable` + `filterFn` in practice

- Setting `filterable: true` makes the opener switch to an input when the dropdown is open; typing filters the list.
- When you also pass `filterFn`, `FzSelect` calls it with the debounced search text (`delayTime` ms after the user stops typing) and uses its return value as the options list, bypassing the built-in Fuse.js / substring matcher entirely.
- `filterFn` may be synchronous (`(text?) => FzSelectOptionsProps[]`) or asynchronous (`(text?) => Promise<FzSelectOptionsProps[]>`); use the async form for server-side searches.
- Without `filterFn`, filtering happens client-side over the `options` prop using Fuse.js (or a case-insensitive `includes` when `fuzzySearch: false`).
- There is no automatic cancellation: if multiple async `filterFn` calls race, the last resolved promise wins. Cancel stale requests in the caller if order matters.

### Before / after

```vue
<!-- Before -->
<FzTypeahead
  v-model="selected"
  :options="options"
  :filterFn="loadOptions"
  label="Search users"
  @fztypeahead:select="onSelect"
/>

<!-- After -->
<FzSelect
  v-model="selected"
  :options="options"
  :filterable="true"
  :filterFn="loadOptions"
  label="Search users"
  @fzselect:select="onSelect"
/>
```

If you were using `FzTypeahead` without filtering (`:filtrable="false"`), drop the prop entirely — `FzSelect`'s default is already non-filterable.

---

## Development

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run dev server: `pnpm dev` (from workspace root)

### Architecture

The `FzTypeahead` component is built on top of `FzSelect`'s architecture, sharing the same floating panel, lazy loading, and keyboard navigation patterns. The key difference is the dual-mode input: when closed, it displays the selected option label; when open, it becomes a filterable input field.

**Key Components:**
- `FzTypeahead.vue`: Main component orchestrating state, filtering, and navigation
- `FzTypeaheadButton.vue`: Opener button that switches between button and input modes
- `FzTypeaheadOptionsList.vue`: Options list with lazy loading support
- `FzTypeaheadLabel.vue`: Label component with required indicator
- `FzTypeaheadHelpError.vue`: Help/error message component

**State Management:**
- `model`: Selected value (string | undefined)
- `searchValue`: Current input text for filtering
- `debouncedSearchValue`: Debounced version of searchValue
- `internalFilteredOptions`: Filtered options after applying filterFn or Fuse.js
- `visibleOptions`: Lazy-loaded subset of filtered options
- `focusedIndex`: Index of currently focused option in `selectableOptions`
- `isOpen`: Dropdown open/closed state

**Filtering Flow:**
1. User types → `searchValue` updates
2. After `delayTime` ms → `debouncedSearchValue` updates
3. `updateFilteredOptions()` called → applies `filterFn` or Fuse.js
4. `internalFilteredOptions` updated → triggers `visibleOptions` reset
5. Scroll triggers lazy loading → `visibleOptions` expands

### Code Organization

- `src/FzTypeahead.vue`: Main component with all business logic
- `src/types.ts`: Type definitions for props and options
- `src/common.ts`: Shared utilities (width calculation, constants)
- `src/utils.ts`: Utility functions (debounce)
- `src/components/`: Internal presentational components
  - `FzTypeaheadButton.vue`: Button/input switcher
  - `FzTypeaheadOptionsList.vue`: Options list renderer
  - `FzTypeaheadLabel.vue`: Label renderer
  - `FzTypeaheadHelpError.vue`: Help/error renderer
  - `types.ts`: Internal component prop types

### Key Concepts

#### Dual-Mode Input

The component uses a dual-mode approach:
- **Closed state**: Button displays selected option label (or placeholder)
- **Open state**: Input field appears for filtering (when `filtrable` is true)

This is handled in `FzTypeaheadButton.vue` using `shouldShowTheInput` computed property that checks `filtrable && isOpen`.

#### Filtering Strategy

The component supports three filtering modes:

1. **Custom `filterFn` (async or sync)**: Takes precedence over default filtering
   - Called with `debouncedSearchValue`
   - Can return Promise for async operations
   - No race condition protection - shows last result received

2. **Fuse.js fuzzy search**: Default when `filtrable` is true, `fuzzySearch` is true, and no `filterFn`
   - Searches in `label` field
   - Handles typos and partial matches
   - Only active when input has value
   - Can be disabled by setting `fuzzySearch: false` to use simple `includes()` search instead

3. **Simple includes search**: When `filtrable` is true, `fuzzySearch` is false, and no `filterFn`
   - Uses case-insensitive `includes()` for substring matching
   - Does not handle typos (exact substring match only)
   - Only active when input has value

4. **No filtering**: When `filtrable` is false or input is empty
   - Shows all available options

#### Lazy Loading

Options are rendered in batches for performance:
- Initial load: First `optionsToShow` (default 25) options
- Scroll trigger: Loads next batch when user scrolls near bottom
- Buffer: `OPTIONS_BUFFER * OPTIONS_HEIGHT` pixels from bottom triggers load
- Selected option: Automatically loaded if beyond visible range

#### Keyboard Navigation with Disabled Options

The component navigates through all options (including disabled/readonly) for WCAG compliance:
- `selectableOptions`: All selectable options (excluding labels, including disabled/readonly)
- `focusedIndex`: Points to index in `selectableOptions`
- Navigation traverses all options but disabled/readonly options receive focus without visual indication
- Tab navigation allows traversing disabled options for accessibility

#### Scroll Reset on Filter Change

When `internalFilteredOptions` changes (due to filtering or options update):
- `visibleOptions` resets to first batch
- Scroll position resets to top via `resetScrollPosition()`
- Prevents showing wrong options after filter change

### Testing

#### Running Tests

```bash
pnpm test:unit
pnpm coverage
```

#### Test Structure

- Unit tests in `src/__tests__/FzTypeahead.test.ts`
- Test naming: `describe` blocks for feature groups, `it` blocks for specific cases
- Coverage requirement: >90% line coverage
- Use `mount` from `@vue/test-utils` for component testing

#### Test Coverage

Tests cover:
- Rendering and props
- v-model binding
- Options filtering (Fuse.js and custom filterFn)
- Lazy loading
- Keyboard navigation (including disabled options)
- Focus management
- Error and help states
- Accessibility attributes
- Edge cases (empty options, undefined options, etc.)

### Adding Features

#### Step 1: Update Types

Add new props to `src/types.ts` with JSDoc:
```typescript
/**
 * Description of the prop
 * @default 'defaultValue' if applicable
 */
newProp?: string
```

#### Step 2: Implement Logic

Add computed properties, handlers, etc. in `src/FzTypeahead.vue`:
- Follow Representation-First pattern for conditional styling
- Use Information Expert pattern (pass full objects to helpers)
- Extract repeated logic to helper functions

#### Step 3: Update Template

Add new UI elements in template section:
- Maintain section order: `<script>` → `<template>` → `<style>`
- Use semantic HTML and ARIA attributes

#### Step 4: Add Tests

Write unit tests for new functionality:
- Test positive and negative cases
- Test edge cases (null, undefined, empty values)
- Test accessibility features

#### Step 5: Update Documentation

- Update MDX with usage examples
- Update README if architecture/logic changed

### Build & Release

- Build: `pnpm build`
- Version: Follow semver
- Publish: `pnpm publish` (from workspace root)

### Internal Logic

#### Width Calculation Algorithm

The `calculateContainerWidth()` function in `src/common.ts`:
1. Measures opener element's bounding rect
2. Sets minWidth to max(opener width, MIN_WIDTH)
3. Calculates available space on left and right
4. Sets maxWidth to opener width + max(spaceLeft, spaceRight)

This ensures dropdown matches opener width while respecting viewport boundaries.

#### Focus Management

Focus flow when opening dropdown:
1. If `filtrable`: Focus moves to input field (`FzInput` inside `FzTypeaheadButton`)
2. If not `filtrable`: Focus moves to first enabled option
3. If option selected: Focus moves to selected option (if enabled)

Focus flow when closing:
1. Focus returns to opener button
2. `focusedIndex` resets to -1

#### Filtering Race Conditions

When `filterFn` is async and called multiple times rapidly:
- No cancellation mechanism - all calls proceed
- Last result received is shown (may overwrite earlier results)
- Developer responsibility to handle race conditions (e.g., request cancellation)

This design choice prioritizes simplicity and developer control over automatic race condition handling.

### Design Decisions

#### Why Dual-Mode Input Instead of Always-Input?

The dual-mode approach (button when closed, input when open) provides:
- Better UX: Selected value clearly visible when not filtering
- Space efficiency: Input only appears when needed
- Familiar pattern: Matches common typeahead implementations

#### Why No Race Condition Protection for filterFn?

Race condition handling is left to the developer because:
- Different use cases need different strategies (cancellation, debouncing, queuing)
- Automatic cancellation could hide bugs in developer's code
- Simpler API: Just show the last result received

#### Why Navigate Through All Options (Including Disabled)?

Navigating through all options (including disabled/readonly) for WCAG compliance:
- Screen readers can announce all options, including disabled ones
- Keyboard users can traverse the full list for context
- Disabled options receive focus but without visual indication
- Better accessibility: users understand the full option set

#### Why Representation-First Pattern for Styling?

Using `switch(true)` with helper functions for conditional styling:
- Explicit mapping: "when does component look like X?"
- Maintainable: Adding new visual state = adding new case
- Self-documenting: Structure answers "when does it look like X?"
- Testable: Helper functions can be tested in isolation

### Dependencies

**Peer Dependencies:**
- `vue`: ^3.4.13
- `tailwindcss`: ^3.4.1

**Dependencies:**
- `@fiscozen/composables`: Floating panel positioning
- `@fiscozen/action`: Options list rendering
- `@fiscozen/input`: Input field component
- `@fiscozen/icons`: Icon components
- `@fiscozen/progress`: Loading indicator
- `fuse.js`: Fuzzy search library

**Dev Dependencies:**
- `@fiscozen/select`: Type imports for deprecated props
- Standard testing and build tools (vitest, vite, typescript, etc.)

### Performance Considerations

- **Lazy Loading**: Automatic for large lists (100+ items)
- **Debouncing**: Configurable via `delayTime` (default 500ms)
- **Fuse.js**: Only instantiated when needed (computed property)
- **Scroll Listener**: Attached once, cleaned up on unmount
- **Watch Optimizations**: Uses `immediate: true` only when needed

### Known Limitations

- **No Multi-select**: Single selection only
- **No Virtual Scrolling**: Lazy loading loads batches, but all visible options are in DOM
- **No filterFn Cancellation**: Async filterFn calls are not cancelled automatically

