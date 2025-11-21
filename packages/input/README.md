# @fiscozen/input

Flexible input component library for Vue 3 applications, featuring icon support, validation states, multiple variants, and specialized currency input with number formatting.

## Features

- **Multiple Input Types**: text, password, email, number, tel, url
- **Icon Support**: Left and right icons (static or clickable buttons)
- **Validation States**: Error and valid states with visual feedback
- **Two Variants**: Normal and floating-label presentation
- **Two Environments**: frontoffice and backoffice (different heights and styling)
- **Currency Input**: Specialized component with locale-aware number formatting
- **Full Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Customizable**: Slots for label, icons, help text, and error messages
- **TypeScript**: Full type safety with TypeScript definitions

## Installation

```bash
npm install @fiscozen/input
```

## Components

This package exports two components:

- `FzInput` - Standard input with label, icons, and validation states
- `FzCurrencyInput` - Specialized currency input with number formatting and validation

## Basic Usage

### FzInput

```vue
<script setup lang="ts">
import { FzInput } from '@fiscozen/input'
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <FzInput label="Email" type="email" v-model="email" />
</template>
```

### FzCurrencyInput

```vue
<script setup lang="ts">
import { FzCurrencyInput } from '@fiscozen/input'
import { ref } from 'vue'

const amount = ref<number | null>(null)
</script>

<template>
  <FzCurrencyInput label="Amount" v-model:amount="amount" />
</template>
```

## Props

### FzInput Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Text label displayed above the input field. Overridden by label slot if provided. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size affecting height, padding, and text size |
| `placeholder` | `string` | - | Placeholder text shown when input is empty. Behavior differs based on variant. |
| `required` | `boolean` | `false` | Marks input as required. Adds asterisk to label and sets native required attribute. |
| `disabled` | `boolean` | `false` | Disables input interaction and applies disabled styling |
| `error` | `boolean` | `false` | Shows error state with red border and enables errorMessage slot display |
| `valid` | `boolean` | `false` | Shows success checkmark icon on the right when true. Takes precedence over rightIcon |
| `variant` | `'normal' \| 'floating-label'` | `'normal'` | Visual presentation style. 'floating-label' moves placeholder above input when focused/filled |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url'` | `'text'` | Native HTML input type. Determines keyboard layout and validation behavior |
| `leftIcon` | `string` | - | Font Awesome icon name displayed on the left side of input |
| `leftIconVariant` | `IconVariant` | - | Visual style variant for left icon (solid, regular, light, etc.) |
| `leftIconButtonVariant` | `IconButtonVariant` | - | Button variant for left icon when rendered as clickable button |
| `leftIconAriaLabel` | `string` | - | Accessible label for left icon when clickable. Required for screen reader accessibility |
| `rightIcon` | `string` | - | Font Awesome icon name displayed on the right side of input |
| `rightIconSize` | `IconSize` | - | **Deprecated**: Size override for right icon. Icons now have a fixed size of "md". This prop is ignored. |
| `rightIconVariant` | `IconVariant` | - | Visual style variant for right icon (solid, regular, light, etc.) |
| `rightIconButton` | `boolean` | `false` | Renders right icon as clickable button instead of static icon |
| `rightIconButtonVariant` | `IconButtonVariant` | `'invisible'` | Button variant for right icon when rightIconButton is true |
| `rightIconAriaLabel` | `string` | - | Accessible label for right icon when clickable. Required for screen reader accessibility |
| `secondRightIcon` | `string` | - | Font Awesome icon name displayed as second icon on the right side of input. Order: valid > secondRightIcon > rightIcon (all can be present simultaneously) |
| `secondRightIconClass` | `string` | - | Additional CSS classes applied to second right icon container |
| `secondRightIconVariant` | `IconVariant` | - | Visual style variant for second right icon (solid, regular, light, etc.) |
| `secondRightIconButton` | `boolean` | `false` | Renders second right icon as clickable button instead of static icon |
| `secondRightIconButtonVariant` | `IconButtonVariant` | `'invisible'` | Button variant for second right icon when secondRightIconButton is true |
| `secondRightIconAriaLabel` | `string` | - | Accessible label for second right icon when clickable. Required for screen reader accessibility |
| `pattern` | `string` | - | HTML5 pattern attribute for native browser validation |
| `name` | `string` | - | Native name attribute for form submission and identification |
| `readonly` | `boolean` | `false` | Native readonly attribute. Prevents user input while keeping field focusable |
| `maxlength` | `number` | - | Native maxlength attribute. Limits maximum number of characters |
| `rightIconClass` | `string` | - | Additional CSS classes applied to right icon container |
| `leftIconClass` | `string` | - | Additional CSS classes applied to left icon container |

