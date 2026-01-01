// Define Lesson interface for UI components
export interface Lesson {
  id: number
  courseId: number
  title: string
  content: string
  videoUrl: string // Required YouTube video URL
  order: number
  sectionId?: number
  duration?: string // Duration in format like "5:30" or "10 min"
  slug: string // URL-friendly slug for the lesson
  createdAt: Date
  updatedAt: Date
}

// Extended lesson interface for detailed lesson pages
export interface DetailedLesson extends Lesson {
  description?: string
  attachments?: LessonAttachment[]
  resources?: LessonResource[]
}

// Interface for lesson attachments
export interface LessonAttachment {
  id: number
  name: string
  url: string
  size: string // File size in format like "2.4 MB"
  type: string // File type like "pdf", "zip", "doc", etc.
  createdAt: Date
}

// Interface for lesson resources
export interface LessonResource {
  id: number
  title: string
  url: string
  description?: string
  type: 'link' | 'file' | 'video' | 'article'
  createdAt: Date
}

// Interface for lesson progress tracking
export interface LessonProgress {
  lessonId: number
  isCompleted: boolean
  isBookmarked: boolean
  notes?: string
  completedAt?: Date
  progressPercentage?: number
}