# @fiscozen/checkbox

A fully accessible, WCAG 2.1 AA compliant checkbox component library for Vue 3 applications. Built with enterprise-grade accessibility features, support for single and multi-selection patterns, hierarchical checkbox groups with automatic indeterminate state management, and comprehensive keyboard navigation.

## Features

- **WCAG 2.1 AA Compliant** - Full accessibility support with comprehensive ARIA attributes
- **Flexible Data Models** - Support for boolean (single) and array (multi-select) v-model binding
- **Hierarchical Structures** - Parent-child checkbox relationships with automatic indeterminate state
- **Keyboard Navigation** - Complete keyboard accessibility with visible focus indicators
- **Screen Reader Optimized** - Proper semantic markup and live region announcements
- **Error Handling** - Built-in validation states with accessible error messages
- **Customizable** - Multiple size variants, emphasis mode, and tooltip support

## Installation

```bash
npm install @fiscozen/checkbox
```

**Peer Dependencies:** This package requires Vue 3.x and the following Fiscozen Design System packages:
- `@fiscozen/icons` - Icon system
- `@fiscozen/tooltip` - Tooltip component for contextual help
- `@fiscozen/alert` - Alert component for error messages

## Basic Usage

### Single Checkbox (Boolean Model)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckbox } from '@fiscozen/checkbox';

const accepted = ref(false);
</script>

<template>
  <div>
    <FzCheckbox 
      v-model="accepted" 
      label="I accept the terms and conditions" 
    />
    
    <p v-if="accepted">Terms accepted!</p>
  </div>
</template>
```

### Multiple Checkboxes (Array Model)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckbox } from '@fiscozen/checkbox';

const selectedFeatures = ref<string[]>([]);
</script>

<template>
  <div>
    <h3>Select Features:</h3>
    
    <FzCheckbox 
      v-model="selectedFeatures" 
      value="feature-a" 
      label="Feature A" 
    />
    
    <FzCheckbox 
      v-model="selectedFeatures" 
      value="feature-b" 
      label="Feature B" 
    />
    
    <FzCheckbox 
      v-model="selectedFeatures" 
      value="feature-c" 
      label="Feature C" 
    />
    
    <p>Selected: {{ selectedFeatures.join(', ') }}</p>
  </div>
</template>
```

### Checkbox Group

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckboxGroup } from '@fiscozen/checkbox';

const selectedOptions = ref<string[]>([]);

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];
</script>

<template>
  <FzCheckboxGroup
    v-model="selectedOptions"
    label="Choose your options"
    :options="options"
  >
    <template #help>
      <span>Select one or more options</span>
    </template>
  </FzCheckboxGroup>
</template>
```

## API Reference

### FzCheckbox

Core checkbox component supporting both single and multi-selection patterns. Can be used standalone or composed within checkbox groups.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Checkbox label text |
| `value` | `string \| number \| boolean` | `label` | Value when used in array model |
| `indeterminate` | `boolean` | `false` | Shows indeterminate state (partial selection) |
| `emphasis` | `boolean` | `false` | Applies emphasis styling (blue when checked) |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `error` | `boolean` | `false` | Shows error state |
| `required` | `boolean` | `false` | Marks field as required |
| `standalone` | `boolean` | `false` | Renders only icon without label text |
| `tooltip` | `FzTooltipProps` | `undefined` | Tooltip configuration |
| `ariaOwns` | `string` | `undefined` | Space-separated child IDs for hierarchical structures |
| `checkboxId` | `string` | auto-generated | Custom ID for the input element |

#### v-model

```typescript
// Single checkbox
v-model: boolean | null | undefined

// Multi-select checkbox
v-model: (string | number | boolean)[]
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `Event` | Emitted when checkbox state changes |

#### Slots

| Slot | Description |
|------|-------------|
| `error` | Error message content |
| `children` | Child checkboxes (used internally by hierarchical structures) |

---

### FzCheckboxGroup

Container component for managing multiple related checkboxes with shared labeling, validation, and accessibility features.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Group label |
| `options` | `ParentCheckbox[]` | **required** | Array of checkbox options |
| `emphasis` | `boolean` | `false` | Applies to all checkboxes |
| `disabled` | `boolean` | `false` | Disables all checkboxes |
| `error` | `boolean` | `false` | Shows error state |
| `required` | `boolean` | `false` | Marks group as required |
| `horizontal` | `boolean` | `false` | Arranges checkboxes horizontally |

#### v-model

```typescript
v-model: string[]
```

#### Slots

| Slot | Description |
|------|-------------|
| `help` | Help text displayed below the label |
| `error` | Error message content |

---

## Advanced Usage

### With Error Validation

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { FzCheckbox } from '@fiscozen/checkbox';

const agreedToTerms = ref(false);
const submitted = ref(false);

const hasError = computed(() => submitted.value && !agreedToTerms.value);

function handleSubmit() {
  submitted.value = true;
  if (!agreedToTerms.value) {
    // Handle validation error
    return;
  }
  // Process form
}
</script>

<template>
  <div>
    <FzCheckbox
      v-model="agreedToTerms"
      label="I agree to the terms"
      required
      :error="hasError"
    >
      <template #error>
        <p>You must accept the terms to continue</p>
      </template>
    </FzCheckbox>
    
    <button @click="handleSubmit">Submit</button>
  </div>
