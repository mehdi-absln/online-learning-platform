import { getDetailedCourseBySlug } from '../server/db/course-service'

async function debugCourseAPI() {
  const slug = process.argv[2] || 'introduction-to-web-development' // Course slug from command line

  console.log(`🔍 Fetching course: ${slug}\n`)

  const course = await getDetailedCourseBySlug(slug)

  if (!course) {
    console.log('❌ Course not found!')
    return
  }

  console.log('✅ Course found:', course.title)
  console.log('\n📊 Course data structure:')
  console.log({
    id: course.id,
    title: course.title,
    reviewsCount: course.reviewsCount,
    hasReviews: !!course.reviews,
    reviewsLength: course.reviews?.length || 0,
  })

  if (course.reviews && course.reviews.length > 0) {
    console.log('\n✅ Reviews found:', course.reviews.length)
    console.log('\n📋 First review:')
    console.log(JSON.stringify(course.reviews[0], null, 2))
  }
  else {
    console.log('\n⚠️  No reviews in response!')
  }

  // Full response
  console.log('\n📦 Full course object (reviews only):')
  console.log(JSON.stringify({ reviews: course.reviews }, null, 2))
}

debugCourseAPI()
  .catch(console.error)
  .finally(() => process.exit())
