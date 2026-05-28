```markdown
# {{ SITE_NAME }} - Project Structure

## Overview
Comprehensive documentation of the project structure for the Online Learning Platform built with **Nuxt 4**, **Vue 3**, **TypeScript**, **Tailwind CSS**, **Pinia**, **SQLite** with **Drizzle ORM**, and **Vitest** for testing.

**Last Updated:** May 18, 2026
**Version:** 2.10.0

---

## 📁 Complete Directory Structure

```
online-learning-platform/
│
├── 📂 __tests__/                          # Test suite (Vitest)
│   ├── 📂 api/                            # API endpoint tests
│   │   ├── cart.test.ts                   # Cart API tests
│   │   ├── checkout.test.ts               # Checkout API tests
│   │   └── orders.test.ts                 # Orders API tests
│   ├── 📂 components/                     # Component tests
│   │   ├── LessonContent.test.ts
│   │   └── LessonVideo.test.ts
│   ├── 📂 composables/                    # Composable tests
│   │   ├── useLesson.test.ts
│   │   └── useToast.test.ts
│   ├── 📂 helpers/                        # Test helpers
│   │   └── db.ts                          # Database setup/cleanup for tests
│   ├── 📂 services/                       # Service layer tests
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
│   ├── DashboardStatsCard.spec.ts         # Stats card tests
│   ├── EmptyState.spec.ts                 # Empty state tests
│   ├── ErrorState.spec.ts                 # Error state tests
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
│   │   │   ├── app.css                    # Main styles + utility classes
│   │   │   └── fonts.css                  # Font configurations
│   │   └── .gitkeep
│   │
│   ├── 📂 components/                     # Reusable Vue components
│   │   ├── 📂 admin/                      # Admin-specific components
│   │   │   ├── AdminTabs.vue              # Admin navigation tabs
│   │   │   │                              # - Role-based tab visibility
│   │   │   │                              # - Active state based on route
│   │   │   │                              # - Uses Tabs.vue for UI & a11y
│   │   │   └── CourseForm.vue             # Unified create/edit form
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
│   │   ├── 📂 dashboard/                  # Dashboard components
│   │   │   ├── DashboardContinueLearningCard.vue   # Continue learning progress card
│   │   │   │                                      # - Last accessed lesson
│   │   │   │                                      # - Progress bar with percentage
│   │   │   │                                      # - Thumbnail + course details
│   │   │   ├── DashboardCourseCard.vue    # Course grid card
│   │   │   │                              # - Progress tracking
│   │   │   │                              # - Completion badge
│   │   │   │                              # - Continue/Review button
│   │   │   └── DashboardStatsCard.vue     # Animated statistics card
│   │   │                                  # - Animated counter (0→value)
│   │   │                                  # - Color-coded icons
│   │   │                                  # - Hover effects
│   │   ├── 📂 icons/                      # Icon components
│   │   │   ├── IconAlertCircle.vue        # Error/alert icon
│   │   │   ├── IconArrowRight.vue         # Right arrow for CTAs
│   │   │   ├── IconBookOpen.vue           # Book/open book icon
│   │   │   ├── IconBookmark.vue           # Bookmark/save icon
│   │   │   ├── IconCalendar.vue           # Date/calendar icon
│   │   │   ├── IconCheckCircle.vue        # Success/check icon
│   │   │   ├── IconChevronLeft.vue        # Left arrow navigation
│   │   │   ├── IconChevronRight.vue       # Right arrow navigation
│   │   │   ├── IconClock.vue              # Time/duration icon
│   │   │   ├── IconLock.vue               # Lock/security icon
│   │   │   ├── IconPlus.vue               # Plus/Add icon
│   │   │   ├── IconShare.vue              # Share icon
│   │   │   ├── IconSpinner.vue            # Loading spinner
│   │   │   └── IconUsers.vue              # User management icon
│   │   ├── 📂 lesson/                     # Lesson components
│   │   │   ├── LessonContent.vue          # Lesson text content
│   │   │   ├── LessonNav.vue              # Lesson navigation (prev/next/complete)
│   │   │   │                              # - Desktop: top navigation
│   │   │   │                              # - Mobile: fixed bottom bar
│   │   │   │                              # - Variant prop (desktop/mobile)
│   │   │   ├── LessonSidebar.vue          # Course content sidebar
│   │   │   └── LessonVideo.vue            # YouTube video player
│   │   ├── 📂 ui/                         # Generic UI components
│   │   │   ├── Accordion.vue
│   │   │   ├── Breadcrumb.vue
│   │   │   ├── CartDrawer.vue             # Shopping cart drawer
│   │   │   │                              # - Slide-out right sidebar
│   │   │   │                              # - Guest + user cart support
│   │   │   │                              # - Focus trap + Escape key
│   │   │   │                              # - WCAG 2.1 AA compliant
│   │   │   ├── ConfirmModal.vue           # Delete confirmation modal
│   │   │   │                              # - Accessible alertdialog
│   │   │   │                              # - Focus trap & Escape key
│   │   │   │                              # - Danger variant for destructive actions
│   │   │   │                              # - Focus-visible outlines
│   │   │   ├── EmptyState.vue             # Reusable empty state
│   │   │   │                              # - Slot-based icon system
│   │   │   │                              # - role="status" + aria-live
│   │   │   │                              # - Action button/link support
│   │   │   │                              # - WCAG 2.1 AA compliant
│   │   │   ├── ErrorState.vue             # Reusable error state
│   │   │   │                              # - Retry button with callback
│   │   │   │                              # - role="alert" for announcements
│   │   │   │                              # - Optional id prop
│   │   │   ├── FormCheckbox.vue           # Accessible checkbox
│   │   │   ├── FormInput.vue              # Input with label + validation
│   │   │   │                              # - Password visibility toggle
│   │   │   │                              # - aria-describedby support
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── PageHero.vue
│   │   │   ├── Pagination.vue
│   │   │   ├── SearchInput.vue            # Unified search component
│   │   │   ├── StarRating.vue
│   │   │   ├── SubmitButton.vue
│   │   │   ├── Tabs.vue
│   │   │   └── Toast.vue                  # Enhanced toast notifications
│   │   ├── MainFooter.vue                 # Site-wide footer [UPDATED ⭐]
│   │   │                                  # - Responsive grid layout
│   │   │                                  # - Border-top separator
│   │   │                                  # - Role‑based quick links from useNavigationLinks
│   │   │                                  # - Improved accessibility (sections, aria-labelledby)
│   │   ├── MainNav.vue                    # Main navigation [UPDATED ⭐]
│   │   │                                  # - Responsive hamburger menu with backdrop
│   │   │                                  # - Mobile menu teleported to body for full coverage
│   │   │                                  # - Active link detection with nested routes
│   │   │                                  # - Dynamic dropdown menu items
│   │   │                                  # - Sticky background on scroll
│   │   │                                  # - No `any` types in template refs
│   │   └── .gitkeep
│   │
│   ├── 📂 composables/                    # Vue composables (reusable logic)
│   │   ├── useAccordion.ts
│   │   ├── useApiError.ts                 # Unified API error handling
│   │   ├── useBlog.ts
│   │   ├── useBlogFilters.ts
│   │   ├── useBlogs.ts
│   │   ├── useCart.ts                     # Cart logic
│   │   ├── useCourse.ts
│   │   ├── useCourseFilters.ts
│   │   ├── useCourses.ts
│   │   ├── useDashboard.ts                # Dashboard data logic
│   │   ├── useKeyboardFocus.ts
│   │   ├── useLesson.ts                   # Lesson logic
│   │   │                                  # - Fetches course and lessons
│   │   │                                  # - Navigation (prev/next)
│   │   │                                  # - Progress tracking
│   │   │                                  # - Bookmark functionality
│   │   ├── useLessonAccess.ts             # Lesson access control
│   │   │                                  # - Checks if lesson is locked
│   │   │                                  # - Server-side access verification
│   │   ├── useNavigationLinks.ts          # Shared navigation links [NEW ⭐]
│   │   │                                  # - Role-based main menu links
│   │   │                                  # - Used by MainNav and MainFooter
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
│   │   ├── minimal.vue                    # Streamlined layout
│   │   └── .gitkeep
│   │
│   ├── 📂 middleware/                     # Route middleware
│   │   ├── admin.ts                       # Admin route protection
│   │   │                                  # - Checks user role ∈ {admin, superadmin, instructor}
│   │   │                                  # - Blocks /admin/users for instructors
│   │   │                                  # - Redirects based on role & path
│   │   ├── auth.global.ts                 # Global authentication
│   │   │                                  # - Runs on ALL routes automatically
│   │   │                                  # - Fast path for unauthenticated → redirect to /auth/signin
│   │   │                                  # - Toast notification when redirected from protected page
│   │   │                                  # - Fetches user session + enrollments
│   │   └── .gitkeep
│   │
│   ├── 📂 pages/                          # Route pages (file-based routing)
│   │   ├── 📂 admin/                      # Admin pages
│   │   │   ├── 📂 courses/
│   │   │   │   ├── create.vue             # Create new course page (admin/instructor)
│   │   │   │   └── [id]/
│   │   │   │       └── edit.vue           # Edit course page (admin/instructor)
│   │   │   ├── 📂 users/                  # User management
│   │   │   │   └── index.vue              # Admin user dashboard
│   │   │   └── index.vue                  # Unified course dashboard
│   │   │                                  # - Title adapts per role
│   │   │                                  # - Includes AdminTabs navigation
│   │   │                                  # - Instructors see their courses only
│   │   ├── 📂 auth/                       # Authentication pages
│   │   │   ├── SignIn.vue                 # Sign in form
│   │   │   │                              # - Username OR email login
│   │   │   │                              # - WCAG 2.1 AA compliant
│   │   │   │                              # - ARIA live regions
│   │   │   │                              # - Password visibility toggle
│   │   │   │                              # - Shows toast on auth-required redirect
│   │   │   └── SignUp.vue                 # Sign up form
│   │   │                                  # - Zod validation
│   │   │                                  # - WCAG 2.1 AA compliant
│   │   │                                  # - ARIA live regions
│   │   ├── 📂 blogs/                      # Blog pages
│   │   │   ├── [slug].vue                 # Dynamic blog post
│   │   │   └── index.vue                  # Blog listing
│   │   ├── 📂 checkout/                   # Checkout flow
│   │   │   ├── index.vue                  # Checkout page
│   │   │   │                              # - Payment simulation
│   │   │   │                              # - Order summary
│   │   │   │                              # - WCAG 2.1 AA + SEO
│   │   │   ├── success.vue                # Order success
│   │   │   │                              # - Order details display
│   │   │   │                              # - LoadingSpinner component
│   │   │   │                              # - aria-live announcements
│   │   │   └── failed.vue                 # Payment failure
│   │   │                                  # - Error recovery options
│   │   │                                  # - WCAG 2.1 AA + SEO
│   │   ├── 📂 courses/                    # Course pages
│   │   │   ├── [courseSlug]/              # Dynamic course routes
│   │   │   │   ├── lessons/
│   │   │   │   │   └── [lessonSlug].vue   # Lesson viewer
│   │   │   │   └── index.vue              # Course detail page
│   │   │   └── index.vue                  # Course listing with filters
│   │   ├── about.vue                      # About Us page [NEW ⭐]
│   │   │                                  # - Introduction, mission, values
│   │   │                                  # - PageHero with breadcrumb
│   │   │                                  # - Responsive grid for values
│   │   │                                  # - SEO meta tags
│   │   ├── dashboard.vue                  # User dashboard
│   │   │                                  # - Learning statistics (animated counters)
│   │   │                                  # - Continue learning section
│   │   │                                  # - My courses grid with progress
│   │   │                                  # - Bookmarked lessons list
│   │   │                                  # - Recent orders (desktop/mobile)
│   │   │                                  # - Empty state with CTA
│   │   │                                  # - Skip link + main landmark
│   │   │                                  # - WCAG 2.1 AA compliant
│   │   ├── home.vue                       # Homepage
│   │   │                                  # - Hero section
│   │   │                                  # - Proper heading hierarchy (h1→h2→h3)
│   │   │                                  # - ARIA landmarks
│   │   │                                  # - Skip link (fixed positioning)
│   │   ├── profile.vue                    # User profile page
│   │   │                                  # - Account details (username, email, role)
│   │   │                                  # - Change password form with Zod validation
│   │   │                                  # - uses useZodValidation composable
│   │   │                                  # - requiresAuth: true via definePageMeta
│   │   ├── error.vue                      # Global error page
│   │   │                                  # - 404 and 500 error handling
│   │   │                                  # - WCAG 2.1 AA compliant
│   │   │                                  # - aria-labelledby landmark
│   │   │                                  # - noindex, nofollow SEO
│   │   │                                  # - Simplified, clean design
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
│   │   ├── auth.ts                        # Auth form validation
│   │   │                                  # - signInSchema, signUpSchema
│   │   │                                  # - changePasswordSchema
│   │   └── admin.ts                       # Course form & user update validation
│   │
│   ├── 📂 stores/                         # Pinia state management
│   │   ├── blogs.ts                       # Blog state
│   │   ├── cart.ts                        # Shopping cart
│   │   │                                  # - Guest cart (cookie-based)
│   │   │                                  # - User cart (DB-based)
│   │   │                                  # - Cart merge on login
│   │   │                                  # - Silent merge failures
│   │   │                                  # - Fixed client‑only init & watcher scope
│   │   ├── courses.ts                     # Course state
│   │   ├── lesson-progress.ts             # Lesson progress
│   │   └── user.ts                        # User authentication
│   │                                      # - signIn/signUp/logout
│   │                                      # - fetchUser session
│   │                                      # - Toast notifications
│   │                                      # - readonly() exposed state
│   │                                      # - computed isAuthenticated
│   │
│   ├── 📂 types/                          # TypeScript type definitions
│   │   ├── 📂 admin/                      # Admin-specific types
│   │   │   └── course-form.ts             # Course form data types
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
│   ├── make-super-admin.ts                # Super admin promotion script
│   ├── migrate-user-roles.ts              # User role migration (user → student)
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
│   │   ├── 📂 admin/                      # Admin endpoints
│   │   │   ├── 📂 courses/                # Course management
│   │   │   │   ├── [id].delete.ts         # DELETE /api/admin/courses/:id (smart filter)
│   │   │   │   ├── [id].put.ts            # PUT /api/admin/courses/:id (ownership check)
│   │   │   │   ├── [id].get.ts            # GET /api/admin/courses/:id (ownership check)
│   │   │   │   ├── index.get.ts           # GET /api/admin/courses (auto‑filter for instructor)
│   │   │   │   └── index.post.ts          # POST /api/admin/courses (auto‑set instructorId)
│   │   │   └── 📂 users/                  # User management
│   │   │       ├── [id].delete.ts         # DELETE /api/admin/users/:id (superadmin only for admins)
│   │   │       ├── [id].put.ts            # PUT /api/admin/users/:id (role change + auto-create instructor)
│   │   │       └── index.get.ts           # GET /api/admin/users
│   │   ├── 📂 auth/                       # Authentication endpoints
│   │   │   ├── logout.post.ts             # POST /api/auth/logout
│   │   │   ├── me.get.ts                  # GET /api/auth/me
│   │   │   ├── signin.post.ts             # POST /api/auth/signin
│   │   │   │                              # - Username OR email login
│   │   │   │                              # - JWT tokens in cookies
│   │   │   │                              # - Remember Me (7/30 days)
│   │   │   ├── signup.post.ts             # POST /api/auth/signup
│   │   │   │                              # - User registration
│   │   │   │                              # - Password hashing
│   │   │   │                              # - Auto sign-in
│   │   │   └── change-password.post.ts    # POST /api/auth/change-password
│   │   │                                  # - Authenticated password change
│   │   │                                  # - Verifies current password
│   │   │                                  # - Hashes and stores new password
│   │   ├── 📂 blogs/                      # Blog CRUD endpoints
│   │   │   ├── slug/
│   │   │   │   └── [slug].get.ts
│   │   │   ├── [id].delete.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── 📂 cart/                       # Shopping cart endpoints
│   │   │   ├── [courseId].delete.ts       # DELETE /api/cart/:courseId
│   │   │   ├── index.get.ts               # GET /api/cart
│   │   │   ├── index.post.ts              # POST /api/cart
│   │   │   └── merge.post.ts              # POST /api/cart/merge
│   │   │                                  # - Merge guest cart on login
│   │   │                                  # - Silent failures
│   │   ├── 📂 checkout/                   # Checkout endpoint
│   │   │   └── index.post.ts              # POST /api/checkout
│   │   │                                  # - Payment simulation
│   │   │                                  # - Creates order + enrollments
│   │   │                                  # - Server-side validation
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
│   │   ├── 📂 dashboard/                  # Dashboard endpoint
│   │   │   └── index.get.ts               # GET /api/dashboard
│   │   ├── 📂 enrollments/                # Enrollment endpoints
│   │   │   └── my.get.ts                  # GET /api/enrollments/my
│   │   ├── 📂 orders/                     # Order endpoints
│   │   │   ├── [id].get.ts                # GET /api/orders/:id
│   │   │   │                              # - Order details
│   │   │   │                              # - Authorization check
│   │   │   └── index.get.ts               # GET /api/orders
│   │   │                                  # - User order history
│   │   ├── 📂 progress/                   # Lesson progress endpoints
│   │   │   ├── bookmark.post.ts           # POST /api/progress/bookmark
│   │   │   │                              # - Toggle lesson bookmark
│   │   │   ├── complete.post.ts           # POST /api/progress/complete
│   │   │   │                              # - Mark lesson complete
│   │   │   ├── index.get.ts               # GET /api/progress
│   │   │   │                              # - User's lesson progress
│   │   │   └── notes.post.ts              # POST /api/progress/notes
│   │   │                                  # - Save lesson notes
│   │   └── 📂 users/                      # User endpoints
│   │       └── [id].get.ts
│   │
│   ├── 📂 data/                           # Database files
│   │   └── db.sqlite                      # SQLite database
│   │
│   ├── 📂 db/                             # Database layer
│   │   ├── blog-service.ts                # Blog database operations
│   │   ├── cart-service.ts                # Cart database operations
│   │   │                                  # - addToCart, getCart
│   │   │                                  # - removeFromCart, mergeCarts
│   │   ├── course-service.ts              # Course database operations
│   │   ├── index.ts                       # Database connection
│   │   ├── migrate.ts                     # Migration utilities
│   │   ├── order-service.ts               # Order processing
│   │   │                                  # - createOrder, getOrderById
│   │   │                                  # - getUserOrders, enrollUserInCourses
│   │   ├── progress-service.ts            # Progress tracking
│   │   │                                  # - getProgress, markComplete
│   │   │                                  # - toggleBookmark, saveNotes
│   │   ├── schema.ts                      # Drizzle schema definitions
│   │   │                                  # - 14 tables total
│   │   │                                  # - users (with username)
│   │   │                                  # - courses, lessons, cart_items
│   │   │                                  # - orders, enrollments, lesson_progress
│   │   │                                  # - blogs, categories, instructors
│   │   └── user-service.ts                # User database operations
│   │                                      # - createUser, findByUsernameOrEmail, findById
│   │                                      # - verifyPassword, hashPassword
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
│   │       ├── 0001_sync_schema.sql       # Schema sync
│   │       ├── 0002_add_slug_to_courses.sql
│   │       ├── 0002_unique_cart_enrollments_fixed.sql  # Unique constraints
│   │       ├── 0003_mean_ezekiel_stane.sql # Username column
│   │       │                              # - Adds username to users
│   │       │                              # - Makes name optional
│   │       │                              # - Updates existing users
│   │       ├── 0003_update_schema.sql
│   │       ├── 0004_add_lesson_progress.sql
│   │       ├── 0005_create_blogs.sql
│   │       └── 0006_add_reading_time.sql
│   │
│   ├── 📂 utils/                          # Server utilities
│   │   ├── auth-helpers.ts                # Authentication helpers
│   │   │                                  # - requireAuth (checks accessToken)
│   │   │                                  # - requireInstructor (accepts superadmin)
│   │   ├── blog-helpers.ts
│   │   ├── course-authorization.ts
│   │   ├── course-transformer.ts
│   │   ├── format-utils.ts
│   │   ├── image-processor.ts
│   │   ├── instructor-service.ts
│   │   ├── jwt.ts                         # JWT token utilities
│   │   │                                  # - Sign tokens (7/30 days)
│   │   │                                  # - Verify tokens
│   │   │                                  # - Cookie configuration
│   │   ├── lesson-access.ts               # Lesson access check
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
├── enroll-summary.md                      # Enrollment summary documentation
├── eslint.config.mjs                      # ESLint configuration
├── GEMINI.md                              # Gemini CLI project context
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
| **Root Config Files** | 15 | Build, lint, type-check configs (+GEMINI.md, enroll-summary) |
| **Vue Components** | 44 | Reusable UI components |
| **Composables** | 18 | Reusable Vue logic (+useNavigationLinks) |
| **Pages** | 18 | Route pages (+about.vue) |
| **Pinia Stores** | 5 | State management |
| **Type Definitions** | 12 | TypeScript types (+admin/course-form.ts) |
| **Utility Functions** | 4 | Client-side utils |
| **API Routes** | 51 | Server endpoints (+change-password) |
| **DB Services** | 7 | Database operations |
| **Server Utils** | 12 | Server-side helpers |
| **DB Migrations** | 14 | Schema migrations (14 tables) |
| **Scripts** | 16 | Database utilities |
| **Test Files** | 38 | Vitest test suite |
| **Documentation** | 5 | README, PROJECT_STRUCTURE, enroll-summary, PROJECT_SUMMARY, GEMINI.md |

