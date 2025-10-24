# @fiscozen/tooltip

A fully accessible, WCAG 2.1 AA compliant tooltip component for Vue 3 applications. Built with enterprise-grade accessibility features, keyboard navigation support, and optimized for screen readers.

## Features

- **Auto-detection** - Automatically detects interactive components (FzButton, FzLink) to prevent double tab stops
- **Status-based Styling** - Visual variants with semantic color coding
- **Flexible Content** - Support for both text props and rich slot content
- **WCAG 2.1 AA Compliant** - Full accessibility support with ARIA roles and properties
- **Screen Reader Optimized** - Proper semantic markup and screen reader announcements  
- **Keyboard Navigation** - Complete keyboard accessibility with focus management
- **Hover Persistence** - WCAG 1.4.13 compliant hover behavior for improved UX

## Installation

```bash
npm install @fiscozen/tooltip
```

## Basic Usage

### Simple Text Tooltip
```vue
<script setup>
import { FzTooltip } from '@fiscozen/tooltip'
import { FzButton } from '@fiscozen/button'
</script>

<template>
  <!-- Non-interactive element (wrapper gets tabindex="0") -->
  <FzTooltip text="User profile settings">
    Settings
  </FzTooltip>
  
  <!-- Interactive component - auto-detected (no wrapper tabindex) -->
  <FzTooltip text="Save your changes">
    <FzButton>Save</FzButton>
  </FzTooltip>
  
  <!-- Native HTML element (not auto-detected, wrapper gets tabindex="0") -->
  <FzTooltip text="Submit form">
    <span @click="someAction">Submit</span>
  </FzTooltip>
  
  <!-- Native HTML element with manual override (no wrapper tabindex) -->
  <FzTooltip text="Submit form" :interactive="true">
    <span @click="someAction">Submit</span>
  </FzTooltip>
</template>
```

### Rich Content with Slots
```vue
<template>
  <FzTooltip aria-label="Account information">
    <img src="/avatar.jpg" alt="User avatar" class="avatar" />
    
    <template #text>
      <strong>John Doe</strong><br>
      <span>Premium Member</span><br>
      <small>Last active: 2 hours ago</small>
    </template>
  </FzTooltip>
</template>
```

### Status-based Tooltips
```vue
<template>
  <div class="dashboard-actions">
    <!-- Error state -->
    <FzTooltip 
      status="error" 
      :with-icon="true"
      text="Action failed: Insufficient permissions"
      aria-label="Delete operation status"
    >
      <button disabled>Delete Item</button>
    </FzTooltip>
    
    <!-- Success state -->
    <FzTooltip 
      status="positive" 
      :with-icon="true"
      text="Backup completed successfully at 14:32"
    >
      <span class="status-badge success">Backup Complete</span>
    </FzTooltip>
    
    <!-- Alert/Warning state -->
    <FzTooltip 
      status="alert" 
      :with-icon="true"
      text="System maintenance scheduled for tonight"
      aria-label="Maintenance warning"
    >
      <strong class="warning-text">Maintenance Notice</strong>
    </FzTooltip>
    
    <!-- Informative state -->
    <FzTooltip 
      status="informative" 
      :with-icon="true"
      text="This feature is currently in beta testing"
    >
      <div class="feature-card">
        <span class="beta-label">BETA</span>
        <p>New Analytics Dashboard</p>
      </div>
    </FzTooltip>
  </div>
</template>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `undefined` | Tooltip content text. Alternative to using the `text` slot |
| `status` | `FzTooltipStatus` | `'neutral'` | Visual status: `'neutral'` \| `'informative'` \| `'positive'` \| `'alert'` \| `'error'` |
| `position` | `FzFloatingPosition` | `'auto'` | Tooltip positioning relative to trigger element |
| `withIcon` | `boolean` | `false` | Display status-appropriate icon in tooltip content |
| `ariaLabel` | `string` | `undefined` | Accessible label for the trigger element |
| `interactive` | `boolean \| 'auto'` | `'auto'` | Controls keyboard accessibility: `undefined`/`'auto'` for auto-detection (FzButton, FzLink), `true` to force interactive, `false` to force non-interactive |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Trigger element content (required) |
| `text` | Tooltip content - supports rich HTML content |

### Status Types

```typescript
type FzTooltipStatus = 
  | 'neutral'     // Default dark background
  | 'informative' // Blue semantic info color
  | 'positive'    // Green semantic success color  
  | 'alert'       // Orange semantic warning color
  | 'error'       // Red semantic error color
