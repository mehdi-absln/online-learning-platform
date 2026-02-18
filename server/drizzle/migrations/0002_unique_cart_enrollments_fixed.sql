DROP INDEX `cart_user_course_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `cart_user_course_idx` ON `cart_items` (`user_id`,`course_id`);--> statement-breakpoint
DROP INDEX `enrollments_user_course_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `enrollments_user_course_idx` ON `enrollments` (`user_id`,`course_id`);