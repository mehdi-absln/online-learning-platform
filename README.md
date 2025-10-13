# Online Learning Platform

A comprehensive online learning platform built with Nuxt.js, featuring user authentication, course browsing, and a responsive UI.

## Features

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

## Tech Stack

- **Framework**: Nuxt.js 4 with Vue 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT tokens with secure cookies
- **State Management**: Pinia
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

## Database Migrations

Generate new migrations:

```bash
npx drizzle-kit generate
```

Apply migrations:

```bash
npm run build
# or start the dev server which will apply migrations
npm run dev
```

## Testing

Run tests:

```bash
npm run test
# or run tests once
npm run test:run
# or run tests with coverage
npm run test:coverage
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Secret
JWT_SECRET=your-jwt-secret-here

# Database
DATABASE_URL=file:./data/db.sqlite

# Node environment (production/development)
NODE_ENV=development
```

## Project Structure

```
├── app/                 # Nuxt application files
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables
│   ├── layouts/         # Layout components
│   ├── pages/          # Route components
│   └── public/         # Static assets
├── server/             # Server-side code
│   ├── api/            # API routes
│   ├── db/             # Database related code
│   └── utils/          # Utility functions
├── stores/             # Pinia stores
├── __tests__/          # Test files
└── drizzle/            # Database migration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
