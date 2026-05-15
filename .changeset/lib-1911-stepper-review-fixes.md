---
"@fiscozen/stepper": major
---

FzStepper review feedback.

BREAKING CHANGE: remove the `environment` prop and the `FzStepperEnvironment` exported type. The prop was declarative-only (never affected rendering); consumers passing `environment="frontoffice" | "backoffice"` must drop the prop.

Other changes:
- Align the step badge with the step title using `items-baseline` across the desktop layout, the mobile dropdown opener, and the mobile-without-list layout (was a mix of `items-start` and `items-center`).
- Mobile: make the action-list popup span the full row width across all mobile breakpoints by overriding the FzDropdown actionList slot and pinning the FzActionList width to the opener row.
- Fix the mobile title/description truncation by adding the missing `min-w-0` constraints on the opener flex containers.