### FzCurrencyInput Props

FzCurrencyInput extends FzInput props (except `type` and `modelValue`) and adds:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nullOnEmpty` | `boolean` | `false` | When true, empty input values are converted to null instead of 0 |
| `minimumFractionDigits` | `number` | `2` | Minimum decimal places in formatted output. Used by Intl.NumberFormat. |
| `maximumFractionDigits` | `number` | `2` | Maximum decimal places in formatted output. Used by Intl.NumberFormat. |
| `min` | `number` | - | Minimum allowed numeric value. Values below this are clamped to min |
| `max` | `number` | - | Maximum allowed numeric value. Values above this are clamped to max |
| `step` | `number` | - | Step increment for arrow buttons and quantization. When forceStep is true, values are rounded to nearest step |
| `forceStep` | `boolean` | `false` | When true, enforces quantization: values are automatically rounded to nearest step multiple |

## Slots

| Slot | Description |
|------|-------------|
| `label` | Custom label content (overrides `label` prop) |
| `left-icon` | Custom left icon content (overrides `leftIcon` prop) |
| `right-icon` | Custom right icon content (overrides `rightIcon` prop and `valid` checkmark) |
| `helpText` | Help text displayed below input when no error is present |
| `errorMessage` | Error message displayed below input when `error` is true |

## Variants

### Normal (Default)

Standard input with label above and placeholder inside the input field.

```vue
<FzInput label="Email" type="email" placeholder="Enter your email" v-model="email" />
```

### Floating Label

Floating label variant moves placeholder above input when focused or when input has a value.

```vue
<FzInput 
  label="Email" 
  variant="floating-label" 
  placeholder="Enter your email" 
  v-model="email" 
/>
```

## Environments

Inputs support two environments that determine their height and styling:

- **frontoffice** (default): larger spacing
- **backoffice**: compact spacing

```vue
<template>
  <FzInput label="Frontoffice (Default)" environment="frontoffice" v-model="value1" />
  <FzInput label="Backoffice" environment="backoffice" v-model="value2" />
</template>
```

**Note**: The `size` prop is deprecated. Use `environment` instead.

## Input Types

### Text

```vue
<FzInput label="Name" type="text" v-model="name" />
```

### Password

```vue
<FzInput label="Password" type="password" v-model="password" />
```

### Email

```vue
<FzInput label="Email" type="email" required v-model="email" />
```

### Number

```vue
<FzInput label="Age" type="number" v-model="age" />
```

### Telephone

```vue
<FzInput 
  label="Phone" 
  type="tel" 
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
  v-model="phone" 
/>
```

### URL

```vue
<FzInput label="Website" type="url" v-model="website" />
```

## States

### Required

Required inputs show an asterisk (*) next to the label and set the native required attribute.

```vue
<FzInput label="Email" type="email" required v-model="email" />
```

### Disabled

Disabled inputs prevent user interaction and apply muted styling.

```vue
<FzInput label="Disabled Input" disabled v-model="value" />
```

### Error

Error state shows red border and displays error message via errorMessage slot.

```vue
<FzInput label="Email" type="email" :error="hasError" v-model="email">
  <template #errorMessage>Please enter a valid email address</template>
</FzInput>
```

### Valid

Valid state shows a green checkmark icon on the right side.

```vue
<FzInput label="Email" type="email" :valid="isValid" v-model="email" />
```

### Readonly

Readonly inputs prevent editing but remain focusable and visible.

```vue
<FzInput label="Read-only Value" readonly v-model="readonlyValue" />
```

## With Icons

### Left Icon

```vue
<FzInput 
  label="Date" 
  leftIcon="calendar-lines" 
  v-model="date" 
