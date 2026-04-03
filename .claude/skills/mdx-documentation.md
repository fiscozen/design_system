---
name: mdx-documentation
description: MDX documentation standards for Storybook component docs — location, structure, curly brace escaping, full template
paths:
  - "apps/storybook/src/**/*.mdx"
---

# MDX Documentation

MDX files document components for **consumers** (developers who install and use the package), not for maintainers.

## Location and Naming

`apps/storybook/src/Fz{ComponentName}.mdx`

## Critical: Curly Braces in MDX

Storybook indexes MDX with Acorn. Bare `{` and `}` in JSX context cause "Could not parse expression with acorn" errors.

For object types in props tables, use HTML entities:
- `&#123;` for `{`
- `&#125;` for `}`

Example: `<code>&#123; label: string; disabled?: boolean &#125;</code>`

## Required Sections

1. Title + short description
2. Features (bullet list)
3. Installation (`npm install @fiscozen/{name}`)
4. Basic Usage (Vue `<script setup>` example)
5. Props (HTML table — markdown tables not supported)
6. Examples (common use cases)
7. Accessibility (keyboard, ARIA, screen reader)
8. Best Practices / Related Components

## Props Table Format (HTML only)

```html
<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>disabled</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Disables the component</td>
    </tr>
  </tbody>
</table>
```

## Template

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Documentation/{Category}/Fz{ComponentName}" />

# Fz{ComponentName}

Brief description.

## Features

- Feature 1
- Feature 2

## Installation

```bash
npm install @fiscozen/{kebab-case-name}
```

## Basic Usage

```vue
<script setup>
import { Fz{ComponentName} } from '@fiscozen/{kebab-case-name}'
</script>

<template>
  <Fz{ComponentName} prop="value" />
</template>
```

## Props

<!-- Use HTML table with &#123; &#125; for object types -->

## Accessibility

- Keyboard: Tab to focus, Enter/Space to activate
- ARIA attributes: ...

## Related Components

- **FzRelated**: Description
```

## Style Guidelines

- User-friendly, practical language
- Focus on "how to use", not internal implementation
- Copy-pasteable, working code examples
- No emojis, English language
- Use `npm install` (not `pnpm add`) in Installation section

## When to Update

- Feature addition: update MDX with new props/behavior
- Bug fix: update if behavior or API changed
- Breaking changes: update with new API + migration notes
