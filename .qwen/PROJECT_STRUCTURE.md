# Online Learning Platform - Project Structure

## Overview
Comprehensive documentation of the project structure for the Online Learning Platform built with **Nuxt 4**, **Vue 3**, **TypeScript**, **Tailwind CSS**, **Pinia**, **SQLite** with **Drizzle ORM**, and **Vitest** for testing.

**Last Updated:** February 25, 2026
**Version:** 2.1.0

---

## 📁 Complete Directory Structure

```
online-learning-platform/
│
├── 📂 __tests__/                          # Test suite (Vitest)
│   ├── 📂 api/                            # API endpoint tests [NEW ⭐]
│   │   ├── cart.test.ts                   # Cart API tests
│   │   ├── checkout.test.ts               # Checkout API tests
│   │   └── orders.test.ts                 # Orders API tests
│   ├── 📂 components/                     # Component tests
│   │   ├── LessonContent.test.ts
│   │   └── LessonVideo.test.ts
│   ├── 📂 composables/                    # Composable tests
│   │   ├── useLesson.test.ts
│   │   └── useToast.test.ts
│   ├── 📂 helpers/                        # Test helpers [NEW ⭐]
│   │   └── db.ts                          # Database setup/cleanup for tests
│   ├── 📂 services/                       # Service layer tests [NEW ⭐]
│   │   ├── cart-service.test.ts           # Cart service logic tests
│   │   └── order-service.test.ts          # Order service logic tests
│   ├── 📂 stores/                         # Pinia store tests
│   │   └── lesson-progress.test.ts
│   ├── 📂 unit/                           # Unit tests
│   │   └── related-courses.test.ts
│   ├── Accordion.test.ts
│   ├── AccordionComprehensive.test.ts
│   ├── AccordionNavigation.test.ts
│   ├── AccordionSimple.test.ts
│   ├── auth.test.ts
│   ├── authErrorHandler.test.ts
│   ├── course-filters-integration.test.ts
│   ├── course-transformer.test.ts
│   ├── CourseCard.test.ts
│   ├── CourseDetailPageUpdated.test.ts
│   ├── CourseFilterCheckbox.test.ts
│   ├── lesson-header.test.ts
│   ├── lesson-page.test.ts
│   ├── lesson-video.test.ts
│   ├── Pagination.test.ts
│   ├── Tabs.test.ts
│   ├── user-store.test.ts
│   └── useZodValidation.test.ts
│
├── 📂 app/                                # Frontend Nuxt application
│   ├── 📂 assets/                         # Static assets
│   │   ├── 📂 css/
│   │   │   ├── app.css                    # Main styles + utility classes [UPDATED ⭐]
│   │   │   └── fonts.css                  # Font configurations
│   │   └── .gitkeep
│   │
│   ├── 📂 components/                     # Reusable Vue components
│   │   ├── 📂 blogs/                      # Blog components
│   │   │   ├── BlogCard.vue
│   │   │   └── BlogsGrid.vue
│   │   ├── 📂 courses/                    # Course components
│   │   │   ├── CourseCard.vue
│   │   │   ├── CourseReviews.vue          # Display ratings & reviews
│   │   │   ├── CoursesGrid.vue
│   │   │   ├── CourseSidebarFilters.vue   # Search + filters sidebar
│   │   │   ├── FilterCheckboxGroup.vue
│   │   │   ├── FilterRadioGroup.vue
│   │   │   └── RelatedCourses.vue
│   │   ├── 📂 icons/                      # Icon components [NEW ⭐]
│   │   │   ├── IconAlertCircle.vue        # Error/alert icon
│   │   │   ├── IconBookmark.vue           # Bookmark/save icon
│   │   │   ├── IconCalendar.vue           # Date/calendar icon
│   │   │   ├── IconCheckCircle.vue        # Success/check icon
│   │   │   ├── IconChevronLeft.vue        # Left arrow navigation
│   │   │   ├── IconChevronRight.vue       # Right arrow navigation
│   │   │   ├── IconClock.vue              # Time/duration icon
│   │   │   ├── IconLock.vue               # Lock/security icon
│   │   │   ├── IconShare.vue              # Share icon
│   │   │   └── IconSpinner.vue            # Loading spinner [NEW ⭐]
│   │   ├── 📂 lesson/                     # Lesson components [NEW ⭐]
│   │   │   ├── LessonContent.vue          # Lesson text content
│   │   │   ├── LessonNav.vue              # Lesson navigation (prev/next/complete) [NEW ⭐]
│   │   │   │                                  # - Desktop: top navigation
│   │   │   │                                  # - Mobile: fixed bottom bar
│   │   │   │                                  # - Variant prop (desktop/mobile)
│   │   │   ├── LessonSidebar.vue          # Course content sidebar
│   │   │   └── LessonVideo.vue            # YouTube video player
│   │   ├── 📂 ui/                         # Generic UI components
│   │   │   ├── Accordion.vue
│   │   │   ├── Breadcrumb.vue
│   │   │   ├── CartDrawer.vue             # Shopping cart drawer [NEW ⭐]
│   │   │   │                                  # - Slide-out right sidebar
│   │   │   │                                  # - Guest + user cart support
│   │   │   │                                  # - Focus trap + Escape key
│   │   │   │                                  # - WCAG 2.1 AA compliant
│   │   │   ├── FormCheckbox.vue           # Accessible checkbox
│   │   │   ├── FormInput.vue              # Input with label + validation
│   │   │   │                                  # - Password visibility toggle
│   │   │   │                                  # - aria-describedby support
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── PageHero.vue
│   │   │   ├── Pagination.vue
│   │   │   ├── SearchInput.vue
│   │   │   ├── StarRating.vue
│   │   │   ├── SubmitButton.vue
│   │   │   ├── Tabs.vue
│   │   │   └── Toast.vue                  # Enhanced toast notifications [UPDATED ⭐]
│   │   ├── MainFooter.vue                 # Site-wide footer
│   │   ├── MainNav.vue                    # Main navigation [UPDATED ⭐]
│   │   │                                      # - User dropdown menu
│   │   │                                      # - Avatar with initials
│   │   │                                      # - Keyboard navigation
│   │   │                                      # - Cart button with count
│   │   └── .gitkeep
│   │
│   ├── 📂 composables/                    # Vue composables (reusable logic)
│   │   ├── useAccordion.ts
│   │   ├── useApiError.ts                 # Unified API error handling
│   │   ├── useBlog.ts
│   │   ├── useBlogFilters.ts
│   │   ├── useBlogs.ts
│   │   ├── useCart.ts                     # Cart logic [NEW ⭐]
│   │   ├── useCourse.ts
│   │   ├── useCourseFilters.ts
│   │   ├── useCourses.ts
│   │   ├── useKeyboardFocus.ts
│   │   ├── useLesson.ts                   # Lesson logic [NEW ⭐]
│   │   │                                      # - Fetches course and lessons
│   │   │                                      # - Navigation (prev/next)
│   │   │                                      # - Progress tracking
│   │   │                                      # - Bookmark functionality
│   │   ├── useLessonAccess.ts             # Lesson access control [NEW ⭐]
│   │   │                                      # - Checks if lesson is locked
│   │   │                                      # - Server-side access verification
│   │   ├── usePagination.ts
│   │   ├── useRelatedCourses.ts
│   │   ├── useToast.ts
│   │   ├── useZodValidation.ts
│   │   └── .gitkeep
│   │
│   ├── 📂 constants/                      # Application constants
│   │   └── index.ts
│   │
│   ├── 📂 layouts/                        # Layout components
│   │   ├── auth.vue                       # Authentication pages layout
│   │   ├── default.vue                    # Main application layout
│   │   ├── minimal.vue                    # Streamlined layout [NEW ⭐]
│   │   └── .gitkeep
│   │
│   ├── 📂 middleware/                     # Route middleware
│   │   ├── auth.global.ts                 # Global authentication [UPDATED ⭐]
│   │   │                                      # - Runs on ALL routes automatically
│   │   │                                      # - Fetches user session
│   │   │                                      # - Redirects based on auth state
│   │   │                                      # - requiresAuth meta support
│   │   └── .gitkeep
│   │
│   ├── 📂 pages/                          # Route pages (file-based routing)
│   │   ├── 📂 auth/                       # Authentication pages [UPDATED ⭐]
│   │   │   ├── SignIn.vue                 # Sign in form [UPDATED ⭐]
│   │   │   │                                  # - Username OR email login
│   │   │   │                                  # - WCAG 2.1 AA compliant
│   │   │   │                                  # - ARIA live regions
│   │   │   │                                  # - Password visibility toggle
│   │   │   └── SignUp.vue                 # Sign up form [UPDATED ⭐]
│   │   │                                      # - Zod validation
│   │   │                                      # - WCAG 2.1 AA compliant
│   │   │                                      # - ARIA live regions
│   │   ├── 📂 blogs/                      # Blog pages
│   │   │   ├── [slug].vue                 # Dynamic blog post
│   │   │   └── index.vue                  # Blog listing
│   │   ├── 📂 checkout/                   # Checkout flow [NEW ⭐]
│   │   │   ├── index.vue                  # Checkout page [UPDATED ⭐]
│   │   │   │                                  # - Payment simulation
│   │   │   │                                  # - Order summary
│   │   │   │                                  # - WCAG 2.1 AA + SEO
│   │   │   ├── success.vue                # Order success [UPDATED ⭐]
│   │   │   │                                  # - Order details display
│   │   │   │                                  # - LoadingSpinner component
│   │   │   │                                  # - aria-live announcements
│   │   │   └── failed.vue                 # Payment failure [UPDATED ⭐]
│   │   │                                      # - Error recovery options
│   │   │                                      # - WCAG 2.1 AA + SEO
│   │   ├── 📂 courses/                    # Course pages
│   │   │   ├── [courseSlug]/              # Dynamic course routes
│   │   │   │   ├── lessons/
│   │   │   │   │   └── [lessonSlug].vue   # Lesson viewer [NEW ⭐]
│   │   │   │   └── index.vue              # Course detail page
│   │   │   └── index.vue                  # Course listing with filters
│   │   ├── dashboard.vue                  # User dashboard
│   │   ├── home.vue                       # Homepage [UPDATED ⭐]
│   │   │                                      # - Hero section
│   │   │                                      # - Proper heading hierarchy (h1→h2→h3)
│   │   │                                      # - ARIA landmarks
│   │   │                                      # - Skip link (fixed positioning)
│   │   └── .gitkeep
│   │
│   ├── 📂 plugins/                        # Nuxt plugins
│   │   └── .gitkeep
│   │
│   ├── 📂 public/                         # Static assets (served directly)
│   │   ├── 📂 icon/
│   │   │   ├── UPST0179.png
│   │   │   ├── UPST0180.png
│   │   │   ├── UPST0181.png
│   │   │   └── UPST0182.png
│   │   └── 📂 images/
│   │       ├── banner.jpg
│   │       ├── laptop-near-whilte-book.jpg
│   │       └── placeholder-course.svg
│   │
│   ├── 📂 schemas/                        # Zod validation schemas
│   │   └── auth.ts                        # Auth form validation
│   │
│   ├── 📂 stores/                         # Pinia state management
│   │   ├── blogs.ts                       # Blog state
│   │   ├── cart.ts                        # Shopping cart [NEW ⭐]
│   │   │                                      # - Guest cart (cookie-based)
│   │   │                                      # - User cart (DB-based)
│   │   │                                      # - Cart merge on login
│   │   │                                      # - Silent merge failures
│   │   ├── courses.ts                     # Course state
│   │   ├── lesson-progress.ts             # Lesson progress [NEW ⭐]
│   │   └── user.ts                        # User authentication [UPDATED ⭐]
│   │       │                                  # - signIn/signUp/logout
│   │       │                                  # - fetchUser session
│   │       │                                  # - Toast notifications
│   │       │                                  # - readonly() exposed state
│   │       │                                  # - computed isAuthenticated
│   │
│   ├── 📂 types/                          # TypeScript type definitions
│   │   ├── 📂 components/
│   │   │   ├── accordion.ts
│   │   │   └── tabs-types.ts
│   │   ├── 📂 shared/                     # Shared API types
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── blogs.ts
│   │   │   ├── courses.ts
│   │   │   ├── lessons.ts
│   │   │   └── users.ts
│   │   ├── auth-errors.ts
│   │   ├── courses-filter.ts
│   │   └── types.ts
│   │
│   ├── 📂 utils/                          # Utility functions
│   │   ├── auth-error-handler-helpers.ts
│   │   ├── course-helpers.ts
│   │   ├── error-helpers.ts
│   │   └── text-helpers.ts
│   │
│   └── app.vue                            # Root Vue component
│
├── 📂 scripts/                            # Database & utility scripts
│   ├── add-instructors.ts
│   ├── add-lesson-progress-table.ts
│   ├── add-tags-to-existing-courses.ts
│   ├── calculate-reading-times.ts
│   ├── check-blogs.ts
│   ├── check-reading-time.ts
│   ├── check-tables.ts
│   ├── seed-blogs.ts
│   ├── setup-db.ts
│   ├── show-lessons.ts
│   ├── sync-instructors.ts
│   ├── update-blogs-batch1.ts
│   ├── update-blogs-batch2.ts
│   └── verify-lesson-progress-table.ts
│
├── 📂 server/                             # Backend (Nitro server)
│   ├── 📂 api/                            # API routes (endpoints)
│   │   ├── 📂 admin/                      # Admin endpoints [TODO - Empty]
│   │   ├── 📂 auth/                       # Authentication endpoints
│   │   │   ├── logout.post.ts             # POST /api/auth/logout
│   │   │   ├── me.get.ts                  # GET /api/auth/me
│   │   │   ├── signin.post.ts             # POST /api/auth/signin [UPDATED ⭐]
│   │   │   │                                  # - Username OR email login
│   │   │   │                                  # - JWT tokens in cookies
│   │   │   │                                  # - Remember Me (7/30 days)
│   │   │   └── signup.post.ts             # POST /api/auth/signup [UPDATED ⭐]
│   │   │                                      # - User registration
│   │   │                                      # - Password hashing
│   │   │                                      # - Auto sign-in
│   │   ├── 📂 blogs/                      # Blog CRUD endpoints
│   │   │   ├── slug/
│   │   │   │   └── [slug].get.ts
│   │   │   ├── [id].delete.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── 📂 cart/                       # Shopping cart endpoints [NEW ⭐]
│   │   │   ├── [courseId].delete.ts       # DELETE /api/cart/:courseId
│   │   │   ├── index.get.ts               # GET /api/cart
│   │   │   ├── index.post.ts              # POST /api/cart
│   │   │   └── merge.post.ts              # POST /api/cart/merge [UPDATED ⭐]
│   │   │                                      # - Merge guest cart on login
│   │   │                                      # - Silent failures
│   │   ├── 📂 checkout/                   # Checkout endpoint [NEW ⭐]
│   │   │   └── index.post.ts              # POST /api/checkout [UPDATED ⭐]
│   │   │                                      # - Payment simulation
│   │   │                                      # - Creates order + enrollments
│   │   │                                      # - Server-side validation
│   │   ├── 📂 courses/                    # Course endpoints
│   │   │   ├── [courseId]/
│   │   │   │   └── related.get.ts
│   │   │   ├── filters/
│   │   │   │   └── options.get.ts
│   │   │   ├── slug/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── lessons/
│   │   │   │   │       └── [lessonSlug].get.ts
│   │   │   │   └── [slug].get.ts
│   │   │   ├── bulk.post.ts
│   │   │   ├── count.get.ts
│   │   │   ├── filter-options.get.ts
│   │   │   └── index.get.ts
│   │   ├── 📂 orders/                     # Order endpoints [NEW ⭐]
│   │   │   ├── [id].get.ts                # GET /api/orders/:id [UPDATED ⭐]
│   │   │   │                                  # - Order details
│   │   │   │                                  # - Authorization check
│   │   │   └── index.get.ts               # GET /api/orders [UPDATED ⭐]
│   │   │                                      # - User order history
│   │   ├── 📂 progress/                   # Lesson progress endpoints [NEW ⭐]
│   │   │   ├── bookmark.post.ts           # POST /api/progress/bookmark [UPDATED ⭐]
│   │   │   │                                  # - Toggle lesson bookmark
│   │   │   ├── complete.post.ts           # POST /api/progress/complete [UPDATED ⭐]
│   │   │   │                                  # - Mark lesson complete
│   │   │   ├── index.get.ts               # GET /api/progress [UPDATED ⭐]
│   │   │   │                                  # - User's lesson progress
│   │   │   └── notes.post.ts              # POST /api/progress/notes [UPDATED ⭐]
│   │   │                                      # - Save lesson notes
│   │   └── 📂 users/                      # User endpoints
│   │       └── [id].get.ts
│   │
│   ├── 📂 data/                           # Database files
│   │   └── db.sqlite                      # SQLite database
│   │
│   ├── 📂 db/                             # Database layer
│   │   ├── blog-service.ts                # Blog database operations
│   │   ├── cart-service.ts                # Cart database operations [NEW ⭐]
│   │   │                                      # - addToCart, getCart
│   │   │                                      # - removeFromCart, mergeCarts
│   │   ├── course-service.ts              # Course database operations
│   │   ├── index.ts                       # Database connection
│   │   ├── migrate.ts                     # Migration utilities
│   │   ├── order-service.ts               # Order processing [NEW ⭐]
│   │   │                                      # - createOrder, getOrderById
│   │   │                                      # - getUserOrders, enrollUserInCourses
│   │   ├── progress-service.ts            # Progress tracking [NEW ⭐]
│   │   │                                      # - getProgress, markComplete
│   │   │                                      # - toggleBookmark, saveNotes
│   │   ├── schema.ts                      # Drizzle schema definitions [UPDATED ⭐]
│   │   │                                      # - 14 tables total
│   │   │                                      # - users (with username)
│   │   │                                      # - courses, lessons, cart_items
│   │   │                                      # - orders, enrollments, lesson_progress
│   │   │                                      # - blogs, categories, instructors
│   │   └── user-service.ts                # User database operations
│   │
│   ├── 📂 drizzle/                        # Database migrations
│   │   └── 📂 migrations/
│   │       ├── 📂 meta/                   # Migration metadata
│   │       │   ├── _journal.json
│   │       │   ├── 0000_snapshot.json
│   │       │   ├── 0001_snapshot.json
│   │       │   ├── 0002_snapshot.json
│   │       │   └── 0003_snapshot.json
│   │       ├── 0000_full_schema_update.sql
│   │       ├── 0000_lean_preak.sql
│   │       ├── 0001_seed_sample_data.sql
│   │       ├── 0001_sync_schema.sql       # Schema sync [NEW ⭐]
│   │       ├── 0002_add_slug_to_courses.sql
│   │       ├── 0002_unique_cart_enrollments_fixed.sql  # Unique constraints [NEW ⭐]
│   │       ├── 0003_mean_ezekiel_stane.sql # Username column [NEW ⭐]
│   │       │                                  # - Adds username to users
│   │       │                                  # - Makes name optional
│   │       │                                  # - Updates existing users
│   │       ├── 0003_update_schema.sql
│   │       ├── 0004_add_lesson_progress.sql
│   │       ├── 0005_create_blogs.sql
│   │       └── 0006_add_reading_time.sql
│   │
│   ├── 📂 utils/                          # Server utilities
│   │   ├── auth-helpers.ts                # Authentication helpers [UPDATED ⭐]
│   │   │                                      # - requireAuth (checks accessToken)
│   │   │                                      # - requireInstructor
│   │   ├── blog-helpers.ts
│   │   ├── course-authorization.ts
│   │   ├── course-transformer.ts
│   │   ├── format-utils.ts
│   │   ├── image-processor.ts
│   │   ├── instructor-service.ts
│   │   ├── jwt.ts                         # JWT token utilities [UPDATED ⭐]
│   │   │                                      # - Sign tokens (7/30 days)
│   │   │                                      # - Verify tokens
│   │   │                                      # - Cookie configuration
│   │   ├── related-courses.ts
│   │   ├── response.ts                    # Response helpers
│   │   ├── safe-parse.ts
│   │   └── .gitkeep
│   │
│   └── .gitkeep
│
├── 📂 .cursor/                            # Cursor IDE settings
├── 📂 .idea/                              # JetBrains IDE settings
├── 📂 .nuxt/                              # Nuxt build output (auto-generated)
├── 📂 node_modules/                       # Dependencies (auto-generated)
│
├── .env                                   # Environment variables (gitignored)
├── .env.example                           # Environment variables template
├── .eslintignore                          # ESLint ignore patterns
├── .gitignore                             # Git ignore patterns
├── .prettierignore                        # Prettier ignore patterns
├── drizzle.config.ts                      # Drizzle ORM configuration
├── eslint.config.mjs                      # ESLint configuration
├── nuxt.config.ts                         # Nuxt configuration
├── package-lock.json                      # Dependency lock file
├── package.json                           # Project metadata & dependencies
├── postcss.config.ts                      # PostCSS configuration
├── PROJECT_STRUCTURE.md                   # This file
├── QWEN.md                                # AI assistant context guidelines
├── README.md                              # Project documentation
├── tailwind.config.ts                     # Tailwind CSS configuration
├── tsconfig.json                          # TypeScript configuration
└── vitest.config.ts                       # Vitest testing configuration
```

