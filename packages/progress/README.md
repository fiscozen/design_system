# @fiscozen/progress

Progress indicators for Vue 3 applications, including animated loading spinners and visual progress bars with customizable ranges.

## Features

- **Loading Spinner**: Animated spinner component for loading states
- **Progress Bar**: Visual progress indicator with customizable min/max ranges
- **Custom Ranges**: Support for negative values and custom ranges (e.g., -15 to 50)
- **Smooth Transitions**: CSS transitions for progress bar updates
- **Accessibility**: Full WCAG 2.1 AA compliance with ARIA attributes
- **TypeScript**: Full type safety with TypeScript definitions

## Installation

```bash
npm install @fiscozen/progress
```

## Components

This package exports two components:

- `FzProgress` - Animated loading spinner indicator
- `FzProgressBar` - Visual progress bar with percentage display

## Basic Usage

### FzProgress

```vue
<script setup lang="ts">
import { FzProgress } from '@fiscozen/progress'
</script>

<template>
  <FzProgress />
</template>
```

### FzProgressBar

```vue
<script setup lang="ts">
import { FzProgressBar } from '@fiscozen/progress'
</script>

<template>
  <FzProgressBar :current="50" />
</template>
```

## FzProgress

### With Custom Size

```vue
<template>
  <FzProgress size="lg" />
  <FzProgress size="sm" />
  <FzProgress size="xl" />
</template>
```

### With Custom Icon

```vue
<template>
  <FzProgress name="spinner" />
</template>
```

## FzProgressBar

### Basic Progress

```vue
<template>
  <!-- 0% -->
  <FzProgressBar :current="0" />
  
  <!-- 50% -->
  <FzProgressBar :current="50" />
  
  <!-- 100% -->
  <FzProgressBar :current="100" />
</template>
```

### Custom Range

```vue
<template>
  <!-- Range from -15 to 50, current value 30 -->
  <FzProgressBar :current="30" :min="-15" :max="50" />
  
  <!-- Range from 0 to 200, current value 150 -->
  <FzProgressBar :current="150" :min="0" :max="200" />
</template>
```

### Custom Label

```vue
<template>
  <FzProgressBar 
    :current="75" 
    name="upload-progress" 
  />
</template>
```

### Custom Size

```vue
<template>
  <!-- Small size -->
  <FzProgressBar :current="50" size="sm" />
  
  <!-- Medium size (default) -->
  <FzProgressBar :current="50" size="md" />
</template>
```

### Custom Color

```vue
<template>
  <!-- Purple (default) -->
  <FzProgressBar :current="50" color="purple" />
  
  <!-- Blue -->
  <FzProgressBar :current="50" color="blue" />
  
  <!-- Orange -->
  <FzProgressBar :current="50" color="orange" />
  
  <!-- Pink -->
  <FzProgressBar :current="50" color="pink" />
  
  <!-- Yellow -->
  <FzProgressBar :current="50" color="yellow" />
  
  <!-- Grey -->
  <FzProgressBar :current="50" color="grey" />
  
  <!-- Red (semantic error) -->
  <FzProgressBar :current="50" color="red" />
</template>
```

## Props

### FzProgress Props

FzProgress inherits all props from `FzIcon` (from `@fiscozen/icons`):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `'spinner-third'` | FontAwesome icon name |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'lg'` | Icon size |
| `variant` | `IconVariant` | `'far'` | FontAwesome icon variant (fas, far, fal, etc.) |

### FzProgressBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `number` | **required** | Current progress value within the min-max range |
| `max` | `number` | `100` | Maximum value for progress calculation |
| `min` | `number` | `0` | Minimum value for progress calculation |
| `name` | `string` | `'progress-bar'` | Accessible label for screen readers |
| `size` | `'sm' \| 'md'` | `'md'` | Height of the progress bar |
| `color` | `'purple' \| 'blue' \| 'orange' \| 'pink' \| 'yellow' \| 'grey' \| 'red'` | `'purple'` | Color variant |

## Behavior & Concepts

### Progress Calculation

The progress bar calculates the percentage position of the `current` value within the `[min, max]` range:

```
percentage = ((current - min) / (max - min)) * 100
```

The result is clamped between 0% and 100% for CSS width.

**Examples:**

- `current=50, min=0, max=100` → `50%`
- `current=30, min=-15, max=50` → `(30 - (-15)) / (50 - (-15)) * 100 = 69%`
- `current=-10, min=0, max=100` → `0%` (clamped)
- `current=150, min=0, max=100` → `100%` (clamped)

### Custom Ranges

The component supports custom ranges including negative values:

```vue
<template>
  <!-- Temperature range: -25°C to 75°C, current 0°C -->
  <FzProgressBar 
    :current="0" 
    :min="-25" 
    :max="75" 
    name="temperature"
  />
  <!-- Result: (0 - (-25)) / (75 - (-25)) * 100 = 25% -->
</template>
```

## Accessibility

FzProgressBar follows WCAG 2.1 AA standards and includes:

- **ARIA Attributes**: 
  - `role="progressbar"` for semantic meaning
  - `aria-valuenow` with current value
  - `aria-valuemin` with minimum value
  - `aria-valuemax` with maximum value
  - `aria-label` for screen reader description
- **Screen Reader Support**: Progress values are accessible when navigating to the progress bar
- **Keyboard Navigation**: Progress bar is accessible via keyboard (though not interactive)

FzProgress uses FontAwesome icons which handle ARIA attributes automatically for decorative icons.

## Notes

### Why Div Instead of HTML Progress Element?

We use `div` elements instead of the HTML `<progress>` element for better CSS cross-browser compatibility. The progress element requires browser-specific pseudo-elements (`::-webkit-progress-bar`, `::-moz-progress-bar`) which can be inconsistent across browsers and harder to style with Tailwind CSS.

## Related Components

- **FzIcon**: Used internally by FzProgress for icon rendering
