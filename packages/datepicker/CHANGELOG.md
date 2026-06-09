# @fiscozen/datepicker

## 3.2.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4
  - @fiscozen/input@3.4.1

## 3.2.0

### Minor Changes

- fd667cd: Drop the custom `#time-picker` slot override in favour of VueDatePicker v12's default time-picker UI. Public prop names, slot names, and event signatures are unchanged; only the time-picker visual contract changes — detailed below.

  **Props that now take effect** (previously silently ignored by the custom implementation):
  - `hoursIncrement` / `minutesIncrement` / `secondsIncrement` — step of the ± buttons (was hard-coded to 1)
  - `hoursGridIncrement` / `minutesGridIncrement` / `secondsGridIncrement` — step inside the overlay grid (was hard-coded to 1 / 5 / 5)
  - `is24: false` — renders the AM/PM toggle and emits `am-pm-change`
  - `minTime` / `maxTime` — bounds enforced at the UI level
  - `disabledTimes` — enforced at the UI level
  - `startTime` — default time when `modelValue` is empty
  - `timeArrowHoldThreshold` — long-press fast-increment

  **Italian aria-labels**: FzDatepicker now passes a complete Italian `ariaLabels` map to VueDatePicker so screen-reader announcements match the visible Italian UI. Examples: `"Mese precedente"` / `"Mese successivo"` for the calendar nav, `"Apri selezione ora"` / `"Chiudi selezione ora"` for the time-picker toggle, `"Incrementa ore"` / `"Decrementa minuti"` for the increment/decrement buttons, `"Cambia AM/PM"`, `"Apri elenco anni"`, `"Calendario"` for the menu container, etc. Consumers may override individual keys (or localise into another language) by passing their own `ariaLabels` prop — per-key merge, consumer wins.

  **Visual changes**:
  - Per-column labels "Ora / Minuti / Secondi" are gone (the default time picker has no column headings).
  - The full-cover h/m/s grid is replaced by VueDatePicker's contextual overlay, anchored to the clicked unit.
  - Inline chevrons stay Fiscozen-branded (`angle-up` / `angle-down`) via the new `#tp-inline-arrow-up` / `#tp-inline-arrow-down` slots. Additional branded slots: `#clock-icon`, `#calendar-icon`, `#arrow-up`, `#arrow-down` (in addition to the existing `#arrow-left`, `#arrow-right`, `#action-buttons`). All slots are documented in the MDX.
  - The `#action-buttons` slot (Cancella / Seleziona) now inherits `environment` from `inputProps`.

  **Bundle (compliance fix)**: `vite.config.ts` now externalizes `@fiscozen/*`, `@vuepic/vue-datepicker`, and `date-fns` (previously only `vue` was external — out of line with the DS-wide `CLAUDE.md` rule that requires `@fiscozen/*` deps to be listed in `rollupOptions.external`). As a side-effect the published **JS** bundle shrinks from ~510 kB to ~8 kB (gzip ~2.6 kB) and consumers no longer get duplicated copies of `@fiscozen/*` packages. The CSS bundle (~25 kB, including the inlined `vue-datepicker` stylesheet) remains intentionally self-contained so consumers don't need a separate CSS import.

  **Deprecation schedule**: legacy v8 props (`format`, `formatLocale`, `autoPosition`, `state`, `name`, `enableTimePicker`, `enableMinutes`, `is24`, `timePickerInline`, `enableSeconds`, `noHoursOverlay`, `noMinutesOverlay`, `noSecondsOverlay`) and the `cleared` event are confirmed for removal in a future version. They keep working in this release. New code should use `formats`, `locale`, `floating`, `inputAttrs.state`, `inputAttrs.name`, `timeConfig.*`, and `fzdatepicker:clear`.

  **`flow` prop**: now properly documented (JSDoc, MDX props table, Storybook `argTypes`).

## 3.1.2

### Patch Changes

- f92eaa7: Fix HD-23714 (name via inputAttrs not propagated) and align DS baselines
  - 🚨 HD-23714: `safeInputProps` now falls back to `inputAttrs.name` so the visible `<FzInput>` rendered in VueDatePicker's `#dp-input` slot receives the `name` attribute also when callers pass it via `:inputAttrs="{ name: '...' }"` (the LIB-2583 / VueDatePicker v12 style). Precedence is preserved: `props.name` > `inputProps.name` > `inputAttrs.name`.
  - Pair `border-1` with `border-solid` on `.dp__input_wrap .rounded` so the input border renders in host environments without a global Tailwind preflight.
  - Reset `border: 0` on internal `button.dp__btn` (calendar header arrows, year/month nav, time-picker controls) so the UA native border doesn't leak into the calendar UI.

- Updated dependencies [c77895b]
  - @fiscozen/input@3.4.0

## 3.1.1

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1
  - @fiscozen/input@3.3.1

## 3.1.0

### Minor Changes

- 4a4cde6: Add clearable prop. When enabled, a clear (×) icon appears when the input has a value.

### Patch Changes

- Updated dependencies [4a4cde6]
  - @fiscozen/input@3.3.0

## 3.0.7

### Patch Changes

- Updated dependencies [b4ae9e4]
- Updated dependencies [3428436]
  - @fiscozen/input@3.2.0
  - @fiscozen/icons@1.0.3

## 3.0.6

### Patch Changes

- Updated dependencies [9b12cbf]
  - @fiscozen/input@3.1.0

## 3.0.5

### Patch Changes

- 5a39547: Remove icons from dependencies (remians a peerDep)
- Updated dependencies [5000905]
  - @fiscozen/icons@1.0.1

## 3.0.4

### Patch Changes

- 877e577: Fix teleport and adds error and helpText slots
- Updated dependencies [c2a049e]
  - @fiscozen/input@3.0.3

## 3.0.3

### Patch Changes

- Updated dependencies [d662a78]
  - @fiscozen/input@3.0.2

## 3.0.2

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/input@3.0.1

## 3.0.1

### Patch Changes

- 72e16ac: Remove dead `date-update` event handler left over from vue-datepicker v8. The event no longer exists in v12, and the handler was never firing. This also removes the now-unused `handleDateUpdate` function and the `parse` import from date-fns. Paste handling is delegated to VueDatePicker's built-in `onPaste` slot callback.

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/button@3.0.0
  - @fiscozen/input@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/style@0.3.0
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/input@2.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [26cd2bf]
  - @fiscozen/input@1.0.2

## 1.0.0

### Major Changes

- 8db9f08: ## Upgrade FzDatepicker to @vuepic/vue-datepicker v12

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

## 0.1.19

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/button@1.0.2
  - @fiscozen/input@1.0.1

## 0.1.18

### Patch Changes

#### Modifiche dalla versione 0.1.15

- Gestione del tasto **Tab** per la navigazione accessibile nel datepicker (HD-16309)
- Gestione dell'evento **blur** per chiusura corretta del calendario
- Updated dependencies
  - @fiscozen/button@1.0.1
  - @fiscozen/input@1.0.0
  - @fiscozen/style@0.2.0
  - @fiscozen/composables@1.0.1
