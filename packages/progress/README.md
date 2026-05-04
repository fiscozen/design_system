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
  <FzProgress size="sm" />
  <FzProgress size="lg" />
  <FzProgress size="xl" />
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
    label="Caricamento file"
  />
</template>
```

### Contextual progress with valueText

```vue
<template>
  <FzProgressBar
    :current="3"
    :max="10"
    label="Caricamento file"
    valueText="Caricamento file 3 di 10"
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'lg'` | Spinner size |
| `label` | `string` | `'Caricamento…'` | Accessible label announced via `role="status"` and rendered as visually-hidden text |

### FzProgressBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `number` | **required** | Current progress value within the min-max range |
| `max` | `number` | `100` | Maximum value for progress calculation |
| `min` | `number` | `0` | Minimum value for progress calculation |
| `label` | `string` | `'Avanzamento'` | Accessible label announced via `aria-label` |
| `valueText` | `string` | — | Optional human-readable text passed to `aria-valuetext` (e.g. `'Caricamento file 3 di 10'`) |
| `size` | `'sm' \| 'md'` | `'md'` | Height of the progress bar |
| `color` | `'purple' \| 'blue' \| 'orange' \| 'pink' \| 'yellow' \| 'grey' \| 'red'` | `'purple'` | Color variant. `yellow` and `red` map to `semantic-warning-*` and `semantic-error-*` tokens |

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
    label="Temperatura"
  />
  <!-- Result: (0 - (-25)) / (75 - (-25)) * 100 = 25% -->
</template>
```

## Accessibility

### FzProgress

- Wrapper has `role="status"` (implicit `aria-live="polite"`), so screen readers announce the loading state when the spinner enters the DOM
- `aria-label` defaults to `'Caricamento…'`, overridable via the `label` prop, and is mirrored as visually-hidden text for screen readers that prefer text content
- The animation is disabled under `@media (prefers-reduced-motion: reduce)` to comply with WCAG 2.3.3
- **Consumer guidance**: the container that toggles the spinner should set `aria-busy="true"` while loading, so the surrounding content is marked as not yet ready. Example:
  ```vue
  <div :aria-busy="loading">
    <FzProgress v-if="loading" />
    <slot v-else />
  </div>
  ```

### FzProgressBar

Follows WCAG 2.1 AA and includes:

- **ARIA Attributes**:
  - `role="progressbar"` for semantic meaning
  - `aria-valuenow` with current value (sanitized for NaN/Infinity)
  - `aria-valuemin` with minimum value
  - `aria-valuemax` with maximum value
  - `aria-label` from the `label` prop for screen reader description
  - `aria-valuetext` from the optional `valueText` prop for human-readable contextual progress
- **Reduced motion**: the width transition uses `motion-safe:` Tailwind utilities, so it is automatically disabled under `prefers-reduced-motion: reduce` (WCAG 2.3.3)
- **Screen Reader Support**: Progress values and contextual descriptions are accessible when navigating to the progress bar
- **Keyboard Navigation**: Progress bar is accessible via keyboard (though not interactive)

## Future enhancements (nice to have)

These are intentionally left out of the current API and tracked for future minor releases when a real consumer requires them:

- **Indeterminate state for `FzProgressBar`** — a way to express "progress unknown" via animated stripes, travelling fill, or pulse, with `aria-valuenow` omitted (per ARIA APG). Will be added as an additive `indeterminate?: boolean` prop when needed.

## Notes

### Why Div Instead of HTML Progress Element?

We use `div` elements instead of the HTML `<progress>` element for better CSS cross-browser compatibility. The progress element requires browser-specific pseudo-elements (`::-webkit-progress-bar`, `::-moz-progress-bar`) which can be inconsistent across browsers and harder to style with Tailwind CSS.

## Related Components

- **FzIcon**: Used internally by FzProgress for icon rendering
