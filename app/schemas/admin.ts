import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  isPublished: z.boolean(),
})

export type CourseFormData = z.infer<typeof courseSchema>

// ⭐ فقط سه نقش مجاز
export const adminUserUpdateSchema = z.object({
  role: z.enum(['admin', 'instructor', 'student'], {
    errorMap: () => ({ message: 'Role must be one of: admin, instructor, student' }),
  }),
})

export type AdminUserUpdateData = z.infer<typeof adminUserUpdateSchema>
