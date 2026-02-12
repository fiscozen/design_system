---
"@fiscozen/datepicker": major
---

## Upgrade FzDatepicker to @vuepic/vue-datepicker v12

### Dependency upgrades
- Upgraded `@vuepic/vue-datepicker` from **v8** to **v12**
- Upgraded `date-fns` from **v3** to **v4**
- Added new dependency on `@fiscozen/divider`

### Backward-compatible prop remapping (v8 → v12)
The component now extends the v12 `RootProps` API while preserving full backward
compatibility with the v8 prop interface. Legacy props are transparently remapped
to their v12 equivalents inside the component:

- `format` → `formats.input`
- `formatLocale` → `locale` (date-fns `Locale` object)
- `autoPosition` → removed (replaced by `floating` prop via Floating UI)
- `state` / `name` → `inputAttrs.state` / `inputAttrs.name`
- Time-related props (`enableTimePicker`, `enableMinutes`, `is24`,
  `timePickerInline`, `enableSeconds`, `noHoursOverlay`, `noMinutesOverlay`,
  `noSecondsOverlay`) → nested under `timeConfig`
- `flow` now accepts both the old `string[]` form and the new `FlowConfig` object

All legacy props are marked as `@deprecated` in the type definitions with
guidance on the new equivalent.

### New convenience prop
- `placement` — shorthand for `floating.placement` (Floating UI placement string)

### Revamped time-picker UI
- Replaced the simple inline arrow-up / arrow-down time-picker templates with a
  fully custom `#time-picker` slot implementation featuring:
  - Hour, minute, and second columns with increment/decrement icon buttons
  - Clickable display buttons that open a numeric **overlay grid** for quick
    selection (hours 0–23, minutes/seconds in 5-minute intervals)
  - Conditional rendering of minutes and seconds columns based on configuration
  - New dedicated styles (`.fz-time-picker`, `.fz-time-picker__overlay`, etc.)

### Input handling improvements
- Enabled `text-input` mode on VueDatePicker for direct keyboard entry
- Added `@focus` and `@keypress` event forwarding to the inner `FzInput`
- `handleInputModelUpdate` now calls `onClear` when the input value is emptied
- Improved type safety for the `onPaste` callback signature

### Reactive floating placement
- Added a computed `floatingKey` that forces a VueDatePicker remount whenever
  the `floating` configuration changes, ensuring placement updates are applied
  immediately

### Removed deprecated events
The following events were removed as they no longer exist in v12:
- `update:model-timezone-value`
- `recalculate-position`
- `time-picker-open` / `time-picker-close`

### Types & exports
- `FzDatepickerProps` now extends `Omit<RootProps, "flow" | "locale">` with
  custom overrides for `flow` and `locale` to accept both v8 and v12 forms
- New type exports: `FloatingPlacement`, `FlowConfig`, `TimeConfig`,
  `FormatsConfig`, `InputAttributesConfig`