---

## 🆕 Latest Session Updates (May 18, 2026) ⭐ [NEW]

### Responsive MainNav & MainFooter ⭐ [NEW]
**Files:** `app/components/MainNav.vue`, `app/components/MainFooter.vue`, `app/composables/useNavigationLinks.ts`
```
✅ MainNav fully responsive with hamburger menu, backdrop, and Teleport
✅ Active link styling for nested routes (e.g., /admin/courses)
✅ Dynamic user dropdown menu items
✅ Removed all `any` types from template refs via higher‑order function
✅ MainFooter converted to responsive grid with border‑top separator
✅ Quick links in footer dynamically generated from shared composable
✅ Extracted navigation link logic into reusable `useNavigationLinks` composable
✅ Both components share the same role‑based link set
```

### About Page ⭐ [NEW]
**File:** `app/pages/about.vue`
```
✅ New standalone About Us page with PageHero and breadcrumb
✅ Sections for Introduction, Mission, and Values
✅ Responsive grid layout for values
✅ SEO meta tags and accessibility labels
✅ Linked from MainNav and MainFooter
```

### User Profile Page ⭐ [PREVIOUS]
**Files:** `app/pages/profile.vue`, `server/api/auth/change-password.post.ts`, `app/schemas/auth.ts`, `server/db/user-service.ts`
```
✅ Profile page with account details and password change form
✅ Zod validation via useZodValidation composable
✅ Submit button disabled until form is valid
✅ Server endpoint for authenticated password change
```

