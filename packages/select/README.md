# @fiscozen/select

> For usage documentation, see [Storybook Documentation](https://storybook-url/FzSelect)

## Development

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run dev server: `pnpm dev` (from workspace root)

### Architecture

The `FzSelect` component is a unified dropdown select component that supports both standard select behavior (default, when `filterable` is false) and typeahead/filterable behavior (when `filterable` is true). It shares the same floating panel, lazy loading, and keyboard navigation patterns. By default, it behaves as a standard select dropdown. When `filterable` is set to true, the component shows a filterable input field when the dropdown is open; otherwise, it displays the selected option label as a button.

**Key Components:**
- `FzSelect.vue`: Main component orchestrating state, filtering, and navigation
- `FzSelectButton.vue`: Opener button that switches between button and input modes
- `FzSelectOptionsList.vue`: Options list with lazy loading support
- `FzSelectLabel.vue`: Label component with required indicator
- `FzSelectHelpError.vue`: Help/error message component

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

- `src/FzSelect.vue`: Main component with all business logic
- `src/types.ts`: Type definitions for props and options
- `src/common.ts`: Shared utilities (width calculation, constants)
- `src/utils.ts`: Utility functions (debounce)
- `src/components/`: Internal presentational components
  - `FzSelectButton.vue`: Button/input switcher
  - `FzSelectOptionsList.vue`: Options list renderer
  - `FzSelectLabel.vue`: Label renderer
  - `FzSelectHelpError.vue`: Help/error renderer
  - `types.ts`: Internal component prop types

### Key Concepts

#### Dual-Mode Input

The component uses a dual-mode approach when `filterable` is true:
- **Closed state**: Button displays selected option label (or placeholder)
- **Open state**: Input field appears for filtering

When `filterable` is false (default), the component behaves as a standard select dropdown with button-only interaction.

This is handled in `FzSelectButton.vue` using `shouldShowTheInput` computed property that checks `filterable && isOpen`.

#### Filtering Strategy

The component supports three filtering modes:

1. **Custom `filterFn` (async or sync)**: Takes precedence over default filtering
   - Called with `debouncedSearchValue`
   - Can return Promise for async operations
   - No race condition protection - shows last result received

2. **Fuse.js fuzzy search**: When `filterable` is true, `fuzzySearch` is true, and no `filterFn`
   - Searches in `label` field
   - Handles typos and partial matches
   - Only active when input has value
   - Can be disabled by setting `fuzzySearch: false` to use simple `includes()` search instead

3. **Simple includes search**: When `filterable` is true, `fuzzySearch` is false, and no `filterFn`
   - Uses case-insensitive `includes()` for substring matching
   - Does not handle typos (exact substring match only)
   - Only active when input has value

4. **No filtering**: When `filterable` is false (default) or input is empty
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

- Unit tests in `src/__tests__/FzSelect.spec.ts`
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

Add computed properties, handlers, etc. in `src/FzSelect.vue`:
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
1. If `filterable`: Focus moves to input field (`FzInput` inside `FzSelectButton`)
2. If not `filterable`: Focus moves to first enabled option
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
- Familiar pattern: Matches common select implementations

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

