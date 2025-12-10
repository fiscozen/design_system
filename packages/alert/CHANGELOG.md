# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-10

### ⚠️ BREAKING CHANGES

#### Prop `type` renamed to `tone`
The `type` prop has been renamed to `tone` for better semantic clarity.

**Migration:**
```vue
<!-- Before (v0.1.4) -->
<FzAlert type="info" />

<!-- After (v1.0.0) -->
<FzAlert tone="info" />
```

#### Event names changed
Event names have been updated to follow a more consistent naming convention:
- `fzaction:click` → `fzAlert:click`
- New event: `fzAlert:dismiss`

**Migration:**
```vue
<!-- Before (v0.1.4) -->
<FzAlert @fzaction:click="handleClick" />

<!-- After (v1.0.0) -->
<FzAlert @fzAlert:click="handleClick" @fzAlert:dismiss="handleDismiss" />
```

#### Visual structure redesign
The internal structure has been completely redesigned:
- New layout using `FzContainer` for consistent spacing
- Improved responsive behavior with `justify-between` layout
- Icon and content now wrapped in a flex container with better alignment
- Padding logic centralized: backoffice uses `p-6`, frontoffice uses `p-12`

#### Removed `simple` alert style
The `simple` style variant has been removed in favor of the new `variant` prop system.

**Migration:**
```vue
<!-- Before (v0.1.4) -->
<FzAlert alertStyle="simple" size="sm" />

<!-- After (v1.0.0) -->
<FzAlert variant="background" environment="backoffice" />
```

### Added

#### New `variant` prop
Introduced a new `variant` prop to replace `alertStyle` with clearer semantics:
- `'background'`: Alert with visible background (replaces `default` and `simple`)
- `'accordion'`: Collapsable alert (replaces `collapsable`)

**Usage:**
```vue
<FzAlert variant="background" />
<FzAlert variant="accordion" />
```

#### New `environment` prop
Added `environment` prop to explicitly control the alert context:
- `'frontoffice'`: Larger padding (12px) and standard button sizing
- `'backoffice'`: Compact padding (6px) and smaller button sizing

**Usage:**
```vue
<FzAlert environment="backoffice" />
<FzAlert environment="frontoffice" />
```

#### Dismissible alerts
New `isDismissible` prop allows users to dismiss alerts with a close button.

**Usage:**
```vue
<FzAlert isDismissible @fzAlert:dismiss="handleDismiss" />
```

#### Right icon support
Added `FzIconButton` for collapse/dismiss functionality positioned on the right side of the alert.

### Changed

- **Improved title styling**: Title now uses `v-bold` directive and `leading-[20px]` for consistent typography
- **Description spacing**: Dynamic margin classes based on presence of title and actions
- **Icon sizing**: Standardized icon size to `md` across all variants
- **Container classes**: Simplified class logic with `justify-between` for better layout control
- **Environment mapping**: Automatic environment inference from `size` prop when `environment` is not specified
- **Border styling**: Consistent `border-l-4` removed in favor of full rounded borders

### Deprecated

- **`alertStyle` prop**: Use `variant` instead. Will be removed in a future version.
- **`size` prop**: Use `environment` instead. Will be removed in a future version.

### Dependencies

- Added: `@fiscozen/container` (workspace)
- Updated: Improved integration with `@fiscozen/button` (now uses `FzIconButton`)

### Migration Guide

#### Quick Migration Checklist

1. ✅ Replace all `type` props with `tone`
2. ✅ Update event listeners from `fzaction:click` to `fzAlert:click`
3. ✅ Replace `alertStyle="simple"` with `variant="background" environment="backoffice"`
4. ✅ Replace `alertStyle="default"` with `variant="background"`
5. ✅ Replace `alertStyle="collapsable"` with `variant="accordion"`
6. ✅ Consider using `environment` instead of `size` for future compatibility

#### Complete Migration Example

```vue
<!-- Before (v0.1.4) -->
<FzAlert
  type="info"
  alertStyle="simple"
  size="sm"
  title="Alert Title"
  @fzaction:click="handleAction"
>
  Alert message
</FzAlert>

<!-- After (v1.0.0) -->
<FzAlert
  tone="info"
  variant="background"
  environment="backoffice"
  title="Alert Title"
  @fzAlert:click="handleAction"
>
  Alert message
</FzAlert>
```

---

## [0.1.4] and earlier

See git history for changes prior to v1.0.0.
