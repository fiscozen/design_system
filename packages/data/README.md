# @fiscozen/data

## Data Layer – Reactive Composable Architecture

> **🚀 Production Ready (v1.0)**
>
> This package implements a **structured data layer** for Vue 3 applications, built on top of `@vueuse/core`, designed to:
>
> * keep components clean, without embedding data-fetching logic;
> * provide reactive state management with automatic URL updates;
> * centralise and standardise state and error handling;
> * ensure strong typing and composable reusability.

**Current Status:** Complete CRUD operations with reactive parameters, CSRF protection, request deduplication, configurable timeouts, request/response interceptors, and debug logging.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Current Status](#2-current-status)
3. [Objective](#3-objective)
4. [Architecture](#4-architecture)
5. [Developer Usage](#5-developer-usage)
6. [Configuration](#6-configuration)
7. [Usage Patterns](#7-usage-patterns)
8. [API Reference](#8-api-reference)
9. [Backend Conventions](#9-backend-conventions)
10. [Architectural Decisions](#10-architectural-decisions)
11. [Roadmap](#11-roadmap)
12. [Appendix](#12-appendix)

---

## 1. Quick Start

### Installation

```bash
npm install @fiscozen/data
```

### Step 1: Setup (Once at App Initialization)

```typescript
// app/main.ts or app setup file
import { setupFzFetcher } from '@fiscozen/data/rest'

setupFzFetcher({
  baseUrl: 'https://api.example.com/v1',
  csrf: {
    enabled: true,
    cookieName: 'csrf_token',
    headerName: 'X-CSRF-Token'
  },
  deduplication: true, // Enable request deduplication globally
  debug: false // Set to true for development logging
})
```

### Step 2: Create Entity Composable (Once per Entity)

```typescript
// src/composables/useUsers.ts
import { useActions } from '@fiscozen/data/rest'

interface User {
  id: number
  name: string
  email: string
}

export const useUsers = () => {
  const { useRetrieve, useList, useCreate, useUpdate, useDelete } = 
    useActions<User>('users')
  
  return {
    useRetrieveUserById: useRetrieve,
    useListUsers: useList,
    useCreateUser: useCreate,
    useUpdateUser: useUpdate,
    useDeleteUser: useDelete
  }
}
```

### Step 3: Use in Components (Reactive & Auto-Fetching)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useUsers } from '@/composables/useUsers'

const { useListUsers, useCreateUser } = useUsers()

// ✅ Auto-fetch on mount
// ✅ Auto-refetch when filters change (if filters is reactive)
const filters = ref({ active: true })
const { data: users, error, isLoading } = useListUsers({
  filters // Reactive - changes trigger automatic refetch
})

// ✅ Manual mutation (always manual, no auto-refetch)
const { execute: createUser } = useCreateUser()

const handleCreate = async () => {
  await createUser({ name: 'John', email: 'john@example.com' })
  
  // Optionally refetch list after creation
  // (automatic refetch happens if filters is reactive)
  filters.value = { ...filters.value } // Trigger refetch
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

### Key Concepts

**Reactive Parameters:**
- `useRetrieve`: `pk` parameter is reactive → changing it triggers refetch
- `useList`: `filters`, `sort`, `page`, `pageSize` are reactive → changing any triggers refetch
- Mutation actions (`useCreate`, `useUpdate`, `useDelete`): No reactive parameters → always manual

**Automatic Refetch:**
- Enabled by default (`autoUpdate: true`)
- Triggered when reactive parameters change
- Can be disabled with `autoUpdate: false`

---

## 2. Current Status

### ✅ Completed (v1.0)

**Core Features:**
- ✅ Complete CRUD operations (`useRetrieve`, `useList`, `useCreate`, `useUpdate`, `useDelete`)
- ✅ Reactive parameters (auto-refetch when filters/sort/page change)
- ✅ CSRF token auto-injection for mutations (POST/PUT/PATCH/DELETE)
- ✅ Request deduplication (configurable globally and per-action)
- ✅ Request and response interceptors (modify requests/responses, abort requests)
- ✅ Debug logging (configurable via `setupFzFetcher({ debug: true })`)
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

## 3. Objective

The aim is to design an architecture in which each entity (for instance, `User`) has its own **dedicated composable** (`useUsers`) encapsulating all data-handling logic, built on top of shared lower-level layers.

**Key benefits:**
- Cleaner components, free from embedded API code
- Consistent structure across all entities
- Centralised handling of state, errors, and loading indicators
- Strong TypeScript typing
- Easier refactoring and testing

**Target Usage:**
- Primarily for external consumer applications (not just internal design system usage)
- Vue 3 only (no framework-agnostic requirement)
- Client-side rendering only (no SSR support required)

---

## 4. Architecture

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

### Package Exports

The package provides building blocks, not entity-specific composables:

```typescript
// Package exports
export { 
  useActions,      // Generic CRUD factory
  setupFzFetcher,  // Setup configuration
  useFzFetch       // Low-level HTTP wrapper
}

export type * from './types'
```

**Developers create their own entity composables** using these building blocks.

---

## 5. Developer Usage

### Usage Pattern Overview

The package follows a **layered architecture pattern**:

1. **Setup** (once at app initialization)
   ```typescript
   setupFzFetcher({ baseUrl: '...', csrf: {...} })
   ```

2. **Create Entity Composable** (once per entity)
   ```typescript
   export const useUsers = () => {
     const { useRetrieve, useList, ... } = useActions<User>('users')
     return { useRetrieveUserById: useRetrieve, ... }
   }
   ```

3. **Use in Components** (reactive, auto-fetching)
   ```typescript
   const { data, error, isLoading } = useRetrieveUserById(userId)
   // Automatically refetches when userId changes
   ```

### Creating Entity Composables

Create domain-specific composables for each entity in your application:

```typescript
// src/composables/useUsers.ts
import { useActions } from '@fiscozen/data/rest'

interface User {
  id: number
  name: string
  email: string
  active: boolean
}

export const useUsers = () => {
  const { useRetrieve, useList, useCreate, useUpdate, useDelete } = 
    useActions<User>('users')
  
  return {
    // Query actions (GET)
    useRetrieveUserById: useRetrieve,
    useListUsers: useList,
    
    // Mutation actions (POST/PUT/PATCH/DELETE)
    useCreateUser: useCreate,
    useUpdateUser: useUpdate,
    useDeleteUser: useDelete
  }
}
```

**Why Entity Composables?**
- Encapsulate entity-specific logic in one place
- Provide clean, semantic API (`useRetrieveUserById` vs `useRetrieve`)
- Easy to extend with custom logic (validation, transformations)
- Consistent structure across all entities

### Using in Components

Entity composables provide reactive, type-safe data operations:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useUsers } from '@/composables/useUsers'

const { useRetrieveUserById, useListUsers, useCreateUser } = useUsers()

// ✅ Reactive retrieve - auto-fetches when ID changes
const userId = ref(1)
const { data: user, error, isLoading } = useRetrieveUserById(userId)

// ✅ List with filters and pagination
const { data: users } = useListUsers({
  filters: { active: true },
  sort: { name: 'asc' },
  page: 1,
  pageSize: 10
})

// ✅ Manual mutation
const { execute: createUser } = useCreateUser()

const handleCreate = async () => {
  await createUser({ name: 'John', email: 'john@example.com' })
}

// Change ID to trigger new fetch
const loadUser = (id: number) => {
  userId.value = id // Automatically fetches new user
}
</script>

<template>
  <div>
    <!-- ✅ Auto-unwrapping in templates -->
    <div v-if="isLoading">Loading user...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
    </div>
    
    <!-- User list -->
    <ul v-if="users">
      <li v-for="u in users" :key="u.id" @click="loadUser(u.id)">
        {{ u.name }}
      </li>
    </ul>
  </div>
</template>
```

### Available Actions

All actions return consistent interface:

```typescript
interface ActionReturn<T> {
  data: ShallowRef<T | null>        // Response data
  error: ShallowRef<Error | null>   // Error if any
  isLoading: Readonly<ShallowRef<boolean>>  // Loading state
  execute?: () => Promise<void>     // Manual execution (for queries)
}
```

**Query Actions (GET):**
- `useRetrieve(pk, options?)` - Get single entity by primary key
- `useList(params?, options?)` - List entities with filters, sorting, pagination

**Mutation Actions:**
- `useCreate(options?)` - Create new entity (POST)
- `useUpdate(options?)` - Update existing entity (PUT/PATCH)
- `useDelete(options?)` - Delete entity (DELETE)

---

## 6. Configuration

### Setup Options

```typescript
interface SetupFzFetcherOptions {
  /**
   * Base URL for all API requests (required)
   */
  baseUrl: MaybeRefOrGetter<string>

  /**
   * CSRF protection configuration
   */
  csrf?: {
    enabled: boolean              // Enable CSRF protection (default: false)
    cookieName?: string          // CSRF cookie name (default: 'csrf_token')
    headerName?: string          // CSRF header name (default: 'X-CSRF-Token')
  }

  /**
   * Enable request deduplication globally
   * When enabled, identical requests made simultaneously share the same result
   * (default: false)
   */
  deduplication?: boolean

  /**
   * Enable debug logging (console.debug)
   * (default: false)
   */
  debug?: boolean

  /**
   * Global request timeout in milliseconds
   * If a request takes longer than this value, it will be aborted with a timeout error.
   * Set to `null` for infinite timeout (no timeout).
   * Can be overridden per-action via QueryActionOptions.timeout or MutationActionOptions.timeout
   * (default: null - infinite timeout, no timeout applied)
   */
  timeout?: number | null

  /**
   * Request interceptor function
   * Called before each request is sent. Can modify the request or abort it.
   * (default: undefined - no interceptor)
   */
  requestInterceptor?: RequestInterceptor

  /**
   * Response interceptor function
   * Called after each response is received. Can modify the response or handle errors.
   * (default: undefined - no interceptor)
   */
  responseInterceptor?: ResponseInterceptor

  /**
   * Default options for useFzFetch
   */
  options?: UseFzFetchOptions

  /**
   * Options for fetch requests
   */
  fetchOptions?: RequestInit
}
```

### Example Configuration

```typescript
import { setupFzFetcher } from '@fiscozen/data/rest'
import type { RequestInterceptor, ResponseInterceptor } from '@fiscozen/data/rest'

// Request interceptor: add custom headers, modify request, or abort
const requestInterceptor: RequestInterceptor = async (url, requestInit) => {
  // Add custom header
  return {
    ...requestInit,
    headers: {
      ...requestInit.headers,
      'X-Custom-Header': 'value',
      'Authorization': `Bearer ${getToken()}`
    }
  }
  
  // Or abort request conditionally
  // if (shouldAbort(url)) {
  //   return null
  // }
}

// Response interceptor: transform response, handle errors globally
const responseInterceptor: ResponseInterceptor = async (response, url, requestInit) => {
  // Handle 401 errors globally (e.g., refresh token)
  if (response.status === 401) {
    await refreshToken()
    // Retry original request or throw error
    throw new Error('Unauthorized - token refresh required')
  }
  
  // Transform response body
  // const data = await response.json()
  // return new Response(JSON.stringify({ ...data, transformed: true }), response)
  
  return response
}

setupFzFetcher({
  baseUrl: 'https://api.example.com/v1',
  
  // CSRF protection for session cookies
  csrf: {
    enabled: true,
    cookieName: 'csrf_token',
    headerName: 'X-CSRF-Token'
  },
  
  // Request deduplication
  deduplication: true,
  
  // Global timeout (null = infinite timeout by default)
  timeout: 30000, // 30 seconds, or null for infinite timeout
  
  // Request interceptor
  requestInterceptor,
  
  // Response interceptor
  responseInterceptor,
  
  // Debug logging (development only)
  debug: process.env.NODE_ENV === 'development'
})
```

---

## 7. Usage Patterns

### Reactive Parameters & Automatic Refetch

The package automatically refetches data when **reactive parameters** change. This works by wrapping parameters in `computed()` and watching for changes.

#### Which Parameters Are Reactive?

**Query Actions (GET):**

| Action | Reactive Parameters | Refetch Trigger |
|--------|-------------------|-----------------|
| `useRetrieve(pk, options?)` | `pk` (primary key) | When `pk` changes |
| `useList(params?, options?)` | All `ListActionParams`: `filters`, `sort`, `page`, `pageSize` | When any param changes |

**Mutation Actions (POST/PUT/PATCH/DELETE):**
- ❌ **No reactive parameters** - Mutations are always manual via `execute()`
- Mutations don't auto-refetch because they modify data, not fetch it

#### How Automatic Refetch Works

**useRetrieve:**
```typescript
const userId = ref(1)
const { data, error, isLoading } = useRetrieveUserById(userId)

// Changing userId automatically triggers new fetch
userId.value = 2 // ✅ Auto-fetches new data

// Works with computed values too
const computedId = computed(() => route.params.id)
const { data } = useRetrieveUserById(computedId) // ✅ Auto-refetches when route changes
```

**useList:**
```typescript
const filters = ref({ active: true })
const page = ref(1)
const pageSize = ref(20)

const { data: users } = useListUsers({
  filters,    // ✅ Reactive - changes trigger refetch
  sort: { name: 'asc' },  // ⚠️ Static - won't trigger refetch
  page,       // ✅ Reactive - changes trigger refetch
  pageSize    // ✅ Reactive - changes trigger refetch
})

// Changing any reactive parameter triggers refetch
filters.value = { active: false } // ✅ Auto-refetch
page.value = 2 // ✅ Auto-refetch
pageSize.value = 50 // ✅ Auto-refetch

// To make sort reactive, use a ref:
const sort = ref({ name: 'asc' })
useListUsers({ sort }) // ✅ Now reactive
```

#### Controlling Automatic Refetch

**Disable auto-refetch globally:**
```typescript
const { data, execute } = useListUsers(
  { filters: { active: true } },
  { autoUpdate: false } // Disable automatic refetch
)

// Manually trigger fetch
await execute()
```

**Disable initial fetch:**
```typescript
const { data, execute } = useListUsers(
  { filters: { active: true } },
  { onMount: false } // Don't fetch on mount
)

// Trigger fetch manually when needed
await execute()
```

**Reactive parameters still work:**
Even with `autoUpdate: false`, reactive parameters are still tracked. You can manually call `execute()` to refetch with updated parameters.

### Complete Example: Reactive List with Filters

Here's a complete example showing all reactive parameters working together:

```typescript
import { ref, computed } from 'vue'
import { useUsers } from '@/composables/useUsers'

const { useListUsers } = useUsers()

// All reactive parameters
const searchTerm = ref('')
const statusFilter = ref<'active' | 'inactive' | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Computed filters object (reactive)
const filters = computed(() => {
  const result: Record<string, string | boolean> = {}
  if (searchTerm.value) {
    result.search = searchTerm.value
  }
  if (statusFilter.value) {
    result.status = statusFilter.value
  }
  return result
})

// Computed sort (reactive)
const sort = computed(() => ({ name: 'asc' }))

// List query - automatically refetches when any reactive param changes
const { data: users, error, isLoading } = useListUsers({
  filters,        // ✅ Reactive - refetches when searchTerm or statusFilter changes
  sort,           // ✅ Reactive - refetches when sort changes
  page: currentPage,      // ✅ Reactive - refetches when page changes
  pageSize: itemsPerPage  // ✅ Reactive - refetches when pageSize changes
})

// User interactions trigger automatic refetch
const handleSearch = (term: string) => {
  searchTerm.value = term // ✅ Auto-refetches list
}

const handleStatusChange = (status: 'active' | 'inactive' | null) => {
  statusFilter.value = status // ✅ Auto-refetches list
  currentPage.value = 1 // ✅ Auto-refetches and resets to page 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page // ✅ Auto-refetches list
}
```

### Manual Execution

Disable auto-fetch and trigger manually:

```typescript
const { data, execute, isLoading } = useListUsers({ 
  onMount: false 
})

// Trigger fetch manually
await execute()
```

### Error Handling

Handle errors via the `error` ref:

```typescript
const { data, error, isLoading } = useRetrieveUserById(userId)

watch(error, (err) => {
  if (err) {
    console.error('Failed to fetch user:', err)
    // Handle error in UI (show toast, redirect, etc.)
  }
})
```

### Request Deduplication

Prevent duplicate API calls when components mount simultaneously:

```typescript
// Enable globally in setup
setupFzFetcher({
  baseUrl: 'https://api.example.com',
  deduplication: true // Enable for all requests
})

// Or enable per-action
const { data } = useListUsers(
  { filters: { role: 'admin' } },
  { deduplication: true } // Enable only for this action
)

// When multiple identical requests are made simultaneously,
// only the first one executes. Others wait for and share the same result.
```

### Mutation Operations

**Create:**
```typescript
const { execute: createUser, error, isLoading } = useCreateUser()

await createUser({ 
  name: 'John', 
  email: 'john@example.com' 
})
```

**Update:**
```typescript
const { execute: updateUser } = useUpdateUser()

// Partial update (PATCH) - default
await updateUser(1, { name: 'John Updated' })

// Full replacement (PUT)
await updateUser(1, { name: 'John', email: 'john@example.com' }, { 
  partialUpdate: false 
})
```

**Delete:**
```typescript
const { execute: deleteUser } = useDeleteUser()

await deleteUser(1)
```

### Nested Relations

For nested routes like `/users/1/invoices`, create helper composables:

```typescript
// src/composables/useUserInvoices.ts
import { useActions } from '@fiscozen/data/rest'

export const useUserInvoices = (userId: MaybeRefOrGetter<number>) => {
  const basePath = computed(() => `users/${toValue(userId)}/invoices`)
  const { useList, useRetrieve } = useActions<Invoice>(basePath)
  
  return {
    useListUserInvoices: useList,
    useRetrieveUserInvoice: useRetrieve
  }
}
```

### Configurable Timeouts

Set request timeouts globally or per-action to handle slow networks and prevent hanging requests:

```typescript
// Global timeout (null = infinite timeout by default)
setupFzFetcher({
  baseUrl: 'https://api.example.com',
  timeout: 60000 // 60 seconds for all requests
  // timeout: null // Infinite timeout (no timeout applied)
})

// Per-action timeout override
const { data } = useListUsers(
  { filters: { role: 'admin' } },
  { timeout: 10000 } // 10 seconds for this specific request
)

// Infinite timeout for specific action
const { data } = useListUsers(
  { filters: { role: 'admin' } },
  { timeout: null } // No timeout for this request
)

// Mutation actions also support timeout
const { execute: createUser } = useCreateUser({ 
  timeout: 5000 // 5 seconds for create operations
})

// Timeout resolution: per-action → global → default (null = infinite)
```

**Timeout Behavior:**
- Requests exceeding the timeout are automatically aborted
- A `TimeoutError` is thrown with a clear error message
- The error is available in the `error` ref for handling
- Timeout cleanup is handled automatically

**Error Handling:**
```typescript
const { data, error, isLoading } = useListUsers({ 
  filters: { role: 'admin' } 
})

// Check for timeout errors
if (error.value instanceof TimeoutError) {
  console.error('Request timed out:', error.value.message)
  // Handle timeout (e.g., show user-friendly message, retry)
}
```

### Request & Response Interceptors

Interceptors allow you to modify requests before they're sent and responses after they're received:

**Request Interceptor:**
- Modify headers, body, method, or any RequestInit property
- Abort requests by returning `null`
- Add authentication tokens dynamically
- Log requests for debugging

**Response Interceptor:**
- Transform response data
- Handle errors globally (e.g., 401 → refresh token)
- Add response metadata
- Normalize response format

```typescript
import type { RequestInterceptor, ResponseInterceptor } from '@fiscozen/data/rest'

// Request interceptor example
const requestInterceptor: RequestInterceptor = async (url, requestInit) => {
  // Add authentication header
  const token = await getAuthToken()
  return {
    ...requestInit,
    headers: {
      ...requestInit.headers,
      'Authorization': `Bearer ${token}`
    }
  }
}

// Response interceptor example
const responseInterceptor: ResponseInterceptor = async (response, url, requestInit) => {
  // Handle 401 globally
  if (response.status === 401) {
    await refreshToken()
    throw new Error('Unauthorized')
  }
  
  // Transform response
  if (response.ok) {
    const data = await response.json()
    return new Response(
      JSON.stringify({ ...data, timestamp: Date.now() }),
      response
    )
  }
  
  return response
}

setupFzFetcher({
  baseUrl: 'https://api.example.com',
  requestInterceptor,
  responseInterceptor
})
```

**Interceptor Behavior:**
- Request interceptor is applied when `execute()` is called
- If request interceptor modifies `requestInit`, a new fetch call is made with modified config
- If request interceptor returns `null`, the request is aborted
- Response interceptor is applied after the response is received
- Response interceptor can modify the response or throw errors
- Both interceptors support async operations

### Batch Operations

Handle multiple operations:

```typescript
const { execute: deleteUser } = useDeleteUser()

// Delete multiple users
const deleteMultiple = async (userIds: number[]) => {
  const results = await Promise.allSettled(
    userIds.map(id => deleteUser(id))
  )
  
  // Handle partial failures
  const failures = results.filter(r => r.status === 'rejected')
  if (failures.length > 0) {
    console.error('Some deletions failed:', failures)
  }
}
```

---

## 8. API Reference

### Setup

```typescript
import { setupFzFetcher } from '@fiscozen/data/rest'

setupFzFetcher({
  baseUrl: 'https://api.example.com',
  csrf: {
    enabled: true,
    cookieName: 'csrf_token',
    headerName: 'X-CSRF-Token'
  },
  deduplication: true,
  debug: false
})
```

### Entity Composables

```typescript
export const useUsers = () => {
  const { useRetrieve, useList, useCreate, useUpdate, useDelete } = 
    useActions<User>('users')
  
  return {
    useRetrieveUserById: useRetrieve,
    useListUsers: useList,
    useCreateUser: useCreate,
    useUpdateUser: useUpdate,
    useDeleteUser: useDelete
  }
}
```

### Query Actions (GET)

#### QueryActionOptions

```typescript
interface QueryActionOptions<T> {
  /**
   * Auto-fetch on mount
   * @default true
   */
  onMount?: boolean

  /**
   * Auto-refetch when reactive dependencies change
   * @default false
   */
  autoUpdate?: MaybeRefOrGetter<boolean>

  /**
   * Initial data before first fetch completes
   * @default null
   */
  initialData?: T | null

  /**
   * Enable request deduplication for this action
   * @default undefined (uses global setting)
   */
  deduplication?: boolean

  /**
   * Request timeout in milliseconds for this specific action
   * Set to `null` for infinite timeout (no timeout).
   * Overrides global timeout setting from setupFzFetcher
   * @default undefined (uses global timeout setting, or null for infinite timeout if not set)
   */
  timeout?: number | null
}
```

#### ListActionParams

```typescript
interface ListActionParams {
  /**
   * Filter parameters (e.g., { by_city: 'rome', by_status: 'active' })
   */
  filters?: MaybeRefOrGetter<Record<string, string | number | boolean>>

  /**
   * Sort parameters (e.g., { name: 'asc', created_at: 'desc' })
   */
  sort?: MaybeRefOrGetter<Record<string, 'asc' | 'desc'>>

  /**
   * Page number for pagination
   */
  page?: MaybeRefOrGetter<number>

  /**
   * Page size for pagination
   */
  pageSize?: MaybeRefOrGetter<number>
}
```

### Mutation Actions (POST/PUT/PATCH/DELETE)

#### MutationActionOptions

```typescript
interface MutationActionOptions {
  /**
   * Request timeout in milliseconds for this specific action
   * Set to `null` for infinite timeout (no timeout).
   * Overrides global timeout setting from setupFzFetcher
   * @default undefined (uses global timeout setting, or null for infinite timeout if not set)
   */
  timeout?: number | null

  // Reserved for future: optimistic?, retry?, debounce?, etc.
}
```

#### UpdateOptions

```typescript
interface UpdateOptions {
  /**
   * Whether to perform partial update (PATCH) or full replacement (PUT)
   * @default true (PATCH)
   */
  partialUpdate?: boolean
}
```

### Action Return Types

All actions return consistent interface:

```typescript
interface BaseActionReturn<T> {
  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<Error | null>

  /**
   * The response data from server
   */
  data: ShallowRef<T | null>

  /**
   * Indicates if the action is currently being executed
   */
  isLoading: Readonly<ShallowRef<boolean>>
}

interface QueryActionReturn<T> extends BaseActionReturn<T> {
  /**
   * Manually execute the query action
   */
  execute: () => Promise<void>
}
```

---

## 9. Backend Conventions

This package is designed to work with REST APIs following these conventions:

### Pagination

- **Format**: `page` / `per_page` query parameters
- **Example**: `?page=1&per_page=20`

### Sorting

- **Format**: `sort=name:asc,created_at:desc` (comma-separated key:direction pairs)
- **Example**: `?sort=name:asc,created_at:desc`

### Filtering

- **Format**: Direct query parameters
- **Example**: `?by_city=rome&by_status=active`

### API Versioning

- **Format**: URL-based versioning
- **Example**: `/v1/users`, `/v2/users`

### Nested Relations

- **Format**: Nested routes
- **Example**: `GET /users/1/invoices`, `GET /users/1/invoices/5`

### Authentication

- **Format**: Session cookies (CSRF protection supported)
- **Token Refresh**: Handled by application (not by data layer)

### Error Format

- No standard format enforced - errors exposed via `error` ref for consumer to handle

---

## 10. Architectural Decisions

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

## 11. Roadmap

### v1.0 (Current) ✅ **COMPLETE**

**All features completed:**

**Core Features:**
- ✅ Complete CRUD operations (`useRetrieve`, `useList`, `useCreate`, `useUpdate`, `useDelete`)
- ✅ Reactive parameters (auto-refetch when filters/sort/page change)
- ✅ CSRF token auto-injection for mutations (POST/PUT/PATCH/DELETE)
- ✅ Request deduplication (configurable globally and per-action)
- ✅ Configurable timeouts (global and per-action, with `null` for infinite timeout)
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
- [ ] Automatic retry for network errors (timeout, 5xx) - not for 4xx
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

- **Pagination**: `page` / `per_page` query parameters
- **Sorting**: `sort=name:asc,created_at:desc` (comma-separated key:direction pairs)
- **Filtering**: Direct query parameters (e.g., `?by_city=rome&by_status=active`)
- **API Versioning**: URL-based (e.g., `/v1/users`, `/v2/users`)
- **Nested Relations**: Nested routes (e.g., `GET /users/1/invoices`)
- **Authentication**: Session cookies (CSRF protection supported)
- **Error Format**: No standard format enforced - errors exposed via `error` ref for consumer to handle

### Package Statistics

- **Bundle Size**: 21.24 kB (gzip: 5.65 kB)
- **Lines of Code**: ~1800 LOC
- **Test Coverage**: Organized by feature (setup, deduplication, timeout, interceptors)
- **Type Safety**: Complete (no `any` types in public API)
- **Linting**: 0 errors
- **Build**: Optimized and production-ready

---

## 12. Appendix

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
