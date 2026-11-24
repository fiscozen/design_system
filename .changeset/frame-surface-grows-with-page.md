---
'@fiscozen/layout': patch
---

`FzFrameTemplate`: with `contentHeight="scroll"` the page surface (the `card` chrome) now grows with its content. Before, a page taller than the content region overflowed the card: the card stayed one region tall and the content scrolled past its bottom edge. A short page still fills the region. `contentHeight="bounded"` is unchanged.
