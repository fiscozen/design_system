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
| `error` | `boolean` | `false` | Shows error state styling |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the select input |
| `leftIcon` | `string` | - | Icon name to display on the left |
| `rightIcon` | `string` | - | Icon name to display on the right |
| `rightIconButton` | `boolean` | `false` | Renders right icon as a button instead of icon |
| `rightIconButtonVariant` | `IconButtonVariant` | - | Variant for right icon button |
| `rightIconLast` | `boolean` | `false` | Positions right icon after chevron |
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
  />
</template>
```

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

### Lazy Loading

The component implements lazy loading for performance with large option lists. By default, it renders 25 options initially and loads more as the user scrolls. You can control this with the `optionsToShow` prop.

### Positioning

The floating panel automatically positions itself based on available viewport space. It prefers positioning below the opener but will adjust to above if there's not enough space. Use the `position` prop to override this behavior.

### Container Width

The dropdown container width matches the opener width by default, with a minimum width of 240px. It can expand up to the maximum available viewport space.

## Accessibility

The component is fully accessible and WCAG 2.1 AA compliant:

- **Keyboard navigation**: Tab to focus, Enter/Space to open, Arrow keys to navigate, Escape to close
- **Screen reader support**: Proper ARIA attributes (`aria-expanded`, `aria-haspopup`, `aria-labelledby`, `aria-required`, `aria-invalid`)
- **Semantic HTML**: Uses `role="listbox"` and `role="option"` for proper semantics
- **Focus management**: Focus returns to opener when dropdown closes
- **State announcements**: Screen readers announce open/closed state and selected option

### ARIA Attributes

- `aria-expanded`: Indicates dropdown open/closed state
- `aria-haspopup="listbox"`: Declares dropdown type
- `aria-labelledby`: Links to label element
- `aria-label`: Provides accessible name when label is not present
- `aria-required`: Indicates required fields
- `aria-invalid`: Indicates error state
- `aria-disabled`: Indicates disabled state
- `aria-selected`: Indicates selected option in list
