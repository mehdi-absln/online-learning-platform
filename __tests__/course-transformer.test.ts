import { describe, it, expect } from 'vitest'
import { transformCourseForClientWithDetails } from '../server/utils/course-transformer'

// Test data
const mockCourse = {
  id: 1,
  title: 'Test Course',
  description: 'A test course',
  category: 'Test',
  instructorId: 1,
  studentCount: 100,
  rating: 4.5,
  price: 9999,
  duration: '8 weeks',
  level: 'Intermediate',
  tags: 'test, sample',
  image: '/test-image.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  instructor: {
    name: 'Test Instructor',
    avatar: '/test-avatar.jpg'
  }
}

const mockLearningObjectives = [
  {
    id: 1,
    courseId: 1,
    objective: 'Learn testing concepts',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    courseId: 1,
    objective: 'Practice with examples',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockContentSections = [
  {
    id: 1,
    courseId: 1,
    title: 'Introduction',
    description: 'Basic concepts',
    lessonsCount: 3,
    duration: '2 hours',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    courseId: 1,
    title: 'Advanced Topics',
    description: 'In-depth content',
    lessonsCount: 5,
    duration: '5 hours',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockReviews = [
  {
    id: 1,
    courseId: 1,
    reviewerName: 'John Doe',
    reviewerId: 1,
    rating: 5,
    comment: 'Great course!',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    courseId: 1,
    reviewerName: 'Jane Smith',
    rating: 4,
    comment: 'Good content but could be more practical',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

describe('Course Transformer', () => {
  it('should transform course with detailed information correctly', () => {
    const result = transformCourseForClientWithDetails(
      mockCourse,
      mockLearningObjectives,
      mockContentSections,
      mockReviews
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
        title: 'Introduction',
        description: 'Basic concepts',
        lessons: 3,
        duration: '2 hours',
        content: []
      },
      {
        title: 'Advanced Topics',
        description: 'In-depth content',
        lessons: 5,
        duration: '5 hours',
        content: []
      }
    ])

    // Check reviews
    expect(result.reviews).toHaveLength(2)
    expect(result.reviews![0].reviewerName).toBe('John Doe')
    expect(result.reviews![0].rating).toBe(5)
    expect(result.reviews![0].comment).toBe('Great course!')
    expect(result.reviews![1].reviewerName).toBe('Jane Smith')
    expect(result.reviews![1].rating).toBe(4)
    expect(result.reviews![1].comment).toBe('Good content but could be more practical')
  })
})
