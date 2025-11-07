# @fiscozen/link

Flexible link component supporting internal routing (vue-router) and external navigation. Automatically renders as router-link for internal routes, anchor tag for external URLs, or non-interactive span when disabled.

## Features

- **Internal Routing**: Uses vue-router for SPA navigation with RouteLocationRaw support (string or object)
- **External Navigation**: Supports external URLs with anchor tags
- **Disabled State**: Renders as non-interactive span with disabled styling
- **Multiple Variants**: Default and danger types
- **Text Styles**: Default (underline on hover) or always underlined
- **Size Options**: sm, md
- **TypeScript Type Safety**: Discriminated union types enforce correct prop combinations
- **Full Accessibility**: ARIA support and keyboard navigation
- **Security**: Automatic rel="noopener noreferrer" for external links with target="_blank"

## Installation

```bash
npm install @fiscozen/link
```

## Basic Usage

### Internal Route (String Path)

```vue
<script setup lang="ts">
import { FzLink } from '@fiscozen/link'
</script>

<template>
  <FzLink to="/dashboard" size="md">Go to Dashboard</FzLink>
</template>
```

### Internal Route (Object with Name)

```vue
<template>
  <FzLink :to="{ name: 'user', params: { id: 123 }}">
    User Profile
  </FzLink>
</template>
```

### Internal Route (Object with Path and Query)

```vue
<template>
  <FzLink :to="{ path: '/search', query: { q: 'vue' }}">
    Search Results
  </FzLink>
</template>
```

### External Link

```vue
<template>
  <FzLink to="https://example.com" external target="_blank">
    External Site
  </FzLink>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `RouteLocationRaw \| string` | - | Destination route or URL. Type depends on `external` prop: **Internal** (external=false or undefined): Accepts vue-router RouteLocationRaw (string path or object with name/path, params, query, etc.). **External** (external=true): Must be a string URL. |
| `type` | `'default' \| 'danger'` | `'default'` | Visual variant indicating link purpose. Affects color scheme. |
| `linkStyle` | `'default' \| 'underline'` | `'default'` | Text decoration style. 'default' shows underline on hover, 'underline' always shows underline. |
| `size` | `'sm' \| 'md'` | `'md'` | Text size affecting font size and line height. |
| `disabled` | `boolean` | `false` | Disables the link, rendering as non-interactive span with disabled styling. |
| `target` | `string` | - | Target attribute for anchor tag (e.g., '_blank', '_self'). Can be used with both internal (router-link) and external links. |
| `external` | `boolean` | `false` | When true, renders as anchor tag with href instead of router-link. Use for external URLs or when router navigation is not desired. |
| `replace` | `boolean` | `false` | Uses router.replace instead of router.push for navigation. Only applies to internal routes (when external is false). |

## TypeScript Type Safety

The component uses discriminated union types to enforce correct prop combinations:

- **Internal links** (`external=false` or `undefined`):
  - `to` accepts `RouteLocationRaw` (string path or object with name/path, params, query, etc.)
  - `replace` can be used
  - `target` can be used (opens internal route in new tab/window)

- **External links** (`external=true`):
  - `to` must be a string URL
  - `target` can be used
  - `replace` cannot be used (not applicable for external links)

TypeScript will show errors if you try to use incompatible prop combinations.

## Examples

### Navigation Menu

```vue
<template>
  <nav>
    <FzLink to="/dashboard" size="md">Dashboard</FzLink>
    <FzLink to="/settings" size="md">Settings</FzLink>
    <FzLink :to="{ name: 'profile', params: { id: userId }}" size="md">
      Profile
    </FzLink>
  </nav>
</template>
```

### External Links with Security

```vue
<template>
  <FzLink to="https://example.com" external target="_blank">
    Visit Example Site
  </FzLink>
</template>
```

The component automatically adds `rel="noopener noreferrer"` for security when `target="_blank"` is used.

### Disabled State

```vue
<template>
  <FzLink to="/premium" disabled>
    Premium Feature (Requires Upgrade)
  </FzLink>
</template>
```

### Danger Link

```vue
<template>
  <FzLink to="/delete-account" type="danger" size="md">
    Delete Account
  </FzLink>
</template>
```

### Replace Navigation

```vue
<template>
  <FzLink to="/redirect" replace>
    Redirect Without History
  </FzLink>
</template>
```

## Accessibility

FzLink is fully accessible and meets WCAG 2.1 AA standards:

- **Keyboard Navigation**: All links are keyboard accessible (Tab, Enter)
- **Screen Readers**: Proper ARIA attributes for disabled state
- **Focus Indicators**: Visible focus outline with proper contrast
- **Semantic HTML**: Uses router-link for internal routes, anchor for external
- **Disabled State**: Renders as span with aria-disabled, role="link", and aria-label

### ARIA Attributes

- `aria-disabled`: Set to "true" when link is disabled (string value for Vue 3 compatibility)
- `role`: Set to "link" for disabled span to maintain semantic meaning
- `aria-label`: Provides accessible label for disabled links
- `rel`: Automatically adds "noopener noreferrer" for external links with target="_blank"

## Security

External links with `target="_blank"` automatically include `rel="noopener noreferrer"` to:
- Prevent security vulnerabilities (window.opener access)
- Improve privacy (no referrer information sent)

## Related Components

- **FzNavlink**: Navigation link with active state support
- **FzButton**: Button component for actions
- **FzRouterNavlink**: Router-aware navigation link
