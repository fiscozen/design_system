---
'@fiscozen/card-list': minor
---

FzCardListItem: the multi-action menu is an `FzPopover` now, so it renders in the top layer — never clipped by the row — and comes with light dismiss and Esc. Which engine places it (native popover in CSS, or `FzFloating`) is the popover's business; the card only says `bottom-end`. Same actions, same sections, same `fzaction:click` payload as the `FzIconDropdown` it replaces, and the ellipsis opener is now labelled "Mostra azioni" (it previously exposed the default "Open dropdown" label) and reports its state through `aria-expanded`.

`@fiscozen/dropdown` is no longer a dependency of this package; `@fiscozen/popover` is.

Fixes ids that other elements resolve: they were generated with `useId()`, which is scoped to the Vue app, so a document holding several apps (Storybook docs mode, or an app with several mount points) reused them. An ellipsis button could open another card's menu, and the `aria-labelledby` of a link row could make a screen reader announce another card's title. Both are now unique document-wide.
