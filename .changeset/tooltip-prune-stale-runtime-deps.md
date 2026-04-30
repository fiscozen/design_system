---
"@fiscozen/tooltip": patch
---

Remove `@fiscozen/button` and `@fiscozen/link` from runtime dependencies. After the `__fzKind` refactor, `FzTooltip` no longer imports those packages as values — auto-detection of interactive children works via primitive string markers read off the slot vnode. Both packages are kept in `devDependencies` because the tooltip test suite still mounts `FzButton`/`FzLink` to verify the auto-detection behavior.

Pure dependency-graph cleanup; no behavior change. Consumers using `<FzTooltip>` around `<FzButton>` or `<FzLink>` already have those packages in their own dependency tree.
