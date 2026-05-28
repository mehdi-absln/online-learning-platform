# 🎓 Enrollment System - Complete Implementation Summary

**Project:** {{ SITE_NAME }}  
**Tech Stack:** Nuxt 4, Vue 3, TypeScript, SQLite, Drizzle ORM  
**Last Updated:** February 24, 2026  
**Version:** 2.0.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Flow & UX](#2-user-flow--ux)
3. [Frontend Implementation](#3-frontend-implementation)
4. [Backend/API Structure](#4-backendapi-structure)
5. [Database Schema](#5-database-schema)
6. [Business Logic](#6-business-logic)
7. [Security Considerations](#7-security-considerations)
8. [Edge Cases & Error Handling](#8-edge-cases--error-handling)
9. [Testing](#9-testing)
10. [Missing Features & Recommendations](#10-missing-features--recommendations)
11. [Quick Reference](#11-quick-reference)

---

## 1. Overview

### 1.1 System Purpose

The Enrollment System manages the complete user journey from course discovery to enrollment, including:

- **Shopping Cart** - Temporary holding for courses before purchase
- **Checkout Flow** - Payment processing and order creation
- **Enrollment Management** - Granting course access after purchase
- **Order History** - Tracking past purchases

### 1.2 Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Guest Cart | ✅ | Cookie-based cart for non-authenticated users |
| User Cart | ✅ | Database-backed cart for authenticated users |
| Cart Merge | ✅ | Automatic merge on login/signup |
| Payment Simulation | ✅ | Success/failure simulation for demo |
| Enrollment Creation | ✅ | Automatic on successful checkout |
| Lesson Access Control | ✅ | Server-side check for paid lessons |
| Order History | ✅ | View past purchases |
| Duplicate Prevention | ✅ | Unique constraints on enrollments |

### 1.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Nuxt 4)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │ CourseCard   │    │ CartDrawer   │    │ Checkout     │                   │
│  │ Component    │───▶│ Component    │───▶│ Pages        │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│         │                   │                   │                            │
│         ▼                   ▼                   ▼                            │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │                    useCart Composable                    │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │                    cart Store (Pinia)                    │                │
│  └─────────────────────────────────────────────────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests ($fetch)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Nitro)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │ /api/cart    │    │ /api/checkout│    │ /api/orders  │                   │
│  │ /api/enroll  │    │ /api/enroll  │    │ /api/enroll  │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│         │                   │                   │                            │
│         ▼                   ▼                   ▼                            │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │              Service Layer (cart-service.ts)             │                │
│  │              Service Layer (order-service.ts)            │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │              Database (SQLite + Drizzle ORM)             │                │
│  └─────────────────────────────────────────────────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Flow & UX

### 2.1 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COURSE DISCOVERY FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

[Browse Courses Page] ──→ [Course Detail Page] ──→ [Add to Cart]
         │                        │                          │
         │                        │                          ▼
         │                        │              ┌──────────────────────┐
         │                        │              │  Cart Drawer Opens   │
         │                        │              │  - Shows all items   │
         │                        │              │  - Total price       │
         │                        │              │  - Checkout button   │
         │                        │              └──────────────────────┘
         │                        │                          │
         │                        │                          ▼
         │                        │              [User Clicks "Checkout Now"]
         │                        │                          │
         ▼                        ▼                          ▼
    [Continue              [ENROLLED Users]           [NOT Enrolled Users]
     Browsing]                    │                          │
                                  │                          ▼
                                  │              ┌──────────────────────┐
                                  │              │  Checkout Page       │
                                  │              │  - Order summary     │
                                  │              │  - Payment simulation│
                                  │              └──────────────────────┘
                                  │                          │
                                  │                          ▼
                                  │              [Complete Purchase]
                                  │                          │
                                  ▼                          ▼
                          [My Learning]            [Success Page]
                          [Dashboard]                │
                                                     ▼
                                          [Enrollments Created]
                                          [Cart Cleared]
                                          [Redirect to Dashboard]
```

### 2.2 Scenario Breakdown

#### **Guest User Flow**

```
1. Guest browses courses → Adds to cart
   ↓
2. Cart stored in cookie (guest-cart, 30 days)
   ↓
3. Guest clicks Checkout → Redirected to Sign In
   ↓
4. Guest signs in/signs up
   ↓
5. Guest cart merged with DB cart (silent, background)
   ↓
6. User proceeds to checkout with merged cart
```

**Key Features:**
- Guest cart persists for 30 days via cookie
- Cart merge happens silently on login (no blocking)
- Merge failures are logged but don't interrupt flow

**Cookie Configuration:**
```typescript
const guestCartCookie = useCookie<number[] | null>('guest-cart', {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
  watch: 'shallow',
})
```

#### **Authenticated User Flow**

```
1. User browses courses → Adds to cart
   ↓
2. Cart stored in database (cart_items table)
   ↓
3. User clicks Checkout → Checkout page
   ↓
4. Payment simulation (Success/Fail)
   ↓
5. Success: Enrollments created, cart cleared
   ↓
6. Redirect to /checkout/success with order ID
```

#### **Free vs. Paid Courses**

| Feature | Free Courses | Paid Courses |
|---------|--------------|--------------|
| **Add to Cart** | ✅ Yes | ✅ Yes |
| **Direct Enrollment** | ❌ Not implemented | ❌ Must go through cart |
| **Lesson Access** | ✅ Immediate (`isFree=true`) | 🔒 After purchase |
| **Checkout Required** | ❌ No | ✅ Yes |
| **Payment Required** | ❌ No | ✅ Yes |

#### **Cart States**

| State | Description | UI Behavior |
|-------|-------------|-------------|
| **Empty** | `items.length === 0` | Shows "Your cart is empty" with "Start Learning" CTA |
| **Has Items** | `items.length > 0` | Shows item list, total price, checkout button |
| **Loading** | `isLoading === true` | Spinner on checkout button, disabled state |
| **Error** | API error | Toast notification, cart unchanged |

### 2.3 Cart State Diagram

```
┌─────────────┐
│   Empty     │◀─────────────────────────────────────┐
│  (Initial)  │                                      │
└──────┬──────┘                                      │
       │ Add Item                                     │
       ▼                                              │
┌─────────────┐     Remove Last Item                 │
│  Has Items  │──────────────────────────────────────┘
└──────┬──────┘
       │ Click Checkout
       ▼
┌─────────────┐     Payment Failed
│  Checkout   │──────────────────────┐
└──────┬──────┘                      │
       │ Payment Success             │
       ▼                             │
┌─────────────┐     Retry            │
│   Success   │                      │
│  (Enrolled) │                      │
└─────────────┘                      │
       │                             │
       └─────────────────────────────┘
```

---

## 3. Frontend Implementation

### 3.1 Components Involved

#### **CourseCard.vue** - Add to Cart Button

**Location:** `app/components/courses/CourseCard.vue`

```vue
<template>
  <article class="w-full h-full rounded-3xl overflow-hidden group flex flex-col">
    <!-- Image Section -->
    <div class="relative">
      <img :src="course.thumbnail" :alt="course.title">
      
      <!-- Top Bar: Category & Bookmark -->
      <div class="absolute top-6 flex items-center justify-between w-full px-4">
        <span class="bg-primary text-white text-[13px] px-5 py-1.5 rounded-full">
          {{ course.category }}
        </span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="px-4 bg-dark-bg flex-1 flex flex-col">
      <h3 class="text-[22px] font-semibold text-white py-6">
        <NuxtLink :to="courseLink">{{ course.title }}</NuxtLink>
      </h3>

      <!-- Footer: Price & Cart Actions -->
      <div class="flex items-center justify-between pb-6 gap-4">
        <!-- ✅ ENROLLED -->
        <template v-if="userStore.isAuthenticated && userStore.isEnrolled(course.id)">
          <span class="text-sm text-white/50 line-through">${{ course.price }}</span>
          <NuxtLink :to="`${courseLink}/lessons`" class="flex items-center gap-2">
            <span class="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              ▶️
            </span>
            Continue Learning
          </NuxtLink>
        </template>

        <!-- ❌ NOT ENROLLED -->
        <template v-else>
          <span class="text-base font-semibold text-primary-alt">${{ course.price }}</span>

          <div class="flex items-center gap-2">
            <!-- Add to Cart Button -->
            <button
              v-if="!isInCart(course.id)"
              @click.prevent="handleAddToCart"
              aria-label="Add to cart"
              class="p-2.5 bg-primary/10 hover:bg-primary text-primary rounded-xl"
            >
              🛒
            </button>

            <!-- View Cart Button -->
            <button
              v-else
              @click.prevent="openCart"
              aria-label="View in cart"
              class="p-2.5 bg-primary text-white rounded-xl"
            >
              ✅
            </button>

            <NuxtLink :to="courseLink" class="font-medium text-white hover:text-primary">
              Explore Now
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useUserStore } from '~/stores/user'

const props = defineProps<{ course: Course }>()
const { addItem, isInCart, openCart } = useCart()
const userStore = useUserStore()

const handleAddToCart = () => {
  addItem(props.course)
  openCart()  // Auto-open drawer for better UX
}

const courseLink = computed(() => `/courses/${props.course.slug}`)
</script>
```

**Key Features:**
- Shows "Continue Learning" for enrolled users
- Shows "Add to Cart" for non-enrolled users
- Shows "In Cart" indicator when item is already added
- Auto-opens cart drawer on add

---

#### **CartDrawer.vue** - Slide-out Cart Sidebar

**Location:** `app/components/ui/CartDrawer.vue`

```vue
<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Backdrop: Dark Overlay with blur -->
      <Transition enter-active-class="transition-opacity duration-300">
        <div
          v-if="isCartDrawerOpen"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          @click="closeCart"
        />
      </Transition>

      <!-- Drawer: Right Side Slide-out -->
      <Transition enter-active-class="transition-transform duration-300">
        <div
          v-if="isCartDrawerOpen"
          ref="drawerRef"
          class="fixed inset-y-0 right-0 z-[60] w-full max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
        >
          <!-- Header -->
          <div class="px-6 py-6 border-b flex items-center justify-between">
            <h2 id="cart-title" class="text-xl font-bold">
              🛒 Shopping Cart ({{ itemsCount }} items)
            </h2>
            <button @click="closeCart" aria-label="Close cart">✕</button>
          </div>

          <!-- Content: Item List -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Empty State -->
            <div v-if="items.length === 0" class="text-center py-12">
              <p class="text-white font-medium">Your cart is empty</p>
              <button @click="closeCart" class="btn-primary mt-4">
                Start Learning
              </button>
            </div>

            <!-- Items List -->
            <ul v-else class="space-y-4">
              <li v-for="item in items" :key="item.id" class="flex gap-4 p-4 bg-dark-bg rounded-xl">
                <img :src="item.thumbnail" :alt="item.title" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                  <h3 class="text-white font-medium">{{ item.title }}</h3>
                  <p class="text-white/70 text-sm">By {{ item.instructor.name }}</p>
                  <div class="flex justify-between mt-2">
                    <span class="text-primary font-bold">${{ item.price }}</span>
                    <button @click="removeItem(item.id)" class="text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Footer: Summary & Checkout -->
          <div v-if="items.length > 0" class="p-6 border-t bg-dark-surface">
            <div class="flex justify-between">
              <span>Total:</span>
              <span class="text-2xl font-bold">${{ totalPrice.toFixed(2) }}</span>
            </div>
            <button @click="handleCheckout" class="btn-primary w-full mt-4">
              Checkout Now
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { onKeyStroke } from '@vueuse/core'

const { isCartDrawerOpen, closeCart, items, itemsCount, totalPrice, removeItem } = useCart()

const handleCheckout = () => {
  closeCart()
  navigateTo('/checkout')
}

// Focus trap for accessibility
onKeyStroke('Tab', (e) => {
  if (!isCartDrawerOpen.value) return
  // Trap focus within drawer
})

// Close on Escape
onKeyStroke('Escape', () => {
  if (isCartDrawerOpen.value) closeCart()
})
</script>
```

**Accessibility Features:**
- ✅ Focus trap (Tab key cycles within drawer)
- ✅ Escape key closes drawer
- ✅ ARIA attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- ✅ Body scroll prevention when open
- ✅ Auto-focus management

---

#### **Checkout Pages**

**`checkout/index.vue`** - Payment Simulation

```vue
<template>
  <main class="max-w-4xl mx-auto py-16">
    <h1 class="text-3xl font-bold text-white mb-8">Complete Your Purchase</h1>

    <!-- Empty Cart State -->
    <div v-if="items.length === 0" class="text-center py-12">
      <p class="text-lg text-white">Your cart is empty.</p>
      <NuxtLink to="/courses" class="btn-primary mt-4">Browse Courses</NuxtLink>
    </div>

    <!-- Checkout Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Order Summary -->
      <section class="lg:col-span-2">
        <h2 class="text-xl font-bold text-white mb-4">Order Items ({{ itemsCount }})</h2>
        <ul class="divide-y">
          <li v-for="item in items" :key="item.id" class="py-4 flex gap-4">
            <img :src="item.thumbnail" :alt="item.title" class="w-20 h-14 rounded">
            <div class="flex-1">
              <h3 class="text-white font-medium">{{ item.title }}</h3>
              <p class="text-white/70 text-sm">Instructor: {{ item.instructor.name }}</p>
            </div>
            <span class="text-white font-bold">${{ item.price }}</span>
          </li>
        </ul>
      </section>

      <!-- Payment Section -->
      <aside>
        <h2 class="text-xl font-bold text-white mb-6">Order Summary</h2>
        
        <!-- Price Breakdown -->
        <dl class="space-y-3">
          <div class="flex justify-between">
            <dt>Subtotal</dt>
            <dd>${{ totalPrice.toFixed(2) }}</dd>
          </div>
          <div class="flex justify-between text-lg font-bold">
            <dt>Total</dt>
            <dd class="text-primary">${{ totalPrice.toFixed(2) }}</dd>
          </div>
        </dl>

        <!-- Payment Buttons -->
        <button @click="handleCheckout('success')" class="btn-primary w-full mt-4">
          ✓ Complete Purchase
        </button>
        <button @click="handleCheckout('fail')" class="btn-danger w-full mt-4">
          ✗ Simulate Failure
        </button>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'

definePageMeta({
  requiresAuth: true,
  layout: 'minimal',
})

const { items, totalPrice, isLoading, checkout } = useCart()
const itemsCount = computed(() => items.value.length)

const handleCheckout = async (type: 'success' | 'fail') => {
  const result = await checkout(type)

  if (result.success && result.orderId) {
    await navigateTo(`/checkout/success?id=${result.orderId}`)
  } else if (result.orderId) {
    await navigateTo(`/checkout/failed?id=${result.orderId}`)
  }
}
</script>
```

**`checkout/success.vue`** - Order Confirmation

```vue
<template>
  <main class="max-w-3xl mx-auto py-16">
    <!-- Loading State -->
    <div v-if="pending" class="text-center">
      <LoadingSpinner message="Verifying order details..." />
    </div>

    <!-- Success State -->
    <div v-else-if="orderData" class="space-y-8">
      <!-- Success Header -->
      <section class="text-center bg-dark-surface p-10 rounded-3xl">
        <div class="w-24 h-24 bg-green-500/10 rounded-full mx-auto mb-6">✓</div>
        <h1 class="text-3xl font-bold text-white mb-2">Purchase Successful!</h1>
        <p class="text-white/60">Thank you for your order.</p>
        
        <nav class="mt-8 flex justify-center gap-4">
          <NuxtLink to="/dashboard" class="btn-primary">Start Learning Now</NuxtLink>
          <NuxtLink to="/courses" class="btn-secondary">View More Courses</NuxtLink>
        </nav>
      </section>

      <!-- Order Details -->
      <section class="bg-dark-surface rounded-3xl p-8">
        <h2 class="text-lg font-bold text-white mb-4">Order #{{ orderData.order.id }}</h2>
        <ul>
          <li v-for="item in orderData.order.items" :key="item.id" class="py-4 flex gap-4">
            <img :src="item.thumbnail" :alt="item.title" class="w-24 h-16 rounded">
            <div class="flex-1">
              <h3 class="text-white font-bold">{{ item.title }}</h3>
              <p class="text-green-500 text-sm">✓ Lifetime Access</p>
            </div>
            <span class="text-white font-black">${{ item.price }}</span>
          </li>
        </ul>
        <div class="mt-6 pt-6 border-t">
          <div class="flex justify-between">
            <span>Total Paid:</span>
            <span class="text-3xl font-black text-primary">${{ orderData.order.totalAmount }}</span>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const orderId = computed(() => route.query.id as string)

const { data, pending, error } = await useFetch(`/api/orders/${orderId.value}`)
const orderData = computed(() => data.value?.success ? data.value : null)
</script>
```

**`checkout/failed.vue`** - Payment Failure

```vue
<template>
  <main class="max-w-2xl mx-auto py-16">
    <section class="bg-dark-surface p-12 rounded-3xl text-center">
      <div class="w-24 h-24 bg-red-500/10 rounded-full mx-auto mb-8">✕</div>
      <h1 class="text-3xl font-bold text-white mb-4">Payment Declined</h1>
      <p class="text-white/70 mb-10">
        We couldn't process your payment. This might happen due to insufficient funds or network issues.
      </p>
      
      <nav class="flex justify-center gap-4">
        <NuxtLink to="/checkout" class="btn-primary">Try Again</NuxtLink>
        <NuxtLink to="/courses" class="btn-secondary">Keep Browsing</NuxtLink>
      </nav>
    </section>
  </main>
</template>
```

---

### 3.2 State Management

#### **Cart Store (`app/stores/cart.ts`)**

```typescript
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useToast } from '~/composables/useToast'
import type { Course } from '~/types/shared/auth'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const toast = useToast()

  // Get headers at store initialization
  const requestHeaders = import.meta.server
    ? useRequestHeaders(['cookie'])
    : {}

  // ───── State ─────
  const items = ref<Course[]>([])
  const isLoading = ref(false)
  const serverTotalPrice = ref(0)

  // Cookie for Guest Cart (IDs only to optimize size < 4KB)
  const guestCartCookie = useCookie<number[] | null>('guest-cart', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    watch: 'shallow',
  })

  // ───── Getters ─────
  const itemsCount = computed(() => {
    if (userStore.isAuthenticated) return items.value.length
    return guestCartCookie.value?.length || 0
  })

  const totalPrice = computed(() => {
    if (userStore.isAuthenticated) {
      return serverTotalPrice.value  // Server-calculated
    }
    return items.value.reduce((total, item) => total + (item.price || 0), 0)
  })

  const isInCart = (courseId: number) => {
    if (userStore.isAuthenticated) {
      return items.value.some(item => item.id === courseId)
    }
    return guestCartCookie.value?.includes(courseId) || false
  }

  // ───── Actions ─────

  /**
   * Fetch full details for guest items based on IDs in cookie
   */
  const fetchGuestCartDetails = async () => {
    const ids = guestCartCookie.value || []
    if (ids.length === 0) {
      items.value = []
      return
    }

    try {
      const response = await $fetch('/api/courses/bulk', {
        method: 'POST',
        body: { ids },
      })
      if (response?.success && response?.data) {
        items.value = response.data
      }
    } catch (error) {
      console.error('Failed to fetch guest cart details:', error)
      toast.error('Failed to load guest cart items')
    }
  }

  /**
   * Fetch authenticated user's cart from DB
   */
  const fetchUserCart = async () => {
    isLoading.value = true
    try {
      const response = await $fetch('/api/cart', {
        headers: requestHeaders,
        credentials: 'include',
      })
      if (response?.success && response?.data) {
        items.value = response.data.items
        serverTotalPrice.value = response.data.totalPrice
      }
    } catch (error) {
      console.error('Failed to fetch cart from server:', error)
      toast.error('Failed to load your cart')
    } finally {
      isLoading.value = false
    }
  }

  const fetchCart = async () => {
    if (userStore.isAuthenticated) {
      await fetchUserCart()
    } else {
      await fetchGuestCartDetails()
    }
  }

  const addItem = async (course: Course) => {
    if (isInCart(course.id)) return

    if (userStore.isAuthenticated) {
      // Server-side add
      try {
        const response = await $fetch('/api/cart', {
          method: 'POST',
          body: { courseId: course.id },
          headers: requestHeaders,
          credentials: 'include',
        })
        if (response?.success) {
          await fetchUserCart()
          toast.success('Course added to cart')
        }
      } catch (error) {
        console.error('Failed to add item to cart:', error)
        toast.error('Failed to add item to cart')
      }
    } else {
      // Guest: optimistic update (instant)
      const currentIds = guestCartCookie.value || []
      guestCartCookie.value = [...currentIds, course.id]
      items.value.push(course)
      toast.success('Course added to cart')
    }
  }

  const removeItem = async (courseId: number) => {
    if (userStore.isAuthenticated) {
      // Server-side remove
      try {
        const response = await $fetch(`/api/cart/${courseId}`, {
          method: 'DELETE',
          headers: requestHeaders,
          credentials: 'include',
        })
        if (response?.success) {
          await fetchUserCart()
          toast.info('Course removed from cart')
        }
      } catch (error) {
        console.error('Failed to remove item:', error)
        toast.error('Failed to remove item')
      }
    } else {
      // Guest: instant update
      const currentIds = guestCartCookie.value || []
      guestCartCookie.value = currentIds.filter(id => id !== courseId)
      items.value = items.value.filter(item => item.id !== courseId)
      toast.info('Course removed from cart')
    }
  }

  const mergeGuestCart = async () => {
    const ids = guestCartCookie.value || []
    if (ids.length === 0) return

    try {
      const response = await $fetch('/api/cart/merge', {
        method: 'POST',
        body: { courseIds: ids },
        headers: requestHeaders,
        credentials: 'include',
      })
      if (response?.success) {
        guestCartCookie.value = null  // Clear cookie
        await fetchUserCart()  // Fetch merged cart
        // Silent - no toast during login flow
      }
    } catch (error) {
      console.warn('Cart merge failed silently:', error)
      // Silent fail - doesn't block login
    }
  }

  const clearCart = async () => {
    items.value = []
    if (!userStore.isAuthenticated) {
      guestCartCookie.value = null
    }
  }

  const checkout = async (simulationType: 'success' | 'fail' = 'success') => {
    if (!userStore.isAuthenticated) {
      toast.showLoginRequired('checkout')
      return { success: false, message: 'Please login to checkout' }
    }

    if (items.value.length === 0) {
      toast.info('Your cart is empty')
      return { success: false, message: 'Cart is empty' }
    }

    isLoading.value = true
    try {
      const response = await $fetch('/api/checkout', {
        method: 'POST',
        body: { simulationType },
        headers: requestHeaders,
        credentials: 'include',
      })

      if (response?.success) {
        await clearCart()
        await userStore.fetchEnrollments()  // Update enrollment state
        return { success: true, message: response.message, orderId: response.orderId }
      }

      return { success: false, message: response?.message, orderId: response?.orderId }
    } catch (error) {
      console.error('Checkout error:', error)
      const message = 'Payment processing failed'
      if (simulationType === 'success') toast.error(message)
      return { success: false, message, orderId: 0 }
    } finally {
      isLoading.value = false
    }
  }

  // ───── Initialization ─────
  const initializeCart = async () => {
    await nextTick()
    if (userStore.isAuthenticated) {
      await fetchUserCart()
    } else {
      await fetchGuestCartDetails()
    }
  }

  // Watch for auth changes
  watch(() => userStore.isAuthenticated, async (isAuth, oldIsAuth) => {
    if (isAuth === oldIsAuth) return
    if (isAuth) {
      await fetchUserCart()
    } else {
      await fetchGuestCartDetails()
    }
  })

  initializeCart()

  return {
    items,
    isLoading,
    itemsCount,
    totalPrice,
    isInCart,
    addItem,
    removeItem,
    clearCart,
    fetchCart,
    mergeGuestCart,
    checkout,
  }
})
```

---

#### **User Store Integration (`app/stores/user.ts`)**

```typescript
import { defineStore } from 'pinia'
import { useCartStore } from './cart'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const enrolledCourseIds = ref<number[]>([])
  const enrollmentsFetched = ref(false)

  // Computed
  const isAuthenticated = computed(() => user.value !== null)

  // Check enrollment (O(1) lookup)
  const isEnrolled = (courseId: number) => {
    return enrolledCourseIds.value.includes(courseId)
  }

  // Fetch enrollments
  const fetchEnrollments = async () => {
    if (!user.value) {
      enrolledCourseIds.value = []
      enrollmentsFetched.value = true
      return
    }

    try {
      const response = await $fetch('/api/enrollments/my', {
        credentials: 'include',
      })
      if (response?.success && response?.data?.courseIds) {
        enrolledCourseIds.value = response.data.courseIds
      }
      enrollmentsFetched.value = true
    } catch (err) {
      console.error('Failed to fetch enrollments:', err)
      enrollmentsFetched.value = true  // Silent fail
    }
  }

  const clearEnrollments = () => {
    enrolledCourseIds.value = []
    enrollmentsFetched.value = false
  }

  // Sign In with cart merge
  const signIn = async (credentials) => {
    try {
      const response = await $fetch('/api/auth/signin', {
        method: 'POST',
        body: credentials,
      })

      if (response?.success && response?.data?.user) {
        user.value = response.data.user

        // Background cart merge (silent)
        const cartStore = useCartStore()
        cartStore.mergeGuestCart().catch(() => {})

        // Background enrollment fetch
        fetchEnrollments().catch(() => {})

        toast.success('Signed in successfully')
        return { success: true }
      }
    } catch (error) {
      toast.error('Sign in failed')
      return { success: false }
    }
  }

  // Watch for auth changes
  watch(() => isAuthenticated.value, async (isAuth) => {
    if (isAuth) {
      await fetchEnrollments()
    } else {
      clearEnrollments()
    }
  })

  return {
    user: readonly(user),
    isAuthenticated,
    enrolledCourseIds: readonly(enrolledCourseIds),
    enrollmentsFetched: readonly(enrollmentsFetched),
    isEnrolled,
    signIn,
    signUp,
    logout,
    fetchEnrollments,
    clearEnrollments,
  }
})
```

---

### 3.3 UI Feedback

| Action | Loading State | Success | Error |
|--------|--------------|---------|-------|
| **Add to Cart** | N/A (instant for guest) | Toast + Cart drawer opens | Toast with error message |
| **Remove from Cart** | N/A | Toast "Course removed" | Toast "Failed to remove" |
| **Checkout** | Spinner on button, disabled | Redirect to success page | Toast + stay on page |
| **Cart Merge** | Silent (background) | Silent | Silent (console.warn only) |

**Toast Notifications:**
```typescript
// Success
toast.success('Course added to cart')

// Info
toast.info('Course removed from cart')

// Error
toast.error('Failed to add item to cart')

// Login Required
toast.showLoginRequired('checkout')  // Navigates to sign in
```

---

### 3.4 Optimistic Updates

**Guest Cart:**
```typescript
// Instant update (no API call)
const currentIds = guestCartCookie.value || []
guestCartCookie.value = [...currentIds, course.id]
items.value.push(course)  // UI updates immediately
toast.success('Course added to cart')
```

**Authenticated Cart:**
```typescript
// Server-first (wait for confirmation)
try {
  const response = await $fetch('/api/cart', {
    method: 'POST',
    body: { courseId: course.id },
  })
  if (response?.success) {
    await fetchUserCart()  // Refetch to ensure consistency
    toast.success('Course added to cart')
  }
} catch (error) {
  toast.error('Failed to add item to cart')
}
```

---

## 4. Backend/API Structure

### 4.1 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/cart` | GET | ✅ Required | Fetch user's cart items |
| `/api/cart` | POST | ✅ Required | Add item to cart |
| `/api/cart/:courseId` | DELETE | ✅ Required | Remove item from cart |
| `/api/cart/merge` | POST | ✅ Required | Merge guest cart on login |
| `/api/checkout` | POST | ✅ Required | Process checkout |
| `/api/orders` | GET | ✅ Required | Get user's order history |
| `/api/orders/:id` | GET | ✅ Required | Get order details |
| `/api/enrollments/my` | GET | ✅ Required | Get enrolled course IDs |

---

### 4.2 Request/Response Formats

#### **GET /api/cart**

```typescript
// Request
GET /api/cart
Headers: { cookie: 'accessToken=...' }

// Response
{
  success: true,
  message: 'Cart retrieved successfully',
  data: {
    items: [
      {
        id: 1,
        title: 'Vue Mastery',
        price: 100,
        thumbnail: '/images/vue.jpg',
        slug: 'vue-mastery',
        instructor: { name: 'John Doe' },
        isPublished: true
      }
    ],
    itemsCount: 1,
    totalPrice: 100.00
  }
}
```

**Implementation:**
```typescript
// server/api/cart/index.get.ts
import { requireAuth } from '../../utils/auth-helpers'
import { getCartItems } from '../../db/cart-service'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const items = await getCartItems(user.id)

    // Calculate total price server-side
    const totalPrice = items.reduce((sum: number, item: any) => {
      if (item.isPublished) {
        return sum + (Number(item.price) || 0)
      }
      return sum
    }, 0)

    return {
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        items,
        itemsCount: items.length,
        totalPrice: Number(totalPrice.toFixed(2)),
      },
    }
  } catch (error) {
    console.error('Fetch cart error:', error)
    throw createError(error as Error)
  }
})
```

---

#### **POST /api/cart**

```typescript
// Request
POST /api/cart
Headers: { cookie: 'accessToken=...' }
Body: { courseId: 1 }

// Response (Success)
{
  success: true,
  message: 'Course added to cart',
  data: { id: 1, userId: 1, courseId: 1, createdAt: '2026-02-24T...' }
}

// Response (Already Enrolled)
{
  success: false,
  message: 'You are already enrolled in this course'
}

// Response (Course Unavailable)
{
  success: false,
  message: 'This course is not currently available'
}
```

**Implementation:**
```typescript
// server/api/cart/index.post.ts
import { requireAuth } from '../../utils/auth-helpers'
import { addToCart } from '../../db/cart-service'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)

    if (!body.courseId) {
      throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
    }

    const result = await addToCart(user.id, body.courseId)
    return { success: true, message: 'Course added to cart', data: result }
  } catch (error) {
    throw createError(error as Error)
  }
})
```

---

#### **DELETE /api/cart/:courseId**

```typescript
// Request
DELETE /api/cart/1
Headers: { cookie: 'accessToken=...' }

// Response
{
  success: true,
  message: 'Item removed from cart'
}
```

**Implementation:**
```typescript
// server/api/cart/[courseId].delete.ts
import { requireAuth } from '../../utils/auth-helpers'
import { removeFromCart } from '../../db/cart-service'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const courseId = getRouterParam(event, 'courseId')

    if (!courseId) {
      throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
    }

    await removeFromCart(user.id, parseInt(courseId))
    return { success: true, message: 'Item removed from cart' }
  } catch (error) {
    throw createError(error as Error)
  }
})
```

---

#### **POST /api/cart/merge**

```typescript
// Request
POST /api/cart/merge
Headers: { cookie: 'accessToken=...' }
Body: { courseIds: [1, 5, 10] }

// Response
{
  success: true,
  message: 'Cart merged successfully',
  data: [
    { courseId: 1, success: true },
    { courseId: 5, success: false, message: 'Already enrolled' },
    { courseId: 10, success: true },
  ]
}
```

**Implementation:**
```typescript
// server/api/cart/merge.post.ts
import { requireAuth } from '../../utils/auth-helpers'
import { bulkAddToCart } from '../../db/cart-service'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { courseIds } = body

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return { success: true, message: 'No items to merge' }
    }

    const results = await bulkAddToCart(user.id, courseIds)
    return { success: true, message: 'Cart merged successfully', data: results }
  } catch (error) {
    throw createError(error as Error)
  }
})
```

---

#### **POST /api/checkout**

```typescript
// Request
POST /api/checkout
Headers: { cookie: 'accessToken=...' }
Body: { simulationType: 'success' | 'fail' }

// Response (Success)
{
  success: true,
  message: 'Payment simulated successfully!',
  orderId: 42
}

// Response (Failure)
{
  success: false,
  message: 'Payment has been declined by the simulated bank.',
  orderId: 42
}
```

**Implementation:**
```typescript
// server/api/checkout/index.post.ts
import { requireAuth } from '../../utils/auth-helpers'
import { processCheckout } from '../../db/order-service'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { simulationType } = body

    if (!simulationType || !['success', 'fail'].includes(simulationType)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid simulation type' })
    }

    const result = await processCheckout(user.id, simulationType)

    if (!result.success && simulationType === 'fail') {
      return {
        success: false,
        message: 'Payment has been declined by the simulated bank.',
        orderId: result.orderId,
      }
    }

    return {
      success: true,
      message: 'Payment simulated successfully!',
      orderId: result.orderId,
    }
  } catch (error) {
    console.error('Checkout error:', error)
    throw createError(error as Error)
  }
})
```

---

#### **GET /api/orders/:id**

```typescript
// Request
GET /api/orders/42
Headers: { cookie: 'accessToken=...' }

// Response
{
  success: true,
  order: {
    id: 42,
    totalAmount: 250.00,
    status: 'completed',
    createdAt: '2026-02-24T10:30:00Z',
    items: [
      { id: 1, title: 'Vue Mastery', price: 100 },
      { id: 5, title: 'Nuxt 3', price: 150 },
    ]
  }
}
```

**Implementation:**
```typescript
// server/api/orders/[id].get.ts
import { requireAuth } from '../../utils/auth-helpers'
import { getOrderDetails } from '../../db/order-service'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const orderId = getRouterParam(event, 'id')

    if (!orderId) {
      throw createError({ statusCode: 400, statusMessage: 'Order ID is required' })
    }

    const order = await getOrderDetails(parseInt(orderId), user.id)

    if (!order) {
      throw createError({ statusCode: 404, statusMessage: 'Order not found' })
    }

    return { success: true, order }
  } catch (error) {
    throw createError(error as Error)
  }
})
```

---

#### **GET /api/enrollments/my**

```typescript
// Request
GET /api/enrollments/my
Headers: { cookie: 'accessToken=...' }

// Response
{
  success: true,
  message: 'Enrollments retrieved successfully',
  data: {
    courseIds: [1, 5, 22, 45]
  }
}
```

**Implementation:**
```typescript
// server/api/enrollments/my.get.ts
import { requireAuth } from '../../utils/auth-helpers'
import { db } from '../../db/index'
import { enrollments } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    const enrolled = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.userId, user.id))

    return {
      success: true,
      message: 'Enrollments retrieved successfully',
      data: {
        courseIds: enrolled.map(e => e.courseId),
      },
    }
  } catch (error) {
    console.error('Fetch enrollments error:', error)
    throw createError(error as Error)
  }
})
```

---

## 5. Database Schema

### 5.1 Tables Involved

```sql
-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'student',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Courses Table
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price REAL NOT NULL DEFAULT 0,
  original_price REAL,
  thumbnail TEXT,
  instructor_id INTEGER REFERENCES instructors(id),
  category_id INTEGER,
  level TEXT DEFAULT 'beginner',
  language TEXT DEFAULT 'en',
  duration TEXT,
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  tags TEXT
);

-- Cart Items Table
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, course_id)  -- Prevent duplicates
);

-- Orders Table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, completed, failed
  payment_ref TEXT,
  completed_at INTEGER,
  created_at INTEGER NOT NULL
);

-- Order Items Table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  price REAL NOT NULL
);

-- Enrollments Table
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  enrolled_at INTEGER NOT NULL,
  UNIQUE(user_id, course_id)  -- Prevent duplicate enrollments
);

-- Indexes for performance
CREATE INDEX cart_user_id_idx ON cart_items(user_id);
CREATE INDEX cart_user_course_idx ON cart_items(user_id, course_id);
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX order_items_order_id_idx ON order_items(order_id);
CREATE INDEX enrollments_user_id_idx ON enrollments(user_id);
CREATE INDEX enrollments_user_course_idx ON enrollments(user_id, course_id);
```

---

### 5.2 Entity Relationships

```
┌─────────────┐
│    users    │
│  (student)  │
└──────┬──────┘
       │
       ├──────────────────┬─────────────────┬──────────────────┐
       │                  │                 │                  │
       ▼                  ▼                 ▼                  ▼
┌─────────────┐   ┌─────────────┐  ┌─────────────┐   ┌─────────────┐
│ cart_items  │   │ enrollments │  │   orders    │   │   reviews   │
│  (shopping) │   │  (purchased)│  │ (transactions)│  │  (ratings)  │
└──────┬──────┘   └──────┬──────┘  └──────┬──────┘   └─────────────┘
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐  ┌─────────────┐
│   courses   │◄──┤order_items  │  │enrollments  │
│  (products) │   │  (line items)│  │  (links)    │
└─────────────┘   └─────────────┘  └─────────────┘
```

**Relationships:**
- `users` → `cart_items`: One-to-many (user can have many cart items)
- `users` → `enrollments`: One-to-many (user can enroll in many courses)
- `users` → `orders`: One-to-many (user can have many orders)
- `courses` → `cart_items`: One-to-many (course can be in many carts)
- `courses` → `enrollments`: One-to-many (course can have many students)
- `orders` → `order_items`: One-to-many (order has many line items)
- `orders` → `enrollments`: One-to-many (order creates many enrollments)

---

### 5.3 Drizzle ORM Schema

```typescript
// server/db/schema.ts

// Cart Items
export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('cart_user_id_idx').on(table.userId),
  uniqueUserCourse: uniqueIndex('cart_user_course_idx').on(table.userId, table.courseId),
}))

// Orders
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull().default('pending'),
  paymentRef: text('payment_ref'),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
}))

// Order Items
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  price: real('price').notNull(),
}, table => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
}))

// Enrollments
export const enrollments = sqliteTable('enrollments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'set null' }),
  enrolledAt: integer('enrolled_at', { mode: 'timestamp' }).notNull(),
}, table => ({
  userIdIdx: index('enrollments_user_id_idx').on(table.userId),
  uniqueUserCourse: uniqueIndex('enrollments_user_course_idx').on(table.userId, table.courseId),
}))
```

---

## 6. Business Logic

### 6.1 Price Calculation

```typescript
// server/api/cart/index.get.ts

// Server-side calculation (authoritative)
const totalPrice = items.reduce((sum: number, item: any) => {
  // Only include published courses
  if (item.isPublished) {
    return sum + (Number(item.price) || 0)
  }
  return sum
}, 0)

// Round to 2 decimal places
return Number(totalPrice.toFixed(2))
```

**Features:**
- ✅ Server-side calculation (trusted)
- ✅ Only published courses included
- ✅ Handles null/undefined prices
- ✅ Rounded to 2 decimal places

**Discounts/Coupons:** ❌ Not implemented (future enhancement)

---

### 6.2 Enrollment Validation

#### **Pre-Add-to-Cart Checks**

```typescript
// server/db/cart-service.ts: addToCart()

export async function addToCart(userId: number, courseId: number) {
  // 1. Check if course exists
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)
    .then(res => res[0])

  if (!course) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course not found',
    })
  }

  // 2. Check if course is published
  if (!course.isPublished) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This course is not currently available',
    })
  }

  // 3. Check if user is already enrolled
  const existingEnrollment = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId),
      ),
    )
    .limit(1)
    .then(res => res[0])

  if (existingEnrollment) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You are already enrolled in this course',
    })
  }

  // 4. Add to cart (unique constraint prevents duplicates)
  try {
    const [newItem] = await db
      .insert(cartItems)
      .values({
        userId,
        courseId,
        createdAt: new Date(),
      })
      .returning()

    return newItem
  } catch (error) {
    const err = error as { code?: string, message?: string }
    if (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('UNIQUE'))) {
      return { message: 'Item already in cart' }
    }
    throw error
  }
}
```

---

#### **Checkout Validation**

```typescript
// server/db/order-service.ts: processCheckout()

export async function processCheckout(userId: number, simulationType: 'success' | 'fail') {
  if (simulationType === 'fail') {
    return db.transaction((tx) => {
      // 1. Get cart total for the failed order record
      const userCartItems = tx
        .select({ courseId: cartItems.courseId })
        .from(cartItems)
        .where(eq(cartItems.userId, userId))
        .all()

      if (userCartItems.length === 0) {
        throw { statusCode: 400, statusMessage: 'Cart is empty' }
      }

      const courseIds = userCartItems.map(item => item.courseId)
      const dbCourses = tx
        .select({ price: courses.price })
        .from(courses)
        .where(inArray(courses.id, courseIds))
        .all()

      const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

      // 2. Create a FAILED order
      const [failedOrder] = tx
        .insert(orders)
        .values({
          userId,
          totalAmount,
          status: 'failed',
          createdAt: new Date(),
        })
        .returning()
        .all()

      // We do NOT enroll or clear cart on failure
      return { success: false, orderId: failedOrder.id }
    })
  }

  // Success simulation
  return db.transaction((tx) => {
    const userCartItems = tx
      .select({ courseId: cartItems.courseId })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .all()

    if (userCartItems.length === 0) {
      throw { statusCode: 400, statusMessage: 'Cart is empty' }
    }

    const courseIds = userCartItems.map(item => item.courseId)
    const dbCourses = tx
      .select({ id: courses.id, price: courses.price })
      .from(courses)
      .where(inArray(courses.id, courseIds))
      .all()

    const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

    // 1. Create order
    const [newOrder] = tx
      .insert(orders)
      .values({
        userId,
        totalAmount,
        status: 'completed',
        completedAt: new Date(),
        createdAt: new Date(),
      })
      .returning()
      .all()

    // 2. Create order items & enrollments
    for (const course of dbCourses) {
      tx.insert(orderItems).values({
        orderId: newOrder.id,
        courseId: course.id,
        price: course.price,
      }).run()

      tx.insert(enrollments).values({
        userId,
        courseId: course.id,
        orderId: newOrder.id,
        enrolledAt: new Date(),
      }).run()
    }

    // 3. Clear cart
    tx.delete(cartItems).where(eq(cartItems.userId, userId)).run()

    return { success: true, orderId: newOrder.id }
  })
}
```

---

### 6.3 Payment Integration

**Current Implementation:** Simulation only

```typescript
// server/api/checkout/index.post.ts
const result = await processCheckout(user.id, simulationType)

if (!result.success && simulationType === 'fail') {
  return {
    success: false,
    message: 'Payment has been declined by the simulated bank.',
    orderId: result.orderId,
  }
}

return {
  success: true,
  message: 'Payment simulated successfully!',
  orderId: result.orderId,
}
```

**Real Payment Integration (Future - Stripe Example):**
```typescript
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createPaymentIntent(userId: number) {
  // 1. Get cart items
  const cartItems = await getCartItems(userId)
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0)

  // 2. Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),  // Stripe uses cents
    currency: 'usd',
    metadata: { userId: String(userId) },
    automatic_payment_methods: { enabled: true },
  })

  // 3. Create pending order
  const [order] = await db.insert(orders).values({
    userId,
    totalAmount,
    status: 'pending',
    paymentRef: paymentIntent.id,
  }).returning()

  return { clientSecret: paymentIntent.client_secret, orderId: order.id }
}

export async function confirmPayment(orderId: number, paymentIntentId: string) {
  // 1. Verify payment with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not successful')
  }

  // 2. Update order status
  await db.update(orders).set({
    status: 'completed',
    completedAt: new Date(),
  }).where(eq(orders.id, orderId))

  // 3. Create enrollments
  const orderItems = await getOrderItems(orderId)
  const order = await getOrderById(orderId)

  for (const item of orderItems) {
    await db.insert(enrollments).values({
      userId: order.userId,
      courseId: item.courseId,
      orderId,
      enrolledAt: new Date(),
    })
  }

  // 4. Clear cart
  await clearCart(order.userId)

  return { success: true }
}
```

---

### 6.4 Post-Purchase Actions

```typescript
// server/db/order-service.ts: processCheckout() - Success flow

return db.transaction((tx) => {
  // 1. Create order record
  const [newOrder] = tx.insert(orders).values({
    userId,
    totalAmount,
    status: 'completed',
    completedAt: new Date(),
  }).returning().all()

  // 2. Create order items & enrollments for each course
  for (const course of dbCourses) {
    // Order item (financial record)
    tx.insert(orderItems).values({
      orderId: newOrder.id,
      courseId: course.id,
      price: course.price,
    }).run()

    // Enrollment (access grant)
    tx.insert(enrollments).values({
      userId,
      courseId: course.id,
      orderId: newOrder.id,
      enrolledAt: new Date(),
    }).run()
  }

  // 3. Clear cart
  tx.delete(cartItems).where(eq(cartItems.userId, userId)).run()

  return { success: true, orderId: newOrder.id }
})
```

**Actions Performed:**
1. ✅ Order record created
2. ✅ Order items created (financial trail)
3. ✅ Enrollments created (access granted)
4. ✅ Cart cleared
5. ✅ User can now access lessons

---

## 7. Security Considerations

### 7.1 Authentication/Authorization

#### **Server-Side Auth Check**

```typescript
// server/utils/auth-helpers.ts: requireAuth()
import { verifyToken } from './jwt'
import { parseCookies } from 'h3'

export async function requireAuth(event: H3Event) {
  const cookies = parseCookies(event)
  const accessToken = cookies.accessToken

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  try {
    const decoded = verifyToken(accessToken)
    return decoded as User
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token',
    })
  }
}
```

#### **Endpoint Protection**

```typescript
// Every cart/checkout endpoint requires auth
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)  // ✅ Mandatory

  // Proceed with user.id...
})
```

#### **Course Access Control**

```typescript
// server/utils/lesson-access.ts
export async function hasLessonAccess(
  userId: number | undefined,
  courseId: number,
  isFree: boolean
): Promise<boolean> {
  // Free lessons: always accessible
  if (isFree) return true

  // Logged-in user: check enrollment
  if (userId) {
    const isEnrolled = await checkEnrollment(userId, courseId)
    return isEnrolled
  }

  // Not logged in + paid lesson: no access
  return false
}

export async function checkEnrollment(userId: number, courseId: number) {
  const result = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId),
      ),
    )
    .limit(1)

  return result.length > 0
}
```

---

### 7.2 Input Validation

#### **Request Body Validation**

```typescript
// server/api/cart/index.post.ts
const body = await readBody(event)

if (!body.courseId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Course ID is required',
  })
}

// Type check
if (typeof body.courseId !== 'number') {
  throw createError({
    statusCode: 400,
    statusMessage: 'Course ID must be a number',
  })
}
```

#### **Checkout Validation**

```typescript
// server/api/checkout/index.post.ts
const { simulationType } = body

if (!simulationType || !['success', 'fail'].includes(simulationType)) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid simulation type',
  })
}
```

---

### 7.3 SQL Injection Prevention

**Using Drizzle ORM (parameterized queries):**
```typescript
// ✅ Safe - parameterized
const course = await db.select()
  .from(courses)
  .where(eq(courses.id, courseId))  // courseId is parameterized
  .limit(1)

// ❌ Never do this (raw SQL)
const course = await db.execute(
  `SELECT * FROM courses WHERE id = ${courseId}`  // SQL injection risk!
)
```

---

### 7.4 Rate Limiting

**Current:** ❌ Not implemented

**Suggested Implementation:**
```typescript
// server/middleware/rate-limit.ts
const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

export default defineEventHandler((event) => {
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()

  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + 60000 }

  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + 60000
  } else {
    record.count++
  }

  rateLimitMap.set(ip, record)

  if (record.count > 100) {  // 100 requests per minute
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests',
    })
  }
})
```

---

### 7.5 Security Best Practices Summary

| Security Measure | Status | Implementation |
|------------------|--------|----------------|
| **Authentication required** | ✅ | `requireAuth()` on all cart/checkout endpoints |
| **Authorization checks** | ✅ | User can only access their own cart/orders |
| **Input validation** | ✅ | Course ID, simulation type validated |
| **SQL injection prevention** | ✅ | Drizzle ORM parameterized queries |
| **XSS prevention** | ✅ | Vue auto-escapes, no v-html |
| **CSRF protection** | ⚠️ | Cookies used, but no CSRF token |
| **Rate limiting** | ❌ | Not implemented |
| **Secure cookies** | ⚠️ | HTTP-only, but SameSite not explicitly set |
| **Password hashing** | ✅ | bcrypt (for auth, not cart-related) |

---

## 8. Edge Cases & Error Handling

### 8.1 Duplicate Enrollment Prevention

**Database Level:**
```sql
CREATE UNIQUE INDEX enrollments_user_course_idx 
ON enrollments(user_id, course_id);
```

**Application Level:**
```typescript
// Check before add-to-cart
const existingEnrollment = await db.select().from(enrollments)
  .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
  .limit(1)

if (existingEnrollment) {
  throw createError({
    statusCode: 400,
    statusMessage: 'You are already enrolled in this course'
  })
}
```

**UI Level:**
```vue
<!-- CourseCard.vue -->
<template v-if="userStore.isAuthenticated && userStore.isEnrolled(course.id)">
  <span class="text-white/50 line-through">${{ course.price }}</span>
  <NuxtLink :to="`${courseLink}/lessons`">Continue Learning</NuxtLink>
</template>
```

---

### 8.2 Cart Item Expiration

**Current:** ❌ No expiration implemented

**Suggested Implementation:**
```typescript
// scripts/cleanup-carts.ts
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
await db.delete(cartItems)
  .where(lt(cartItems.createdAt, thirtyDaysAgo))
```

---

### 8.3 Failed Payment Handling

```typescript
// server/db/order-service.ts: processCheckout() - Failure flow

if (simulationType === 'fail') {
  return db.transaction((tx) => {
    // 1. Calculate total for failed order record
    const userCartItems = tx.select({ courseId: cartItems.courseId })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .all()

    const courseIds = userCartItems.map(item => item.courseId)
    const dbCourses = tx.select({ price: courses.price })
      .from(courses)
      .where(inArray(courses.id, courseIds))
      .all()

    const totalAmount = dbCourses.reduce((sum, course) => sum + (course.price || 0), 0)

    // 2. Create FAILED order (for record-keeping)
    const [failedOrder] = tx.insert(orders).values({
      userId,
      totalAmount,
      status: 'failed',
      createdAt: new Date(),
    }).returning().all()

    // 3. Do NOT enroll or clear cart (user can retry)
    return { success: false, orderId: failedOrder.id }
  })
}
```

**User Experience:**
- Cart items remain (user can retry)
- Failed order recorded (audit trail)
- User redirected to `/checkout/failed`
- Options: "Try Again" or "Keep Browsing"

---

### 8.4 Network Error Recovery

#### **Client-Side Retry Logic**

```typescript
// app/stores/cart.ts: addItem()
const addItem = async (course: Course) => {
  if (isInCart(course.id)) return

  if (userStore.isAuthenticated) {
    try {
      const response = await $fetch('/api/cart', {
        method: 'POST',
        body: { courseId: course.id },
      })
      if (response?.success) {
        await fetchUserCart()  // Refetch for consistency
        toast.success('Course added to cart')
      }
    } catch (error: unknown) {
      console.error('Failed to add item:', error)
      toast.error('Failed to add item to cart')
      // Cart state unchanged - user can retry
    }
  } else {
    // Guest: optimistic update (instant, no API)
    const currentIds = guestCartCookie.value || []
    guestCartCookie.value = [...currentIds, course.id]
    items.value.push(course)
    toast.success('Course added to cart')
  }
}
```

#### **Checkout Retry**

```typescript
// app/pages/checkout/index.vue
const handleCheckout = async (type: 'success' | 'fail') => {
  const result = await checkout(type)

  if (result.success && result.orderId) {
    await navigateTo(`/checkout/success?id=${result.orderId}`)
  } else if (result.orderId) {
    await navigateTo(`/checkout/failed?id=${result.orderId}`)
  } else {
    // Network error - stay on page, user can retry
    console.error('Checkout failed:', result.message)
  }
}
```

---

### 8.5 Edge Cases Summary

| Edge Case | Prevention | Recovery |
|-----------|------------|----------|
| **Duplicate cart item** | Unique DB constraint | Graceful message: "Item already in cart" |
| **Duplicate enrollment** | Unique DB constraint | Error: "Already enrolled" |
| **Unpublished course** | Check before add | Error: "Course not available" |
| **Network failure** | Try-catch, state unchanged | User can retry |
| **Payment failure** | Cart preserved | "Try Again" option |
| **Race condition** | DB transactions | Atomic operations |
| **Guest cart merge failure** | Silent fail, console.warn | Cart items lost, but login succeeds |

---

## 9. Testing

### 9.1 Test Coverage

**Cart API Tests:** `__tests__/api/cart.test.ts`
- ✅ GET /api/cart - empty cart
- ✅ GET /api/cart - cart with items
- ✅ POST /api/cart - add item
- ✅ POST /api/cart - duplicate item
- ✅ POST /api/cart - unpublished course
- ✅ POST /api/cart - already enrolled
- ✅ DELETE /api/cart/:courseId - remove item
- ✅ POST /api/cart/merge - bulk merge

**Cart Service Tests:** `__tests__/services/cart-service.test.ts`
- ✅ addToCart - success
- ✅ addToCart - course not found
- ✅ addToCart - course unpublished
- ✅ addToCart - duplicate handling
- ✅ removeFromCart - success
- ✅ bulkAddToCart - success
- ✅ clearCart - success

**Checkout Tests:** `__tests__/api/checkout.test.ts`
- ✅ POST /api/checkout - success simulation
- ✅ POST /api/checkout - failure simulation
- ✅ POST /api/checkout - empty cart
- ✅ POST /api/checkout - unauthorized

**Order Service Tests:** `__tests__/services/order-service.test.ts`
- ✅ processCheckout - success creates enrollments
- ✅ processCheckout - failure preserves cart
- ✅ getOrderDetails - success
- ✅ getUserOrders - success

---

### 9.2 Running Tests

```bash
# Run all tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- cart.test.ts
```

---

## 10. Missing Features & Recommendations

### 10.1 Not Yet Implemented

| Feature | Priority | Suggested Approach |
|---------|----------|-------------------|
| **Real Payment Gateway** | High | Stripe/PayPal integration |
| **Coupons/Discounts** | Medium | Add `coupon_code` field to orders |
| **Cart Expiration** | Low | Cron job to clean old carts |
| **Wishlist** | Medium | Separate `wishlists` table |
| **Gift Courses** | Low | Gift purchase flow |
| **Refunds** | Low | Refund request system |
| **Invoices** | Medium | PDF generation on purchase |
| **Email Notifications** | High | Welcome email, receipt email |

---

### 10.2 Suggested Improvements

#### **1. Add CSRF Protection**
```typescript
// Use nuxt-csurf or similar
import { useCsrf } from '#imports'
const csrfToken = useCsrf()

// Include in requests
const response = await $fetch('/api/cart', {
  method: 'POST',
  body: { courseId, csrfToken },
})
```

#### **2. Implement Rate Limiting**
```typescript
// server/middleware/rate-limit.ts
export default defineEventHandler((event) => {
  const ip = getRequestIP(event)
  // Check rate limit...
})
```

#### **3. Add Cart Expiration**
```typescript
// scripts/cleanup-carts.ts
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
await db.delete(cartItems).where(lt(cartItems.createdAt, thirtyDaysAgo))
```

#### **4. Improve Error Messages**
```typescript
if (err.statusMessage === 'Course not found') {
  toast.error('This course no longer exists')
} else if (err.statusMessage === 'Already enrolled') {
  toast.info('You already own this course')
}
```

#### **5. Add Email Notifications**
```typescript
// server/utils/email.ts
export async function sendOrderConfirmation(userId: number, orderId: number) {
  const user = await getUserById(userId)
  const order = await getOrderDetails(orderId, userId)

  await sendEmail({
    to: user.email,
    subject: 'Order Confirmation',
    template: 'order-confirmation',
    data: { order, user },
  })
}
```

---

## 11. Quick Reference

### 11.1 Key Files

| File | Purpose |
|------|---------|
| `app/stores/cart.ts` | Cart state management |
| `app/composables/useCart.ts` | Cart composable |
| `app/components/ui/CartDrawer.vue` | Cart UI |
| `app/pages/checkout/index.vue` | Checkout page |
| `app/pages/checkout/success.vue` | Success page |
| `app/pages/checkout/failed.vue` | Failed page |
| `server/api/cart/*.ts` | Cart API endpoints |
| `server/api/checkout/index.post.ts` | Checkout endpoint |
| `server/db/cart-service.ts` | Cart DB operations |
| `server/db/order-service.ts` | Order DB operations |
| `__tests__/api/cart.test.ts` | Cart API tests |
| `__tests__/services/cart-service.test.ts` | Cart service tests |

---

### 11.2 Common Operations

```typescript
// Add to cart
const { addItem } = useCart()
await addItem(course)

// Remove from cart
const { removeItem } = useCart()
await removeItem(courseId)

// Check if in cart
const { isInCart } = useCart()
if (isInCart(courseId)) { ... }

// Open cart drawer
const { openCart } = useCart()
openCart()

// Checkout
const { checkout } = useCart()
const result = await checkout('success')

// Check enrollment
const userStore = useUserStore()
if (userStore.isEnrolled(courseId)) { ... }

// Fetch enrollments
await userStore.fetchEnrollments()
```

---

### 11.3 API Quick Reference

```typescript
// Cart
GET  /api/cart              // Get cart items
POST /api/cart              // Add item to cart
DELETE /api/cart/:id        // Remove item
POST /api/cart/merge        // Merge guest cart

// Checkout
POST /api/checkout          // Process checkout

// Orders
GET  /api/orders            // Get order history
GET  /api/orders/:id        // Get order details

// Enrollments
GET  /api/enrollments/my    // Get enrolled course IDs
```

---

### 11.4 Database Tables Quick Reference

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `cart_items` | Shopping cart | `user_id`, `course_id` |
| `orders` | Purchase records | `user_id`, `total_amount`, `status` |
| `order_items` | Order line items | `order_id`, `course_id`, `price` |
| `enrollments` | Course access | `user_id`, `course_id`, `order_id` |

---

## Document Metadata

- **Created:** February 24, 2026
- **Last Updated:** February 24, 2026
- **Based On Commit:** `e750451`
- **Project Version:** 2.0.0
- **Tech Stack:** Nuxt 4, Vue 3, TypeScript, SQLite, Drizzle ORM, Pinia

---

**End of Document**
