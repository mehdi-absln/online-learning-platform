# Architecture

**Frontend-first** portfolio learning platform  
**Nuxt 4 · Vue 3 · TypeScript · Tailwind · Pinia · Zod · `@nuxt/image`**  
(Full-stack on Nitro + Drizzle/Turso — server is supporting cast, not the headline.)

This doc is written for **frontend / Nuxt reviewers**: how UI is structured, how state and data flow, and which UX quality bars are intentional.

---

## What a recruiter should see in 60 seconds

| Signal | Where it lives |
|--------|----------------|
| Components stay presentational; logic is extracted | `app/components/**` vs `composables/**` |
| Correct Nuxt data layer (`useFetch`, keys, SSR cache) | `useCourse`, `useCourses`, `useCourseFilters` |
| URL-driven UI state (shareable filters) | `useCourseFilters` + `utils/course-helpers` |
| Pinia only for real client session state | `stores/user`, `cart`, `lesson-progress` |
| Accessible interactive UI (not “aria-label spam”) | `useFocusTrap`, `useKeyboardFocus`, UI primitives |
| Loading / empty / error as first-class UX | `*Skeleton`, `EmptyState`, `ErrorState`, `Toast` |
| Typed forms with shared Zod + debounced field errors | `useZodValidation`, `schemas/*` |
| SSR hydration awareness | lazy auth middleware, client-only cart hydrate |
| Perf: lazy below-fold, image sizes, selective ISR | home `Lazy*`, `CourseImage`, `routeRules` |

---

## Frontend request flow

```
pages/                 thin route shells: meta, layout, compose sections
   │
   ▼
composables/           feature controllers: fetch, filters, form logic, a11y helpers
   │            ┌────── optional: sync into Pinia when many siblings need the same client state
   ▼            ▼
components/     stores/
  domain UI       user / cart / lesson-progress / course-detail share cache
  ui/* primitives
   │
   ▼
useFetch / $fetch  ──►  server/api  (thin)  ──►  services / DB
```

**Rule of thumb:** if a `.vue` file is doing business rules or fetch orchestration, it probably belongs in a composable.

---

## UI architecture

```
app/components/
├── ui/           # design-system-ish primitives (dumb, reusable)
│   Accordion, Breadcrumb, CartDrawer, ConfirmModal,
│   EmptyState, ErrorState, FormCheckbox, FormInput,
│   LoadingSpinner, PageHero, Pagination, SearchInput,
│   StarRating, SubmitButton, Tabs, Toast
├── courses/      # course discovery + detail chrome
├── lesson/       # player chrome: content, video, nav, sidebar
├── dashboard/    # student hub widgets
├── home/         # landing sections
├── blogs/        # list/detail cards + skeletons
├── admin/        # admin forms/tabs
└── icons/        # local icon components
```

### Patterns

- **Domain folders > giant flat `components/`** — reviewers find features fast.
- **Primitives in `ui/`** — shared interaction + a11y once, reuse everywhere.
- **Skeletons per surface** (`CourseCardSkeleton`, `CourseDetailSkeleton`, `Blog*Skeleton`, `DashboardSkeleton`) — loading UX matches final layout (less CLS).
- **Nuxt auto `Lazy*`** for below-the-fold: home stats/trainers/testimonials/blog, related courses, markdown body, filter-heavy chunks.
- **Layouts:** `default` (nav/footer + skip link), `auth`, `minimal` — route chrome is not copy-pasted per page.

Pages stay thin: wire composables + slot domain components. Example mental model for `/courses`:

`PageHero` → filter drawer/sidebar → `CoursesGrid` / skeletons → `Pagination`  
All filter state from URL via `useCourseFilters`, not local `ref` soup.

> Uses the **Nuxt 4 `app/` src-dir structure** — client code (`app/`) is cleanly separated from `server/` and root config, which is exactly why the FE story reads so clearly in the tree above.

---

## State management (frontend)

| Layer | Owns | Examples |
|-------|------|----------|
| **URL (`route.query`)** | Shareable UI state | course filters, page, search |
| **`useFetch` cache** | Server-backed view data | course list/detail, blogs, dashboard payload |
| **Pinia** | Long-lived *client* session state | auth user, cart badge/items, lesson progress map |
| **Component `ref`** | Ephemeral UI only | mobile filter drawer open, local tab index |

### Why this split

Pinia is **not** a dumping ground for every GET. Dumping SSR lists into stores creates a second, stale source of truth.

