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
| `gap` | `'sm' \| 'base' \| 'lg'` (when `main={true}`)<br>`'none' \| 'xs' \| 'sm' \| 'base' \| 'lg'` (when `main={false}`) | `'base'` | Gap size between elements. Available values depend on container type |
| `horizontal` | `boolean` | `false` | If `true`, elements align horizontally. Otherwise, vertically (default) |
| `layout` | `'default' \| 'expand-first' \| 'expand-all' \| 'space-between'` | `'default'` | Layout behavior for horizontal containers (controls how child elements expand). Only applies when `horizontal` is `true` |
| `alignItems` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'start'` for vertical, `'center'` for horizontal | Alignment of child elements on the cross-axis. In vertical containers: horizontal alignment (left/center/right). In horizontal containers: vertical alignment (top/center/bottom) |
| `tag` | `string` | `'div'` | HTML tag to use for the container element |

## Gap Sizes

The component uses CSS custom properties for consistent spacing across the design system.

### Main Containers (`main={true}`)

| Size | CSS Variable | Value |
|------|--------------|-------|
| `sm` | `--main-content-sm` | 32px |
| `base` | `--main-content-base` | 48px |
| `lg` | `--main-content-lg` | 64px |

### Section Containers (`main={false}` or default)

| Size | CSS Variable | Value |
|------|--------------|-------|
| `none` | `--section-content-none` | 0px |
| `xs` | `--section-content-xs` | 8px |
| `sm` | `--section-content-sm` | 16px |
| `base` | `--section-content-base` | 24px |
| `lg` | `--section-content-lg` | 32px |

**Main containers** are intended for page-level sections and use larger spacing values.
**Section containers** are for content within sections and use smaller spacing values, with additional `none` and `xs` options for tighter layouts.

## Orientation Behavior

### Vertical (default)

- Elements stack vertically
- Gap is applied between elements vertically
- Special spacing for consecutive paragraphs (`p + p`) for improved readability
- Default layout for most use cases
- Default alignment: `alignItems="start"` (left-aligned)

### Horizontal

- Elements align horizontally in a single row
- Gap is applied between elements horizontally
- No wrapping (`flex-wrap: nowrap`) - elements will shrink to fit
- Ideal for action buttons, inline controls, or horizontal navigation
- Supports layout variants via the `layout` prop (see Layout Behavior section below)
- Default alignment: `alignItems="center"` (vertically centered)

## Layout Behavior (Horizontal Only)

The `layout` prop controls how child elements expand to fill available space in horizontal containers. This prop only works when `horizontal` is `true`.

### Available Layouts

| Layout | Status | Description |
|--------|--------|-------------|
| `default` | Implemented | All elements maintain their natural size (`flex-grow: 0`). This is the default behavior. |
| `expand-first` | Implemented | The first element expands to fill available space (`flex-grow: 1`), while other elements maintain their natural size. |
| `expand-all` | Implemented | All elements expand equally to fill available space (`flex-grow: 1` on all children). |
| `space-between` | Implemented | Elements are distributed with space between them (`justify-content: space-between`). Elements maintain their natural size. |
| `expand-last` | Future | The last element will expand to fill available space, while other elements maintain their natural size. |

### When to Use Each Layout

**`default`**: Use when all elements should maintain their natural size. Good for button groups, navigation items, or any horizontal list where elements should not grow.

**`expand-first`**: Use when you want the first element to take up all remaining space.

**`expand-all`**: Use when you want all elements to have equal width.

**`space-between`**: Use when you want elements to maintain their natural size but be distributed across the available space.

## AlignItems Behavior

The `alignItems` prop controls how child elements are aligned on the **cross-axis** (perpendicular to the main axis).

### For Vertical Containers

Controls **horizontal alignment** of elements:

**`start`** (default): Elements align to the left
**`center`**: Elements are centered horizontally
**`end`**: Elements align to the right
**`stretch`**: Elements stretch to fill container width
**`baseline`**: Elements align along their text baseline

### For Horizontal Containers

Controls **vertical alignment** of elements:

**`start`**: Elements align to the top
**`center`** (default): Elements are centered vertically
**`end`**: Elements align to the bottom
**`stretch`**: Elements stretch to fill container height
**`baseline`**: Elements align along their text baseline (useful for text)

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

### Layout: Expand All

```vue
<template>
  <FzContainer horizontal layout="expand-all" gap="base">
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
  </FzContainer>
</template>
```

### Layout: Expand All

```vue
<template>
  <FzContainer horizontal layout="expand-all" gap="lg">
    <div class="card">
      <h3>Card 1</h3>
      <p>Content here</p>
    </div>
    <div class="card">
      <h3>Card 2</h3>
      <p>Content here</p>
    </div>
    <div class="card">
      <h3>Card 3</h3>
      <p>Content here</p>
    </div>
  </FzContainer>
</template>
```

### Layout: Space Between

```vue
<template>
  <FzContainer horizontal layout="space-between" gap="base">
    <div class="logo">Logo</div>
    <nav>
      <FzContainer horizontal gap="sm">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </FzContainer>
    </nav>
  </FzContainer>
</template>
```

### Layout: Space Between

```vue
<template>
  <FzContainer horizontal layout="space-between" gap="base">
    <FzContainer gap="xs">
      <h1>Page Title</h1>
      <p>Subtitle or description</p>
    </FzContainer>
    <FzContainer horizontal gap="sm">
      <button>Cancel</button>
      <button>Save</button>
    </FzContainer>
  </FzContainer>
</template>
```

### AlignItems: Vertical Container with Center Alignment

```vue
<template>
  <FzContainer alignItems="center" gap="base">
    <h1>Centered Title</h1>
    <p>Centered paragraph</p>
    <button>Centered button</button>
  </FzContainer>
</template>
```

### AlignItems: Vertical Container with Right Alignment

```vue
<template>
  <FzContainer alignItems="end" gap="sm">
    <p>Amount: €100</p>
    <p>Tax: €22</p>
    <p>Total: €122</p>
  </FzContainer>
</template>
```

### AlignItems: Horizontal Container with Top Alignment

```vue
<template>
  <FzContainer horizontal alignItems="start" gap="base">
    <img src="icon.png" style="height: 40px" />
    <div>
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </FzContainer>
</template>
```

### AlignItems: Horizontal Container with Baseline Alignment

```vue
<template>
  <FzContainer horizontal alignItems="baseline" gap="base">
    <span style="font-size: 0.75rem">Small text</span>
    <span style="font-size: 1rem">Medium text</span>
    <span style="font-size: 1.5rem">Large text</span>
  </FzContainer>
</template>
```

## Typography Notes

When using vertical orientation, the component applies special spacing between consecutive paragraph elements (`<p>`) to improve readability. This spacing is controlled by the `--paragraph-gap` CSS custom property and overrides the default gap for better typography.

This special spacing does not apply in horizontal orientation as horizontal paragraph layouts are uncommon.

## Accessibility

The component renders semantic HTML and can be customized using the `tag` prop to use appropriate semantic elements (e.g., `form`) based on your content structure.
