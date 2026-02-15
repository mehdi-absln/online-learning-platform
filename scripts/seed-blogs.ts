// scripts/seed-blogs.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { blogs, users } from '../server/db/schema'
import { eq } from 'drizzle-orm'

// ✅ مسیر صحیح دیتابیس
const sqlite = new Database('./server/data/db.sqlite')
const db = drizzle(sqlite)

// بلاگ‌های واقعی و با کیفیت
const sampleBlogs = [
  {
    title: 'Getting Started with Vue 3 Composition API',
    slug: 'getting-started-vue3-composition-api',
    content: `
The Vue 3 Composition API represents a significant shift in how we write Vue components. Unlike the Options API, which organizes code by options (data, methods, computed), the Composition API allows us to organize code by logical concern.

## Why Composition API?

The main benefits include:
- **Better TypeScript support**: The Composition API was designed with TypeScript in mind
- **Code reusability**: Logic can be easily extracted into composable functions
- **Better code organization**: Related code stays together

## Basic Example

Here's a simple counter example:

\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return { count, double, increment }
  }
}
\`\`\`

## Composables

One of the most powerful features is the ability to create composables - reusable functions that encapsulate reactive logic.

\`\`\`javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return { count, increment, decrement, reset }
}
\`\`\`

This makes your code more modular and testable!
    `.trim(),
    excerpt: 'Learn the basics of Vue 3 Composition API and how to write better, more maintainable Vue applications.',
    coverImage: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800',
    status: 'published' as const,
  },
  {
    title: 'Understanding TypeScript Generics',
    slug: 'understanding-typescript-generics',
    content: `
TypeScript generics are one of the most powerful features of the language. They allow you to write flexible, reusable code while maintaining type safety.

## What are Generics?

Generics allow you to create components that work with a variety of types rather than a single one.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

const num = identity<number>(42)
const str = identity<string>('hello')
\`\`\`

## Generic Interfaces

You can also use generics with interfaces:

\`\`\`typescript
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

interface User {
  id: number
  name: string
}

const response: ApiResponse<User> = {
  data: { id: 1, name: 'John' },
  success: true
}
\`\`\`

## Generic Constraints

Sometimes you want to limit the types that can be used with a generic:

\`\`\`typescript
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength('hello')     // ✅ Works
logLength([1, 2, 3])   // ✅ Works
logLength(123)         // ❌ Error: number doesn't have length
\`\`\`

Generics are essential for building robust, type-safe applications!
    `.trim(),
    excerpt: 'Deep dive into TypeScript generics and learn how to write more flexible and reusable code.',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    status: 'published' as const,
  },
  {
    title: 'Building RESTful APIs with Nuxt 3',
    slug: 'building-restful-apis-nuxt3',
    content: `
Nuxt 3 makes it incredibly easy to build full-stack applications with its server directory. Let's explore how to create RESTful APIs.

## Server Routes

In Nuxt 3, you can create API endpoints by adding files to the \`server/api\` directory:

\`\`\`typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const users = await db.select().from(usersTable)
  return { success: true, data: users }
})
\`\`\`

## HTTP Methods

The file naming convention determines the HTTP method:
- \`users.get.ts\` → GET /api/users
- \`users.post.ts\` → POST /api/users
- \`users/[id].put.ts\` → PUT /api/users/:id
- \`users/[id].delete.ts\` → DELETE /api/users/:id

## Reading Request Data

\`\`\`typescript
// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const query = getQuery(event)
  const params = event.context.params
  
  // Create user logic...
  return { success: true, data: newUser }
})
\`\`\`

## Error Handling

\`\`\`typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }
  
  // Continue with logic...
})
\`\`\`

Nuxt 3's server capabilities make it a great choice for full-stack development!
    `.trim(),
    excerpt: 'Learn how to build powerful RESTful APIs using Nuxt 3 server routes and best practices.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    status: 'published' as const,
  },
  {
    title: 'Mastering Tailwind CSS: Tips and Tricks',
    slug: 'mastering-tailwind-css-tips-tricks',
    content: `
Tailwind CSS has revolutionized how we write CSS. Here are some advanced tips to level up your Tailwind skills.

## Custom Colors

Define your brand colors in tailwind.config.ts:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#EC5252',
        'dark-bg': '#282828',
        'dark-surface': '#1F1F1E',
      }
    }
  }
}
\`\`\`

## Responsive Design

Use breakpoint prefixes for responsive designs:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Cards -->
</div>
\`\`\`

## Group and Peer Modifiers

Style elements based on parent or sibling state:

\`\`\`html
<div class="group">
  <img class="group-hover:scale-105 transition" />
  <h3 class="group-hover:text-primary">Title</h3>
</div>
\`\`\`

## Animation Classes

Create smooth animations:

\`\`\`html
<button class="transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
  Hover me
</button>
\`\`\`

## Dark Mode

Enable dark mode easily:

\`\`\`html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
\`\`\`

Tailwind CSS makes styling fast and consistent!
    `.trim(),
    excerpt: 'Advanced Tailwind CSS techniques to build beautiful, responsive interfaces faster.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    status: 'published' as const,
  },
  {
    title: 'State Management with Pinia',
    slug: 'state-management-pinia',
    content: `
Pinia is the official state management library for Vue 3. It's simpler, more intuitive, and has excellent TypeScript support.

## Why Pinia?

- Simpler API than Vuex
- Full TypeScript support
- No mutations - just actions
- Devtools support

## Creating a Store

\`\`\`typescript
// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  async function login(credentials) {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    user.value = response.user
  }
  
  function logout() {
    user.value = null
  }
  
  return { user, isAuthenticated, login, logout }
})
\`\`\`

## Using in Components

\`\`\`vue
<script setup>
const userStore = useUserStore()

async function handleLogin() {
  await userStore.login({ email, password })
}
</script>

<template>
  <div v-if="userStore.isAuthenticated">
    Welcome, {{ userStore.user.name }}!
  </div>
</template>
\`\`\`

## Store Composition

Stores can use other stores:

\`\`\`typescript
export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  
  // Use userStore.user to get user-specific cart
})
\`\`\`

Pinia makes state management a breeze!
    `.trim(),
    excerpt: 'Learn how to manage application state effectively with Pinia in Vue 3 applications.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    status: 'published' as const,
  },
  {
    title: 'Database Design Best Practices',
    slug: 'database-design-best-practices',
    content: `
Good database design is crucial for application performance and maintainability. Let's explore key principles.

## Normalization

Organize data to reduce redundancy:

**First Normal Form (1NF)**: Each column contains atomic values
**Second Normal Form (2NF)**: Remove partial dependencies
**Third Normal Form (3NF)**: Remove transitive dependencies

## Indexing

Create indexes for frequently queried columns:

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
\`\`\`

## Foreign Keys

Maintain referential integrity:

\`\`\`sql
CREATE TABLE blogs (
  id INTEGER PRIMARY KEY,
  author_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
\`\`\`

## Naming Conventions

- Use snake_case for columns
- Use plural for table names
- Be consistent with prefixes

## Query Optimization

- Select only needed columns
- Use LIMIT for pagination
- Avoid N+1 queries
- Use JOINs wisely

Good database design pays off in the long run!
    `.trim(),
    excerpt: 'Essential database design principles for building scalable and maintainable applications.',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    status: 'published' as const,
  },
  {
    title: 'Testing Vue Components with Vitest',
    slug: 'testing-vue-components-vitest',
    content: `
Testing is essential for building reliable applications. Vitest is a fast, Vite-native testing framework perfect for Vue projects.

## Setup

\`\`\`bash
npm install -D vitest @vue/test-utils happy-dom
\`\`\`

## Basic Component Test

\`\`\`typescript
import { mount } from ' @vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    expect(wrapper.text()).toContain('Click me')
  })
  
  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
\`\`\`

## Testing Composables

\`\`\`typescript
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter()
    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
  })
})
\`\`\`

## Mocking

\`\`\`typescript
import { vi } from 'vitest'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    fetch: vi.fn().mockResolvedValue({ data: [] })
  })
}))
\`\`\`

Testing gives you confidence in your code!
    `.trim(),
    excerpt: 'A complete guide to testing Vue 3 components and composables with Vitest.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    status: 'published' as const,
  },
  {
    title: 'Authentication Best Practices',
    slug: 'authentication-best-practices',
    content: `
Security is paramount in web applications. Let's explore authentication best practices.

## Password Hashing

Never store plain text passwords:

\`\`\`typescript
import bcrypt from 'bcrypt'

const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(inputPassword, hashedPassword)
\`\`\`

## JWT Tokens

Use JWTs for stateless authentication:

\`\`\`typescript
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)
\`\`\`

## HTTP-Only Cookies

Store tokens in HTTP-only cookies:

\`\`\`typescript
setCookie(event, 'auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7 // 7 days
})
\`\`\`

## Input Validation

Always validate user input:

\`\`\`typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const result = loginSchema.safeParse(body)
if (!result.success) {
  throw createError({ statusCode: 400 })
}
\`\`\`

Security should never be an afterthought!
    `.trim(),
    excerpt: 'Essential security practices for implementing authentication in modern web applications.',
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
    status: 'published' as const,
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Which',
    slug: 'css-grid-vs-flexbox',
    content: `
Both CSS Grid and Flexbox are powerful layout systems, but they excel in different scenarios.

## Flexbox: One-Dimensional

Best for layouts in a single direction:

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Use Flexbox for:**
- Navigation menus
- Card content alignment
- Centering elements
- Space distribution

## Grid: Two-Dimensional

Best for complex, two-dimensional layouts:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
\`\`\`

**Use Grid for:**
- Page layouts
- Card grids
- Complex forms
- Dashboard layouts

## Combining Both

They work great together:

\`\`\`html
<div class="grid grid-cols-3 gap-4">
  <div class="flex flex-col justify-between">
    <!-- Card content -->
  </div>
</div>
\`\`\`

Choose the right tool for each job!
    `.trim(),
    excerpt: 'Understand when to use CSS Grid vs Flexbox for optimal layout solutions.',
    coverImage: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800',
    status: 'published' as const,
  },
  {
    title: 'Performance Optimization in Vue',
    slug: 'performance-optimization-vue',
    content: `
A fast application provides a better user experience. Let's explore Vue performance optimization techniques.

## Lazy Loading Components

\`\`\`typescript
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
\`\`\`

## Virtual Scrolling

For long lists, use virtual scrolling:

\`\`\`vue
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    v-slot="{ item }"
  >
    <div>{{ item.name }}</div>
  </RecycleScroller>
</template>
\`\`\`

## Computed Caching

Use computed properties for expensive calculations:

\`\`\`typescript
const filteredItems = computed(() => 
  items.value.filter(item => item.active)
)
\`\`\`

## v-once for Static Content

\`\`\`vue
<div v-once>
  {{ staticContent }}
</div>
\`\`\`

## Image Optimization

Use NuxtImg for optimized images:

\`\`\`vue
<NuxtImg
  src="/image.jpg"
  width="400"
  height="300"
  loading="lazy"
/>
\`\`\`

Performance matters for user satisfaction!
    `.trim(),
    excerpt: 'Practical tips for improving the performance of your Vue applications.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    status: 'published' as const,
  },
]

