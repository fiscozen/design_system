---
'@fiscozen/composables': patch
---

FzFloating: with `useViewport`, clamp against the viewport instead of `document.body`.

The collision boundary is the container ∩ viewport, which is right for a real container but wrong for the implicit `document.body` default: body is not a clipping box for fixed content, and whenever the page is shorter than the viewport its rect shrinks the usable area. The clamp then pulled the content up over its own opener — on a 108px tall page a 48px menu resolved `maxTop = 108 - 8 - 48 = 52`, above an opener whose bottom sat at 76.

Only affects callers that pass `useViewport` (`FzSelect`, `FzTypeahead`, `FzPopover`), for which the viewport is exactly what the prop name promises; everyone else keeps the previous boundary.
