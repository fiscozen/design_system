# @fiscozen/container

A flexible layout component for organizing content with controlled spacing. Supports both vertical and horizontal orientations with customizable gap sizes.

## Features

- Vertical and horizontal layout orientations
- Customizable gap sizes (sm, base, lg)
- Main and section container variants with different spacing scales
- Flexible HTML tag rendering

## Installation

```bash
npm install @fiscozen/container
```

## Basic Usage

### Vertical Layout (Default)

```vue
<script setup>
import { FzContainer } from '@fiscozen/container'
</script>

<template>
  <FzContainer main>
    <FzContainer>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </FzContainer>

    <FzContainer>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </FzContainer>
  </FzContainer>
</template>
```

### Horizontal Layout

```vue
<template>
  <FzContainer orientation="horizontal">
    <button>Action 1</button>
    <button>Action 2</button>
    <button>Action 3</button>
  </FzContainer>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `main` | `boolean` | `false` | If `true`, uses main container spacing (larger gaps for page-level sections) |
| `gap` | `'sm' \| 'base' \| 'lg'` | `'base'` | Gap size between elements |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout orientation |
| `tag` | `string` | `'div'` | HTML tag to use for the container element |

## Gap Sizes

The component uses CSS custom properties for consistent spacing across the design system.

| Size | Main Container | Section Container |
|------|----------------|-------------------|
| `sm` | `--main-content-sm` | `--section-content-sm` |
| `base` | `--main-content-base` | `--section-content-base` |
| `lg` | `--main-content-lg` | `--section-content-lg` |

**Main containers** are intended for page-level sections and use larger spacing values.
**Section containers** are for content within sections and use smaller spacing values.

## Orientation Behavior

### Vertical (default)

- Elements stack vertically
- Gap is applied between elements vertically
- Special spacing for consecutive paragraphs (`p + p`) for improved readability
- Default layout for most use cases

### Horizontal

- Elements align horizontally in a single row
- Gap is applied between elements horizontally
- Elements are vertically centered (`align-items: center`)
- No wrapping (`flex-wrap: nowrap`) - elements will shrink to fit
- Ideal for action buttons, inline controls, or horizontal navigation

## Examples

### Nested Containers with Different Gaps

```vue
<template>
  <FzContainer main gap="lg">
    <h1>Page Title</h1>
    
    <FzContainer>
      <h2>Section Title</h2>
      <p>Content paragraph 1</p>
      <p>Content paragraph 2</p>
    </FzContainer>
    
    <FzContainer gap="sm">
      <label>Form Label</label>
      <input type="text" />
      <span>Helper text</span>
    </FzContainer>
  </FzContainer>
</template>
```

### Horizontal Button Group

```vue
<template>
  <FzContainer orientation="horizontal" gap="sm">
    <button>Cancel</button>
    <button>Save Draft</button>
    <button>Publish</button>
  </FzContainer>
</template>
```

### Custom HTML Tag

```vue
<template>
  <FzContainer tag="section" main>
    <h1>Section Content</h1>
    <p>This container renders as a section element</p>
  </FzContainer>
</template>
```

## Typography Notes

When using vertical orientation, the component applies special spacing between consecutive paragraph elements (`<p>`) to improve readability. This spacing is controlled by the `--paragraph-gap` CSS custom property and overrides the default gap for better typography.

This special spacing does not apply in horizontal orientation as horizontal paragraph layouts are uncommon.

## Accessibility

The component renders semantic HTML and can be customized using the `tag` prop to use appropriate semantic elements (e.g., `form`) based on your content structure.