```

## Styling & Theming

### Status Color Mapping

| Status | Use Case | Background Class | Icon |
|--------|----------|-----------------|------|
| `neutral` | General information, help text | `!bg-core-black` | None |
| `informative` | Tips, additional context | `bg-semantic-info` | `circle-info` |
| `positive` | Success states, confirmations | `bg-semantic-success` | `circle-check` |
| `alert` | Warnings, attention needed | `bg-semantic-warning` | `triangle-exclamation` |
| `error` | Errors, validation failures | `bg-semantic-error` | `circle-exclamation` |

## Accessibility Features

### WCAG 2.1 AA Compliance

This component implements comprehensive accessibility features:

- **Keyboard Navigation**: Support for Tab, focus, and Escape keys
- **Screen Reader Support**: Proper ARIA roles and descriptions
- **Focus Management**: Accessible focus indicators and logical tab order
- **Hover Persistence**: WCAG 1.4.13 compliant hover behavior
- **High Contrast**: Color combinations meeting WCAG AA contrast ratios

### Interactive Elements & Auto-detection

The tooltip automatically detects interactive components to prevent double tab stops by directly comparing component types at runtime.

**Auto-detected Components:**
- ✅ `FzButton` - Automatically recognized as interactive
- ✅ `FzIconButton` - Automatically recognized as interactive
- ✅ `FzLink` - Automatically recognized as interactive

**How it works:**
The auto-detection uses direct component type comparison, which is production-safe and works regardless of build configuration or minification settings. When you wrap an `FzButton`, `FzIconButton`, or `FzLink` in a tooltip, the wrapper automatically omits the `tabindex="0"` attribute to prevent double tab stops.

**Extending auto-detection:**
To add support for new interactive components:
1. Import the component in `FzTooltip.vue`
2. Add it to the `INTERACTIVE_COMPONENTS` array
3. Add it as a peerDependency in `package.json`

Example:
```typescript
// In FzTooltip.vue
import { FzNewComponent } from '@fiscozen/newComponent'

const INTERACTIVE_COMPONENTS = [FzButton, FzLink, FzNewComponent] as const;
```

**Not Auto-detected (require manual override if needed):**
- ❌ Native HTML elements: `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`
- ❌ Custom interactive elements with `@click` handlers
- ❌ Other custom components (even if interactive)

```vue
<!-- Auto-detection (recommended) - no prop needed -->
<FzTooltip text="Save your changes">
  <FzButton>Save</FzButton>
</FzTooltip>

<!-- Span with @click - not auto-detected, creates double tab stop -->
<FzTooltip text="Submit form">
  <span @click="someAction">Submit</span>
</FzTooltip>

<!-- Manual override - prevents double tab stop -->
<FzTooltip text="Submit form" :interactive="true">
  <span @click="someAction">Submit</span>
</FzTooltip>

<!-- Force non-interactive (e.g., disabled button) -->
<FzTooltip text="Action disabled" :interactive="false">
  <FzButton disabled>Save</FzButton>
</FzTooltip>
```

**The `interactive` prop:**
- `undefined` or `'auto'` (default): Auto-detects FzButton and FzLink
- `true`: Forces interactive behavior (removes wrapper tabindex)
- `false`: Forces non-interactive behavior (adds wrapper tabindex="0")

**Why it matters:**
Without proper interactive handling, the tooltip wrapper adds `tabindex="0"` for keyboard accessibility, creating two consecutive tab stops (wrapper + inner element). Auto-detection or explicit `interactive={true}` removes the wrapper's tabindex, resulting in clean keyboard navigation with a single tab stop.

### Keyboard Interactions

| Key | Action |
|-----|--------|
| `Tab` | Focus wrapper and show tooltip |
| `Shift + Tab` | Focus previous element and hide tooltip |  
| `Escape` | Hide tooltip while maintaining focus |

**Note**: When the wrapped element is interactive (button/link), its native keyboard behavior (Enter/Space activation) continues to work normally.