---

## 📊 Project Statistics

| Category | Count | Description |
|----------|-------|-------------|
| **Root Config Files** | 13 | Build, lint, type-check configs |
| **Vue Components** | 36 | Reusable UI components (+10 icons, +1 LessonNav) |
| **Composables** | 15 | Reusable Vue logic (+useLessonAccess) |
| **Pages** | 13 | Route pages (+lessons/index.vue) |
| **Pinia Stores** | 5 | State management |
| **Type Definitions** | 11 | TypeScript types |
| **Utility Functions** | 4 | Client-side utils |
| **API Routes** | 35 | Server endpoints |
| **DB Services** | 6 | Database operations |
| **Server Utils** | 11 | Server-side helpers |
| **DB Migrations** | 14 | Schema migrations (14 tables) |
| **Scripts** | 14 | Database utilities |
| **Test Files** | 35 | Vitest test suite |
| **Documentation** | 3 | README, PROJECT_STRUCTURE, enroll-summary |

---

## 🆕 Recent Additions & Updates

### User Dropdown Menu in MainNav ⭐ [NEW]
**File:** `app/components/MainNav.vue`
```
✅ Avatar button with user initials
✅ Glassmorphism dropdown design
✅ Full keyboard navigation (Arrow, Enter, Space, Escape)
✅ Focus management with roving tabindex
✅ Click outside to close
✅ Menu items: Profile, My Courses, Settings, Logout
✅ ARIA attributes (role="menu", aria-expanded, etc.)
```

