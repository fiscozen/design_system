# @fiscozen/button

A comprehensive button component library for Vue 3 applications, featuring multiple variants, sizes, and icon support.

## Features

- **Multiple Variants**: Primary, Secondary, Invisible, Danger, and Success styles
- **Environment-Based Sizing**: Two environment options (backoffice, frontoffice) for different use cases
- **Icon Support**: Built-in icon integration with customizable positioning
- **Accessibility**: Full keyboard navigation and ARIA support
- **Customizable**: Flexible styling with container class overrides
- **TypeScript**: Full type safety with TypeScript definitions
- **Semantic Colors**: Uses design system tokens for consistent theming

## Installation

```bash
pnpm add @fiscozen/button
```

## Components

This package exports three components:

- `FzButton` - Standard button with label and optional icon
- `FzIconButton` - Icon-only button for compact interfaces
- `FzButtonGroup` - Container for grouping related buttons

## Basic Usage

### FzButton

```vue
<script setup lang="ts">
import { FzButton } from '@fiscozen/button'
</script>

<template>
  <FzButton label="Click me" />
</template>
```

### With Variants

```vue
<template>
  <!-- Primary (default) -->
  <FzButton variant="primary" label="Primary Action" />
  
  <!-- Secondary -->
  <FzButton variant="secondary" label="Secondary Action" />
  
  <!-- Invisible -->
  <FzButton variant="invisible" label="Subtle Action" />
  
  <!-- Danger -->
  <FzButton variant="danger" label="Delete" />
  
  <!-- Success -->
  <FzButton variant="success" label="Confirm" />
</template>
```

### With Icons

```vue
<template>
  <!-- Icon before label (default) -->
  <FzButton 
    label="Save" 
    iconName="save" 
    iconPosition="before" 
  />
  
  <!-- Icon after label -->
  <FzButton 
    label="Next" 
    iconName="arrow-right" 
    iconPosition="after" 
  />
  
  <!-- Custom icon variant -->
  <FzButton 
    label="Settings" 
    iconName="gear" 
    iconVariant="fas" 
  />
</template>
```

### Environment (Size)

```vue
<template>
  <!-- Frontoffice environment (default) -->
  <FzButton environment="frontoffice" label="Frontoffice Button" />
  
  <!-- Backoffice environment -->
  <FzButton environment="backoffice" label="Backoffice Button" />
</template>
```

### Size Prop (Deprecated)

The `size` prop is deprecated but still functional for backward compatibility. Use `environment` instead:

```vue
<template>
  <FzButton size="lg" label="Legacy Large" />
</template>
```

### Disabled State

```vue
<template>
  <FzButton label="Disabled Button" :disabled="true" />
</template>
```

### Using Slots

```vue
<template>
  <!-- Default slot (overrides label prop) -->
  <FzButton>
    <span>Custom <strong>HTML</strong> Content</span>
  </FzButton>
  
  <!-- Custom icon slots -->
  <FzButton label="Custom Icon">
    <template #before>
      <CustomIcon />
    </template>
  </FzButton>
  
  <FzButton label="Custom Icon After">
    <template #after>
      <CustomIcon />
    </template>
  </FzButton>
</template>
```

## Props

### FzButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | The text label displayed on the button |
| `tooltip` | `string` | `undefined` | **Deprecated:** Tooltip text (use FzTooltip component instead) |
| `variant` | `'primary' \| 'secondary' \| 'invisible' \| 'danger' \| 'success'` | `'primary'` | Visual style variant |
| `environment` | `'backoffice' \| 'frontoffice'` | `'frontoffice'` | Button environment determining size and spacing |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `undefined` | **Deprecated:** Button size (use `environment` prop instead) |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `iconName` | `string` | `undefined` | FontAwesome icon name (e.g., 'bell', 'save') |
| `iconVariant` | `IconVariant` | `undefined` | FontAwesome icon variant (fas, far, fal, etc.) |
| `iconPosition` | `'before' \| 'after'` | `'before'` | Position of the icon relative to the label |
| `containerClass` | `string` | `undefined` | Additional CSS classes for the label container |
| `overrideContainerClass` | `boolean` | `false` | If true, replaces default container classes instead of merging |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Custom content for the button (overrides `label` prop) |
| `before` | Custom content before the label (replaces icon when provided) |
| `after` | Custom content after the label (replaces icon when provided) |

## Behavior & Concepts

### Label vs Slot Priority

When both `label` prop and default slot are provided, the slot takes precedence:

```vue
<FzButton label="This won't show">
  This will show instead
</FzButton>
```

### Icon Display Logic

Icons are only displayed when both `label` (or default slot) and `iconName` are provided. This ensures proper spacing and layout.

### Container Class Customization

By default, the label container has the `truncate` class to handle text overflow. You can:

1. **Add classes** (default behavior):
```vue
<FzButton label="Text" containerClass="font-bold" />
<!-- Results in: class="truncate font-bold" -->
```

2. **Override completely**:
```vue
<FzButton 
  label="Text" 
  containerClass="custom-class" 
  :overrideContainerClass="true" 
/>
<!-- Results in: class="custom-class" (no truncate) -->
```

## Examples

### Form Actions

```vue
<template>
  <div class="flex gap-12">
    <FzButton 
      variant="primary" 
      label="Submit" 
      @click="handleSubmit"
    />
    <FzButton 
      variant="secondary" 
      label="Cancel" 
      @click="handleCancel"
    />
  </div>
</template>
```

### Destructive Action with Confirmation