**Documented exception — `coursesStore`:**  
`useCourse` mirrors the *current* detailed course into Pinia during `transform` so lesson routes can resolve prev/next, section, and ids without prop-drilling across the player chrome. Owner of truth remains `useFetch` key `course:{slug}`; store clears on slug change. It is a **derived share cache**, not a catalogue.

### Cart (FE-relevant)

- Guest: IDs in `guest-cart` cookie → hydrate details via bulk endpoint.
- Authed: server cart; badge count from store.
- Login: merge guest → server, clear cookie.
- Store hydrates on **client** to avoid SSR mismatch on cookie-derived UI.

---

## Data fetching (Nuxt-native)

Conventions used across composables:

1. **`useFetch` / `useAsyncData`** in composables — not raw `$fetch` inside presentational components for initial data.
2. **Stable, reactive keys** — e.g. list keys include serialized filters so cache entries don’t bleed across query strings.
3. **`getCachedData`** — client navigations reuse SSR payload (no flash-refetch when data is already there).
4. **`transform`** — normalize / push to share-cache once (course detail).
5. **`dedupe: 'cancel'`** where rapid slug/filter changes would stack requests.
6. **Mutations** (`$fetch` in store/composable actions) then local refresh — cart, progress, auth.

Error surfacing is centralized-ish via `useApiError` + `ErrorState` / toast — pages don’t each invent a different failure UI.

---

## URL as the single source of truth (filters)

Discovery UX is built so filtered views are **bookmarkable and shareable**:

```
route.query
   │  extractParamsFromUrl()
   ▼
useCourseFilters  →  filter computed, hasActiveFilters, options fetch
   │  buildQueryParams() + router.push
   ▼
useCourses (key depends on query) → grid
```

- Mobile: filter panel is a disclosure button with `aria-expanded` / `aria-controls`.
- Desktop: sidebar filters.
- Search inputs debounce before writing URL (no query spam on every keystroke).
- Same idea exists for blog filters (`useBlogFilters`).

This is a deliberate FE architecture choice, not a backend trick.

---

## Forms & validation (client)

`useZodValidation` is the form engine:

- Zod schema in / shared with server (`app/schemas`)
- per-field errors, touched map, dirty/valid computed
- validate on blur / change
- **debounced** field validation (`@vueuse` `useDebounceFn`)
- `setFieldError` for mapping API auth errors → fields (`auth-error-handler-helpers`)

Used on sign-in/up, profile password change, admin forms — one pattern, not three.

UI primitives: `FormInput`, `FormCheckbox`, `SubmitButton` (`aria-busy` while pending).

---

## Accessibility (treated as product work)

Not a checklist dump — interactive patterns are implemented once in composables/primitives:

| Concern | Implementation |
|---------|----------------|
| Skip link + main landmark | `layouts/default` / `minimal` → `#main-content` |
| Focus trap (drawer/modal) | `useFocusTrap` (SSR-safe, cleans up) |
| Keyboard menus | `useKeyboardFocus` (roving tabindex) |
| Tabs | `role="tablist/tab/tabpanel"`, `aria-selected`, controls/labelledby |
| Pagination | `aria-label`, `aria-current="page"`, live region for page status |
| Search | visible/`sr-only` label, `aria-describedby` while loading, clear button label |
| Toasts | `role="alert"`, `aria-live="polite"`, `aria-atomic` |
| Async status | live regions on lists, auth, checkout, lesson |
| Lesson power-user UX | ArrowLeft/Right lesson nav, `m` toggle complete |
| Icons | decorative `aria-hidden`; actionable controls named |

Mobile nav uses dialog semantics (`role="dialog"`, `aria-modal`) with the focus trap.

---

## UX states & feedback

| State | Pattern |
|-------|---------|
| Loading | Domain skeletons matching card/detail layout |
| Empty | `EmptyState` (`role="status"`, labelled title) |
| Error | `ErrorState` + optional retry; page-level `error.vue` with SEO |
| Success / info | `useToast` → `Toast` stack |
| Submit | `SubmitButton` busy state, disabled affordance |
| Images | `CourseImage` / `BlogImage`: `<NuxtImg>` + `sizes` + `@error` → SVG placeholder |
| Rich text | `MarkdownRenderer` + DOMPurify (`plugins/purify.client` + `.server`) |

---

## SEO & document head (FE)

- Global defaults in `app.vue` / layout where needed
- Per-route `useSeoMeta` / `useHead` on home, course detail, lesson, blogs, static pages
- Private surfaces (auth/checkout/admin/dashboard) treated as non-index where applied
- Semantic structure: heroes, breadcrumbs (`Breadcrumb`), article footers

---

## Rendering & performance (FE lens)