### Authentication Pages Accessibility ⭐ [UPDATED]
**Files:** `app/pages/auth/SignIn.vue`, `app/pages/auth/SignUp.vue`
```
✅ Visible form labels (not sr-only)
✅ Password visibility toggle with ARIA labels
✅ ARIA live regions for dynamic content
✅ aria-describedby for error messages and hints
✅ Proper heading hierarchy
✅ Authentication navigation links
✅ Semantic HTML landmarks
```

### Global Middleware Consolidation ⭐ [UPDATED]
**File:** `app/middleware/auth.global.ts`
```
✅ Renamed from auth.ts → auth.global.ts
✅ Runs automatically on ALL routes
✅ Removed redundant middleware/auth.ts
✅ Uses requiresAuth: true meta for protected pages
✅ fetchUser() runs ONCE per page load (not twice)
```

### CartDrawer Focus Management ⭐ [UPDATED]
**File:** `app/components/ui/CartDrawer.vue`
```
✅ Focus trap (Tab key cycles within drawer)
✅ Escape key closes drawer
✅ focus-visible styles on interactive elements
✅ focus-within styles on cart items
✅ Auto-focus on open
✅ Body scroll prevention
```

### Home Page Accessibility ⭐ [UPDATED]
**File:** `app/pages/home.vue`
```
✅ Skip link (fixed positioning, visible on focus)
✅ Proper heading hierarchy (h1 → h2 → h3)
✅ ARIA landmarks with aria-labelledby
✅ Section semantics (About, Classes, Trainers, etc.)
✅ Removed h1 → h5 skip violation
```

