// scripts/update-blogs-batch2.ts
import { db } from '../server/db'
import { blogs } from '../server/db/schema'
import { eq } from 'drizzle-orm'

const BLOG_CONTENTS = {
  17: `# Database Design Best Practices: From Schema to Performance

Designing a robust database schema is one of the most critical decisions in application development. A well-designed database scales effortlessly, performs efficiently, and adapts to changing requirements. A poorly designed one becomes a bottleneck that haunts your application for years.

## Understanding Normalization vs Denormalization

Normalization is about eliminating redundancy, but taken too far, it kills performance. The key is finding the right balance.

### Normal Forms Explained

**First Normal Form (1NF)**: Each column contains atomic values—no arrays or JSON in relational databases (unless intentional).

**Second Normal Form (2NF)**: All non-key attributes depend on the entire primary key, not just part of it.

**Third Normal Form (3NF)**: No transitive dependencies—attributes depend only on the primary key.

\`\`\`sql
-- Bad: Not 1NF (multi-valued column)
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  phone_numbers TEXT -- "555-1234, 555-5678"
);

-- Good: 1NF compliant
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE user_phones (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  phone_number VARCHAR(20)
);
\`\`\`

### When to Denormalize

Denormalization trades storage for speed. Use it strategically:

1. **Read-heavy tables** - Precompute aggregates
2. **Reporting queries** - Create materialized views
3. **Frequently joined data** - Embed when appropriate

\`\`\`sql
-- Normalized (many joins)
SELECT 
  orders.id,
  users.name,
  products.title,
  products.price
FROM orders
JOIN users ON orders.user_id = users.id
JOIN order_items ON orders.id = order_items.order_id
JOIN products ON order_items.product_id = products.id;

-- Denormalized (snapshot at order time)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(100),      -- Denormalized
  product_title VARCHAR(200),  -- Denormalized
  product_price DECIMAL(10,2), -- Denormalized
  ordered_at TIMESTAMP
);
\`\`\`

## Indexing Strategies

Indexes are your performance multiplier—or divider if misused.

### Index Types

**B-Tree Indexes** (Default): Great for equality and range queries
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_created ON orders(created_at);
\`\`\`

**Hash Indexes**: Only for exact matches (PostgreSQL)
\`\`\`sql
CREATE INDEX idx_users_token USING HASH ON users(auth_token);
\`\`\`

**Composite Indexes**: Order matters!
\`\`\`sql
-- Good for: WHERE category = ? AND status = ?
CREATE INDEX idx_products_category_status 
  ON products(category, status);

-- Not good for: WHERE status = ? (won't use index efficiently)
\`\`\`

**Partial Indexes**: Index only relevant rows
\`\`\`sql
-- Only index active users
CREATE INDEX idx_active_users 
  ON users(email) 
  WHERE status = 'active';
\`\`\`

### Index Pitfalls

1. **Over-indexing** - Each index slows down writes
2. **Unused indexes** - Waste space and slow updates
3. **Low cardinality** - Don't index boolean columns (usually)

\`\`\`sql
-- Bad: Low cardinality
CREATE INDEX idx_users_is_active ON users(is_active);

-- Good: High cardinality
CREATE INDEX idx_users_email ON users(email);
\`\`\`

## Primary Key Design

Your primary key choice has cascading effects.

### Auto-increment vs UUID

**Auto-increment** (Ideal for most cases):
- Sequential, cache-friendly
- Smaller size (4-8 bytes)
- Reveals business metrics (total users)

\`\`\`sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  -- ...
);
\`\`\`

**UUID** (Use when needed):
- Globally unique
- No collision across distributed systems
- Larger size (16 bytes)

\`\`\`sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ...
);
\`\`\`

**ULIDs/KSUIDs** (Best of both worlds):
- Sortable by time
- Globally unique
- URL-safe

## Foreign Key Constraints

Always use them in production. They prevent orphaned records.

\`\`\`sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);
\`\`\`

**Cascade options**:
- \`CASCADE\` - Delete related records
- \`SET NULL\` - Nullify foreign key
- \`RESTRICT\` - Prevent deletion if references exist

## Data Types Matter

Choosing the right data type saves space and improves performance.

\`\`\`sql
-- Bad: Oversized types
CREATE TABLE products (
  name VARCHAR(1000),    -- Probably too big
  price DECIMAL(20, 10), -- Unnecessarily precise
  in_stock CHAR(1)       -- Use BOOLEAN
);

-- Good: Right-sized types
CREATE TABLE products (
  name VARCHAR(200),
  price DECIMAL(10, 2),
  in_stock BOOLEAN
);
\`\`\`

### JSON Columns

Modern databases support JSON, but use wisely:

\`\`\`sql
-- Good use: Flexible metadata
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255),
  preferences JSONB -- User settings, not critical data
);

-- Bad use: Relational data in JSON
CREATE TABLE orders (
  id INT PRIMARY KEY,
  items JSONB -- Should be a separate table!
);
\`\`\`

## Query Optimization

### Use EXPLAIN ANALYZE

Always profile before optimizing:

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE user_id = 123
  AND created_at > '2024-01-01';
\`\`\`

Look for:
- **Seq Scan** → Add index
- **High cost** → Rewrite query
- **Nested loops** → Consider JOIN order

### N+1 Problem

The silent killer of API performance:

\`\`\`javascript
// Bad: N+1 queries
const users = await db.select().from('users');
for (const user of users) {
  user.posts = await db.select().from('posts').where({ user_id: user.id });
}

// Good: Single query with JOIN
const users = await db
  .select()
  .from('users')
  .leftJoin('posts', 'users.id', 'posts.user_id');
\`\`\`

## Soft Deletes vs Hard Deletes

**Soft Deletes**: Mark as deleted
\`\`\`sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- "Delete"
UPDATE users SET deleted_at = NOW() WHERE id = 123;

-- Query active users
SELECT * FROM users WHERE deleted_at IS NULL;
\`\`\`

**Pros**: Audit trail, easy recovery  
**Cons**: Complicates queries, bloats tables

**Hard Deletes**: Actually remove rows
\`\`\`sql
DELETE FROM users WHERE id = 123;
\`\`\`

**Pros**: Cleaner, better performance  
**Cons**: No recovery, compliance issues

**Hybrid Approach**: Soft delete + archival
1. Soft delete initially
2. Archive to separate table after 30 days
3. Hard delete archives after 1 year

## Connection Pooling

Database connections are expensive. Pool them:

\`\`\`javascript
// Bad: New connection per request
app.get('/users', async (req, res) => {
  const db = await connectToDb(); // Expensive!
  const users = await db.query('SELECT * FROM users');
  await db.close();
  res.json(users);
});

// Good: Connection pool
const pool = createPool({
  host: 'localhost',
  database: 'myapp',
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000
});

app.get('/users', async (req, res) => {
  const users = await pool.query('SELECT * FROM users');
  res.json(users);
});
\`\`\`

## Backup and Recovery

Your database will fail. Be ready.

### Backup Strategies

1. **Logical backups** (\`pg_dump\`)
   - Easy to restore
   - Slow for large databases

2. **Physical backups** (filesystem snapshots)
   - Fast
   - Point-in-time recovery

3. **Continuous archiving**
   - Write-ahead logs (WAL)
   - Minimal data loss

### Testing Restores

**Most important rule**: Test your backups regularly.

\`\`\`bash
# Automated restore test
0 2 * * * /scripts/test-restore.sh
\`\`\`

## Migrations Best Practices

Never edit old migrations. Always create new ones.

\`\`\`javascript
// Good migration
export async function up(db) {
  await db.schema
    .createTable('products')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'varchar(200)', col => col.notNull())
    .addColumn('created_at', 'timestamp', col => 
      col.defaultTo(db.fn.now()).notNull()
    )
    .execute();
}

export async function down(db) {
  await db.schema.dropTable('products').execute();
}
\`\`\`

**Zero-downtime migrations**:
1. Add new column (nullable)
2. Deploy code that writes to both old and new
3. Backfill data
4. Deploy code that reads from new
5. Drop old column

## Monitoring and Alerting

Track these metrics:
- Query latency (p50, p95, p99)
- Connection pool usage
- Slow query log
- Table bloat
- Index usage

\`\`\`sql
-- Find unused indexes (PostgreSQL)
SELECT 
  schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE 'pg_toast%';
\`\`\`

## Conclusion

Database design is both art and science. Start with normalization, denormalize strategically, index thoughtfully, and always measure before optimizing. Your future self (and your ops team) will thank you.

Remember: premature optimization is the root of all evil, but ignoring database design leads to technical debt that's almost impossible to repay. Find the balance, and build systems that scale.`,

  18: `# Testing Vue Components with Vitest: A Comprehensive Guide

Testing Vue components doesn't have to be painful. With Vitest and Vue Test Utils, you can write fast, reliable tests that give you confidence to refactor and ship with speed. This guide covers everything from basic component tests to advanced patterns.

## Why Vitest for Vue?

Vitest is built on Vite, making it blazingly fast and perfectly suited for Vue projects:

- **Instant HMR** - Tests rerun on save
- **Native ESM** - No transpilation needed
- **Vue 3 first-class support** - Composition API, \`<script setup>\`, all work seamlessly
- **Jest-compatible API** - Easy migration if you're coming from Jest
- **Built-in coverage** - With c8/istanbul

## Setup

\`\`\`bash
npm install -D vitest @vue/test-utils happy-dom
\`\`\`

\`\`\`javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
})
\`\`\`

## Your First Component Test

Let's test a simple counter component:

\`\`\`vue
<!-- components/Counter.vue -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>
\`\`\`

\`\`\`javascript
// components/__tests__/Counter.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '../Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('Count: 0')
  })
  
  it('increments count when button clicked', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Count: 1')
  })
  
  it('decrements count', async () => {
    const wrapper = mount(Counter)
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.text()).toContain('Count: -1')
  })
})
\`\`\`

## Testing Props and Emits

\`\`\`vue
<!-- components/UserCard.vue -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="handleEdit">Edit</button>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])

function handleEdit() {
  emit('edit', user.id)
}
</script>
\`\`\`

\`\`\`javascript
// components/__tests__/UserCard.test.ts
import { mount } from '@vue/test-utils'
import UserCard from '../UserCard.vue'

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  }
  
  it('renders user data', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })
  
  it('emits edit event with user id', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('edit')
    expect(wrapper.emitted('edit')[0]).toEqual([1])
  })
})
\`\`\`

## Testing Composables

\`\`\`javascript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count,
    doubled,
    increment,
    decrement,
    reset
  }
}
\`\`\`

\`\`\`javascript
// composables/__tests__/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })
  
  it('initializes with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })
  
  it('increments count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })
  
  it('computes doubled value', () => {
    const { count, doubled, increment } = useCounter()
    increment()
    increment()
    expect(doubled.value).toBe(4)
  })
  
  it('resets to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    increment()
    increment()
    reset()
    expect(count.value).toBe(5)
  })
})
\`\`\`

## Mocking API Calls

\`\`\`vue
<!-- components/UserList.vue -->
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchUsers() {
  loading.value = true
  try {
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
\`\`\`

\`\`\`javascript
// components/__tests__/UserList.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserList from '../UserList.vue'

// Mock fetch globally
global.fetch = vi.fn()

describe('UserList', () => {
  beforeEach(() => {
    fetch.mockClear()
  })
  
  it('shows loading state initially', () => {
    fetch.mockResolvedValueOnce({
      json: async () => []
    })
    
    const wrapper = mount(UserList)
    expect(wrapper.text()).toContain('Loading...')
  })
  
  it('displays users after fetch', async () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockUsers
    })
    
    const wrapper = mount(UserList)
    await flushPromises()
    
    expect(wrapper.text()).toContain('John')
    expect(wrapper.text()).toContain('Jane')
  })
  
  it('displays error on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))
    
    const wrapper = mount(UserList)
    await flushPromises()
    
    expect(wrapper.text()).toContain('Error: Network error')
  })
})
\`\`\`

## Testing Pinia Stores

\`\`\`javascript
// stores/__tests__/counter.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('increments count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
  
  it('resets count', () => {
    const store = useCounterStore()
    store.count = 10
    store.$reset()
    expect(store.count).toBe(0)
  })
})
\`\`\`

## Testing Components with Stores

\`\`\`javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Counter from '../Counter.vue'

describe('Counter with Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('uses store state', () => {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createPinia()]
      }
    })
    
    expect(wrapper.text()).toContain('Count: 0')
  })
})
\`\`\`

## Snapshot Testing

\`\`\`javascript
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('matches snapshot', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    
    expect(wrapper.html()).toMatchSnapshot()
  })
})
\`\`\`

## Testing Async Components

\`\`\`javascript
import { mount, flushPromises } from '@vue/test-utils'
import AsyncComponent from '../AsyncComponent.vue'

describe('AsyncComponent', () => {
  it('renders after data loads', async () => {
    const wrapper = mount(AsyncComponent)
    
    // Wait for all promises to resolve
    await flushPromises()
    
    expect(wrapper.text()).toContain('Data loaded')
  })
})
\`\`\`

## Coverage Reports

\`\`\`bash
# Run tests with coverage
npm run test:coverage

# Coverage thresholds in vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
})
\`\`\`

## Best Practices

1. **Test behavior, not implementation**
2. **Keep tests focused** - One assertion per test (mostly)
3. **Use data-testid for selectors** - More stable than class names
4. **Mock external dependencies**
5. **Test edge cases** - Empty states, errors, loading
6. **Avoid testing framework internals**
7. **Use factory functions** for test data

\`\`\`javascript
// Test helpers
function createUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }
}

// Usage
const user = createUser({ name: 'John' })
\`\`\`

## Debugging Tests

\`\`\`javascript
import { mount } from '@vue/test-utils'

const wrapper = mount(Component)

// Print HTML
console.log(wrapper.html())

// Print component data
console.log(wrapper.vm.$data)

// Interactive debugging
await wrapper.vm.$nextTick()
debugger
\`\`\`

## Conclusion

Testing Vue components with Vitest is fast, intuitive, and integrates seamlessly with your Vite-based workflow. Start with simple component tests, gradually add composable and store tests, and don't forget to test the unhappy paths.

Remember: tests are documentation that runs. Write them clearly, keep them maintainable, and let them give you the confidence to ship fearlessly.`,

  19: `# Authentication Best Practices in Modern Web Applications

Authentication is the foundation of application security. Get it wrong, and your entire system is compromised. This comprehensive guide covers modern authentication patterns, security best practices, and implementation strategies that stand up to real-world attacks.

## Authentication vs Authorization

**Authentication**: Who are you? (Identity verification)  
**Authorization**: What can you do? (Permission verification)

Never confuse the two. Authentication comes first, authorization follows.

## Password Storage: The Non-Negotiables

**Rule #1**: Never store plaintext passwords. Ever.

### Hashing with bcrypt

\`\`\`javascript
import bcrypt from 'bcryptjs'

// Registration
const saltRounds = 12 // Higher = more secure, slower
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

// Store hashedPassword in database

// Login verification
const isValid = await bcrypt.compare(plainPassword, hashedPassword)
\`\`\`

**Why bcrypt?**
- Adaptive: You can increase rounds as hardware improves
- Salted: Rainbow tables are useless
- Slow: Makes brute-force attacks impractical

### Argon2: The New Standard

For new projects, consider Argon2 (winner of Password Hashing Competition):

\`\`\`javascript
import argon2 from 'argon2'

const hash = await argon2.hash(plainPassword)
const isValid = await argon2.verify(hash, plainPassword)
\`\`\`

**Never use**:
- MD5, SHA1, SHA256 (too fast, designed for data integrity not password storage)
- Custom hashing schemes (you're not smarter than cryptographers)

## Session-Based Authentication

Traditional but still reliable for server-rendered apps.

### Implementation

\`\`\`javascript
// server/api/auth/login.post.ts
import { serialize } from 'cookie'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  
  // 1. Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }
  
  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash)
  
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }
  
  // 3. Create session
  const sessionId = generateSecureToken()
  
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  })
  
  // 4. Set cookie
  const cookie = serialize('session', sessionId, {
    httpOnly: true,  // Prevents XSS
    secure: true,    // HTTPS only
    sameSite: 'lax', // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
  
  setHeader(event, 'Set-Cookie', cookie)
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }
})
\`\`\`

### Session Middleware

\`\`\`javascript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    return // Not authenticated, allow public routes
  }
  
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.id, sessionId),
      gt(sessions.expiresAt, new Date())
    ),
    with: {
      user: true
    }
  })
  
  if (session) {
    event.context.user = session.user
    
    // Sliding expiration: extend session on activity
    await db.update(sessions)
      .set({ 
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      })
      .where(eq(sessions.id, sessionId))
  } else {
    // Invalid or expired session
    deleteCookie(event, 'session')
  }
})
\`\`\`

## JWT-Based Authentication

Stateless, scalable, but requires careful handling.

### Creating JWTs

\`\`\`javascript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET // Store in env!

function createTokens(user) {
  // Access token: short-lived
  const accessToken = jwt.sign(
    { 
      userId: user.id,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  )
  
  // Refresh token: long-lived, stored in DB
  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  return { accessToken, refreshToken }
}
\`\`\`

### Verifying JWTs

\`\`\`javascript
// server/middleware/jwt-auth.ts
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    event.context.user = decoded
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Token expired'
      })
    }
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
\`\`\`

### Refresh Token Flow

\`\`\`javascript
// server/api/auth/refresh.post.ts
export default defineEventHandler(async (event) => {
  const { refreshToken } = await readBody(event)
  
  let decoded
  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET)
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid refresh token'
    })
  }
  
  // Check if refresh token is blacklisted
  const isBlacklisted = await db.query.tokenBlacklist.findFirst({
    where: eq(tokenBlacklist.token, refreshToken)
  })
  
  if (isBlacklisted) {
    throw createError({
      statusCode: 401,
      message: 'Token revoked'
    })
  }
  
  // Issue new access token
  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.userId)
  })
  
  const { accessToken } = createTokens(user)
  
  return { accessToken }
})
\`\`\`

## OAuth 2.0 / Social Login

Let providers handle the heavy lifting.

### Implementation with Nuxt Auth

\`\`\`javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  auth: {
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      }
    }
  }
})
\`\`\`

## Multi-Factor Authentication (MFA)

Add a second layer of security.

### TOTP (Time-based One-Time Password)

\`\`\`javascript
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

// Setup MFA
export async function setupMFA(userId) {
  const secret = speakeasy.generateSecret({
    name: \`MyApp (\${user.email})\`
  })
  
  // Store secret.base32 in database
  await db.update(users)
    .set({ mfaSecret: secret.base32 })
    .where(eq(users.id, userId))
  
  // Generate QR code for user to scan
  const qrCode = await QRCode.toDataURL(secret.otpauth_url)
  
  return { qrCode, secret: secret.base32 }
}

// Verify MFA code
export function verifyMFACode(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1 // Allow 30s time drift
  })
}
\`\`\`

## Rate Limiting

Prevent brute-force attacks.

\`\`\`javascript
// server/middleware/rate-limit.ts
const attempts = new Map()

export default defineEventHandler((event) => {
  const ip = getRequestIP(event)
  const key = \`login:\${ip}\`
  
  const now = Date.now()
  const record = attempts.get(key) || { count: 0, resetAt: now + 60000 }
  
  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + 60000
  }
  
  record.count++
  attempts.set(key, record)
  
  if (record.count > 5) {
    throw createError({
      statusCode: 429,
      message: 'Too many login attempts. Try again in 1 minute.'
    })
  }
})
\`\`\`

## Password Reset Flow

Secure password recovery.

\`\`\`javascript
// 1. Request reset
export async function requestPasswordReset(email) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })
  
  if (!user) {
    // Don't reveal if email exists
    return { success: true }
  }
  
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  
  await db.insert(passwordResets).values({
    userId: user.id,
    token,
    expiresAt: expires
  })
  
  // Send email with reset link
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    html: \`Click here to reset: https://app.com/reset?token=\${token}\`
  })
  
  return { success: true }
}

// 2. Reset password
export async function resetPassword(token, newPassword) {
  const reset = await db.query.passwordResets.findFirst({
    where: and(
      eq(passwordResets.token, token),
      gt(passwordResets.expiresAt, new Date())
    )
  })
  
  if (!reset) {
    throw new Error('Invalid or expired token')
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 12)
  
  await db.update(users)
    .set({ passwordHash: hashedPassword })
    .where(eq(users.id, reset.userId))
  
  // Invalidate all existing sessions
  await db.delete(sessions)
    .where(eq(sessions.userId, reset.userId))
  
  // Delete used reset token
  await db.delete(passwordResets)
    .where(eq(passwordResets.id, reset.id))
}
\`\`\`

## Security Checklist

- ✅ Use HTTPS everywhere
- ✅ Hash passwords with bcrypt/argon2
- ✅ Use HTTP-only, Secure cookies
- ✅ Implement CSRF protection
- ✅ Rate limit login attempts
- ✅ Validate and sanitize all inputs
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Implement proper session expiration
- ✅ Log security events
- ✅ Keep dependencies updated
- ✅ Use Content Security Policy headers
- ✅ Implement account lockout after failed attempts

## Conclusion

Authentication is not a feature you add at the end—it's foundational. Use proven libraries, follow standards, and never roll your own crypto. Security is an ongoing process: monitor logs, stay updated on vulnerabilities, and always assume attackers are trying.

Build authentication right the first time, because retrofitting security is painful and expensive. Your users trust you with their data—don't let them down.`,

  20: `# CSS Grid vs Flexbox: When to Use Each

CSS Grid and Flexbox are often presented as competing layout systems, but they're actually complementary tools designed for different layout challenges. Understanding when to use each will make you a more effective frontend developer.

## The Fundamental Difference

**Flexbox**: One-dimensional layout (row OR column)  
**Grid**: Two-dimensional layout (rows AND columns)

This isn't about which is "better"—it's about using the right tool for the job.

## Flexbox: Master of One Dimension

Flexbox excels when you're dealing with a single row or column of items.

### Perfect Use Cases for Flexbox

**1. Navigation Bars**
\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

**2. Card Components**
\`\`\`css
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-content {
  flex: 1; /* Grow to fill space */
}

.card-footer {
  margin-top: auto; /* Push to bottom */
}
\`\`\`

**3. Centering Elements**
\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`

**4. Form Layouts**
\`\`\`css
.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.form-row input {
  flex: 1;
}

.form-row button {
  flex-shrink: 0;
}
\`\`\`

### Flexbox Properties Deep Dive

\`\`\`css
.flex-container {
  display: flex;
  flex-direction: row; /* row | column | row-reverse | column-reverse */
  flex-wrap: nowrap;   /* nowrap | wrap | wrap-reverse */
  justify-content: flex-start; /* Main axis alignment */
  align-items: stretch;        /* Cross axis alignment */
  align-content: stretch;      /* Multi-line alignment */
  gap: 1rem;                   /* Modern spacing */
}

.flex-item {
  flex-grow: 0;     /* Can grow? */
  flex-shrink: 1;   /* Can shrink? */
  flex-basis: auto; /* Initial size */
  
  /* Shorthand: flex: grow shrink basis */
  flex: 1 0 200px;
  
  align-self: auto; /* Override container's align-items */
  order: 0;         /* Visual reordering */
}
\`\`\`

## CSS Grid: Two-Dimensional Power

Grid shines when you need control over both rows and columns simultaneously.

### Perfect Use Cases for Grid

**1. Page Layouts**
\`\`\`css
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
\`\`\`

**2. Image Galleries**
\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Featured item spans 2 columns and 2 rows */
.gallery-item:first-child {
  grid-column: span 2;
  grid-row: span 2;
}
\`\`\`

**3. Dashboard Layouts**
\`\`\`css
.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.widget-large  { grid-column: span 8; }
.widget-medium { grid-column: span 6; }
.widget-small  { grid-column: span 4; }
\`\`\`

**4. Magazine Layouts**
\`\`\`css
.magazine {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 100px;
  gap: 1rem;
}

.article-hero {
  grid-column: 1 / -1;  /* Full width */
  grid-row: span 3;
}

.article-feature {
  grid-column: span 3;
  grid-row: span 2;
}
\`\`\`

### Grid Properties Deep Dive

\`\`\`css
.grid-container {
  display: grid;
  
  /* Explicit grid */
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "...";
  
  /* Implicit grid (auto-placed items) */
  grid-auto-columns: 1fr;
  grid-auto-rows: minmax(100px, auto);
  grid-auto-flow: row; /* row | column | dense */
  
  /* Spacing */
  gap: 1rem;           /* row-gap + column-gap */
  
  /* Alignment */
  justify-items: stretch; /* Items on row axis */
  align-items: stretch;   /* Items on column axis */
  justify-content: start; /* Grid on row axis */
  align-content: start;   /* Grid on column axis */
}

.grid-item {
  /* Placement */
  grid-column: 1 / 3;  /* Start / End */
  grid-row: 2 / span 2; /* Start / Span */
  
  /* Shorthand */
  grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */
  
  /* Self-alignment */
  justify-self: start;
  align-self: start;
}
\`\`\`

## Combining Grid and Flexbox

The real power comes from using both together.

\`\`\`html
<div class="page-layout">  <!-- Grid -->
  <header>
    <nav class="nav">      <!-- Flexbox -->
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  
  <main class="card-grid">  <!-- Grid -->
    <div class="card">      <!-- Flexbox -->
      <img src="...">
      <div class="card-content">
        <h2>Title</h2>
        <p>Content</p>
      </div>
      <footer class="card-footer">
        <button>Action</button>
      </footer>
    </div>
  </main>
</div>
\`\`\`

\`\`\`css
.page-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
}
\`\`\`

## Responsive Patterns

### Flexbox Responsive

\`\`\`css
/* Stack on mobile, row on desktop */
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
  }
}
\`\`\`

### Grid Responsive

\`\`\`css
/* Auto-responsive grid (no media queries!) */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Or with media queries for more control */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

## Advanced Grid Techniques

### Subgrid

\`\`\`css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.child {
  display: grid;
  grid-template-columns: subgrid; /* Inherit parent's columns */
  grid-column: span 3;
}
\`\`\`

### Named Lines

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 
    [full-start] 1fr 
    [content-start] minmax(0, 1200px) 
    [content-end] 1fr 
    [full-end];
}

.item {
  grid-column: content-start / content-end;
}
\`\`\`

## Performance Considerations

Both Grid and Flexbox are highly performant, but:

- **Grid** can be more performant for complex layouts (single layout calculation)
- **Flexbox** might cause more reflows with dynamic content
- Use \`will-change: transform\` sparingly for animations

## Browser Support

- **Flexbox**: Excellent (IE 11+ with prefixes)
- **Grid**: Excellent (IE 11 with \`-ms-\` prefix and older syntax)
- Use \`@supports\` for progressive enhancement

\`\`\`css
@supports (display: grid) {
  .layout {
    display: grid;
  }
}
\`\`\`

## Decision Tree

**Use Flexbox when:**
- ✅ Single row or column layout
- ✅ Items should wrap naturally
- ✅ Content determines size
- ✅ Navigation, buttons, form inputs
- ✅ Centering is the goal

**Use Grid when:**
- ✅ Two-dimensional layout needed
- ✅ Precise placement required
- ✅ Overlapping elements
- ✅ Page layouts, dashboards, galleries
- ✅ Asymmetric designs

## Conclusion

Flexbox and Grid aren't competitors—they're teammates. Use Flexbox for component layouts and simple one-dimensional arrangements. Use Grid for page-level layouts and complex two-dimensional designs.

Master both, and you'll handle any layout challenge the web throws at you. The best layouts often use Grid for the overall structure and Flexbox for individual components.`,

  21: `# Performance Optimization in Vue 3: From Good to Great

Vue 3 is fast out of the box, but production applications need careful optimization to stay snappy as they grow. This guide covers practical techniques to keep your Vue apps performant at scale.

## Measuring Performance: You Can't Improve What You Don't Measure

Before optimizing anything, establish baselines.

### Chrome DevTools Performance Tab

\`\`\`javascript
// In your code
console.time('component-render')
// ... component logic
console.timeEnd('component-render')
\`\`\`

### Vue DevTools Performance

1. Open Vue DevTools
2. Navigate to "Performance" tab
3. Click "Record"
4. Perform actions
5. Analyze component render times

### Lighthouse CI

\`\`\`bash
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun --collect.numberOfRuns=3
\`\`\`

## Virtual Scrolling: Render Only What's Visible

Don't render 10,000 items when users see 10.

\`\`\`vue
<template>
  <!-- Before: Renders all items -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
  
  <!-- After: Renders only visible items -->
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
  >
    <template #default="{ item }">
      <div class="item">{{ item.name }}</div>
    </template>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
\`\`\`

## Code Splitting: Lazy Load Routes

Don't load admin pages for regular users.

\`\`\`javascript
// router/index.ts

// ❌ Bad: All components loaded upfront
import Home from '@/pages/Home.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Admin from '@/pages/Admin.vue'

// ✅ Good: Lazy-loaded
const routes = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/Dashboard.vue')
  },
  {
    path: '/admin',
    component: () => import('@/pages/Admin.vue')
  }
]
\`\`\`

### Component-Level Code Splitting

\`\`\`vue
<template>
  <div>
    <!-- Heavy component loaded only when needed -->
    <button @click="showChart = true">Load Chart</button>
    <Suspense v-if="showChart">
      <template #default>
        <HeavyChart />
      </template>
      <template #fallback>
        <div>Loading chart...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const showChart = ref(false)

const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
)
\`\`\`

## Computed vs Methods: Choose Wisely

Computed properties cache, methods don't.

\`\`\`vue
<script setup>
// ❌ Bad: Recalculates on every render
const filteredItems = () => {
  return items.value.filter(item => item.active)
}

// ✅ Good: Cached until dependencies change
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})
\`\`\`

## v-show vs v-if: Conditional Rendering

\`\`\`vue
<template>
  <!-- Use v-show for frequent toggles -->
  <div v-show="isVisible">
    Toggled frequently
  </div>
  
  <!-- Use v-if for rare conditions -->
  <AdminPanel v-if="user.isAdmin" />
</template>
\`\`\`

**v-show**: Element stays in DOM, toggled with CSS  
**v-if**: Element added/removed from DOM

**Rule of thumb**: Use \`v-show\` for frequent toggles, \`v-if\` for conditional content.

## :key Directive: Help Vue Track Elements

\`\`\`vue
<template>
  <!-- ❌ Bad: Vue can't track items efficiently -->
  <div v-for="item in items">
    {{ item.name }}
  </div>
  
  <!-- ✅ Good: Efficient tracking -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
\`\`\`

**Never use index as key**:
\`\`\`vue
<!-- ❌ Bad: Breaks when items reorder -->
<div v-for="(item, index) in items" :key="index">
\`\`\`

## Debounce Expensive Operations

\`\`\`vue
<template>
  <input 
    v-model="searchQuery" 
    @input="debouncedSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')

const performSearch = async (query) => {
  // Expensive API call
  await fetch(\`/api/search?q=\${query}\`)
}

const debouncedSearch = useDebounceFn(() => {
  performSearch(searchQuery.value)
}, 300)
\`\`\`

## Optimize Watchers

\`\`\`javascript
// ❌ Bad: Deep watch everything
watch(bigObject, () => {
  // Runs on any nested change
}, { deep: true })

// ✅ Good: Watch specific property
watch(() => bigObject.value.specificProp, () => {
  // Runs only when this prop changes
})

// ✅ Also good: Shallow watch
watchEffect(() => {
  // Only tracks accessed properties
  console.log(bigObject.value.prop)
})
\`\`\`

## Async Components with Suspense

\`\`\`vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <LoadingSkeleton />
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)
\`\`\`

## Memoization with Reactive Cache

\`\`\`javascript
import { computed } from 'vue'

const expensiveOperation = (n) => {
  // Simulate expensive calculation
  let result = 0
  for (let i = 0; i < n * 1000000; i++) {
    result += i
  }
  return result
}

// ❌ Bad: Recalculates every time
const result = computed(() => expensiveOperation(input.value))

// ✅ Good: Memoized
const cache = new Map()

const memoizedResult = computed(() => {
  const key = input.value
  if (cache.has(key)) {
    return cache.get(key)
  }
  const result = expensiveOperation(key)
  cache.set(key, result)
  return result
})
\`\`\`

## Image Optimization

\`\`\`vue
<template>
  <!-- ✅ Lazy load images -->
  <img 
    :src="imageUrl" 
    loading="lazy"
    width="400"
    height="300"
  />
  
  <!-- ✅ Modern formats with fallback -->
  <picture>
    <source type="image/webp" :srcset="webpUrl">
    <source type="image/jpeg" :srcset="jpgUrl">
    <img :src="fallbackUrl" alt="Description">
  </picture>
  
  <!-- ✅ Responsive images -->
  <img 
    :srcset="\`
      \${imageUrl}?w=400 400w,
      \${imageUrl}?w=800 800w,
      \${imageUrl}?w=1200 1200w
    \`"
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    :src="imageUrl"
  />
</template>
\`\`\`

## Bundle Size Optimization

\`\`\`javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'charts': ['chart.js'],
          'editor': ['monaco-editor']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
\`\`\`

### Tree Shaking

\`\`\`javascript
// ❌ Bad: Imports entire library
import _ from 'lodash'

// ✅ Good: Import only what you need
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
\`\`\`

## Production Build Optimizations

\`\`\`javascript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.logs
        drop_debugger: true
      }
    }
  }
})
\`\`\`

## Prefetching and Preloading

\`\`\`javascript
// router/index.ts
const routes = [
  {
    path: '/dashboard',
    component: () => import(
      /* webpackPrefetch: true */
      '@/pages/Dashboard.vue'
    )
  }
]
\`\`\`

**Prefetch**: Load during idle time  
**Preload**: Load immediately in parallel

## Performance Monitoring in Production

\`\`\`javascript
// plugins/performance.ts
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
})
\`\`\`

## Memory Leak Prevention

\`\`\`vue
<script setup>
import { onUnmounted } from 'vue'

const interval = setInterval(() => {
  // Do something
}, 1000)

// ✅ Always cleanup
onUnmounted(() => {
  clearInterval(interval)
})

// ✅ Event listeners
const handler = () => console.log('resize')
window.addEventListener('resize', handler)

onUnmounted(() => {
  window.removeEventListener('resize', handler)
})
\`\`\`

## Conclusion

Performance optimization is iterative. Measure first, optimize bottlenecks, then measure again. Focus on user-perceived performance: fast initial load, smooth interactions, and responsive UI.

Most importantly: don't prematurely optimize. Build features first, profile in production-like conditions, then optimize what actually matters to your users.`,
}

async function updateBatch2() {
  console.log('🚀 Starting batch 2 update (5 blogs)...\n')

  for (const [id, content] of Object.entries(BLOG_CONTENTS)) {
    try {
      await db.update(blogs)
        .set({ content })
        .where(eq(blogs.id, Number(id)))

      console.log(`✅ Updated blog ${id}`)
    }
    catch (error) {
      console.error(`❌ Failed to update blog ${id}:`, error)
    }
  }

  console.log('\n🎉 Batch 2 complete! All blogs updated.')
  console.log('Run: npx tsx scripts/check-blogs.ts to verify\n')
  process.exit(0)
}

updateBatch2()
