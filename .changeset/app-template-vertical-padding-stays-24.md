---
"@fiscozen/layout": patch
---

FzAppTemplate: keep the card's vertical padding at 24px below the breakpoint, narrowing only the sides

Corrects the mobile inset shipped in 1.3.2, which dropped the whole padding to a uniform 16px. Design's spec is narrower than that: the horizontal inset goes 24px → 16px below the `desktop` breakpoint, but the vertical padding stays 24px everywhere.

The distinction is worth keeping straight, because the two paddings are doing different jobs. The horizontal inset is a width negotiation — on a phone every pixel spent on a margin is a pixel the content cannot use, so it shrinks. The vertical padding is a separation between the content and the chrome above and below it, and that separation is no less necessary on a small screen; shrinking it just crowds the title against the nav bar.

`card` chrome below the breakpoint is now `px-16 py-24` instead of `p-16`. Desktop is unchanged at `p-24`.