### Checkout Pages Accessibility & SEO ⭐ [UPDATED]
**Files:** `app/pages/checkout/*`
```
✅ Semantic HTML (main, section, aside, nav, ul/li)
✅ ARIA roles (list, alert, status)
✅ aria-live regions for dynamic content
✅ Focus management (auto-focus success/error headings)
✅ Unique titles and meta descriptions
✅ Open Graph tags
✅ Canonical URLs via useHead
✅ noindex, nofollow robots tags
```

### User Store Improvements ⭐ [UPDATED]
**File:** `app/stores/user.ts`
```
✅ isAuthenticated: computed (not ref)
✅ readonly() on exposed state
✅ Private setUser/clearUser actions
✅ Toast notifications for signIn/signUp/logout
✅ Loading state on logout
✅ Background cart merge (silent)
```

### Cart Store Improvements ⭐ [UPDATED]
**File:** `app/stores/cart.ts`
```
✅ Silent mergeGuestCart() failures
✅ No toast on merge (only console.warn)
✅ initializeCart() with nextTick()
✅ Removed { immediate: true } from watch
✅ Request headers captured at store level
```

### Shopping Cart System ⭐
```
✅ app/components/ui/CartDrawer.vue
✅ app/stores/cart.ts
✅ app/composables/useCart.ts
✅ server/api/cart/* (4 endpoints)
✅ server/db/cart-service.ts
✅ __tests__/api/cart.test.ts
✅ __tests__/services/cart-service.test.ts
```

