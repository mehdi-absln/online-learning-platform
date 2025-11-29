-- Migration to add slug column to courses table with proper constraints
ALTER TABLE courses ADD COLUMN slug TEXT NOT NULL DEFAULT '';

-- Update all rows to have a slug based on their title
-- This is a placeholder since in our case we already populated the slugs

-- Create unique index for slug column
CREATE UNIQUE INDEX "courses_slug_unique" ON "courses" ("slug");