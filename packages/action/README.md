# @fiscozen/action

Versatile action components for building interactive lists, menus, and selectable options.

## Features

- **FzAction**: Flexible action component that can render as button or link
- **FzActionList**: Container for organizing multiple actions
- **FzActionSection**: Section separator with label for grouping actions
- Multiple variants: `textLeft`, `textCenter`, `onlyIcon`
- Environment-specific styling: `backoffice` (compact) and `frontoffice` (spacious)
- Full accessibility support with configurable ARIA roles
- Keyboard navigation and focus management
- Disabled and readonly states
- Text truncation with ellipsis
- Icon positioning (left, right, or icon-only)

## Installation

```bash
npm install @fiscozen/action
```

## Basic Usage

### FzAction as Button

```vue
<script setup>
import { FzAction } from '@fiscozen/action'
</script>

<template>
  <FzAction
    type="action"
    variant="textLeft"
    label="Click me"
    @click="handleClick"
  />
</template>
```

### FzAction as Link

```vue
<script setup>
import { FzAction } from '@fiscozen/action'
</script>

<template>
  <FzAction
    type="link"
    variant="textLeft"
    label="Go to page"
    to="/page"
  />
</template>
```

### FzActionList with Multiple Actions

```vue
<script setup>
import { FzActionList, FzAction } from '@fiscozen/action'
</script>

<template>
  <FzActionList>
    <FzAction type="action" variant="textLeft" label="Edit" />
    <FzAction type="action" variant="textLeft" label="Delete" />
    <FzAction type="action" variant="textLeft" label="Share" />
  </FzActionList>
</template>
```

### FzActionSection for Grouping

```vue
<script setup>
import { FzActionList, FzAction, FzActionSection } from '@fiscozen/action'
</script>

<template>
  <FzActionList>
    <FzActionSection label="File" />
    <FzAction type="action" variant="textLeft" label="New" />
    <FzAction type="action" variant="textLeft" label="Open" />
    
    <FzActionSection label="Edit" />
    <FzAction type="action" variant="textLeft" label="Cut" />
    <FzAction type="action" variant="textLeft" label="Copy" />
  </FzActionList>
</template>
```

## Props

### FzAction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'action' \| 'link'` | `'action'` | Component type (button or link) |
| `variant` | `'textLeft' \| 'textCenter' \| 'onlyIcon'` | `'textLeft'` | Layout variant |
| `environment` | `'backoffice' \| 'frontoffice'` | `'backoffice'` | Environment styling (compact vs spacious) |
| `label` | `string` | - | Main label text |
| `subLabel` | `string` | - | Secondary text below main label |
| `disabled` | `boolean` | `false` | Disables the action |
| `readonly` | `boolean` | `false` | Makes action non-interactive but visually normal |
| `focused` | `boolean` | `false` | Visual focus state (for keyboard navigation) |
| `isTextTruncated` | `boolean` | `false` | Enables text truncation with ellipsis |
| `iconLeftName` | `string` | - | FontAwesome icon name (left side) |
| `iconLeftVariant` | `IconVariant` | - | FontAwesome icon variant (left side) |
| `iconRightName` | `string` | - | FontAwesome icon name (right side) |
| `iconRightVariant` | `IconVariant` | - | FontAwesome icon variant (right side) |
| `id` | `string` | - | Unique ID for ARIA relationships |
| `role` | `string` | - | ARIA role (e.g., `"option"`, `"menuitem"`) |
| `ariaSelected` | `boolean` | - | ARIA selected state (for `role="option"`) |

