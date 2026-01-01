import { db } from '../server/db/index'
import { instructors } from '../server/db/schema'

const sampleInstructors = [
  {
    id: 1,
    name: 'Ali Ahmadi',
    email: 'ali@example.com',
    bio: 'Senior Frontend Developer with 10+ years of experience',
    title: 'Senior Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Sara Mohammadi',
    email: 'sara@example.com',
    bio: 'Full Stack Developer and Tech Lead',
    title: 'Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Reza Karimi',
    email: 'reza@example.com',
    bio: 'DevOps Engineer and Cloud Architect',
    title: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Mina Hosseini',
    email: 'mina@example.com',
    bio: 'Data Scientist and ML Expert',
    title: 'Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
]

async function main() {
  console.log('Adding instructors...')

  for (const instructor of sampleInstructors) {
    try {
      await db.insert(instructors).values({
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        bio: instructor.bio,
        title: instructor.title,
        avatar: instructor.avatar,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: instructors.id,
        set: {
          name: instructor.name,
          avatar: instructor.avatar,
          bio: instructor.bio,
          title: instructor.title,
          updatedAt: new Date(),
        },
      })
      console.log(`✅ Added/Updated: ${instructor.name}`)
    } catch (error) {
      console.error(`❌ Error adding ${instructor.name}:`, error)
    }
  }

  console.log('\nDone!')
}

main().then(() => process.exit(0))