import { courses } from '../server/db/schema';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

async function addTagsToExistingCourses() {
  // Connect to the database
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './server/data/db.sqlite';
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite);

  // Sample tags to randomly assign
  const sampleTags = ['JavaScript', 'Python', 'React', 'Vue', 'UI/UX', 'WordPress', 'Angular', 'Node.js', 'TypeScript', 'CSS', 'HTML', 'MongoDB', 'Express', 'PostgreSQL', 'Docker'];

  try {
    // Get all courses
    const allCourses = await db.select({ id: courses.id }).from(courses);
    
    console.log(`Found ${allCourses.length} courses to update`);
    
    // Update each course with random tags
    for (const course of allCourses) {
      // Select 1-3 random tags for each course
      const randomTagCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
      const selectedTags = [];
      
      // To avoid duplicate tags for a single course
      const usedIndices = new Set();
      
      for (let i = 0; i < randomTagCount; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * sampleTags.length);
        } while (usedIndices.has(randomIndex));
        
        usedIndices.add(randomIndex);
        selectedTags.push(sampleTags[randomIndex]);
      }
      
      // Join tags with commas
      const tagsString = selectedTags.join(',');
      
      // Update the course with tags
      await db.update(courses).set({ tags: tagsString }).where(eq(courses.id, course.id));
      
      console.log(`Updated course ${course.id} with tags: ${tagsString}`);
    }
    
    console.log('Successfully updated all courses with tags');
  } catch (error) {
    console.error('Error updating courses with tags:', error);
  } finally {
    sqlite.close();
  }
}

// Run the function
addTagsToExistingCourses();