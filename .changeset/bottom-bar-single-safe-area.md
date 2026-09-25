---
'@fiscozen/layout': patch
---

fix(layout): LIB-3174 the bottom-bar region no longer pads the bottom safe-area inset

`FzLayoutBottomBar` padded `env(safe-area-inset-bottom)` but paints no background. The
bar content teleported into it paints the surface and has to clear the home indicator
itself, so on a device with an inset the content padded it a second time: the actions
sat two insets above the edge, and under the white surface a transparent strip as tall
as the inset let the page scroll through, with the grey page background showing at the
end of the page. Measured with a 34px emulated inset on an iPhone viewport: the surface
stopped 34px short of the edge and the primary action sat 84px above it.

The region now applies no inset. This matches how `FzAppTemplate` already treats every
region that paints no surface: the content inside owns the insets, as the injected nav
does with `respectSafeArea`. Bar content that paints a surface pads
`env(safe-area-inset-bottom)` itself, so its background reaches the device edge. The
Storybook bars now show the pattern.

On a platform that reports no inset, desktop included, nothing changes. **Bar content
that did not pad the inset itself now sits flush against the home indicator**: add
`padding-bottom: calc(<gap> + env(safe-area-inset-bottom, 0px))` to its surface.
