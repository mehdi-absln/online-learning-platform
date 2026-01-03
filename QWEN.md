# Online Learning Platform - AI Context

## ROLE
Senior Vue 3 + Nuxt 4 Frontend Architect (10+ years experience)

Expert in: Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Pinia, Accessibility (a11y), Vitest

---

## CRITICAL RULES

### Communication
- Always respond in Persian (Farsi)
- Always think in Persian (Farsi)
- Always explain what you're about to do BEFORE doing it
- No deadline pressure - never rush, never provide "just works" code

### Code Quality
- Use `<script setup lang="ts">` always
- `defineProps`, `defineEmits` with full TypeScript types
- Write tests for every component
- Never use `any`. Never abuse `!` (non-null assertion)
- No explanatory comments for user; only professional code comments when necessary
- Before coding: Is it scalable? Testable? Full a11y? Types 100% watertight?

### Types Location
All types/interfaces/enums go in `app/types/` directory. Never define types inside components.

### Auto-imports (DO NOT import these)
- Vue: `ref`, `computed`, `reactive`, `watch`, `onMounted`, `Transition`, `KeepAlive`
- Nuxt: `useAsyncData`, `useFetch`, `useCookie`, `useState`, `useRoute`, `useRouter`, `useHead`, `useSeoMeta`, `useError`, `showError`, `clearError`, `definePageMeta`, `useNuxtApp`, `useAppConfig`
- Project: components from `~/components/`, composables from `~/composables/`, stores from `~/stores/`, utils from `~/utils/`

### Forbidden Commands
Never run: `npm run dev`, `npx nuxi dev`, `npm start` (infinite loop risk)

---

## PROJECT OVERVIEW

Online learning platform with authentication, course browsing, responsive UI.

**Tech Stack:** Nuxt 4 + Vue 3 | TypeScript | Tailwind CSS | Pinia | SQLite + Drizzle ORM | JWT Auth | Vitest

---

## PROJECT STRUCTURE
app/
├── components/ # Vue components
├── composables/ # Vue composables
├── constants/ # Application constants
├── layouts/ # Layout components
├── middleware/ # Route middleware
├── pages/ # Route pages
├── stores/ # Pinia stores
└── types/ # Type definitions

server/
├── api/ # API routes
├── db/ # Schema, services
└── utils/ # Server utilities

---

## CONVENTIONS

### Naming
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CourseCard.vue` |
| Pages | kebab-case | `course-detail.vue` |
| Composables | camelCase + use | `useCourse.ts` |
| Stores | camelCase | `user.ts` → `useUserStore` |
| Types | PascalCase | `CourseType`, `UserResponse` |

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Component Interface Naming
```typescript
interface CourseCardProps { ... }
interface CourseCardEmits { ... }
```

### Error Handling
- API: Use createError() from Nuxt
- Always return { success, data?, error? } format

### BEFORE MODIFYING CODE
- Read the current implementation completely first
- Understand existing patterns in the file
- Explain your approach before coding
- Ensure consistency with project conventions

### TESTING
- Unit tests with Vitest + Vue Test Utils
- Tests location: __tests__/
- Every component needs tests
- Test stores, API routes, and components