### Checkout Flow ⭐
```
✅ app/pages/checkout/index.vue
✅ app/pages/checkout/success.vue
✅ app/pages/checkout/failed.vue
✅ server/api/checkout/index.post.ts
✅ server/db/order-service.ts
✅ server/api/orders/* (2 endpoints)
✅ __tests__/api/checkout.test.ts
✅ __tests__/api/orders.test.ts
✅ __tests__/services/order-service.test.ts
```

### Lesson System ⭐
```
✅ app/components/lesson/* (3 components)
✅ app/pages/courses/[courseSlug]/lessons/[lessonSlug].vue
✅ app/composables/useLesson.ts
✅ server/api/progress/* (4 endpoints)
✅ server/db/progress-service.ts
✅ app/stores/lesson-progress.ts
✅ app/types/shared/lessons.ts
```

### Enhanced Testing ⭐
```
✅ __tests__/api/ (API integration tests)
✅ __tests__/services/ (Service layer tests)
✅ __tests__/helpers/db.ts (Test database utilities)
```

### UI/UX Improvements ⭐
```
✅ app/layouts/minimal.vue
✅ app/assets/css/app.css (Utility classes: .btn-primary, .btn-secondary, .animate-fade-in)
✅ Enhanced Toast.vue with better accessibility
✅ Enhanced CartDrawer.vue with focus management & Escape key support
```