```vue
<template>
  <FzButton 
    variant="danger" 
    label="Delete Account" 
    iconName="trash"
    :disabled="!confirmed"
    @click="handleDelete"
  />
</template>
```

### Navigation with Icons

```vue
<template>
  <div class="flex gap-8">
    <FzButton 
      variant="secondary" 
      label="Back" 
      iconName="arrow-left" 
      iconPosition="before"
      environment="backoffice"
    />
    <FzButton 
      variant="primary" 
      label="Continue" 
      iconName="arrow-right" 
      iconPosition="after"
      environment="backoffice"
    />
  </div>
</template>
```

### Loading State (Custom Implementation)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FzButton } from '@fiscozen/button'

const isLoading = ref(false)

async function handleAction() {
  isLoading.value = true
  try {
    await performAction()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <FzButton 
    :disabled="isLoading"
    @click="handleAction"
  >
    <span v-if="isLoading">Loading...</span>
    <span v-else>Submit</span>
  </FzButton>
</template>
```

## Accessibility

FzButton follows WCAG 2.1 AA standards and includes:

- **Semantic HTML**: Renders as a native `<button>` element with `type="button"`
- **Keyboard Navigation**: Full support for Enter and Space keys
- **ARIA Attributes**: 
  - `aria-disabled` is always present with explicit `"true"` or `"false"` values (Vue 3 compatible)
- **Disabled State**: Properly prevents click events and visual feedback when disabled
- **Screen Reader Compatible**: Works with NVDA, JAWS, and VoiceOver
- **Focus Indicators**: Visible focus states with 3:1 contrast ratio (blue border)
- **Color Contrast**: All variants meet 4.5:1 contrast ratio for text

## Notes



### Environment vs Size

The button supports two environments that determine sizing:
- **backoffice**: Compact button for internal applications
- **frontoffice**: Larger button for customer-facing interfaces (default)

The deprecated `size` prop maps to environments as follows:
- `xs`, `sm`, `md` → maps to `backoffice`
- `lg` → maps to `frontoffice`

### Variant Selection

The `variant` attribute is used instead of `type` to avoid confusion with the HTML `type` attribute on button elements.

## FzButtonGroup

Container for grouping buttons in a horizontal layout with fixed spacing. Uses `FzContainer` component internally to display buttons in a row with consistent gap between them. Children divide available space equally and never wrap to a new line. Component occupies 100% width of its container.

### Features

- Horizontal layout only
- Fixed gap spacing
- Children divide available space equally
- No wrapping - buttons stay on a single row
- 100% width of container
- No props required

### Basic Usage

```vue
<script setup>
import { FzButtonGroup, FzButton } from '@fiscozen/button'
</script>

<template>
  <FzButtonGroup>
    <FzButton variant="primary">Save</FzButton>
    <FzButton variant="secondary">Cancel</FzButton>
    <FzButton variant="secondary">Delete</FzButton>
  </FzButtonGroup>
</template>
```

### FzButtonGroup Props

No props required. The component always displays buttons horizontally with a fixed 16px gap.

**Deprecated Props:**

The following props are deprecated and will be removed in a future version. They are maintained for backward compatibility but have no effect:

- `horizontal` - Component is always horizontal. This prop will be ignored.
- `gap` - Component always uses fixed gap spacing. This prop will be ignored.
- `size` - Component always uses fixed gap size. This prop will be ignored.

A runtime warning will be displayed when these props are used. Please remove them from your code.

### FzButtonGroup Examples

#### Action Buttons Group

```vue
<template>
  <FzButtonGroup>
    <FzButton variant="primary">Primary Action</FzButton>
    <FzButton variant="secondary">Secondary Action</FzButton>
    <FzButton variant="invisible">Cancel</FzButton>
  </FzButtonGroup>
</template>
```

#### Two Buttons (Frontoffice)

```vue
<template>
  <FzButtonGroup>
    <FzButton variant="primary" environment="frontoffice">Save</FzButton>
    <FzButton variant="secondary" environment="frontoffice">Cancel</FzButton>
  </FzButtonGroup>
</template>
```

#### Two Buttons (Backoffice)

```vue
<template>
  <FzButtonGroup>
    <FzButton variant="primary" environment="backoffice">Save</FzButton>
    <FzButton variant="secondary" environment="backoffice">Cancel</FzButton>
  </FzButtonGroup>
</template>
```

#### Three Buttons (Frontoffice)

```vue
<template>
  <FzButtonGroup>
    <FzButton variant="primary" environment="frontoffice">Save</FzButton>
    <FzButton variant="secondary" environment="frontoffice">Cancel</FzButton>
    <FzButton variant="secondary" environment="frontoffice">Delete</FzButton>
  </FzButtonGroup>
</template>
```

#### Three Buttons (Backoffice)

```vue
<template>
  <FzButtonGroup>
    <FzButton variant="primary" environment="backoffice">Save</FzButton>
    <FzButton variant="secondary" environment="backoffice">Cancel</FzButton>
    <FzButton variant="secondary" environment="backoffice">Delete</FzButton>
  </FzButtonGroup>
</template>
```

### FzButtonGroup Behavior

- No configuration needed

### FzButtonGroup Accessibility

The component preserves accessibility attributes of button children:
- Keyboard navigation works correctly
- ARIA labels and descriptions are maintained
- Disabled states are preserved
- Screen readers can navigate through buttons normally

The component itself is a semantic `div` container and does not interfere with button accessibility.

## Related Components

- **FzIconButton**: Use for icon-only buttons without labels
- **FzButtonGroup**: Use to group related buttons with consistent spacing
