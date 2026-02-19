# Online Learning Platform - Project Structure

## Overview
Comprehensive documentation of the project structure for the Online Learning Platform built with **Nuxt 4**, **Vue 3**, **TypeScript**, **Tailwind CSS**, **Pinia**, **SQLite** with **Drizzle ORM**, and **Vitest** for testing.

**Last Updated:** February 18, 2026

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
│   │   ├── 📂 lesson/                     # Lesson components [NEW ⭐]
│   │   │   ├── LessonContent.vue
│   │   │   ├── LessonSidebar.vue
│   │   │   └── LessonVideo.vue            # YouTube video player
│   │   ├── 📂 ui/                         # Generic UI components
│   │   │   ├── Accordion.vue
│   │   │   ├── Breadcrumb.vue
│   │   │   ├── CartDrawer.vue             # Shopping cart drawer [NEW ⭐]
│   │   │   ├── FormCheckbox.vue
│   │   │   ├── FormInput.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── PageHero.vue
│   │   │   ├── Pagination.vue
│   │   │   ├── SearchInput.vue
│   │   │   ├── StarRating.vue
│   │   │   ├── SubmitButton.vue
│   │   │   ├── Tabs.vue
│   │   │   └── Toast.vue                  # Enhanced toast notifications [UPDATED ⭐]
│   │   ├── MainFooter.vue
│   │   ├── MainNav.vue
│   │   └── .gitkeep
│   │
│   ├── 📂 composables/                    # Vue composables (reusable logic)
│   │   ├── useAccordion.ts
│   │   ├── useApiError.ts
│   │   ├── useBlog.ts
│   │   ├── useBlogFilters.ts
│   │   ├── useBlogs.ts
│   │   ├── useCart.ts                     # Cart logic [NEW ⭐]
│   │   ├── useCourse.ts
│   │   ├── useCourseFilters.ts
│   │   ├── useCourses.ts
│   │   ├── useKeyboardFocus.ts
│   │   ├── useLesson.ts                   # Lesson logic [NEW ⭐]
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
│   │   ├── auth.ts                        # Authentication guard
│   │   └── .gitkeep
│   │
│   ├── 📂 pages/                          # Route pages (file-based routing)
│   │   ├── 📂 auth/                       # Authentication pages
│   │   │   ├── SignIn.vue
│   │   │   └── SignUp.vue
│   │   ├── 📂 blogs/                      # Blog pages
│   │   │   ├── [slug].vue                 # Dynamic blog post
│   │   │   └── index.vue                  # Blog listing
│   │   ├── 📂 checkout/                   # Checkout flow [NEW ⭐]
│   │   │   ├── index.vue                  # Checkout page with payment simulation
│   │   │   ├── success.vue                # Order success confirmation
│   │   │   └── failed.vue                 # Payment failure page
│   │   ├── 📂 courses/                    # Course pages
│   │   │   ├── [courseSlug]/              # Dynamic course routes
│   │   │   │   ├── lessons/
│   │   │   │   │   └── [lessonSlug].vue   # Lesson viewer [NEW ⭐]
│   │   │   │   └── index.vue              # Course detail page
│   │   │   └── index.vue                  # Course listing with filters
│   │   ├── dashboard.vue                  # User dashboard
│   │   ├── home.vue                       # Homepage
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
│   │   ├── cart.ts                        # Shopping cart state [NEW ⭐]
│   │   ├── courses.ts                     # Course state
│   │   ├── lesson-progress.ts             # Lesson progress tracking [NEW ⭐]
│   │   └── user.ts                        # User authentication state
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
│   │   │   ├── logout.post.ts
│   │   │   ├── me.get.ts
│   │   │   ├── signin.post.ts
│   │   │   └── signup.post.ts
│   │   ├── 📂 blogs/                      # Blog CRUD endpoints
│   │   │   ├── slug/
│   │   │   │   └── [slug].get.ts
│   │   │   ├── [id].delete.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── 📂 cart/                       # Shopping cart endpoints [NEW ⭐]
│   │   │   ├── [courseId].delete.ts       # Remove from cart
│   │   │   ├── index.get.ts               # Get cart items
│   │   │   ├── index.post.ts              # Add to cart
│   │   │   └── merge.post.ts              # Merge guest cart on login
│   │   ├── 📂 checkout/                   # Checkout endpoint [NEW ⭐]
│   │   │   └── index.post.ts              # Process checkout with simulation
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
│   │   │   ├── [id].get.ts                # Get order details
│   │   │   └── index.get.ts               # Get user orders
│   │   ├── 📂 progress/                   # Lesson progress endpoints [NEW ⭐]
│   │   │   ├── bookmark.post.ts           # Toggle bookmark
│   │   │   ├── complete.post.ts           # Mark lesson complete
│   │   │   ├── index.get.ts               # Get user progress
│   │   │   └── notes.post.ts              # Save lesson notes
│   │   └── 📂 users/                      # User endpoints
│   │       └── [id].get.ts
│   │
│   ├── 📂 data/                           # Database files
│   │   └── db.sqlite                      # SQLite database
│   │
│   ├── 📂 db/                             # Database layer
│   │   ├── blog-service.ts                # Blog database operations
│   │   ├── cart-service.ts                # Cart database operations [NEW ⭐]
│   │   ├── course-service.ts              # Course database operations
│   │   ├── index.ts                       # Database connection
│   │   ├── migrate.ts                     # Migration utilities
│   │   ├── order-service.ts               # Order processing [NEW ⭐]
│   │   ├── progress-service.ts            # Progress tracking [NEW ⭐]
│   │   ├── schema.ts                      # Drizzle schema definitions
│   │   └── user-service.ts                # User database operations
│   │
│   ├── 📂 drizzle/                        # Database migrations
│   │   └── 📂 migrations/
│   │       ├── 📂 meta/                   # Migration metadata
│   │       │   ├── _journal.json
│   │       │   ├── 0000_snapshot.json
│   │       │   ├── 0001_snapshot.json
│   │       │   └── 0002_snapshot.json
│   │       ├── 0000_full_schema_update.sql
│   │       ├── 0000_lean_preak.sql
│   │       ├── 0001_seed_sample_data.sql
│   │       ├── 0001_sync_schema.sql       # Schema sync [NEW ⭐]
│   │       ├── 0002_add_slug_to_courses.sql
│   │       ├── 0002_unique_cart_enrollments_fixed.sql  # Unique constraints [NEW ⭐]
│   │       ├── 0003_update_schema.sql
│   │       ├── 0004_add_lesson_progress.sql
│   │       ├── 0005_create_blogs.sql
│   │       └── 0006_add_reading_time.sql
│   │
│   ├── 📂 utils/                          # Server utilities
│   │   ├── auth-helpers.ts                # Authentication helpers
│   │   ├── blog-helpers.ts
│   │   ├── course-authorization.ts
│   │   ├── course-transformer.ts
│   │   ├── format-utils.ts
│   │   ├── image-processor.ts
│   │   ├── instructor-service.ts
│   │   ├── jwt.ts                         # JWT token utilities
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
| **Vue Components** | 22 | Reusable UI components |
| **Composables** | 13 | Reusable Vue logic |
| **Pages** | 12 | Route pages |
| **Pinia Stores** | 5 | State management |
| **Type Definitions** | 11 | TypeScript types |
| **Utility Functions** | 4 | Client-side utils |
| **API Routes** | 35 | Server endpoints |
| **DB Services** | 8 | Database operations |
| **Server Utils** | 11 | Server-side helpers |
| **DB Migrations** | 14 | Schema migrations |
| **Scripts** | 14 | Database utilities |
| **Test Files** | 37 | Vitest test suite |

