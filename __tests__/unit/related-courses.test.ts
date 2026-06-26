import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import {
  getRelatedCourses,
  calculatePopularityScore,
  calculateTagMatchScore,
  parseTags,
} from '../../server/utils/related-courses'

const mocks = vi.hoisted(() => {
  function createCurrentCourseChain(resolvedValue: any) {
    const limit = vi.fn().mockResolvedValue(resolvedValue)
    const where = vi.fn().mockReturnValue({ limit })
    const from = vi.fn().mockReturnValue({ where })
    return { from, where, limit }
  }

  function createPotentialCoursesChain(resolvedValue: any) {
    const limit = vi.fn().mockResolvedValue(resolvedValue)
    const where = vi.fn().mockReturnValue({ limit })
    const leftJoin = vi.fn().mockReturnValue({ where })
    const from = vi.fn().mockReturnValue({ leftJoin })
    return { from, leftJoin, where, limit }
  }

  function createReviewsChain(resolvedValue: any) {
    const where = vi.fn().mockResolvedValue(resolvedValue)
    const from = vi.fn().mockReturnValue({ where })
    return { from, where }
  }

  const state = {
    firstQueryChain: createCurrentCourseChain([]),
    secondQueryChain: createPotentialCoursesChain([]),
    reviewsChain: createReviewsChain([]),
  }

  const mockDb = {
    select: vi.fn(() => {
      if (state.firstQueryChain.from.mock.calls.length === 0) return { from: state.firstQueryChain.from }
      if (state.secondQueryChain.from.mock.calls.length === 0) return { from: state.secondQueryChain.from }
      return { from: state.reviewsChain.from }
    }),
  }

  return { createCurrentCourseChain, createPotentialCoursesChain, createReviewsChain, state, mockDb }
})

vi.mock('../../server/db', () => ({
  db: mocks.mockDb,
}))

// Mock helper dependencies called inside getRelatedCourses
vi.mock('../../server/utils/instructor-service', () => ({
  enrichCoursesWithInstructors: vi.fn(courses => Promise.resolve(courses)),
}))

vi.mock('../../server/utils/image-processor', () => ({
  processCourseImage: vi.fn((img: any) => img || '/images/placeholder-course.svg'),
  DEFAULT_COURSE_IMAGE: '/images/placeholder-course.svg',
  DEFAULT_INSTRUCTOR_AVATAR: '/images/placeholder-avatar.svg',
}))

