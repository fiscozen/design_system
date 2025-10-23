# @fiscozen/container

A flexible layout component for organizing content with controlled spacing. Supports both vertical and horizontal orientations with customizable gap sizes.

## Features

- Vertical and horizontal layout orientations
- Layout variants for horizontal containers (expand-first, with more coming)
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
  <FzContainer horizontal>
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
| `horizontal` | `boolean` | `false` | If `true`, elements align horizontally. Otherwise, vertically (default) |
| `layout` | `'default' \| 'expand-first'` | `'default'` | Layout behavior for horizontal containers (controls how child elements expand). Only applies when `horizontal` is `true` |
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
- Supports layout variants via the `layout` prop (see Layout Behavior section below)

## Layout Behavior (Horizontal Only)

The `layout` prop controls how child elements expand to fill available space in horizontal containers. This prop only works when `horizontal` is `true`.

### Available Layouts

| Layout | Status | Description |
|--------|--------|-------------|
| `default` | Implemented | All elements maintain their natural size (`flex-grow: 0`). This is the default behavior. |
| `expand-first` | Implemented | The first element expands to fill available space (`flex-grow: 1`), while other elements maintain their natural size. |
| `expand-last` | Future | The last element will expand to fill available space, while other elements maintain their natural size. |
| `space-between` | Future | Elements will be distributed with space between them (`justify-content: space-between`). |
| `expand-all` | Future | All elements will expand equally to fill available space (`flex-grow: 1` on all children). |

### When to Use Each Layout

**`default`**: Use when all elements should maintain their natural size. Good for button groups, navigation items, or any horizontal list where elements should not grow.

**`expand-first`**: Use when you want the first element to take up all remaining space. Common use cases:
- Task lists with an action button on the right
- Form rows with expanding content and fixed-width actions
- Headers with expanding title and fixed-width controls

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
  <FzContainer horizontal gap="sm">
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

### Layout: Expand First (Task List)

```vue
<template>
  <FzContainer gap="sm">
    <FzContainer horizontal layout="expand-first" gap="base">
      <FzContainer gap="sm">
        <p>Task name that can be very long</p>
        <p>Task description that will expand to fill available space</p>
      </FzContainer>
      <button>Complete</button>
    </FzContainer>
    
    <FzContainer horizontal layout="expand-first" gap="base">
      <FzContainer gap="sm">
        <p>Another task</p>
        <p>With another description</p>
      </FzContainer>
      <button>Complete</button>
    </FzContainer>
  </FzContainer>
</template>
```

### Layout: Expand First (Form Actions)

```vue
<template>
  <FzContainer gap="base">
    <input type="text" placeholder="Form field..." />
    <input type="text" placeholder="Another field..." />
    
    <!-- Actions aligned to the right -->
    <FzContainer horizontal layout="expand-first" gap="base">
      <FzContainer></FzContainer>
      <FzContainer horizontal gap="sm">
        <button>Cancel</button>
        <button>Save</button>
      </FzContainer>
    </FzContainer>
  </FzContainer>
</template>
```

## Typography Notes

When using vertical orientation, the component applies special spacing between consecutive paragraph elements (`<p>`) to improve readability. This spacing is controlled by the `--paragraph-gap` CSS custom property and overrides the default gap for better typography.

This special spacing does not apply in horizontal orientation as horizontal paragraph layouts are uncommon.

## Accessibility

The component renders semantic HTML and can be customized using the `tag` prop to use appropriate semantic elements (e.g., `form`) based on your content structure.