| Concern | Choice |
|---------|--------|
| Initial route data | SSR + `useFetch` payload reuse |
| Course detail HTML | ISR (`/courses/**`) — stable slug pages |
| Course **list** | intentionally not path-ISR — body is 100% query-driven |
| Home | `Cache-Control: no-store` + lazy sections |
| JS cost | `Lazy*` below-fold sections, split heavy markdown |
| Images | responsive `sizes`, graceful fallback |
| Filter typing | debounce before navigation/fetch |

---

## Frontend folder map (complete)

```
app/
├── pages/          # file routes only — composition root
├── layouts/        # default · auth · minimal
├── components/     # UI by domain + ui primitives
├── composables/    # feature + a11y + form controllers
├── stores/         # Pinia client session state
├── schemas/        # Zod (shared with server validation)
├── types/          # domain TS contracts
├── utils/          # pure: slug, price, query parse/build, error map
├── middleware/     # auth.global (lazy hydrate), admin role gate
├── plugins/        # DOMPurify client/server
├── constants/      # copy / auth error codes
└── assets/css/     # Tailwind entry + fonts
```

Key composables (FE surface area):

`useCourse(s)`, `useCourseFilters`, `useLesson`, `useRelatedCourses`,  
`useBlog(s)`, `useBlogFilters`, `useDashboard`, `useCart`,  
`usePagination`, `useToast`, `useApiError`, `useZodValidation`,  
`useFocusTrap`, `useKeyboardFocus`, `useAccordion`, `useNavigationLinks`

---

## Auth & route gates (what the UI does)

- `auth.global.ts` **lazy**: hits `/api/auth/me` only if `accessToken` cookie exists and user store isn’t hydrated — anonymous browsing stays cheap.
- Pages set `definePageMeta({ requiresAuth, layout, middleware })` as needed.
- `admin` middleware: role gate; instructors blocked from `/admin/users`.
- Auth layout pages redirect away when already signed in.

Server JWT/cookies exist underneath; the FE concern is **hydrate once, gate routes, map API errors to fields**.

---

## Testing strategy (FE confidence)

Vitest + `@nuxt/test-utils` — used to lock down **my logic**, not to re-test the framework. ~32 spec files across the layers that actually carry risk:

| Layer | What’s covered | Example specs |
|-------|----------------|---------------|
| **Composables** | Controller logic in isolation | `useZodValidation` (validation/touched/errors), `useLesson`, `useToast` |
| **Stores** | Client state mutations | `lesson-progress` (complete/bookmark/notes), `user-store` (auth session) |
| **UI primitives** | Props/slots/emit + interaction contracts | `Accordion` (+ navigation/keyboard), `Tabs`, `Pagination`, `EmptyState`, `ErrorState` |
| **Domain components** | Cards & feature UI | `CourseCard`, `DashboardStatsCard`, `CourseFilterCheckbox`, `LessonContent`, `LessonVideo` |
| **Pages** | Page-level wiring | auth, lesson page/header/video, course detail |
| **Integration** | End-to-end client flow | `course-filters-integration` — proves **URL → state → fetch key** discovery pipeline |
| **Services / API** | Server logic against a real DB | `cart-service`, `order-service`, `course-transformer`, cart/checkout/orders handlers |
| **Utils** | Pure logic | `authErrorHandler`, `related-courses` |

Server/service tests run against an **in-memory SQLite** (`better-sqlite3`) with the real Drizzle migrations applied per worker (`__tests__/helpers/db.ts`) — fast, isolated, no shared fixture bleed.

Run: `npm run test` · `npm run test:run` · `npm run test:coverage`.



## Server layer (supporting — short)

Kept short on purpose. Full-stack competence without stealing the FE story:

```
server/api/**     thin: Zod → requireAuth/Instructor/Purchaser → *-service → ApiResponse
server/db/        Drizzle schema + domain services
server/utils/     jwt (jose), lesson-access, response helpers
```

Lesson paywall decision (free · enrolled · instructor-owner · admin) is enforced server-side; the lesson UI consumes the authorized payload and progress APIs.

---

## Deliberately skipped (portfolio ceiling)

| Skipped | Add when |
|---------|----------|
| Design-token package / Storybook | multi-app design system |
| i18n | real second locale ships |
| Refresh-token rotation | multi-device prod auth |
| Client state machine lib (XState) | flows outgrow composables |
| Separate component library repo | second product reuses UI |

`Bottom line:` ceiling = modular Nuxt app with a real `ui/` primitive layer and composable controllers. Next upgrade = extract tokens + Storybook, not a rewrite.
