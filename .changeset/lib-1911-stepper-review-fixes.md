---
"@fiscozen/stepper": patch
---

Fix FzStepper review feedback on mobile: top-align the badge with the step title in the dropdown opener (was vertically centered against title+description), make the action-list popup span the full row width across all mobile breakpoints by overriding the FzDropdown actionList slot and pinning the FzActionList width to the opener row, and fix the title/description truncation by adding the missing min-w-0 constraints on the opener flex containers.
