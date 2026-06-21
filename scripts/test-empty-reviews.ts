import { getDetailedCourseBySlug } from '../server/db/course-service'

async function testEmptyReviews() {
  // Test courses that should have no reviews
  const courses = [
    'react-complete-guide',
    'nodejs-backend',
    'python-data-science',
  ]

  console.log('🔍 Testing empty reviews state...\n')

  for (const slug of courses) {
    const course = await getDetailedCourseBySlug(slug)

    if (!course) {
      console.log(`❌ Course not found: ${slug}`)
      continue
    }

    console.log(`📚 ${course.title}`)
    console.log(`   Slug: ${slug}`)
    console.log(`   reviewsCount: ${course.reviewsCount}`)
    console.log(`   reviews:`, course.reviews)
    console.log(`   reviews type: ${typeof course.reviews}`)
    console.log(`   reviews is array: ${Array.isArray(course.reviews)}`)
    console.log(`   reviews length: ${course.reviews?.length}`)
    console.log(`   reviews === undefined: ${course.reviews === undefined}`)
    console.log(`   reviews === null: ${course.reviews === null}`)
    console.log(`   reviews === []: ${course.reviews?.length === 0}`)
    console.log('---\n')
  }
}

testEmptyReviews()
  .catch(console.error)
  .finally(() => process.exit())