### Database Enhancements ⭐
```
✅ server/drizzle/migrations/0001_sync_schema.sql
✅ server/drizzle/migrations/0002_unique_cart_enrollments_fixed.sql
✅ server/drizzle/migrations/0003_mean_ezekiel_stane.sql (username column)
✅ Unique constraints on cart_items and enrollments tables
✅ Added username column to users (UNIQUE NOT NULL)
✅ Made name field optional
```

---

## 🏗️ Architecture Overview

### Frontend (Nuxt 4 + Vue 3)
```
┌─────────────────────────────────────────┐
│           Pages (Routing)               │
│  /home, /courses, /auth, /checkout      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Components + Composables        │
│  Reusable UI + Business Logic           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Pinia Stores                   │
│  Global State (user, cart, courses)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         API Layer ($fetch)              │
│  Client → Server Communication          │
└─────────────────────────────────────────┘
```

### Backend (Nitro Server)
```
┌─────────────────────────────────────────┐
│          API Routes                     │
│  /api/auth, /api/courses, /api/cart     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Service Layer (DB Operations)     │
│  cart-service, order-service, etc.      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Drizzle ORM + SQLite               │
│  Type-safe Database Queries             │
└─────────────────────────────────────────┘
```

---

## 🛠️ Key Features Implemented

