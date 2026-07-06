import { getDetailedCourseBySlug } from '~~/server/db/course-service'
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

    const user = await getOptionalUser(event)
    if (!user) {
      setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=60')
    }
    else {
      setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, private')
    }
    const userForAccess = user ? { id: user.id, role: user.role ?? 'student' } : null

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

    const sanitizedCourseContent = (course.courseContent || []).map(section => ({
      ...section,
      content: (section.content || []).map((lesson) => {
        const access = lesson.isFree || courseAccessGranted

        return {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          duration: lesson.duration,
          isFree: lesson.isFree,
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
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch course',
    })
  }
})
