<template>
  <nav
    aria-label="Main navigation"
    class="fixed top-0 left-0 right-0 z-50 py-10 bg-transparent container"
  >
    <div class="flex justify-between items-center">
      <!-- Logo/Brand -->
      <NuxtLink
        to="/home"
        class="text-xl font-bold text-white drop-shadow-lg"
        aria-label="Online Learning Platform - Home"
      >
        ONLINE LEARNING PLATFORM
      </NuxtLink>

      <!-- Navigation Menu -->
      <ul
        class="flex space-x-8"
        role="list"
      >
        <li>
          <NuxtLink
            to="/home"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded px-2 py-1"
            :aria-current="route.path === '/home' ? 'page' : undefined"
          >
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/courses"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded px-2 py-1"
            :aria-current="route.path === '/courses' ? 'page' : undefined"
          >
            Courses
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/dashboard"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded px-2 py-1"
            :aria-current="route.path === '/dashboard' ? 'page' : undefined"
          >
            Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/pages"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded px-2 py-1"
            :aria-current="route.path === '/pages' ? 'page' : undefined"
          >
            Pages
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/blog"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded px-2 py-1"
            :aria-current="route.path === '/blog' ? 'page' : undefined"
          >
            Blog
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/contact"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded px-2 py-1"
            :aria-current="route.path === '/contact' ? 'page' : undefined"
          >
            Contact
          </NuxtLink>
        </li>
      </ul>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-4">
        <!-- User Menu (when authenticated) -->
        <div
          v-if="userStore.isAuthenticated"
          class="relative"
        >
          <!-- User Avatar Button -->
          <button
            :id="avatarButtonId"
            ref="avatarButton"
            type="button"
            class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 text-white font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
            :class="[
              isDropdownOpen
                ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(236,82,82,0.5)] scale-105'
                : 'border-white/30 bg-transparent hover:border-primary hover:shadow-[0_0_20px_rgba(236,82,82,0.4)] hover:scale-105',
            ]"
            :aria-label="`User menu for ${userDisplayName}`"
            :aria-expanded="isDropdownOpen"
            aria-haspopup="menu"
            @click="toggleDropdown"
            @keydown.enter="toggleDropdown"
            @keydown.space.prevent="toggleDropdown"
            @keydown.escape="closeDropdown"
            @keydown.arrow-down.prevent="openDropdown"
            @keydown.arrow-up.prevent="openDropdown"
          >
            <!-- Subtle gradient overlay -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <!-- User Initials -->
            <span class="relative z-10 text-white group-hover:text-primary transition-colors duration-300">{{ userInitials }}</span>

            <!-- Arrow Indicator (shows when dropdown is open) -->
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 scale-50"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-300"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-50"
            >
              <div
                v-if="isDropdownOpen"
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-primary rotate-45 rounded-sm shadow-lg"
                aria-hidden="true"
              />
            </Transition>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95 -translate-y-3"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-3"
          >
            <div
              v-if="isDropdownOpen"
              :id="dropdownMenuId"
              ref="dropdownMenu"
              class="absolute right-0 mt-2 w-64 bg-dark-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/30 overflow-hidden z-50"
              role="menu"
              :aria-labelledby="avatarButtonId"
              @keydown="onMenuKeyDown"
            >
              <!-- Subtle Primary Glow Effect -->
              <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

              <!-- User Info Header -->
              <div class="relative px-5 py-4 border-b border-dark-divider bg-gradient-to-br from-primary/10 to-transparent">
                <div class="flex items-center space-x-3">
                  <!-- Avatar in Header -->
                  <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-lg">
                    {{ userInitials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-white truncate">
                      {{ userDisplayName }}
                    </p>
                    <p
                      v-if="userStore.user?.email"
                      class="text-xs text-gray-400 truncate mt-0.5"
                    >
                      {{ userStore.user?.email }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="relative py-2">
                <NuxtLink
                  :id="`${dropdownMenuId}-item-0`"
                  :ref="(el: any) => setMenuItemRef(el, 0)"
                  to="/profile"
                  class="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-dark-bg hover:text-primary transition-all duration-200 focus:outline-none focus:bg-dark-bg focus:text-primary"
                  role="menuitem"
                  tabindex="-1"
                  @click="closeDropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="font-medium">Profile</span>
                </NuxtLink>

                <NuxtLink
                  :id="`${dropdownMenuId}-item-1`"
                  :ref="(el: any) => setMenuItemRef(el, 1)"
                  to="/my-courses"
                  class="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-dark-bg hover:text-primary transition-all duration-200 focus:outline-none focus:bg-dark-bg focus:text-primary"
                  role="menuitem"
                  tabindex="-1"
                  @click="closeDropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span class="font-medium">My Courses</span>
                </NuxtLink>

                <NuxtLink
                  :id="`${dropdownMenuId}-item-2`"
                  :ref="(el: any) => setMenuItemRef(el, 2)"
                  to="/settings"
                  class="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-dark-bg hover:text-primary transition-all duration-200 focus:outline-none focus:bg-dark-bg focus:text-primary"
                  role="menuitem"
                  tabindex="-1"
                  @click="closeDropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span class="font-medium">Settings</span>
                </NuxtLink>
              </div>

              <!-- Divider with Primary Accent -->
              <div class="relative h-px bg-gradient-to-r from-primary/50 via-dark-divider to-dark-divider" />

              <!-- Logout -->
              <div class="relative pb-2 pt-1">
                <button
                  :id="`${dropdownMenuId}-item-3`"
                  :ref="(el: any) => setMenuItemRef(el, 3)"
                  type="button"
                  class="group w-full flex items-center px-5 py-3 text-sm text-primary hover:bg-dark-bg transition-all duration-200 focus:outline-none focus:bg-dark-bg"
                  role="menuitem"
                  aria-label="Sign out of your account"
                  tabindex="-1"
                  @click="handleLogout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 text-primary group-hover:translate-x-0.5 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span class="font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Login Button (when not authenticated) -->
        <NuxtLink
          v-else
          to="/auth"
          class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-transparent text-white transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,82,82,0.4)] hover:scale-105  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
          aria-label="Login to your account"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white group-hover:text-primary transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </NuxtLink>

        <!-- Divider -->
        <div
          class="h-6 w-px bg-white/20"
          aria-hidden="true"
        />
        <!-- Cart Button -->
        <button
          type="button"
          class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-transparent text-white transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,82,82,0.4)] hover:scale-105  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
          aria-label="Shopping cart with {{ cartItemsCount }} items"
          @click="openCart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white group-hover:text-primary transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span
            v-if="cartItemsCount > 0"
            class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full shadow-lg"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ cartItemsCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Cart Drawer Component -->
    <CartDrawer />
  </nav>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useCart } from '~/composables/useCart'