| Feature | Status | Files |
|---------|--------|-------|
| **Authentication** | ✅ Complete | `/api/auth/*`, `useUserStore` |
| **Username Login** | ✅ Complete | Username OR email sign-in |
| **Course Browsing** | ✅ Complete | `/courses`, course filters |
| **Course Details** | ✅ Complete | `/courses/[slug]` |
| **Lesson Viewer** | ✅ Complete | Video player, progress tracking |
| **Shopping Cart** | ✅ Complete | Guest + user cart with merge |
| **Checkout** | ✅ Complete | Payment simulation (success/fail) |
| **Orders** | ✅ Complete | Order history API |
| **Lesson Progress** | ✅ Complete | Complete, bookmark, notes |
| **Blog System** | ✅ Complete | Full CRUD with SEO |
| **Reviews Display** | ⚠️ Partial | Display only (no submit) |
| **Accessibility** | ✅ WCAG 2.1 AA | All major pages |
| **SEO** | ✅ Optimized | Meta tags, Open Graph, canonical URLs |

---

## 🗑️ Removed/Deleted Files

### Removed Files:
```
❌ middleware/auth.ts                    # Merged into auth.global.ts (redundant)
```

### Reason for Removal:
- **middleware/auth.ts:** Redundant with `auth.global.ts`, was causing duplicate `fetchUser()` calls (2 API calls → 1 API call)

---

## 🔄 Data Flow

### Authentication Flow
```
SignIn/SignUp → userStore.signIn/signUp() →
  → API call → Set user in store →
  → Toast success → Cart merge (silent) →
  → Navigate to /home
```

### Cart Initialization Flow
```
App Mount → Cart Store Created → initializeCart() →
nextTick() (wait for user store) → Check isAuthenticated →
Fetch User Cart OR Guest Cart
```

### Checkout Flow
```
Cart → Checkout Page → Payment Simulation →
  → POST /api/checkout → Create Order →
  → Create Enrollments → Clear Cart →
  → Redirect to /checkout/success
```

### Cart Merge Flow (Background)
```
Login/Signup → mergeGuestCart() →
  → POST /api/cart/merge → Clear guest cookie →
  → Fetch user cart → Silent failure (no toast)
```

---

## 🔧 Important Technical Notes

### Nuxt Middleware Types
| File Name | Execution | Use Case |
|-----------|-----------|----------|
| `auth.global.ts` | Automatic (all routes) | ✅ Auth checks, session fetch |
| `requiresAuth: true` | Meta property | ✅ Protect specific pages |

### Composable Context Rule
```typescript
// ❌ Wrong - composable called inside async function
const fetchData = async () => {
  const headers = useRequestHeaders(['cookie'])  // Error!
}

// ✅ Correct - composable called at store level
const requestHeaders = import.meta.server
  ? useRequestHeaders(['cookie'])
  : {}

const fetchData = async () => {
  const response = await $fetch('/api/...', { headers: requestHeaders })
}
```

### Template Refs for Component Arrays
```typescript
// ✅ Correct - Use function approach for NuxtLink components
const menuItemElements = ref<(HTMLElement | null)[]>([])
const setMenuItemRef = (el: ComponentPublicInstance | HTMLElement | null, index: number) => {
  if (el) {
    menuItemElements.value[index] = '$el' in el ? (el.$el as HTMLElement) : el
  }
}
```

### API Calls Requiring Auth
```typescript
// Always include credentials for client-side requests
await $fetch('/api/protected', {
  headers: import.meta.server ? useRequestHeaders(['cookie']) : {},
  credentials: 'include',  // Required for client-side cookie sending
})
```

---

## 🔒 Security Measures

- ✅ JWT tokens in secure, HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ Server-side price validation (checkout)
- ✅ Authorization checks (course enrollment)
- ✅ CSRF protection considerations

---

## 🧪 Testing Strategy

