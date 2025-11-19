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

**Current Status:** Complete CRUD operations with reactive parameters, CSRF protection, request deduplication, request/response interceptors, and debug logging.

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
9. [TypeScript Best Practices](#9-typescript-best-practices)
10. [Testing](#10-testing)
11. [Backend Conventions](#11-backend-conventions)
12. [Architectural Decisions](#12-architectural-decisions)
13. [Roadmap](#13-roadmap)
14. [Appendix](#14-appendix)

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
// ✅ Returns reactive objects (filters, pagination, sort) for direct modification
const { data: users, error, isLoading, filters, pagination, sort } = useListUsers({
  filters: { active: true },           // Initial filters (static)
  pagination: { page: 1, pageSize: 20 }, // Initial pagination (static)
  sort: [{ name: 'asc' }]              // Initial sort (static)
})

// ✅ Modify reactive objects directly - triggers auto-refetch (if autoUpdate: true)
filters.active = false        // ✅ Auto-refetches
pagination.page = 2          // ✅ Auto-refetches
sort.push({ created_at: 'desc' }) // ✅ Auto-refetches

// ✅ Manual mutation (always manual, no auto-refetch)
const { execute: createUser } = useCreateUser()

const handleCreate = async () => {
  await createUser({ name: 'John', email: 'john@example.com' })
  
  // Optionally refetch list after creation
  // (automatic refetch happens if you modify filters/pagination/sort)
  pagination.page = 1 // Trigger refetch
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
- `useList`: Returns reactive objects (`filters`, `pagination`, `sort`) → modify directly to trigger refetch
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

// ✅ List with filters, pagination, and sort
const { data: users, filters, pagination, sort } = useListUsers({
  filters: { active: true },           // Initial filters
  pagination: { page: 1, pageSize: 10 }, // Initial pagination
  sort: [{ name: 'asc' }]              // Initial sort (array format)
})

// Modify reactive objects directly
filters.active = false        // ✅ Auto-refetches
pagination.page = 2          // ✅ Auto-refetches
sort.push({ created_at: 'desc' }) // ✅ Auto-refetches

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
  
  
  // Request interceptor
  requestInterceptor,
  
  // Response interceptor
  responseInterceptor,
  
  // Debug logging (development only)
  debug: process.env.NODE_ENV === 'development'
})
```

### Interceptors Examples

Interceptors allow you to modify requests before they're sent or handle responses globally. They're configured once in `setupFzFetcher` and apply to all requests.

**Request Interceptor - Add Custom Headers:**

```typescript
setupFzFetcher({
  baseUrl: 'https://api.example.com/v1',
  requestInterceptor: async (url, requestInit) => {
    const token = localStorage.getItem('auth_token')
    return {
      ...requestInit,
      headers: {
        ...requestInit.headers,
        'Authorization': `Bearer ${token}`
      }
    }
  }
})
```

**Request Interceptor - Abort Requests:**

```typescript
setupFzFetcher({
  baseUrl: 'https://api.example.com/v1',
  requestInterceptor: async (url, requestInit) => {
    // Abort if user is offline
    if (!navigator.onLine) {
      return null // Abort request
    }
    return requestInit
  }
})
```

**Response Interceptor - Handle 401 Errors:**

```typescript
setupFzFetcher({
  baseUrl: 'https://api.example.com/v1',
  responseInterceptor: async (response, url, requestInit) => {
    if (response.status === 401) {
      // Refresh token logic
      await refreshToken()
      // Retry original request
      return fetch(url, requestInit)
    }
    return response
  }
})
```

### Request Deduplication

Prevent duplicate identical requests. **Deduplication works globally across your entire application**. When multiple components make identical requests simultaneously, only the first one executes and others share the result.

**⚠️ Important:** Deduplication is **disabled by default**. You must explicitly enable it in `setupFzFetcher` or per-action.

**Global Behavior:**
- Single `DeduplicationManager` instance shared across all components
- Works between different components, different composables, and different parts of your app
- Only identical requests (same URL, query params, method, and body) are deduplicated
- Requests are automatically cleaned up after completion

**Example - Cross-Component Deduplication:**

```typescript
// ComponentA.vue
const { data: usersA } = useListUsers({ filters: { active: true } })
// Executes: GET /users?active=true

// ComponentB.vue (different component, same moment)
const { data: usersB } = useListUsers({ filters: { active: true } })
// ✅ Does NOT execute new request - shares result from ComponentA
// Both components receive the same data when the request completes
```

**Configuration:**

```typescript
// Global setting (disabled by default)
setupFzFetcher({
  baseUrl: 'https://api.example.com/v1',
  deduplication: true // ✅ Must be explicitly enabled
})

// Per-action override
const { data } = useListUsers(
  { filters: { enabled: true } },
  { deduplication: true } // Enable for this action (overrides global)
)
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
| `useList(params?, options?)` | Returns reactive objects: `filters`, `pagination`, `sort` | When any reactive object is modified directly |

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
// useList returns reactive objects that you can modify directly
const { data: users, filters, pagination, sort } = useListUsers({
  filters: { active: true },           // Initial values (static)
  pagination: { page: 1, pageSize: 20 }, // Initial values (static)
  sort: [{ name: 'asc' }]              // Initial values (static)
})

// Modify reactive objects directly - triggers auto-refetch
filters.active = false        // ✅ Auto-refetch
filters.name = 'John'         // ✅ Auto-refetch
pagination.page = 2          // ✅ Auto-refetch
pagination.pageSize = 50     // ✅ Auto-refetch
sort.push({ created_at: 'desc' }) // ✅ Auto-refetch
sort[0].name = 'desc'        // ✅ Auto-refetch (deep reactivity)

// Initial values are only used for bootstrap
// After initialization, modify the returned reactive objects directly
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

Here's a complete example showing how to use reactive objects returned by `useList`:

```typescript
import { ref } from 'vue'
import { useUsers } from '@/composables/useUsers'

const { useListUsers } = useUsers()

// useList returns reactive objects for direct modification
const { data: users, error, isLoading, filters, pagination, sort } = useListUsers({
  filters: { active: true },           // Initial filters
  pagination: { page: 1, pageSize: 20 }, // Initial pagination (defaults: page=1, pageSize=50 if not provided)
  sort: [{ name: 'asc' }]              // Initial sort
})

// Pagination defaults are applied when pagination is provided (even if empty)
const { pagination: defaultPagination } = useListUsers({ pagination: {} })
// → defaultPagination = { page: 1, pageSize: 50 }

// User interactions modify reactive objects directly - triggers auto-refetch
const handleSearch = (term: string) => {
  if (term) {
    filters.search = term // ✅ Auto-refetches list
  } else {
    delete filters.search // ✅ Auto-refetches list
  }
}

const handleStatusChange = (status: 'active' | 'inactive' | null) => {
  if (status) {
    filters.status = status // ✅ Auto-refetches list
  } else {
    delete filters.status // ✅ Auto-refetches list
  }
  pagination.page = 1 // ✅ Auto-refetches and resets to page 1
}

const handlePageChange = (page: number) => {
  pagination.page = page // ✅ Auto-refetches list
}

const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
  sort.length = 0 // Clear existing sort
  sort.push({ [field]: direction }) // ✅ Auto-refetches list
}
```

### Manual Execution

Disable auto-fetch and trigger manually:

```typescript
const { data, execute, isLoading, filters, pagination, sort } = useListUsers({
  filters: { active: true },
  pagination: { page: 1, pageSize: 20 },
  sort: [{ name: 'asc' }],
  onMount: false // Don't fetch on mount
})

// Modify reactive objects
filters.active = false
pagination.page = 2

// Trigger fetch manually (with updated reactive params)
await execute()
```

### Error Handling Patterns

The `@fiscozen/data` package provides flexible error handling through reactive `error` refs and optional exception throwing. Choose the pattern that best fits your application's needs.

#### Default Behavior: Reactive Error Handling

By default, errors are stored in the `error` ref and **do not throw exceptions**. This allows you to handle errors reactively in your components.

**Query Actions (useList, useRetrieve):**

```typescript
import { useUsers } from '@/composables/useUsers'

const { useListUsers } = useUsers()
const { data, error, isLoading } = useListUsers()

// Check error reactively in template
// <div v-if="error">{{ error.message }}</div>

// Or watch for errors
watch(error, (newError) => {
  if (newError) {
    console.error('Failed to load users:', newError.message)
  }
})
```

**Mutation Actions (useCreate, useUpdate, useDelete):**

```typescript
const { data, error, isLoading, execute } = useCreateUser()

const handleCreate = async () => {
  await execute({ name: 'John', email: 'john@example.com' })
  
  // Check error after execution
  if (error.value) {
    // Handle error (show toast, log, etc.)
    showToast({ type: 'error', message: error.value.message })
    return
  }
  
  // Success - error.value is null
  showToast({ type: 'success', message: 'User created!' })
}
```

#### Global Error Handler

Use Vue's `watch` to handle errors globally across your application:

```typescript
import { watch } from 'vue'
import { useUsers } from '@/composables/useUsers'

const { useListUsers } = useUsers()
const { error } = useListUsers()

watch(error, (newError) => {
  if (newError) {
    // Show toast notification
    showToast({ type: 'error', message: newError.message })
    
    // Log to error tracking
    Sentry.captureException(newError)
  }
})
```

#### Exception-Based Error Handling (throwOnError: true)

Enable exception throwing for traditional try/catch patterns:

**Per-Action Error Handling:**

```typescript
const { execute } = useCreateUser({ throwOnError: true })

const handleCreate = async () => {
  try {
    await execute({ name: 'John' })
    // Success
    showToast({ type: 'success', message: 'User created!' })
  } catch (err) {
    // Handle error
    if (err instanceof Error && err.message.includes('duplicate')) {
      // Handle duplicate error specifically
      showToast({ type: 'error', message: 'User already exists' })
    } else {
      // Handle other errors
      showToast({ type: 'error', message: err.message })
    }
  }
}
```

**Query Actions with throwOnError:**

```typescript
const { data, error, execute } = useListUsers(
  { filters: { enabled: true } },
  { throwOnError: true }
)

const loadUsers = async () => {
  try {
    await execute()
    // Success - data.value contains the result
  } catch (err) {
    // Error - err contains the error, error.value also contains it
    console.error('Failed to load users:', err)
  }
}
```

#### Error Handling Best Practices

**✅ Recommended: Use reactive error handling for UI feedback**

```typescript
// Template
<template>
  <div v-if="error" class="error-message">
    {{ error.message }}
  </div>
  <div v-if="isLoading">Loading...</div>
  <div v-else>{{ data }}</div>
</template>

<script setup>
const { data, error, isLoading } = useListUsers()
</script>
```

**✅ Use throwOnError for programmatic error handling**

```typescript
// When you need to handle errors in async functions
const processUsers = async () => {
  const { execute } = useListUsers({ throwOnError: true })
  
  try {
    await execute()
    // Continue with processing
  } catch (err) {
    // Handle error and stop processing
    return
  }
}
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
   * Whether to throw errors instead of storing them in the error ref
   * 
   * When `false` (default), errors are stored in `error` ref and can be checked reactively.
   * When `true`, errors are thrown as exceptions and can be caught with try/catch.
   * 
   * @default false
   */
  throwOnError?: boolean
}
```

#### ListActionParams

Initial parameters for `useList` (used only for bootstrap). The composable returns reactive objects that can be modified directly.

```typescript
interface PaginationParams {
  /**
   * Page number (1-indexed)
   */
  page?: number

  /**
   * Number of items per page
   */
  pageSize?: number
}

interface ListActionParams {
  /**
   * Initial filter parameters (e.g., { by_city: 'rome', by_status: 'active' })
   * 
   * Values can be `null` or `undefined` to explicitly exclude a filter from the query string.
   * After initialization, modify the returned `filters` reactive object directly.
   */
  filters?: MaybeRefOrGetter<Record<string, string | number | boolean | null | undefined>>

  /**
   * Initial sort parameters as array (e.g., [{ name: 'asc' }, { created_at: 'desc' }])
   * 
   * Normalized to query string format: `sort=name:asc,created_at:desc`
   * After initialization, modify the returned `sort` reactive array directly.
   */
  sort?: MaybeRefOrGetter<Array<Record<string, 'asc' | 'desc'>>>

  /**
   * Initial pagination parameters
   * 
   * If provided (even if empty), default values are applied:
   * - `page`: defaults to `1` if not specified
   * - `pageSize`: defaults to `50` if not specified
   * 
   * After initialization, modify the returned `pagination` reactive object directly.
   * 
   * @example
   * // Empty pagination → applies defaults
   * useList({ pagination: {} })
   * // → pagination = { page: 1, pageSize: 50 }
   * 
   * // Partial pagination → applies defaults for missing values
   * useList({ pagination: { page: 2 } })
   * // → pagination = { page: 2, pageSize: 50 }
   */
  pagination?: MaybeRefOrGetter<PaginationParams>
}
```

#### ListActionReturn

```typescript
interface ListActionReturn<T> {
  /**
   * The response data from server (array of entities)
   */
  data: ShallowRef<T[] | null>

  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<Error | null>

  /**
   * Indicates if the action is currently being executed
   */
  isLoading: Readonly<ShallowRef<boolean>>

  /**
   * Manually trigger the fetch request
   */
  execute: () => Promise<void>

  /**
   * Reactive filters object - modify directly to trigger refetch
   * 
   * @example
   * filters.name = 'Paolo' // ✅ Auto-refetches (if autoUpdate: true)
   */
  filters: Reactive<Record<string, string | number | boolean | null | undefined>>

  /**
   * Reactive sort array - modify directly to trigger refetch
   * 
   * @example
   * sort.push({ created_at: 'desc' }) // ✅ Auto-refetches (if autoUpdate: true)
   */
  sort: Reactive<Array<Record<string, "asc" | "desc">>>

  /**
   * Reactive pagination object - modify directly to trigger refetch
   * 
   * @example
   * pagination.page = 2 // ✅ Auto-refetches (if autoUpdate: true)
   */
  pagination: Reactive<PaginationParams>
}
```

### Mutation Actions (POST/PUT/PATCH/DELETE)

#### MutationActionOptions

```typescript
interface MutationActionOptions {
  /**
   * Whether to throw errors instead of storing them in the error ref
   * 
   * When `false` (default), errors are stored in `error` ref and can be checked reactively.
   * When `true`, errors are thrown as exceptions and can be caught with try/catch.
   * 
   * @default false
   */
  throwOnError?: boolean

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

## 9. TypeScript Best Practices

**Define Entity Types:**

```typescript
// src/types/user.ts
export interface User {
  id: number
  name: string
  email: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}
```

**Use in Composable:**

```typescript
import { useActions } from '@fiscozen/data/rest'
import type { User } from '@/types/user'

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

**Type Safety in Components:**

```vue
<script setup lang="ts">
import { useUsers } from '@/composables/useUsers'
import type { User } from '@/types/user'

const { useListUsers } = useUsers()
const { data: users } = useListUsers()

// users is typed as ShallowRef<User[] | null>
users.value?.forEach((user: User) => {
  console.log(user.name) // TypeScript knows user.name exists
})
</script>
```

---

## 10. Testing

**Unit Test Entity Composable:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setupFzFetcher, resetFzFetcher } from '@fiscozen/data/rest'
import { useUsers } from './useUsers'

describe('useUsers', () => {
  beforeEach(() => {
    resetFzFetcher()
    setupFzFetcher({
      baseUrl: 'https://api.test.com/v1',
      csrf: { enabled: false }
    })
  })

  it('should list users', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify([{ id: 1, name: 'John' }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    ) as any

    const { useListUsers } = useUsers()
    const { data, execute } = useListUsers({ onMount: false })
    
    await execute()
    
    expect(data.value).toEqual([{ id: 1, name: 'John' }])
  })
})
```

---

## 11. Backend Conventions

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

## 12. Development Guide

This section provides detailed information for developers working on the package internals, including architecture, code structure, and how to make fixes or add features.

### 12.1 Package Structure

```
packages/data/
├── src/
│   ├── rest/
│   │   ├── actions/          # CRUD operations layer
│   │   │   ├── create/       # Create action (POST)
│   │   │   ├── delete/       # Delete action (DELETE)
│   │   │   ├── list/         # List action (GET with filters/sort/pagination)
│   │   │   ├── retrieve/     # Retrieve action (GET by ID)
│   │   │   ├── update/       # Update action (PUT/PATCH)
│   │   │   ├── shared/       # Shared utilities for actions
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
│       ├── csrf.spec.ts
│       ├── deduplication.spec.ts
│       ├── interceptors.spec.ts
│       ├── integration.spec.ts
│       ├── list.spec.ts
│       ├── setup.spec.ts
│       └── url.spec.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 12.2 Architecture Overview

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

### 12.3 Core Components Explained

#### 12.3.1 HTTP Layer (`src/rest/http/`)

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

#### 12.3.2 Features (`features/`)

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

#### 12.3.3 Managers (`managers/`)

**CSRF Manager (`managers/csrf/index.ts`)**
- Reads CSRF token from cookie (handles values with `=`)
- Injects token into headers for mutation methods (POST/PUT/PATCH/DELETE)
- Uses `CsrfManager` class with `injectToken()` method

**Deduplication Manager (`managers/deduplication/index.ts`)**
- Generates deduplication keys
- Normalizes URLs (removes trailing slashes, sorts query params)
- Normalizes bodies (sorts JSON keys, creates identifier for non-JSON)
- Tracks pending requests and watches for completion

#### 12.3.4 Setup & State (`setup/`)

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

#### 12.3.5 Utils (`utils/`)

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

#### 12.3.6 Actions Layer (`actions/`)

**Factory Pattern: `useActions<T>(basePath)`**
- Returns object with 5 action creators:
  - `useRetrieve`: Get single entity by ID
  - `useList`: List entities with filters/sort/pagination
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
- `normalize.ts`: Normalizes action options
- `error-handling.ts`: Centralized error handling

### 12.4 How to Fix a Bug

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
// src/__tests__/csrf.spec.ts
it('should inject CSRF token for PATCH requests', () => {
  document.cookie = 'csrf_token=test-token'
  
  setupFzFetcher({
    baseUrl: 'https://api.example.com',
    csrf: { enabled: true, cookieName: 'csrf_token' }
  })
  
  const { execute } = useFzFetch('/test', { method: 'PATCH' })
  
  // Mock fetch to verify headers
  let interceptedHeaders: HeadersInit | undefined
  global.fetch = vi.fn((url, init) => {
    interceptedHeaders = init?.headers
    return Promise.resolve(new Response())
  }) as any
  
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

### 12.5 How to Add a Feature

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
// src/__tests__/timeout.spec.ts
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

### 12.6 Key Patterns & Conventions

#### 12.6.1 Wrapper Pattern

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

#### 12.6.2 Error Handling Pattern

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

#### 12.6.3 State Synchronization Pattern

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

#### 12.6.4 URL Normalization Pattern

**Always normalize URLs for deduplication keys:**
```typescript
// Use DeduplicationManager.normalizeUrl() internally
// Or create helper if needed elsewhere
const normalizedUrl = normalizeUrl(url) // Removes trailing slashes, sorts query params
```

**Why:** Ensures identical requests generate identical keys.

#### 12.6.5 Testing Patterns

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

### 12.7 Common Tasks

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

### 12.8 Code Quality Standards

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

### 12.9 File Naming Conventions

- **Test files**: `__tests__/[feature].spec.ts` (NOT `.test.ts`)
- **Type files**: `types.ts` in same directory or `types/[name].ts`
- **Utility files**: `utils/[name].ts`
- **Feature modules**: `features/[feature-name]/[file].ts`
- **Manager classes**: `managers/[manager-name]/index.ts`

### 12.10 Testing Checklist

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

## 13. Architectural Decisions

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

## 13. Roadmap

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
- **Test Coverage**: Organized by feature (setup, deduplication, interceptors)
- **Type Safety**: Complete (no `any` types in public API)
- **Linting**: 0 errors
- **Build**: Optimized and production-ready

---

## 14. Appendix

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