/>
```

### Right Icon

```vue
<FzInput 
  label="Search" 
  rightIcon="magnifying-glass" 
  v-model="search" 
/>
```

### Right Icon as Button

Right icon can be rendered as a clickable button (useful for password visibility toggle, clear button, etc.).

```vue
<template>
  <FzInput 
    label="Password" 
    :type="passwordType"
    rightIcon="eye"
    :rightIconButton="true"
    rightIconButtonVariant="secondary"
    rightIconAriaLabel="Toggle password visibility"
    @fzinput:right-icon-click="togglePasswordVisibility"
    v-model="password" 
  />
</template>

<script setup>
import { ref } from 'vue'

const passwordType = ref('password')
const password = ref('')

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}
</script>
```

### Clickable Icons with Accessibility

When icons are clickable, provide `leftIconAriaLabel` or `rightIconAriaLabel` for keyboard accessibility:

```vue
<FzInput 
  label="Search" 
  leftIcon="magnifying-glass"
  leftIconAriaLabel="Open search options"
  @fzinput:left-icon-click="openSearchOptions"
  v-model="search" 
/>
```

### Both Icons

```vue
<FzInput 
  label="Amount" 
  leftIcon="dollar-sign" 
  rightIcon="credit-card" 
  v-model="amount" 
/>
```

## Help Text and Error Messages

### Help Text

Help text is displayed below the input when no error is present.

```vue
<FzInput label="Username" v-model="username">
  <template #helpText>
    Username must be between 3 and 20 characters
  </template>
</FzInput>
```

### Error Message

Error message is displayed below the input when error prop is true.

```vue
<FzInput label="Email" type="email" :error="hasError" v-model="email">
  <template #errorMessage>
    Please enter a valid email address
  </template>
</FzInput>
```

## Custom Label

You can provide custom label content using the label slot.

```vue
<FzInput v-model="value">
  <template #label>
    <strong>Custom Label</strong> with <em>formatting</em>
  </template>
</FzInput>
```

## Examples

### Form with Validation

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FzInput 
      label="Email" 
      type="email" 
      required 
      :error="errors.email"
      v-model="form.email"
    >
      <template #errorMessage v-if="errors.email">
        {{ errors.email }}
      </template>
    </FzInput>
    
    <FzInput 
      label="Password" 
      type="password" 
      required 
      :error="errors.password"
      v-model="form.password"
    >
      <template #errorMessage v-if="errors.password">
        {{ errors.password }}
      </template>
    </FzInput>
    
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: null,
  password: null
})

const handleSubmit = () => {
  // Validation logic
}
</script>
```

### Password with Visibility Toggle

```vue
<template>
  <FzInput 
    label="Password" 
    :type="showPassword ? 'text' : 'password'"
    rightIcon="eye"
    :rightIconButton="true"
    @fzinput:right-icon-click="togglePassword"
    v-model="password" 
  />
</template>

<script setup>
import { ref } from 'vue'

const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>
```

### Search Input

```vue
<FzInput 
  label="Search" 
  leftIcon="magnifying-glass" 
  rightIcon="xmark"
  :rightIconButton="true"
  @fzinput:right-icon-click="clearSearch"
  v-model="searchQuery" 
/>
```

### Input with Max Length

```vue
<FzInput 
  label="PIN" 
  type="text" 
  maxlength="4" 
  pattern="[0-9]{4}"
  v-model="pin" 
/>
```

## FzCurrencyInput

Specialized currency input component built on FzInput with number formatting, validation, and step controls. Formats values using Intl.NumberFormat with locale-aware separators.

### Features

- Locale-aware number formatting (decimal and thousand separators)
- Min/max value constraints
- Step quantization with arrow buttons
- Intelligent paste parsing (detects decimal/thousand separators automatically)
- Configurable decimal places

### Basic Usage

```vue
<script setup lang="ts">
import { FzCurrencyInput } from '@fiscozen/input'
import { ref } from 'vue'

const amount = ref<number | null>(null)
</script>

<template>
  <FzCurrencyInput 
    label="Amount" 
    v-model:amount="amount" 
    :min="0" 
    :max="1000" 
  />
</template>
```

