import { getDetailedCourseBySlug } from '../server/db/course-service'

async function debugCourseAPI() {
  const slug = process.argv[2] || 'introduction-to-web-development' // Course slug from command line


  const course = await getDetailedCourseBySlug(slug)

  if (!course) {
    return
  }



  if (course.reviews && course.reviews.length > 0) {
  }
  else {
  }

  // Full response
}

debugCourseAPI()
  .finally(() => process.exit())
