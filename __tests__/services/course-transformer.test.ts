import { describe, it, expect } from 'vitest'
import { transformCourseForClientWithDetails } from '../server/utils/course-transformer'

// Test data
const mockCourse = {
  id: 1,
  title: 'Test Course',
  description: 'A test course',
  categoryId: null,
  category: 'Test',
  instructorId: 1,
  studentCount: 100,
  rating: 4.5,
  price: 9999,
  level: 'Intermediate',
  tags: 'test, sample',
  thumbnail: 'https://example.com/test-image.jpg',
  slug: 'test-course',
  createdAt: new Date(),
  updatedAt: new Date(),
  instructor: {
    name: 'Test Instructor',
    avatar: 'https://example.com/test-avatar.jpg',
  },
}

const mockLearningObjectives = [
  {
    id: 1,
    courseId: 1,
    objective: 'Learn testing concepts',
    orderVal: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    courseId: 1,
    objective: 'Practice with examples',
    orderVal: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockContentSections = [
  {
    id: 1,
    courseId: 1,
    title: 'Introduction',
    description: 'Basic concepts',
    lessonsCount: 3,
    orderVal: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    courseId: 1,
    title: 'Advanced Topics',
    description: 'In-depth content',
    lessonsCount: 5,
    orderVal: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockReviews = [
  {
    id: 1,
    rating: 5,
    comment: 'Great course!',
    createdAt: new Date(),
    user: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://example.com/john-avatar.jpg',
    },
  },
  {
    id: 2,
    rating: 4,
    comment: 'Good content but could be more practical',
    createdAt: new Date(),
    user: {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://example.com/jane-avatar.jpg',
    },
  },
]

describe('Course Transformer', () => {
  it('should transform course with detailed information correctly', () => {
    const result = transformCourseForClientWithDetails(
      mockCourse,
      mockLearningObjectives,
      mockContentSections,
      mockReviews,
    )

    // Check basic course properties
    expect(result.id).toBe(1)
    expect(result.title).toBe('Test Course')
    expect(result.price).toBe(99.99) // Should be converted from cents to dollars

    // Check learning objectives
    expect(result.learningObjectives).toEqual(['Learn testing concepts', 'Practice with examples'])

    // Check course content sections
    expect(result.courseContent).toEqual([
      {
        id: 1,
        title: 'Introduction',
        description: 'Basic concepts',
        lessons: 3,
        content: [],
      },
      {
        id: 2,
        title: 'Advanced Topics',
        description: 'In-depth content',
        lessons: 5,
        content: [],
      },
    ])

    // Check reviews
    expect(result.reviews).toHaveLength(2)
    expect(result.reviews![0].user?.name).toBe('John Doe')
    expect(result.reviews![0].rating).toBe(5)
    expect(result.reviews![0].comment).toBe('Great course!')
    expect(result.reviews![1].user?.name).toBe('Jane Smith')
    expect(result.reviews![1].rating).toBe(4)
    expect(result.reviews![1].comment).toBe('Good content but could be more practical')
  })
})
