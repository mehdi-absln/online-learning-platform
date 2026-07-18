# Architecture

A portfolio / learning-platform built with **Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS**.
This document explains the key architectural decisions so reviewers can understand the
*why*, not just the *what*.

## High-level structure

```
app/
├── components/      # UI only — grouped by domain (courses/, lesson/, dashboard/, home/, ui/, admin/, blogs/, icons/)
├── composables/     # All data-fetching + business logic (the "controller" layer)
├── stores/          # Pinia stores — CLIENT state only (auth, cart, course detail, progress, blogs)
├── types/           # Shared TS interfaces, grouped by domain
├── schemas/         # Zod validation schemas (forms, admin)
├── utils/           # Pure helpers (slug, price, course-query parsing)
├── middleware/       # Route guards (auth.global, admin)
├── layouts/         # default / auth / minimal
├── pages/           # File-based routing (Nuxt convention)
├── plugins/         # Nuxt plugins (DOMPurify sanitizer)
└── assets/css/      # Tailwind entry + component layer
```

## State management: Pinia vs. composables

The project deliberately splits state into two layers:

| Layer | Holds | Example |
|--------|--------|---------|
| **Pinia stores** | *Client* state that must survive navigation & be shared across unrelated components | `userStore` (auth), `cartStore` (guest + server cart), `lessonProgressStore`, `coursesStore` (current detailed course) |
| **Composables** | *Request* state + derived/business logic, scoped to a page/feature | `useCourse`, `useLesson`, `useCourses`, `useDashboard`, `useBlog(s)` |

**Why:** Pinia is used for state that is genuinely cross-component and
long-lived (the logged-in user, the cart badge count). Everything that is really
just "the result of a fetch + its loading/error state" lives in a composable
wrapping `useFetch`/`useAsyncData`. This keeps stores small and avoids the
anti-pattern of writing *server-fetched* data into Pinia (which creates a
second, stale source of truth).

## Data fetching

- **`useFetch` / `useAsyncData` everywhere** instead of raw `$fetch` in components.
- **Unique + reactive keys.** Filter/list pages derive their cache key from the
  query string (e.g. `courses-list:{...queryParams}`) so each filter/page
  combination gets its own cache entry and there is no cache bleed between
  filtered lists.
- **`getCachedData`** is wired so client-side navigation reuses the SSR payload.
- **`transform`** is used to push the fetched course into `coursesStore` exactly
  once (not duplicated in both `transform` and a `watch(data)` — a bug we removed).

## URL as the single source of truth (course filters)

Filter state (category, level, tags, price, search, pagination) is **never** held in
component/store state. It lives entirely in the route query string:

- `useCourseFilters` *reads* the active filter from `route.query` (`extractParamsFromUrl`).
- Changing a filter *writes* a new URL via `router.push` (`buildQueryParams`).
- This makes filtered views **shareable and bookmarkable** for free, and keeps
  filter state consistent across back/forward navigation.

## Authentication & SSR hydration

- `auth.global.ts` is a global route middleware. It is **lazy**: it only calls
  `/api/auth/me` when an `accessToken` cookie exists *and* the user is not
  already hydrated. This saves one round-trip per navigation for anonymous visitors.
- The cart store similarly skips SSR fetching and only hydrates on the client
  (`import.meta.client` guard) to avoid hydration mismatches.

## Accessibility (a11y)

Accessibility is treated as a first-class concern, not an afterthought:

- `useFocusTrap` (SSR-safe, cleans up its own listeners) traps focus in modals/drawers.
- `useKeyboardFocus` provides roving-tabindex keyboard navigation for menus.
- Skip-to-content link, ARIA live regions for async status, `aria-current` on
  active nav/lesson, and full keyboard shortcuts on the lesson page
  (ArrowLeft/Right to navigate, `m` to toggle complete).

## Images

`CourseImage.vue` wraps `<NuxtImg>` with a fallback placeholder and an
`@error` handler that swaps to a static SVG. All usages pass `sizes` for
responsive `srcset` generation.

## Performance notes

- Below-the-fold sections are lazy-loaded (`Lazy` prefix / `defineAsyncComponent`):
  dashboard widgets, home stats/testimonials/blog, and the course filter sidebar.
- `routeRules` in `nuxt.config.ts` sets course detail pages to ISR, while
  intentionally *not* caching the `/courses` list (its content is query-driven).
- `robots: noindex` is applied to auth / checkout / admin / dashboard pages.
