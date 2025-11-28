# @fiscozen/select

A dropdown select component with floating panel, lazy loading, keyboard navigation, and full accessibility support.

## Features

- **Dropdown selection** with floating panel positioning
- **Lazy loading** for performance with large option lists
- **Grouped options** with label separators
- **Custom icons** (left and right positions)
- **Error and help states** with custom slots
- **Floating label variant** for compact forms
- **Keyboard navigation** with full ARIA support
- **WCAG 2.1 AA compliant** accessibility

## Installation

```bash
npm install @fiscozen/select
```

## Basic Usage

```vue
<script setup>
import { ref } from 'vue'
import { FzSelect } from '@fiscozen/select'

const selectedValue = ref('')

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' }
]
</script>

<template>
  <FzSelect
    v-model="selectedValue"
    :options="options"
    label="Select an option"
    placeholder="Choose..."
    environment="frontoffice"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `FzSelectOptionsProps[]` | **required** | List of options to display in the dropdown |
| `label` | `string` | - | Label displayed above the select input |
| `placeholder` | `string` | - | Placeholder text shown when no option is selected |
| `required` | `boolean` | `false` | Marks the select as required (shows asterisk) |
| `disabled` | `boolean` | `false` | Disables the select input |
| `readonly` | `boolean` | `false` | Makes the select readonly (same visual style as disabled) |
| `error` | `boolean` | `false` | Shows error state styling |
| `environment` | `'backoffice' \| 'frontoffice'` | `'frontoffice'` | Environment context for styling (affects button height and text size) |
| `clearable` | `boolean` | `true` | Allows clearing the selected value by clicking the selected option again |
| `noResultsMessage` | `string` | `'Nessun risultato trovato'` | Message displayed when no options are available |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | **Deprecated:** Size prop is deprecated. The component now uses a fixed 'lg' size. This prop will be removed in a future version. |
| `leftIcon` | `string` | - | Icon name to display on the left |
| `rightIcon` | `string` | - | Icon name to display on the right |
| `rightIconButton` | `boolean` | `false` | Renders right icon as a button instead of icon |
| `rightIconButtonVariant` | `IconButtonVariant` | - | Variant for right icon button |
| `rightIconLast` | `boolean` | `false` | **Deprecated:** rightIconLast prop is deprecated. The right icon is now always positioned before the chevron. This prop will be removed in a future version. |
| `pickerClass` | `string` | - | Custom CSS classes for the picker button |
| `variant` | `'normal' \| 'floating-label'` | `'normal'` | Select variant style |
| `optionsToShow` | `number` | `25` | Number of options to render per batch (lazy loading) |
| `floatingPanelMaxHeight` | `string` | - | Maximum height for the floating panel |
| `disableTruncate` | `boolean` | `false` | Disables text truncation in options |
| `extOpener` | `HTMLElement` | - | External element to use as opener |
| `overrideOpener` | `Ref<HTMLElement>` | - | Override opener reference for floating positioning |
| `position` | `FzFloatingPosition` | `'auto-vertical-start'` | Floating panel position |
| `teleport` | `boolean` | `true` | Teleport panel to body |
| `useViewport` | `boolean` | `true` | Use viewport constraints for positioning |

### Option Types

Options can be either selectable items or group labels:

```typescript
// Selectable option
{ value: '1', label: 'Option 1', subtitle?: 'Optional subtitle' }

// Group label
{ kind: 'label', label: 'Group Name' }
```

## Slots

| Slot | Description |
|------|-------------|
| `opener` | Custom opener button (receives `handlePickerClick`, `isOpen`, `floating` props) |
| `error` | Error message content (shown when `error={true}`) |
| `help` | Help text content (shown when no error) |

## Examples

### Basic Select

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    label="Country"
    placeholder="Select a country"
  />
</template>
```

### With Icons

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    label="Search"
    leftIcon="magnifying-glass"
    rightIcon="xmark"
    :rightIconButton="true"
    @fzselect:right-icon-click="clearSelection"
  />
</template>
```

### Grouped Options

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="groupedOptions"
    label="Category"
  />
</template>

<script setup>
const groupedOptions = [
  { kind: 'label', label: 'Fruits' },
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { kind: 'label', label: 'Vegetables' },
  { value: 'carrot', label: 'Carrot' },
  { value: 'lettuce', label: 'Lettuce' }
]
</script>
```

### Error State

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    label="Required Field"
    :required="true"
    :error="hasError"
  >
    <template #error>
      Please select an option
    </template>
  </FzSelect>
</template>
```

### Help Text

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    label="Select"
  >
    <template #help>
      Choose the best option for your needs
    </template>
  </FzSelect>
</template>
```

### Floating Label Variant

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    variant="floating-label"
    placeholder="Select..."
    environment="frontoffice"
  />
</template>
```

### Environment Styling

The component supports two environments with different styling:

```vue
<template>
  <!-- Backoffice: 32px height, text-base -->
  <FzSelect
    v-model="selected"
    :options="options"
    environment="backoffice"
    label="Backoffice Select"
  />
  
  <!-- Frontoffice: 44px height, text-lg -->
  <FzSelect
    v-model="selected"
    :options="options"
    environment="frontoffice"
    label="Frontoffice Select"
  />
</template>
```

### Readonly State

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    label="Readonly Select"
    readonly
  />
</template>
```

