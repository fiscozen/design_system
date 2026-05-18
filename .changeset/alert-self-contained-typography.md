---
"@fiscozen/alert": patch
---

Apply self-contained typography baselines

  - Add `text-core-black` to the alert container so descendant text inherits the design's neutral colour without relying on the host environment's text colour default.
  - Add `mb-0` to the internal `<p>` elements (title and description), neutralising the host `<p> { margin-bottom: 1rem }` reset that ships with Bootstrap-style reboots. The pre-existing `mb-16` on the description (when an action is rendered) still wins, so the spacing-before-action intent is preserved.
