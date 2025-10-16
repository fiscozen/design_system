# @fiscozen/tooltip

A fully accessible, WCAG 2.1 AA compliant tooltip component for Vue 3 applications. Built with enterprise-grade accessibility features, keyboard navigation support, and optimized for screen readers.

## Features

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
</script>

<template>
  <FzTooltip text="User profile settings">
    <button>Settings</button>
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

### Known Limitations

⚠️ **Nested Interactive Elements**: When wrapping already-interactive elements (buttons, links), the tooltip adds a wrapper with `tabindex="0"`, creating an extra tab stop. This is a known limitation that doesn't break functionality but may cause minor UX friction. For optimal accessibility, prefer wrapping non-interactive elements (spans, images, icons).

### Keyboard Interactions

| Key | Action |
|-----|--------|
| `Tab` | Focus wrapper and show tooltip |
| `Shift + Tab` | Focus previous element and hide tooltip |  
| `Escape` | Hide tooltip while maintaining focus |

**Note**: When the wrapped element is interactive (button/link), its native keyboard behavior (Enter/Space activation) continues to work normally.
