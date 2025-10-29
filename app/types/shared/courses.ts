import type { Course } from './auth'

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
}

// Lesson interface
export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}