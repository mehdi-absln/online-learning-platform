# Online Learning Platform - Project Structure

## Overview
This document provides a detailed breakdown of the project structure for the Online Learning Platform built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Pinia, and SQLite with Drizzle ORM.

## Root Directory Structure
```
├── __tests__/                    # Test files and test utilities
│   ├── components/               # Component-specific tests
│   │   ├── LessonContent.test.ts
│   │   └── LessonVideo.test.ts
│   ├── composables/              # Composable-specific tests
│   │   ├── useLesson.test.ts
│   │   └── useToast.test.ts
│   ├── stores/                   # Store-specific tests
│   │   └── lesson-progress.test.ts
│   ├── unit/                     # Unit tests
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
├── app/                          # Nuxt application files
│   ├── assets/                   # Static assets (CSS, fonts, etc.)
│   │   └── css/
│   │       ├── app.css           # Main application styles
│   │       └── fonts.css         # Font imports and configurations
│   ├── components/               # Reusable Vue components
│   │   ├── courses/              # Course-specific components
│   │   │   ├── CourseCard.vue
│   │   │   ├── CourseReviews.vue
│   │   │   ├── CoursesGrid.vue
│   │   │   ├── CoursesHero.vue
│   │   │   ├── CourseSidebarFilters.vue
│   │   │   ├── FilterCheckboxGroup.vue
│   │   │   ├── FilterRadioGroup.vue
│   │   │   └── RelatedCourses.vue
│   │   ├── lesson/               # Lesson-specific components
│   │   │   ├── LessonContent.vue
│   │   │   ├── LessonSidebar.vue
│   │   │   └── LessonVideo.vue
│   │   └── ui/                   # Generic UI components
│   │       ├── Accordion.vue
│   │       ├── Breadcrumb.vue
│   │       ├── FormCheckbox.vue
│   │       ├── FormInput.vue
│   │       ├── LoadingSpinner.vue
│   │       ├── Pagination.vue
│   │       ├── StarRating.vue
│   │       ├── SubmitButton.vue
│   │       ├── Tabs.vue
│   │       └── Toast.vue
│   ├── composables/              # Vue composables for reusable logic
│   │   ├── useAccordion.ts
│   │   ├── useApiError.ts
│   │   ├── useCourse.ts
│   │   ├── useCourseFilters.ts
│   │   ├── useCourses.ts
│   │   ├── useKeyboardFocus.ts
│   │   ├── useLesson.ts
│   │   ├── useRelatedCourses.ts
│   │   ├── useToast.ts
│   │   └── useZodValidation.ts
│   ├── constants/                # Application constants
│   │   └── index.ts
│   ├── layouts/                  # Layout components
│   │   ├── .gitkeep
│   │   ├── auth.vue              # Authentication layout
│   │   └── default.vue           # Default application layout
│   ├── middleware/               # Route middleware
│   │   ├── .gitkeep
│   │   └── auth.ts               # Authentication middleware
│   ├── pages/                    # Route pages
│   │   ├── auth/
│   │   │   ├── SignIn.vue
│   │   │   └── SignUp.vue
│   │   ├── courses/
│   │   │   ├── [courseSlug]/     # Dynamic course pages
│   │   │   │   ├── lessons/
│   │   │   │   │   └── [lessonSlug].vue
│   │   │   │   └── index.vue
│   │   │   └── index.vue
│   │   ├── dashboard.vue
│   │   ├── home.vue
│   │   └── .gitkeep
│   ├── plugins/                  # Nuxt plugins
│   │   └── .gitkeep
│   ├── public/                   # Static assets served directly
│   │   ├── icon/
│   │   │   ├── UPST0179.png
│   │   │   ├── UPST0180.png
│   │   │   ├── UPST0181.png
│   │   │   └── UPST0182.png
│   │   └── images/
│   │       ├── banner.jpg
│   │       ├── laptop-near-whilte-book.jpg
│   │       └── placeholder-course.svg
│   ├── schemas/                  # Zod validation schemas
│   │   └── auth.ts
│   ├── stores/                   # Pinia stores
│   │   ├── courses.ts
│   │   ├── lesson-progress.ts
│   │   └── user.ts
│   ├── types/                    # TypeScript type definitions
│   │   ├── components/
│   │   │   ├── accordion.ts
│   │   │   └── tabs-types.ts
│   │   ├── shared/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── courses.ts
│   │   │   ├── lessons.ts
│   │   │   └── users.ts
│   │   ├── auth-errors.ts
│   │   ├── courses-filter.ts
│   │   └── types.ts
│   ├── utils/                    # Utility functions
│   │   ├── auth-error-handler-helpers.ts
│   │   └── course-helpers.ts
│   └── app.vue                   # Main application component
├── scripts/                      # Utility scripts
│   ├── add-instructors.ts
│   ├── add-lesson-progress-table.ts
│   ├── add-tags-to-existing-courses.ts
│   ├── check-tables.ts
│   ├── setup-db.ts
│   ├── show-lessons.ts
│   └── verify-lesson-progress-table.ts
├── server/                       # Server-side code
│   ├── api/                      # API routes
│   │   ├── admin/
│   │   ├── auth/
│   │   │   ├── logout.post.ts
│   │   │   ├── me.get.ts
│   │   │   ├── signin.post.ts
│   │   │   └── signup.post.ts
│   │   ├── blogs/
│   │   │   ├── [id].delete.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   └── slug/
│   │   │       └── [slug].get.ts
│   │   ├── courses/
│   │   │   ├── [courseId]/       # Course-specific routes
│   │   │   │   └── related.get.ts
│   │   │   ├── count.get.ts
│   │   │   ├── filter-options.get.ts
│   │   │   ├── filters/
│   │   │   │   └── options.get.ts
│   │   │   ├── index.get.ts
│   │   │   └── slug/
│   │   │       └── [slug]/
│   │   │           ├── index.get.ts
│   │   │           └── lessons/
│   │   │               └── [lessonSlug].get.ts
│   │   ├── progress/
│   │   │   ├── bookmark.post.ts
│   │   │   ├── complete.post.ts
│   │   │   ├── index.get.ts
│   │   │   └── notes.post.ts
│   │   └── users/
│   │       └── [id].get.ts
│   ├── data/                     # Database files (SQLite)
│   ├── db/                       # Database related code
│   │   ├── blog-service.ts
│   │   ├── course-service.ts
│   │   ├── index.ts
│   │   ├── migrate.ts
│   │   ├── progress-service.ts
│   │   ├── schema.ts
│   │   └── user-service.ts
│   ├── drizzle/                  # Database migration files
│   │   └── migrations/
│   │       ├── 0000_full_schema_update.sql
│   │       ├── 0001_seed_sample_data.sql
│   │       ├── 0002_add_slug_to_courses.sql
│   │       ├── 0003_update_schema.sql
│   │       ├── 0004_add_lesson_progress.sql
│   │       └── 0005_create_blogs.sql
│   └── utils/                    # Server utility functions
│       ├── course-authorization.ts
│       ├── course-transformer.ts
│       ├── format-utils.ts
│       ├── image-processor.ts
│       ├── instructor-service.ts
│       ├── jwt.ts
│       ├── related-courses.ts
│       ├── response.ts
│       ├── safe-parse.ts
│       └── update-lessons-video-urls.ts
├── .env.example                  # Example environment variables
├── .eslintignore                 # Files to ignore for ESLint
├── .gitignore                    # Files to ignore for Git
├── .prettierignore               # Files to ignore for Prettier
├── PROJECT_STRUCTURE.md          # Current file documenting project structure
├── drizzle.config.ts             # Drizzle ORM configuration
├── eslint.config.mjs             # ESLint configuration
├── nuxt.config.ts                # Nuxt configuration
├── package-lock.json             # Lock file for dependencies
├── package.json                  # Project metadata and dependencies
├── postcss.config.ts             # PostCSS configuration
├── README.md                     # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── vitest.config.ts              # Vitest configuration
```

