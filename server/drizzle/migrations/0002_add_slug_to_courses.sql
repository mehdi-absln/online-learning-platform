-- Migration to add slug column to courses table

-- This migration adds a slug column to the courses table
-- and populates it with a URL-friendly version of the title

-- First, add the slug column to courses table
ALTER TABLE courses ADD COLUMN slug TEXT;

-- Update existing records with a slug based on the title
-- This is a simplified approach - in practice you'd want to ensure uniqueness
UPDATE courses SET slug = LOWER(REPLACE(title, ' ', '-')) WHERE slug IS NULL OR slug = '';

-- Make the slug column NOT NULL and unique
-- Note: In SQLite, we can't directly add constraints to existing columns
-- So we'll recreate the table with the proper constraints
CREATE TABLE courses_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price REAL DEFAULT 0,
  original_price REAL,
  thumbnail TEXT,
  instructor_id INTEGER,
  category_id INTEGER,
  level TEXT DEFAULT 'beginner',
  language TEXT DEFAULT 'en',
  duration TEXT,
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  tags TEXT
);

-- Copy data from old courses table to new one
INSERT INTO courses_new (id, title, slug, description, short_description, price, original_price, thumbnail, instructor_id, category_id, level, language, duration, lessons_count, students_count, rating, reviews_count, is_featured, is_published, created_at, updated_at, tags)
SELECT id, title, 
       CASE WHEN slug IS NULL OR slug = '' THEN LOWER(REPLACE(title, ' ', '-')) ELSE slug END as slug,
       description, short_description, price, original_price, thumbnail, instructor_id, category_id, level, language, duration, lessons_count, students_count, rating, reviews_count, is_featured, is_published, created_at, updated_at, tags
FROM courses;

-- Drop old table and rename new one
DROP TABLE courses;
ALTER TABLE courses_new RENAME TO courses;