```
__tests__/
├── api/              # Integration tests for API endpoints
├── services/         # Unit tests for service layer
├── components/       # Component unit tests
├── composables/      # Composable logic tests
├── stores/           # Pinia store tests
├── unit/             # General unit tests
└── helpers/          # Test utilities (db setup/cleanup)
```

---

## 📝 Database Schema

### Core Tables (14 total)

| Table | Description |
|-------|-------------|
| `users` | User accounts (username, email, password, role) |
| `instructors` | Instructor profiles |
| `courses` | Course catalog (slug, price, thumbnail) |
| `course_content_sections` | Course structure (sections) |
| `lessons` | Lesson content (video, content, slug) |
| `course_learning_objectives` | Learning goals |
| `categories` | Course categories |
| `blogs` | Blog posts (with reading time) |
| `reviews` | Course reviews |
| `cart_items` | Shopping cart (unique constraints) |
| `orders` | Order records |
| `order_items` | Order details |
| `enrollments` | User enrollments (unique constraints) |
| `lesson_progress` | Progress tracking (complete, bookmark, notes) |

### Recent Schema Changes
- **0003_mean_ezekiel_stane.sql:** Added `username` column to users (UNIQUE NOT NULL), made `name` optional
- **0002_unique_cart_enrollments_fixed.sql:** Added unique constraints to cart_items and enrollments
- **0004_add_lesson_progress.sql:** Added lesson_progress table

---

## ♿ Accessibility Checklist (COMPLETED)

- [x] SignIn/SignUp pages - WCAG 2.1 AA compliant
- [x] Checkout pages - WCAG 2.1 AA compliant
- [x] MainNav user dropdown - Full keyboard navigation
- [x] CartDrawer - Focus trap + focus-visible states
- [x] Home page - Proper heading hierarchy + ARIA landmarks
- [x] Skip link - Visible on focus, fixed positioning
- [x] All interactive elements - focus-visible states
- [x] Form inputs - Visible labels + aria-describedby
- [x] Password fields - Show/hide toggle with ARIA
- [x] LoadingSpinner - aria-live announcements
- [x] Semantic HTML - main, nav, section, article, aside

---

## 📋 TODO (User Identified Priorities)

1. [ ] Complete User Dashboard
   - [ ] My Learning page (enrolled courses)
   - [ ] Order history page
   - [ ] Profile management
2. [ ] Review Submission System
   - [ ] API endpoints for reviews
   - [ ] Review form component
   - [ ] Display in course details
3. [ ] Admin Panel
   - [ ] Course management
   - [ ] User management
   - [ ] Order management
4. [ ] Quiz/Assessment System
   - [ ] Quiz schema
   - [ ] Quiz components
   - [ ] Progress tracking
5. [ ] Certificate Generation
   - [ ] PDF generation
   - [ ] Download on completion

---

## 🆕 Latest Session Updates (February 25, 2026) ⭐

### Lesson Page Refactoring ⭐ [NEW]
**Files:** `app/pages/courses/[courseSlug]/lessons/[lessonSlug].vue`, `app/components/lesson/LessonNav.vue`
```
✅ Extracted navigation to LessonNav component
✅ Merged two-layer loading/error states into single combined state
✅ Used emit instead of function props (toggle-complete)
✅ Added ClientOnly wrapper for SSR compatibility
✅ Reduced page from ~763 lines to ~420 lines (45% reduction)
```

### Icon Components System ⭐ [NEW]
**Directory:** `app/components/icons/`
```
✅ Created 10 reusable icon components:
   - IconAlertCircle, IconBookmark, IconCalendar, IconCheckCircle
   - IconChevronLeft, IconChevronRight, IconClock, IconLock
   - IconShare, IconSpinner
✅ All icons use w-6 h-6 classes (Tailwind standard)
✅ stroke="currentColor" for color inheritance
✅ Proper viewBox and SVG path data
```

### Responsive Navigation Fix ⭐ [NEW]
**File:** `app/components/lesson/LessonNav.vue`
```
✅ Added variant prop ('desktop' | 'mobile')
✅ Desktop nav: positioned at TOP of page content
✅ Mobile nav: fixed bottom bar (lg:hidden wrapper)
✅ Two instances in page with proper DOM locations
✅ Proper responsive visibility (hidden lg:block / lg:hidden)
```

### Bug Fixes ⭐ [NEW]
**Files:** `app/pages/courses/[courseSlug]/lessons/index.vue`
```
✅ Fixed hasNoLessons to use flatMap for counting actual lessons
✅ Simplified error message handling (String(error.value))
✅ Improved guard comment clarity
✅ Fixed CourseCard thumbnail type error (null → undefined)
```

---

**Last Updated:** February 25, 2026
**Version:** 2.1.0
**Total Commits:** 30+ ahead of `origin/main`
