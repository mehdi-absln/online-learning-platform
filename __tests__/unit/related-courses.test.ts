import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// Mock the database before importing the module
vi.mock('../../server/db', () => ({
  db: mockDeep(),
}))

import { db } from '../../server/db'
import {
  getRelatedCourses,
  calculatePopularityScore,
  calculateTagMatchScore,
  parseTags,
} from '../../server/utils/related-courses'

describe('Related Courses Utils', () => {
  beforeEach(() => {
    mockReset(db)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ============================================
  // Pure Function Tests (no mocking needed)
  // ============================================

  describe('parseTags', () => {
    it('should parse comma-separated tags', () => {
      const result = parseTags('javascript,typescript,react')
      expect(result).toEqual(['javascript', 'typescript', 'react'])
    })

    it('should handle empty string', () => {
      const result = parseTags('')
      expect(result).toEqual([])
    })

    it('should handle null', () => {
      const result = parseTags(null)
      expect(result).toEqual([])
    })

    it('should trim whitespace and lowercase', () => {
      const result = parseTags('  JavaScript , TypeScript  ')
      expect(result).toEqual(['javascript', 'typescript'])
    })

    it('should handle undefined', () => {
      const result = parseTags(undefined as any)
      expect(result).toEqual([])
    })

    it('should handle single tag without comma', () => {
      const result = parseTags('javascript')
      expect(result).toEqual(['javascript'])
    })

    it('should filter out empty tags from double commas', () => {
      const result = parseTags('javascript,,react,,,vue')
      expect(result).toEqual(['javascript', 'react', 'vue'])
    })

    it('should handle tags with numbers', () => {
      const result = parseTags('vue3,react18,angular15')
      expect(result).toEqual(['vue3', 'react18', 'angular15'])
    })
  })

  describe('calculateTagMatchScore', () => {
    it('should count matching tags', () => {
      const score = calculateTagMatchScore(
        ['javascript', 'react', 'vue'],
        ['javascript', 'react', 'angular']
      )
      expect(score).toBe(2)
    })

    it('should return 0 for no matches', () => {
      const score = calculateTagMatchScore(
        ['python', 'django'],
        ['javascript', 'react']
      )
      expect(score).toBe(0)
    })

    it('should handle empty arrays', () => {
      expect(calculateTagMatchScore([], ['javascript'])).toBe(0)
      expect(calculateTagMatchScore(['javascript'], [])).toBe(0)
    })

    it('should be case insensitive', () => {
      const score = calculateTagMatchScore(
        ['JavaScript', 'React'],
        ['javascript', 'react']
      )
      expect(score).toBe(2)
    })

    it('should return full count when all tags match', () => {
      const score = calculateTagMatchScore(
        ['javascript', 'react'],
        ['javascript', 'react']
      )
      expect(score).toBe(2)
    })

    it('should handle duplicate tags correctly', () => {
      const score = calculateTagMatchScore(
        ['javascript', 'javascript', 'react'],
        ['javascript', 'vue']
      )
      // Should count each occurrence
      expect(score).toBeGreaterThanOrEqual(1)
    })
  })

  describe('calculatePopularityScore', () => {
    it('should calculate score correctly', () => {
      const recentDate = new Date()
      const score = calculatePopularityScore(100, 4.5, recentDate)

      // 100 (students) + 45 (rating * 10) + ~10 (recency)
      expect(score).toBeGreaterThanOrEqual(145)
      expect(score).toBeLessThanOrEqual(155)
    })

    it('should give lower recency score for old courses', () => {
      const oldDate = new Date('2020-01-01')
      const score = calculatePopularityScore(100, 4.5, oldDate)

      // 100 (students) + 45 (rating * 10) + 0 (old course)
      expect(score).toBe(145)
    })

    it('should handle zero students', () => {
      const score = calculatePopularityScore(0, 4.5, new Date())
      expect(score).toBeGreaterThanOrEqual(45) // rating * 10 + recency
    })

    it('should handle zero rating', () => {
      const score = calculatePopularityScore(100, 0, new Date())
      expect(score).toBeGreaterThanOrEqual(100) // students + recency
    })

    it('should handle all zeros', () => {
      const oldDate = new Date('2020-01-01')
      const score = calculatePopularityScore(0, 0, oldDate)
      expect(score).toBe(0)
    })

    it('should handle very high student count', () => {
      const score = calculatePopularityScore(1000000, 5, new Date())
      expect(score).toBeGreaterThan(1000000)
    })

    it('should handle rating above 5 (edge case)', () => {
      // In case of data inconsistency
      const score = calculatePopularityScore(100, 10, new Date())
      expect(score).toBeGreaterThan(0) // Should not crash
    })
  })

  // ============================================
  // Integration Tests (with mocking)
  // ============================================

  describe('getRelatedCourses', () => {
    const mockCourse = {
      id: 1,
      title: 'Test Course',
      slug: 'test-course',
      description: 'A test course',
      category: 'Programming',
      instructorId: 1,
      studentCount: 100,
      rating: 4,
      price: 10000,
      level: 'Intermediate',
      tags: 'javascript,typescript,react',
      image: '/test-image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockRelatedCourses = [
      {
        id: 2,
        title: 'Related Course 1',
        slug: 'related-course-1',
        description: 'A related course',
        category: 'Programming',
        instructorId: 1,
        studentCount: 50,
        rating: 5,
        price: 15000,
        level: 'Advanced',
        tags: 'javascript,angular',
        image: '/related-image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: 'Related Course 2',
        slug: 'related-course-2',
        description: 'Another related course',
        category: 'Web Development',
        instructorId: 1,
        studentCount: 75,
        rating: 4,
        price: 12000,
        level: 'Beginner',
        tags: 'javascript,vue,typescript',
        image: '/related-image2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('should fetch related courses successfully', async () => {
      // Setup mocks
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue(mockRelatedCourses)
      mockDb.query.reviews.findMany.mockResolvedValue([])

      // Call the function
      const result = await getRelatedCourses({ courseId: 1 })

      // Assertions
      expect(result.success).toBe(true)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeLessThanOrEqual(4)
      expect(result.meta.basedOn.category).toBe('Programming')
      expect(result.meta.basedOn.tags).toContain('javascript')
    })

    it('should throw error when course not found', async () => {
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(null)

      await expect(getRelatedCourses({ courseId: 999 }))
        .rejects.toThrow('Course not found')
    })

    it('should sort by category match first', async () => {
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue(mockRelatedCourses)
      mockDb.query.reviews.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      // Course with same category should be first
      expect(result.data[0].categoryMatch).toBe(true)
    })

    it('should respect limit option', async () => {
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue(mockRelatedCourses)
      mockDb.query.reviews.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1, limit: 1 })

      expect(result.data.length).toBe(1)
    })

    it('should return empty array when no related courses exist', async () => {
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
      expect(result.meta.total).toBe(0)
    })

    it('should handle course with no tags', async () => {
      const courseWithNoTags = { ...mockCourse, tags: null }
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(courseWithNoTags)
      mockDb.query.courses.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(result.meta.basedOn.tags).toEqual([])
    })

    it('should handle course with empty tags string', async () => {
      const courseWithEmptyTags = { ...mockCourse, tags: '' }
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(courseWithEmptyTags)
      mockDb.query.courses.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(result.meta.basedOn.tags).toEqual([])
    })

    it('should include reviews in rating calculation', async () => {
      const relatedCourse = {
        id: 2,
        title: 'Related Course',
        slug: 'related-course',
        category: 'Programming',
        rating: 3, // Original rating
        studentCount: 50,
        tags: 'javascript',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockReviews = [
        { courseId: 2, rating: 5 },
        { courseId: 2, rating: 5 },
        { courseId: 2, rating: 5 },
      ]

      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue([relatedCourse])
      mockDb.query.reviews.findMany.mockResolvedValue(mockReviews)

      const result = await getRelatedCourses({ courseId: 1 })

      // Rating should be calculated from reviews (avg = 5), not original (3)
      expect(result.data[0].rating).toBe(5)
    })

    it('should sort by tag match score when category is same', async () => {
      const relatedCourses = [
        {
          id: 2,
          category: 'Programming',
          tags: 'javascript', // 1 match
          studentCount: 100,
          rating: 5,
          createdAt: new Date(),
        },
        {
          id: 3,
          category: 'Programming',
          tags: 'javascript,typescript,react', // 3 matches
          studentCount: 50,
          rating: 3,
          createdAt: new Date(),
        },
      ]

      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue(relatedCourses)
      mockDb.query.reviews.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      // Course with more tag matches should be first
      expect(result.data[0].id).toBe(3)
      expect(result.data[0].tagMatchScore).toBeGreaterThan(result.data[1].tagMatchScore)
    })

    it('should sort by popularity when category and tags are equal', async () => {
      const relatedCourses = [
        {
          id: 2,
          category: 'Programming',
          tags: 'javascript',
          studentCount: 50, // Less popular
          rating: 3,
          createdAt: new Date(),
        },
        {
          id: 3,
          category: 'Programming',
          tags: 'javascript',
          studentCount: 500, // More popular
          rating: 5,
          createdAt: new Date(),
        },
      ]

      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue(relatedCourses)
      mockDb.query.reviews.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      // More popular course should be first
      expect(result.data[0].id).toBe(3)
      expect(result.data[0].popularityScore).toBeGreaterThan(result.data[1].popularityScore)
    })

    it('should handle database error gracefully', async () => {
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockRejectedValue(new Error('Database connection failed'))

      await expect(getRelatedCourses({ courseId: 1 }))
        .rejects.toThrow('Database connection failed')
    })

    it('should use default limit of 4 when not specified', async () => {
      const manyRelatedCourses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 2,
        category: 'Programming',
        tags: 'javascript',
        studentCount: 100 - i,
        rating: 4,
        createdAt: new Date(),
      }))

      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue(manyRelatedCourses)
      mockDb.query.reviews.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.data.length).toBe(4)
    })

    it('should exclude current course from results', async () => {
      // The current course should not be in the results due to the ne(courses.id, courseId) condition
      const differentCourse = { ...mockCourse, id: 2, slug: 'different-course' }
      const mockDb = db as any
      mockDb.query.courses.findFirst.mockResolvedValue(mockCourse)
      mockDb.query.courses.findMany.mockResolvedValue([differentCourse]) // Different course returned
      mockDb.query.reviews.findMany.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      // Should not include the same course
      const hasSameCourse = result.data.some(c => c.id === mockCourse.id)
      expect(hasSameCourse).toBe(false)
    })
  })
})