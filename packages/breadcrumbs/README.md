# @fiscozen/breadcrumbs

Breadcrumb navigation components for Vue 3 applications. The package provides two components: a framework-agnostic presentational component and a Vue Router–aware wrapper that can automatically generate breadcrumbs from the current route hierarchy.

## Installation

```bash
npm install @fiscozen/breadcrumbs
```

`FzRouterBreadcrumbs` requires `vue-router` as a peer dependency.

## Components

This package exports two components:

- `FzBreadcrumbs` — Presentational component. Renders any list of breadcrumbs; navigation behavior is left to the consumer via slots.
- `FzRouterBreadcrumbs` — Vue Router wrapper around `FzBreadcrumbs`. Renders each breadcrumb as a `<router-link>` and can auto-generate the list from the matched route hierarchy.

## Basic Usage

### FzBreadcrumbs

```vue
<script setup lang="ts">
import { FzBreadcrumbs } from '@fiscozen/breadcrumbs'

const breadcrumbs = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'current', label: 'Current Page' },
]
</script>

<template>
  <FzBreadcrumbs :breadcrumbs="breadcrumbs" />
</template>
```

### FzRouterBreadcrumbs — automatic (default)

No props required. Breadcrumbs are generated automatically from `route.matched`.

```vue
<template>
  <FzRouterBreadcrumbs />
</template>
```

### FzRouterBreadcrumbs — manual breadcrumbs

Pass a `breadcrumbs` prop to control the list explicitly while still rendering each item as a `<router-link>`.

```vue
<script setup lang="ts">
import { FzRouterBreadcrumbs, Breadcrumb, CustomRouteLocation } from '@fiscozen/breadcrumbs'

const breadcrumbs: Breadcrumb<CustomRouteLocation>[] = [
  { id: 'home', label: 'Home', metadata: { path: '/', name: 'home' } },
  { id: 'products', label: 'Products', metadata: { path: '/products', name: 'products' } },
  { id: 'current', label: 'Current Page', metadata: { path: '/products/1', name: 'product-detail' } },
]
</script>

<template>
  <FzRouterBreadcrumbs :breadcrumbs="breadcrumbs" />
</template>
```

### Custom separator

```vue
<template>
  <FzBreadcrumbs :breadcrumbs="breadcrumbs" separator=">" />
</template>
```

### Custom label rendering (FzBreadcrumbs)

Use the `bread-label` scoped slot to replace the default label element with custom markup (e.g. a `<router-link>`, a styled `<a>`, or any component).

```vue
<template>
  <FzBreadcrumbs :breadcrumbs="breadcrumbs">
    <template #bread-label="{ bread, isActive }">
      <a :href="bread.metadata.href" :class="isActive ? 'text-grey-500' : 'text-blue-500'">
        {{ bread.label }}
      </a>
    </template>
  </FzBreadcrumbs>
</template>
```

### Custom separator element

```vue
<template>
  <FzBreadcrumbs :breadcrumbs="breadcrumbs">
    <template #bread-separator>
      <span class="mx-2 text-grey-300">›</span>
    </template>
  </FzBreadcrumbs>
</template>
```

## Props

### FzBreadcrumbs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `breadcrumbs` | `Breadcrumb<T>[]` | _required_ | List of breadcrumb items to render |
| `separator` | `string` | `'/'` | Character or string rendered between breadcrumb items |

### FzRouterBreadcrumbs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `breadcrumbs` | `Breadcrumb<CustomRouteLocation>[]` | `undefined` | List of breadcrumb items. When omitted (or empty), the component auto-generates breadcrumbs from `route.matched` |
| `separator` | `string` | `'/'` | Character or string rendered between breadcrumb items |

## Slots

### FzBreadcrumbs Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `bread-label` | `{ bread: Breadcrumb<T>, isActive: boolean }` | Replaces the default label element. `isActive` is `true` for the last item |
| `bread-separator` | — | Replaces the default separator element |

### FzRouterBreadcrumbs Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `bread-separator` | — | Passed through to the inner `FzBreadcrumbs`. Replaces the default separator element |

## Types

```ts
interface Breadcrumb<T = void> {
  id: string
  label: string
  metadata: T extends {} ? T : undefined
}

// Requires at least `path` or `name`; all other RouteLocation fields are optional
type CustomRouteLocation = PartialExcept<RouteLocation, 'path' | 'name'>
```

## Behavior & Concepts

### Three usage modes

| Mode | Component | When to use |
|------|-----------|-------------|
| Fully custom | `FzBreadcrumbs` | You control navigation yourself (non-router apps, custom link components) |
| Manual router links | `FzRouterBreadcrumbs` + `breadcrumbs` prop | Vue Router app where you build the list yourself |
| Automatic router links | `FzRouterBreadcrumbs` (no props) | Vue Router app — breadcrumbs mirror the matched route hierarchy |

### Active item

The last breadcrumb in the list is considered active. It receives the `text-grey-500` class by default; all preceding items receive `text-blue-500`. The separator is not rendered after the last item.

### Automatic breadcrumbs from route

When `FzRouterBreadcrumbs` has no `breadcrumbs` prop (or receives an empty array), it reads `route.matched` and maps each record to a `Breadcrumb<CustomRouteLocation>`. The `id` and `label` are derived from the route `name` (falling back to `path`), and `metadata` is the full matched route record.

## Accessibility

`FzBreadcrumbs` is a presentational component. The current implementation uses a `<div>` container. For full WCAG 2.1 compliance consider wrapping the component in a `<nav aria-label="Breadcrumb">` element and using the `bread-label` slot to add `aria-current="page"` to the last item:

```vue
<template>
  <nav aria-label="Breadcrumb">
    <FzBreadcrumbs :breadcrumbs="breadcrumbs">
      <template #bread-label="{ bread, isActive }">
        <span :aria-current="isActive ? 'page' : undefined">{{ bread.label }}</span>
      </template>
    </FzBreadcrumbs>
  </nav>
</template>
```

`FzRouterBreadcrumbs` renders each item as a `<router-link>`, which produces a native `<a>` element — keyboard navigation and focus management are handled by the browser.