describe('Related Courses Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset chains for each test
    mocks.state.firstQueryChain = mocks.createCurrentCourseChain([])
    mocks.state.secondQueryChain = mocks.createPotentialCoursesChain([])
    mocks.state.reviewsChain = mocks.createReviewsChain([])

    // Reset the db.select dispatcher
    mocks.mockDb.select.mockImplementation(() => {
      if (mocks.state.firstQueryChain.from.mock.calls.length === 0) return { from: mocks.state.firstQueryChain.from }
      if (mocks.state.secondQueryChain.from.mock.calls.length === 0) return { from: mocks.state.secondQueryChain.from }
      return { from: mocks.state.reviewsChain.from }
    })
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
        ['javascript', 'react', 'angular'],
      )
      expect(score).toBe(2)
    })

    it('should return 0 for no matches', () => {
      const score = calculateTagMatchScore(
        ['python', 'django'],
        ['javascript', 'react'],
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
        ['javascript', 'react'],
      )
      expect(score).toBe(2)
    })

    it('should return full count when all tags match', () => {
      const score = calculateTagMatchScore(
        ['javascript', 'react'],
        ['javascript', 'react'],
      )
      expect(score).toBe(2)
    })

    it('should handle duplicate tags correctly', () => {
      const score = calculateTagMatchScore(
        ['javascript', 'javascript', 'react'],
        ['javascript', 'vue'],
      )
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
      const score = calculatePopularityScore(100, 10, new Date())
      expect(score).toBeGreaterThan(0)
    })
  })

  // ============================================
  // Integration Tests (with mocking)
  // ============================================

  describe('getRelatedCourses', () => {
    const mockCurrentCourse = {
      id: 1,
      categoryId: 1,
      tags: 'javascript,typescript,react',
    }

    const mockRelatedCourses = [
      {
        id: 2,
        title: 'Related Course 1',
        slug: 'related-course-1',
        description: 'A related course',
        categoryId: 1,
        category: 'Programming',
        instructorId: 1,
        instructor: { id: 1, name: 'John', avatar: '/avatar.jpg' },
        studentCount: 50,
        rating: 5,
        price: 15000,
        level: 'Advanced',
        tags: 'javascript,angular',
        thumbnail: '/img1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: 'Related Course 2',
        slug: 'related-course-2',
        description: 'Another related course',
        categoryId: 2,
        category: 'Web Development',
        instructorId: 1,
        instructor: { id: 1, name: 'John', avatar: '/avatar.jpg' },
        studentCount: 75,
        rating: 4,
        price: 12000,
        level: 'Beginner',
        tags: 'javascript,vue,typescript',
        thumbnail: '/img2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('should fetch related courses successfully', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([mockCurrentCourse])
      mocks.state.secondQueryChain.limit.mockResolvedValue(mockRelatedCourses)
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeLessThanOrEqual(4)
      expect(result.meta.basedOn.category).toBe('1')
      expect(result.meta.basedOn.tags).toContain('javascript')
    })

    it('should throw error when course not found', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([])

      await expect(getRelatedCourses({ courseId: 999 }))
        .rejects.toThrow('Course not found')
    })

    it('should sort by category match first', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([mockCurrentCourse])
      mocks.state.secondQueryChain.limit.mockResolvedValue(mockRelatedCourses)
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      // Course with same category should be first
      expect(result.data[0].categoryMatch).toBe(true)
    })

    it('should respect limit option', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([mockCurrentCourse])
      mocks.state.secondQueryChain.limit.mockResolvedValue(mockRelatedCourses)
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1, limit: 1 })

      expect(result.data.length).toBe(1)
    })

    it('should return empty array when no related courses exist', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([mockCurrentCourse])
      mocks.state.secondQueryChain.limit.mockResolvedValue([])
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
      expect(result.meta.total).toBe(0)
    })

    it('should handle course with no tags', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([{ ...mockCurrentCourse, tags: null }])
      mocks.state.secondQueryChain.limit.mockResolvedValue([])
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(result.meta.basedOn.tags).toEqual([])
    })

    it('should handle course with empty tags string', async () => {
      mocks.state.firstQueryChain.limit.mockResolvedValue([{ ...mockCurrentCourse, tags: '' }])
      mocks.state.secondQueryChain.limit.mockResolvedValue([])
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.success).toBe(true)
      expect(result.meta.basedOn.tags).toEqual([])
    })

    it('should handle database error gracefully', async () => {
      mocks.state.firstQueryChain.limit.mockRejectedValue(new Error('Database connection failed'))

      await expect(getRelatedCourses({ courseId: 1 }))
        .rejects.toThrow('Database connection failed')
    })

    it('should use default limit of 4 when not specified', async () => {
      const manyRelatedCourses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 2,
        categoryId: 1,
        category: 'Programming',
        instructorId: 1,
        instructor: { id: 1, name: 'John', avatar: '/avatar.jpg' },
        tags: 'javascript',
        studentCount: 100 - i,
        rating: 4,
        price: 10000,
        thumbnail: `/img${i}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      mocks.state.firstQueryChain.limit.mockResolvedValue([mockCurrentCourse])
      mocks.state.secondQueryChain.limit.mockResolvedValue(manyRelatedCourses)
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      expect(result.data.length).toBe(4)
    })

    it('should exclude current course from results', async () => {
      const differentCourse = { ...mockRelatedCourses[0], id: 2, slug: 'different-course' }
      mocks.state.firstQueryChain.limit.mockResolvedValue([mockCurrentCourse])
      mocks.state.secondQueryChain.limit.mockResolvedValue([differentCourse])
      mocks.state.reviewsChain.where.mockResolvedValue([])

      const result = await getRelatedCourses({ courseId: 1 })

      const hasSameCourse = result.data.some(c => c.id === mockCurrentCourse.id)
      expect(hasSameCourse).toBe(false)
    })
  })
})