import { useKeyboardFocus } from '~/composables/useKeyboardFocus'
import { useUserStore } from '~/stores/user'
import CartDrawer from '~/components/ui/CartDrawer.vue'

const route = useRoute()
const userStore = useUserStore()
const { itemsCount: cartItemsCount, openCart } = useCart()

// Unique IDs for accessibility
const avatarButtonId = 'user-avatar-button'
const dropdownMenuId = 'user-menu'

// Dropdown state
const isDropdownOpen = ref(false)
const avatarButton = ref<HTMLButtonElement | null>(null)
const dropdownMenu = ref<HTMLDivElement | null>(null)
const menuItemElements = ref<(HTMLElement | null)[]>([])

// Focus management
const focusedItemIndex = ref(-1)

// Template ref setter for menu items (handles NuxtLink components)
const setMenuItemRef = (el: ComponentPublicInstance | HTMLElement | null, index: number) => {
  if (el) {
    // NuxtLink is a component, need to get $el
    menuItemElements.value[index] = '$el' in el ? (el.$el as HTMLElement) : el
  }
}

// Use keyboard focus composable
const { handleKeyDown } = useKeyboardFocus({
  items: menuItemElements,
})

// Computed user info
const userInitials = computed(() => {
  // Use first letter of username (or 'U' as fallback)
  return userStore.user?.username?.[0]?.toUpperCase() || 'U'
})

const userDisplayName = computed(() => {
  return userStore.user?.username || 'User'
})

// Dropdown control functions
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    // Focus first item when opened
    nextTick(() => {
      focusedItemIndex.value = 0
      focusItem(0)
    })
  }
}

const openDropdown = () => {
  isDropdownOpen.value = true
  nextTick(() => {
    focusedItemIndex.value = 0
    focusItem(0)
  })
}

const closeDropdown = () => {
  isDropdownOpen.value = false
  focusedItemIndex.value = -1
  menuItemElements.value = [] // Clear refs
  // Return focus to avatar button
  nextTick(() => {
    avatarButton.value?.focus()
  })
}

// Focus management function
const focusItem = (index: number) => {
  const el = menuItemElements.value[index]
  if (el) {
    el.focus()
    focusedItemIndex.value = index
  }
}

// Unified keyboard handler for menu
const onMenuKeyDown = (event: KeyboardEvent) => {
  // Handle Escape separately (not handled by composable)
  if (event.key === 'Escape') {
    closeDropdown()
    return
  }

  // Delegate arrow keys, Home, End to composable
  handleKeyDown(
    event,
    focusedItemIndex.value,
    menuItemElements.value.length,
    focusItem,
  )
}

// Handle logout
const handleLogout = async () => {
  closeDropdown()
  await userStore.logout()
}

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (isDropdownOpen.value && dropdownMenu.value && !dropdownMenu.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Setup event listeners
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
