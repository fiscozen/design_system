---
"@fiscozen/datepicker": patch
---

Remove dead `date-update` event handler left over from vue-datepicker v8. The event no longer exists in v12, and the handler was never firing. This also removes the now-unused `handleDateUpdate` function and the `parse` import from date-fns. Paste handling is delegated to VueDatePicker's built-in `onPaste` slot callback.
