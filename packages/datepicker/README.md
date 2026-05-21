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

Coverage thresholds enforced by `vitest.config.ts`: **80% statements, 75% branches, 80% functions, 80% lines**. Snapshot IDs are normalised via a custom serializer in `src/__tests__/FzDatepicker.spec.ts` so that adding/removing tests does not drift unrelated snapshots.

When asserting against the inner `<VueDatePicker>` prefer `(wrapper.vm as any).$.setupState.mappedProps` over `dp.props(...)`: VueDatePicker uses `defineModel` + `v-bind` spread which makes Vue Test Utils' prop introspection unreliable.

### Running Storybook

```bash
pnpm --filter @fiscozen/storybook dev
```

## Architecture

FzDatepicker is a shallow wrapper around [`@vuepic/vue-datepicker` v12](https://vue3datepicker.com/). The wrapper adds:

1. **Fiscozen-branded styling** via global (unscoped) CSS overrides of `.dp__*` classes
2. **FzInput integration** by replacing the default input slot with `FzInput`
3. **Slot forwarding** (`errorMessage`, `helpText`) from FzDatepicker through to the inner FzInput
4. **Legacy v8 prop mapping** so consumers don't need to update their code after the v8 → v12 migration
5. **Teleport normalization** to ensure the calendar menu renders correctly inside modals/dialogs

The time picker UI uses VueDatePicker's default rendering, so props like `hoursIncrement`, `minutesIncrement`, `minTime`, `maxTime`, `disabledTimes`, `startTime`, and `is24: false` (AM/PM) work as documented upstream.

### Why Global CSS

The `<style>` block is intentionally **not scoped**. VueDatePicker teleports its calendar menu to `<body>` by default, so scoped styles would not reach the teleported DOM. All `.dp__*` overrides must be global.

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

### Stable Sub-Objects (Reference Stability)

VueDatePicker v12 internally watches certain sub-object props (e.g. `floating`, `formats`, `timeConfig`). If a new object reference is passed on every render — even with the same content — it triggers unnecessary re-calculations that can manifest as stuttering or layout shifts.

To prevent this, the component uses individually memoised `computed` properties (`stableFormats`, `stableLocale`, `stableFloating`, `stableTextInput`, `stableInputAttrs`, `stableTimeConfig`, `stableFlow`) that return the **same reference** when only unrelated props (e.g. `modelValue`) change. These are then assembled into `mappedProps`.

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

All legacy props are marked `@deprecated` in `types.ts` and will be removed in **v4.0.0**.

### Teleport Normalization

Vue 3's boolean casting rules can cause `<FzDatepicker teleport />` to pass an empty string `""` to VueDatePicker when the prop type includes both `String` and `Boolean`. The component normalises this in `mappedProps`:

- `true` or `""` → `"body"`
- `false` or `null` → prop removed entirely (no teleport)
- Explicit string (e.g. `"#container"`) → passed through as-is

Default is `"body"`, ensuring the calendar always renders outside overflow-hidden containers.

### Slot Forwarding (Error & Help Text)

FzDatepicker conditionally forwards `errorMessage` and `helpText` slots to the inner FzInput. The forwarding uses `v-if="$slots.slotName"` guards so that FzInput only sees the slot when the consumer of FzDatepicker actually provides it. Without these guards, FzInput's `$slots.helpText` check would always be truthy (because the template exists), causing an empty help text span to render on every instance.

This pattern follows the same approach used by `FzCurrencyInput`.

### Floating Key (Forced Remount)

VueDatePicker reads `floating.placement` once during setup and passes a plain value (not a ref) to `useFloating`. To make placement changes reactive, the component forces a remount via `:key="floatingKey"` whenever the floating config changes.

## Adding Features

### Step 1: Update Types

Add new props to `FzDatepickerProps` in `src/types.ts` with JSDoc documentation.

### Step 2: Handle in mappedProps

If the new prop needs to be remapped or excluded before passing to VueDatePicker, update the `mappedProps` computed in `FzDatepicker.vue`.

### Step 3: Update Template

Add template bindings if the new prop affects the UI directly.

### Step 4: Add Tests

Write unit tests in `src/__tests__/FzDatepicker.spec.ts`. Coverage thresholds enforced by `vitest.config.ts`: **80% statements, 75% branches, 80% functions, 80% lines**. Aim higher for new code, especially around event emissions and prop mapping.

When asserting on the inner VueDatePicker, prefer `setupState.mappedProps` over `dp.props(...)`: VueDatePicker's `defineModel` + `v-bind` spread make Vue Test Utils' prop introspection unreliable. The `mappedProps` computed is what we actually pass via `v-bind="mappedProps"`, so testing it is equivalent.

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

## Dependencies

**Peer Dependencies:**

- `vue`: ^3.4.13
- `@fiscozen/icons`: workspace:^
- `tailwindcss`: ^3.4.1

**Runtime Dependencies:**

- `@vuepic/vue-datepicker`: ^12.1.0 — underlying date-picker engine
- `date-fns`: ^4.1.0 — `Locale` object + `format()` used by `valueFormat`
- `@fiscozen/button`: workspace — `FzIconButton` (calendar nav arrows) and `FzButton` (action buttons)
- `@fiscozen/input`: workspace — `FzInput` rendered inside VueDatePicker's `#dp-input` slot
- `@fiscozen/composables`: workspace — `useBreakpoints` (mobile detection)
- `@fiscozen/style`: workspace — breakpoint tokens and CSS variables

All `@fiscozen/*` packages are declared as `external` in `vite.config.ts`, so they are not bundled and consumers receive a single copy at install time.

## Known Limitations

- **Locale string coercion**: passing `locale: 'en'` (or any other locale string) is silently coerced to the Italian `date-fns` Locale object. VueDatePicker v12 expects a Locale object; the legacy string form is kept only for backward compatibility. For non-Italian use cases, pass a real `date-fns` Locale (e.g. `import { enGB } from 'date-fns/locale'`).
- **`name` prop precedence is inverted vs. JSDoc intent**: the legacy top-level `name` prop wins over `inputAttrs.name` (the v12-style API). Documented in `types.ts` JSDoc; the precedence will be flipped in v4.0.0.
- **Custom emits via fallthrough only**: several events declared in `defineEmits` (`internal-model-change`, `am-pm-change`, `range-start/end`, `tooltip-*`, etc.) are not emitted by FzDatepicker directly — they bubble from `<VueDatePicker>` through Vue's attribute fallthrough. They work for consumers but are not testable in isolation with `wrapper.emitted()`.
- **Italian-only action buttons**: the default `#action-buttons` slot renders hard-coded "Cancella" / "Seleziona". Consumers needing other languages must override the slot.
- **Italian aria-labels by default**: FzDatepicker passes a complete Italian `ariaLabels` map to VueDatePicker. Consumers may override individual keys (or localise into another language) via the `ariaLabels` prop — values are merged per-key, consumer wins.
- **Snapshot tests do not cover the teleported menu**: VueDatePicker teleports its calendar to `<body>`; `wrapper.html()` captures only the input wrapper. Calendar internals are exercised end-to-end via Storybook play functions.
