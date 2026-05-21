---
'@fiscozen/datepicker': minor
---

Drop the custom `#time-picker` slot override in favour of VueDatePicker v12's default time-picker UI. Public prop names and slot names are unchanged; the `flow-step` emit type is narrowed and the time-picker visual contract changes — both detailed below.

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

**Bundle**: `vite.config.ts` now externalizes `@fiscozen/*`, `@vuepic/vue-datepicker` and `date-fns` (previously only `vue`). The published **JS** bundle goes from ~510 kB to ~8 kB (gzip ~2.6 kB) and consumers no longer get duplicated copies of `@fiscozen/*` packages. The CSS bundle (~25 kB, including the inlined `vue-datepicker` stylesheet) is intentionally self-contained so consumers don't need a separate CSS import.

**Type changes (TS-only)**:

- The `flow-step` emit signature was narrowed from `[...args: any[]]` to `[step: number]`. This matches the runtime contract (VueDatePicker always emits a single numeric step index). TypeScript handlers typed against `(...args: any[])` will need to be retyped as `(step: number)`. No runtime breakage.

**Deprecation schedule**: legacy v8 props (`format`, `formatLocale`, `autoPosition`, `state`, `name`, `enableTimePicker`, `enableMinutes`, `is24`, `timePickerInline`, `enableSeconds`, `noHoursOverlay`, `noMinutesOverlay`, `noSecondsOverlay`) and the `cleared` event are confirmed for removal in **v4.0.0**. They keep working in this release. New code should use `formats`, `locale`, `floating`, `inputAttrs.state`, `inputAttrs.name`, `timeConfig.*`, and `fzdatepicker:clear`.

**`flow` prop**: now properly documented (JSDoc, MDX props table, Storybook `argTypes`).
