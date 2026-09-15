---
"@fiscozen/appointments": patch
---

FzAppointments: fix the "un'altro" apostrophe in the default alert description, and stop
inviting the user to pick another day when no day carries slots. With `slots: []` (manual)
or `slotCount: 0` (auto) the day navigation and the info text are hidden — neither points
anywhere — and the alert reads "Al momento non ci sono orari disponibili."
