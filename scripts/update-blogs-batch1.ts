// scripts/update-blogs-batch1.ts
import { db } from '../server/db'
import { blogs } from '../server/db/schema'
import { eq } from 'drizzle-orm'

const BLOG_CONTENTS = {
  12: `# Getting Started with Vue 3 Composition API

The Vue 3 Composition API represents a paradigm shift in how we approach component architecture. Moving away from the Options API's scattered organization, the Composition API brings logical concerns together, creating more maintainable and scalable applications.

## Understanding the Mental Model

When working with large components in Vue 2, developers often found themselves scrolling through hundreds of lines to understand a single feature. Data definitions lived at the top, methods in the middle, and computed properties somewhere in between. The Composition API solves this by allowing you to organize code by feature rather than by option type.

## Core Reactive Primitives

Vue 3 provides two main ways to create reactive state: \`ref\` and \`reactive\`. Understanding when to use each is crucial for writing clean code.

### Using ref

The \`ref\` function is perfect for primitive values and provides a clear indicator of reactivity through the \`.value\` syntax:

\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return { count, doubled, increment }
  }
}
\`\`\`

### When to Use reactive

For complex objects, \`reactive\` can feel more natural as it doesn't require \`.value\`:

\`\`\`javascript
import { reactive } from 'vue'

const state = reactive({
  user: {
    name: 'John',
    email: 'john@example.com'
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
})
\`\`\`

## The Power of Composables

Composables are the secret weapon of the Composition API. They allow you to extract and reuse stateful logic across components without the pitfalls of mixins.

### Example: useCounter

\`\`\`javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const isEven = computed(() => count.value % 2 === 0)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    isEven,
    increment,
    decrement,
    reset
  }
}
\`\`\`

This composable can now be used in any component:

\`\`\`javascript
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const { count, isEven, increment } = useCounter(10)
    return { count, isEven, increment }
  }
}
\`\`\`

## Lifecycle Hooks in Setup

Lifecycle hooks in the Composition API are imported as functions and called within setup:

\`\`\`javascript
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  setup() {
    const data = ref(null)
    
    onMounted(async () => {
      data.value = await fetchData()
    })
    
    onUnmounted(() => {
      // Cleanup
    })
    
    return { data }
  }
}
\`\`\`

## TypeScript Integration

One of the biggest advantages of the Composition API is its superior TypeScript support. Type inference works naturally:

\`\`\`typescript
import { ref, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export function useUser(): {
  user: Ref<User | null>
  fetchUser: (id: number) => Promise<void>
} {
  const user = ref<User | null>(null)
  
  async function fetchUser(id: number) {
    const response = await fetch(\`/api/users/\${id}\`)
    user.value = await response.json()
  }
  
  return { user, fetchUser }
}
\`\`\`

## Performance Optimization

The Composition API enables better tree-shaking and smaller bundle sizes. Unused features are automatically removed during the build process, resulting in faster load times.

## Best Practices

1. **Group related logic together** - Keep code for a single feature in one place
2. **Extract reusable logic into composables** - Don't repeat yourself
3. **Use ref for primitives, reactive for objects** - Though ref works for both
4. **Leverage TypeScript** - Get the full benefits of type safety
5. **Keep setup functions clean** - Extract complex logic into separate functions

## Conclusion

The Composition API isn't just a new way to write Vue components—it's a better way. It scales with your application, plays nicely with TypeScript, and makes your code more maintainable. While there's a learning curve, the investment pays off quickly in increased productivity and code quality.

Start small by converting one component, understand the patterns, and gradually adopt it across your codebase. Your future self will thank you.`,

  13: `# Understanding TypeScript Generics: A Deep Dive

TypeScript generics are one of the language's most powerful features, yet they often intimidate developers. This comprehensive guide will demystify generics and show you how to leverage them for type-safe, reusable code.

## What Are Generics?

Generics allow you to write code that works with multiple types while maintaining type safety. Think of them as type variables that let you create flexible, reusable components.

## The Problem Generics Solve

Without generics, you'd either sacrifice type safety or write duplicate code:

\`\`\`typescript
// Without generics - lose type safety
function identity(arg: any): any {
  return arg
}

// Or write duplicate code
function numberIdentity(arg: number): number {
  return arg
}

function stringIdentity(arg: string): string {
  return arg
}
\`\`\`

With generics, you get both reusability and type safety:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

const num = identity<number>(42)      // num is number
const str = identity<string>("hello") // str is string
\`\`\`

## Generic Functions

The most common use case for generics is in functions. The type parameter \`T\` acts as a placeholder:

\`\`\`typescript
function wrapInArray<T>(item: T): T[] {
  return [item]
}

const numbers = wrapInArray(123)        // number[]
const strings = wrapInArray("hello")    // string[]
\`\`\`

## Generic Interfaces

Generics shine when creating reusable data structures:

\`\`\`typescript
interface Box<T> {
  value: T
  getValue: () => T
  setValue: (newValue: T) => void
}

const numberBox: Box<number> = {
  value: 42,
  getValue: function() { return this.value },
  setValue: function(v) { this.value = v }
}

const stringBox: Box<string> = {
  value: "hello",
  getValue: function() { return this.value },
  setValue: function(v) { this.value = v }
}
\`\`\`

## Generic Classes

Classes can use generics to create type-safe containers:

\`\`\`typescript
class DataStore<T> {
  private data: T[] = []
  
  add(item: T): void {
    this.data.push(item)
  }
  
  get(index: number): T | undefined {
    return this.data[index]
  }
  
  getAll(): T[] {
    return [...this.data]
  }
}

const numberStore = new DataStore<number>()
numberStore.add(1)
numberStore.add(2)
// numberStore.add("3") // Error!

const userStore = new DataStore<User>()
userStore.add({ id: 1, name: "John" })
\`\`\`

## Generic Constraints

Sometimes you need to limit which types can be used. Constraints let you specify requirements:

\`\`\`typescript
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(item: T): void {
}

logLength("hello")        // OK - strings have length
logLength([1, 2, 3])      // OK - arrays have length
logLength({ length: 10 }) // OK - object has length
// logLength(123)         // Error - numbers don't have length
\`\`\`

## Multiple Type Parameters

You can use multiple generic type parameters:

\`\`\`typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}

const result = merge(
  { name: "John" },
  { age: 30 }
)
// result has type { name: string } & { age: number }
\`\`\`

## Real-World Example: API Client

Here's how generics make API clients type-safe:

\`\`\`typescript
class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return response.json()
  }
  
  async post<T, U>(url: string, body: U): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
    return response.json()
  }
}

interface User {
  id: number
  name: string
  email: string
}

const api = new ApiClient()

// TypeScript knows user is User type
const user = await api.get<User>('/api/user/1')

// TypeScript checks the request body type
await api.post<User, Partial<User>>('/api/users', {
  name: "John"
})
\`\`\`

## Generic Utility Types

TypeScript includes built-in generic utility types:

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

// Make all properties optional
type PartialUser = Partial<User>

// Make all properties required
type RequiredUser = Required<User>

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>

// Omit specific properties
type PublicUser = Omit<User, 'password'>

// Make all properties readonly
type ImmutableUser = Readonly<User>
\`\`\`

## Advanced Pattern: Conditional Types

Generics become even more powerful with conditional types:

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false

type A = IsArray<number[]>  // true
type B = IsArray<string>    // false

// Extract return type from function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: "John" }
}

type User = ReturnType<typeof getUser>
// { id: number, name: string }
\`\`\`

## Best Practices

1. **Use meaningful names** - \`T\` is fine for simple cases, but use descriptive names for complex scenarios
2. **Don't over-constrain** - Only add constraints when necessary
3. **Leverage type inference** - Let TypeScript infer types when possible
4. **Document complex generics** - Add comments explaining the purpose
5. **Test edge cases** - Ensure your generics handle all expected types

## Common Pitfalls

**Pitfall 1: Losing type information**
\`\`\`typescript
// Bad - loses type info
function process<T>(items: T[]): any[] {
  return items.map(x => x)
}

// Good - preserves type
function process<T>(items: T[]): T[] {
  return items.map(x => x)
}
\`\`\`

**Pitfall 2: Over-complicating**
\`\`\`typescript
// Overly complex
type Complex<T, U, V> = T extends U ? V : never

// Simpler alternative
type Simple<T> = T extends string ? string[] : never
\`\`\`

## Conclusion

Generics are essential for writing reusable, type-safe TypeScript code. Start with simple generic functions, progress to classes and interfaces, and gradually explore advanced patterns. The initial investment in learning generics pays dividends in code quality and developer productivity.

Remember: generics aren't just about syntax—they're about expressing intent and catching bugs at compile time rather than runtime. Master them, and you'll write better TypeScript.`,

  14: `# Building RESTful APIs with Nuxt 3: A Complete Guide

Creating robust, scalable APIs is fundamental to modern web development. Nuxt 3's server engine, Nitro, provides a powerful foundation for building production-ready RESTful APIs with minimal configuration.

## Why Nuxt for API Development?

Traditional approaches to API development often require separate backend frameworks like Express or Fastify. Nuxt 3 unifies your frontend and backend in one codebase, offering:

- **Zero configuration** - APIs work out of the box
- **Type safety** - Share types between frontend and backend
- **Auto-imports** - Less boilerplate code
- **Built-in validation** - With Zod integration
- **Edge deployment** - Deploy to Vercel, Netlify, Cloudflare

## Project Structure

Nuxt uses a file-based routing system for API endpoints:

\`\`\`
server/
├── api/
│   ├── users/
│   │   ├── index.get.ts      # GET /api/users
│   │   ├── index.post.ts     # POST /api/users
│   │   └── [id].get.ts       # GET /api/users/:id
│   └── auth/
│       ├── login.post.ts     # POST /api/auth/login
│       └── logout.post.ts    # POST /api/auth/logout
├── middleware/
│   └── auth.ts               # Shared middleware
└── utils/
    └── db.ts                 # Database utilities
\`\`\`

## Creating Your First Endpoint

Let's build a complete CRUD API for a blog system.

### GET /api/posts

\`\`\`typescript
// server/api/posts/index.get.ts
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const posts = await db.select().from('posts')
  
  return {
    success: true,
    data: posts
  }
})
\`\`\`

### GET /api/posts/:id

\`\`\`typescript
// server/api/posts/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const post = await db
    .select()
    .from('posts')
    .where(eq(posts.id, Number(id)))
    .get()
  
  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }
  
  return {
    success: true,
    data: post
  }
})
\`\`\`

### POST /api/posts

\`\`\`typescript
// server/api/posts/index.post.ts
import { z } from 'zod'

const CreatePostSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  authorId: z.number()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const result = CreatePostSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
      data: result.error.errors
    })
  }
  
  const newPost = await db
    .insert(posts)
    .values(result.data)
    .returning()
  
  return {
    success: true,
    data: newPost
  }
})
\`\`\`

### PUT /api/posts/:id

\`\`\`typescript
// server/api/posts/[id].put.ts
const UpdatePostSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  content: z.string().min(10).optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  const result = UpdatePostSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input'
    })
  }
  
  const updated = await db
    .update(posts)
    .set(result.data)
    .where(eq(posts.id, Number(id)))
    .returning()
  
  if (!updated.length) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }
  
  return {
    success: true,
    data: updated[0]
  }
})
\`\`\`

### DELETE /api/posts/:id

\`\`\`typescript
// server/api/posts/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const deleted = await db
    .delete(posts)
    .where(eq(posts.id, Number(id)))
    .returning()
  
  if (!deleted.length) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }
  
  return {
    success: true,
    message: 'Post deleted'
  }
})
\`\`\`

## Authentication Middleware

Protect your endpoints with reusable middleware:

\`\`\`typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    return // Public routes allowed
  }
  
  try {
    const user = await verifyToken(token)
    event.context.user = user
  } catch (error) {
    deleteCookie(event, 'auth-token')
  }
})
\`\`\`

Use in protected routes:

\`\`\`typescript
// server/api/posts/index.post.ts
export default defineEventHandler(async (event) => {
  // Require authentication
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  // ... rest of the code
})
\`\`\`

## Query Parameters and Filtering

Handle pagination, sorting, and filtering:

\`\`\`typescript
// server/api/posts/index.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const search = String(query.search || '')
  
  let queryBuilder = db.select().from(posts)
  
  // Search filter
  if (search) {
    queryBuilder = queryBuilder.where(
      or(
        like(posts.title, \`%\${search}%\`),
        like(posts.content, \`%\${search}%\`)
      )
    )
  }
  
  // Pagination
  const offset = (page - 1) * limit
  const data = await queryBuilder
    .limit(limit)
    .offset(offset)
  
  const total = await db
    .select({ count: count() })
    .from(posts)
    .get()
  
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: total.count,
      totalPages: Math.ceil(total.count / limit)
    }
  }
})
\`\`\`

## Error Handling Best Practices

Create consistent error responses:

\`\`\`typescript
// server/utils/errors.ts
export class ApiError extends Error {
  statusCode: number
  
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message
    })
  }
  
  // Log unexpected errors
  
  throw createError({
    statusCode: 500,
    message: 'Internal server error'
  })
}
\`\`\`

## Rate Limiting

Protect your API from abuse:

\`\`\`typescript
// server/middleware/rate-limit.ts
const requests = new Map()

export default defineEventHandler((event) => {
  const ip = getRequestIP(event)
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 100
  
  const userRequests = requests.get(ip) || []
  const recentRequests = userRequests.filter(
    (time: number) => now - time < windowMs
  )
  
  if (recentRequests.length >= maxRequests) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests'
    })
  }
  
  recentRequests.push(now)
  requests.set(ip, recentRequests)
})
\`\`\`

## Testing Your API

Use Nuxt's test utils for comprehensive testing:

\`\`\`typescript
// tests/api/posts.test.ts
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils'

describe('Posts API', () => {
  it('should return all posts', async () => {
    const response = await $fetch('/api/posts')
    
    expect(response.success).toBe(true)
    expect(Array.isArray(response.data)).toBe(true)
  })
  
  it('should create a new post', async () => {
    const newPost = {
      title: 'Test Post',
      content: 'This is a test',
      authorId: 1
    }
    
    const response = await $fetch('/api/posts', {
      method: 'POST',
      body: newPost
    })
    
    expect(response.success).toBe(true)
    expect(response.data.title).toBe(newPost.title)
  })
})
\`\`\`

## Deployment Considerations

When deploying your API:

1. **Use environment variables** for sensitive data
2. **Enable CORS** for cross-origin requests
3. **Add request logging** for debugging
4. **Implement caching** for frequently accessed data
5. **Monitor performance** with analytics

## Conclusion

Nuxt 3 provides everything you need to build production-ready APIs without the complexity of traditional backend frameworks. The file-based routing, built-in validation, and type safety make development fast and reliable.

Start with simple CRUD operations, add authentication as needed, and scale your API alongside your application. The unified codebase means less context switching and more productive development.`,

  15: `# Mastering Tailwind CSS: Tips and Advanced Techniques

Tailwind CSS has revolutionized how we approach styling in modern web development. This guide explores advanced patterns, optimization techniques, and best practices that will elevate your Tailwind game from intermediate to expert level.

## Understanding the Tailwind Philosophy

Tailwind isn't just another CSS framework—it's a fundamentally different approach to styling. Instead of predefined components, you get low-level utility classes that compose into unique designs. This shift requires a mental model change but rewards you with unprecedented flexibility.

## The @apply Directive: When and How

While Tailwind encourages utility-first classes, \`@apply\` has its place for frequently repeated patterns:

\`\`\`css
/* Good use case - complex component pattern */
.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg;
  @apply hover:bg-blue-700 focus:ring-2 focus:ring-blue-500;
  @apply transition-colors duration-200;
}

/* Bad use case - simple, reusable pattern */
/* Just use the classes directly */
.text-center { @apply text-center; }
\`\`\`

**Golden Rule**: Only use \`@apply\` for patterns you'll reuse many times and that are specific to your project.

## Custom Utilities: Extending Tailwind

Your \`tailwind.config.js\` is your power tool. Here's how to leverage it:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... custom color scale
          900: '#0c4a6e',
        }
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ]
}
\`\`\`

## Responsive Design: Mobile-First Mastery

Tailwind's responsive modifiers follow a mobile-first approach. Master this pattern:

\`\`\`html
<!-- Base styles for mobile, override for larger screens -->
<div class="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4 
  md:gap-6 
  lg:gap-8
">
  <!-- Cards -->
</div>
\`\`\`

**Pro tip**: Use arbitrary values for one-off tweaks:

\`\`\`html
<div class="w-[calc(100%-2rem)] md:w-[600px]">
  <!-- Custom width calculation -->
</div>
\`\`\`

## Dark Mode: The Right Way

Implement dark mode that respects user preferences:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
\`\`\`

\`\`\`html
<!-- Use dark: modifier -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">
    Heading
  </h1>
  <p class="text-gray-600 dark:text-gray-400">
    Content
  </p>
</div>
\`\`\`

**Toggle implementation**:

\`\`\`javascript
// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark')
  localStorage.theme = 
    document.documentElement.classList.contains('dark') 
      ? 'dark' 
      : 'light'
}

// Initialize on load
if (localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}
\`\`\`

## Component Patterns: Building Reusable UI

Create composable patterns without losing Tailwind's flexibility:

### Card Component Example

\`\`\`vue
<!-- components/Card.vue -->
<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'elevated', 'outlined'].includes(v)
  },
  padding: {
    type: String,
    default: 'md'
  }
})

const cardClasses = computed(() => {
  const base = 'rounded-lg'
  
  const variants = {
    default: 'bg-white dark:bg-gray-800',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    outlined: 'border border-gray-200 dark:border-gray-700'
  }
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return [
    base,
    variants[props.variant],
    paddings[props.padding]
  ].join(' ')
})
</script>
\`\`\`

## Performance Optimization

### 1. PurgeCSS Configuration

Ensure you're only shipping used styles:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  // Safelist for dynamically generated classes
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
  ]
}
\`\`\`

### 2. Use JIT Mode

Just-In-Time mode generates styles on-demand:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  mode: 'jit',
  // ...
}
\`\`\`

## Advanced Layout Techniques

### CSS Grid Mastery

\`\`\`html
<!-- Responsive grid with auto-fit -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <!-- Items auto-arrange -->
</div>

<!-- Named grid areas -->
<div class="grid grid-areas-[header,sidebar,main,footer] lg:grid-areas-[header_header,sidebar_main,footer_footer]">
  <header class="grid-area-header">Header</header>
  <aside class="grid-area-sidebar">Sidebar</aside>
  <main class="grid-area-main">Content</main>
  <footer class="grid-area-footer">Footer</footer>
</div>
\`\`\`

### Flexbox Patterns

\`\`\`html
<!-- Center anything -->
<div class="flex items-center justify-center min-h-screen">
  <div>Perfectly centered</div>
</div>

<!-- Sticky footer -->
<div class="flex flex-col min-h-screen">
  <header>Header</header>
  <main class="flex-1">Content</main>
  <footer>Footer</footer>
</div>
\`\`\`

## Animation and Transitions

Create smooth, performant animations:

\`\`\`html
<!-- Hover effects -->
<button class="
  transform transition-all duration-200
  hover:scale-105 hover:shadow-lg
  active:scale-95
">
  Animated Button
</button>

<!-- Loading spinner -->
<div class="
  animate-spin rounded-full h-12 w-12
  border-t-2 border-b-2 border-blue-500
">
</div>

<!-- Fade in animation -->
<div class="animate-[fadeIn_0.5s_ease-in-out]">
  Content
</div>
\`\`\`

## Typography Scale

Build a consistent type system:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      }
    }
  }
}
\`\`\`

## Accessibility Best Practices

Never sacrifice accessibility for style:

\`\`\`html
<!-- Focus states -->
<button class="
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  rounded-lg
">
  Accessible Button
</button>

<!-- Screen reader only text -->
<span class="sr-only">
  Screen reader only description
</span>

<!-- Proper color contrast -->
<div class="bg-gray-900 text-white">
  <!-- Ensure WCAG AA compliance -->
</div>
\`\`\`

## Plugin Development

Create custom plugins for repeated patterns:

\`\`\`javascript
// plugins/tailwind-custom.js
const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addComponents, theme }) {
  addComponents({
    '.container-custom': {
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: theme('spacing.4'),
      paddingRight: theme('spacing.4'),
      '@screen sm': {
        maxWidth: '640px',
      },
      '@screen md': {
        maxWidth: '768px',
      },
      '@screen lg': {
        maxWidth: '1024px',
      },
    }
  })
})
\`\`\`

## Debugging Tips

When styles don't work as expected:

1. **Check specificity conflicts** - Browser DevTools shows which styles are overridden
2. **Verify purge configuration** - Ensure your content paths are correct
3. **Use arbitrary values** - \`w-[300px]\` when utilities don't exist
4. **Browser DevTools** - Inspect computed styles

## Conclusion

Mastering Tailwind means understanding not just the utilities, but when to extend them, how to optimize for production, and building maintainable patterns. Focus on composability, performance, and accessibility, and you'll create beautiful, scalable interfaces.

The framework is constantly evolving—stay updated with the official documentation and experiment with new features as they're released. Your Tailwind expertise will make you faster, more productive, and produce better results.`,

  16: `# State Management with Pinia: The Complete Guide

Pinia is Vue's official state management library, representing a complete reimagining of Vuex for the modern Vue 3 ecosystem. This comprehensive guide covers everything from basic patterns to advanced techniques for building scalable applications.

## Why Pinia Over Vuex?

Pinia isn't just Vuex 5—it's a ground-up rewrite designed specifically for Vue 3:

- **Better TypeScript support** - Full type inference without manual typing
- **No mutations** - Simplified API with direct state modification
- **Modular by design** - No single global store
- **DevTools integration** - Time-travel debugging and state inspection
- **Plugin system** - Extensible architecture
- **SSR friendly** - First-class server-side rendering support

## Installation and Setup

\`\`\`bash
npm install pinia
\`\`\`

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
\`\`\`

For Nuxt 3, it's even simpler:

\`\`\`typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
})
\`\`\`

## Your First Store

Pinia stores are defined using the Composition API-style \`setup\` syntax:

\`\`\`typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  const name = ref('Counter')
  
  // Getters
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  
  // Actions
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  async function incrementAsync() {
    await new Promise(resolve => setTimeout(resolve, 1000))
    count.value++
  }
  
  return {
    // State
    count,
    name,
    // Getters
    doubleCount,
    isEven,
    // Actions
    increment,
    decrement,
    incrementAsync
  }
})
\`\`\`

## Using Stores in Components

\`\`\`vue
<template>
  <div>
    <h1>{{ counter.name }}</h1>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <p>Is Even: {{ counter.isEven }}</p>
    
    <button @click="counter.increment">+</button>
    <button @click="counter.decrement">-</button>
    <button @click="counter.incrementAsync">Async +</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// Destructuring (requires storeToRefs for reactivity)
import { storeToRefs } from 'pinia'

const { count, doubleCount } = storeToRefs(counter)
const { increment, decrement } = counter
</script>
\`\`\`

## Real-World Example: User Authentication Store

\`\`\`typescript
// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || 'Guest')
  
  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      user.value = response.user
      token.value = response.token
      
      // Store token in localStorage
      localStorage.setItem('auth-token', response.token)
      
      return true
    } catch (err) {
      error.value = err.message || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('auth-token')
    }
  }
  
  async function fetchUser() {
    const savedToken = localStorage.getItem('auth-token')
    if (!savedToken) return
    
    token.value = savedToken
    isLoading.value = true
    
    try {
      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: \`Bearer \${savedToken}\`
        }
      })
      
      user.value = response.user
    } catch (err) {
      // Token invalid, clear auth
      token.value = null
      localStorage.removeItem('auth-token')
    } finally {
      isLoading.value = false
    }
  }
  
  function $reset() {
    user.value = null
    token.value = null
    isLoading.value = false
    error.value = null
  }
  
  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    userName,
    // Actions
    login,
    logout,
    fetchUser,
    $reset
  }
})
\`\`\`

## Store Composition: Using Multiple Stores

Stores can easily reference each other:

\`\`\`typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  
  const items = ref([])
  
  const canCheckout = computed(() => {
    return authStore.isAuthenticated && items.value.length > 0
  })
  
  async function checkout() {
    if (!canCheckout.value) {
      throw new Error('Cannot checkout')
    }
    
    const response = await $fetch('/api/orders', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${authStore.token}\`
      },
      body: {
        items: items.value
      }
    })
    
    // Clear cart after successful checkout
    items.value = []
    
    return response
  }
  
  return {
    items,
    canCheckout,
    checkout
  }
})
\`\`\`

## Persisting State

Create a plugin for automatic state persistence:

\`\`\`typescript
// plugins/pinia-persist.ts
import { PiniaPluginContext } from 'pinia'

export function piniaPersistedState({ store }: PiniaPluginContext) {
  // Only run on client-side
  if (!import.meta.client) return
  
  const storageKey = \`pinia-\${store.$id}\`
  
  // Restore state from localStorage
  const savedState = localStorage.getItem(storageKey)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }
  
  // Save state on change
  store.$subscribe((mutation, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  })
}

// Register in main.ts
const pinia = createPinia()
pinia.use(piniaPersistedState)
\`\`\`

Or use with specific stores:

\`\`\`typescript
// stores/settings.ts
export const useSettingsStore = defineStore('settings', () => {
  const theme = ref('light')
  const language = ref('en')
  
  return { theme, language }
}, {
  persist: true // Enable persistence for this store
})
\`\`\`

## Advanced Patterns: Store Subscriptions

React to state changes:

\`\`\`typescript
const authStore = useAuthStore()

// Subscribe to actions
authStore.$onAction(({ name, args, after, onError }) => {
  
  after((result) => {
  })
  
  onError((error) => {
  })
})

// Subscribe to state changes
authStore.$subscribe((mutation, state) => {
})
\`\`\`

## Testing Stores

Pinia stores are easy to test:

\`\`\`typescript
// stores/__tests__/counter.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('increments count', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    
    counter.increment()
    expect(counter.count).toBe(1)
  })
  
  it('computes double count', () => {
    const counter = useCounterStore()
    counter.count = 5
    expect(counter.doubleCount).toBe(10)
  })
  
  it('handles async increment', async () => {
    const counter = useCounterStore()
    await counter.incrementAsync()
    expect(counter.count).toBe(1)
  })
})
\`\`\`

## DevTools Integration

Pinia provides excellent debugging capabilities:

1. **Time-travel debugging** - Step through state changes
2. **Action logging** - See all dispatched actions
3. **State inspection** - View current state
4. **Custom labels** - Name your stores meaningfully

## SSR Considerations

For server-side rendering, ensure proper hydration:

\`\`\`typescript
// In your Nuxt plugin
export default defineNuxtPlugin(({ $pinia }) => {
  // Server-side
  if (import.meta.server) {
    // Initialize stores with data
    const authStore = useAuthStore($pinia)
    // Fetch initial data
  }
  
  // Client-side
  if (import.meta.client) {
    // Hydrate from server state
    const nuxtApp = useNuxtApp()
    $pinia.state.value = nuxtApp.payload.pinia || {}
  }
})
\`\`\`

## Best Practices

1. **Keep stores focused** - One store per domain (auth, cart, products)
2. **Use getters for derived state** - Don't duplicate computed values
3. **Actions for async operations** - Keep components clean
4. **Type your state** - Leverage TypeScript for safety
5. **Don't overuse stores** - Component state is fine for local UI state
6. **Use composition** - Share logic between stores
7. **Subscribe wisely** - Avoid memory leaks with proper cleanup

## Performance Optimization

\`\`\`typescript
// Batch updates with $patch
const store = useCartStore()

// Instead of:
store.item1 = value1
store.item2 = value2
store.item3 = value3

// Do this:
store.$patch({
  item1: value1,
  item2: value2,
  item3: value3
})

// Or with a function for complex updates:
store.$patch((state) => {
  state.items.push({ id: 1, name: 'New' })
  state.hasChanged = true
})
\`\`\`

## Conclusion

Pinia represents the future of state management in Vue. Its simple API, excellent TypeScript support, and modular architecture make it the obvious choice for new projects. Whether you're building a small app or a large-scale enterprise application, Pinia scales with your needs.

Start with simple stores, leverage composition as complexity grows, and don't be afraid to experiment with plugins and advanced patterns. Your state management will be cleaner, more maintainable, and easier to test.`,
}

async function updateBatch1() {

  for (const [id, content] of Object.entries(BLOG_CONTENTS)) {
    try {
      await db.update(blogs)
        .set({ content })
        .where(eq(blogs.id, Number(id)))

    }
    catch (error) {
    }
  }

  process.exit(0)
}

updateBatch1()
