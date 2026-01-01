-- Seed data for courses, course content sections, and lessons

-- Insert a sample course if it doesn't exist
INSERT OR IGNORE INTO courses (id, title, description, category, instructor_id, student_count, rating, price, duration, level, image, created_at, updated_at, tags, slug) 
VALUES (1, 'Introduction to Programming', 'Learn the basics of programming with this comprehensive course', 'Programming', 1, 150, 4, 9999, '8 weeks', 'Beginner', '/images/programming-course.jpg', 1700000000, 1700000000, 'programming,javascript,beginner', 'introduction-to-programming');

-- Insert course content sections for the sample course
INSERT OR IGNORE INTO course_content_sections (course_id, title, description, lessons_count, order_val, created_at, updated_at) 
VALUES 
(1, 'Getting Started', 'Introduction to programming concepts', 3, 1, 1700000000, 1700000000),
(1, 'Variables and Data Types', 'Understanding variables and different data types', 4, 2, 1700000000, 1700000000),
(1, 'Control Structures', 'Learning about conditionals and loops', 3, 3, 1700000000, 1700000000);

-- Insert lessons for the first section
INSERT OR IGNORE INTO lessons (course_id, section_id, title, slug, content, video_url, order_val, created_at, updated_at, duration) 
VALUES 
(1, 1, 'Course Overview', 'course-overview', 'Welcome to the course...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1700000000, 1700000000, '5:30'),
(1, 1, 'What is Programming?', 'what-is-programming', 'Programming is the process of creating a set of instructions...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 1700000000, 1700000000, '8:15'),
(1, 1, 'Setting Up Your Environment', 'setting-up-environment', 'In this lesson, we will set up your programming environment...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, 1700000000, 1700000000, '12:20');

-- Insert lessons for the second section
INSERT OR IGNORE INTO lessons (course_id, section_id, title, slug, content, video_url, order_val, created_at, updated_at, duration) 
VALUES 
(1, 2, 'Understanding Variables', 'understanding-variables', 'Variables are containers for storing data values...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1700000000, 1700000000, '10:45'),
(1, 2, 'Data Types Explained', 'data-types-explained', 'In programming, data types are classifications that specify...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 1700000000, 1700000000, '15:30'),
(1, 2, 'Working with Strings', 'working-with-strings', 'Strings are sequences of characters used to represent text...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, 1700000000, 1700000000, '11:20'),
(1, 2, 'Numbers and Calculations', 'numbers-and-calculations', 'Working with numbers in programming...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 4, 1700000000, 1700000000, '9:50');

-- Insert lessons for the third section
INSERT OR IGNORE INTO lessons (course_id, section_id, title, slug, content, video_url, order_val, created_at, updated_at, duration) 
VALUES 
(1, 3, 'Conditional Statements', 'conditional-statements', 'Conditional statements allow your program to make decisions...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1700000000, 1700000000, '14:10'),
(1, 3, 'Loops - For and While', 'loops-for-and-while', 'Loops allow you to repeat code multiple times...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 1700000000, 1700000000, '18:25'),
(1, 3, 'Practical Examples', 'practical-examples', 'Let''s apply what we''ve learned with practical examples...', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, 1700000000, 1700000000, '22:40');

-- Insert learning objectives for the course
INSERT OR IGNORE INTO course_learning_objectives (course_id, objective, order_val, created_at, updated_at) 
VALUES 
(1, 'Understand basic programming concepts', 1, 1700000000, 1700000000),
(1, 'Work with variables and data types', 2, 1700000000, 1700000000),
(1, 'Implement control structures', 3, 1700000000, 1700000000),
(1, 'Create simple programs', 4, 1700000000, 1700000000);

-- Insert a sample review for the course
INSERT OR IGNORE INTO reviews (course_id, reviewer_name, reviewer_id, rating, comment, date, created_at, updated_at) 
VALUES 
(1, 'John Doe', 1, 5, 'Great course for beginners! Explained everything clearly.', 1700000000, 1700000000, 1700000000);