### With Step Controls

When `step` prop is provided, arrow buttons appear on the right to increment/decrement the value.

```vue
<FzCurrencyInput 
  label="Quantity" 
  v-model:amount="quantity" 
  :step="5"
  :forceStep="true"
/>
```

### With Min/Max Constraints

```vue
<FzCurrencyInput 
  label="Price" 
  v-model:amount="price" 
  :min="0" 
  :max="9999.99"
  :minimumFractionDigits="2"
  :maximumFractionDigits="2"
/>
```

### Currency Input Behavior

- **Formatting**: Values are formatted using Intl.NumberFormat with locale settings
- **Paste Handling**: Automatically detects and parses various number formats (e.g., "1.234,56", "1,234.56")
- **Step Quantization**: When `forceStep` is true, values are automatically rounded to nearest step multiple
- **Empty Values**: When `nullOnEmpty` is true, empty input converts to null instead of 0
- **Step Controls**: When `step` prop is provided, arrow buttons appear with keyboard accessibility (Enter/Space to activate)
- **Type Safety**: v-model accepts `number | string | undefined` but emits only `number | undefined`

## Accessibility

FzInput and FzCurrencyInput are fully accessible and meet WCAG 2.1 AA standards:

- **ARIA Attributes**: Proper aria-required, aria-invalid, aria-disabled, aria-labelledby, aria-describedby
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Space, Arrow keys)
- **Screen Readers**: Error messages and help text are properly associated with inputs
- **Focus Management**: Visible focus indicators with proper contrast
- **Semantic HTML**: Native input elements with proper label associations
- **Error Announcements**: Error messages use role="alert" for immediate screen reader announcements

### ARIA Attributes

- **aria-required**: Set to "true" or "false" (string values for Vue 3 compatibility)
- **aria-invalid**: Set to "true" when error prop is true
- **aria-disabled**: Set to "true" when disabled prop is true
- **aria-labelledby**: Links to label element when label prop is provided
- **aria-describedby**: Links to help text or error message when present

### Error Message Accessibility

Error messages are rendered with `role="alert"` to ensure screen readers announce them immediately when displayed.

## Behavior & Concepts

### Label vs Slot Priority

When both `label` prop and label slot are provided, the slot takes precedence:

```vue
<FzInput label="This won't show">
  <template #label>This will show instead</template>
</FzInput>
```

### Right Icons Display Order

The component supports three types of right-side icons that can all be displayed simultaneously:
1. **`valid` checkmark** (when `valid` prop is `true`) - displayed first
2. **`secondRightIcon`** (when provided) - displayed second
3. **`rightIcon`** (when provided) - displayed third

All three icons can be visible at the same time, appearing in this order from left to right.

### Floating Label Placeholder Behavior

In floating-label variant:
- When input is empty and not focused: placeholder shows above input as floating text
- When input has value or is focused: placeholder moves above input permanently
- Normal placeholder attribute is hidden in this mode

### Icon Button Size Mapping

Right icon buttons use a smaller size scale than inputs to maintain visual balance:
- Input size `sm` → Icon button size `xs`
- Input size `md` → Icon button size `sm`
- Input size `lg` → Icon button size `md`

## Notes

### Input Type Behavior

Different input types provide different keyboard layouts and validation:
- **email**: Triggers email keyboard on mobile devices
- **tel**: Triggers numeric keyboard on mobile devices
- **number**: Allows numeric input with spinner controls
- **password**: Masks input characters
- **url**: Validates URL format

### Currency Input Formatting

FzCurrencyInput uses Intl.NumberFormat for locale-aware formatting. The formatting respects:
- Browser locale settings
- Minimum and maximum fraction digits
- Decimal and thousand separator conventions

### Paste Handling in Currency Input

The currency input uses intelligent heuristics to parse pasted values:
- Multiple different separators: rightmost is decimal separator
- Multiple same separators: thousand separator
- Single separator with <3 digits after: decimal separator
- Single separator with 3+ digits after: ambiguous, uses default formatting