The `readonly` prop applies the same visual style as `disabled` (grey-100 background/border, grey-300 text) but maintains the same semantic meaning. Keyboard navigation is disabled when readonly.

### Disabled Options

```vue
<script setup>
const options = [
  { value: '1', label: 'Available' },
  { value: '2', label: 'Disabled', disabled: true },
  { value: '3', label: 'Read-only', readonly: true }
]
</script>
```

### Clearable Selection

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
    label="Clearable Select"
    :clearable="true"
  />
</template>
```

The `clearable` prop (default: `true`) allows users to deselect an option by clicking it again. Set to `false` to prevent clearing.

### Custom No Results Message

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="filteredOptions"
    label="Search"
    noResultsMessage="No matches found. Try a different search term."
  />
</template>
```

### Custom Opener

```vue
<template>
  <FzSelect
    v-model="selected"
    :options="options"
  >
    <template #opener="{ handlePickerClick, isOpen }">
      <button @click="handlePickerClick" :class="{ 'open': isOpen }">
        Custom Opener
      </button>
    </template>
  </FzSelect>
</template>
```

## Behavior

### Environment Styling

The component adapts its styling based on the `environment` prop:

- **Backoffice**: Button height 32px, text-base size
- **Frontoffice**: Button height 44px, text-lg size

Label and selected value text maintain uniform styling (16px font-size, 20px line-height) across both environments.

### Lazy Loading

The component implements lazy loading for performance with large option lists. By default, it renders 25 options initially and loads more as the user scrolls. You can control this with the `optionsToShow` prop.

### Positioning

The floating panel automatically positions itself based on available viewport space. It prefers positioning below the opener but will adjust to above if there's not enough space. Use the `position` prop to override this behavior.

### Container Width

The dropdown container width matches the opener width by default, with a minimum width of 240px. It can expand up to the maximum available viewport space.

## Accessibility

The component is fully accessible and WCAG 2.1 AA compliant:

- **Keyboard navigation**: Full keyboard support for opening, navigating, and selecting options
- **Screen reader support**: Proper ARIA attributes and live region announcements
- **Semantic HTML**: Uses `role="listbox"` and `role="option"` for proper semantics
- **Focus management**: Automatic focus handling on open/close with focus trap
- **State announcements**: Screen readers announce open/closed state, selected option, and focused option

### Keyboard Navigation

The component supports comprehensive keyboard navigation:

**Opener Button:**
- `Enter` / `Space`: Open dropdown (if closed) or close dropdown (if open)
- `Escape`: Close dropdown (if open)
- `Tab`: Move focus to next element
- `Shift+Tab`: Move focus to previous element

**Options Container (when dropdown is open):**
- `ArrowDown`: Move focus to next option (wraps to first on last option)
- `ArrowUp`: Move focus to previous option (wraps to last on first option)
- `Home`: Move focus to first option
- `End`: Move focus to last option
- `Enter` / `Space`: Select focused option and close dropdown
- `Escape`: Close dropdown without selecting
- `Tab`: Move focus to next option (wraps to first on last option) - focus trap active
- `Shift+Tab`: Move focus to previous option (wraps to last on first option) - focus trap active

**Readonly/Disabled States:**
- When `readonly` or `disabled` is `true`, keyboard navigation is disabled
- Focus trap is not active when component is readonly or disabled

### Focus Management

- **On open**: Focus automatically moves to first selectable option (or selected option if present)
- **On close**: Focus automatically returns to opener button
- **Focus trap**: When dropdown is open, Tab/Shift+Tab navigation is trapped within the options list
- **Dynamic updates**: Focus management handles prop changes (readonly/disabled) gracefully

### Screen Reader Support

The component provides rich semantic information to assistive technologies:

- **ARIA attributes**: All interactive elements have proper ARIA roles and states
- **Live announcements**: Screen readers announce focused option via `aria-activedescendant`
- **State changes**: Open/closed state and selection changes are announced
- **Label associations**: Proper `aria-labelledby` relationships for form integration

### ARIA Attributes

**Opener Button:**
- `aria-expanded`: Indicates dropdown open/closed state (`"true"` or `"false"`)
- `aria-haspopup="listbox"`: Declares dropdown type
- `aria-labelledby`: Links to label element (when label is provided)
- `aria-label`: Provides accessible name when label is not present
- `aria-required`: Indicates required fields (`"true"` or `"false"`)
- `aria-invalid`: Indicates error state (`"true"` or `"false"`)
- `aria-disabled`: Indicates disabled/readonly state (`"true"` or `"false"`)

**Options Container:**
- `role="listbox"`: Declares the container as a listbox
- `aria-labelledby`: Links to opener button for context
- `aria-activedescendant`: Points to currently focused option (dynamically updated)

**Option Elements (FzAction components):**
- `role="option"`: Declares each option as a listbox option
- `aria-selected`: Indicates selected option (`"true"` or `"false"`)
- `aria-disabled`: Indicates disabled/readonly option (`"true"` or `"false"`)
- Unique `id` attributes for `aria-activedescendant` reference
- `tabindex`: 0 when focused, -1 otherwise (for keyboard navigation)
- `focused`: Visual focus state managed by FzSelect

**Note:** Options are rendered using `FzAction` components from `@fiscozen/action`, which handle their own accessibility attributes and keyboard interactions. FzSelect manages the overall listbox behavior and focus state.
