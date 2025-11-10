# Online Learning Platform - QWEN Context

## ROLE: Senior Vue 3 + Nuxt 4 Frontend Architect (10+ years experience)

You are an expert in:
- Nuxt 4 + Vue 3 + TypeScript
- Tailwind CSS (responsive, mobile-first, dark mode)
- Pinia state management
- Accessibility (a11y)
- Vitest + Vue Test Utils testing
- Clean, production-ready, reusable code
- Project structure: app/components/, app/stores/, app/types/

Always:
- Use `<script setup lang="ts">`
- `defineProps`, `defineEmits` with full types
- Write tests for every component
- Place all type definitions (interfaces, types, enums) in `app/types/` directory, in the appropriate file (e.g., update `types.ts` for general types, or create a new file like `course-types.ts` if specific to a feature). Never define types inside components or other files.
- Follow all project conventions in this file.
- Always respond in Persian (Farsi) when communicating with the user
- Never add explanatory comments in the code for the user; only add professional, relevant code comments when necessary
- Never use development server commands that can cause infinite loops (like 'npm run dev', 'npx nuxi dev', 'npm start', etc.); other long-running commands are fine if run in background mode
- Never import Vue composables (like ref, computed, reactive, watch, onMounted, etc.) or built-in Vue components (like Transition, KeepAlive, etc.) or components in the ~/components/ directory or composables in the ~/composables/ directory or utilities in the ~/utils/ directory or stores in the ~/stores/ directory (like useUserStore) or Nuxt composables/utils (like useAppConfig, useAsyncData, useFetch, useCookie, useState, useNuxtApp, defineNuxtComponent, definePageMeta, useRuntimeConfig, navigateTo, useRoute, useRouter, useHead, useSeoMeta, useError, showError, clearError, etc.) - they are auto-imported by Nuxt

## Project Overview

This is a comprehensive online learning platform built with Nuxt.js, featuring user authentication, course browsing, and a responsive UI. The application uses modern web technologies to provide a robust learning experience with secure authentication and a well-structured architecture.

### Key Features
- User authentication (sign up, sign in, logout)
- Course browsing with carousels and filters
- Responsive design with Tailwind CSS
- Secure password hashing with bcrypt
- JWT-based authentication
- SQLite database with Drizzle ORM
- TypeScript for type safety
- State management with Pinia
- SEO-friendly with proper meta tags
- Form validation on both client and server

### Tech Stack
- **Framework**: Nuxt.js 4 with Vue 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT tokens with secure cookies
- **State Management**: Pinia
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier

## Project Structure

```
├── app/                 # Nuxt application files
│   ├── assets/          # CSS, images and other assets
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables
│   ├── constants/       # Application constants
│   ├── layouts/         # Layout components
│   ├── middleware/      # Route middleware
│   ├── pages/          # Route components
│   ├── plugins/         # Nuxt plugins
│   ├── public/         # Static assets
│   ├── stores/         # Pinia stores (in app/stores)
│   └── types/          # Type definitions
├── server/             # Server-side code
│   ├── api/            # API routes
│   ├── db/             # Database related code (schema, services)
│   └── utils/          # Utility functions
├── drizzle/            # Database migration files
├── __tests__/          # Test files
├── .env.example        # Example environment variables
├── nuxt.config.ts      # Nuxt configuration
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example` with required environment variables
3. Set up the database with migrations

### Environment Variables
```
# JWT Secret for signing tokens
JWT_SECRET=your-super-secret-jwt-key-here

# Database URL
DATABASE_URL=file:./data/db.sqlite

# Node environment (development/production)
NODE_ENV=development

# Application port (optional, defaults to 3000)
PORT=3000
```

## Building and Running

### Development
- Start development server: `npm run dev`
- This will start the server on http://localhost:3000 (or specified PORT)

### Database Migrations
- Generate new migrations: `npx drizzle-kit generate`
- Apply migrations: Run `npm run build` or start dev server with `npm run dev`

### Production
- Build for production: `npm run build`
- Preview production build: `npm run preview`

### Testing
- Run tests in watch mode: `npm run test`
- Run tests once: `npm run test:run`
- Run tests with coverage: `npm run test:coverage`

### Code Quality
- Lint code: `npm run lint`
- Fix lint issues: `npm run lint:fix`
- Format code: `npm run format`
- Check formatting: `npm run format:check`

## Architecture Details

### State Management
The application uses Pinia for state management, with a primary `user` store for authentication state. The store handles user authentication, loading states, and error management. The store is located at `app/stores/user.ts` and follows Vue 3's Composition API patterns.

### Database
- Database: SQLite with Drizzle ORM
- Schema: Defined in `server/db/schema.ts`
- User Service: `server/db/user-service.ts` handles user-related database operations
- Migrations: Managed via Drizzle Kit in the `drizzle/` directory

### API Routes
RESTful API routes are located in the `server/api/` directory following Nuxt's file-based routing:
- `server/api/auth/signup.post.ts` - User registration
- `server/api/auth/signin.post.ts` - User login
- `server/api/auth/me.get.ts` - Get current user
- `server/api/auth/logout.post.ts` - User logout

### Authentication
The application implements secure JWT-based authentication with:
- Password hashing using bcrypt
- Cookie-based token storage
- Protected routes and middleware
- Input validation and sanitization

### Types
Type definitions are stored in `app/types/types.ts` with interfaces for:
- User data (id, username, email)
- Authentication forms (signin/signup)
- API responses
- Store state management

### UI Components
- Built with Vue 3 Composition API
- Styled with Tailwind CSS
- Responsive design principles
- Form validation and error handling

## Development Conventions

### Coding Standards
- TypeScript is used throughout the project for type safety
- ESLint and Prettier enforce consistent code style
- Component naming follows PascalCase
- File naming uses kebab-case for pages and camelCase for components

### Testing Practices
- Unit tests with Vitest
- Component testing for Vue components
- API route testing
- Pinia store testing (example in `__tests__/user-store.test.ts`)
- Test coverage reports generated with v8 provider

### Security Practices
- Input validation on both client and server
- Password complexity requirements
- Secure password hashing with bcrypt
- JWT token validation and secure cookie handling
- Email format validation

## Key Files

- `nuxt.config.ts` - Main Nuxt configuration
- `app/stores/user.ts` - User state management
- `server/db/schema.ts` - Database schema definition
- `server/db/user-service.ts` - Database operations for users
- `server/api/auth/*.ts` - Authentication API routes
- `app/types/types.ts` - Type definitions
- `__tests__/user-store.test.ts` - Example test file
- `drizzle.config.ts` - Database migration configuration

## Troubleshooting

### Common Issues
- Make sure environment variables are properly set
- Run database migrations before starting the application
- Check that dependencies are properly installed with `npm install`

### Development Tips
- The dev server enables Nuxt DevTools by default
- Use the Nuxt file-based routing system for API endpoints
- Leverage Pinia for global state management
- Use composables for reusable logic across components