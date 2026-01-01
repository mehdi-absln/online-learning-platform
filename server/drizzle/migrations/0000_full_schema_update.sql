-- Migration to update the database schema to match the current schema.ts

-- Create course_content_sections table
CREATE TABLE `course_content_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`lessons_count` integer NOT NULL,
	`order_val` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Create course_learning_objectives table
CREATE TABLE `course_learning_objectives` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`objective` text NOT NULL,
	`order_val` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Create reviews table
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`reviewer_name` text NOT NULL,
	`reviewer_id` integer,
	`rating` integer NOT NULL,
	`comment` text,
	`date` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Add missing columns to lessons table
ALTER TABLE lessons ADD COLUMN section_id INTEGER;
ALTER TABLE lessons ADD COLUMN slug TEXT NOT NULL DEFAULT '';
ALTER TABLE lessons ADD COLUMN duration TEXT;
ALTER TABLE lessons ADD COLUMN video_url TEXT NOT NULL DEFAULT '';

-- Update the order column name to order_val to match the schema
-- Note: SQLite doesn't support direct column renaming, so we need to recreate the table
-- First, create a new lessons table with the correct structure
CREATE TABLE lessons_new (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`section_id` integer,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`video_url` text NOT NULL,
	`duration` text,
	`order_val` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Copy data from the old lessons table to the new one
INSERT INTO lessons_new (id, course_id, section_id, title, slug, content, video_url, duration, order_val, created_at, updated_at)
SELECT id, course_id, section_id, title, 
       CASE WHEN slug IS NULL OR slug = '' THEN title ELSE slug END as slug,
       content,
       CASE WHEN video_url IS NULL OR video_url = '' THEN 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' ELSE video_url END as video_url,
       CASE WHEN duration IS NULL THEN '5 min' ELSE duration END as duration,
       order_val, created_at, updated_at
FROM lessons;

-- Drop the old lessons table and rename the new one
DROP TABLE lessons;
ALTER TABLE lessons_new RENAME TO lessons;