---
"@fiscozen/tab": major
---

Updated FzTabs to reflect new design system specs

### BREAKING CHANGES

`FzTabs` doesn't automatically handle tab overflow; it is now controlled by the user via the `tabStyle` prop. Now is developer responsibility to handle the overflow of the tabs based on his use cases.

### NEW FEATURES

- New `tabStyle="fullWidth"` variant: the tab container stretches to fill the full available width and each tab expands equally with centered text
- The `tone` prop (`'neutral' | 'alert'`) is now set on individual `FzTab` components instead of the `FzTabs` container, allowing specific tabs to be highlighted independently
- New `environment` prop (`'backoffice' | 'frontoffice'`) for sizing, replacing the deprecated `size` prop
- New `tabStyle` prop (`'scroll' | 'picker' | 'fullWidth'`) to control tab style and overflow behavior
- The `change` event now also emits the selected button DOM element as a second argument: `(title: string, element: HTMLElement | null)`

### DEPRECATED FEATURES

- The `size` prop is deprecated: use `environment` instead
- The `horizontalOverflow` prop is deprecated: use `tabStyle` instead

### DOCUMENTATION

- Updated `FzTabs.mdx` documentation to reflect the new specifications