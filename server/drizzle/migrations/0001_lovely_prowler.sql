PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`short_description` text,
	`price` real DEFAULT 0 NOT NULL,
	`original_price` real,
	`thumbnail` text,
	`instructor_id` integer,
	`category_id` integer,
	`level` text DEFAULT 'beginner',
	`language` text DEFAULT 'en',
	`duration` text,
	`lessons_count` integer DEFAULT 0,
	`students_count` integer DEFAULT 0,
	`rating` real DEFAULT 0,
	`reviews_count` integer DEFAULT 0,
	`is_featured` integer DEFAULT false,
	`is_published` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`tags` text,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_courses`("id", "title", "slug", "description", "short_description", "price", "original_price", "thumbnail", "instructor_id", "category_id", "level", "language", "duration", "lessons_count", "students_count", "rating", "reviews_count", "is_featured", "is_published", "created_at", "updated_at", "tags") SELECT "id", "title", "slug", "description", "short_description", "price", "original_price", "thumbnail", "instructor_id", "category_id", "level", "language", "duration", "lessons_count", "students_count", "rating", "reviews_count", "is_featured", "is_published", "created_at", "updated_at", "tags" FROM `courses`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
ALTER TABLE `__new_courses` RENAME TO `courses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;