// ──────────────────────────────────────
// Lesson domain types
// ──────────────────────────────────────

export interface Lesson {
  id: number
  courseId: number
  title: string
  slug: string
  content: string
  videoUrl: string
  order: number
  duration?: string
  sectionId?: number
  createdAt: Date
  updatedAt: Date
}

export interface DetailedLesson extends Lesson {
  description?: string
  isFree?: boolean
  attachments?: LessonAttachment[]
  resources?: LessonResource[]
}

export interface LessonAttachment {
  id: number
  name: string
  url: string
  size: string
  type: string
  createdAt: Date
}

export interface LessonResource {
  id: number
  title: string
  url: string
  description?: string
  type: 'link' | 'file' | 'video' | 'article'
  createdAt: Date
}

export interface LessonProgress {
  lessonId: number
  isCompleted: boolean
  isBookmarked: boolean
  notes?: string
  completedAt?: Date
  progressPercentage?: number
}
