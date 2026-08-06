---
'@fiscozen/card-list': minor
---

FzCardListItem: the multi-action menu is now a native popover positioned with CSS anchor positioning (top layer, so it is never clipped by the row, with light dismiss and Esc for free). Browsers without the Popover API or CSS anchor positioning keep the previous `FzIconDropdown` menu as a fallback, with the same actions, sections and `fzaction:click` payload. The ellipsis opener is now labelled "Mostra azioni" in both paths (it previously exposed the default "Open dropdown" label).

Fixes ids that other elements resolve: they were generated with `useId()`, which is scoped to the Vue app, so a document holding several apps (Storybook docs mode, or an app with several mount points) reused them. An ellipsis button could open another card's menu, and the `aria-labelledby` of a link row could make a screen reader announce another card's title. Both are now unique document-wide.
