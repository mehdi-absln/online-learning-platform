import type { H3Event } from 'h3'
import { getRouterParam, setResponseStatus } from 'h3'
import { getDetailedCourseBySlug } from '~~/server/db/course-service'
import { getOptionalUser, hasLessonAccess } from '~~/server/utils/lesson-access'

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log('🔵 [API] Fetching detailed course and lesson by slug...')
    const courseSlug = getRouterParam(event, 'slug')
    const lessonSlug = getRouterParam(event, 'lessonSlug')

    console.log('📝 [API] Course slug:', courseSlug)
    console.log('📝 [API] Lesson slug:', lessonSlug)

    if (!courseSlug || !lessonSlug) {
      console.error('❌ [API] Invalid slugs')
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid course or lesson slug',
      }
    }

    // Get optional user (doesn't require auth)
    const user = await getOptionalUser(event)
    console.log('👤 [API] User:', user ? { id: user.id, username: user.username } : 'Anonymous')

    console.log('🔍 [API] Fetching course data from DB...')
    const detailedCourseData = await getDetailedCourseBySlug(courseSlug)

    if (!detailedCourseData) {
      console.error('❌ [API] Course not found:', courseSlug)
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Course not found',
      }
    }

    console.log('✅ [API] Course data retrieved:', {
      courseId: detailedCourseData.id,
      courseTitle: detailedCourseData.title,
      lessonsCount: detailedCourseData.courseContent?.reduce((acc, s) => acc + s.content.length, 0) || 0,
    })

    // Build lessons array from courseContent
    const lessons = detailedCourseData.courseContent?.flatMap(section =>
      section.content.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        content: lesson.description,
        isFree: lesson.isFree,
        sectionId: section.id,
      })),
    ) || []

    console.log('📚 [API] Lessons extracted:', lessons.length)

    // Find the lesson based on the lesson slug
    const lesson = lessons.find(l => l.slug === lessonSlug)
    console.log('🔍 [API] Lesson found:', lesson
      ? {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          isFree: lesson.isFree,
        }
      : 'NOT FOUND')

    if (!lesson) {
      console.error('❌ [API] Lesson not found:', lessonSlug)
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Lesson not found',
      }
    }

    // Check if user has access to this lesson
    console.log('🔐 [API] Checking access control...')
    const hasAccess = await hasLessonAccess(
      user?.id || null,
      detailedCourseData.id,
      lesson.isFree || false,
    )
    console.log('✅ [API] Access check:', { hasAccess, isFree: lesson.isFree, isEnrolled: hasAccess && !lesson.isFree })

    // Return lesson data - strip videoUrl and content if not accessible
    return {
      success: true,
      data: {
        ...detailedCourseData,
        currentLesson: {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.content,
          duration: lesson.duration,
          isFree: lesson.isFree || false,
          isLocked: !hasAccess,
          // Only include videoUrl and content if user has access
          ...(hasAccess
            ? {
                videoUrl: lesson.videoUrl,
                content: lesson.content,
              }
            : {
                videoUrl: null,
                content: null,
              }),
        },
      },
      courseId: detailedCourseData.id,
      lessonId: lesson.id,
      hasAccess,
    }
  }
  catch (error: unknown) {
    console.error(`Detailed error in GET /api/courses/slug/[slug]/lessons/[lessonSlug]:`, error)
    console.error('Error name:', (error as Error).name)
    console.error('Error message:', (error as Error).message)
    console.error('Error stack:', (error as Error).stack)

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch course or lesson',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
