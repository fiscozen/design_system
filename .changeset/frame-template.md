---
'@fiscozen/layout': minor
---

New shell: `FzFrameTemplate`, the backoffice application frame — a persistent icon `nav` rail, a slim app-level `header` toolbar, the page, and an optional 400px tools `aside` that keeps its state across navigation *and* across close/open (it is hidden, not unmounted).

Its reason for existing is the height contract, not the chrome. Every other shell here is `min-h-dvh` + document scroll, i.e. an ancestor with an indefinite height, and a `fills-parent` layout mounted in one collapses to zero and never scrolls its regions. This shell inverts the model — the root is `h-dvh` and clips — and `contentHeight` picks what the content region offers: `scroll` (the default) makes it the app's single scroll container, `bounded` gives it a definite height and makes it clip. Because the switch is per page, adopting it is incremental: a page opts into `bounded` when it is ported, and every other page is untouched.

That closes two gaps this package had documented against itself. `FzThreeColumnsTemplate` now has a verified host: `nestWithin` names `FzFrameTemplate`, backed by cases in `layoutComposition.spec.ts` and a Storybook play function that measures the resolved height chain in real Chromium (jsdom has no layout engine, so it cannot prove this). Its `composeOnly.safe` flips to `true` — a compose-only consumer can now create the bounded ancestor it requires, through a prop. `FzListTemplate` and `FzDetailTemplate` list the new shell as a verified host too.

Also new: `FZ_PAGE_SCROLL_TARGET`. Under `contentHeight="scroll"` the window no longer scrolls, so `window.scrollTo(0, 0)` is a no-op and browser scroll restoration on back/forward stops reaching the page; the shell provides its content region element so the app can scroll the page and wire its router's `scrollBehavior` against it.

Additive: no existing component, prop, slot or export changes.
