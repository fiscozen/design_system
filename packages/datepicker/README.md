# @fiscozen/datepicker

> For usage documentation, see the [Storybook Documentation](../../apps/storybook/src/FzDatepicker.mdx).

## Development

### Setup

```bash
pnpm install
pnpm --filter @fiscozen/datepicker build
```

### Running Tests

```bash
pnpm --filter @fiscozen/datepicker test:unit
pnpm --filter @fiscozen/datepicker coverage
```

### Running Storybook

```bash
pnpm --filter @fiscozen/storybook dev
```

## Architecture

FzDatepicker is a shallow wrapper around [`@vuepic/vue-datepicker` v12](https://vue3datepicker.com/). The wrapper adds:

1. **Fiscozen-branded styling** via global (unscoped) CSS overrides of `.dp__*` classes
2. **FzInput integration** by replacing the default input slot with `FzInput`
3. **Custom time-picker overlay** (hours/minutes/seconds grid) instead of VueDatePicker's default
4. **Legacy v8 prop mapping** so consumers don't need to update their code after the v8 → v12 migration
5. **Teleport normalization** to ensure the calendar menu renders correctly inside modals/dialogs

### Why Global CSS

The `<style>` block is intentionally **not scoped**. VueDatePicker teleports its calendar menu to `<body>` by default, so scoped styles would not reach the teleported DOM. All `.dp__*` overrides and custom `.fz-time-picker*` classes must be global.

## Code Organization

```
src/
├── FzDatepicker.vue    # Main component (script → template → style)
├── types.ts            # FzDatepickerProps interface extending VueDatePicker's RootProps
├── index.ts            # Public exports
└── __tests__/
    ├── FzDatepicker.spec.ts        # Unit tests
    └── __snapshots__/              # Vitest snapshots
```

## Key Concepts

### Stable Sub-Objects (Flicker Prevention)

VueDatePicker v12 internally watches certain sub-object props (e.g. `floating`, `formats`, `timeConfig`). If a new object reference is passed on every render — even with the same content — it triggers unnecessary DOM cycles that manifest as visual flicker.

To prevent this, the component uses individually memoised `computed` properties (`stableFormats`, `stableLocale`, `stableFloating`, `stableTextInput`, `stableInputAttrs`, `stableTimeConfig`, `stableFlow`) that return the **same reference** when only unrelated props change. These are then assembled into `mappedProps`.

### Legacy Prop Mapping (v8 → v12)

The `mappedProps` computed property transparently remaps deprecated v8-style scalar props to their v12 equivalents:

| v8 Prop | v12 Equivalent |
|---------|---------------|
| `format` | `formats.input` |
| `formatLocale` | `locale` |
| `autoPosition` | `floating` |
| `placement` | `floating.placement` |
| `state` | `inputAttrs.state` |
| `name` | `inputAttrs.name` |
| `enableTimePicker`, `enableMinutes`, `is24`, etc. | `timeConfig.*` |
| `flow` (array) | `flow.steps` |

All legacy props are marked `@deprecated` in `types.ts` with migration guidance.

### Teleport Normalization

Vue 3's boolean casting rules can cause `<FzDatepicker teleport />` to pass an empty string `""` to VueDatePicker when the prop type includes both `String` and `Boolean`. The component normalises this in `mappedProps`:

- `true` or `""` → `"body"`
- `false` or `null` → prop removed entirely (no teleport)
- Explicit string (e.g. `"#container"`) → passed through as-is

Default is `"body"`, ensuring the calendar always renders outside overflow-hidden containers.

### Floating Key (Forced Remount)

VueDatePicker reads `floating.placement` once during setup and passes a plain value (not a ref) to `useFloating`. To make placement changes reactive, the component forces a remount via `:key="floatingKey"` whenever the floating config changes.

### Custom Time Picker

The component replaces VueDatePicker's default time picker with a custom implementation using the `#time-picker` slot. Features:

- **Inline controls**: Increment/decrement buttons (`FzIconButton`) for hours, minutes, and optional seconds
- **Overlay grid**: Clicking the current value opens a grid overlay positioned over the calendar for quick selection (e.g. 24 hour buttons, or 12 five-minute-interval buttons)
- **Wrapping**: Values wrap around (23 → 0, 59 → 0) via `wrapTimeValue`

## Adding Features

### Step 1: Update Types

Add new props to `FzDatepickerProps` in `src/types.ts` with JSDoc documentation.

### Step 2: Handle in mappedProps

If the new prop needs to be remapped or excluded before passing to VueDatePicker, update the `mappedProps` computed in `FzDatepicker.vue`.

### Step 3: Update Template

Add template bindings if the new prop affects the UI directly.

### Step 4: Add Tests

Write unit tests in `src/__tests__/FzDatepicker.spec.ts`. Aim for >90% coverage.

### Step 5: Update Stories

Add or update Storybook stories in `apps/storybook/src/stories/form/Datepicker.stories.ts` with play functions.

### Step 6: Update Documentation

Update the MDX file at `apps/storybook/src/FzDatepicker.mdx` with usage examples.

## Design Decisions

### Why Wrapper Instead of Fork

Wrapping VueDatePicker preserves access to its rich feature set (120+ props) while allowing us to control the styling, input integration, and API surface. Forking would require maintaining date-picker core logic.

### Why Legacy Props

The v8 → v12 migration of VueDatePicker introduced significant API changes. To avoid a breaking migration for all consumers, the wrapper transparently maps old props. Legacy props are marked `@deprecated` and will be removed in a future major version.

### Why Unscoped CSS

The calendar menu is teleported to `<body>`. Scoped styles would generate `[data-v-xxx]` attribute selectors that don't match teleported DOM elements. Global CSS is the only viable approach.

## Troubleshooting

### Calendar Appears "Cut Off" Inside a Modal

Ensure `teleport` is set to `"body"` (the default). If you pass `teleport` as a boolean attribute (`<FzDatepicker teleport />`), it is automatically normalised to `"body"`.

### Calendar Flickers on Prop Changes

Check that you are not creating new object references on every render for props like `floating`, `formats`, or `timeConfig`. The component handles this internally via stable computed properties, but if you override `mappedProps` or bind sub-object props directly, ensure reference stability.

### Placement Not Updating

VueDatePicker reads `floating.placement` once during setup. The component works around this by remounting via `:key`. If placement still doesn't update, check that the `placement` prop is reactive (a ref or computed, not a plain string that doesn't change).
