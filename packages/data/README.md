# @fiscozen/data

## Data Layer – Reactive Composable Architecture

> **Package users:** installation, setup, API, examples, and merge helpers → **Storybook > Documentation > Data Layer**.
>
> This README targets **developers working on the package** (architecture, code layout, development guide, testing).

---

**What this package does:** Structured data layer for Vue 3 apps (reactive CRUD, CSRF, deduplication, interceptors, merge helpers), built on `@vueuse/core`. Production-ready (v1.0).

---

## Table of Contents

1. [Current Status](#1-current-status)
2. [Objective](#2-objective)
3. [Architecture](#3-architecture)
4. [Package Exports](#4-package-exports)
5. [Backend Conventions](#5-backend-conventions)
6. [Development Guide](#6-development-guide)
7. [Architectural Decisions](#7-architectural-decisions)
8. [Roadmap](#8-roadmap)
9. [Appendix](#9-appendix)

---

## 1. Current Status

### ✅ Completed (v1.0)

**Core Features:**
- ✅ Complete CRUD operations (`useRetrieve`, `useList`, `useCreate`, `useUpdate`, `useDelete`)
- ✅ Reactive parameters (auto-refetch when filters/sort/page change)
- ✅ CSRF token auto-injection for mutations (POST/PUT/PATCH/DELETE)
- ✅ Request deduplication (configurable globally and per-action)
- ✅ Request and response interceptors (modify requests/responses, abort requests)
- ✅ Debug logging (configurable via `setupFzFetcher({ debug: true })`)
- ✅ Call-with-defaults helpers for custom actions (`callListActionWithDefaults`, `callPaginatedListActionWithDefaults`, `callRetrieveActionWithDefaults`, `callCreateActionWithDefaults`, `callUpdateActionWithDefaults`, `callDeleteActionWithDefaults`)
- ✅ Filter semantics: `undefined` = omit from request, `null` = send to server
- ✅ TypeScript-first approach with complete type safety
- ✅ Subpath exports (`@fiscozen/data/rest`)

**Architecture:**
- ✅ Layer separation (Component → Entity → Actions → HTTP)
- ✅ Built on `@vueuse/core` for robust foundations
- ✅ Modular and extensible design

**Documentation:**
- ✅ Complete API reference
- ✅ Usage examples and patterns
- ✅ JSDoc on all public methods

### 🔮 Future Enhancements (v2.0)

- [ ] Response caching and cache invalidation
- [ ] Optimistic updates for mutations
- [ ] Retry logic with exponential backoff
- [ ] GraphQL adapter alongside REST
- [ ] Real-time updates via WebSockets integration
- [ ] Devtools integration
- [ ] Offline support with request queue
- [ ] Response pagination metadata parsing

---

## 2. Objective

The aim is to design an architecture in which each entity (for instance, `User`) has its own **dedicated composable** (`useUsers`) encapsulating all data-handling logic, built on top of shared lower-level layers.

**Key benefits:**
- Cleaner components, free from embedded API code
- Consistent structure across all entities
- Centralized handling of state, errors, and loading indicators
- Strong TypeScript typing
- Easier refactoring and testing

**Target Usage:**
- Primarily for external consumer applications (not just internal design system usage)
- Vue 3 only (no framework-agnostic requirement)
- Client-side rendering only (no SSR support required)

---

## 3. Architecture

### Layer Structure

```text
Vue component
   ↓ uses useUsers, etc.
Entity composable (useUsers)
   ↓ uses useActions
Generic CRUD API (useActions)
   ↓ uses useFzFetch
HTTP wrapper (useFzFetch)
   ↓ uses @vueuse/core createFetch
@vueuse/core createFetch
```

### Layers Explained

1. **Entity Composable** - Domain-specific composables (e.g., `useUsers`, `useInvoices`)
   - Created by developers in their applications
   - Provides clean, typed interface for each entity
   - Hides implementation complexity

2. **Generic Actions** - `useActions<T>()` providing CRUD operations
   - TypeScript generics for type safety
   - Reactive parameters support
   - Smart query building (filters, sorting, pagination)
   - Consistent API across all entities

3. **HTTP Layer** - `useFzFetch` with reactive URL support
   - Built on `@vueuse/core`'s `createFetch`
   - Reactive URLs (auto-refetch when computed URLs change)
   - Query parameter merging
   - CSRF token auto-injection
   - Request deduplication

4. **Foundation** - `@vueuse/core` for robust state management

## 4. Package Exports

The package provides building blocks, not entity-specific composables:

```typescript
// Package exports (from @fiscozen/data/rest or @fiscozen/data)
export { 
  useActions,           // Generic CRUD factory
  setupFzFetcher,       // Setup configuration
  useFzFetch,           // Low-level HTTP wrapper
  resetFzFetcher,
  callListActionWithDefaults,
  callPaginatedListActionWithDefaults,
  callRetrieveActionWithDefaults,
  callCreateActionWithDefaults,
  callUpdateActionWithDefaults,
  callDeleteActionWithDefaults,
}

export type * from './types'
```

**Developers create their own entity composables** using these building blocks.

---

## 5. Backend Conventions

The package expects REST APIs with pagination (`page`/`page_size`), ordering (`ordering=name,-created_at`), filters as query params, URL versioning, and nested relations. Details and examples: **Storybook > Documentation > Data Layer**.

---

## 6. Development Guide

This section provides detailed information for developers working on the package internals, including architecture, code structure, and how to make fixes or add features.

### 6.1 Package Structure

```
packages/data/
├── src/
│   ├── rest/
│   │   ├── actions/          # CRUD operations layer
│   │   │   ├── create/       # Create action (POST)
│   │   │   ├── delete/       # Delete action (DELETE)
│   │   │   ├── list/         # List action (GET with filters/ordering/pagination)
│   │   │   ├── paginated-list/ # Paginated list action (GET with paginated response)
│   │   │   ├── retrieve/     # Retrieve action (GET by ID)
│   │   │   ├── update/       # Update action (PUT/PATCH)
│   │   │   ├── shared/       # Shared utilities for actions
│   │   │   │   ├── merge.ts  # Merge helpers for custom actions
│   │   │   │   ├── normalize.ts
│   │   │   │   └── ...
│   │   │   └── index.ts      # Main export (useActions factory)
│   │   │
│   │   └── http/             # HTTP layer (low-level)
│   │       ├── features/     # Feature modules
│   │       │   ├── deduplication/  # Request deduplication
│   │       │   └── interceptors/    # Request/response interceptors
│   │       ├── managers/     # State managers
│   │       │   ├── csrf/      # CSRF token management
│   │       │   └── deduplication/  # Deduplication manager
│   │       ├── setup/         # Global setup and state
│   │       ├── types/         # TypeScript type definitions
│   │       ├── utils/         # Utility functions
│   │       │   ├── csrf.ts    # CSRF token injection
│   │       │   ├── error.ts   # Error normalization
│   │       │   ├── options.ts # Options normalization
│   │       │   ├── response.ts # Response parsing
│   │       │   └── url.ts     # URL building and query params
│   │       ├── wrappers/      # Wrapper pattern implementation
│   │       │   ├── adapters.ts # Wrapper adapters
│   │       │   ├── chain.ts   # WrapperChain class
│   │       │   └── types.ts   # Wrapper interfaces
│   │       ├── common.ts      # Common constants
│   │       ├── config.ts      # Configuration constants
│   │       └── index.ts       # Main export (useFzFetch)
│   │
│   └── __tests__/            # Test files
│       ├── csrf.test.ts
│       ├── deduplication.test.ts
│       ├── interceptors.test.ts
│       ├── integration.test.ts
│       ├── list.test.ts
│       ├── merge.test.ts     # Merge helpers
│       ├── normalize.test.ts
│       ├── paginated-list.test.ts
│       ├── setup.test.ts
│       └── url.test.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 6.2 Architecture Overview

The package follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│ Component Layer (Consumer Application)                 │
│ - useUsers, useInvoices, etc.                          │
└────────────────────┬──────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────┐
│ Actions Layer (src/rest/actions/)                     │
│ - useActions<T>() factory                             │
│ - createRetrieveAction, createListAction, etc.         │
│ - Handles: query building, reactive params, CRUD ops   │
└────────────────────┬──────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────┐
│ HTTP Layer (src/rest/http/)                          │
│ - useFzFetch() wrapper                                │
│ - WrapperChain pattern                                │
│ - Features: CSRF, deduplication, interceptors         │
└────────────────────┬──────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────┐
│ Foundation (@vueuse/core)                             │
│ - createFetch                                         │
│ - Reactive state management                           │
└───────────────────────────────────────────────────────┘
```

### 6.3 Core Components Explained

#### 6.3.1 HTTP Layer (`src/rest/http/`)

**Entry Point: `index.ts`**
- Exports `useFzFetch` - main HTTP wrapper function
- Handles 3 overload cases (basePath only, basePath + params, basePath + params + options)
- Uses `createFetchResult` helper to apply wrappers via `WrapperChain`

**Wrapper Pattern (`wrappers/`)**
- **`chain.ts`**: `WrapperChain` class that applies wrappers sequentially
- **`adapters.ts`**: Adapter implementations for each wrapper (request interceptor, response interceptor, deduplication)
- **`types.ts`**: `Wrapper` interface and `WrapperContext` type

**How Wrappers Work:**
```typescript
// 1. Base fetch result is created
const baseFetchResult = state.fzFetcher<T>(url, requestInit).json()

// 2. Wrapper chain is created with default wrappers
const chain = new WrapperChain()
chain.add(requestInterceptorWrapper)   // Applied first
chain.add(responseInterceptorWrapper)  // Applied second
chain.add(deduplicationWrapper)        // Applied last

// 3. Wrappers are applied sequentially
return chain.apply(baseFetchResult, context)
```

**Why This Pattern?**
- Easy to add/remove wrappers without modifying core code
- Clear execution order
- Testable in isolation
- Composable functionality

#### 6.3.2 Features (`features/`)

**Request Interceptor (`features/interceptors/request.ts`)**
- Wraps `execute()` method to intercept requests before fetch
- Can modify `requestInit` or abort request (return `null`)
- If `requestInit` is modified, creates new fetch call with modified config
- Uses reactive `watch` to sync state from modified fetch to original result

**Response Interceptor (`features/interceptors/response.ts`)**
- Wraps `execute()` method to intercept responses after fetch
- Can modify response body (requires re-parsing)
- Uses `parseResponseBody` utility for consistent parsing

**Deduplication (`features/deduplication/`)**
- **`wrapper.ts`**: Wraps `execute()` to check for pending identical requests
- **`managers/deduplication/index.ts`**: `DeduplicationManager` class
  - Generates unique keys: `method:normalizedUrl:normalizedBody`
  - Tracks pending requests in `Map`
  - Uses `watchEffect` to sync state reactively
  - Cleans up automatically when request completes

#### 6.3.3 Managers (`managers/`)

**CSRF Manager (`managers/csrf/index.ts`)**
- Reads CSRF token from cookie (handles values with `=`)
- Injects token into headers for mutation methods (POST/PUT/PATCH/DELETE)
- Uses `CsrfManager` class with `injectToken()` method

**Deduplication Manager (`managers/deduplication/index.ts`)**
- Generates deduplication keys
- Normalizes URLs (removes trailing slashes, sorts query params)
- Normalizes bodies (sorts JSON keys, creates identifier for non-JSON)
- Tracks pending requests and watches for completion

#### 6.3.4 Setup & State (`setup/`)

**`state.ts`**: Global singleton state
- `fzFetcher`: `@vueuse/core` fetch instance
- `globalBaseUrl`: Base URL for API requests
- `globalCsrfOptions`: CSRF configuration
- `csrfManager`: CSRF manager instance
- `deduplicationManager`: Deduplication manager instance
- `globalRequestInterceptor`: Request interceptor function
- `globalResponseInterceptor`: Response interceptor function
- `globalDebug`: Debug logging flag

**`index.ts`**: Setup function
- `setupFzFetcher()`: Initializes global state
- `resetFzFetcher()`: Resets state (useful for testing)

#### 6.3.5 Utils (`utils/`)

**`error.ts`**: `normalizeError(error: unknown): Error`
- Converts any error-like value to `Error` instance
- Handles strings, objects with `message` property, etc.

**`response.ts`**: `parseResponseBody<T>(response: Response): Promise<T>`
- Parses response based on Content-Type header
- Tries JSON first, falls back to text
- Handles all content types consistently

**`url.ts`**: `getUrlWithQueryParams(basePath, queryParams)`
- Builds URL with query parameters
- Handles reactive `queryParams`
- Merges existing query params from URL

**`csrf.ts`**: `injectCsrfToken(method, headers)`
- Injects CSRF token for mutation methods
- Returns headers with CSRF token added

**`options.ts`**: `normalizeUseFzFetchOptions(options)`
- Normalizes `UseFzFetchOptions` for `@vueuse/core`
- Handles default values and type conversions

#### 6.3.6 Actions Layer (`actions/`)

**Factory Pattern: `useActions<T>(basePath)`**
- Returns object with 5 action creators:
  - `useRetrieve`: Get single entity by ID
  - `useList`: List entities with filters/ordering/pagination
  - `usePaginatedList`: List entities with paginated response and metadata
  - `useCreate`: Create new entity (POST)
  - `useUpdate`: Update entity (PUT/PATCH)
  - `useDelete`: Delete entity (DELETE)

**Each Action Creator:**
- Returns composable with `data`, `error`, `isLoading`, `execute`
- Handles reactive parameters (auto-refetch)
- Builds URLs and query strings
- Uses `useFzFetch` internally

**Shared Utilities (`shared/`):**
- `types.ts`: Common types for all actions
- `normalize.ts`: Normalizes action options, `isParamsObject` (params vs options discrimination)
- `error-handling.ts`: Centralized error handling
- `merge.ts`: Merge helpers for custom actions (default + view → merge → action)

#### 6.3.7 Call-with-defaults helpers (`shared/merge.ts`)

Call-with-defaults helpers let **package consumers** call an action with **default args** merged with **additional args** from the view. One helper per action type: list, paginated list, retrieve, create, update, delete. **User-facing usage and examples:** Storybook > Documentation > Data Layer.

**Location:** `src/rest/actions/shared/merge.ts`. Exported from `rest/actions/index.ts` and main `index.ts`.

**Public API:** `callListActionWithDefaults`, `callPaginatedListActionWithDefaults`, `callRetrieveActionWithDefaults`, `callCreateActionWithDefaults`, `callUpdateActionWithDefaults`, `callDeleteActionWithDefaults`. Input types: `MergeListActionArgsInput`, `MergeRetrieveActionArgsInput`, `MergeMutationActionArgsInput`. Internal (used by the helpers, not re-exported): `mergeListActionArgs`, `mergeRetrieveActionArgs`, `mergeMutationActionArgs`.

**List discrimination:** When the view passes a single argument, we distinguish params vs options via `isParamsObject` (presence of `filters`, `ordering`, or `pagination`). When `additionalOptions` is present, `additionalParamsOrOptions` is treated as params.

**Merge semantics:** Filters and pagination: object spread (view wins on same key). Ordering: use view's if view provided an `ordering` key, else default. Options: object spread (view wins). Retrieve: `overridePk` overrides `defaultPk` when provided; options merged. Mutations: options merged.

**Filter semantics (query layer):** `undefined` = omit from request (remove default filter); `null` = send to server. Implemented in `normalize.ts` (filters) and `http/utils/url.ts` (query params).

**Tests:** `src/__tests__/merge.test.ts` (discrimination, merge semantics, ref preservation, `toValue` on defaults).

### 6.4 How to Fix a Bug

#### Step 1: Identify the Problem

1. **Reproduce the bug**: Create a minimal test case
2. **Locate the code**: Use code search to find relevant files
3. **Understand the flow**: Trace execution path from entry point

**Example: Fixing a bug in CSRF token injection**

```typescript
// 1. Bug: CSRF token not injected for PATCH requests
// 2. Search for CSRF-related code
grep -r "csrf" src/rest/http/

// 3. Check CSRF manager
// File: src/rest/http/managers/csrf/index.ts
// Method: injectToken() - checks MUTATION_METHODS

// 4. Check MUTATION_METHODS constant
// File: src/rest/http/common.ts
// Verify PATCH is included: ["POST", "PUT", "PATCH", "DELETE"]
```

#### Step 2: Write a Failing Test

```typescript
// src/__tests__/csrf.test.ts
it('should inject CSRF token for PATCH requests', () => {
  document.cookie = 'csrf_token=test-token'
  
  setupFzFetcher({
    baseUrl: 'https://api.example.com',
    csrf: { enabled: true, cookieName: 'csrf_token' }
  })
  
  const { execute } = useFzFetch('/test', { method: 'PATCH' })
  
  // Mock fetch to verify headers
  let interceptedHeaders: HeadersInit | undefined
  global.fetch = vi.fn((_url, init) => {
    interceptedHeaders = init?.headers
    return Promise.resolve(new Response())
  }) as typeof fetch
  
  await execute()
  
  // Verify CSRF token was injected
  expect(interceptedHeaders).toHaveProperty('X-CSRF-Token', 'test-token')
})
```

#### Step 3: Fix the Code

```typescript
// Fix in src/rest/http/managers/csrf/index.ts
// Ensure PATCH is in MUTATION_METHODS (already correct)
// Check injectToken logic (already correct)
// Verify wrapper is applied (check createDefaultWrapperChain)
```

#### Step 4: Verify the Fix

```bash
# Run tests
pnpm --filter @fiscozen/data test:unit

# Run linting
pnpm --filter @fiscozen/data lint

# Test manually in browser/devtools
```

#### Step 5: Update Documentation

- Update README if API changed
- Update JSDoc comments if behavior changed
- Add examples if new use case

### 6.5 How to Add a Feature

#### Example: Adding Request Timeout Feature

**Step 1: Design the API**

```typescript
// Setup options
setupFzFetcher({
  baseUrl: 'https://api.example.com',
  timeout: 5000 // 5 seconds (global)
})

// Per-action override
useListUsers({ filters: {} }, { timeout: 10000 })
```

**Step 2: Create Feature Module**

```typescript
// src/rest/http/features/timeout/types.ts
export interface TimeoutOptions {
  timeout?: number | null // null = no timeout
}

// src/rest/http/features/timeout/wrapper.ts
export const wrapWithTimeout = <T>(
  fetchResult: UseFzFetchReturn<T>,
  timeout: number | null | undefined,
): UseFzFetchReturn<T> => {
  if (!timeout) return fetchResult
  
  const originalExecute = fetchResult.execute
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      // Add signal to requestInit
      // Execute with timeout
      await originalExecute(throwOnFailed)
    } finally {
      clearTimeout(timeoutId)
    }
  }
  
  return fetchResult
}
```

**Step 3: Create Wrapper Adapter**

```typescript
// src/rest/http/wrappers/adapters.ts
export const timeoutWrapper: Wrapper = {
  wrap<T>(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> {
    const timeout = context.useFetchOptions?.timeout ?? state.globalTimeout
    return wrapWithTimeout(fetchResult, timeout)
  },
}
```

**Step 4: Add to Wrapper Chain**

```typescript
// src/rest/http/index.ts
const createDefaultWrapperChain = (): WrapperChain => {
  const chain = new WrapperChain()
  chain.add(requestInterceptorWrapper)
  chain.add(responseInterceptorWrapper)
  chain.add(timeoutWrapper)              // ← Add here
  chain.add(deduplicationWrapper)
  return chain
}
```

**Step 5: Update Types**

```typescript
// src/rest/http/types/core.ts
export interface UseFzFetchOptions extends UseFetchOptions {
  timeout?: number | null
}

// src/rest/http/types/setup.ts
export interface SetupFzFetcherOptions {
  timeout?: number | null
}
```

**Step 6: Update State**

```typescript
// src/rest/http/setup/state.ts
export const state = {
  globalTimeout: null as number | null,
  // ... other state
}
```

**Step 7: Write Tests**

```typescript
// src/__tests__/timeout.test.ts
describe('Timeout Feature', () => {
  it('should abort request after timeout', async () => {
    setupFzFetcher({
      baseUrl: 'https://api.example.com',
      timeout: 100
    })
    
    global.fetch = vi.fn(() => 
      new Promise(resolve => setTimeout(() => resolve(new Response()), 1000))
    ) as any
    
    const { execute, error } = useFzFetch('/test', { immediate: false })
    await execute()
    
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.name).toBe('AbortError')
  })
})
```

**Step 8: Update Documentation**

- Add to README Configuration section
- Add examples
- Update API reference

### 6.6 Key Patterns & Conventions

#### 6.6.1 Wrapper Pattern

**When to Use:**
- Adding cross-cutting concerns (logging, timeout, retry)
- Modifying request/response behavior
- Adding functionality that wraps the entire fetch flow

**How to Implement:**

1. Create wrapper function in `features/[feature-name]/wrapper.ts`:
```typescript
export const wrapWithFeature = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  // ... feature-specific params
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  const originalExecute = fetchResult.execute
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    // Feature logic here
    return originalExecute(throwOnFailed)
  }
  return fetchResult
}
```

2. Create adapter in `wrappers/adapters.ts`:
```typescript
export const featureWrapper: Wrapper = {
  wrap<T>(fetchResult, context) {
    return wrapWithFeature(fetchResult, /* params from context */)
  },
}
```

3. Add to wrapper chain in `index.ts`:
```typescript
chain.add(featureWrapper)
```

#### 6.6.2 Error Handling Pattern

**Always use `normalizeError`:**
```typescript
import { normalizeError } from '../utils/error'

try {
  // code that might throw
} catch (error: unknown) {
  const normalizedError = normalizeError(error)
  fetchResult.error.value = normalizedError
  if (throwOnFailed) {
    throw normalizedError
  }
}
```

**Why:** Ensures consistent error types across the codebase.

#### 6.6.3 State Synchronization Pattern

**When syncing state between fetch results, use `watchEffect`:**
```typescript
import { watchEffect, nextTick } from 'vue'

const unwatchSync = watchEffect(() => {
  // Sync all reactive properties
  targetResult.data.value = sourceResult.data.value
  targetResult.error.value = sourceResult.error.value
  // ...
  
  // Cleanup when done
  if (!sourceResult.isFetching.value) {
    nextTick(() => {
      unwatchSync()
    })
  }
})
```

**Why:** `watchEffect` automatically tracks all accessed reactive properties, more efficient than explicit `watch` arrays.

#### 6.6.4 URL Normalization Pattern

**Always normalize URLs for deduplication keys:**
```typescript
// Use DeduplicationManager.normalizeUrl() internally
// Or create helper if needed elsewhere
const normalizedUrl = normalizeUrl(url) // Removes trailing slashes, sorts query params
```

**Why:** Ensures identical requests generate identical keys.

#### 6.6.5 Testing Patterns

**Unit Tests:**
- Test one feature/function at a time
- Mock dependencies (`global.fetch`, `state`)
- Use `resetFzFetcher()` in `beforeEach`

**Integration Tests:**
- Test complete flow (setup → request → interceptor → response)
- Verify state synchronization
- Test error handling end-to-end

**Test Structure:**
```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    resetFzFetcher()
    vi.clearAllMocks()
  })
  
  describe('SpecificBehavior', () => {
    it('should do something', async () => {
      // Arrange
      setupFzFetcher({ baseUrl: 'https://api.test.com' })
      global.fetch = vi.fn(() => Promise.resolve(new Response()))
      
      // Act
      const { execute } = useFzFetch('/test')
      await execute()
      
      // Assert
      expect(global.fetch).toHaveBeenCalledWith(...)
    })
  })
})
```

### 6.7 Common Tasks

#### Adding a New Action Type

1. Create action directory: `src/rest/actions/[action-name]/`
2. Create `index.ts` with action creator function
3. Create `types.ts` with types
4. Export from `src/rest/actions/index.ts`
5. Add to `useActions` factory return type

#### Modifying Request Behavior

1. Check if existing wrapper can handle it
2. If not, create new wrapper in `features/[feature-name]/`
3. Add adapter to `wrappers/adapters.ts`
4. Add to wrapper chain in `index.ts`

#### Adding Global Configuration

1. Add to `SetupFzFetcherOptions` in `types/setup.ts`
2. Store in `state.ts`
3. Use in setup function (`setup/index.ts`)
4. Document in README Configuration section

#### Debugging Tips

**Enable Debug Logging:**
```typescript
setupFzFetcher({ baseUrl: '...', debug: true })
// Logs all requests, responses, and state changes
```

**Check State:**
```typescript
import { state } from '@fiscozen/data/rest/http/setup/state'
console.log(state) // Inspect global state
```

**Trace Execution:**
- Add `console.log` in wrapper `execute` methods
- Check browser Network tab for actual requests
- Use Vue DevTools to inspect reactive state

### 6.8 Code Quality Standards

**TypeScript:**
- No `any` types in public API
- Use `unknown` for error types, then normalize
- Export types from dedicated `types.ts` files

**Vue 3:**
- Use `<script setup lang="ts">` for components
- Use `computed`, `ref`, `watch` from Vue
- Prefer `watchEffect` for automatic dependency tracking

**Error Handling:**
- Always use `normalizeError()` utility
- Set `error.value` before throwing (if `throwOnFailed`)
- Clean up watches/resources in finally blocks

**Performance:**
- Use `watchEffect` instead of multiple `watch` calls
- Clean up watches with `nextTick` for proper timing
- Memoize expensive computations

**Documentation:**
- JSDoc on all public functions
- Explain "why" not "what" in comments
- Include `@example` for complex functions
- Document limitations and edge cases

### 6.9 File Naming Conventions

- **Test files**: `__tests__/[feature].test.ts`
- **Type files**: `types.ts` in same directory or `types/[name].ts`
- **Utility files**: `utils/[name].ts`
- **Feature modules**: `features/[feature-name]/[file].ts`
- **Manager classes**: `managers/[manager-name]/index.ts`

### 6.10 Testing Checklist

Before submitting a fix or feature:

- [ ] Unit tests written and passing
- [ ] Integration tests added (if applicable)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] README updated (if API changed)
- [ ] JSDoc comments added/updated
- [ ] Examples added (if new feature)
- [ ] Edge cases handled
- [ ] Error cases tested
- [ ] Cleanup verified (watches, timers, etc.)

---

## 7. Architectural Decisions

### Singleton Pattern

The package uses a singleton pattern for global fetcher state:

```typescript
// Setup once at app initialization
setupFzFetcher({ baseUrl: '...' })

// Use anywhere in the app
const { useList } = useActions<User>('users')
```

**Rationale:**
- Simple and ergonomic API
- No SSR requirement (CSR only)
- Suitable for single-tenant applications

**Future Consideration:**
- If multi-tenancy or SSR support is needed, consider Provide/Inject pattern

### Export Structure

Two import patterns are supported:

```typescript
// ✅ Recommended: Subpath import
import { useActions, setupFzFetcher } from '@fiscozen/data/rest'

// ✅ Alternative: Namespace import
import { rest } from '@fiscozen/data'
const { useActions, setupFzFetcher } = rest
```

**Rationale:**
- Subpath imports allow future extensions (`/graphql`, `/websocket`)
- Namespace imports maintain backward compatibility

### Type Discrimination

Multiple function overloads are used for ergonomic API:

```typescript
// All valid:
useList()
useList({ filters: { active: true } })
useList({ filters: { active: true } }, { onMount: false })
```

**Rationale:**
- More ergonomic than discriminated unions
- TypeScript handles overload resolution automatically

### Reactive Parameters

All parameters support `MaybeRefOrGetter<T>`:

```typescript
const filters = ref({ active: true })
useList({ filters }) // ✅ Reactive

useList({ filters: { active: true } }) // ✅ Static also works
```

**Rationale:**
- Enables dynamic filtering/pagination
- Backward compatible with static values

### CSRF Protection

CSRF tokens are automatically injected for mutation methods:

- **Enabled methods**: POST, PUT, PATCH, DELETE
- **Disabled methods**: GET, HEAD, OPTIONS
- **Workflow**: Backend sets cookie → Package reads cookie → Package injects header

**Rationale:**
- Required for session cookie authentication
- Automatic injection reduces developer burden

### Request Deduplication

Configurable globally and per-action:

- **Key**: URL + query string + payload + method
- **Behavior**: Identical simultaneous requests share the same promise
- **Benefit**: Prevents duplicate API calls

**Rationale:**
- Common pattern in modern data fetching libraries (SWR, TanStack Query)
- Reduces server load and improves performance

---

## 8. Roadmap

### v1.0 (Current) ✅ **COMPLETE**

**All features completed:**

**Core Features:**
- ✅ Complete CRUD operations (`useRetrieve`, `useList`, `useCreate`, `useUpdate`, `useDelete`)
- ✅ Reactive parameters (auto-refetch when filters/sort/page change)
- ✅ CSRF token auto-injection for mutations (POST/PUT/PATCH/DELETE)
- ✅ Request deduplication (configurable globally and per-action)
- ✅ Request and response interceptors (modify requests/responses, abort requests)
- ✅ Debug logging (configurable via `setupFzFetcher({ debug: true })`)

**Architecture & Quality:**
- ✅ TypeScript-first approach with complete type safety
- ✅ Subpath exports (`@fiscozen/data/rest`)
- ✅ Layer separation (Component → Entity → Actions → HTTP)
- ✅ Built on `@vueuse/core` for robust foundations
- ✅ Modular and extensible design
- ✅ Input validation for all public APIs
- ✅ Centralized constants (no magic strings/numbers)
- ✅ Consistent error handling patterns

**Documentation:**
- ✅ Complete API reference
- ✅ Usage examples and patterns
- ✅ JSDoc on all public methods
- ✅ Comprehensive README

**Package Status:**
- ✅ Production-ready
- ✅ All critical bugs fixed
- ✅ Type safety complete (no `any` types)
- ✅ Test suite organized by feature
- ✅ Build optimized (21.24 kB, gzip: 5.65 kB)

### v2.0 (Future Enhancements)

**Caching & Performance:**
- [ ] In-memory response caching (configurable globally and per-action)
- [ ] Cache invalidation after mutations
- [ ] Background refetching (stale-while-revalidate)
- [ ] Optimistic updates for mutations

**Error Handling & Resilience:**
- [ ] Retry logic with exponential backoff (configurable globally and per-action)
- [ ] Automatic retry for network errors (5xx) - not for 4xx
- [ ] Request timeouts (configurable globally and per-action)
  - Abort requests that exceed configured timeout duration
  - Support for infinite timeout (`null`) and per-action overrides
  - Proper cleanup and error handling
- [ ] Offline support with request queue

**Developer Experience:**
- [ ] Devtools integration for debugging
- [ ] Mock/test utilities (for unit/integration tests, exported from `@fiscozen/data/testing`)
  - Export strategy: Separate path `@fiscozen/data/testing` (tree-shakeable)
  - Use cases: Unit tests for composables, integration tests for components
  - Example: `mockFzFetch('/users', { data: [...] })` for testing
- [ ] Response pagination metadata parsing
- [ ] File upload support (`useUploadFile` composable)
  - Dedicated composable for file uploads with progress tracking
  - Proper `FormData` handling and `multipart/form-data` content type
  - Integration with entity composables (e.g., `uploadDocument` in `useUsers`)
  - Example: `const { execute: uploadFile, progress, isLoading } = useUploadFile('/documents')`

**Protocol Support:**
- [ ] GraphQL adapter alongside REST
- [ ] WebSockets integration for real-time updates

**Architecture:**
- [ ] Adapter pattern for swappable HTTP clients (Axios/Fetch)
  - Allow swapping underlying HTTP client without affecting higher layers
  - Plug-n-play mechanism for different request implementations
- [ ] Multi-backend configuration support
  - Support for multiple backend configurations with different conventions
  - Per-backend pagination, sorting, and filtering conventions

**Testing & Quality:**
- [ ] Enhanced test coverage (>90%)
- [ ] Edge cases handling (URL with hash, array empty values, etc.)
- [ ] Cookie parsing improvements (handle values containing `=`)

**File Upload Support:**
- [ ] `useUploadFile` composable for file uploads
  - Progress tracking (`progress` ref with upload percentage)
  - Proper `FormData` handling
  - Support for multiple files
  - Integration with entity composables
  - Example usage in entity composable:
    ```typescript
    export const useUsers = () => {
      const { useUploadFile } = useActions<User>('users')
      
      return {
        uploadDocument: useUploadFile('/documents'),
        // ... other actions
      }
    }
    ```

---

## Development History & Decisions

### Key Architectural Decisions

**Singleton Pattern:**
- Chosen for simplicity and ergonomic API
- Suitable for CSR-only applications (no SSR requirement)
- Future consideration: Provide/Inject pattern if multi-tenancy or SSR support is needed

**Export Structure:**
- Subpath imports (`@fiscozen/data/rest`) recommended for future extensibility
- Namespace imports (`import { rest } from '@fiscozen/data'`) maintained for backward compatibility
- Allows future extensions (`/graphql`, `/websocket`)

**Type Discrimination:**
- Multiple function overloads used instead of discriminated unions
- More ergonomic API while maintaining type safety
- TypeScript handles overload resolution automatically

**Reactive Parameters:**
- All parameters support `MaybeRefOrGetter<T>` for maximum flexibility
- Enables dynamic filtering/pagination while maintaining backward compatibility
- Auto-refetch when reactive dependencies change

**CSRF Protection:**
- Automatic injection for mutation methods (POST/PUT/PATCH/DELETE)
- Workflow: Backend sets cookie → Package reads cookie → Package injects header
- Reduces developer burden while maintaining security

**Request Deduplication:**
- Key includes: URL + query string + payload + method
- Identical simultaneous requests share the same promise
- Prevents duplicate API calls when components mount simultaneously
- Common pattern in modern data fetching libraries (SWR, TanStack Query)

### Backend Conventions Supported

This package is designed to work with REST APIs following these conventions:

- **Pagination**: `page` / `page_size` query parameters
- **Ordering**: `ordering=name,-created_at` (comma-separated fields, descending fields prefixed with '-')
- **Filtering**: Direct query parameters (e.g., `?by_city=rome&by_status=active`)
- **API Versioning**: URL-based (e.g., `/v1/users`, `/v2/users`)
- **Nested Relations**: Nested routes (e.g., `GET /users/1/invoices`)
- **Authentication**: Session cookies (CSRF protection supported)
- **Error Format**: No standard format enforced - errors exposed via `error` ref for consumer to handle

### Package Statistics

- **Bundle Size**: 21.24 kB (gzip: 5.65 kB)
- **Lines of Code**: ~1800 LOC
- **Test Coverage**: Organized by feature (setup, deduplication, interceptors)
- **Type Safety**: Complete (no `any` types in public API)
- **Linting**: ESLint with `@fiscozen/eslint-config`; run `pnpm lint` (0 errors)
- **Build**: Optimized and production-ready

---

## 9. Appendix

### Glossary

- **Entity composable**: Domain-specific composable (e.g., `useUsers`)
- **useActions**: Generic CRUD layer providing standardized operations
- **useFzFetch**: HTTP wrapper with reactive URL support
- **MaybeRefOrGetter**: Vue 3 type for reactive or static values
- **Reactive parameters**: Values that automatically trigger re-fetches when changed

### Key Benefits

- **🔄 Reactive by design** - Parameters auto-trigger fetches
- **📝 TypeScript-first** - Complete type safety across all layers  
- **🧩 Modular architecture** - Clear separation of concerns
- **⚡ Performance-focused** - Built on proven `@vueuse/core` foundation
- **🎯 Developer experience** - Consistent, predictable API patterns
- **🔒 Security** - CSRF protection built-in
- **🚀 Performance** - Request deduplication prevents duplicate calls

### License

MIT

---

## Contributing

This package is part of the Fiscozen Design System. For contributions, please follow the design system contribution guidelines.
