import type { H3Event } from 'h3'
import { getRouterParam, setResponseStatus } from 'h3'
import { getDetailedCourseBySlug } from '~~/server/db/course-service'
import { getOptionalUser, hasLessonAccess } from '~~/server/utils/lesson-access'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const courseSlug = getRouterParam(event, 'courseSlug')
    const lessonSlug = getRouterParam(event, 'lessonSlug')

    if (!courseSlug || !lessonSlug) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid course or lesson slug',
      }
    }

    // Get optional user (doesn't require auth)
    const user = await getOptionalUser(event)

    const detailedCourseData = await getDetailedCourseBySlug(courseSlug)

    if (!detailedCourseData) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Course not found',
      }
    }

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

    // Find the lesson based on the lesson slug
    const lesson = lessons.find(l => l.slug === lessonSlug)

    if (!lesson) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Lesson not found',
      }
    }

    // Check if user has access to this lesson
    const hasAccess = await hasLessonAccess(
      user?.id || null,
      detailedCourseData.id,
      lesson.isFree || false,
    )

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
    console.error('Failed to fetch course or lesson:', error)

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch course or lesson',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})