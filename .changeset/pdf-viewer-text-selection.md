---
'@fiscozen/pdf-viewer': patch
---

`FzPdfViewer` with `selectable` keeps the text selection on the text the pointer crosses. A drag that started on a word and overshot the end of its line into blank space used to jump to unrelated lines, or drop the word altogether when dragged backwards; it now selects only the text crossed, as in the pdf.js viewer. Copied text is normalized to Unicode NFKC (ligatures such as "ﬁ" become "fi") and stripped of NUL characters.
