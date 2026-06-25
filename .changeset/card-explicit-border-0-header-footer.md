---
'@fiscozen/card': patch
---

`FzCard` ora applica `border-0` esplicito su header e footer di default.
Risolve i casi in cui consumer che mescolano Tailwind senza preflight + Bootstrap reboot vedevano un bordo non voluto perché il template applicava `border-solid` solitario (border-style senza width → fallback UA `border-width: medium`).
Le variant con bordo continuano a funzionare invariate.
