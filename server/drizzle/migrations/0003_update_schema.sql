-- Migration to update the database schema to match the new schema.ts

-- Add new columns that might be missing
-- Note: SQLite doesn't support many ALTER operations, so we'll use the approach of recreating tables where needed

-- Recreate lessons table with proper structure
CREATE TABLE lessons_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  course_id INTEGER NOT NULL,
  section_id INTEGER,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration TEXT,
  order_val INTEGER NOT NULL DEFAULT 0,
  is_free INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Copy data from old lessons table
INSERT INTO lessons_new (id, course_id, section_id, title, slug, content, video_url, duration, order_val, created_at, updated_at)
SELECT 
  id, 
  course_id, 
  section_id, 
  title, 
  CASE WHEN slug IS NULL OR slug = '' THEN title ELSE slug END as slug,
  content,
  video_url,
  CASE WHEN duration IS NULL THEN '00:00' ELSE duration END as duration,
  order_val,
  created_at,
  updated_at
FROM lessons;

-- Drop old table and rename new one
DROP TABLE lessons;
ALTER TABLE lessons_new RENAME TO lessons;

-- Create course_content_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS course_content_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_val INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Create course_learning_objectives table if it doesn't exist
CREATE TABLE IF NOT EXISTS course_learning_objectives (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  course_id INTEGER NOT NULL,
  objective TEXT NOT NULL,
  order_val INTEGER NOT NULL DEFAULT 0
);

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at INTEGER NOT NULL
);

-- Create instructors table if it doesn't exist
CREATE TABLE IF NOT EXISTS instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id INTEGER,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar TEXT,
  created_at INTEGER NOT NULL
);

-- Create users table if it doesn't exist (for reference)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'student',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Update courses table with new columns if they don't exist
-- Note: SQLite doesn't support adding columns with constraints easily, 
-- so we'll just ensure the table structure is compatible