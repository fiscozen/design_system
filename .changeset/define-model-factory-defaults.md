---
'@fiscozen/checkbox': patch
'@fiscozen/upload': patch
'@fiscozen/table': patch
---

`FzCheckboxGroup`, `FzCheckboxCard`, `FzUpload` and `FzTable` declare their `defineModel` array and object defaults as factories, so every instance starts from its own empty value instead of one shared across instances, and they type-check against Vue 3.5.39+.
