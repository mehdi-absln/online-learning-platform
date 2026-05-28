<template>
  <!-- Mobile Menu (teleported to body) -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-linear"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-linear"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        aria-hidden="true"
        @click="closeMobileMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 max-h-0"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4 max-h-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden scrollbar-hide fixed top-20 left-4 right-4 z-50 bg-dark-surface/95 backdrop-blur-xl border border-dark-divider rounded-2xl shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto pb-4"
      >
        <ul
          class="py-2"
          role="list"
        >
          <li
            v-for="link in mainLinks"
            :key="link.to"
          >
            <NuxtLink
              :to="link.to"
              class="block px-5 py-3 text-white font-medium hover:bg-dark-bg hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              :class="isActiveLink(link.to) ? 'text-primary bg-dark-bg border-l-2 border-primary' : ''"
              :aria-current="isActiveLink(link.to) ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>

        <div class="h-px bg-dark-divider" />

        <div class="p-4">
          <template v-if="userStore.isAuthenticated">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {{ userInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-white truncate">
                  {{ userDisplayName }}
                </p>
                <p
                  v-if="userStore.user?.email"
                  class="text-xs text-gray-400 truncate"
                >
                  {{ userStore.user?.email }}
                </p>
              </div>
            </div>
            <NuxtLink
              to="/profile"
              class="block w-full text-center px-4 py-2 text-sm text-gray-300 hover:text-primary transition-colors"
              @click="closeMobileMenu"
            >
              Profile
            </NuxtLink>
            <button
              type="button"
              class="w-full mt-2 px-4 py-2 text-sm font-semibold text-primary hover:bg-dark-bg rounded-lg transition-colors"
              @click="handleLogout"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth"
              class="block w-full text-center px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Sign In
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Main Navigation Bar -->
  <nav
    aria-label="Main navigation"
    class="fixed top-0 left-0 right-0 z-50 py-4 lg:py-10 transition-all duration-300"
    :class="isScrolled
      ? 'bg-dark-gray/85 backdrop-blur-md shadow-lg shadow-black/20'
      : 'bg-transparent'"
  >
    <div class="flex justify-between items-center container">
      <NuxtLink
        to="/home"
        class="text-base lg:text-xl font-bold text-white drop-shadow-lg shrink-0"
        :aria-label="`${SITE_NAME}"
        -
        Home`
      >
        <span class="hidden xxs:inline">{{ SITE_NAME }}</span>
        <span class="xxs:hidden">OLP</span>
      </NuxtLink>

      <!-- Desktop navigation links -->
      <ul
        class="hidden lg:flex lg:space-x-6 xl:space-x-8"
        role="list"
      >
        <li
          v-for="link in mainLinks"
          :key="link.to"
        >
          <NuxtLink
            :to="link.to"
            class="font-semibold text-white hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray rounded px-2 py-1"
            :class="isActiveLink(link.to) ? 'text-primary border-b-2 border-primary' : ''"
            :aria-current="isActiveLink(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Desktop actions -->
      <div class="hidden lg:flex items-center space-x-4">
        <!-- Authenticated user dropdown -->
        <div
          v-if="userStore.isAuthenticated"
          class="relative"
        >
          <button
            :id="avatarButtonId"
            ref="avatarButton"
            type="button"
            class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 text-white font-semibold text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
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
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <span class="relative z-10 text-white group-hover:text-primary transition-colors duration-300">{{ userInitials }}</span>

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

          <!-- Dropdown menu -->
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
              <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div class="relative px-5 py-4 border-b border-dark-divider bg-gradient-to-br from-primary/10 to-transparent">
                <div class="flex items-center space-x-3">
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

              <!-- Dropdown items -->
              <div class="relative py-2">
                <NuxtLink
                  v-for="(item, index) in dropdownMenuItems"
                  :id="`${dropdownMenuId}-item-${index}`"
                  :key="item.id"
                  :ref="getMenuItemRef(index)"
                  :to="item.to"
                  class="group flex items-center px-5 py-3 text-sm text-gray-300 hover:bg-dark-bg hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:bg-dark-bg focus-visible:text-primary"
                  role="menuitem"
                  tabindex="-1"
                  @click="closeDropdown"
                >
                  <svg
                    v-if="item.icon === 'profile'"
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
                  <svg
                    v-else-if="item.icon === 'courses'"
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
                  <svg
                    v-else-if="item.icon === 'settings'"
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
                  <span class="font-medium">{{ item.label }}</span>
                </NuxtLink>
              </div>

              <div class="relative h-px bg-gradient-to-r from-primary/50 via-dark-divider to-dark-divider" />
              <div class="relative pb-2 pt-1">
                <button
                  :id="`${dropdownMenuId}-item-${dropdownMenuItems.length}`"
                  :ref="getMenuItemRef(dropdownMenuItems.length)"
                  type="button"
                  class="group w-full flex items-center px-5 py-3 text-sm text-primary hover:bg-dark-bg transition-all duration-200 focus-visible:outline-none focus-visible:bg-dark-bg"
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

        <!-- Login button (unauthenticated) -->
        <NuxtLink
          v-else
          to="/auth"
          class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-transparent text-white transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,82,82,0.4)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
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

        <div
          class="h-6 w-px bg-white/20"
          aria-hidden="true"
        />

        <!-- Cart button -->
        <button
          type="button"
          class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-transparent text-white transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,82,82,0.4)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
          :aria-label="`Shopping cart with ${cartItemsCount} items`"
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

      <!-- Mobile buttons -->
      <div class="flex lg:hidden items-center space-x-3">
        <button
          type="button"
          class="group relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-transparent text-white transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,82,82,0.4)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
          :aria-label="`Shopping cart with ${cartItemsCount} items`"
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

        <!-- Hamburger -->
        <button
          type="button"
          class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-transparent text-white transition-all duration-300 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-gray"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="isMobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <svg
            v-if="!isMobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <CartDrawer />
  </nav>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useCart } from '~/composables/useCart'
import { useKeyboardFocus } from '~/composables/useKeyboardFocus'
import { useNavigationLinks } from '~/composables/useNavigationLinks'
import { useUserStore } from '~/stores/user'
import CartDrawer from '~/components/ui/CartDrawer.vue'
import { SITE_NAME } from '~/constants/index'

const route = useRoute()
const userStore = useUserStore()
const { itemsCount: cartItemsCount, openCart } = useCart()

// Scroll‑driven nav background
const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 10)

// Accessibility IDs
const avatarButtonId = 'user-avatar-button'
const dropdownMenuId = 'user-menu'

// Desktop dropdown state
const isDropdownOpen = ref(false)
const avatarButton = ref<HTMLButtonElement | null>(null)
const dropdownMenu = ref<HTMLDivElement | null>(null)
const menuItemElements = ref<(HTMLElement | null)[]>([])
const focusedItemIndex = ref(-1)

// Mobile menu state
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Shared navigation links
const { mainLinks } = useNavigationLinks()

// Dynamic dropdown menu items
const dropdownMenuItems = computed(() => {
  const items = [
    { id: 'profile', to: '/profile', label: 'Profile', icon: 'profile' },
    { id: 'courses', to: '/dashboard', label: 'My Courses', icon: 'courses' },
  ]
  return items
})

const isActiveLink = (path: string) => {
  const current = route.path
  return current === path || current.startsWith(path + '/')
}

const setMenuItemRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    if (el instanceof HTMLElement) {
      menuItemElements.value[index] = el
    }
    else {
      menuItemElements.value[index] = (el as ComponentPublicInstance).$el as HTMLElement
    }
  }
}

const getMenuItemRef = (index: number) => (el: Element | ComponentPublicInstance | null) => {
  setMenuItemRef(el, index)
}

// Dropdown keyboard navigation
const { handleKeyDown } = useKeyboardFocus({
  items: menuItemElements,
})

const userInitials = computed(() => userStore.user?.username?.[0]?.toUpperCase() || 'U')
const userDisplayName = computed(() => userStore.user?.username || 'User')

// Dropdown controls
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
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
  nextTick(() => {
    avatarButton.value?.focus()
  })
}

const focusItem = (index: number) => {
  const el = menuItemElements.value[index]
  if (el) {
    el.focus()
    focusedItemIndex.value = index
  }
}

const onMenuKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
    return
  }
  handleKeyDown(event, focusedItemIndex.value, menuItemElements.value.length, focusItem)
}

const handleLogout = async () => {
  closeDropdown()
  closeMobileMenu()
  await userStore.logout()
}

// Close dropdown on outside click
const handleClickOutside = (event: MouseEvent) => {
  if (isDropdownOpen.value && dropdownMenu.value && !dropdownMenu.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
