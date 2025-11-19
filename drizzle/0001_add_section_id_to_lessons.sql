-- Migration to add section_id column to lessons table
ALTER TABLE `lessons` ADD COLUMN `section_id` integer;