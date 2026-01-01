import { getDetailedCourseBySlug } from '../../../db/course-service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  try {
    console.log('\n========================================')
    console.log('🌐 API Request: /api/courses/slug/' + slug)
    console.log('========================================')

    const course = await getDetailedCourseBySlug(slug)

    if (!course) {
      console.log('❌ Course not found for slug:', slug)
      throw createError({
        statusCode: 404,
        statusMessage: 'Course not found',
      })
    }

    console.log('✅ Returning course:', course.title)
    console.log('📊 courseContent sections:', course.courseContent?.length || 0)
    console.log('📊 Total lessons:', course.courseContent?.reduce((acc, s) => acc + s.content.length, 0) || 0)
    console.log('========================================\n')

    return {
      success: true,
      data: course,
    }
  } catch (error: any) {
    console.error('❌ Error fetching course:', error.message)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch course',
    })
  }
})