### Auth Redirect with Toast Notification ⭐ [PREVIOUS]
**Files:** `app/middleware/auth.global.ts`, `app/pages/auth/SignIn.vue`
```
✅ Fast path for unauthenticated users eliminates 5-6s delay
✅ Toast message shown after redirect to sign-in page
```

### Admin Navigation Tabs ⭐ [PREVIOUS]
**File:** `app/components/admin/AdminTabs.vue`
```
✅ Role‑based tabs (Courses / Users) using existing Tabs.vue component
```

### Client‑Side Navigation Bug Fix ⭐ [PREVIOUS]
**Files:** `app/pages/admin/index.vue`, `app/stores/cart.ts`
```
✅ Fixed "Cannot read properties of undefined (reading 'dispose')" error
✅ Resolved client‑side navigation failure to /admin/courses/create
```

### Unified Course Management Page ⭐ [PREVIOUS]
**File:** `app/pages/admin/index.vue`
```
✅ Single page for both admins and instructors
✅ Dynamic title and smart API filtering
✅ Integrated AdminTabs
```

---

## ♿ Accessibility Checklist (UPDATED)

- [x] SignIn/SignUp pages - WCAG 2.1 AA compliant
- [x] Checkout pages - WCAG 2.1 AA compliant
- [x] MainNav responsive hamburger menu - ARIA attributes, keyboard navigation
- [x] MainFooter - semantic sections with aria‑labelledby
- [x] CartDrawer - Focus trap + focus-visible states
- [x] Home page - Proper heading hierarchy + ARIA landmarks
- [x] Skip link - Visible on focus, fixed positioning
- [x] All interactive elements - focus-visible states
- [x] Form inputs - Visible labels + aria-describedby
- [x] Password fields - Show/hide toggle with ARIA
- [x] LoadingSpinner - aria-live announcements
- [x] Semantic HTML - main, nav, section, article, aside
- [x] Dashboard pages - WCAG 2.1 AA compliant
- [x] EmptyState component - role="status" + aria-live
- [x] ErrorState component - role="alert"
- [x] Decorative icons - aria-hidden="true"
- [x] Images - loading="lazy" + alt text
- [x] Admin pages (Courses, Users, Edit, Create) - WCAG 2.1 AA compliant
- [x] AdminTabs - role="tablist" and keyboard navigation via Tabs.vue
- [x] Profile page - WCAG 2.1 AA compliant, aria-labelledby landmarks
- [x] About page - WCAG 2.1 AA compliant, proper heading structure
- [x] SubmitButton - disabled state when form is invalid

---

## 🗑️ Files Removed in Previous Versions

```
❌ app/pages/instructor/courses/create.vue
❌ app/pages/instructor/courses/[id]/edit.vue
❌ app/middleware/instructor.ts
```

**Reason:** Instructor pages merged into unified `/admin` interface to reduce duplication.

---

**Last Updated:** May 18, 2026
**Version:** 2.10.0
**Total Commits:** 71 ahead of `origin/main`
```