---

## 🆕 Recent Additions (Since Initial Setup)

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
✅ Unique constraints on cart_items and enrollments tables
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
| **Course Browsing** | ✅ Complete | `/courses`, course filters |
| **Course Details** | ✅ Complete | `/courses/[slug]` |
| **Lesson Viewer** | ✅ Complete | Video player, progress tracking |
| **Shopping Cart** | ✅ Complete | Guest + user cart with merge |
| **Checkout** | ✅ Complete | Payment simulation (success/fail) |
| **Orders** | ✅ Complete | Order history API |
| **Lesson Progress** | ✅ Complete | Complete, bookmark, notes |
| **Blog System** | ✅ Complete | Full CRUD with SEO |
| **Reviews Display** | ✅ Partial | Display only (no submit) |
---

## 🔄 Data Flow

1. **User Action** → Component/Composable
2. **State Update** → Pinia Store
3. **API Call** → `$fetch()` → Server API Route
4. **Business Logic** → Service Layer
5. **Database** → Drizzle ORM → SQLite
6. **Response** → Transform → Update Store
7. **UI Update** → Component re-renders

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

### Core Tables
- `users` - User accounts
- `instructors` - Instructor profiles
- `courses` - Course catalog
- `course_content_sections` - Course structure
- `lessons` - Lesson content
- `course_learning_objectives` - Learning goals
- `categories` - Course categories
- `blogs` - Blog posts
- `reviews` - Course reviews
- `cart_items` - Shopping cart
- `orders` - Order records
- `order_items` - Order details
- `enrollments` - User enrollments
- `lesson_progress` - Progress tracking

**Last Updated:** February 18, 2026  
**Version:** 1.2.0
