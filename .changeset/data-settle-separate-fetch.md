---
'@fiscozen/data': patch
---

`useCreate`, `useUpdate` and `useDelete` now settle when the `requestInterceptor` returns a changed `RequestInit`, returns `null` or throws: `execute()` resolves, `isLoading` returns to `false` and `data` or `error` hold the outcome. Before, the request reached the server but `execute()` never resolved unless it threw first. `await` on the object returned by `useFzFetch` now resolves after `execute()` also with a reactive `body` or `headers`.
