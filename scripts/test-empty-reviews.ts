import { getDetailedCourseBySlug } from '../server/db/course-service'

async function testEmptyReviews() {
  // Test courses that should have no reviews
  const courses = [
    'react-complete-guide',
    'nodejs-backend',
    'python-data-science',
  ]

  for (const slug of courses) {
    const course = await getDetailedCourseBySlug(slug)

    if (!course) {
      continue
    }

  }
}

testEmptyReviews()
  .finally(() => process.exit())
