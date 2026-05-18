---
"@fiscozen/input": minor
---

Add `id` prop and align DS baselines

  - NEW: `FzInput` accepts an optional `id` prop. When provided, it sets the underlying `<input>`'s `id` and the `<label>`'s `for` attribute to the same value so the label-input binding stays intact. When omitted, the component continues to generate a stable internal id. Aligns the component with `FzTextarea`'s `effectiveId` pattern.
  - Apply `text-core-black` baseline on the root wrapper so descendant text inherits the design's neutral colour.
  - Pair `border-1` with `border-solid` on the input container so the 1px border renders in host environments without a global Tailwind preflight.
  - Apply `mb-0` baseline on the label so it does not collide with host `<label>` reboots that add margin-bottom.
  - Style disabled and readonly value text intrinsically: the `<input>` now carries `disabled:text-grey-300` and `read-only:text-grey-300` Tailwind variants (the placeholder is already `placeholder:text-grey-300` by default). This removes the dependency on a `.text-grey-300`-on-container class convention to color the value text in host environments where the input would otherwise keep the UA default color.
  - Drop the inline `style="width: ..."` previously applied to the helper text and error message elements. Their width is now set by the natural document flow.
