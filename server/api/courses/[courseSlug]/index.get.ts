import { getDetailedCourseBySlug } from '../../../db/course-service'
import { getOptionalUser, checkEnrollment, checkIsInstructorOwner } from '~~/server/utils/lesson-access'

export default defineEventHandler(async (event) => {
  const courseSlug = getRouterParam(event, 'courseSlug')

  if (!courseSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Course slug is required',
    })
  }

  try {
    const course = await getDetailedCourseBySlug(courseSlug)

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Course not found',
      })
    }

    // Get optional user for access-based content sanitization
    const user = await getOptionalUser(event)
    const userForAccess = user ? { id: user.id, role: user.role ?? 'student' } : null

    // Pre-compute user access once for the entire course (not per lesson)
    let courseAccessGranted = false
    if (userForAccess) {
      if (userForAccess.role === 'admin' || userForAccess.role === 'superadmin') {
        courseAccessGranted = true
      }
      else {
        const enrolled = await checkEnrollment(userForAccess.id, course.id)
        if (enrolled) {
          courseAccessGranted = true
        }
        else if (userForAccess.role === 'instructor') {
          courseAccessGranted = await checkIsInstructorOwner(userForAccess.id, course.id)
        }
      }
    }

    // Sanitize courseContent: strip videoUrl and description for locked lessons
    const sanitizedCourseContent = (course.courseContent || []).map((section) => ({
      ...section,
      content: (section.content || []).map((lesson) => {
        const access = lesson.isFree || courseAccessGranted

        return {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          duration: lesson.duration,
          isFree: lesson.isFree,
          // Only expose sensitive content if user has access
          videoUrl: access ? lesson.videoUrl : null,
          description: access ? lesson.description : null,
        }
      }),
    }))

    return {
      success: true,
      data: {
        ...course,
        courseContent: sanitizedCourseContent,
      },
    }
  }
  catch (error: any) {
    console.error('Error fetching course:', error.message)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch course',
    })
  }
})