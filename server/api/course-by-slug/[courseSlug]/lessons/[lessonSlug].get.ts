import type { H3Event } from 'h3'
import { getRouterParam, setResponseStatus } from 'h3'
import { getDetailedCourseBySlug, getCourseLessons } from '~~/server/db/course-service'
import { getOptionalUser, hasLessonAccess } from '~~/server/utils/lesson-access'

function generateLessonSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

    const user = await getOptionalUser(event)
    const detailedCourseData = await getDetailedCourseBySlug(courseSlug)

    if (!detailedCourseData) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Course not found',
      }
    }

    const rawLessons = await getCourseLessons(detailedCourseData.id)
    const lessons = rawLessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug?.trim().toLowerCase() || generateLessonSlug(lesson.title),
      duration: lesson.duration || '00:00',
      videoUrl: lesson.videoUrl,
      content: lesson.description,
      isFree: lesson.isFree || false,
      sectionId: lesson.sectionId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }))

    const lesson = lessons.find(l =>
      l.slug?.trim().toLowerCase() === lessonSlug.trim().toLowerCase(),
    )

    if (!lesson) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Lesson not found',
      }
    }

    const hasAccess = await hasLessonAccess(
      user ? { id: user.id, role: user.role ?? 'student' } : null,
      detailedCourseData.id,
      lesson.isFree || false,
    )

    const currentLesson = {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.content,
      duration: lesson.duration,
      isFree: lesson.isFree || false,
      isLocked: !hasAccess,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      ...(hasAccess
        ? {
            videoUrl: lesson.videoUrl,
            content: lesson.content,
          }
        : {
            videoUrl: null,
            content: null,
          }),
    }

    return {
      success: true,
      data: {
        currentLesson,
      },
      hasAccess,
    }
  }
  catch (error: unknown) {
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch course or lesson',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})