## Key Features and Architecture

### Frontend (Nuxt 4 + Vue 3)
- **State Management**: Pinia stores for managing application state
- **Styling**: Tailwind CSS with custom configurations
- **Components**: Organized by domain (courses, lessons, UI elements)
- **Type Safety**: Full TypeScript support with dedicated types directory
- **Validation**: Zod schemas for form and data validation
- **Accessibility**: Proper semantic HTML and ARIA attributes

### Backend (Node.js API)
- **Database**: SQLite with Drizzle ORM for type-safe queries
- **Authentication**: JWT-based with secure cookie storage
- **API Routes**: Organized by domain (auth, courses, users, etc.)
- **Migrations**: Automated with Drizzle Kit
- **Security**: Password hashing with bcrypt

### Testing
- **Unit Tests**: Vitest for component and composable testing
- **Integration Tests**: For complex workflows
- **Coverage**: Configured with reporting

### Development
- **Linting**: ESLint with custom rules
- **Formatting**: Automatic formatting with ESLint
- **Hot Reload**: Nuxt dev server with HMR
- **Environment**: Dotenv for environment variable management

## Routing Structure
- `/` → Redirects to `/home`
- `/home` → Home page with course listings
- `/auth` → Redirects to `/auth/signin`
- `/auth/signin` → Sign in page
- `/auth/signup` → Sign up page
- `/courses` → All courses page
- `/courses/[courseSlug]` → Individual course detail page
- `/courses/[courseSlug]/lessons/[lessonSlug]` → Individual lesson page
- `/dashboard` → User dashboard

## Data Flow
1. API calls from frontend → server/api routes
2. Server routes interact with services in server/db
3. Services use Drizzle ORM to interact with SQLite database
4. Data is transformed and returned as JSON responses
5. Frontend updates state using Pinia stores
6. Components react to state changes

## Security Measures
- JWT tokens stored in secure, HTTP-only cookies
- Passwords hashed with bcrypt
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM
- CSRF protection considerations