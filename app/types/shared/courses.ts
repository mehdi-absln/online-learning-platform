import type { User } from './auth'

// Define Course interface for UI components that includes instructor and stats
export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
  };
  stats: {
    students: number;
  };
  rating: number;
  price: number;
  duration: string;
  level: string;
  tags?: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  instructorId: number;
}

// Interfaces for course data operations that can be shared between client and server

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  instructorId: number;
  price: number;
  duration: string;
  level: string;
  image?: string | null;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  category?: string;
  instructorId?: number;
  studentCount?: number;
  rating?: number;
  price?: number;
  duration?: string;
  level?: string;
  image?: string | null;
}

// Detailed course interface for when we need additional data (e.g., lessons)
export interface DetailedCourse extends Course {
  lessons: string[];
  learningObjectives?: string[];
  courseContent?: CourseContentSection[];
  reviews?: Review[];
}

// Lesson interface
export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  videoUrl: string; // Required YouTube video URL
  order: number;
  sectionId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extended lesson interface for detailed lesson pages
export interface DetailedLesson extends CourseContentLesson {
  id: number;
  courseId: number;
  content: string;
  order: number;
  sectionId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Course content section interface
export interface CourseContentSection {
  id: number; // Required ID field for the section
  title: string;
  description: string;
  lessons: number;
  duration: string;
  content?: CourseContentLesson[]; // Array of lesson objects with title and duration
}

// Lesson content interface
export interface CourseContentLesson {
  id?: number; // Optional ID field to identify the lesson
  title: string;
  duration: string; // Duration in format like "5:30" or "10 min"
  videoUrl: string; // Required YouTube video URL
  description?: string; // Optional description field
}

// Review interface
export interface Review {
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}