</template>
```

### With Tooltip

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckbox } from '@fiscozen/checkbox';

const enableFeature = ref(false);
</script>

<template>
  <FzCheckbox
    v-model="enableFeature"
    label="Enable advanced mode"
    :tooltip="{
      text: 'This enables experimental features that may be unstable',
      status: 'informative'
    }"
  />
</template>
```

### Emphasis Mode

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckbox } from '@fiscozen/checkbox';

const isPrimary = ref(false);
</script>

<template>
  <FzCheckbox
    v-model="isPrimary"
    label="Primary selection"
    emphasis
  />
</template>
```

### Standalone (Icon Only)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckbox } from '@fiscozen/checkbox';

const selected = ref(false);
</script>

<template>
  <div>
    <label for="custom-checkbox">Select this item:</label>
    <FzCheckbox
      v-model="selected"
      label="Select item"
      standalone
    />
  </div>
</template>
```

### Hierarchical Checkbox Group

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckboxGroup } from '@fiscozen/checkbox';

const selectedPermissions = ref<string[]>([]);

const permissionOptions = [
  {
    label: 'Admin Access',
    value: 'admin',
    children: [
      { label: 'User Management', value: 'admin.users' },
      { label: 'System Settings', value: 'admin.settings' },
      { label: 'View Logs', value: 'admin.logs' },
    ]
  },
  {
    label: 'Content Access',
    value: 'content',
    children: [
      { label: 'Create Content', value: 'content.create' },
      { label: 'Edit Content', value: 'content.edit' },
      { label: 'Delete Content', value: 'content.delete' },
    ]
  }
];
</script>

<template>
  <FzCheckboxGroup
    v-model="selectedPermissions"
    label="Select Permissions"
    :options="permissionOptions"
  >
    <template #help>
      <span>Parent checkboxes show indeterminate state when partially selected</span>
    </template>
  </FzCheckboxGroup>
</template>
```

### Horizontal Layout

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckboxGroup } from '@fiscozen/checkbox';

const selectedDays = ref<string[]>([]);

const dayOptions = [
  { label: 'Mon', value: 'monday' },
  { label: 'Tue', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
];
</script>

<template>
  <FzCheckboxGroup
    v-model="selectedDays"
    label="Working Days"
    :options="dayOptions"
    horizontal
  />
</template>
```

### Disabled State

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FzCheckbox, FzCheckboxGroup } from '@fiscozen/checkbox';

const checked = ref(true);
const groupSelection = ref<string[]>(['opt1']);

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
];
</script>

<template>
  <div>
    <!-- Disabled single checkbox -->
    <FzCheckbox
      v-model="checked"
      label="This is disabled"
      disabled
    />
    
    <!-- Disabled group -->
    <FzCheckboxGroup
      v-model="groupSelection"
      label="Disabled Group"
      :options="options"
      disabled
    />
  </div>
</template>
```

### With Form Validation

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { FzCheckboxGroup } from '@fiscozen/checkbox';

const selectedOptions = ref<string[]>([]);
const touched = ref(false);

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

const hasError = computed(() => 
  touched.value && selectedOptions.value.length === 0
);

function handleBlur() {
  touched.value = true;
}
</script>

<template>
  <div @blur="handleBlur">
    <FzCheckboxGroup
      v-model="selectedOptions"
      label="Required Selection"
      :options="options"
      required
      :error="hasError"
    >
      <template #help>
        <span>Select at least one option</span>
      </template>
      
      <template #error>
        <span>Please select at least one option to continue</span>
      </template>
    </FzCheckboxGroup>
  </div>
</template>
```

## TypeScript Support

This package is written in TypeScript and provides full type definitions.

```typescript
import type { 
  FzCheckboxProps, 
  FzCheckboxGroupProps,
  ParentCheckbox,
  ChildCheckbox 
} from '@fiscozen/checkbox';

// Example: Typed options array
const options: ParentCheckbox[] = [
  {
    label: 'Parent Option',
    value: 'parent',
    children: [
      { label: 'Child 1', value: 'child1' },
      { label: 'Child 2', value: 'child2' }
    ]
  }
];
```

## Accessibility Features

### WCAG 2.1 AA Compliance

This component implements comprehensive accessibility features following WCAG 2.1 Level AA guidelines:

- **Keyboard Navigation** - Full support for Tab and Space key interactions
- **Screen Reader Support** - Proper ARIA roles, labels, and state announcements
- **Focus Management** - Visible focus indicators meeting 3:1 contrast ratio requirements
- **Error Handling** - Live region announcements for dynamic validation messages
- **Semantic Markup** - Native checkbox inputs with accessible label associations

### Keyboard Interactions

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next checkbox |
| `Shift + Tab` | Move focus to previous checkbox |
| `Space` | Toggle checkbox state |

### Screen Reader Behavior

The component provides rich semantic information to assistive technologies:

- **State Announcements** - "checked", "unchecked", or "mixed" (indeterminate)
- **Label Associations** - `aria-labelledby` and `aria-label` for proper identification
- **Error Messages** - `aria-describedby` linking to error content with `role="alert"`
- **Group Context** - `role="group"` with `aria-labelledby` for related checkbox sets
- **Hierarchical Relationships** - `aria-owns` establishing parent-child checkbox connections
- **Required Fields** - `aria-required` indicating mandatory selections
- **Validation State** - `aria-invalid` signaling validation errors

### Focus Indicators

- Focus ring appears as blue border around checkbox icon
- Meets WCAG 3:1 contrast ratio requirement against background
- Visible in all states: default, hover, checked, indeterminate
- Tab order follows logical DOM structure
