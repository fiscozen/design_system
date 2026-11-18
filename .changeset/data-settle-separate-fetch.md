---
'@fiscozen/data': patch
---

`useCreate`, `useUpdate` and `useDelete` now settle when the `requestInterceptor` returns a changed `RequestInit`, returns `null` or throws: `execute()` resolves, `isLoading` returns to `false` and `data` or `error` hold the outcome. Before, `execute()` in these cases never settled unless it threw first. With a changed `RequestInit` the request still reached the server; with `null` or a throw no request was sent.

`await` on the object returned by `useFzFetch` now resolves once the request has finished also when the `requestInterceptor` returns a changed `RequestInit`, returns `null` or throws, and with a reactive `body` or `headers`. It resolves with a copy of that object without `then()`: the refs are shared, and its `execute()` goes through the interceptors.
