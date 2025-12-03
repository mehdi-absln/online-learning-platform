export interface CourseContentLesson {
  id?: number | string
  title: string
  slug: string
  duration: string
  videoUrl?: string
}

export interface AccordionItem {
  id?: number | string
  title: string
  description?: string
  lessons?: CourseContentLesson[]
  duration?: string
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  exclusive?: boolean
  modelValue?: number | number[]
  courseId?: number
  courseSlug?: string
}

export interface AccordionEmits {
  (e: 'update:modelValue', value: number | number[]): void
  (e: 'lesson-click', lesson: CourseContentLesson): void
}
