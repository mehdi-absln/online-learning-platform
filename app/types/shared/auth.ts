// Define a minimal User interface that can be shared between frontend and backend
export interface User {
  id: number
  username: string
  email: string
}

// Define common auth response interfaces
export interface AuthResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}

// Course related interfaces
export interface CourseStats {
  students: number;
}

export interface CourseInstructor {
  name: string;
  avatar: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: CourseInstructor;
  stats: CourseStats;
  rating: number;
  price: number;
  duration: string;
  level: string; // Add level property
  tags?: string; // Comma-separated tags for the course
  image: string;
  createdAt: Date;
  updatedAt: Date;
  instructorId: number;
}

// JWT payload interface for authentication consistency
export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}