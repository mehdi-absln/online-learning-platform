-- Add reading_time column to blogs table
ALTER TABLE blogs ADD COLUMN reading_time INTEGER NOT NULL DEFAULT 1;