**Link-specific props (when `type="link"`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `RouteLocationRaw` | - | Router link destination (required) |
| `replace` | `boolean` | `false` | Use replace navigation |
| `target` | `string` | - | Link target (e.g., `"_blank"`) |
| `external` | `boolean` | `false` | External link flag |

**Icon-only variant props (when `variant="onlyIcon"`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `iconName` | `string` | - | FontAwesome icon name (required) |
| `iconVariant` | `IconVariant` | - | FontAwesome icon variant (required) |

### FzActionList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `listClass` | `string` | `''` | Additional CSS classes for the list |
| `role` | `string` | - | ARIA role for the list (e.g., `"listbox"`, `"menu"`) |
| `ariaLabelledby` | `string` | - | ID of element that labels the list |
| `ariaActivedescendant` | `string` | - | ID of currently active descendant |

### FzActionSection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `''` | Section label text |

## Events

### FzAction

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when action is clicked |
| `keydown` | `KeyboardEvent` | Emitted on keydown (Enter/Space trigger click) |

## Accessibility

### ARIA Roles

The `role` prop allows configuring the semantic role of the action:

**As a listbox option (e.g., in FzSelect):**
```vue
<FzActionList role="listbox" aria-labelledby="select-label">
  <FzAction
    type="action"
    variant="textLeft"
    label="Option 1"
    role="option"
    :ariaSelected="true"
  />
  <FzAction
    type="action"
    variant="textLeft"
    label="Option 2"
    role="option"
    :ariaSelected="false"
  />
</FzActionList>
```

**As a menu:**
```vue
<FzActionList role="menu">
  <FzAction
    type="action"
    variant="textLeft"
    label="Edit"
    role="menuitem"
  />
  <FzAction
    type="action"
    variant="textLeft"
    label="Delete"
    role="menuitem"
  />
</FzActionList>
```

### Keyboard Navigation

- **Enter/Space**: Triggers the action (when focused)
- **Tab**: Moves focus to next focusable element
- **Arrow keys**: Managed by parent component (e.g., FzSelect)

### Screen Reader Support

- `aria-disabled`: Always present with explicit `"true"` or `"false"` values
- `aria-selected`: Added when `role="option"` to indicate selection state
- `aria-label`: Automatically computed for icon-only variants
- Text truncation: Full text available via `title` attribute

## Examples

### Icon-Only Action

```vue
<FzAction
  type="action"
  variant="onlyIcon"
  iconName="trash"
  iconVariant="solid"
  label="Delete"
  @click="handleDelete"
/>
```

### Action with Icons

```vue
<FzAction
  type="action"
  variant="textLeft"
  label="Settings"
  iconLeftName="gear"
  iconLeftVariant="solid"
  iconRightName="chevron-right"
  iconRightVariant="solid"
/>
```

### Action with SubLabel

```vue
<FzAction
  type="action"
  variant="textLeft"
  label="John Doe"
  subLabel="john.doe@example.com"
  iconLeftName="user"
  iconLeftVariant="solid"
/>
```

### Disabled Action

```vue
<FzAction
  type="action"
  variant="textLeft"
  label="Unavailable"
  disabled
/>
```

### Readonly Action

```vue
<FzAction
  type="action"
  variant="textLeft"
  label="Read Only"
  readonly
/>
```

### Text Truncation

```vue
<FzAction
  type="action"
  variant="textLeft"
  label="Very long text that will be truncated with ellipsis"
  isTextTruncated
/>
```

### Environment Variants

```vue
<!-- Backoffice (compact) -->
<FzAction
  type="action"
  variant="textLeft"
  environment="backoffice"
  label="Compact action"
/>

<!-- Frontoffice (spacious) -->
<FzAction
  type="action"
  variant="textLeft"
  environment="frontoffice"
  label="Spacious action"
/>
```

## Notes

- **Default environment**: `backoffice` (compact styling)
- **Icon variants**: Requires `@fiscozen/icons` package
- **Link functionality**: Requires `vue-router` and `@fiscozen/link` package
- **ARIA roles**: Optional but recommended for accessibility in complex components
- **Text truncation**: Applies to both `label` and `subLabel`
- **Readonly vs Disabled**: Readonly maintains normal appearance but prevents interaction; disabled shows greyed-out appearance

## Related Components

- **FzSelect**: Uses `FzAction` with `role="option"` for dropdown options
- **FzLink**: Base link component used when `type="link"`
- **FzIcon**: Icon component from `@fiscozen/icons`
