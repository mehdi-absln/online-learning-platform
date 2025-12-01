export interface CourseContentLesson {
  id?: number | string // Optional ID for the lesson
  title: string
  slug: string // URL slug for the lesson (required)
  duration: string // Duration in format like "5:30" or "10 min"
  videoUrl?: string // Optional YouTube video URL
}

export interface AccordionItem {
  id?: number | string // Optional ID for the accordion item
  title: string
  description?: string
  lessons?: CourseContentLesson[]
  duration?: string
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  /**
   * Whether only one accordion item can be open at a time
   * @default false
   */
  exclusive?: boolean
  /**
   * Index of the item that should be open by default
   * @default -1 (no item open)
   */
  modelValue?: number | number[]
  /**
   * Course ID for generating lesson links
   */
  courseId?: number
  /**
   * Course slug for generating slug-based lesson links
   */
  courseSlug?: string
}