async function seedBlogs() {
  console.log('🌱 Seeding blogs...\n')

  try {
    // ✅ مستقیم John Smith رو بگیر
    const [author] = await db.select().from(users).where(eq(users.id, 2)).limit(1)

    if (!author) {
      console.error('❌ John Smith not found!')
      process.exit(1)
    }

    console.log(`📝 Using author: ${author.name} (${author.email})\n`)

    // Delete existing blogs (optional)
    console.log('🗑️  Clearing existing blogs...')
    await db.delete(blogs)

    const now = new Date()

    // ✅ استفاده از Date object
    const blogsToInsert = sampleBlogs.map((blog, index) => ({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      coverImage: blog.coverImage,
      status: blog.status,
      authorId: author.id,
      publishedAt: blog.status === 'published'
        ? new Date(now.getTime() - index * 24 * 60 * 60 * 1000)  // ✅ Date object
        : null,
      createdAt: new Date(now.getTime() - index * 24 * 60 * 60 * 1000),  // ✅ Date object
      updatedAt: now,  // ✅ Date object
    }))

    const insertedBlogs = await db.insert(blogs).values(blogsToInsert).returning()

    console.log(`\n✅ Created ${insertedBlogs.length} blogs:\n`)
    
    insertedBlogs.forEach((blog, i) => {
      console.log(`   ${i + 1}. ${blog.title}`)
      console.log(`      └─ /${blog.slug} [${blog.status}]`)
    })

    console.log('\n🎉 Blog seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding blogs:', error)
    process.exit(1)
  } finally {
    sqlite.close()
  }
}

seedBlogs()